import type { BankAccount } from '../types';

const INITIAL_BANKS: BankAccount[] = [
  {
    id: 'bank-1',
    bankName: 'Al Rajhi Bank',
    accountType: 'Current Account',
    accountNumberMasked: 'SA03 •••• 4821',
    isPrimary: true,
    balance: 84520.5,
    showBalance: false,
  },
  {
    id: 'bank-2',
    bankName: 'Saudi National Bank (SNB)',
    accountType: 'Current Account',
    accountNumberMasked: 'SA44 •••• 9120',
    isPrimary: false,
    balance: 34200.0,
    showBalance: false,
  },
  {
    id: 'bank-3',
    bankName: 'Riyad Bank',
    accountType: 'Savings Account',
    accountNumberMasked: 'SA22 •••• 6540',
    isPrimary: false,
    balance: 18910.75,
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
