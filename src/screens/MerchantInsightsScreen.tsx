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

export const MerchantInsightsScreen: React.FC = () => {
  const {
    merchantCollections,
    merchantInfo,
    navigateTo,
    language,
    t,
  } = useApp();

  const isAr = language === 'العربية';
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

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
      color: '#00C853',
      icon: CreditCard,
    },
    {
      name: t('insights.apple_pay', 'Apple Pay & Wallets'),
      shortName: 'Apple Pay',
      percent: 24,
      amount: totalVolume * 0.24,
      color: '#38BDF8',
      icon: Smartphone,
    },
    {
      name: t('insights.zatca_qr', 'ZATCA Dynamic QR'),
      shortName: 'ZATCA QR',
      percent: 14,
      amount: totalVolume * 0.14,
      color: '#A855F7',
      icon: QrCode,
    },
    {
      name: t('insights.cash_log', 'Cash Register Log'),
      shortName: 'Cash Log',
      percent: 4,
      amount: totalVolume * 0.04,
      color: '#F59E0B',
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

  const getMethodBadge = (method: string) => {
    if (method.includes('mada') || method.includes('card') || method.startsWith('softpos')) {
      return { label: isAr ? 'بطاقة بنكية' : 'Debit Card', bg: '#00C853', color: '#000000', icon: CreditCard };
    }
    if (method === 'zatca_qr') {
      return { label: isAr ? 'فاتورة زكاة' : 'ZATCA QR', bg: '#A855F7', color: '#ffffff', icon: QrCode };
    }
    if (method === 'cash') {
      return { label: isAr ? 'نقدي' : 'Cash', bg: '#F59E0B', color: '#000000', icon: Banknote };
    }
    return { label: isAr ? 'دفع إلكتروني' : 'Payment Link', bg: '#38BDF8', color: '#000000', icon: Smartphone };
  };

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: '#080C14',
        minHeight: '100%',
        paddingBottom: '96px',
        color: '#FFFFFF',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top Header */}
      <AppHeader
        title={t('insights.title', 'Insights & Analytics')}
        showBack={false}
        showSettings={true}
      />

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Period Filter Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#111726',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid #1E293B',
          }}
        >
          {(
            [
              { id: 'today', label: t('insights.tab_today', 'Today') },
              { id: 'week', label: t('insights.tab_week', 'This Week') },
              { id: 'month', label: t('insights.tab_month', 'This Month') },
            ] as const
          ).map((tab) => {
            const isActive = selectedPeriod === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedPeriod(tab.id)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '9px',
                  backgroundColor: isActive ? '#161F30' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  border: isActive ? '1px solid #334155' : '1px solid transparent',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'center',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 1. Top KPI 3-Cards Row (Exact Reference Structure) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
          }}
        >
          {/* Card 1: TOTAL SALES */}
          <div
            style={{
              backgroundColor: '#111726',
              borderRadius: '16px',
              border: '1px solid #1E293B',
              padding: '14px 12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#94A3B8',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              {t('insights.total_sales', 'TOTAL SALES')}
            </span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                {isAr ? `${formatLocalizedNumber(Math.round(totalVolume))} ر.س` : `SAR ${formatLocalizedNumber(Math.round(totalVolume))}`}
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>
                {isAr ? `${formatLocalizedNumber(settledCount)} عملية` : `${settledCount} txns`}
              </div>
            </div>
          </div>

          {/* Card 2: AVG TICKET (Highlighted Green) */}
          <div
            style={{
              backgroundColor: '#111726',
              borderRadius: '16px',
              border: '1px solid #1E293B',
              padding: '14px 12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#94A3B8',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              {t('insights.avg_ticket', 'AVG TICKET')}
            </span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#00C853', letterSpacing: '-0.02em' }}>
                {isAr ? `${formatLocalizedNumber(avgTicket.toFixed(2))} ر.س` : `SAR ${formatLocalizedNumber(avgTicket.toFixed(2))}`}
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>
                {isAr ? 'لكل عميل' : 'per ticket'}
              </div>
            </div>
          </div>

          {/* Card 3: SETTLEMENT */}
          <div
            style={{
              backgroundColor: '#111726',
              borderRadius: '16px',
              border: '1px solid #1E293B',
              padding: '14px 12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#94A3B8',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              {t('insights.settlement', 'SETTLEMENT')}
            </span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                {isAr ? `${formatLocalizedNumber(Math.round(settlementReady))} ر.س` : `SAR ${formatLocalizedNumber(Math.round(settlementReady))}`}
              </div>
              <div style={{ fontSize: '10px', color: '#00C853', marginTop: '2px', fontWeight: 600 }}>
                {isAr ? 'مستحق الصرف' : 'Auto Ready'}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Payment Rail Distribution Card (Reference Match) */}
        <div
          style={{
            backgroundColor: '#111726',
            borderRadius: '20px',
            border: '1px solid #1E293B',
            padding: '18px 18px',
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
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
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#94A3B8' }}>
                {t('insights.volume_share', 'Volume share & net collection value')}
              </p>
            </div>

            <span
              style={{
                padding: '4px 8px',
                backgroundColor: 'rgba(0, 200, 83, 0.12)',
                border: '1px solid rgba(0, 200, 83, 0.3)',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#00C853',
              }}
            >
              {t('insights.live_analytics', 'Live Analytics')}
            </span>
          </div>

          {/* Donut Chart & Legend Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              marginTop: '12px',
            }}
          >
            {/* Donut Chart (SVG) */}
            <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#161F30" strokeWidth="12" />
                
                {/* Green Segment (58%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#00C853"
                  strokeWidth="12"
                  strokeDasharray="138 238"
                  strokeDashoffset="0"
                />
                
                {/* Cyan Segment (24%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="12"
                  strokeDasharray="57 238"
                  strokeDashoffset="-138"
                />

                {/* Purple Segment (14%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="12"
                  strokeDasharray="33 238"
                  strokeDashoffset="-195"
                />

                {/* Orange Segment (4%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="12"
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
                <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {t('insights.digital_share', 'DIGITAL')}
                </span>
              </div>
            </div>

            {/* Legend List */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {railStats.map((rail, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: rail.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: '#FFFFFF', fontWeight: 600 }}>
                      {rail.shortName}
                    </span>
                    <span style={{ color: '#64748B', fontSize: '11px', fontWeight: 500 }}>
                      ({formatLocalizedNumber(rail.percent)}%)
                    </span>
                  </div>

                  <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px' }}>
                    {isAr
                      ? `${formatLocalizedNumber(rail.amount.toFixed(2))} ر.س`
                      : `SAR ${formatLocalizedNumber(rail.amount.toFixed(2))}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Hourly Transaction Velocity Card (Reference Match) */}
        <div
          style={{
            backgroundColor: '#111726',
            borderRadius: '20px',
            border: '1px solid #1E293B',
            padding: '18px 18px',
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
                {t('insights.hourly_velocity', 'Hourly Transaction Velocity')}
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

            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
              {t('insights.peak', 'Peak: 11 AM - 1 PM')}
            </span>
          </div>

          {/* Bar Chart Visualization Container */}
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
                        backgroundColor: isHighlight ? '#00C853' : '#162235',
                        border: isHighlight ? '1px solid #00E676' : '1px solid #1E293B',
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
                marginTop: '8px',
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
                    color: item.isPeak ? '#00C853' : '#64748B',
                  }}
                >
                  {isAr ? item.hourAr : item.hour}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Velocity KPI Stats */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px solid #1E293B',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>
                {t('insights.busiest_vol', 'Busiest Hour Volume')}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                {isAr ? '٦ عمليات • ٦٤٥.٠٠ ر.س' : '6 txns • SAR 645.00'}
              </div>
            </div>

            <div style={{ textAlign: isAr ? 'left' : 'right' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>
                {t('insights.avg_tap_speed', 'Avg Tap-to-Pay Speed')}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#00C853', marginTop: '2px' }}>
                {isAr ? '٣.٨ ثانية / عملية' : '3.8s / ticket'}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Today's Collections Preview Card (Direct link to full Collections sub-page) */}
        <div
          style={{
            backgroundColor: '#111726',
            borderRadius: '20px',
            border: '1px solid #1E293B',
            padding: '18px 18px',
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
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
                {t('insights.todays_collections', "Today's Collections")}
              </h3>
              <span
                style={{
                  padding: '2px 7px',
                  backgroundColor: '#161F30',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#94A3B8',
                }}
              >
                {isAr ? `${formatLocalizedNumber(settledCount)} إجمالي` : `${settledCount} total`}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              style={{
                background: 'none',
                border: 'none',
                color: '#00C853',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '4px 6px',
              }}
            >
              {t('insights.view_full', 'View Full')}
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
                        backgroundColor: badge.bg === '#00C853' ? 'rgba(0,200,83,0.15)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${badge.bg === '#00C853' ? 'rgba(0,200,83,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: badge.bg === '#00C853' ? '#00C853' : '#FFFFFF',
                      }}
                    >
                      <BadgeIcon size={18} />
                    </div>

                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                        {badge.label}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                        {item.date} • SoftPOS
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: isAr ? 'left' : 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#00C853' }}>
                      +{formatSaudiCurrency(item.amount, language)}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
                      {isAr ? 'مقبوض' : 'Paid'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Direct Sarie Settlement Card */}
        <div
          style={{
            backgroundColor: '#111726',
            borderRadius: '16px',
            border: '1px solid #1E293B',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={20} color="#38BDF8" />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>
                {merchantInfo.settlementBank || 'Al Rajhi Bank'}
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                {merchantInfo.settlementIban || 'SA55 8000 0000 6271 5005'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('MERCHANT_BANK_LINK')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: '#161F30',
              border: '1px solid #334155',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isAr ? 'إدارة الحساب' : 'Manage'}
          </button>
        </div>

        {/* Bottom Platform Engine Signature */}
        <div
          style={{
            textAlign: 'center',
            padding: '8px 0 16px',
            color: '#64748B',
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
