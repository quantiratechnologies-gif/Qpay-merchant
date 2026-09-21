import { generateTxnId, generateUTR } from '../utils/formatters';
import type { Transaction } from '../types';

export const paymentService = {
  async processPayment(params: {
    payeeName: string;
    amount: number;
    subTitle?: string;
    category?: string;
    avatarInitials?: string;
  }): Promise<Transaction> {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const txn: Transaction = {
      id: generateTxnId(),
      title: params.payeeName,
      subTitle: params.subTitle || 'UPI Payment',
      amount: params.amount,
      type: 'sent',
      date: 'TODAY',
      timestamp: new Date(),
      utr: generateUTR(),
      category: params.category || 'Payment',
      avatarInitials: params.avatarInitials || params.payeeName.substring(0, 2).toUpperCase(),
    };

    return txn;
  },
};
