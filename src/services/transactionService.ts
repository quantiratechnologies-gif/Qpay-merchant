import type { Transaction } from '../types';

export const transactionService = {
  async getInitialTransactions(): Promise<Transaction[]> {
    return [];
  },
};
