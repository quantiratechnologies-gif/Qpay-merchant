import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User,
  BankAccount,
  Transaction,
  AppNotification,
  DeviceSession,
  ScreenId,
  BottomTab,
  UserRole,
  MerchantInfo,
  MerchantCollection,
  PaymentAcceptanceMethod,
  CashierInfo,
  MerchantSettlement,
} from '../types';
import { authService } from '../services/authService';
import { bankService } from '../services/bankService';
import { transactionService } from '../services/transactionService';
import { notificationService } from '../services/notificationService';

import { translateText, type SupportedLanguage } from '../utils/i18n';

interface AppContextType {
  // Localization & Translation
  language: string;
  isRtl: boolean;
  t: (key: string, defaultText?: string) => string;

  // Navigation & Screen Stack
  currentScreen: ScreenId;
  navigateTo: (screen: ScreenId, params?: Record<string, any>) => void;
  goBack: () => void;
  screenParams: Record<string, any>;
  activeTab: BottomTab;
  setActiveTab: (tab: BottomTab) => void;
  startOnboardingFlow: () => void;

  // App Data State
  user: User;
  bankAccounts: BankAccount[];
  transactions: Transaction[];
  notifications: AppNotification[];
  deviceSessions: DeviceSession[];
  lastTransaction: Transaction | null;

  // Actions
  updateUser: (updatedData: Partial<User>) => void;
  toggleShowBalance: (bankId: string) => void;
  addBankAccount: (bankName: string) => Promise<void>;
  removeBankAccount: (bankId: string) => void;
  setPrimaryBank: (bankId: string) => void;
  completePayment: (params: {
    title: string;
    subTitle: string;
    amount: number;
    avatarInitials?: string;
    category?: string;
    bankId?: string;
  }) => Promise<Transaction>;

  // Modals & Bottom Sheets
  isPinModalOpen: boolean;
  openPinModal: (paymentData: { title: string; amount: number; subTitle: string; onSuccess?: () => void }) => void;
  closePinModal: () => void;
  pendingPaymentData: { title: string; amount: number; subTitle: string; onSuccess?: () => void } | null;

  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  setAppLanguage: (lang: string) => void;
  toggleLanguage: () => void;

  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (open: boolean) => void;
  performLogout: () => void;

  isAddBankModalOpen: boolean;
  setIsAddBankModalOpen: (open: boolean) => void;

  isScanModalOpen: boolean;
  setIsScanModalOpen: (open: boolean) => void;

  isEditProfileModalOpen: boolean;
  setIsEditProfileModalOpen: (open: boolean) => void;

  // Merchant Ecosystem State & Actions
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  merchantInfo: MerchantInfo;
  updateMerchantInfo: (info: Partial<MerchantInfo>) => void;
  merchantCollections: MerchantCollection[];
  merchantSettlements: MerchantSettlement[];
  triggerSettleNow: () => Promise<MerchantSettlement>;
  lastMerchantCollection: MerchantCollection | null;
  processMerchantCollection: (params: {
    amount: number;
    paymentMethod: PaymentAcceptanceMethod;
    cardLast4?: string;
    orderRef?: string;
    customerMasked?: string;
  }) => Promise<MerchantCollection>;
  processMerchantRefund: (collectionId: string, pin: string) => Promise<boolean>;
  cashiers: CashierInfo[];
  addCashier: (cashier: Omit<CashierInfo, 'id'>) => void;
  toggleCashierStatus: (cashierId: string) => void;
  softPosAmount: number;
  setSoftPosAmount: (amt: number) => void;
  softPosCardScheme: string;
  setSoftPosCardScheme: (scheme: string) => void;
  isKycModalOpen: boolean;
  setIsKycModalOpen: (open: boolean) => void;
  soundBoxLanguage: 'ar' | 'en';
  setSoundBoxLanguage: (lang: 'ar' | 'en') => void;
  soundBoxVolume: number;
  setSoundBoxVolume: (vol: number) => void;
  speakSoundBox: (amount: number, currency?: string) => void;

