import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { MerchantCollection, MerchantInfo, MerchantSettlement, User } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://sb-qpay-saudi.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fiRLd5ddXPUH_onp8AH86w_JQoVgAmH';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  try {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });
      return supabaseInstance;
    }
  } catch (err) {
    console.warn('[Supabase] Merchant init notice:', err);
  }
  return null;
}

// Generate Realistic Multi-Date Seed Transactions
export function generateMultiDateCollections(): MerchantCollection[] {
  const now = new Date();
  
  const createDate = (daysAgo: number, hoursAgo: number, minutesAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(d.getHours() - hoursAgo);
    d.setMinutes(d.getMinutes() - minutesAgo);
    return d;
  };

  const formatDateLabel = (d: Date, daysAgo: number) => {
    const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (daysAgo === 0) return `Today, ${timeStr}`;
    if (daysAgo === 1) return `Yesterday, ${timeStr}`;
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeStr}`;
  };

  const d1 = createDate(0, 0, 18);
  const d2 = createDate(0, 1, 45);
  const d3 = createDate(0, 3, 20);
  const d4 = createDate(0, 5, 10);
  const d5 = createDate(1, 4, 30);
  const d6 = createDate(1, 8, 15);
  const d7 = createDate(1, 11, 40);
  const d8 = createDate(3, 2, 10);
  const d9 = createDate(5, 6, 25);
  const d10 = createDate(7, 3, 50);
  const d11 = createDate(12, 5, 10);
  const d12 = createDate(18, 4, 20);
  const d13 = createDate(25, 7, 30);

  return [
    {
      id: 'POS-9081201',
      orderRef: 'ORD-9841',
      amount: 145.0,
      vatAmount: 18.91,
      netAmount: 126.09,
      paymentMethod: 'softpos_mada',
      cardLast4: '4821',
      customerMasked: '+966 50 ••• 1234',
      date: formatDateLabel(d1, 0),
      timestamp: d1,
      status: 'settled',
      zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMjE=',
    },
    {
      id: 'POS-9081202',
      orderRef: 'ORD-9842',
      amount: 67.5,
      vatAmount: 8.8,
      netAmount: 58.7,
      paymentMethod: 'softpos_applepay',
      cardLast4: '1092',
      customerMasked: '+966 55 ••• 8765',
      date: formatDateLabel(d2, 0),
      timestamp: d2,
      status: 'settled',
      zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMjE=',
    },
    {
      id: 'POS-9081203',
      orderRef: 'INV-4019',
      amount: 450.0,
      vatAmount: 58.7,
      netAmount: 391.3,
      paymentMethod: 'zatca_qr',
      customerMasked: 'Tariq Al-Otaibi',
      date: formatDateLabel(d3, 0),
      timestamp: d3,
      status: 'settled',
      zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMjE=',
    },
    {
      id: 'POS-9081204',
      orderRef: 'ORD-9844',
      amount: 220.0,
      vatAmount: 28.7,
      netAmount: 191.3,
      paymentMethod: 'softpos_visa',
      cardLast4: '3819',
      customerMasked: '+966 53 ••• 9942',
      date: formatDateLabel(d4, 0),
      timestamp: d4,
      status: 'settled',
      zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMjE=',
    },
    {
      id: 'POS-8839204',
      orderRef: 'LNK-2041',
      amount: 1200.0,
      vatAmount: 156.52,
      netAmount: 1043.48,
      paymentMethod: 'payment_link',
      customerMasked: 'Sara Al-Mansoor',
      date: formatDateLabel(d5, 1),
      timestamp: d5,
      status: 'settled',
      zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMjA=',
    },
    {
      id: 'CSH-1049201',
      orderRef: 'REG-01',
      amount: 80.0,
      vatAmount: 10.43,
      netAmount: 69.57,
      paymentMethod: 'cash',
      customerMasked: 'Cash Sale • Register 1',
      date: formatDateLabel(d6, 1),
      timestamp: d6,
      status: 'settled',
      zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMjA=',
    },
    {
      id: 'POS-8839205',
      orderRef: 'ORD-9820',
      amount: 310.0,
      vatAmount: 40.43,
      netAmount: 269.57,
      paymentMethod: 'softpos_mastercard',
      cardLast4: '5512',
      customerMasked: '+966 54 ••• 7721',
      date: formatDateLabel(d7, 1),
      timestamp: d7,
      status: 'settled',
      zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMjA=',
    },
    {
      id: 'POS-8839101',
      orderRef: 'ORD-9780',
      amount: 540.0,
      vatAmount: 70.43,
      netAmount: 469.57,
      paymentMethod: 'softpos_mada',
      cardLast4: '7721',
      customerMasked: '+966 50 ••• 5511',
      date: formatDateLabel(d8, 3),
      timestamp: d8,
      status: 'settled',
      zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMTg=',
    },
    {
      id: 'POS-8839090',
      orderRef: 'INV-3980',
      amount: 890.0,
      vatAmount: 116.09,
      netAmount: 773.91,
      paymentMethod: 'zatca_qr',
      customerMasked: 'Khalid Al-Ghamdi',
      date: formatDateLabel(d9, 5),
      timestamp: d9,
      status: 'settled',
      zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMTY=',
    },
    {
      id: 'POS-8838912',
      orderRef: 'ORD-9610',
      amount: 175.0,
      vatAmount: 22.83,
      netAmount: 152.17,
      paymentMethod: 'softpos_applepay',
      cardLast4: '4410',
      customerMasked: '+966 56 ••• 3019',
      date: formatDateLabel(d10, 7),
      timestamp: d10,
      status: 'settled',
      zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMTQ=',
    },
    {
      id: 'POS-8837120',
      orderRef: 'ORD-9420',
      amount: 980.0,
      vatAmount: 127.83,
      netAmount: 852.17,
      paymentMethod: 'softpos_visa',
      cardLast4: '6102',
      customerMasked: '+966 55 ••• 8823',
      date: formatDateLabel(d11, 12),
      timestamp: d11,
      status: 'settled',
      zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMDk=',
    },
    {
      id: 'POS-8836540',
      orderRef: 'INV-3810',
      amount: 1450.0,
      vatAmount: 189.13,
      netAmount: 1260.87,
      paymentMethod: 'zatca_qr',
      customerMasked: 'Nouf Al-Dosari',
      date: formatDateLabel(d12, 18),
      timestamp: d12,
      status: 'settled',
      zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMDM=',
    },
    {
      id: 'POS-8835010',
      orderRef: 'ORD-9120',
      amount: 620.0,
      vatAmount: 80.87,
      netAmount: 539.13,
      paymentMethod: 'softpos_mada',
      cardLast4: '9901',
      customerMasked: '+966 50 ••• 1928',
      date: formatDateLabel(d13, 25),
      timestamp: d13,
      status: 'settled',
      zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDgtMjY=',
    },
  ];
}

// Universal Auth & Merchant Auto-Provisioning
export async function authenticateMerchantWithAnyOtp(
  mobile: string,
  _otp: string,
  businessName: string = 'Quantira Gourmet Cafe',
  userName?: string
): Promise<{ user: User; merchantInfo: Partial<MerchantInfo> }> {
  const cleanMobile = mobile.replace(/\s+/g, '');
  const cleanDigits = mobile.replace(/\D/g, '');
  const supabase = getSupabase();

  const defaultUser: User = {
    name: userName || (cleanDigits ? `Merchant ${cleanDigits.slice(-4)}` : 'Merchant Owner'),
    avatarInitials: userName ? userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'MO',
    upiId: `${cleanDigits.slice(-4) || '9842'}@sarie`,
    mobile: cleanMobile.startsWith('+966') ? cleanMobile : `+966 ${cleanDigits}`,
    email: 'merchant@quantira.sa',
  };

  const defaultMerchantInfo: Partial<MerchantInfo> = {
    businessName: businessName || '',
    category: 'Food & Beverage',
    city: 'Riyadh',
    crNumber: '1010789234',
    vatNumber: '310984729100003',
    nationalId: '1089234812',
    isKycVerified: true,
    settlementBank: 'Al Rajhi Bank',
    settlementIban: 'SA55 8000 0000 6271 5005',
    merchantPin: '2026',
    terminalId: 'TRM-984210',
    storePhone: `+966 ${cleanDigits}`,
    registrationDate: new Date().toISOString().slice(0, 10),
  };

  if (!supabase) {
    return { user: defaultUser, merchantInfo: defaultMerchantInfo };
  }

  try {
    const fetchWithTimeout = Promise.race([
      supabase.from('profiles').select('*').eq('mobile', cleanDigits).maybeSingle(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 800)),
    ]);

    const result = await fetchWithTimeout;

    if (result && 'data' in result && result.data) {
      const existingProfile = result.data;
      const user: User = {
        name: existingProfile.full_name || defaultUser.name,
        avatarInitials: existingProfile.avatar_initials || defaultUser.avatarInitials,
        upiId: existingProfile.upi_id || defaultUser.upiId,
        mobile: existingProfile.mobile || defaultUser.mobile,
        email: existingProfile.email || 'merchant@quantira.sa',
      };
      const merchantInfo: Partial<MerchantInfo> = {
        businessName: existingProfile.business_name || defaultMerchantInfo.businessName,
        crNumber: existingProfile.cr_number || defaultMerchantInfo.crNumber,
        vatNumber: existingProfile.vat_number || defaultMerchantInfo.vatNumber,
        nationalId: existingProfile.national_id || defaultMerchantInfo.nationalId,
        settlementBank: existingProfile.settlement_bank || defaultMerchantInfo.settlementBank,
        settlementIban: existingProfile.settlement_iban || defaultMerchantInfo.settlementIban,
        merchantPin: existingProfile.merchant_pin || '2026',
        isKycVerified: true,
        logoUrl: existingProfile.logo_url,
        registrationDate: existingProfile.registration_date || '2026-01-15',
      };
      return { user, merchantInfo };
    }

    // Fire and forget insert in background if new
    supabase
      .from('profiles')
      .upsert({
        mobile: cleanDigits,
        role: 'merchant',
        full_name: defaultUser.name,
        business_name: businessName,
        cr_number: defaultMerchantInfo.crNumber,
        vat_number: defaultMerchantInfo.vatNumber,
        national_id: defaultMerchantInfo.nationalId,
        is_kyc_verified: true,
        avatar_initials: defaultUser.avatarInitials,
        upi_id: defaultUser.upiId,
        settlement_bank: defaultMerchantInfo.settlementBank,
        settlement_iban: defaultMerchantInfo.settlementIban,
        merchant_pin: defaultMerchantInfo.merchantPin,
        registration_date: defaultMerchantInfo.registrationDate,
      })
      .then(() => {})
      .catch(() => {});
  } catch (e) {
    console.warn('[Supabase] Merchant auth fallback to local session:', e);
  }

  return { user: defaultUser, merchantInfo: defaultMerchantInfo };
}

// Save Full Merchant Profile to Supabase
export async function saveMerchantProfileToSupabase(profile: {
  mobile: string;
  user: User;
  merchantInfo: MerchantInfo;
  balance?: number;
}): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  const cleanDigits = profile.mobile.replace(/\D/g, '');
  try {
    await supabase.from('profiles').upsert({
      mobile: cleanDigits,
      role: 'merchant',
      full_name: profile.user.name,
      business_name: profile.merchantInfo.businessName,
      cr_number: profile.merchantInfo.crNumber,
      vat_number: profile.merchantInfo.vatNumber,
      national_id: profile.merchantInfo.nationalId,
      is_kyc_verified: profile.merchantInfo.isKycVerified,
      settlement_bank: profile.merchantInfo.settlementBank,
      settlement_iban: profile.merchantInfo.settlementIban,
      merchant_pin: profile.merchantInfo.merchantPin,
      logo_url: profile.merchantInfo.logoUrl,
      registration_date: profile.merchantInfo.registrationDate || new Date().toISOString().slice(0, 10),
      balance: profile.balance,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[Supabase] Save profile notice:', err);
  }
}

// Sync Collection to Supabase
export async function syncCollectionToSupabase(col: MerchantCollection): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  try {
    await supabase.from('transactions').insert({
      order_ref: col.orderRef,
      sender_name: col.customerMasked || 'Customer (NFC / QR)',
      receiver_name: 'Quantira Gourmet Cafe',
      amount: col.amount,
      vat_amount: col.vatAmount,
      net_amount: col.netAmount,
      payment_method: col.paymentMethod.replace('softpos_', ''),
      status: col.status,
      card_last4: col.cardLast4 || '9082',
      zatca_qr_code: col.zatcaQrCode,
      category: 'POS / SoftPOS Terminal',
      created_at: col.timestamp ? new Date(col.timestamp).toISOString() : new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[Supabase] Collection sync notice:', err);
  }
}

// Sync Settlement to Supabase
export async function syncSettlementToSupabase(settlement: MerchantSettlement): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  try {
    await supabase.from('settlements').insert({
      settlement_ref: settlement.settlementRef,
      utr: settlement.utr,
      amount: settlement.amount,
      vat_amount: settlement.vatAmount,
      status: settlement.status,
      bank_name: settlement.bankName,
      iban: settlement.ibanMasked,
      method: settlement.method,
      created_at: settlement.timestamp ? new Date(settlement.timestamp).toISOString() : new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[Supabase] Settlement sync notice:', err);
  }
}

// Realtime Collections Listener for Soundbox & Instant Refresh
export function subscribeToMerchantCollections(
  onNewCollection: (col: MerchantCollection) => void
): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel('public:transactions:merchant')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'transactions' },
        (payload) => {
          const row = payload.new as any;
          if (row) {
            const col: MerchantCollection = {
              id: row.id || `col-${Date.now()}`,
              orderRef: row.order_ref || `SAR-${Date.now().toString().slice(-6)}`,
              amount: Number(row.amount),
              vatAmount: Number(row.vat_amount || (Number(row.amount) * 0.15).toFixed(2)),
              netAmount: Number(row.net_amount || (Number(row.amount) * 0.85).toFixed(2)),
              paymentMethod: 'softpos_mada',
              cardLast4: row.card_last4 || '9082',
              customerMasked: row.sender_name || 'Customer (mada)',
              date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              timestamp: new Date(row.created_at || Date.now()),
              status: row.status === 'refunded' ? 'refunded' : 'settled',
              zatcaQrCode: row.zatca_qr_code,
            };
            onNewCollection(col);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('[Supabase] Merchant subscription notice:', err);
    return () => {};
  }
}

