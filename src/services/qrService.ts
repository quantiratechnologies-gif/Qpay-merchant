export const qrService = {
  getUpiQrString(upiId: string, name: string, amount?: number): string {
    let url = `sarie://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&cu=SAR`;
    if (amount) {
      url += `&am=${amount}`;
    }
    return url;
  },
};