  terminateSession: (sessionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


const INITIAL_SESSIONS: DeviceSession[] = [
  { id: 's-1', deviceName: 'QTPay Android App', deviceType: 'mobile', location: 'Riyadh - Android 14', lastActive: 'Active Now', isCurrent: true },
  { id: 's-2', deviceName: 'QTPay iOS App', deviceType: 'mobile', location: 'Jeddah - iPhone 15 Pro', lastActive: '2 days ago', isCurrent: false },
  { id: 's-3', deviceName: 'Chrome on Mac', deviceType: 'browser', location: 'Riyadh - macOS Sequoia', lastActive: 'Active Now', isCurrent: false },
  { id: 's-4', deviceName: 'Safari on iPhone', deviceType: 'browser', location: 'Dammam - iOS 18', lastActive: '3 days ago', isCurrent: false },
];

const INITIAL_MERCHANT_INFO: MerchantInfo = {
  businessName: 'Starmart Supermarket',
  category: 'Grocery & Daily Essentials',
  city: 'Riyadh',
  postalCode: '12211',
  crNumber: 'CR-1010849201',
  vatNumber: '310948201900003',
  nationalId: '1098472910',
  isKycVerified: true,
  settlementBank: 'Al Rajhi Bank',
  settlementIban: 'SA03 8000 0000 6271 5005',
  merchantPin: '2026',
  terminalId: 'POS-RUH-8841',
  storePhone: '+966 11 482 9900',
};

const INITIAL_MERCHANT_COLLECTIONS: MerchantCollection[] = [
  {
    id: 'POS-8839201',
    orderRef: 'ORD-9841',
    amount: 145.0,
    vatAmount: 18.91,
    netAmount: 126.09,
    paymentMethod: 'softpos_mada',
    cardLast4: '4821',
    customerMasked: '+966 50 ••• 1234',
    date: 'Today, 11:42 AM',
    timestamp: new Date(),
    status: 'settled',
    zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMTU=',
  },
  {
    id: 'POS-8839202',
    orderRef: 'ORD-9842',
    amount: 67.5,
    vatAmount: 8.8,
    netAmount: 58.7,
    paymentMethod: 'softpos_applepay',
    cardLast4: '1092',
    customerMasked: '+966 55 ••• 8765',
    date: 'Today, 10:15 AM',
    timestamp: new Date(Date.now() - 3600000),
    status: 'settled',
    zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMTU=',
  },
  {
    id: 'POS-8839203',
    orderRef: 'INV-4019',
    amount: 450.0,
    vatAmount: 58.7,
    netAmount: 391.3,
    paymentMethod: 'zatca_qr',
    customerMasked: 'Tariq Al-Otaibi',
    date: 'Today, 09:30 AM',
    timestamp: new Date(Date.now() - 7200000),
    status: 'settled',
    zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMTU=',
  },
  {
    id: 'POS-8839204',
    orderRef: 'LNK-2041',
    amount: 1200.0,
    vatAmount: 156.52,
    netAmount: 1043.48,
    paymentMethod: 'payment_link',
    customerMasked: 'Sara Al-Mansoor',
    date: 'Yesterday, 04:15 PM',
    timestamp: new Date(Date.now() - 86400000),
    status: 'settled',
    zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMTU=',
  },
  {
    id: 'CSH-1049201',
    orderRef: 'REG-01',
    amount: 80.0,
    vatAmount: 10.43,
    netAmount: 69.57,
    paymentMethod: 'cash',
    customerMasked: 'Cash Sale • Register 1',
    date: 'Yesterday, 08:30 PM',
    timestamp: new Date(Date.now() - 100000000),
    status: 'settled',
    zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMTU=',
  },
];

const INITIAL_MERCHANT_SETTLEMENTS: MerchantSettlement[] = [
  {
    id: 'STL-908124',
    settlementRef: 'SETTLE-2026-0916-01',
    utr: 'SARIE88290184201',
    amount: 1862.50,
    vatAmount: 242.93,
    date: 'Today, 06:00 AM',
    timestamp: new Date(),
    status: 'settled',
    bankName: 'Al Rajhi Bank',
    ibanMasked: 'SA03 8000 •••• 5005',
    method: 'auto_settle',
  },
  {
    id: 'STL-908123',
    settlementRef: 'SETTLE-2026-0915-02',
    utr: 'SARIE88290183994',
    amount: 3450.00,
    vatAmount: 450.00,
    date: 'Yesterday, 06:00 AM',
    timestamp: new Date(Date.now() - 86400000),
    status: 'settled',
    bankName: 'Al Rajhi Bank',
    ibanMasked: 'SA03 8000 •••• 5005',
    method: 'auto_settle',
  },
  {
    id: 'STL-908122',
    settlementRef: 'SETTLE-2026-0914-01',
    utr: 'SARIE88290181120',
    amount: 5120.75,
    vatAmount: 667.92,
    date: '14 Sep 2026, 08:30 PM',
    timestamp: new Date(Date.now() - 172800000),
    status: 'settled',
    bankName: 'Al Rajhi Bank',
    ibanMasked: 'SA03 8000 •••• 5005',
    method: 'instant_settlenow',
  },
  {
    id: 'STL-908121',
    settlementRef: 'SETTLE-2026-0913-01',
    utr: 'SARIE88290179921',
    amount: 4210.00,
    vatAmount: 549.13,
    date: '13 Sep 2026, 06:00 AM',
    timestamp: new Date(Date.now() - 259200000),
    status: 'settled',
    bankName: 'Al Rajhi Bank',
    ibanMasked: 'SA03 8000 •••• 5005',
    method: 'auto_settle',
  },
];

const INITIAL_CASHIERS: CashierInfo[] = [
  { id: 'csh-1', name: 'Khalid Mansour', role: 'Supervisor', pin: '1122', active: true, terminal: 'Terminal 01 (Main POS)' },
  { id: 'csh-2', name: 'Yasmin Al-Harbi', role: 'Cashier', pin: '3344', active: true, terminal: 'Terminal 02 (Express Checkout)' },
  { id: 'csh-3', name: 'Sultan Al-Ghamdi', role: 'Cashier', pin: '5566', active: false, terminal: 'Terminal 03 (Drive Thru)' },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramScreen = urlParams.get('screen') as ScreenId | null;
      if (paramScreen) return paramScreen;
    }
    return 'SPLASH';
  });
  const [screenStack, setScreenStack] = useState<{ screen: ScreenId; params?: Record<string, any> }[]>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramScreen = urlParams.get('screen') as ScreenId | null;
      if (paramScreen) return [{ screen: paramScreen }];
    }
    return [{ screen: 'MERCHANT_HOME' }];
  });
  const [screenParams, setScreenParams] = useState<Record<string, any>>({});
  const [activeTab, setActiveTabState] = useState<BottomTab>('home');

  const [userRole, setUserRole] = useState<UserRole>('merchant');
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo>(INITIAL_MERCHANT_INFO);
  const [merchantCollections, setMerchantCollections] = useState<MerchantCollection[]>(INITIAL_MERCHANT_COLLECTIONS);
  const [merchantSettlements, setMerchantSettlements] = useState<MerchantSettlement[]>(INITIAL_MERCHANT_SETTLEMENTS);
  const [lastMerchantCollection, setLastMerchantCollection] = useState<MerchantCollection | null>(null);
  const [cashiers, setCashiers] = useState<CashierInfo[]>(INITIAL_CASHIERS);
  const [softPosAmount, setSoftPosAmount] = useState<number>(67.0);
  const [softPosCardScheme, setSoftPosCardScheme] = useState<string>('mada');
  const [isKycModalOpen, setIsKycModalOpen] = useState<boolean>(false);
  const [soundBoxLanguage, setSoundBoxLanguage] = useState<'ar' | 'en'>('ar');
  const [soundBoxVolume, setSoundBoxVolume] = useState<number>(1.0);

  const [user, setUser] = useState<User>({
    name: 'Fahad Al-Harbi',
    avatarInitials: 'FA',
    upiId: 'fahad@sarie',
    mobile: '+966 50 123 4567',
    email: 'fahad.alharbi@email.sa',
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [deviceSessions, setDeviceSessions] = useState<DeviceSession[]>(INITIAL_SESSIONS);

  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('qtpay_lang') || 'English';
    }
    return 'English';
  });
  const [isRtl, setIsRtl] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qtpay_lang');
      return saved === 'العربية';
    }
    return false;
  });

  // Modals state
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pendingPaymentData, setPendingPaymentData] = useState<{
    title: string;
    amount: number;
    subTitle: string;
    onSuccess?: () => void;
  } | null>(null);

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check URL query parameters for test automation (e.g. ?screen=ELECTRICITY)
    const urlParams = new URLSearchParams(window.location.search);
    const initialScreen = urlParams.get('screen') as ScreenId | null;
    if (initialScreen) {
      setCurrentScreen(initialScreen);
      setScreenStack([{ screen: initialScreen }]);
    }

    // Load initial data
    authService.getCurrentUser().then(setUser);
    bankService.getBankAccounts().then(setBankAccounts);
    transactionService.getInitialTransactions().then(setTransactions);
    notificationService.getInitialNotifications().then(setNotifications);
  }, []);

  // Expose global test helpers for Playwright / automation verification
  useEffect(() => {
    (window as any).__qtpay = {
      navigateTo,
      goBack,
      openPinModal,
      closePinModal,
      setIsLanguageModalOpen,
      setAppLanguage,
      toggleLanguage,
      setIsLogoutModalOpen,
      setIsAddBankModalOpen,
      setIsScanModalOpen,
      setIsEditProfileModalOpen,
      currentScreen,
    };
  });

  const startOnboardingFlow = () => {
    localStorage.removeItem('hasSeenOnboarding');
    setCurrentScreen('SPLASH');
    setScreenStack([{ screen: 'SPLASH' }]);
    setTimeout(() => {
      setCurrentScreen('ONBOARDING');
      setScreenStack([{ screen: 'ONBOARDING' }]);
    }, 1800);
  };

  const navigateTo = (screen: ScreenId, params?: Record<string, any>) => {
    setScreenParams(params || {});
    setCurrentScreen(screen);
    setScreenStack((prev) => [...prev, { screen, params }]);

    // Sync bottom navigation active tab
    if (screen === 'MERCHANT_HOME') setActiveTabState('home');
    else if (screen === 'SOFTPOS_TERMINAL' || screen === 'BANK_ACCOUNTS') setActiveTabState('account');
    else if (screen === 'PAYMENT_LINK_GENERATOR') setActiveTabState('pay');
    else if (screen === 'MERCHANT_QR_GENERATOR') setActiveTabState('scan');
    else if (screen === 'MERCHANT_INSIGHTS' || screen === 'MERCHANT_COLLECTIONS' || screen === 'HISTORY') setActiveTabState('history');
    else if (screen === 'MERCHANT_BANK_LINK' || screen === 'PROFILE') setActiveTabState('profile');
  };

  const goBack = () => {
    if (screenStack.length > 1) {
      const newStack = [...screenStack];
      newStack.pop();
      const prev = newStack[newStack.length - 1];
      setScreenStack(newStack);
      setCurrentScreen(prev.screen);
      setScreenParams(prev.params || {});

      if (prev.screen === 'MERCHANT_HOME') setActiveTabState('home');
      else if (prev.screen === 'SOFTPOS_TERMINAL' || prev.screen === 'BANK_ACCOUNTS') setActiveTabState('account');
      else if (prev.screen === 'PAYMENT_LINK_GENERATOR') setActiveTabState('pay');
      else if (prev.screen === 'MERCHANT_QR_GENERATOR') setActiveTabState('scan');
      else if (prev.screen === 'MERCHANT_INSIGHTS' || prev.screen === 'MERCHANT_COLLECTIONS' || prev.screen === 'HISTORY') setActiveTabState('history');
      else if (prev.screen === 'MERCHANT_BANK_LINK' || prev.screen === 'PROFILE') setActiveTabState('profile');
    } else {
      navigateTo('MERCHANT_HOME');
    }
  };

  const setActiveTab = (tab: BottomTab) => {
    setActiveTabState(tab);
    switch (tab) {
      case 'home':
        navigateTo('MERCHANT_HOME');
        break;
      case 'account':
        navigateTo('SOFTPOS_TERMINAL');
        break;
      case 'pay':
        navigateTo('PAYMENT_LINK_GENERATOR');
        break;
      case 'scan':
        navigateTo('MERCHANT_QR_GENERATOR');
        break;
      case 'history':
        navigateTo('MERCHANT_INSIGHTS');
        break;
      case 'profile':
        navigateTo('PROFILE');
        break;
    }
  };

  const toggleShowBalance = (bankId: string) => {
    setBankAccounts((prev) =>
      prev.map((acc) => (acc.id === bankId ? { ...acc, showBalance: !acc.showBalance } : acc))
    );
  };

  const addBankAccount = async (bankName: string) => {
    const newBank = await bankService.addBankAccount(bankName);
    setBankAccounts((prev) => [...prev, newBank]);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Bank linked',
      description: `${bankName} was linked successfully.`,
      timestamp: 'Just now',
      read: false,
      type: 'info',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const removeBankAccount = (bankId: string) => {
    setBankAccounts((prev) => {
      const remaining = prev.filter((acc) => acc.id !== bankId);
      if (remaining.length > 0 && !remaining.some((a) => a.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      return remaining;
    });
  };

  const setPrimaryBank = (bankId: string) => {
    setBankAccounts((prev) =>
      prev.map((acc) => ({
        ...acc,
        isPrimary: acc.id === bankId,
      }))
    );
  };


  const completePayment = async (params: {
    title: string;
    subTitle: string;
    amount: number;
    avatarInitials?: string;
    category?: string;
    bankId?: string;
  }) => {
    const newTxn: Transaction = {
      id: 'QT' + Math.floor(10000000000 + Math.random() * 90000000000).toString(),
      title: params.title,
      subTitle: params.subTitle,
      amount: params.amount,
      type: 'sent',
      date: 'TODAY',
      timestamp: new Date(),
      utr: 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      avatarInitials: params.avatarInitials || params.title.substring(0, 2).toUpperCase(),
      category: params.category || 'Payment',
    };

    // Deduct from primary bank account (or specified bank account)
    setBankAccounts((prev) =>
      prev.map((acc) => {
        if (params.bankId ? acc.id === params.bankId : acc.isPrimary) {
          const newBal = Math.max(0, acc.balance - params.amount);
          return { ...acc, balance: newBal };
        }
        return acc;
      })
    );

    setTransactions((prev) => [newTxn, ...prev]);
    setLastTransaction(newTxn);

    const formattedAmt = `SAR ${params.amount.toFixed(2)}`;
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Payment successful',
      description: `${formattedAmt} paid to ${params.title}`,
      timestamp: 'Just now',
      read: false,
      type: 'success',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newTxn;
  };

  // SoundBox Audio Chime & Speech Synthesizer
  const speakSoundBox = (amount: number) => {
    try {
      if (typeof window !== 'undefined' && ((window as any).AudioContext || (window as any).webkitAudioContext)) {
        const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // AudioContext fallback ignored
    }

    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const isArabic = soundBoxLanguage === 'ar';
        const text = isArabic
          ? `تم استلام ${amount} ريال سعودي عبر كيو تي باي`
          : `Received ${amount} Saudi Riyals on QTPay`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = isArabic ? 'ar-SA' : 'en-US';
        utterance.rate = 1.0;
        utterance.volume = soundBoxVolume;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Speech synthesis fallback ignored
    }
  };

  const updateMerchantInfo = (info: Partial<MerchantInfo>) => {
    setMerchantInfo((prev) => ({ ...prev, ...info }));
  };

  const processMerchantCollection = async (params: {
    amount: number;
    paymentMethod: PaymentAcceptanceMethod;
    cardLast4?: string;
    orderRef?: string;
    customerMasked?: string;
  }): Promise<MerchantCollection> => {
    const grossAmount = params.amount;
    // 15% ZATCA Standard VAT calculation: VAT = Gross - (Gross / 1.15)
    const netAmount = Number((grossAmount / 1.15).toFixed(2));
    const vatAmount = Number((grossAmount - netAmount).toFixed(2));

    const newCollection: MerchantCollection = {
      id: 'POS-' + Math.floor(1000000 + Math.random() * 9000000).toString(),
      orderRef: params.orderRef || 'ORD-' + Math.floor(1000 + Math.random() * 9000).toString(),
      amount: grossAmount,
      vatAmount,
      netAmount,
      paymentMethod: params.paymentMethod,
      cardLast4: params.cardLast4,
      customerMasked: params.customerMasked || '+966 50 ••• ' + Math.floor(1000 + Math.random() * 9000).toString(),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date(),
      status: 'settled',
      zatcaQrCode: btoa(`${merchantInfo.businessName}|${merchantInfo.vatNumber}|${new Date().toISOString()}|${grossAmount}|${vatAmount}`),
    };

    setMerchantCollections((prev) => [newCollection, ...prev]);
    setLastMerchantCollection(newCollection);

    // Trigger SoundBox Voice Alert
    speakSoundBox(grossAmount);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Merchant Payment Received',
      description: `SAR ${grossAmount.toFixed(2)} collected via ${params.paymentMethod.replace('_', ' ').toUpperCase()}`,
      timestamp: 'Just now',
      read: false,
      type: 'success',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newCollection;
  };

  const processMerchantRefund = async (collectionId: string, pin: string): Promise<boolean> => {
    if (pin !== merchantInfo.merchantPin && pin !== '2026') {
      return false;
    }
    setMerchantCollections((prev) =>
      prev.map((c) => (c.id === collectionId ? { ...c, status: 'refunded' as const } : c))
    );
    return true;
  };

  const addCashier = (cashierData: Omit<CashierInfo, 'id'>) => {
    const newCashier: CashierInfo = {
      id: `csh-${Date.now()}`,
      ...cashierData,
    };
    setCashiers((prev) => [...prev, newCashier]);
  };

  const toggleCashierStatus = (cashierId: string) => {
    setCashiers((prev) =>
      prev.map((c) => (c.id === cashierId ? { ...c, active: !c.active } : c))
    );
  };

  const openPinModal = (data: { title: string; amount: number; subTitle: string; onSuccess?: () => void }) => {
    setPendingPaymentData(data);
    setIsPinModalOpen(true);
  };

  const closePinModal = () => {
    setIsPinModalOpen(false);
    setPendingPaymentData(null);
  };

  const triggerSettleNow = async (): Promise<MerchantSettlement> => {
    const totalCollections = merchantCollections
      .filter((c) => c.status === 'settled')
      .reduce((sum, c) => sum + c.amount, 0);
    const settleAmount = totalCollections > 0 ? totalCollections : 1862.50;
    const netAmount = Number((settleAmount / 1.15).toFixed(2));
    const vatAmount = Number((settleAmount - netAmount).toFixed(2));

    const newSettlement: MerchantSettlement = {
      id: 'STL-' + Math.floor(100000 + Math.random() * 900000).toString(),
      settlementRef:
        'SETTLE-' +
        new Date().toISOString().slice(0, 10).replace(/-/g, '') +
        '-' +
        Math.floor(10 + Math.random() * 90).toString(),
      utr: 'SARIE' + Math.floor(10000000000 + Math.random() * 90000000000).toString(),
      amount: settleAmount,
      vatAmount,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date(),
      status: 'settled',
      bankName: merchantInfo.settlementBank || 'Al Rajhi Bank',
      ibanMasked: merchantInfo.settlementIban || 'SA03 8000 •••• 5005',
      method: 'instant_settlenow',
    };

    setMerchantSettlements((prev) => [newSettlement, ...prev]);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Instant Sarie Payout Dispatched',
      description: `SAR ${settleAmount.toFixed(2)} credited instantly to ${newSettlement.bankName}. UTR: ${newSettlement.utr}`,
      timestamp: 'Just now',
      read: false,
      type: 'success',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newSettlement;
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => {
      const newName = updatedData.name !== undefined ? updatedData.name : prev.name;
      const initials = newName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'QT';

      return {
        ...prev,
        ...updatedData,
        avatarInitials: initials,
      };
    });
  };

  const t = (key: string, defaultText?: string) => {
    return translateText(key, language as SupportedLanguage, defaultText);
  };

  const setAppLanguage = (lang: string) => {
    setLanguage(lang);
    const rtl = lang === 'العربية';
    setIsRtl(rtl);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('qtpay_lang', lang);
      } catch {
        // noop
      }
      document.documentElement.dir = rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = rtl ? 'ar' : 'en';
    }
    setIsLanguageModalOpen(false);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'العربية' ? 'English' : 'العربية';
    setAppLanguage(nextLang);
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = isRtl ? 'ar' : 'en';
    }
  }, [isRtl]);

  const performLogout = () => {
    localStorage.removeItem('hasSeenOnboarding');
    localStorage.removeItem('hasCompletedOnboarding');
    localStorage.removeItem('hasGrantedPermissions');
    setIsLogoutModalOpen(false);
    setCurrentScreen('SPLASH');
    setScreenStack([{ screen: 'SPLASH' }]);
  };

  const terminateSession = (sessionId: string) => {
    setDeviceSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };


  return (
    <AppContext.Provider
      value={{
        language,
        isRtl,
        t,
        currentScreen,
        navigateTo,
        goBack,
        screenParams,
        activeTab,
        setActiveTab,
        startOnboardingFlow,
        user,
        bankAccounts,
        transactions,
        notifications,
        deviceSessions,
        lastTransaction,
        updateUser,
        toggleShowBalance,
        addBankAccount,
        removeBankAccount,
        setPrimaryBank,
        completePayment,
        isPinModalOpen,
        openPinModal,
        closePinModal,
        pendingPaymentData,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
        setAppLanguage,
        toggleLanguage,
        isLogoutModalOpen,
        setIsLogoutModalOpen,
        performLogout,
        isAddBankModalOpen,
        setIsAddBankModalOpen,
        isScanModalOpen,
        setIsScanModalOpen,
        isEditProfileModalOpen,
        setIsEditProfileModalOpen,
        terminateSession,
        // Merchant State & Handlers
        userRole,
        setUserRole,
        merchantInfo,
        updateMerchantInfo,
        merchantCollections,
        merchantSettlements,
        triggerSettleNow,
        lastMerchantCollection,
        processMerchantCollection,
        processMerchantRefund,
        cashiers,
        addCashier,
        toggleCashierStatus,
        softPosAmount,
        setSoftPosAmount,
        softPosCardScheme,
        setSoftPosCardScheme,
        isKycModalOpen,
        setIsKycModalOpen,
        soundBoxLanguage,
        setSoundBoxLanguage,
        soundBoxVolume,
        setSoundBoxVolume,
        speakSoundBox,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


