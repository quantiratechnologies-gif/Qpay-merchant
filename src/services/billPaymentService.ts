import type { ElectricityBill } from '../types';

export const billPaymentService = {
  async fetchElectricityBill(consumerNumber: string): Promise<ElectricityBill> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      consumerNumber: consumerNumber || '1002938475',
      providerName: 'Saudi Electricity Company (SEC)',
      amount: 620.5,
      dueDate: '2026-09-28',
      billDate: '2026-09-01',
      isPaid: false,
    };
  },
};
