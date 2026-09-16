import type { BankAccount } from '../types';

const INITIAL_BANKS: BankAccount[] = [
  {
    id: 'bank-1',
    bankName: 'Al Rajhi Bank',
    accountType: 'Corporate Settlement Account',
    accountNumberMasked: 'SA55 •••• 5005',
    isPrimary: true,
    balance: 84520.5,
    showBalance: false,
  },
];

export const bankService = {
  async getBankAccounts(): Promise<BankAccount[]> {
    return [...INITIAL_BANKS];
  },

  async addBankAccount(bankName: string): Promise<BankAccount> {
    const maskedAcc = 'SA' + Math.floor(10 + Math.random() * 89).toString() + ' •••• ' + Math.floor(1000 + Math.random() * 9000).toString();
    return {
      id: `bank-${Date.now()}`,
      bankName,
      accountType: 'Current Account',
      accountNumberMasked: maskedAcc,
      isPrimary: false,
      balance: Math.floor(5000 + Math.random() * 45000),
      showBalance: false,
    };
  },
};
