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
  Building2,
  Receipt,
  RotateCcw,
  Smartphone,
  Layers,
  ShieldCheck,
  Clock,
  FileText,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import type { MerchantCollection } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppHeader } from '../components/AppHeader';
import { translateText, formatSaudiCurrency, formatLocalizedNumber } from '../utils/i18n';
import { Card, StatusBadge, ListRow, FilterPills } from '../components/ui';
import { colors, spacing, radii } from '../design-system/tokens';

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
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedTxn, setSelectedTxn] = useState<MerchantCollection | null>(null);
  const [refundPin, setRefundPin] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundError, setRefundError] = useState('');
  const [refundSuccess, setRefundSuccess] = useState(false);

  const [isSettling, setIsSettling] = useState(false);
  

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
    } finally {
      setIsSettling(false);
    }
  };

  const handleDownloadTaxInvoice = (_settlementRef: string) => {
    // No-op clean action
  };

  const renderPaymentIcon = (method: string) => {
    if (method.includes('mada') || method.includes('card') || method.startsWith('softpos')) {
      return (
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: radii.md,
            backgroundColor: colors.primaryLight,
            border: '1px solid rgba(0, 200, 83, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            color: colors.accentGreen,
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
            borderRadius: radii.md,
            backgroundColor: colors.bgInset,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.textPrimary,
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
            borderRadius: radii.md,
            backgroundColor: colors.purpleLight,
            border: '1px solid rgba(168, 85, 247, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.accentPurple,
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
            borderRadius: radii.md,
            backgroundColor: colors.bgInset,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.accentGreen,
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
          borderRadius: radii.md,
          backgroundColor: colors.bgInset,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.textSecondary,
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

  const collectionFilterTabs = [
    { id: 'all', label: isAr ? `الكل (${allCollections.length})` : `All (${allCollections.length})`, icon: <Layers size={13} /> },
    { id: 'card', label: isAr ? 'بطاقات' : 'Cards', icon: <CreditCard size={13} /> },
    { id: 'applepay', label: 'Apple Pay', icon: <Smartphone size={13} /> },
    { id: 'zatca', label: 'ZATCA QR', icon: <QrCode size={13} /> },
    { id: 'cash', label: isAr ? 'نقدي' : 'Cash', icon: <Banknote size={13} /> },
    { id: 'link', label: isAr ? 'روابط' : 'Links', icon: <Share2 size={13} /> },
  ];

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bgPage,
        color: colors.textPrimary,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: spacing.space6,
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
                borderRadius: radii.md,
                backgroundColor: colors.primaryLight,
                border: '1px solid rgba(0, 200, 83, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.accentGreen,
              }}
            >
              <Receipt size={18} />
            </div>
          }
        />

        {/* 1. Dual Tab Segmented Control (Collections vs Settlements) */}
        <div
          style={{
            backgroundColor: colors.bgCard,
            border: `1px solid ${colors.border}`,
            borderRadius: radii.lg,
            padding: '5px',
            display: 'flex',
            gap: '6px',
            marginBottom: spacing.space4,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMainTab('transactions')}
            className="interactive-tap"
            style={{
              flex: 1,
              backgroundColor: activeMainTab === 'transactions' ? colors.accentGreen : 'transparent',
              color: activeMainTab === 'transactions' ? '#080C14' : colors.textSecondary,
              border: 'none',
              borderRadius: radii.md,
              padding: '10px 12px',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.space2,
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
              backgroundColor: activeMainTab === 'settlements' ? colors.accentGreen : 'transparent',
              color: activeMainTab === 'settlements' ? '#080C14' : colors.textSecondary,
              border: 'none',
              borderRadius: radii.md,
              padding: '10px 12px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.space2,
              transition: 'all 0.15s ease',
            }}
          >
            <Landmark size={17} strokeWidth={2.4} />
            <span>{isAr ? 'التسويات' : 'Settlements'}</span>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: radii.full,
                backgroundColor: activeMainTab === 'settlements' ? '#080C14' : colors.accentGreen,
                display: 'inline-block',
              }}
            />
          </button>
        </div>

        {/* TAB 1: COLLECTIONS VIEW */}
        {activeMainTab === 'transactions' && (
          <div>
            {/* 2. Horizontal Filter Chips using FilterPills */}
            <FilterPills
              tabs={collectionFilterTabs}
              activeId={activeFilter}
              onSelect={(id) => setActiveFilter(id)}
              style={{ marginBottom: spacing.space4 }}
            />

            {/* 3. Section Date Header with Group Total */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.space3,
                padding: '0 4px',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: colors.textSecondary,
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
                  fontWeight: 700,
                  color: colors.textPrimary,
                  letterSpacing: '-0.01em',
                }}
              >
                SAR {totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* 4. Collections Transaction Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map((c) => (
                <ListRow
                  key={c.id}
                  onClick={() => handleOpenRefundModal(c)}
                  leftIcon={renderPaymentIcon(c.paymentMethod)}
                  title={getTransactionTitle(c)}
                  subtitle={getTransactionSubtitle(c)}
                  rightAmount={
                    <div
                      className="tabular-nums"
                      style={{
                        fontSize: '14.5px',
                        fontWeight: 900,
                        color: c.status === 'refunded' ? colors.dangerText : colors.accentGreen,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {c.status === 'refunded' ? '-SAR ' : '+SAR '}
                      {c.amount.toFixed(2)}
                    </div>
                  }
                  rightBadge={
                    c.status === 'refunded' ? (
                      <StatusBadge
                        status="warning"
                        size="sm"
                        label={isAr ? 'مستردة' : 'Refunded'}
                      />
                    ) : undefined
                  }
                  showChevron={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SETTLEMENTS VIEW */}
        {activeMainTab === 'settlements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.space4 }}>
            {/* SettleNow Action Card */}
            <Card
              variant="elevated"
              style={{
                padding: '18px',
                background: 'radial-gradient(ellipse at top, rgba(0, 200, 83, 0.08) 0%, #0D1424 70%)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.space3 }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isAr ? 'رصيد التحصيلات غير المسوى' : "Today's Unsettled Payout"}
                  </span>
                  <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 900, color: colors.textPrimary, marginTop: '3px' }}>
                    {formatCurrency(unsettledTotal, language)}
                  </div>
                </div>

                <button
                  onClick={handleSettleNow}
                  disabled={isSettling}
                  className="interactive-tap"
                  style={{
                    backgroundColor: colors.accentGreen,
                    color: '#080C14',
                    border: 'none',
                    borderRadius: radii.md,
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
                  paddingTop: spacing.space3,
                  borderTop: `1px solid ${colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11.5px',
                  color: colors.textSecondary,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} color={colors.accentGreen} />
                  <span>
                    {isAr ? 'الحساب البنكي:' : 'IBAN:'} <strong style={{ color: colors.textPrimary }}>{merchantInfo.settlementBank}</strong>
                  </span>
                  <ShieldCheck size={13} color={colors.accentGreen} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: colors.accentGreen, fontWeight: 700 }}>
                  <Clock size={12} />
                  <span>{t('settlenow.auto_schedule', 'Daily 06:00 AM')}</span>
                </div>
              </div>
            </Card>

            {/* Settlements History Ledger */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.space2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Landmark size={15} color={colors.accentGreen} />
                  <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: colors.textPrimary, margin: 0 }}>
                    {isAr ? 'سجل التسويات البنكية (سريع)' : 'Sarie Settlement History'}
                  </h3>
                </div>
                <span style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: 600 }}>
                  {formatLocalizedNumber(merchantSettlements.length, language)} {isAr ? 'تسويات' : 'Settlements'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {merchantSettlements.map((s) => (
                  <Card
                    key={s.id}
                    variant="elevated"
                    style={{
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.space2 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space2 }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 800, color: colors.textPrimary }}>
                            {s.settlementRef}
                          </span>
                          <StatusBadge
                            status={s.method === 'instant_settlenow' ? 'success' : 'info'}
                            size="sm"
                            label={s.method === 'instant_settlenow' ? (isAr ? 'سريع فوري' : 'Instant SettleNow') : (isAr ? 'تسوية تلقائية' : 'Auto Settle')}
                          />
                        </div>
                        <div style={{ fontSize: '11px', color: colors.textSecondary, marginTop: '3px' }}>
                          {isAr ? 'مرجع سريع:' : 'Sarie UTR:'} <span style={{ color: colors.textPrimary, fontWeight: 600, fontFamily: 'monospace' }}>{s.utr}</span> &bull; {translateText(s.date, language)}
                        </div>
                      </div>

                      <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                        <div className="tabular-nums" style={{ fontSize: '15px', fontWeight: 900, color: colors.accentGreen }}>
                          +{formatCurrency(s.amount, language)}
                        </div>
                        <span style={{ fontSize: '10px', color: colors.accentGreen, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle2 size={10} />
                          {isAr ? 'تم التحويل' : 'Settled'}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        paddingTop: '10px',
                        borderTop: `1px solid ${colors.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: colors.textSecondary }}>
                        <Building2 size={13} color={colors.accentBlue} />
                        <span>{s.bankName} ({s.ibanMasked.slice(-8)})</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadTaxInvoice(s.settlementRef)}
                        className="interactive-tap"
                        style={{
                          background: colors.bgInset,
                          border: `1px solid ${colors.borderStrong}`,
                          borderRadius: radii.sm,
                          padding: '5px 10px',
                          color: colors.textPrimary,
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <FileText size={12} color={colors.accentGreen} />
                        <span>{t('settlements.download_invoice', 'Download VAT Invoice')}</span>
                      </button>
                    </div>
                  </Card>
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
            padding: spacing.space5,
            boxSizing: 'border-box',
          }}
          onClick={() => !isRefunding && setSelectedTxn(null)}
        >
          <Card
            variant="elevated"
            style={{
              width: '100%',
              maxWidth: '380px',
              padding: `${spacing.space6} ${spacing.space5}`,
              boxSizing: 'border-box',
              color: colors.textPrimary,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.space4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space2 }}>
                <RotateCcw size={18} color={colors.dangerText} />
                <span style={{ fontSize: '15px', fontWeight: 800 }}>{isAr ? 'تفاصيل العملية والاسترداد' : 'Transaction Details & Refund'}</span>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                style={{
                  background: colors.bgInset,
                  border: `1px solid ${colors.border}`,
                  borderRadius: radii.full,
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.textSecondary,
                  cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            </div>

            {refundSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={40} color={colors.accentGreen} style={{ margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: '16px', fontWeight: 800, color: colors.textPrimary }}>
                  {isAr ? 'تم تأكيد الاسترداد بنجاح' : 'Refund Authorized'}
                </div>
                <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '4px' }}>
                  {isAr
                    ? `تم إرجاع ${formatSaudiCurrency(selectedTxn.amount, language)} إلى حساب العميل البنكي فورياً.`
                    : `SAR ${selectedTxn.amount.toFixed(2)} returned to customer bank account.`}
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmRefund} style={{ display: 'flex', flexDirection: 'column', gap: spacing.space3 }}>
                <Card variant="inset" style={{ padding: spacing.space3, fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: colors.textSecondary }}>{isAr ? 'العملية:' : 'Transaction:'}</span>
                    <span style={{ fontWeight: 700 }}>{getTransactionTitle(selectedTxn)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: colors.textSecondary }}>{isAr ? 'المرجع:' : 'Reference:'}</span>
                    <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{selectedTxn.id}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: colors.textSecondary }}>{isAr ? 'ضريبة زاتكا ١٥٪:' : '15% ZATCA VAT:'}</span>
                    <span style={{ fontWeight: 700, color: colors.accentGreen }}>SAR {selectedTxn.vatAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: `1px solid ${colors.border}` }}>
                    <span style={{ color: colors.textSecondary }}>{isAr ? 'المبلغ:' : 'Total Amount:'}</span>
                    <span style={{ fontWeight: 900, color: colors.textPrimary }}>SAR {selectedTxn.amount.toFixed(2)}</span>
                  </div>
                </Card>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    {isAr ? 'أدخل الرمز السري للتاجر (٤ أرقام للاسترداد)' : 'Enter 4-Digit Merchant PIN to Refund'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: colors.bgInset, border: `1px solid ${colors.border}`, borderRadius: radii.md, padding: '12px 14px' }}>
                    <Lock size={16} color={colors.accentGreen} style={{ marginRight: isRtl ? 0 : '10px', marginLeft: isRtl ? '10px' : 0 }} />
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
                        color: colors.textPrimary,
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
                  <div style={{ fontSize: '11.5px', color: colors.dangerText, fontWeight: 700 }}>
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
          </Card>
        </div>
      )}

      {/* Quantira Technologies Dock */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: spacing.space4 }}>
        <span style={{ fontSize: '10.5px', color: colors.textMuted, fontWeight: 700 }}>
          {isAr ? 'سجل تسوية للمنشآت مدعوم بتقنيات كوانتيرا' : 'Corporate Settlement Ledger • Quantira Technologies'}
        </span>
      </div>
    </div>
  );
};
