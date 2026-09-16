import React, { useState } from 'react';
import {
  ArrowUpRight,
  CreditCard,
  QrCode,
  Smartphone,
  Banknote,
  Building2,
  TrendingUp,
  Receipt,
  ShieldCheck,
  Zap,
  Activity,
  ShoppingBag,
  Clock,
  CalendarRange,
  CalendarDays,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { AppHeader } from '../components/AppHeader';
import { formatSaudiCurrency, formatLocalizedNumber } from '../utils/i18n';
import { Card, MetricTile, StatusBadge, SectionHeader, ListRow, FilterPills } from '../components/ui';
import { colors, spacing, radii } from '../design-system/tokens';

export const MerchantInsightsScreen: React.FC = () => {
  const {
    merchantCollections,
    merchantInfo,
    navigateTo,
    language,
    t,
  } = useApp();

  const isAr = language === 'العربية';
  const [selectedPeriod, setSelectedPeriod] = useState<string>('today');

  // Compute live aggregates from collections or reference baseline
  const totalVolume = merchantCollections.reduce((sum, c) => sum + (c.status === 'settled' ? c.amount : 0), 0) || 1862.0;
  const settledCount = merchantCollections.filter((c) => c.status === 'settled').length || 18;
  const avgTicket = settledCount > 0 ? totalVolume / settledCount : 103.45;
  const settlementReady = totalVolume;

  // Rail Distribution percentages & values
  const railStats = [
    {
      name: t('insights.cards_tap', 'Debit & Cards (Tap to Pay)'),
      shortName: 'Cards / SoftPOS',
      percent: 58,
      amount: totalVolume * 0.58,
      color: colors.accentGreen,
      icon: CreditCard,
    },
    {
      name: t('insights.apple_pay', 'Apple Pay & Wallets'),
      shortName: 'Apple Pay',
      percent: 24,
      amount: totalVolume * 0.24,
      color: colors.accentBlue,
      icon: Smartphone,
    },
    {
      name: t('insights.zatca_qr', 'ZATCA Dynamic QR'),
      shortName: 'ZATCA QR',
      percent: 14,
      amount: totalVolume * 0.14,
      color: colors.accentPurple,
      icon: QrCode,
    },
    {
      name: t('insights.cash_log', 'Cash Register Log'),
      shortName: 'Cash Log',
      percent: 4,
      amount: totalVolume * 0.04,
      color: colors.accentAmber,
      icon: Banknote,
    },
  ];

  // Hourly Activity Velocity data
  const hourlyData = [
    { hour: '9A', hourAr: '٩ص', volume: 15, count: 1, isPeak: false },
    { hour: '10A', hourAr: '١٠ص', volume: 30, count: 2, isPeak: false },
    { hour: '11A', hourAr: '١١ص', volume: 100, count: 4, isPeak: true },
    { hour: '12P', hourAr: '١٢م', volume: 85, count: 3, isPeak: true },
    { hour: '1P', hourAr: '١م', volume: 25, count: 2, isPeak: false },
    { hour: '2P', hourAr: '٢م', volume: 35, count: 2, isPeak: false },
    { hour: '3P', hourAr: '٣م', volume: 20, count: 1, isPeak: false },
    { hour: '4P', hourAr: '٤م', volume: 75, count: 3, isPeak: true },
  ];

  const recentCollectionsPreview = merchantCollections.slice(0, 3);

  const getMethodBadge = (method: string): { label: string; status: 'success' | 'purple' | 'warning' | 'info'; icon: React.ReactNode } => {
    if (method.includes('mada') || method.includes('card') || method.startsWith('softpos')) {
      return { label: isAr ? 'بطاقة بنكية' : 'Debit Card', status: 'success', icon: <CreditCard size={18} /> };
    }
    if (method === 'zatca_qr') {
      return { label: isAr ? 'فاتورة زكاة' : 'ZATCA QR', status: 'purple', icon: <QrCode size={18} /> };
    }
    if (method === 'cash') {
      return { label: isAr ? 'نقدي' : 'Cash', status: 'warning', icon: <Banknote size={18} /> };
    }
    return { label: isAr ? 'دفع إلكتروني' : 'Payment Link', status: 'info', icon: <Smartphone size={18} /> };
  };

  const filterTabs = [
    { id: 'today', label: t('insights.tab_today', 'Today'), icon: <Clock size={13} /> },
    { id: 'week', label: t('insights.tab_week', 'This Week'), icon: <CalendarRange size={13} /> },
    { id: 'month', label: t('insights.tab_month', 'This Month'), icon: <CalendarDays size={13} /> },
  ];

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: colors.bgPage,
        minHeight: '100%',
        paddingBottom: '96px',
        color: colors.textPrimary,
      }}
    >
      {/* Top Header */}
      <AppHeader
        title={t('insights.title', 'Insights & Analytics')}
        showBack={false}
        showSettings={true}
      />

      <div style={{ padding: `${spacing.space4} ${spacing.space5}`, display: 'flex', flexDirection: 'column', gap: spacing.space4 }}>
        {/* Period Filter Tabs */}
        <FilterPills
          tabs={filterTabs}
          activeId={selectedPeriod}
          onSelect={(id) => setSelectedPeriod(id)}
        />

        {/* 1. Top KPI 3-Cards Row (Using MetricTile primitives with icons) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '8px',
          }}
        >
          {/* Card 1: TOTAL SALES */}
          <MetricTile
            title={t('insights.total_sales', 'SALES')}
            icon={<TrendingUp size={14} color={colors.accentGreen} />}
            value={isAr ? `${formatLocalizedNumber(Math.round(totalVolume))} ر.س` : `SAR ${formatLocalizedNumber(Math.round(totalVolume))}`}
            subtitle={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: colors.textSecondary }}>
                <CheckCircle2 size={11} color={colors.accentGreen} />
                {isAr ? `${formatLocalizedNumber(settledCount)} عملية` : `${settledCount} txns`}
              </span>
            }
            style={{ padding: '12px 10px', minWidth: 0 }}
          />

          {/* Card 2: AVG TICKET (Highlighted Green) */}
          <MetricTile
            title={t('insights.avg_ticket', 'AVG TICKET')}
            icon={<Receipt size={14} color={colors.accentGreen} />}
            value={isAr ? `${formatLocalizedNumber(avgTicket.toFixed(1))} ر.س` : `SAR ${formatLocalizedNumber(avgTicket.toFixed(1))}`}
            subtitle={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: colors.accentGreenBright }}>
                <Zap size={11} />
                {isAr ? 'لكل عميل' : 'per ticket'}
              </span>
            }
            highlightGreen={true}
            style={{ padding: '12px 10px', minWidth: 0 }}
          />

          {/* Card 3: SETTLEMENT */}
          <MetricTile
            title={t('insights.settlement', 'PAYOUT')}
            icon={<ShieldCheck size={14} color={colors.accentGreen} />}
            value={isAr ? `${formatLocalizedNumber(Math.round(settlementReady))} ر.س` : `SAR ${formatLocalizedNumber(Math.round(settlementReady))}`}
            subtitle={
              <span style={{ color: colors.accentGreen, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <CheckCircle2 size={11} />
                {isAr ? 'جاهز للصرف' : 'Auto Ready'}
              </span>
            }
            style={{ padding: '12px 10px', minWidth: 0 }}
          />
        </div>

        {/* 2. Payment Rail Distribution Card */}
        <Card
          variant="elevated"
          style={{
            padding: '16px',
          }}
        >
          {/* Card Header */}
          <SectionHeader
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space2 }}>
                <Activity size={15} color={colors.accentGreen} />
                <span>{t('insights.rail_dist', 'Payment Rails')}</span>
              </div>
            }
            badge={
              <StatusBadge
                status="success"
                size="sm"
                label={t('insights.live_analytics', 'Live')}
              />
            }
            style={{ marginBottom: spacing.space3 }}
          />

          {/* Donut Chart & Legend Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginTop: spacing.space2,
            }}
          >
            {/* Donut Chart (SVG) */}
            <div style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0 }}>
              <svg width="84" height="84" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke={colors.bgInset} strokeWidth="13" />
                
                {/* Green Segment (58%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke={colors.accentGreen}
                  strokeWidth="13"
                  strokeDasharray="138 238"
                  strokeDashoffset="0"
                />
                
                {/* Cyan Segment (24%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke={colors.accentBlue}
                  strokeWidth="13"
                  strokeDasharray="57 238"
                  strokeDashoffset="-138"
                />

                {/* Purple Segment (14%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke={colors.accentPurple}
                  strokeWidth="13"
                  strokeDasharray="33 238"
                  strokeDashoffset="-195"
                />

                {/* Orange Segment (4%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke={colors.accentAmber}
                  strokeWidth="13"
                  strokeDasharray="10 238"
                  strokeDashoffset="-228"
                />
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
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>
                  82%
                </span>
                <span style={{ fontSize: '8px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {t('insights.digital_share', 'DIGITAL')}
                </span>
              </div>
            </div>

            {/* Legend 3-Column Grid */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {railStats.map((rail, idx) => {
                const RailIcon = rail.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) auto auto',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11.5px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: radii.xs,
                          backgroundColor: colors.bgInset,
                          border: `1px solid ${rail.color}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: rail.color,
                          flexShrink: 0,
                        }}
                      >
                        <RailIcon size={11} strokeWidth={2.4} />
                      </div>
                      <span style={{ color: colors.textPrimary, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '11.5px' }}>
                        {rail.shortName}
                      </span>
                    </div>

                    <span style={{ color: colors.textMuted, fontSize: '11px', fontWeight: 600 }}>
                      {formatLocalizedNumber(rail.percent)}%
                    </span>

                    <div style={{ color: colors.textPrimary, fontWeight: 700, fontSize: '11.5px', textAlign: isAr ? 'left' : 'right' }}>
                      {isAr
                        ? `${formatLocalizedNumber(Math.round(rail.amount))} ر.س`
                        : `SAR ${formatLocalizedNumber(Math.round(rail.amount))}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* 3. Hourly Transaction Velocity Card */}
        <Card
          variant="elevated"
          style={{
            padding: '18px',
          }}
        >
          {/* Card Header */}
          <SectionHeader
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space2 }}>
                <Clock size={15} color={colors.accentGreen} />
                <span>{t('insights.hourly_velocity', 'Activity Velocity')}</span>
              </div>
            }
            actionButton={
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  border: '1px solid rgba(0, 200, 83, 0.25)',
                  padding: '3px 8px',
                  borderRadius: radii.full,
                  color: colors.accentGreen,
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                <Zap size={11} fill={colors.accentGreen} />
                <span>{t('insights.peak', 'Peak: 11 AM - 1 PM')}</span>
              </div>
            }
            style={{ marginBottom: spacing.space4 }}
          />

          {/* Bar Chart Visualization Container */}
          <Card
            variant="inset"
            style={{
              padding: '16px 14px 10px',
              backgroundColor: '#0B101B',
            }}
          >
            {/* Bars */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '96px',
                paddingBottom: spacing.space2,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              {hourlyData.map((item, index) => {
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
                        width: '26px',
                        height: `${barHeight}px`,
                        borderRadius: '6px 6px 2px 2px',
                        backgroundColor: isHighlight ? colors.accentGreen : '#162235',
                        border: isHighlight ? `1px solid ${colors.accentGreenBright}` : `1px solid ${colors.border}`,
                        transition: 'height 0.3s ease',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis Hour Labels */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: spacing.space2,
              }}
            >
              {hourlyData.map((item, index) => (
                <span
                  key={index}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: item.isPeak ? 700 : 500,
                    color: item.isPeak ? colors.accentGreen : colors.textMuted,
                  }}
                >
                  {isAr ? item.hourAr : item.hour}
                </span>
              ))}
            </div>
          </Card>

          {/* Bottom Velocity KPI Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginTop: spacing.space3,
              paddingTop: spacing.space3,
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: colors.textSecondary, fontWeight: 600 }}>
                <ShoppingBag size={12} color={colors.accentBlue} />
                <span>{t('insights.busiest_vol', 'Busiest Hour')}</span>
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: colors.textPrimary, marginTop: '3px' }}>
                {isAr ? '٦ عمليات • ٦٤٥ ر.س' : '6 txns • SAR 645'}
              </div>
            </div>

            <div style={{ textAlign: isAr ? 'left' : 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: isAr ? 'flex-start' : 'flex-end', gap: '5px', fontSize: '11px', color: colors.textSecondary, fontWeight: 600 }}>
                <Zap size={12} color={colors.accentGreen} />
                <span>{t('insights.avg_tap_speed', 'Tap Speed')}</span>
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: colors.accentGreen, marginTop: '3px' }}>
                {isAr ? '٣.٨ ثانية / عملية' : '3.8s / ticket'}
              </div>
            </div>
          </div>
        </Card>

        {/* 4. Today's Collections Preview Card */}
        <Card
          variant="elevated"
          style={{
            padding: '18px',
          }}
        >
          {/* Header with View Full link */}
          <SectionHeader
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space2 }}>
                <Receipt size={15} color={colors.accentGreen} />
                <span>{t('insights.todays_collections', 'Recent Sales')}</span>
                <span
                  style={{
                    padding: '2px 7px',
                    backgroundColor: colors.bgInset,
                    borderRadius: radii.xs,
                    fontSize: '11px',
                    fontWeight: 600,
                    color: colors.textSecondary,
                  }}
                >
                  {isAr ? `${formatLocalizedNumber(settledCount)}` : `${settledCount}`}
                </span>
              </div>
            }
            actionButton={
              <button
                type="button"
                onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
                className="interactive-tap"
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.accentGreen,
                  fontSize: '12.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: '4px 6px',
                }}
              >
                <span>{t('insights.view_full', 'View All')}</span>
                <ArrowUpRight size={14} strokeWidth={2.5} style={{ transform: isAr ? 'scaleX(-1)' : 'none' }} />
              </button>
            }
            style={{ marginBottom: spacing.space3 }}
          />

          {/* Collection Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.space2 }}>
            {recentCollectionsPreview.map((item) => {
              const badge = getMethodBadge(item.paymentMethod);
              return (
                <ListRow
                  key={item.id}
                  onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
                  leftIcon={badge.icon}
                  title={badge.label}
                  subtitle={`${item.date} • SoftPOS`}
                  rightAmount={
                    <div style={{ color: colors.accentGreen, fontWeight: 800 }}>
                      +{formatSaudiCurrency(item.amount, language)}
                    </div>
                  }
                  rightBadge={
                    <StatusBadge
                      status={badge.status}
                      size="sm"
                      label={isAr ? 'مقبوض' : 'Paid'}
                    />
                  }
                />
              );
            })}
          </div>
        </Card>

        {/* 5. Direct Sarie Settlement Card */}
        <Card
          variant="interactive"
          onClick={() => navigateTo('MERCHANT_BANK_LINK')}
          style={{
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space3 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: radii.md,
                backgroundColor: colors.bgInset,
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.accentBlue,
                flexShrink: 0,
              }}
            >
              <Building2 size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', fontWeight: 700, color: colors.textPrimary }}>
                <span>{merchantInfo.settlementBank || 'Al Rajhi Bank'}</span>
                <ShieldCheck size={13} color={colors.accentGreen} />
              </div>
              <div style={{ fontSize: '10.5px', color: colors.textSecondary, fontFamily: 'monospace', marginTop: '2px' }}>
                {merchantInfo.settlementIban || 'SA55 8000 0000 6271 5005'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('MERCHANT_BANK_LINK');
            }}
            className="interactive-tap"
            style={{
              padding: '6px 12px',
              borderRadius: radii.sm,
              backgroundColor: colors.bgInset,
              border: `1px solid ${colors.borderStrong}`,
              color: colors.textPrimary,
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isAr ? 'إدارة' : 'Manage'}
          </button>
        </Card>

        {/* Bottom Platform Engine Signature */}
        <div
          style={{
            textAlign: 'center',
            padding: '8px 0 16px',
            color: colors.textMuted,
            fontSize: '11px',
            fontWeight: 500,
          }}
        >
          {isAr
            ? 'بوابة تحليلات كوانتيرا للتقنية • معالجة فورية وموثوقة'
            : 'Quantira Technologies Analytics Engine • Real-time Processing'}
        </div>
      </div>
    </div>
  );
};
