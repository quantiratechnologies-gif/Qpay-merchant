import React, { useState } from 'react';
import {
  CreditCard,
  Landmark,
  QrCode,
  Banknote,
  Share2,
  CheckCircle2,
  X,
  Lock,
  Zap,
  ArrowUpRight,
  Download,
  Building2,
  Receipt,
  RotateCcw,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { formatCurrency } from '../../utils/formatters';
import type { MerchantCollection } from '../../types';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AppHeader } from '../../components/AppHeader';
import { translateText, formatSaudiCurrency, formatLocalizedNumber } from '../../utils/i18n';

export const MerchantCollectionsScreen: React.FC = () => {
  const {
    merchantCollections,
    merchantSettlements,
    triggerSettleNow,
    merchantInfo,
    processMerchantRefund,
    navigateTo,
    language,
    isRtl,
    t,
  } = useApp();

  const isAr = language === 'العربية';
  const [activeMainTab, setActiveMainTab] = useState<'transactions' | 'settlements'>('transactions');
  const [activeFilter, setActiveFilter] = useState<'all' | 'card' | 'applepay' | 'zatca' | 'cash' | 'link'>('all');
  const [selectedTxn, setSelectedTxn] = useState<MerchantCollection | null>(null);
  const [refundPin, setRefundPin] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundError, setRefundError] = useState('');
  const [refundSuccess, setRefundSuccess] = useState(false);

  const [isSettling, setIsSettling] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  // Extended mock items if state has only base items
  const allCollections: MerchantCollection[] = merchantCollections.length >= 4
    ? merchantCollections
    : [
        ...merchantCollections,
        {
          id: 'CSH-1049',
          orderRef: 'REG-01',
          amount: 80.0,
          vatAmount: 10.43,
          netAmount: 69.57,
          paymentMethod: 'cash',
          customerMasked: isAr ? 'بيع نقدي • كاشير ١' : 'Cash Sale • Register 1',
          date: 'Yesterday, 08:30 PM',
          timestamp: new Date(Date.now() - 86400000),
          status: 'settled',
          zatcaQrCode: 'AQ1TdGFybWFydCBNYXJrZXQCBzMxMDk0ODIBDDIwMjYtMDktMTU=',
        },
      ];

  const filtered = allCollections.filter((c) => {
    if (activeFilter === 'card') return c.paymentMethod === 'softpos_mada' || c.paymentMethod.includes('card') || c.paymentMethod.includes('mada');
    if (activeFilter === 'applepay') return c.paymentMethod === 'softpos_applepay' || c.paymentMethod.includes('apple');
    if (activeFilter === 'zatca') return c.paymentMethod === 'zatca_qr';
    if (activeFilter === 'cash') return c.paymentMethod === 'cash';
    if (activeFilter === 'link') return c.paymentMethod === 'payment_link';
    return true;
  });

  const totalSales = filtered.reduce((acc, c) => acc + (c.status === 'settled' ? c.amount : 0), 0);
  const unsettledTotal = merchantCollections
    .filter((c) => c.status === 'settled')
    .reduce((sum, c) => sum + c.amount, 0);

  const handleOpenRefundModal = (txn: MerchantCollection) => {
    if (txn.status === 'refunded') return;
    setSelectedTxn(txn);
    setRefundPin('');
    setRefundError('');
    setRefundSuccess(false);
  };

  const handleConfirmRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxn) return;
    setIsRefunding(true);
    setRefundError('');

    const success = await processMerchantRefund(selectedTxn.id, refundPin);
    setIsRefunding(false);

    if (success) {
      setRefundSuccess(true);
      setTimeout(() => {
        setSelectedTxn(null);
      }, 1200);
    } else {
      setRefundError(
        isAr
          ? 'رمز الأمان الخاص بالتاجر غير صحيح (الرمز الافتراضي: 2026)'
          : 'Incorrect Merchant Security PIN. (Default demo PIN: 2026)'
      );
    }
  };

  const handleSettleNow = async () => {
    setIsSettling(true);
    try {
      await triggerSettleNow();
      setDownloadSuccessMsg(
        isAr ? 'تم بدء التسوية الفورية وإيداع المبلغ في حسابك البنكي بنجاح' : 'Instant settlement dispatched to bank successfully.'
      );
      setTimeout(() => setDownloadSuccessMsg(null), 3500);
    } finally {
      setIsSettling(false);
    }
  };

  const handleDownloadTaxInvoice = (settlementRef: string) => {
    setDownloadSuccessMsg(
      isAr
        ? `جاري تحميل الفاتورة الضريبية الرسمية لـ ${settlementRef} بتنسيق ZATCA PDF...`
        : `Downloading ZATCA VAT Tax Invoice for ${settlementRef}...`
    );
    setTimeout(() => {
      setDownloadSuccessMsg(null);
    }, 3000);
  };

  const renderPaymentIcon = (method: string) => {
    if (method.includes('mada') || method.includes('card') || method.startsWith('softpos')) {
      return (
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 200, 83, 0.12)',
            border: '1px solid rgba(0, 200, 83, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            color: '#00C853',
            flexShrink: 0,
          }}
        >
          <CreditCard size={18} strokeWidth={2.4} />
        </div>
      );
    }

    if (method.includes('apple')) {
      return (
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: '#161F30',
            border: '1px solid #2A364F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <Smartphone size={18} />
        </div>
      );
    }

    if (method === 'zatca_qr') {
      return (
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 200, 83, 0.12)',
            border: '1px solid rgba(0, 200, 83, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00C853',
            flexShrink: 0,
          }}
        >
          <QrCode size={18} />
        </div>
      );
    }

    if (method === 'cash') {
      return (
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: '#161F30',
            border: '1px solid #2A364F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00C853',
            flexShrink: 0,
          }}
        >
          <Banknote size={18} />
        </div>
      );
    }

    return (
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          backgroundColor: '#161F30',
          border: '1px solid #2A364F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94A3B8',
          flexShrink: 0,
        }}
      >
        <Share2 size={18} />
      </div>
    );
  };

  const getTransactionTitle = (c: MerchantCollection) => {
    if (c.paymentMethod.includes('mada') || c.paymentMethod.includes('card') || c.paymentMethod.startsWith('softpos')) {
      return isAr ? 'بطاقة بنكية لا تلامسية' : 'Debit Card Contactless';
    }
    if (c.paymentMethod.includes('apple')) {
      return `Apple Pay • ${c.orderRef || 'ORD-9842'}`;
    }
    if (c.paymentMethod === 'zatca_qr') {
      return c.customerMasked || (isAr ? 'طارق العتيبي' : 'Tariq Al-Otaibi');
    }
    if (c.paymentMethod === 'cash') {
      return isAr ? 'بيع نقدي • كاشير ١' : 'Cash Sale • Register 1';
    }
    return c.customerMasked || c.orderRef || 'Payment Link';
  };

  const getTransactionSubtitle = (c: MerchantCollection) => {
    if (c.paymentMethod.includes('mada')) {
      return isAr ? '١١:٤٢ ص • نقطة بيع بالجوال' : '11:42 AM • SoftPOS Tap';
    }
    if (c.paymentMethod.includes('apple')) {
      return isAr ? '١٠:١٥ ص • جهاز #٨٨٣٩٢٠٢' : '10:15 AM • POS–8839202';
    }
    if (c.paymentMethod === 'zatca_qr') {
      return isAr ? '٠٩:٣٠ ص • فاتورة ضريبية #٤٠١٩' : '09:30 AM • Tax Inv #4019';
    }
    if (c.paymentMethod === 'cash') {
      return isAr ? 'أمس • سجل النقد' : 'Yesterday • Cash Log';
    }
    return translateText(c.date, language);
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100vh',
        backgroundColor: '#080C14',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: '24px',
        boxSizing: 'border-box',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Top Header */}
      <div>
        <AppHeader
          title={t('settlements.title', 'Collections & Settlements')}
          showBack={true}
          onBack={() => navigateTo('MERCHANT_INSIGHTS')}
          showSettings={false}
          rightAction={
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 200, 83, 0.12)',
                border: '1px solid rgba(0, 200, 83, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00C853',
              }}
            >
              <Receipt size={18} />
            </div>
          }
        />

        {/* Global Notification Toast */}
        {downloadSuccessMsg && (
          <div
            style={{
              backgroundColor: 'rgba(0, 200, 83, 0.15)',
              border: '1px solid #00C853',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#F8FAFC',
            }}
          >
            <CheckCircle2 size={16} color="#00C853" />
            <span>{downloadSuccessMsg}</span>
          </div>
        )}

        {/* 1. Dual Tab Segmented Control (Collections vs Settlements) */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '5px',
            display: 'flex',
            gap: '6px',
            marginBottom: '16px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMainTab('transactions')}
            className="interactive-tap"
            style={{
              flex: 1,
              backgroundColor: activeMainTab === 'transactions' ? '#00C853' : 'transparent',
              color: activeMainTab === 'transactions' ? '#080C14' : '#94A3B8',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 12px',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
            }}
          >
            <CreditCard size={17} strokeWidth={2.4} />
            <span>{isAr ? 'التحصيلات' : 'Collections'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('settlements')}
            className="interactive-tap"
            style={{
              flex: 1,
              backgroundColor: activeMainTab === 'settlements' ? '#00C853' : 'transparent',
              color: activeMainTab === 'settlements' ? '#080C14' : '#94A3B8',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 12px',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
            }}
          >
            <Landmark size={17} strokeWidth={2.4} />
            <span>{isAr ? 'التسويات' : 'Settlements'}</span>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: activeMainTab === 'settlements' ? '#080C14' : '#00C853',
                display: 'inline-block',
              }}
            />
          </button>
        </div>

        {/* TAB 1: COLLECTIONS VIEW */}
        {activeMainTab === 'transactions' && (
          <div>
            {/* 2. Horizontal Filter Chips */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '16px',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                paddingBottom: '2px',
              }}
            >
              {[
                { id: 'all', label: isAr ? `الكل (${allCollections.length})` : `All (${allCollections.length})` },
                { id: 'card', label: isAr ? 'بطاقات الدفع' : 'Cards', dot: true },
                { id: 'applepay', label: 'Apple Pay' },
                { id: 'zatca', label: 'ZATCA QR' },
                { id: 'cash', label: isAr ? 'بيع نقدي' : 'Cash Sale' },
                { id: 'link', label: isAr ? 'روابط الدفع' : 'Payment Link' },
              ].map((f) => {
                const isSelected = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id as any)}
                    className="interactive-tap"
                    style={{
                      backgroundColor: isSelected ? '#00C853' : '#111726',
                      color: isSelected ? '#080C14' : '#CBD5E1',
                      border: isSelected ? '1px solid #00C853' : '1px solid #1E293B',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {f.dot && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: isSelected ? '#080C14' : '#00C853',
                          display: 'inline-block',
                        }}
                      />
                    )}
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 3. Section Date Header with Group Total */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                padding: '0 4px',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {isAr ? 'اليوم، ٢٤ أكتوبر' : 'TODAY, 24 OCT'}
              </div>
              <div
                className="tabular-nums"
                style={{
                  fontSize: '13.5px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                }}
              >
                SAR {totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* 4. Collections Transaction Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleOpenRefundModal(c)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: '#111726',
                    border: '1px solid #1E293B',
                    borderRadius: '18px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {renderPaymentIcon(c.paymentMethod)}

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                        {getTransactionTitle(c)}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '3px' }}>
                        {getTransactionSubtitle(c)}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: isRtl ? 'left' : 'right', display: 'flex', flexDirection: 'column', alignItems: isRtl ? 'flex-start' : 'flex-end', gap: '4px' }}>
                    <div
                      className="tabular-nums"
                      style={{
                        fontSize: '14.5px',
                        fontWeight: 900,
                        color: c.status === 'refunded' ? '#FF6B81' : '#00C853',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {c.status === 'refunded' ? '-SAR ' : '+SAR '}
                      {c.amount.toFixed(2)}
                    </div>

                    {/* Status Pill Badge */}
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor:
                          c.status === 'refunded'
                            ? 'rgba(239, 68, 68, 0.15)'
                            : c.paymentMethod === 'cash'
                            ? '#161F30'
                            : 'rgba(0, 200, 83, 0.12)',
                        border:
                          c.status === 'refunded'
                            ? '1px solid rgba(239, 68, 68, 0.3)'
                            : c.paymentMethod === 'cash'
                            ? '1px solid #2A364F'
                            : '1px solid rgba(0, 200, 83, 0.3)',
                        color:
                          c.status === 'refunded'
                            ? '#FF6B81'
                            : c.paymentMethod === 'cash'
                            ? '#94A3B8'
                            : '#00C853',
                      }}
                    >
                      {c.status === 'refunded'
                        ? isAr ? 'مستردة' : 'Refunded'
                        : c.paymentMethod === 'cash'
                        ? isAr ? 'مسجل' : 'Logged'
                        : isAr ? 'مدفوع' : 'Paid'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SETTLEMENTS VIEW */}
        {activeMainTab === 'settlements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* SettleNow Action Card */}
            <div
              style={{
                backgroundColor: '#0D1424',
                border: '1px solid #1A263D',
                borderRadius: '20px',
                padding: '18px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
                background: 'radial-gradient(ellipse at top, rgba(0, 200, 83, 0.08) 0%, #0D1424 70%)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isAr ? 'رصيد التحصيلات غير المسوى' : "Today's Unsettled Payout"}
                  </span>
                  <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', marginTop: '3px' }}>
                    {formatCurrency(unsettledTotal, language)}
                  </div>
                </div>

                <button
                  onClick={handleSettleNow}
                  disabled={isSettling}
                  className="interactive-tap"
                  style={{
                    backgroundColor: '#00C853',
                    color: '#080C14',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 16px rgba(0, 200, 83, 0.35)',
                  }}
                >
                  <Zap size={15} fill="#080C14" />
                  <span>{isSettling ? (isAr ? 'جاري التحويل...' : 'Settling...') : t('settlenow.cta', 'Settle Now')}</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>

              <div
                style={{
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11.5px',
                  color: '#94A3B8',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} color="#00C853" />
                  <span>
                    {isAr ? 'الحساب البنكي المعتمد:' : 'Settlement IBAN:'} <strong style={{ color: '#F8FAFC' }}>{merchantInfo.settlementBank}</strong>
                  </span>
                </div>
                <span style={{ color: '#00C853', fontWeight: 700 }}>
                  {t('settlenow.auto_schedule', 'Daily at 06:00 AM')}
                </span>
              </div>
            </div>

            {/* Settlements History Ledger */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  {isAr ? 'سجل التسويات البنكية (سريع)' : 'Sarie Settlement History'}
                </h3>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                  {formatLocalizedNumber(merchantSettlements.length, language)} {isAr ? 'تسويات' : 'Settlements'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {merchantSettlements.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      backgroundColor: '#111726',
                      border: '1px solid #1E293B',
                      borderRadius: '18px',
                      padding: '16px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                            {s.settlementRef}
                          </span>
                          <span
                            style={{
                              backgroundColor: s.method === 'instant_settlenow' ? 'rgba(0, 200, 83, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                              color: s.method === 'instant_settlenow' ? '#00C853' : '#60A5FA',
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '2px 7px',
                              borderRadius: '6px',
                            }}
                          >
                            {s.method === 'instant_settlenow' ? (isAr ? 'سريع فوري' : 'Instant SettleNow') : (isAr ? 'تسوية تلقائية' : 'Auto Settle')}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
                          {isAr ? 'مرجع سريع:' : 'Sarie UTR:'} <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{s.utr}</span> &bull; {translateText(s.date, language)}
                        </div>
                      </div>

                      <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                        <div className="tabular-nums" style={{ fontSize: '15px', fontWeight: 900, color: '#00C853' }}>
                          +{formatCurrency(s.amount, language)}
                        </div>
                        <span style={{ fontSize: '10px', color: '#00C853', fontWeight: 700 }}>
                          {isAr ? 'تم التحويل' : 'Settled'}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        paddingTop: '10px',
                        borderTop: '1px solid #1E293B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                        {s.bankName} ({s.ibanMasked.slice(-8)})
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDownloadTaxInvoice(s.settlementRef)}
                        className="interactive-tap"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          padding: '5px 10px',
                          color: '#F8FAFC',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <Download size={12} color="#00C853" />
                        <span>{t('settlements.download_invoice', 'Download VAT Invoice')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Refund Authorization Modal */}
      {selectedTxn && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box',
          }}
          onClick={() => !isRefunding && setSelectedTxn(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '22px',
              padding: '24px 20px',
              boxSizing: 'border-box',
              color: '#FFFFFF',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={18} color="#FF6B81" />
                <span style={{ fontSize: '15px', fontWeight: 800 }}>{isAr ? 'تفاصيل العملية والاسترداد' : 'Transaction Details & Refund'}</span>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                style={{
                  background: '#161F30',
                  border: '1px solid #2A364F',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8',
                  cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            </div>

            {refundSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={40} color="#00C853" style={{ margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'تم تأكيد الاسترداد بنجاح' : 'Refund Authorized'}
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                  {isAr
                    ? `تم إرجاع ${formatSaudiCurrency(selectedTxn.amount, language)} إلى حساب العميل البنكي فورياً.`
                    : `SAR ${selectedTxn.amount.toFixed(2)} returned to customer bank account.`}
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmRefund} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ backgroundColor: '#161F30', border: '1px solid #2A364F', borderRadius: '12px', padding: '14px', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#94A3B8' }}>{isAr ? 'العملية:' : 'Transaction:'}</span>
                    <span style={{ fontWeight: 700 }}>{getTransactionTitle(selectedTxn)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#94A3B8' }}>{isAr ? 'المرجع:' : 'Reference:'}</span>
                    <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{selectedTxn.id}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#94A3B8' }}>{isAr ? 'ضريبة زاتكا ١٥٪:' : '15% ZATCA VAT:'}</span>
                    <span style={{ fontWeight: 700, color: '#00C853' }}>SAR {selectedTxn.vatAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #2A364F' }}>
                    <span style={{ color: '#94A3B8' }}>{isAr ? 'المبلغ:' : 'Total Amount:'}</span>
                    <span style={{ fontWeight: 900, color: '#FFFFFF' }}>SAR {selectedTxn.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    {isAr ? 'أدخل الرمز السري للتاجر (٤ أرقام للاسترداد)' : 'Enter 4-Digit Merchant PIN to Refund'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#161F30', border: '1px solid #2A364F', borderRadius: '12px', padding: '12px 14px' }}>
                    <Lock size={16} color="#00C853" style={{ marginRight: isRtl ? 0 : '10px', marginLeft: isRtl ? '10px' : 0 }} />
                    <input
                      type="password"
                      maxLength={4}
                      value={refundPin}
                      onChange={(e) => setRefundPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      required
                      style={{
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        color: '#FFFFFF',
                        fontSize: '18px',
                        fontWeight: 900,
                        letterSpacing: '0.2em',
                        width: '100%',
                        direction: 'ltr',
                        textAlign: isRtl ? 'right' : 'left',
                      }}
                    />
                  </div>
                </div>

                {refundError && (
                  <div style={{ fontSize: '11.5px', color: '#FF6B81', fontWeight: 700 }}>
                    {refundError}
                  </div>
                )}

                <PrimaryButton type="submit" disabled={isRefunding || refundPin.length < 4}>
                  {isRefunding
                    ? (isAr ? 'جاري معالجة الاسترداد...' : 'Processing Refund...')
                    : (isAr ? `تأكيد استرداد ${formatSaudiCurrency(selectedTxn.amount, language)}` : `Authorize Refund SAR ${selectedTxn.amount.toFixed(2)}`)}
                </PrimaryButton>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Quantira Technologies Dock */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
        <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>
          {isAr ? 'سجل تسوية للمنشآت مدعوم بتقنيات كوانتيرا' : 'Corporate Settlement Ledger • Quantira Technologies'}
        </span>
      </div>
    </div>
  );
};


