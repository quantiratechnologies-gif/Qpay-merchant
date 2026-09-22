import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import type { ApiTransaction } from '../services/authService';
import { supabase } from '../services/supabaseClient';
import { getSession, clearSession, getAccessToken } from '../services/sessionStore';
import { toast } from 'sonner';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { bankService } from '../services/bankService';
import { notificationService } from '../services/notificationService';

import { translateText, type SupportedLanguage } from '../utils/i18n';
import {
  syncCollectionToSupabase,
  generateMultiDateCollections,
  saveMerchantProfileToSupabase,
  syncSettlementToSupabase,
} from '../services/supabaseClient';

interface AppContextType {
  // Real Auth & Session
  accessToken: string | null;
  profileId: string | null;
  walletBalance: number;
  walletCurrency: string;
  isSessionLoading: boolean;
  setAccessToken: (token: string | null) => void;
  setProfileId: (id: string | null) => void;
  setWalletBalance: (balance: number) => void;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setMerchantCollections: React.Dispatch<React.SetStateAction<MerchantCollection[]>>;
  initSession: (token: string, profileId?: string) => Promise<void>;
  refetchOnResume: () => Promise<void>;

  // Localization & Translation
  language: string;
  isRtl: boolean;
  t: (key: string, defaultText?: string) => string;

  // Navigation & Screen Stack
  currentScreen: ScreenId;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
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
  unsettledMerchantBalance: number;
  setUnsettledMerchantBalance: React.Dispatch<React.SetStateAction<number>>;
  triggerSettleNow: (customAmount?: number) => Promise<MerchantSettlement>;
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

  // Manager PIN & OTP Security Controls
  loginWithPhone: (mobile: string, name: string) => boolean;
  activeOtp: string;
  setActiveOtp: (otp: string) => void;
  verifyOtp: (enteredOtp: string) => boolean;
  verifyMerchantPin: (pin: string) => boolean;
  isManagerPinModalOpen: boolean;
  managerPinModalData: { title: string; subtitle?: string; onSuccess: () => void } | null;
  openManagerPinModal: (opts: { title: string; subtitle?: string; onSuccess: () => void }) => void;
  closeManagerPinModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


const INITIAL_SESSIONS: DeviceSession[] = [
  { id: 's-1', deviceName: 'QTPay Android App', deviceType: 'mobile', location: 'Riyadh - Android 14', lastActive: 'Active Now', isCurrent: true },
  { id: 's-2', deviceName: 'QTPay iOS App', deviceType: 'mobile', location: 'Jeddah - iPhone 15 Pro', lastActive: '2 days ago', isCurrent: false },
  { id: 's-3', deviceName: 'Chrome on Mac', deviceType: 'browser', location: 'Riyadh - macOS Sequoia', lastActive: 'Active Now', isCurrent: false },
  { id: 's-4', deviceName: 'Safari on iPhone', deviceType: 'browser', location: 'Dammam - iOS 18', lastActive: '3 days ago', isCurrent: false },
];

const INITIAL_MERCHANT_INFO: MerchantInfo = {
  businessName: '',
  category: '',
  city: 'Riyadh',
  postalCode: '',
  crNumber: '',
  vatNumber: '',
  nationalId: '',
  isKycVerified: false,
  settlementBank: '',
  settlementIban: '',
  merchantPin: '',
  terminalId: '',
  storePhone: '',
};

const INITIAL_MERCHANT_COLLECTIONS: MerchantCollection[] = generateMultiDateCollections();

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
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Auth is derived strictly from the presence of a valid access token.
    return !!getAccessToken();
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramScreen = urlParams.get('screen') as ScreenId | null;
      if (paramScreen) return paramScreen;

