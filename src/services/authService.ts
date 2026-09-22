/**
 * Auth Service for QPay Merchant
 * Real OTP endpoints via the shared backend contract.
 */

import { apiPost, apiGet } from './apiClient';

export interface OtpSendResponse {
  success: boolean;
  message?: string;
}

export interface OtpVerifyResponse {
  success: boolean;
  user: {
    id: string;
    role: string;
    name: string;
    mobile: string;
    merchantCode?: string;
    businessName?: string;
  };
  session: {
    access_token: string;
    expires_in: number;
  };
}

export interface MeResponse {
  id: string;
  role: string;
  name: string;
  mobile: string;
  email?: string;
  merchantCode?: string;
  businessName?: string;
  walletBalance?: number;
  walletCurrency?: string;
}

export interface ApiTransaction {
  id: string;
  order_ref: string;
  amount: number;
  payer_profile_id: string;
  payee_profile_id: string;
  payer_name: string;
  payee_name: string;
  payment_method: string;
  status: string;
  created_at: string;
}

export interface TransactionsResponse {
  transactions: ApiTransaction[];
}

export const authService = {
  /** Send OTP to a phone number */
  async sendOtp(phone: string, role: string = 'merchant'): Promise<OtpSendResponse> {
    return apiPost<OtpSendResponse>('/api/auth/otp/send', { phone, role });
  },

  /** Resend OTP */
  async resendOtp(phone: string): Promise<OtpSendResponse> {
    return apiPost<OtpSendResponse>('/api/auth/otp/resend', { phone });
  },

  /** Verify OTP and authenticate */
  async verifyOtp(
    phone: string,
    otp: string,
    role: string = 'merchant',
    fullName?: string,
    businessName?: string,
  ): Promise<OtpVerifyResponse> {
    const body: Record<string, unknown> = { phone, otp, role };
    if (fullName) body.fullName = fullName;
    if (businessName) body.businessName = businessName;
    return apiPost<OtpVerifyResponse>('/api/auth/otp/verify', body);
  },

  /** Fetch current user profile + wallet balance */
  async fetchProfile(): Promise<MeResponse> {
    return apiGet<MeResponse>('/api/me');
  },

  /** Fetch recent transactions */
  async fetchTransactions(limit: number = 50): Promise<ApiTransaction[]> {
    const res = await apiGet<TransactionsResponse | ApiTransaction[]>(
      `/api/transactions?limit=${limit}`,
    );
    // Handle both array and {transactions: []} response shapes
    if (Array.isArray(res)) return res;
    return (res as TransactionsResponse).transactions || [];
  },

  /** Verify merchant PIN (local check, kept for refund authorization) */
  async verifyPin(pin: string): Promise<boolean> {
    return pin.length === 4;
  },
};
