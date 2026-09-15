import React from 'react';
import { AppProvider, useApp } from './state/AppContext';
import { BottomNavigation } from './components/BottomNavigation';

// Auth / Onboarding Screens
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { MobileNumberScreen } from './screens/MobileNumberScreen';
import { SmsOtpScreen } from './screens/SmsOtpScreen';
import { PermissionsScreen } from './screens/PermissionsScreen';

// Merchant Core Screens
import { MerchantHomeScreen } from './screens/MerchantHomeScreen';
import { MerchantSetupScreen } from './screens/MerchantSetupScreen';
import { MerchantSettlementBankScreen } from './screens/MerchantSettlementBankScreen';
import { MerchantPinSetupScreen } from './screens/MerchantPinSetupScreen';
import { SoftPOSTerminalScreen } from './screens/SoftPOSTerminalScreen';
import { TapCardScreen } from './screens/TapCardScreen';
import { MerchantPaymentReceivedScreen } from './screens/MerchantPaymentReceivedScreen';
import { MerchantQrGeneratorScreen } from './screens/MerchantQrGeneratorScreen';
import { PaymentLinkGeneratorScreen } from './screens/PaymentLinkGeneratorScreen';
import { SoundBoxNotifierScreen } from './screens/SoundBoxNotifierScreen';
import { MerchantCollectionsScreen } from './screens/MerchantCollectionsScreen';
import { MerchantWebLayoutScreen } from './screens/MerchantWebLayoutScreen';

// Merchant Settings Screens
import { HistoryScreen } from './screens/HistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { BankAccountsScreen } from './screens/BankAccountsScreen';
import { SecurityScreen } from './screens/SecurityScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { HelpSupportScreen } from './screens/HelpSupportScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';

// Modals
import { LanguageModal } from './screens/LanguageModal';
import { LogoutModal } from './screens/LogoutModal';
import { AddBankModal } from './screens/AddBankModal';
import { AppLinksModal } from './screens/AppLinksModal';
import { EditProfileModal } from './screens/EditProfileModal';
import { KycModal } from './screens/KycModal';

const AppContent: React.FC = () => {
  const { currentScreen, isRtl } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      // Auth / Onboarding
      case 'SPLASH':
        return <SplashScreen />;
      case 'ONBOARDING':
        return <OnboardingScreen />;
      case 'MOBILE_NUMBER':
        return <MobileNumberScreen />;
      case 'SMS_OTP':
        return <SmsOtpScreen />;
      case 'PERMISSIONS':
        return <PermissionsScreen />;

      // Merchant Core
      case 'MERCHANT_HOME':
        return <MerchantHomeScreen />;
      case 'MERCHANT_SETUP':
        return <MerchantSetupScreen />;
      case 'MERCHANT_BANK_LINK':
        return <MerchantSettlementBankScreen />;
      case 'MERCHANT_PIN_SETUP':
        return <MerchantPinSetupScreen />;
      case 'SOFTPOS_TERMINAL':
        return <SoftPOSTerminalScreen />;
      case 'SOFTPOS_TAP':
        return <TapCardScreen />;
      case 'MERCHANT_PAYMENT_SUCCESS':
        return <MerchantPaymentReceivedScreen />;
      case 'MERCHANT_QR_GENERATOR':
        return <MerchantQrGeneratorScreen />;
      case 'PAYMENT_LINK_GENERATOR':
        return <PaymentLinkGeneratorScreen />;
      case 'SOUNDBOX_NOTIFIER':
        return <SoundBoxNotifierScreen />;
      case 'MERCHANT_COLLECTIONS':
        return <MerchantCollectionsScreen />;
      case 'MERCHANT_WEB':
        return <MerchantWebLayoutScreen />;

      // Settings
      case 'HISTORY':
        return <HistoryScreen />;
      case 'PROFILE':
        return <ProfileScreen />;
      case 'BANK_ACCOUNTS':
        return <BankAccountsScreen />;
      case 'SECURITY':
        return <SecurityScreen />;
      case 'NOTIFICATIONS':
        return <NotificationsScreen />;
      case 'HELP_SUPPORT':
        return <HelpSupportScreen />;
      case 'PRIVACY':
        return <PrivacyScreen />;

      default:
        return <MerchantHomeScreen />;
    }
  };

  const showBottomNav =
    currentScreen !== 'SPLASH' &&
    currentScreen !== 'ONBOARDING' &&
    currentScreen !== 'MOBILE_NUMBER' &&
    currentScreen !== 'SMS_OTP' &&
    currentScreen !== 'PERMISSIONS' &&
    currentScreen !== 'MERCHANT_SETUP' &&
    currentScreen !== 'MERCHANT_BANK_LINK' &&
    currentScreen !== 'MERCHANT_PIN_SETUP' &&
    currentScreen !== 'SOFTPOS_TAP' &&
    currentScreen !== 'MERCHANT_PAYMENT_SUCCESS' &&
    currentScreen !== 'MERCHANT_WEB';

  return (
    <div className={`app-viewport ${isRtl ? 'rtl' : ''}`}>
      {/* Scrollable Main Screen Container */}
      <div className="screen-content">{renderScreen()}</div>

      {/* Global Fixed Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}

      {/* Bottom Sheet Modals */}
      <LanguageModal />
      <LogoutModal />
      <AddBankModal />
      <AppLinksModal />
      <EditProfileModal />
      <KycModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
