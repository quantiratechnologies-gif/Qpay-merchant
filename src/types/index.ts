export interface User {
  name: string;
  avatarInitials: string;
  avatarUrl?: string;
  avatarBgColor?: string;
  upiId: string;
  mobile: string;
  email: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  accountNumberMasked: string;
  isPrimary: boolean;
  balance: number;
  showBalance?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  upiId: string;
  mobile: string;
  avatarInitials: string;
  isMerchant?: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  subTitle?: string;
  amount: number;
  type: 'sent' | 'received' | 'pending';
  date: string;
  timestamp: Date;
  utr: string;
  accountUsed?: string;
  category?: string;
  avatarInitials?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'success' | 'info' | 'alert';
}

export interface ElectricityBill {
  consumerNumber: string;
  providerName: string;
  amount: number;
  dueDate: string;
  billDate: string;
  isPaid: boolean;
}

export interface MoneyRequest {
  id: string;
  requesterName: string;
  upiId: string;
  amount: number;
  note?: string;
  date: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface DeviceSession {
  id: string;
  deviceName: string;
  deviceType: 'mobile' | 'browser';
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export type UserRole = 'customer' | 'merchant';

export interface MerchantInfo {
  businessName: string;
  category: string;
  city: string;
  crNumber: string;
  vatNumber: string;
  nationalId: string;
  isKycVerified: boolean;
  settlementBank: string;
  settlementIban: string;
  merchantPin: string;
  terminalId: string;
  storePhone: string;
}

export type PaymentAcceptanceMethod =
  | 'softpos_mada'
  | 'softpos_visa'
  | 'softpos_mastercard'
  | 'softpos_applepay'
  | 'zatca_qr'
  | 'payment_link';

export interface MerchantCollection {
  id: string;
  orderRef: string;
  amount: number; // Gross SAR
  vatAmount: number; // 15% ZATCA VAT
  netAmount: number; // SAR without VAT
  paymentMethod: PaymentAcceptanceMethod;
  cardLast4?: string;
  customerMasked?: string;
  date: string;
  timestamp: Date;
  status: 'settled' | 'refunded';
  zatcaQrCode?: string;
}

export interface CashierInfo {
  id: string;
  name: string;
  role: 'Manager' | 'Cashier' | 'Supervisor';
  pin: string;
  active: boolean;
  terminal: string;
}

export type ScreenId =
  | 'SPLASH'
  | 'ONBOARDING'
  | 'MOBILE_NUMBER'
  | 'SMS_OTP'
  | 'PERMISSIONS'
  | 'HOME'
  | 'PAY_ANYONE'
  | 'SEND_AMOUNT'
  | 'ELECTRICITY'
  | 'PAYMENT_SUCCESS'
  | 'HISTORY'
  | 'RECEIVE'
  | 'SCAN'
  | 'REQUEST_MONEY'
  | 'PROFILE'
  | 'BANK_ACCOUNTS'
  | 'UPI_SETTINGS'
  | 'PAYMENT_METHODS'
  | 'SECURITY'
  | 'NOTIFICATIONS'
  | 'ALL_SERVICES'
  | 'MONEY_REQUESTS'
  | 'HELP_SUPPORT'
  | 'PRIVACY'
  | 'SHOPPING'
  | 'MESSAGES'
  | 'TRAVEL'
  | 'REWARDS'
  | 'FOOD'
  // Merchant Ecosystem Screens
  | 'MERCHANT_HOME'
  | 'MERCHANT_SETUP'
  | 'MERCHANT_BANK_LINK'
  | 'MERCHANT_PIN_SETUP'
  | 'SOFTPOS_TERMINAL'
  | 'SOFTPOS_TAP'
  | 'MERCHANT_PAYMENT_SUCCESS'
  | 'MERCHANT_QR_GENERATOR'
  | 'PAYMENT_LINK_GENERATOR'
  | 'SOUNDBOX_NOTIFIER'
  | 'MERCHANT_COLLECTIONS'
  | 'MERCHANT_WEB';

export type BottomTab = 'home' | 'account' | 'pay' | 'scan' | 'history' | 'profile';

