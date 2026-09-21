import { toArabicNumerals } from './i18n';

export const formatCurrency = (amount: number, language: string = 'English'): string => {
  const isAr = language === 'العربية';
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  if (isAr) {
    return `${toArabicNumerals(formatted)} ر.س`;
  }
  return `SAR ${formatted}`;
};

export const generateUTR = (): string => {
  return 'SARIE' + Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

export const generateTxnId = (): string => {
  return 'SAR' + Math.floor(10000000000 + Math.random() * 90000000000).toString();
};

export const formatDate = (date: Date, language: string = 'English'): string => {
  const isAr = language === 'العربية';
  if (isAr) {
    return new Intl.DateTimeFormat('ar-SA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};
