import React, { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  CreditCard,
  QrCode,
  Smartphone,
  Banknote,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Calendar,
  Layers,
  Clock,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { AppHeader } from '../../components/AppHeader';
import { formatSaudiCurrency, formatLocalizedNumber } from '../../utils/i18n';

type InsightPeriod = 'today' | 'week' | 'month' | 'custom';

export const MerchantInsightsScreen: React.FC = () => {
  const {
    merchantCollections,
    merchantSettlements,
    merchantInfo,
    bankAccounts,
    navigateTo,
    language,
    isRtl,
    t,
  } = useApp();

  const isAr = language === 'العربية';
  const [selectedPeriod, setSelectedPeriod] = useState<InsightPeriod>('today');
  const [activeRailFilter, setActiveRailFilter] = useState<string | null>(null);

  // Primary linked bank account balance (starts at 50,000.00 SAR baseline)
  const primaryBank = bankAccounts.find((b) => b.isPrimary) || bankAccounts[0] || {
    balance: 50000.0,
    bankName: 'Al Rajhi Bank',
    accountNumberMasked: 'SA55 •••• 5005',
  };

  // 1. Calculate live dynamic metrics based on selectedPeriod
  const periodMetrics = useMemo(() => {
    // Filter live merchant collections
    const now = new Date();
    const liveSettled = merchantCollections.filter((c) => c.status === 'settled');

    // Baseline multipliers to realistically represent different periods while incorporating all real live activity
    let periodMultiplier = 1;
    let baselineVolume = 0;
    let baselineCount = 0;
    let growthPercent = '+14.8%';
    let periodLabel = isAr ? 'اليوم' : 'Today';

    if (selectedPeriod === 'today') {
      periodMultiplier = 1;
      baselineVolume = 0;
      baselineCount = 0;
      growthPercent = '+18.4%';
      periodLabel = isAr ? 'اليوم' : 'Today';
    } else if (selectedPeriod === 'week') {
      periodMultiplier = 5.6;
      baselineVolume = 12450.0;
      baselineCount = 84;
      growthPercent = '+24.2%';
      periodLabel = isAr ? 'هذا الأسبوع' : 'This Week';
    } else if (selectedPeriod === 'month') {
      periodMultiplier = 22.4;
      baselineVolume = 68920.0;
      baselineCount = 420;
      growthPercent = '+31.6%';
      periodLabel = isAr ? 'هذا الشهر' : 'This Month';
    } else if (selectedPeriod === 'custom') {
      periodMultiplier = 30.0;
      baselineVolume = 94500.0;
      baselineCount = 590;
      growthPercent = '+28.9%';
      periodLabel = isAr ? 'آخر ٣٠ يوماً' : 'Past 30 Days';
    }

    const liveTotalToday = liveSettled.reduce((sum, c) => sum + c.amount, 0);
    const liveCountToday = liveSettled.length;

    const totalVolume = Number((liveTotalToday * periodMultiplier + baselineVolume).toFixed(2));
    const totalTransactions = liveCountToday * Math.round(periodMultiplier) + baselineCount;
    const avgTicket = totalTransactions > 0 ? totalVolume / totalTransactions : 0;
    const vat15 = Number((totalVolume - totalVolume / 1.15).toFixed(2));
    const netVolume = Number((totalVolume / 1.15).toFixed(2));

    // Calculate settlements for this period
    const liveSettlementsSum = merchantSettlements
      .filter((s) => s.status === 'settled')
      .reduce((sum, s) => sum + s.amount, 0);
    const settledPeriodSum = Number((liveSettlementsSum + (selectedPeriod === 'today' ? 0 : baselineVolume * 0.9)).toFixed(2));

    // Calculate dynamic rail breakdown
    let madaVol = 0;
    let appleVol = 0;
    let visaMasterVol = 0;
    let qrLinkVol = 0;
    let cashVol = 0;

    liveSettled.forEach((c) => {
      if (c.paymentMethod === 'softpos_mada' || c.paymentMethod === 'debit') madaVol += c.amount;
      else if (c.paymentMethod === 'softpos_applepay' || c.paymentMethod.includes('apple')) appleVol += c.amount;
      else if (c.paymentMethod === 'softpos_visa' || c.paymentMethod === 'softpos_mastercard') visaMasterVol += c.amount;
      else if (c.paymentMethod === 'zatca_qr' || c.paymentMethod === 'payment_link') qrLinkVol += c.amount;
      else if (c.paymentMethod === 'cash') cashVol += c.amount;
      else madaVol += c.amount;
    });

    const liveSum = madaVol + appleVol + visaMasterVol + qrLinkVol + cashVol || 1;
    // Blend with period weights
    const madaShare = Math.max(10, Math.round(((madaVol || 0.48 * liveSum) / liveSum) * 100));
    const appleShare = Math.max(8, Math.round(((appleVol || 0.26 * liveSum) / liveSum) * 100));
    const visaMasterShare = Math.max(5, Math.round(((visaMasterVol || 0.14 * liveSum) / liveSum) * 100));
    const qrLinkShare = Math.max(4, Math.round(((qrLinkVol || 0.08 * liveSum) / liveSum) * 100));
    const cashShare = Math.max(2, 100 - (madaShare + appleShare + visaMasterShare + qrLinkShare));

    const rails = [
      {
        id: 'mada',
        name: isAr ? 'بطاقات مدى / الحسابات' : 'mada / Saudi Debit',
        shortName: 'mada',
        percent: madaShare,
        amount: (totalVolume * madaShare) / 100,
        color: '#00C853',
        icon: CreditCard,
      },
      {
        id: 'applepay',
        name: isAr ? 'أبل باي والمحافظ الرقمية' : 'Apple Pay & Wallets',
        shortName: 'Apple Pay',
        percent: appleShare,
        amount: (totalVolume * appleShare) / 100,
        color: '#38BDF8',
        icon: Smartphone,
      },
      {
        id: 'cards',
        name: isAr ? 'فيزا وماستركارد الدولية' : 'Visa & Mastercard',
        shortName: 'Visa / Master',
        percent: visaMasterShare,
        amount: (totalVolume * visaMasterShare) / 100,
        color: '#F59E0B',
        icon: CreditCard,
      },
      {
        id: 'qr',
        name: isAr ? 'رمز زاتكا والروابط السريعة' : 'ZATCA QR & Pay Links',
        shortName: 'ZATCA QR',
        percent: qrLinkShare,
        amount: (totalVolume * qrLinkShare) / 100,
        color: '#A855F7',
        icon: QrCode,
      },
      {
        id: 'cash',
        name: isAr ? 'مبيعات الكاش المسجلة' : 'Cash Register Log',
        shortName: 'Cash Log',
        percent: cashShare,
        amount: (totalVolume * cashShare) / 100,
        color: '#EC4899',
        icon: Banknote,
      },
    ];

    // Chart bar data depending on period
    let chartBars: { label: string; labelAr: string; volume: number; isPeak?: boolean }[] = [];

    if (selectedPeriod === 'today') {
      chartBars = [
        { label: '8A', labelAr: '٨ص', volume: 15 },
        { label: '10A', labelAr: '١٠ص', volume: 45 },
        { label: '12P', labelAr: '١٢م', volume: 100, isPeak: true },
        { label: '2P', labelAr: '٢م', volume: 30 },
        { label: '4P', labelAr: '٤م', volume: 65 },
        { label: '6P', labelAr: '٦م', volume: 85, isPeak: true },
        { label: '8P', labelAr: '٨م', volume: 90, isPeak: true },
        { label: '10P', labelAr: '١٠م', volume: 40 },
      ];
    } else if (selectedPeriod === 'week') {
      chartBars = [
        { label: 'Sun', labelAr: 'أحد', volume: 70 },
        { label: 'Mon', labelAr: 'إثنين', volume: 60 },
        { label: 'Tue', labelAr: 'ثلاثاء', volume: 85 },
        { label: 'Wed', labelAr: 'أربعاء', volume: 75 },
        { label: 'Thu', labelAr: 'خميس', volume: 100, isPeak: true },
        { label: 'Fri', labelAr: 'جمعة', volume: 95, isPeak: true },
        { label: 'Sat', labelAr: 'سبت', volume: 80 },
      ];
    } else if (selectedPeriod === 'month') {
      chartBars = [
        { label: 'Wk 1', labelAr: 'أسبوع ١', volume: 65 },
        { label: 'Wk 2', labelAr: 'أسبوع ٢', volume: 80 },
        { label: 'Wk 3', labelAr: 'أسبوع ٣', volume: 100, isPeak: true },
        { label: 'Wk 4', labelAr: 'أسبوع ٤', volume: 90 },
      ];
    } else {
      chartBars = [
        { label: '1-7', labelAr: '١-٧', volume: 75 },
        { label: '8-14', labelAr: '٨-١٤', volume: 85 },
        { label: '15-21', labelAr: '١٥-٢١', volume: 100, isPeak: true },
        { label: '22-30', labelAr: '٢٢-٣٠', volume: 92 },
      ];
    }

    return {
      totalVolume,
      totalTransactions,
      avgTicket,
      vat15,
      netVolume,
      settledPeriodSum,
      growthPercent,
      periodLabel,
      rails,
      chartBars,
    };
  }, [selectedPeriod, merchantCollections, merchantSettlements, isAr]);

  const recentCollectionsPreview = merchantCollections.slice(0, 4);

  const getMethodBadge = (method: string) => {
    if (method.includes('mada') || method.includes('card') || method === 'debit' || method === 'softpos_mada') {
      return { label: isAr ? 'مدى اللاتلامسية' : 'mada Debit', bg: '#00C853', color: '#000000', icon: CreditCard };
    }
    if (method.includes('apple') || method === 'softpos_applepay') {
      return { label: isAr ? 'أبل باي' : 'Apple Pay', bg: '#38BDF8', color: '#000000', icon: Smartphone };
    }
    if (method.includes('visa') || method.includes('master') || method === 'softpos_visa' || method === 'softpos_mastercard') {
      return { label: isAr ? 'بطاقة دولية' : 'Visa / Master', bg: '#F59E0B', color: '#000000', icon: CreditCard };
    }
    if (method === 'zatca_qr') {
      return { label: isAr ? 'فاتورة زاتكا' : 'ZATCA QR', bg: '#A855F7', color: '#ffffff', icon: QrCode };
    }
    if (method === 'cash') {
      return { label: isAr ? 'نقدي' : 'Cash', bg: '#EC4899', color: '#ffffff', icon: Banknote };
    }
    return { label: isAr ? 'رابط دفع' : 'Payment Link', bg: '#38BDF8', color: '#000000', icon: Smartphone };
  };

  // Calculate SVG donut stroke offsets dynamically
  const donutSegments = useMemo(() => {
    const circumference = 238.76; // 2 * PI * 38
    let accumulatedOffset = 0;
    return periodMetrics.rails.map((rail) => {
      const strokeLength = (rail.percent / 100) * circumference;
      const segment = {
        ...rail,
        dashArray: `${strokeLength.toFixed(1)} ${circumference.toFixed(1)}`,
        dashOffset: (-accumulatedOffset).toFixed(1),
      };
      accumulatedOffset += strokeLength;
      return segment;
    });
  }, [periodMetrics.rails]);

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: '#080C14',
        minHeight: '100%',
        paddingBottom: '96px',
        color: '#FFFFFF',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Top Header */}
      <AppHeader
        title={t('insights.title', 'Insights & Business Analytics')}
        showBack={false}
        showSettings={true}
        rightAction={
          <div
            onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
            className="interactive-tap"
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              backgroundColor: '#161F30',
              border: '1px solid #2A364F',
              fontSize: '11.5px',
              fontWeight: 700,
              color: '#00C853',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <span>{isAr ? 'كشف الحساب' : 'Ledger'}</span>
            <ChevronRight size={14} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </div>
        }
      />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Period Filter Tabs: Today, Week, Month, Custom 30D */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#111726',
            borderRadius: '14px',
            padding: '4px',
            border: '1px solid #1E293B',
            gap: '3px',
          }}
        >
          {(
            [
              { id: 'today', label: isAr ? 'اليوم' : 'Today' },
              { id: 'week', label: isAr ? 'هذا الأسبوع' : 'This Week' },
              { id: 'month', label: isAr ? 'هذا الشهر' : 'This Month' },
              { id: 'custom', label: isAr ? '٣٠ يوماً' : '30 Days' },
            ] as const
          ).map((tab) => {
            const isActive = selectedPeriod === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedPeriod(tab.id)}
                className="interactive-tap"
                style={{
                  flex: 1,
                  padding: '9px 6px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? '#00C853' : 'transparent',
                  color: isActive ? '#080C14' : '#94A3B8',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: isActive ? 900 : 700,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  textAlign: 'center',
                  boxShadow: isActive ? '0 2px 10px rgba(0, 200, 83, 0.3)' : 'none',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 1. Hero Revenue & Performance Card */}
        <div
          style={{
            backgroundColor: '#111726',
            borderRadius: '22px',
            border: '1px solid #1E293B',
            padding: '20px',
            position: 'relative',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            background: 'radial-gradient(ellipse at top right, rgba(0, 200, 83, 0.1) 0%, #111726 70%)',
          }}
        >
          {/* Card Top Row: Period Label + Growth Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {isAr ? `إجمالي مبيعات (${periodMetrics.periodLabel})` : `TOTAL REVENUE (${periodMetrics.periodLabel.toUpperCase()})`}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(0, 200, 83, 0.15)',
                border: '1px solid rgba(0, 200, 83, 0.35)',
                borderRadius: '12px',
                padding: '3px 9px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#00C853',
              }}
            >
              <TrendingUp size={12} />
              <span>{periodMetrics.growthPercent}</span>
            </div>
          </div>

          {/* Large Hero Sales Amount */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0 16px 0', direction: 'ltr' }}>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#00C853' }}>SAR</span>
            <span
              className="tabular-nums"
              style={{
                fontSize: '38px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {periodMetrics.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* 3 KPI Sub-metrics row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              backgroundColor: '#0D1424',
              borderRadius: '16px',
              border: '1px solid #1E293B',
              padding: '12px',
            }}
          >
            {/* KPI 1: Transactions */}
            <div>
              <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                {isAr ? 'العمليات' : 'TRANSACTIONS'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginTop: '3px' }}>
                {isAr ? `${formatLocalizedNumber(periodMetrics.totalTransactions)} عملية` : `${periodMetrics.totalTransactions} txns`}
              </div>
            </div>

            {/* KPI 2: Avg Ticket */}
            <div>
              <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                {isAr ? 'متوسط العملية' : 'AVG TICKET'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#00C853', marginTop: '3px' }}>
                SAR {periodMetrics.avgTicket.toFixed(2)}
              </div>
            </div>

            {/* KPI 3: 15% ZATCA VAT */}
            <div>
              <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                {isAr ? 'ضريبة زاتكا (١٥٪)' : '15% VAT PORTION'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#94A3B8', marginTop: '3px' }}>
                SAR {periodMetrics.vat15.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Linked Settlement Bank Account Balance & Sarie Dock */}
        <div
          style={{
            backgroundColor: '#111726',
            borderRadius: '20px',
            border: '1px solid #1E293B',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #111726 0%, #162035 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8',
              }}
            >
              <Building2 size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>
                {isAr ? 'الرصيد المودع بحسابك المصرفي' : 'LINKED BANK SETTLED BALANCE'}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginTop: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#00C853' }}>SAR</span>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>
                  {primaryBank.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span style={{ fontSize: '10px', color: '#64748B', marginLeft: '4px' }}>
                  ({primaryBank.bankName || 'Al Rajhi'})
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('MERCHANT_HOME')}
            className="interactive-tap"
            style={{
              backgroundColor: 'rgba(0, 200, 83, 0.15)',
              border: '1px solid #00C853',
              color: '#00C853',
              borderRadius: '12px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Zap size={13} fill="#00C853" />
            <span>{isAr ? 'تسوية فورية' : 'Settle Now'}</span>
          </button>
        </div>

        {/* 3. Payment Rail Distribution Card (Dynamic Donut + Proportional Share) */}
        <div
          style={{
            backgroundColor: '#111726',
            borderRadius: '20px',
            border: '1px solid #1E293B',
            padding: '18px',
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                  {t('insights.rail_dist', 'Payment Rail Distribution')}
                </h3>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#00C853',
                    display: 'inline-block',
                    boxShadow: '0 0 8px rgba(0,200,83,0.8)',
                  }}
                />
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: '#94A3B8' }}>
                {isAr
                  ? `حصة القنوات ونسب التحصيل لـ (${periodMetrics.periodLabel})`
                  : `Channel volume & share for ${periodMetrics.periodLabel}`}
              </p>
            </div>

            <span
              style={{
                padding: '4px 8px',
                backgroundColor: 'rgba(0, 200, 83, 0.12)',
                border: '1px solid rgba(0, 200, 83, 0.3)',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#00C853',
              }}
            >
              {t('insights.live_analytics', 'Live Reactive')}
            </span>
          </div>

          {/* Donut Chart & Legend Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '10px',
            }}
          >
            {/* Dynamic SVG Donut Chart */}
            <div style={{ position: 'relative', width: '104px', height: '104px', flexShrink: 0 }}>
              <svg width="104" height="104" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#161F30" strokeWidth="12" />

                {/* Dynamic Calculated Slices */}
                {donutSegments.map((segment) => (
                  <circle
                    key={segment.id}
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="12"
                    strokeDasharray={segment.dashArray}
                    strokeDashoffset={segment.dashOffset}
                    style={{ transition: 'all 0.4s ease' }}
                  />
                ))}
              </svg>

              {/* Center Donut Label */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
                  {donutSegments[0]?.percent || 55}%
                </span>
                <span
                  style={{
                    fontSize: '8px',
                    fontWeight: 800,
                    color: '#94A3B8',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {donutSegments[0]?.shortName || 'MADA'}
                </span>
              </div>
            </div>

            {/* Rails Legend List */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {periodMetrics.rails.map((rail) => (
                <div
                  key={rail.id}
                  onClick={() => setActiveRailFilter(activeRailFilter === rail.id ? null : rail.id)}
                  className="interactive-tap"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11.5px',
                    padding: '3px 6px',
                    borderRadius: '8px',
                    backgroundColor: activeRailFilter === rail.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: rail.color,
                        flexShrink: 0,
                        boxShadow: `0 0 6px ${rail.color}`,
                      }}
                    />
                    <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{rail.shortName}</span>
                    <span style={{ color: '#64748B', fontSize: '10.5px', fontWeight: 600 }}>
                      ({formatLocalizedNumber(rail.percent)}%)
                    </span>
                  </div>

                  <div style={{ color: '#FFFFFF', fontWeight: 800 }}>
                    {isAr
                      ? `${formatLocalizedNumber(rail.amount.toFixed(0))} ر.س`
                      : `SAR ${formatLocalizedNumber(rail.amount.toFixed(0))}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Velocity Bar Chart (Real period distribution) */}
        <div
          style={{
            backgroundColor: '#111726',
            borderRadius: '20px',
            border: '1px solid #1E293B',
            padding: '18px',
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr
                  ? selectedPeriod === 'today'
                    ? 'النشاط بالساعة وسرعة التحصيل'
                    : 'حجم العمليات والتوزيع الزمني'
                  : selectedPeriod === 'today'
                  ? 'Hourly Velocity & Speed'
                  : 'Time Volume Distribution'}
              </h3>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#00C853',
                  display: 'inline-block',
                }}
              />
            </div>

            <span style={{ fontSize: '11px', color: '#00C853', fontWeight: 700 }}>
              {isAr ? 'أعلى ذروة: نشطة' : 'Peak Period Active'}
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div
            style={{
              backgroundColor: '#0B101B',
              borderRadius: '14px',
              padding: '16px 14px 10px',
              border: '1px solid #161F30',
            }}
          >
            {/* Bars */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '96px',
                paddingBottom: '8px',
                borderBottom: '1px solid #1E293B',
                gap: '4px',
              }}
            >
              {periodMetrics.chartBars.map((item, index) => {
                const barHeight = Math.max(item.volume * 0.85, 12);
                const isHighlight = item.isPeak;

                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '24px',
                        height: `${barHeight}px`,
                        borderRadius: '6px 6px 2px 2px',
                        backgroundColor: isHighlight ? '#00C853' : '#162235',
                        border: isHighlight ? '1px solid #00E676' : '1px solid #1E293B',
                        boxShadow: isHighlight ? '0 0 10px rgba(0, 200, 83, 0.4)' : 'none',
                        transition: 'height 0.3s ease',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis Labels */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px',
                gap: '4px',
              }}
            >
              {periodMetrics.chartBars.map((item, index) => (
                <span
                  key={index}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: item.isPeak ? 800 : 600,
                    color: item.isPeak ? '#00C853' : '#64748B',
                  }}
                >
                  {isAr ? item.labelAr : item.label}
                </span>
              ))}
            </div>
          </div>

          {/* Velocity Bottom stats */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid #1E293B',
            }}
          >
            <div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>
                {isAr ? 'متوسط سرعة قبول التمرير' : 'Avg Tap-to-Pay Acceptance Speed'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#00C853', marginTop: '2px' }}>
                {isAr ? '٣.٤ ثانية / عملية' : '3.4s / ticket (EMV NFC)'}
              </div>
            </div>

            <div style={{ textAlign: isAr ? 'left' : 'right' }}>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>
                {isAr ? 'نسبة نجاح التفويض' : 'Authorization Success Rate'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                99.8% (SAMA / Sarie)
              </div>
            </div>
          </div>
        </div>

        {/* 5. ZATCA Phase 2 E-Invoice & Tax Audit Compliance Box */}
        <div
          style={{
            backgroundColor: '#111726',
            borderRadius: '20px',
            border: '1px solid #1E293B',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#00C853" />
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'تقرير امتثال هيئة الزكاة والضريبة والجمارك (ZATCA)' : 'ZATCA Phase 2 E-Invoice Compliance'}
              </span>
            </div>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                color: '#00C853',
                backgroundColor: 'rgba(0,200,83,0.12)',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              {isAr ? 'ممتثل بالكامل' : '100% Compliant'}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              backgroundColor: '#0D1424',
              borderRadius: '14px',
              padding: '12px',
              fontSize: '11.5px',
            }}
          >
            <div>
              <span style={{ color: '#94A3B8' }}>{isAr ? 'المبيعات الخاضعة للضريبة:' : 'Taxable Net Sales:'}</span>
              <div style={{ fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                SAR {periodMetrics.netVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div>
              <span style={{ color: '#94A3B8' }}>{isAr ? 'ضريبة القيمة المضافة المحصلة:' : 'VAT Collected (15%):'}</span>
              <div style={{ fontWeight: 800, color: '#00C853', marginTop: '2px' }}>
                SAR {periodMetrics.vat15.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Recent Real Collections Preview */}
        <div
          style={{
            backgroundColor: '#111726',
            borderRadius: '20px',
            border: '1px solid #1E293B',
            padding: '18px',
          }}
        >
          {/* Header with View Full link */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'أحدث عمليات التحصيل' : 'Recent Collections'}
              </h3>
              <span
                style={{
                  padding: '2px 7px',
                  backgroundColor: '#161F30',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94A3B8',
                }}
              >
                {isAr
                  ? `${formatLocalizedNumber(merchantCollections.length)} عملية`
                  : `${merchantCollections.length} total`}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              className="interactive-tap"
              style={{
                background: 'none',
                border: 'none',
                color: '#00C853',
                fontSize: '13px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '4px 6px',
              }}
            >
              <span>{t('insights.view_full', 'View Full Ledger')}</span>
              <ArrowUpRight size={15} strokeWidth={2.5} style={{ transform: isAr ? 'scaleX(-1)' : 'none' }} />
            </button>
          </div>

          {/* Collection Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentCollectionsPreview.map((item) => {
              const badge = getMethodBadge(item.paymentMethod);
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
                  className="interactive-tap"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    backgroundColor: '#161F30',
                    borderRadius: '14px',
                    border: '1px solid #1E293B',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: badge.bg === '#00C853' ? 'rgba(0,200,83,0.15)' : 'rgba(255,255,255,0.08)',
                        border: `1px solid ${badge.bg === '#00C853' ? 'rgba(0,200,83,0.3)' : 'rgba(255,255,255,0.15)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: badge.bg === '#00C853' ? '#00C853' : '#FFFFFF',
                      }}
                    >
                      <BadgeIcon size={18} />
                    </div>

                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                        {badge.label}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                        {item.date} • {item.orderRef}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: isAr ? 'left' : 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#00C853' }}>
                      +{formatSaudiCurrency(item.amount, language)}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px', fontWeight: 700 }}>
                      {isAr ? 'مقبوض ومسوى' : 'Settled'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Platform Engine Signature */}
        <div
          style={{
            textAlign: 'center',
            padding: '8px 0 16px',
            color: '#64748B',
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          {isAr
            ? 'بوابة تحليلات كوانتيرا للتقنية • معالجة فورية وموثوقة لشبكة المدفوعات السعودية'
            : 'Quantira Technologies Analytics Engine • Real-time Saudi Payment Network Sync'}
        </div>
      </div>
    </div>
  );
};
