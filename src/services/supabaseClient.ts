import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { MerchantCollection, MerchantInfo, User } from '../types';

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

// Universal Auth & Merchant Auto-Provisioning
export async function authenticateMerchantWithAnyOtp(
  mobile: string,
  _otp: string,
  businessName: string = 'Quantira Gourmet Cafe',
  userName?: string
): Promise<{ user: User; merchantInfo: Partial<MerchantInfo> }> {
  const cleanMobile = mobile.replace(/\s+/g, '');
  const supabase = getSupabase();

  const defaultUser: User = {
    name: userName || (cleanMobile ? `Merchant ${cleanMobile.slice(-4)}` : 'Merchant Owner'),
    avatarInitials: userName ? userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'MO',
    upiId: `${cleanMobile.slice(-4) || '9842'}@sarie`,
    mobile: cleanMobile.startsWith('+966') ? cleanMobile : `+966 ${cleanMobile}`,
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
    settlementIban: 'SA44 8000 0456 6080 1012 3456',
    terminalId: 'TRM-984210',
    storePhone: cleanMobile,
  };

  if (!supabase) {
    localStorage.setItem('qpay_merchant_session', JSON.stringify({ user: defaultUser, merchantInfo: defaultMerchantInfo }));
    return { user: defaultUser, merchantInfo: defaultMerchantInfo };
  }

  // Use Promise.race with a fast 800ms timeout so verification never hangs
  try {
    const fetchWithTimeout = Promise.race([
      supabase
        .from('profiles')
        .select('*')
        .eq('mobile', cleanMobile)
        .maybeSingle(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 800))
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
        isKycVerified: true,
      };
      return { user, merchantInfo };
    }

    // Fire and forget insert in background if new
    supabase.from('profiles').insert({
      mobile: cleanMobile,
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
    }).then(() => {}).catch(() => {});

  } catch (e) {
    console.warn('[Supabase] Merchant auth fallback to local session:', e);
  }

  return { user: defaultUser, merchantInfo: defaultMerchantInfo };
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
              date: 'TODAY',
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
