import React, { useState } from 'react';
import {
  ArrowUpRight,
  CreditCard,
  QrCode,
  Smartphone,
  Banknote,
  Building2,
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
    { id: 'today', label: t('insights.tab_today', 'Today') },
    { id: 'week', label: t('insights.tab_week', 'This Week') },
    { id: 'month', label: t('insights.tab_month', 'This Month') },
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

        {/* 1. Top KPI 3-Cards Row (Using MetricTile primitives) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '8px',
          }}
        >
          {/* Card 1: TOTAL SALES */}
          <MetricTile
            title={t('insights.total_sales', 'TOTAL SALES')}
            value={isAr ? `${formatLocalizedNumber(Math.round(totalVolume))} ر.س` : `SAR ${formatLocalizedNumber(Math.round(totalVolume))}`}
            subtitle={isAr ? `${formatLocalizedNumber(settledCount)} عملية` : `${settledCount} txns`}
            style={{ padding: '12px 10px', minWidth: 0 }}
          />

          {/* Card 2: AVG TICKET (Highlighted Green) */}
          <MetricTile
            title={t('insights.avg_ticket', 'AVG TICKET')}
            value={isAr ? `${formatLocalizedNumber(avgTicket.toFixed(1))} ر.س` : `SAR ${formatLocalizedNumber(avgTicket.toFixed(1))}`}
            subtitle={isAr ? 'لكل عميل' : 'per ticket'}
            highlightGreen={true}
            style={{ padding: '12px 10px', minWidth: 0 }}
          />

          {/* Card 3: SETTLEMENT */}
          <MetricTile
            title={t('insights.settlement', 'SETTLEMENT')}
            value={isAr ? `${formatLocalizedNumber(Math.round(settlementReady))} ر.س` : `SAR ${formatLocalizedNumber(Math.round(settlementReady))}`}
            subtitle={<span style={{ color: colors.accentGreen, fontWeight: 600 }}>{isAr ? 'مستحق الصرف' : 'Auto Ready'}</span>}
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
                <span>{t('insights.rail_dist', 'Payment Rail Distribution')}</span>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: radii.full,
                    backgroundColor: colors.accentGreen,
                    display: 'inline-block',
                    boxShadow: '0 0 8px rgba(0,200,83,0.8)',
                  }}
                />
              </div>
            }
            subtitle={t('insights.volume_share', 'Volume share & net collection value')}
            badge={
              <StatusBadge
                status="success"
                size="sm"
                label={t('insights.live_analytics', 'Live Analytics')}
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
              {railStats.map((rail, idx) => (
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
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: radii.full,
                        backgroundColor: rail.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: colors.textPrimary, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
              ))}
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
                <span>{t('insights.hourly_velocity', 'Hourly Transaction Velocity')}</span>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: radii.full,
                    backgroundColor: colors.accentGreen,
                    display: 'inline-block',
                  }}
                />
              </div>
            }
            actionButton={
              <span style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: 600 }}>
                {t('insights.peak', 'Peak: 11 AM - 1 PM')}
              </span>
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
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: spacing.space3,
              paddingTop: spacing.space3,
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: 500 }}>
                {t('insights.busiest_vol', 'Busiest Hour Volume')}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: colors.textPrimary, marginTop: '2px' }}>
                {isAr ? '٦ عمليات • ٦٤٥.٠٠ ر.س' : '6 txns • SAR 645.00'}
              </div>
            </div>

            <div style={{ textAlign: isAr ? 'left' : 'right' }}>
              <div style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: 500 }}>
                {t('insights.avg_tap_speed', 'Avg Tap-to-Pay Speed')}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: colors.accentGreen, marginTop: '2px' }}>
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
                <span>{t('insights.todays_collections', "Today's Collections")}</span>
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
                  {isAr ? `${formatLocalizedNumber(settledCount)} إجمالي` : `${settledCount} total`}
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
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: '4px 6px',
                }}
              >
                <span>{t('insights.view_full', 'View Full')}</span>
                <ArrowUpRight size={15} strokeWidth={2.5} style={{ transform: isAr ? 'scaleX(-1)' : 'none' }} />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space2 }}>
            <Building2 size={20} color={colors.accentBlue} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: colors.textPrimary }}>
                {merchantInfo.settlementBank || 'Al Rajhi Bank'}
              </div>
              <div style={{ fontSize: '10px', color: colors.textSecondary }}>
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
            {isAr ? 'إدارة الحساب' : 'Manage'}
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
