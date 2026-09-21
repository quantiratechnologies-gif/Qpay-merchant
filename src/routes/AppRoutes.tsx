import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Auth / Onboarding
import { SplashScreen } from '../features/auth/SplashScreen';
import { OnboardingScreen } from '../features/auth/OnboardingScreen';
import { MobileNumberScreen } from '../features/auth/MobileNumberScreen';
import { SmsOtpScreen } from '../features/auth/SmsOtpScreen';
import { PermissionsScreen } from '../features/auth/PermissionsScreen';

// Merchant Core
import { MerchantHomeScreen } from '../features/merchant-core/MerchantHomeScreen';
import { MerchantSetupScreen } from '../features/merchant-core/MerchantSetupScreen';
import { MerchantSettlementBankScreen } from '../features/merchant-core/MerchantSettlementBankScreen';
import { MerchantPinSetupScreen } from '../features/merchant-core/MerchantPinSetupScreen';
import { MerchantQrGeneratorScreen } from '../features/merchant-core/MerchantQrGeneratorScreen';
import { PaymentLinkGeneratorScreen } from '../features/merchant-core/PaymentLinkGeneratorScreen';
import { MerchantCollectionsScreen } from '../features/merchant-core/MerchantCollectionsScreen';
import { MerchantInsightsScreen } from '../features/merchant-core/MerchantInsightsScreen';

// SoftPOS
import { SoftPOSTerminalScreen } from '../features/softpos/SoftPOSTerminalScreen';
import { TapCardScreen } from '../features/softpos/TapCardScreen';
import { MerchantPaymentReceivedScreen } from '../features/softpos/MerchantPaymentReceivedScreen';
import { SoundBoxNotifierScreen } from '../features/softpos/SoundBoxNotifierScreen';

// Settings
import { HistoryScreen } from '../features/settings/HistoryScreen';
import { ProfileScreen } from '../features/settings/ProfileScreen';
import { BankAccountsScreen } from '../features/settings/BankAccountsScreen';
import { SecurityScreen } from '../features/settings/SecurityScreen';
import { NotificationsScreen } from '../features/settings/NotificationsScreen';
import { HelpSupportScreen } from '../features/settings/HelpSupportScreen';
import { PrivacyScreen } from '../features/settings/PrivacyScreen';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/mobile-number" element={<MobileNumberScreen />} />
        <Route path="/sms-otp" element={<SmsOtpScreen />} />
        <Route path="/permissions" element={<PermissionsScreen />} />
        <Route path="/merchant-setup" element={<MerchantSetupScreen />} />
        <Route path="/merchant-bank-link" element={<MerchantSettlementBankScreen />} />
        <Route path="/merchant-pin-setup" element={<MerchantPinSetupScreen />} />
        <Route path="/softpos-tap" element={<TapCardScreen />} />
        <Route path="/merchant-payment-success" element={<MerchantPaymentReceivedScreen />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/home" element={<MerchantHomeScreen />} />
        <Route path="/softpos-terminal" element={<SoftPOSTerminalScreen />} />
        <Route path="/merchant-qr-generator" element={<MerchantQrGeneratorScreen />} />
        <Route path="/payment-link-generator" element={<PaymentLinkGeneratorScreen />} />
        <Route path="/soundbox-notifier" element={<SoundBoxNotifierScreen />} />
        <Route path="/merchant-collections" element={<MerchantCollectionsScreen />} />
        <Route path="/merchant-insights" element={<MerchantInsightsScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/bank-accounts" element={<BankAccountsScreen />} />
        <Route path="/security" element={<SecurityScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/help-support" element={<HelpSupportScreen />} />
        <Route path="/privacy" element={<PrivacyScreen />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