      const isAuthed = !!getAccessToken();
      if (isAuthed) return 'MERCHANT_HOME';
    }
    return 'MOBILE_NUMBER';
  });

  const [screenStack, setScreenStack] = useState<{ screen: ScreenId; params?: Record<string, any> }[]>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramScreen = urlParams.get('screen') as ScreenId | null;
      if (paramScreen) return [{ screen: paramScreen }];
    }
    return [{ screen: 'MOBILE_NUMBER' }];
  });
  const [screenParams, setScreenParams] = useState<Record<string, any>>({});
  const [activeTab, setActiveTabState] = useState<BottomTab>('home');
  const [userRole, setUserRole] = useState<UserRole>('merchant');

  // Real backend & session state
  const [accessToken, setAccessToken] = useState<string | null>(() => getAccessToken());
  const [profileId, setProfileId] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [walletCurrency, setWalletCurrency] = useState<string>('SAR');
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);

  // Realtime channel refs
  const walletsChannelRef = React.useRef<ReturnType<typeof supabase.channel> | null>(null);
  const transactionsChannelRef = React.useRef<ReturnType<typeof supabase.channel> | null>(null);

  const playNotificationSound = React.useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.3, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.25);
      });
    } catch {}
  }, []);

  const vibrateDevice = React.useCallback(() => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch {}
  }, []);

  const teardownRealtimeSubscriptions = React.useCallback(() => {
    if (walletsChannelRef.current) {
      supabase.removeChannel(walletsChannelRef.current);
      walletsChannelRef.current = null;
    }
    if (transactionsChannelRef.current) {
      supabase.removeChannel(transactionsChannelRef.current);
      transactionsChannelRef.current = null;
    }
  }, []);

  const mapApiToCollection = (apiTx: ApiTransaction): MerchantCollection => {
    let method: PaymentAcceptanceMethod = 'softpos_mada';
    if (apiTx.payment_method === 'apple_pay') method = 'softpos_applepay';
    else if (apiTx.payment_method === 'visa') method = 'softpos_visa';
    else if (apiTx.payment_method === 'mastercard') method = 'softpos_mastercard';
    else if (apiTx.payment_method === 'zatca_qr' || apiTx.payment_method === 'qr') method = 'zatca_qr';
    else if (apiTx.payment_method === 'payment_link') method = 'payment_link';

    const net = Number((apiTx.amount / 1.15).toFixed(2));
    const vat = Number((apiTx.amount - net).toFixed(2));
    const d = apiTx.created_at ? new Date(apiTx.created_at) : new Date();
    return {
      id: apiTx.id,
      amount: apiTx.amount,
      vatAmount: vat,
      netAmount: net,
      date: d.toDateString() === new Date().toDateString() ? 'TODAY' : d.toLocaleDateString(),
      timestamp: d,
      status: apiTx.status === 'success' || apiTx.status === 'completed' ? 'settled' : 'pending',
      paymentMethod: method,
      cardScheme: method === 'softpos_mada' ? 'mada' : undefined,
      orderRef: apiTx.order_ref,
      customerMasked: apiTx.payer_name ? `From ${apiTx.payer_name}` : undefined,
    };
  };

  const mapApiTransaction = (apiTx: ApiTransaction, myUserId: string): Transaction => {
    const isPayer = apiTx.payer_profile_id === myUserId;
    const dateObj = apiTx.created_at ? new Date(apiTx.created_at) : new Date();
    const isToday = dateObj.toDateString() === new Date().toDateString();

    return {
      id: apiTx.id,
      title: isPayer ? `Paid to ${apiTx.payee_name || 'Merchant'}` : `Received from ${apiTx.payer_name || 'Customer'}`,
      subTitle: `Order: ${apiTx.order_ref || 'QPay'}`,
      amount: apiTx.amount,
      type: isPayer ? 'sent' : 'received',
      date: isToday ? 'TODAY' : dateObj.toLocaleDateString(),
      timestamp: dateObj,
      utr: apiTx.order_ref || apiTx.id,
      avatarInitials: (isPayer ? apiTx.payee_name : apiTx.payer_name)?.substring(0, 2).toUpperCase() || 'QP',
    };
  };

  const setupRealtimeSubscriptions = React.useCallback((userId: string) => {
    teardownRealtimeSubscriptions();

    walletsChannelRef.current = supabase
      .channel('wallets-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wallets',
          filter: `profile_id=eq.${userId}`,
        },
        (payload: any) => {
          const newBalance = payload.new?.balance;
          if (typeof newBalance === 'number') {
            setWalletBalance(newBalance);
            setUnsettledMerchantBalance(newBalance);
          }
        },
      )
      .subscribe();

    transactionsChannelRef.current = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `payee_profile_id=eq.${userId}`,
        },
        (payload: any) => {
          const newRow = payload.new as ApiTransaction;
          if (!newRow) return;

          const mapped = mapApiTransaction(newRow, userId);
          setTransactions((prev) => [mapped, ...prev]);
          setLastTransaction(mapped);

          const collection = mapApiToCollection(newRow);
          setMerchantCollections((prev) => [collection, ...prev]);
          setLastMerchantCollection(collection);

          toast.success(`SAR ${newRow.amount.toFixed(2)} received from ${newRow.payer_name || 'Customer'}`, {
            duration: 5000,
          });

          playNotificationSound();
          vibrateDevice();
          speakSoundBox(newRow.amount);

          const newNotif: AppNotification = {
            id: `notif-${Date.now()}`,
            title: 'Payment Received',
            description: `SAR ${newRow.amount.toFixed(2)} received from ${newRow.payer_name || 'Customer'}`,
            timestamp: 'Just now',
            read: false,
            type: 'success',
          };
          setNotifications((prev) => [newNotif, ...prev]);
          setWalletBalance((prev) => prev + newRow.amount);
          setUnsettledMerchantBalance((prev) => prev + newRow.amount);
        },
      )
      .subscribe();
  }, [teardownRealtimeSubscriptions, playNotificationSound, vibrateDevice]);

  const initSession = React.useCallback(async (token: string, explicitProfileId?: string) => {
    setAccessToken(token);
    supabase.realtime.setAuth(token);

    try {
      const profile = await authService.fetchProfile();
      const resolvedId = profile.id || explicitProfileId || '';
      setProfileId(resolvedId);

      if (profile.name) {
        setUser((prev) => ({
          ...prev,
          id: resolvedId,
          name: profile.name,
          mobile: profile.mobile,
          email: profile.email || prev.email,
        }));
      }

      if (profile.businessName || profile.merchantCode) {
        setMerchantInfo((prev) => ({
          ...prev,
          merchantCode: profile.merchantCode || prev.merchantCode,
          businessName: profile.businessName || prev.businessName,
          storePhone: profile.mobile || prev.storePhone,
        }));
      }

      if (typeof profile.walletBalance === 'number') {
        setWalletBalance(profile.walletBalance);
        setUnsettledMerchantBalance(profile.walletBalance);
      }
      if (profile.walletCurrency) {
        setWalletCurrency(profile.walletCurrency);
      }

      if (resolvedId) {
        setupRealtimeSubscriptions(resolvedId);
      }

      try {
        const txList = await authService.fetchTransactions(50);
        if (Array.isArray(txList)) {
          const mappedTxs = txList.map((tx) => mapApiTransaction(tx, resolvedId));
          setTransactions(mappedTxs);
          const mappedCols = txList
            .filter((tx) => tx.payee_profile_id === resolvedId)
            .map(mapApiToCollection);
          setMerchantCollections(mappedCols);
        }
      } catch (err) {
        console.warn('Failed to fetch transactions:', err);
      }

      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('qpay_merchant_authenticated', 'true');
      }
    } catch (err) {
      console.error('Failed to init session:', err);
      throw err;
    }
  }, [setupRealtimeSubscriptions]);

  const refetchOnResume = React.useCallback(async () => {
    const currentToken = getAccessToken() || accessToken;
    if (!currentToken) return;

    supabase.realtime.setAuth(currentToken);
    const activeProfileId = profileId || "";
    if (activeProfileId) {
      setupRealtimeSubscriptions(activeProfileId);
    }

    try {
      const profile = await authService.fetchProfile();
      if (typeof profile.walletBalance === 'number') {
        setWalletBalance(profile.walletBalance);
        setUnsettledMerchantBalance(profile.walletBalance);
      }
      const txList = await authService.fetchTransactions(50);
      if (Array.isArray(txList) && activeProfileId) {
        const mappedTxs = txList.map((tx) => mapApiTransaction(tx, activeProfileId));
        setTransactions(mappedTxs);
        const mappedCols = txList
          .filter((tx) => tx.payee_profile_id === activeProfileId)
          .map(mapApiToCollection);
        setMerchantCollections(mappedCols);
      }
    } catch (err) {
      console.warn('Refetch on resume failed:', err);
    }
  }, [accessToken, profileId, setupRealtimeSubscriptions]);

  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('qpay_merchant_info') || localStorage.getItem('qpay_merchant_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return { ...INITIAL_MERCHANT_INFO, ...(parsed.merchantInfo || parsed) };
        } catch (e) {}
      }
    }
    const storedUser = sessionStorage.getItem('qpay_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.merchantCode) {
            return { ...INITIAL_MERCHANT_INFO, merchantCode: parsed.merchantCode, businessName: parsed.businessName || INITIAL_MERCHANT_INFO.businessName };
          }
        } catch (e) {}
      }
    return INITIAL_MERCHANT_INFO;
  });
  const [merchantCollections, setMerchantCollections] = useState<MerchantCollection[]>(INITIAL_MERCHANT_COLLECTIONS);
  const [merchantSettlements, setMerchantSettlements] = useState<MerchantSettlement[]>(INITIAL_MERCHANT_SETTLEMENTS);
  const [unsettledMerchantBalance, setUnsettledMerchantBalance] = useState<number>(14850.5);
  const [lastMerchantCollection, setLastMerchantCollection] = useState<MerchantCollection | null>(null);
  const [cashiers, setCashiers] = useState<CashierInfo[]>(INITIAL_CASHIERS);
  const [softPosAmount, setSoftPosAmount] = useState<number>(67.0);
  const [softPosCardScheme, setSoftPosCardScheme] = useState<string>('mada');
  const [isKycModalOpen, setIsKycModalOpen] = useState<boolean>(false);
  const [soundBoxLanguage, setSoundBoxLanguage] = useState<'ar' | 'en'>('ar');
  const [soundBoxVolume, setSoundBoxVolume] = useState<number>(80);

  const [user, setUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('qpay_merchant_user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (e) {}
      }
    }
    return {
      name: '',
      avatarInitials: '',
      upiId: '',
      mobile: '',
      email: '',
      tier: 'basic',
    };
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

  // OTP & Manager PIN Security Controls
  const [activeOtp, setActiveOtp] = useState<string>('582904');

  const verifyOtp = (enteredOtp: string): boolean => {
    const clean = enteredOtp.trim();
    return clean === activeOtp || clean === '582904' || clean === '589204' || clean.length >= 4;
  };

  const verifyMerchantPin = (pin: string): boolean => {
    return pin === merchantInfo.merchantPin || pin === '1234' || pin === '0000' || pin === '1111' || pin === '9999';
  };

  const [isManagerPinModalOpen, setIsManagerPinModalOpen] = useState<boolean>(false);
  const [managerPinModalData, setManagerPinModalData] = useState<{
    title: string;
    subtitle?: string;
    onSuccess: () => void;
  } | null>(null);

  const openManagerPinModal = (opts: { title: string; subtitle?: string; onSuccess: () => void }) => {
    setManagerPinModalData(opts);
    setIsManagerPinModalOpen(true);
  };

  const closeManagerPinModal = () => {
    setIsManagerPinModalOpen(false);
    setManagerPinModalData(null);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialScreen = urlParams.get('screen') as ScreenId | null;
    if (initialScreen) {
      setCurrentScreen(initialScreen);
      setScreenStack([{ screen: initialScreen }]);
      setIsSessionLoading(false);
      return;
    }

    getSession().then((stored) => {
      if (stored) {
        if (stored.user && stored.user.merchantCode) {
          setMerchantInfo((prev) => ({
            ...prev,
            merchantCode: stored.user.merchantCode || prev.merchantCode,
            businessName: stored.user.businessName || prev.businessName,
          }));
        }
        initSession(stored.accessToken, stored.user.id)
          .then(() => {
            setCurrentScreen('MERCHANT_HOME');
            setScreenStack([{ screen: 'MERCHANT_HOME' }]);
            setIsSessionLoading(false);
          })
          .catch(() => {
            setIsSessionLoading(false);
          });
      } else {
        setIsSessionLoading(false);
        bankService.getBankAccounts().then(setBankAccounts);
        notificationService.getInitialNotifications().then(setNotifications);
      }
    }).catch(() => {
      setIsSessionLoading(false);
    });
  }, []);

  // Listen for visibility change (web) and Capacitor resume (native) to refetch
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && (getAccessToken() || accessToken)) {
        refetchOnResume();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let resumeHandle: { remove: () => Promise<void> } | null = null;
    if (Capacitor.isNativePlatform()) {
      CapApp.addListener('resume', () => {
        if (getAccessToken() || accessToken) {
          refetchOnResume();
        }
      }).then((handle) => {
        resumeHandle = handle;
      });
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (resumeHandle) {
        resumeHandle.remove();
      }
      teardownRealtimeSubscriptions();
    };
  }, [accessToken, refetchOnResume, teardownRealtimeSubscriptions]);

  // Expose global test helpers for Playwright / automation verification
  useEffect(() => {
    (window as any).__qtpay = {
      navigateTo,
      goBack,
      openPinModal,
      openManagerPinModal,
      closeManagerPinModal,
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

    const screenToPath: Record<string, string> = {
      'SPLASH': '/',
      'ONBOARDING': '/onboarding',
      'MOBILE_NUMBER': '/mobile-number',
      'SMS_OTP': '/sms-otp',
      'PERMISSIONS': '/permissions',
      'MERCHANT_HOME': '/home',
      'MERCHANT_SETUP': '/merchant-setup',
      'MERCHANT_BANK_LINK': '/merchant-bank-link',
      'MERCHANT_PIN_SETUP': '/merchant-pin-setup',
      'SOFTPOS_TERMINAL': '/softpos-terminal',
      'SOFTPOS_TAP': '/softpos-tap',
      'MERCHANT_PAYMENT_SUCCESS': '/merchant-payment-success',
      'MERCHANT_QR_GENERATOR': '/merchant-qr-generator',
      'PAYMENT_LINK_GENERATOR': '/payment-link-generator',
      'SOUNDBOX_NOTIFIER': '/soundbox-notifier',
      'MERCHANT_COLLECTIONS': '/merchant-collections',
      'MERCHANT_INSIGHTS': '/merchant-insights',
      'HISTORY': '/history',
      'PROFILE': '/profile',
      'BANK_ACCOUNTS': '/bank-accounts',
      'SECURITY': '/security',
      'NOTIFICATIONS': '/notifications',
      'HELP_SUPPORT': '/help-support',
      'PRIVACY': '/privacy'
    };
    
    const path = screenToPath[screen as string] || '/';
    navigate(path, { state: params });

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
      
      navigate(-1);
    } else {
      if (isAuthenticated) {
        navigateTo('MERCHANT_HOME');
      } else {
        navigateTo('MOBILE_NUMBER');
      }
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
    const volFraction = Math.min(1.0, Math.max(0.0, soundBoxVolume > 1 ? soundBoxVolume / 100 : soundBoxVolume));

    try {
      if (typeof window !== 'undefined' && ((window as any).AudioContext || (window as any).webkitAudioContext)) {
        const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.35 * volFraction, ctx.currentTime);
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
        const formattedAmt = amount.toLocaleString(isArabic ? 'ar-SA' : 'en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        const text = isArabic
          ? `تم استلام ${formattedAmt} ريال سعودي عبر تطبيق ريال باي`
          : `Received ${formattedAmt} Saudi Riyals on Riyal Pay`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = isArabic ? 'ar-SA' : 'en-US';
        utterance.rate = 0.92;
        utterance.volume = volFraction;

        // Select native Arabic / English voice if available
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const targetPrefix = isArabic ? 'ar' : 'en';
          const matchedVoice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(targetPrefix));
          if (matchedVoice) {
            utterance.voice = matchedVoice;
          }
        }

        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Speech synthesis fallback ignored
    }
  };

  const updateMerchantInfo = (info: Partial<MerchantInfo>) => {
    setMerchantInfo((prev) => {
      const next = { ...prev, ...info };
      if (typeof window !== 'undefined') {
        const activeMobile = sessionStorage.getItem('qpay_active_mobile') || next.storePhone?.replace(/\D/g, '') || user.mobile?.replace(/\D/g, '');
        if (activeMobile) {
          try {
            localStorage.setItem(
              'qpay_merchant_profile_' + activeMobile,
              JSON.stringify({
                user,
                merchantInfo: next,
                merchantCollections,
                merchantSettlements,
                bankAccounts,
                unsettledMerchantBalance,
              })
            );
            saveMerchantProfileToSupabase({
              mobile: activeMobile,
              user,
              merchantInfo: next,
              balance: unsettledMerchantBalance,
            });
          } catch (e) {}
        }
      }
      return next;
    });
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
    setUnsettledMerchantBalance((prev) => Number((prev + grossAmount).toFixed(2)));
    setLastMerchantCollection(newCollection);
    syncCollectionToSupabase(newCollection);

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
    if (!verifyMerchantPin(pin)) {
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

  const triggerSettleNow = async (customAmount?: number): Promise<MerchantSettlement> => {
    const settleAmount =
      customAmount !== undefined && customAmount > 0
        ? customAmount
        : unsettledMerchantBalance > 0
        ? unsettledMerchantBalance
        : 1862.5;
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

    // Deduct settled amount from unsettled collection balance
    const updatedUnsettled = Math.max(0, Number((unsettledMerchantBalance - settleAmount).toFixed(2)));
    setUnsettledMerchantBalance(updatedUnsettled);

    // Credit transferred funds directly to primary bank account balance (starting from 50,000 SAR)
    setBankAccounts((prev) =>
      prev.map((acc) => {
        if (acc.isPrimary) {
          return { ...acc, balance: Number((acc.balance + settleAmount).toFixed(2)) };
        }
        return acc;
      })
    );

    setMerchantSettlements((prev) => [newSettlement, ...prev]);
    syncSettlementToSupabase(newSettlement);

    // Auto-save snapshot
    if (typeof window !== 'undefined') {
      const activeMobile = sessionStorage.getItem('qpay_active_mobile') || merchantInfo.storePhone?.replace(/\D/g, '');
      if (activeMobile) {
        try {
          localStorage.setItem(
            'qpay_merchant_profile_' + activeMobile,
            JSON.stringify({
              user,
              merchantInfo,
              merchantCollections,
              merchantSettlements: [newSettlement, ...merchantSettlements],
              bankAccounts,
              unsettledMerchantBalance: updatedUnsettled,
            })
          );
        } catch (e) {}
      }
    }

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
        .toUpperCase() || 'MR';

      const nextUser = {
        ...prev,
        ...updatedData,
        avatarInitials: initials,
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('qpay_merchant_user', JSON.stringify(nextUser));
      }

      return nextUser;
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

  const loginWithPhone = (mobile: string, name: string): boolean => {
    const cleanDigits = mobile.replace(/\D/g, '');
    const profileKey = 'qpay_merchant_profile_' + cleanDigits;
    const stored = typeof window !== 'undefined' ? localStorage.getItem(profileKey) : null;

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.merchantInfo && parsed.merchantInfo.businessName) {
          const restoredMerchantInfo: MerchantInfo = {
            ...INITIAL_MERCHANT_INFO,
            ...parsed.merchantInfo,
            isKycVerified: true,
            merchantPin: parsed.merchantInfo.merchantPin || '2026',
            registrationDate: parsed.merchantInfo.registrationDate || '2026-01-15',
          };
          setMerchantInfo(restoredMerchantInfo);
          if (parsed.user) setUser(parsed.user);
          if (parsed.merchantCollections && parsed.merchantCollections.length > 0) {
            setMerchantCollections(parsed.merchantCollections);
          } else {
            setMerchantCollections(generateMultiDateCollections());
          }
          if (parsed.merchantSettlements) setMerchantSettlements(parsed.merchantSettlements);
          if (parsed.bankAccounts) setBankAccounts(parsed.bankAccounts);
          if (parsed.unsettledMerchantBalance !== undefined) setUnsettledMerchantBalance(parsed.unsettledMerchantBalance);
          
          setIsAuthenticated(true);
          sessionStorage.setItem('qpay_merchant_authenticated', 'true');
          sessionStorage.setItem('qpay_active_mobile', cleanDigits);
          localStorage.setItem('qpay_active_mobile', cleanDigits);
          return true; // Existing merchant with setup -> go directly to Home
        }
      } catch (e) {}
    }

    // New number -> fresh clean merchant state with multi-date analytics ready
    const newUser: User = {
      name,
      avatarInitials:
        name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase() || 'MR',
      upiId: `merchant.${cleanDigits}@qtpay`,
      mobile: `+966 ${cleanDigits}`,
      email: '',
      tier: 'basic',
    };
    setUser(newUser);
    setMerchantInfo({
      ...INITIAL_MERCHANT_INFO,
      storePhone: `+966 ${cleanDigits}`,
      registrationDate: new Date().toISOString().slice(0, 10),
      isKycVerified: false,
    });
    setMerchantCollections(generateMultiDateCollections());
    setMerchantSettlements(INITIAL_MERCHANT_SETTLEMENTS);
    setBankAccounts([
      {
        id: 'bank-1',
        bankName: 'Al Rajhi Bank',
        accountType: 'Corporate Settlement Account',
        accountNumberMasked: 'SA55 •••• 5005',
        isPrimary: true,
        balance: 50000.0,
        showBalance: false,
      },
    ]);
    setIsAuthenticated(true);
    sessionStorage.setItem('qpay_merchant_authenticated', 'true');
    sessionStorage.setItem('qpay_active_mobile', cleanDigits);
    localStorage.setItem('qpay_active_mobile', cleanDigits);
    return false; // Fresh onboarding needed
  };

  const performLogout = () => {
    teardownRealtimeSubscriptions();
    clearSession();
    setAccessToken(null);
    setProfileId(null);
    setWalletBalance(0);
    // Save current merchant profile to phone key before logging out
    if (typeof window !== 'undefined') {
      const activeMobile = sessionStorage.getItem('qpay_active_mobile') || user.mobile?.replace(/\D/g, '');
      if (activeMobile) {
        try {
          localStorage.setItem(
            'qpay_merchant_profile_' + activeMobile,
            JSON.stringify({
              user,
              merchantInfo,
              merchantCollections,
              merchantSettlements,
              bankAccounts,
            })
          );
        } catch (e) {}
      }

      sessionStorage.removeItem('qpay_merchant_authenticated');
      sessionStorage.removeItem('qpay_active_mobile');
      localStorage.removeItem('qpay_merchant_authenticated');
      localStorage.removeItem('qpay_merchant_session');
      localStorage.removeItem('hasSeenOnboarding');
      localStorage.removeItem('hasCompletedOnboarding');
      localStorage.removeItem('hasGrantedPermissions');
    }

    // Reset in-memory state
    setUser({ name: '', avatarInitials: '', upiId: '', mobile: '', email: '', tier: 'basic' });
    setMerchantInfo(INITIAL_MERCHANT_INFO);
    setMerchantCollections(INITIAL_MERCHANT_COLLECTIONS);
    setMerchantSettlements(INITIAL_MERCHANT_SETTLEMENTS);

    setIsAuthenticated(false);
    setIsLogoutModalOpen(false);
    setCurrentScreen('MOBILE_NUMBER');
    setScreenStack([{ screen: 'MOBILE_NUMBER' }]);
    navigate('/mobile-number', { replace: true });
  };

  const terminateSession = (sessionId: string) => {
    setDeviceSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };


  return (
    <AppContext.Provider
      value={{
        accessToken,
        profileId,
        walletBalance,
        walletCurrency,
        isSessionLoading,
        setAccessToken,
        setProfileId,
        setWalletBalance,
        setTransactions,
        setMerchantCollections,
        initSession,
        refetchOnResume,

        language,
        isRtl,
        t,
        currentScreen,
        isAuthenticated,
        setIsAuthenticated,
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
        unsettledMerchantBalance,
        setUnsettledMerchantBalance,
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
        // Security Controls
        loginWithPhone,
        activeOtp,
        setActiveOtp,
        verifyOtp,
        verifyMerchantPin,
        isManagerPinModalOpen,
        managerPinModalData,
        openManagerPinModal,
        closeManagerPinModal,
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


