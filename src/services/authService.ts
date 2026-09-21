import type { User } from '../types';

export const authService = {
  async getCurrentUser(): Promise<User> {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('qpay_merchant_user') || localStorage.getItem('qpay_merchant_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.user || parsed;
        } catch (e) {}
      }
    }
    return {
      name: '',
      avatarInitials: '',
      upiId: '',
      mobile: '',
      email: '',
    };
  },
  async verifyPin(pin: string): Promise<boolean> {
    return pin.length === 4;
  },
};
