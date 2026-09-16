import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quantira.qpaymerchant',
  appName: 'QPay Merchant',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
