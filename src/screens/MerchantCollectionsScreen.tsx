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
  Download,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import type { MerchantCollection } from '../types';
import { PrimaryButton } from '../components/PrimaryButton';
import { translateText, formatSaudiCurrency, formatLocalizedNumber } from '../utils/i18n';
import { Card, StatusBadge, FilterPills } from '../components/ui';
import { colors, spacing, radii } from '../design-system/tokens';

export const MerchantCollectionsScreen: React.FC = () => {
  const {
    merchantCollections,
    merchantSettlements,
    triggerSettleNow,
    merchantInfo,
    processMerchantRefund,
    openManagerPinModal,
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
          ? 'رمز الأمان الخاص بالتاجر غير صحيح (الرمز الافتراضي: 1234)'
          : 'Incorrect Merchant Security PIN. (Default demo PIN: 1234)'
      );
    }
  };

  const handleSettleNow = () => {
    openManagerPinModal({
      title: isAr ? 'تأكيد التسوية الفورية عبر سريع' : 'Authorize Instant Settlement',
      subtitle: isAr
        ? 'أدخل رمز المدير السري لإتمام الصرف الفوري'
        : 'Enter Manager Security PIN to dispatch Sarie instant payout',
      onSuccess: async () => {
        setIsSettling(true);
        try {
          await triggerSettleNow();
        } finally {
          setIsSettling(false);
        }
      },
    });
  };

  const handleDownloadTaxInvoice = (_settlementRef: string) => {
    // No-op clean action
  };

  const getPaymentMethodIcon = (method: string) => {
    if (method.includes('mada') || method.includes('card') || method.startsWith('softpos')) return <CreditCard size={15} />;
    if (method.includes('apple')) return <Smartphone size={15} />;
    if (method === 'zatca_qr') return <QrCode size={15} />;
    if (method === 'cash') return <Banknote size={15} />;
    return <Share2 size={15} />;
  };

  const getPaymentMethodBadge = (method: string) => {
    if (method.includes('mada') || method.includes('card') || method.startsWith('softpos')) {
      return { label: 'mada Card', color: colors.accentGreen, bg: colors.primaryLight };
    }
    if (method.includes('apple')) return { label: 'Apple Pay', color: '#fff', bg: '#1E293B' };
    if (method === 'zatca_qr') return { label: 'ZATCA QR', color: colors.accentPurple, bg: colors.purpleLight };
    if (method === 'cash') return { label: isAr ? 'نقدي' : 'Cash', color: colors.accentGreen, bg: colors.primaryLight };
    return { label: isAr ? 'رابط دفع' : 'Pay Link', color: '#38BDF8', bg: '#0F2942' };
  };

  const getTransactionTitle = (c: MerchantCollection) => {
    if (c.paymentMethod.includes('mada') || c.paymentMethod.includes('card') || c.paymentMethod.startsWith('softpos')) {
      return isAr ? 'بطاقة بنكية لا تلامسية' : 'Debit Card Contactless';
    }
    if (c.paymentMethod.includes('apple')) return `Apple Pay • ${c.orderRef || 'ORD-9842'}`;
    if (c.paymentMethod === 'zatca_qr') return c.customerMasked || (isAr ? 'طارق العتيبي' : 'Tariq Al-Otaibi');
    if (c.paymentMethod === 'cash') return isAr ? 'بيع نقدي • كاشير ١' : 'Cash Sale • Register 1';
    return c.customerMasked || c.orderRef || 'Payment Link';
  };

  const getTransactionSubtitle = (c: MerchantCollection) => {
    if (c.paymentMethod.includes('mada')) return isAr ? '١١:٤٢ ص • نقطة بيع بالجوال' : '11:42 AM • SoftPOS Tap';
    if (c.paymentMethod.includes('apple')) return isAr ? '١٠:١٥ ص • جهاز #٨٨٣٩٢٠٢' : '10:15 AM • POS–8839202';
    if (c.paymentMethod === 'zatca_qr') return isAr ? '٠٩:٣٠ ص • فاتورة ضريبية #٤٠١٩' : '09:30 AM • Tax Inv #4019';
    if (c.paymentMethod === 'cash') return isAr ? 'أمس • سجل النقد' : 'Yesterday • Cash Log';
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
        backgroundColor: colors.bgPage,
        color: colors.textPrimary,
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* ── Page Header ─────────────────────────────────────── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: colors.textPrimary }}>
              {isAr ? 'التحصيلات والتسويات' : 'Collections & Settlements'}
            </h1>
            <p style={{ fontSize: '13.5px', color: colors.textSecondary, margin: '6px 0 0 0', fontWeight: 500 }}>
              {isAr
                ? 'سجل العمليات الكامل مع تسوية سريع الفورية'
                : 'Full transaction ledger with Sarie instant settlement'}
            </p>
          </div>

          {/* CSV Export + Receipt CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="interactive-tap"
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                backgroundColor: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: radii.md,
                padding: '9px 16px',
                color: colors.textSecondary,
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Download size={15} />
              {isAr ? 'تصدير CSV' : 'Export CSV'}
            </button>
            <button
              type="button"
              className="interactive-tap"
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                backgroundColor: colors.primaryLight,
                border: '1px solid rgba(0, 200, 83, 0.3)',
                borderRadius: radii.md,
                padding: '9px 16px',
                color: colors.accentGreen,
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Receipt size={15} />
              {isAr ? 'فاتورة ضريبية' : 'Tax Invoice'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Dual Tab Segmented Control ───────────────────────── */}
      <div
        style={{
          backgroundColor: colors.bgCard,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.lg,
          padding: '5px',
          display: 'inline-flex',
          gap: '6px',
          marginBottom: '24px',
        }}
      >
        {[
          { id: 'transactions', label: isAr ? 'التحصيلات' : 'Collections', icon: <CreditCard size={16} strokeWidth={2.4} /> },
          { id: 'settlements', label: isAr ? 'التسويات' : 'Settlements', icon: <Landmark size={16} strokeWidth={2.4} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveMainTab(tab.id as 'transactions' | 'settlements')}
            className="interactive-tap"
            style={{
              backgroundColor: activeMainTab === tab.id ? colors.accentGreen : 'transparent',
              color: activeMainTab === tab.id ? '#080C14' : colors.textSecondary,
              border: 'none',
              borderRadius: radii.md,
              padding: '9px 22px',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '7px',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          TAB 1 — COLLECTIONS
      ═══════════════════════════════════════════════════════ */}
      {activeMainTab === 'transactions' && (
        <>
          {/* Filter Chips */}
          <FilterPills
            tabs={collectionFilterTabs}
            activeId={activeFilter}
            onSelect={(id) => setActiveFilter(id)}
            style={{ marginBottom: '20px' }}
          />

          {/* Summary Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
              padding: '0 4px',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {isAr ? 'اليوم، ٢٤ أكتوبر' : 'TODAY, 24 OCT'}
            </span>
            <span className="tabular-nums" style={{ fontSize: '13.5px', fontWeight: 700, color: colors.textPrimary, letterSpacing: '-0.01em' }}>
              SAR {totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Full-Width Enterprise Table */}
          <Card variant="elevated" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1.4fr 100px 80px 90px 90px',
                padding: '11px 20px',
                backgroundColor: colors.bgInset,
                borderBottom: `1px solid ${colors.border}`,
                gap: '12px',
              }}
            >
              {[
                isAr ? 'العميل / الطريقة' : 'Customer / Method',
                isAr ? 'المرجع' : 'Reference',
                isAr ? 'الوقت' : 'Timestamp',
                isAr ? 'المبلغ' : 'Amount',
                isAr ? 'ضريبة' : 'VAT',
                isAr ? 'الحالة' : 'Status',
                isAr ? 'إجراء' : 'Action',
              ].map((col, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: colors.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    textAlign: i >= 3 ? 'right' : 'left',
                  }}
                >
                  {col}
                </span>
              ))}
            </div>

            {/* Table Rows */}
            {filtered.map((c, idx) => {
              const badge = getPaymentMethodBadge(c.paymentMethod);
              return (
                <div
                  key={c.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1.4fr 100px 80px 90px 90px',
                    padding: '14px 20px',
                    borderBottom: idx < filtered.length - 1 ? `1px solid ${colors.border}` : 'none',
                    gap: '12px',
                    alignItems: 'center',
                    cursor: c.status !== 'refunded' ? 'pointer' : 'default',
                    transition: 'background 0.12s ease',
                  }}
                  className="interactive-tap"
                  onClick={() => handleOpenRefundModal(c)}
                >
                  {/* Col 1: Customer / Method */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '34px', height: '34px',
                        borderRadius: radii.md,
                        backgroundColor: badge.bg,
                        border: `1px solid ${badge.color}33`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: badge.color,
                        flexShrink: 0,
                      }}
                    >
                      {getPaymentMethodIcon(c.paymentMethod)}
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: colors.textPrimary, lineHeight: 1.3 }}>
                        {getTransactionTitle(c)}
                      </div>
                      <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '1px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '1px 7px',
                            borderRadius: radii.full,
                            backgroundColor: badge.bg,
                            color: badge.color,
                            fontSize: '10px',
                            fontWeight: 700,
                          }}
                        >
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Col 2: Reference */}
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: colors.textSecondary, fontWeight: 600 }}>
                    {c.id}
                  </span>

                  {/* Col 3: Timestamp */}
                  <span style={{ fontSize: '12px', color: colors.textSecondary }}>
                    {getTransactionSubtitle(c)}
                  </span>

                  {/* Col 4: Amount */}
                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: '14px', fontWeight: 900,
                      color: c.status === 'refunded' ? colors.dangerText : colors.accentGreen,
                      textAlign: 'right',
                    }}
                  >
                    {c.status === 'refunded' ? '-' : '+'}SAR {c.amount.toFixed(2)}
                  </span>

                  {/* Col 5: VAT */}
                  <span
                    className="tabular-nums"
                    style={{ fontSize: '12px', color: colors.textSecondary, textAlign: 'right', fontWeight: 600 }}
                  >
                    {c.vatAmount.toFixed(2)}
                  </span>

                  {/* Col 6: Status */}
                  <div style={{ textAlign: 'right' }}>
                    {c.status === 'refunded' ? (
                      <StatusBadge status="warning" size="sm" label={isAr ? 'مستردة' : 'Refunded'} />
                    ) : (
                      <StatusBadge status="success" size="sm" label={isAr ? 'مكتملة' : 'Settled'} />
                    )}
                  </div>

                  {/* Col 7: Action */}
                  <div style={{ textAlign: 'right' }}>
                    {c.status !== 'refunded' && (
                      <button
                        type="button"
                        style={{
                          background: 'transparent',
                          border: `1px solid ${colors.borderStrong}`,
                          borderRadius: radii.sm,
                          padding: '4px 10px',
                          color: colors.textSecondary,
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                        }}
                      >
                        <RotateCcw size={11} />
                        {isAr ? 'استرداد' : 'Refund'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ padding: '48px', textAlign: 'center', color: colors.textMuted, fontSize: '14px' }}>
                {isAr ? 'لا توجد عمليات في هذا التصنيف' : 'No transactions in this category'}
              </div>
            )}
          </Card>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB 2 — SETTLEMENTS
      ═══════════════════════════════════════════════════════ */}
      {activeMainTab === 'settlements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Settle Now Hero Card */}
          <Card
            variant="elevated"
            style={{
              padding: '24px 28px',
              background: 'radial-gradient(ellipse at top left, rgba(0, 200, 83, 0.10) 0%, #0D1424 65%)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {isAr ? 'رصيد التحصيلات غير المسوى' : "Today's Unsettled Payout"}
                </span>
                <div className="tabular-nums" style={{ fontSize: '36px', fontWeight: 900, color: colors.textPrimary, marginTop: '4px', letterSpacing: '-0.04em' }}>
                  {formatCurrency(unsettledTotal, language)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '12px', color: colors.textSecondary }}>
                  <Building2 size={14} color={colors.accentGreen} />
                  <span>
                    {isAr ? 'الحساب البنكي:' : 'IBAN:'}{' '}
                    <strong style={{ color: colors.textPrimary }}>{merchantInfo.settlementBank}</strong>
                  </span>
                  <ShieldCheck size={13} color={colors.accentGreen} />
                  <span style={{ color: colors.accentGreen, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {t('settlenow.auto_schedule', 'Daily 06:00 AM')}
                  </span>
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
                  borderRadius: radii.lg,
                  padding: '14px 24px',
                  fontSize: '14px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 6px 24px rgba(0, 200, 83, 0.4)',
                  flexShrink: 0,
                }}
              >
                <Zap size={17} fill="#080C14" />
                <span>{isSettling ? (isAr ? 'جاري التحويل...' : 'Settling...') : t('settlenow.cta', 'Settle Now')}</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </Card>

          {/* Settlements History Ledger — table */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Landmark size={16} color={colors.accentGreen} />
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: colors.textPrimary, margin: 0 }}>
                {isAr ? 'سجل التسويات البنكية (سريع)' : 'Sarie Settlement History'}
              </h3>
              <span style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: 600 }}>
                {formatLocalizedNumber(merchantSettlements.length, language)} {isAr ? 'تسويات' : 'Settlements'}
              </span>
            </div>

            <Card variant="elevated" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Settlement Table Header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1.2fr 120px 80px 130px',
                  padding: '11px 20px',
                  backgroundColor: colors.bgInset,
                  borderBottom: `1px solid ${colors.border}`,
                  gap: '12px',
                }}
              >
                {[
                  isAr ? 'مرجع التسوية' : 'Settlement Ref',
                  isAr ? 'مرجع سريع UTR' : 'Sarie UTR',
                  isAr ? 'البنك' : 'Bank',
                  isAr ? 'المبلغ' : 'Amount',
                  isAr ? 'النوع' : 'Type',
                  isAr ? 'إجراء' : 'Action',
                ].map((col, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '10.5px', fontWeight: 700,
                      color: colors.textMuted, textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      textAlign: i >= 3 ? 'right' : 'left',
                    }}
                  >
                    {col}
                  </span>
                ))}
              </div>

              {merchantSettlements.map((s, idx) => (
                <div
                  key={s.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1fr 1.2fr 120px 80px 130px',
                    padding: '15px 20px',
                    borderBottom: idx < merchantSettlements.length - 1 ? `1px solid ${colors.border}` : 'none',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  {/* Ref */}
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: colors.textPrimary }}>{s.settlementRef}</div>
                    <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '1px' }}>{translateText(s.date, language)}</div>
                  </div>

                  {/* UTR */}
                  <span style={{ fontSize: '11.5px', fontFamily: 'monospace', color: colors.textSecondary, fontWeight: 600 }}>
                    {s.utr}
                  </span>

                  {/* Bank */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: colors.textSecondary }}>
                    <Building2 size={13} color={colors.accentBlue} />
                    {s.bankName} ({s.ibanMasked.slice(-8)})
                  </div>

                  {/* Amount */}
                  <span className="tabular-nums" style={{ fontSize: '14px', fontWeight: 900, color: colors.accentGreen, textAlign: 'right' }}>
                    +{formatCurrency(s.amount, language)}
                  </span>

                  {/* Type */}
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge
                      status={s.method === 'instant_settlenow' ? 'success' : 'info'}
                      size="sm"
                      label={s.method === 'instant_settlenow' ? (isAr ? 'فوري' : 'Instant') : (isAr ? 'تلقائي' : 'Auto')}
                    />
                  </div>

                  {/* Action */}
                  <div style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleDownloadTaxInvoice(s.settlementRef)}
                      className="interactive-tap"
                      style={{
                        background: colors.bgInset,
                        border: `1px solid ${colors.borderStrong}`,
                        borderRadius: radii.sm,
                        padding: '5px 12px',
                        color: colors.textPrimary,
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                      }}
                    >
                      <FileText size={12} color={colors.accentGreen} />
                      {t('settlements.download_invoice', 'Download VAT Invoice')}
                    </button>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ── Refund Authorization Modal ───────────────────────── */}
      {selectedTxn && (
        <div
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 120,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: spacing.space5,
            boxSizing: 'border-box',
          }}
          onClick={() => !isRefunding && setSelectedTxn(null)}
        >
          <Card
            variant="elevated"
            style={{
              width: '100%', maxWidth: '420px',
              padding: `${spacing.space6} ${spacing.space5}`,
              boxSizing: 'border-box',
              color: colors.textPrimary,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.space4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space2 }}>
                <RotateCcw size={18} color={colors.dangerText} />
                <span style={{ fontSize: '16px', fontWeight: 800 }}>
                  {isAr ? 'تفاصيل العملية والاسترداد' : 'Transaction Details & Refund'}
                </span>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                style={{
                  background: colors.bgInset, border: `1px solid ${colors.border}`,
                  borderRadius: radii.full, width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: colors.textSecondary, cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            </div>

            {refundSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={48} color={colors.accentGreen} style={{ margin: '0 auto 12px auto' }} />
                <div style={{ fontSize: '17px', fontWeight: 800, color: colors.textPrimary }}>
                  {isAr ? 'تم تأكيد الاسترداد بنجاح' : 'Refund Authorized'}
                </div>
                <div style={{ fontSize: '12.5px', color: colors.textSecondary, marginTop: '6px' }}>
                  {isAr
                    ? `تم إرجاع ${formatSaudiCurrency(selectedTxn.amount, language)} إلى حساب العميل البنكي فورياً.`
                    : `SAR ${selectedTxn.amount.toFixed(2)} returned to customer bank account.`}
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmRefund} style={{ display: 'flex', flexDirection: 'column', gap: spacing.space3 }}>
                <Card variant="inset" style={{ padding: spacing.space3, fontSize: '12.5px' }}>
                  {[
                    { label: isAr ? 'العملية:' : 'Transaction:', value: getTransactionTitle(selectedTxn) },
                    { label: isAr ? 'المرجع:' : 'Reference:', value: selectedTxn.id, mono: true },
                    { label: isAr ? 'ضريبة زاتكا ١٥٪:' : '15% ZATCA VAT:', value: `SAR ${selectedTxn.vatAmount.toFixed(2)}`, green: true },
                  ].map(({ label, value, mono, green }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: colors.textSecondary }}>{label}</span>
                      <span style={{ fontWeight: 700, fontFamily: mono ? 'monospace' : undefined, color: green ? colors.accentGreen : undefined }}>
                        {value}
                      </span>
                    </div>
                  ))}
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
                        background: 'none', border: 'none', outline: 'none',
                        color: colors.textPrimary, fontSize: '20px', fontWeight: 900,
                        letterSpacing: '0.3em', width: '100%',
                        direction: 'ltr', textAlign: isRtl ? 'right' : 'left',
                      }}
                    />
                  </div>
                </div>

                {refundError && (
                  <div style={{ fontSize: '12px', color: colors.dangerText, fontWeight: 700 }}>{refundError}</div>
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
    </div>
  );
};
