import type { Transaction } from '../types';

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Saudi Electricity Company (SEC)',
    subTitle: 'Utility Bill Payment',
    amount: 620.5,
    type: 'sent',
    date: 'TODAY',
    timestamp: new Date(),
    utr: 'SARIE984729104821',
    avatarInitials: 'SEC',
  },
  {
    id: 'tx-2',
    title: 'Tariq Al-Otaibi',
    subTitle: 'Sarie Instant Transfer',
    amount: 450.0,
    type: 'sent',
    date: 'TODAY',
    timestamp: new Date(Date.now() - 3600000),
    utr: 'SARIE192847291024',
    avatarInitials: 'TO',
  },
  {
    id: 'tx-3',
    title: 'Panda Supermarket',
    subTitle: 'Debit Card POS Payment',
    amount: 184.25,
    type: 'sent',
    date: 'TODAY',
    timestamp: new Date(Date.now() - 7200000),
    utr: 'SARIE384910294812',
    avatarInitials: 'PS',
  },
  {
    id: 'tx-4',
    title: 'Sara Al-Mansoor',
    subTitle: 'Sarie Transfer',
    amount: 120.0,
    type: 'sent',
    date: 'TODAY',
    timestamp: new Date(Date.now() - 10800000),
    utr: 'SARIE784910294112',
    avatarInitials: 'SM',
  },
  {
    id: 'tx-5',
    title: 'Half Million Coffee',
    subTitle: 'Card Contactless',
    amount: 28.0,
    type: 'sent',
    date: 'YESTERDAY',
    timestamp: new Date(Date.now() - 86400000),
    utr: 'SARIE224910294812',
    avatarInitials: 'HM',
  },
  {
    id: 'tx-6',
    title: 'Mohammed Al-Ghamdi',
    subTitle: 'Salary / Sarie Received',
    amount: 5400.0,
    type: 'received',
    date: 'YESTERDAY',
    timestamp: new Date(Date.now() - 90000000),
    utr: 'SARIE998491029481',
    avatarInitials: 'MG',
  },
];

export const transactionService = {
  async getInitialTransactions(): Promise<Transaction[]> {
    return [...INITIAL_TRANSACTIONS];
  },
};
