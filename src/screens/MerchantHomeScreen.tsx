import React, { useState } from 'react';
import {
  Volume2,
  Megaphone,
  Eye,
  EyeOff,
  Zap,
  ChevronRight,
  QrCode,
  SmartphoneNfc,
  Share2,
  Banknote,
  Building2,
  CreditCard,
  TrendingUp,
  Download,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatLocalizedNumber } from '../utils/i18n';
import { Card, StatusBadge, SectionHeader } from '../components/ui';
import { colors } from '../design-system/tokens';

export const MerchantHomeScreen: React.FC = () => {
  const {
    merchantCollections,
    merchantInfo,
    triggerSettleNow,
    navigateTo,
    speakSoundBox,
    openManagerPinModal,
    language,
    isRtl,
  } = useApp();

  const [isSettling, setIsSettling] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const isAr = language === 'العربية';
  const totalToday = merchantCollections.reduce(
    (acc, c) => acc + (c.status === 'settled' ? c.amount : 0),
    0
  );
  const displayTotal = totalToday > 0 ? totalToday : 14850.5;
  const paymentCount = 142;
  const avgTicket = (displayTotal / paymentCount).toFixed(2);

  const handleSettleNowClick = () => {
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

  const handleTestSoundBox = () => {
    speakSoundBox(245.0);
  };

  return (
    <div
      className="fade-in"
      style={{
        width: '100%',
        color: colors.textPrimary,
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: "'IBM Plex Sans Arabic', 'Inter', sans-serif",
      }}
    >
      {/* 1. Top Enterprise Metric KPI Strip (4 Columns) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* Metric 1: Today's Gross Collections */}
        <Card variant="elevated" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 600 }}>
              {isAr ? 'تحصيلات اليوم الإجمالية' : "Today's Gross Sales"}
            </span>
            <StatusBadge status="success" dot={true} size="sm" label={isAr ? 'مباشر' : 'Live'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span style={{ fontSize: '15px', color: '#00FF24', fontWeight: 800 }}>SAR</span>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              {showBalance ? displayTotal.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '••••••'}
            </span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '6px', fontWeight: 500 }}>
            {isAr ? 'شامل ١٥٪ ضريبة القيمة المضافة' : 'Includes 15% VAT breakdown'}
          </div>
        </Card>

        {/* Metric 2: Unsettled Balance */}
        <Card variant="elevated" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 600 }}>
              {isAr ? 'الرصيد القابل للتسوية' : 'Unsettled Available'}
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              aria-label="Toggle Balance Visibility"
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
            >
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span style={{ fontSize: '15px', color: '#00FF24', fontWeight: 800 }}>SAR</span>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#00FF24', letterSpacing: '-0.02em' }}>
              {showBalance ? displayTotal.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '••••••'}
            </span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#00FF24', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={13} />
            <span>{isAr ? 'تحويل فوري ٢٤/٧ عبر سريع' : 'Ready for Instant Sarie Payout'}</span>
          </div>
        </Card>

        {/* Metric 3: Total Transactions Count */}
        <Card variant="elevated" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 600 }}>
              {isAr ? 'عدد العمليات اليوم' : 'Total Transactions'}
            </span>
            <TrendingUp size={16} color="#00FF24" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', marginTop: '10px' }}>
            {formatLocalizedNumber(paymentCount, language)}
          </div>
          <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '6px', fontWeight: 500 }}>
            {isAr ? '+١٨٪ مقارنة بالأمس' : '+18.4% vs yesterday'}
          </div>
        </Card>

        {/* Metric 4: Average Ticket Size */}
        <Card variant="elevated" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 600 }}>
              {isAr ? 'متوسط قيمة العملية' : 'Average Ticket'}
            </span>
            <CreditCard size={16} color="#00FF24" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span style={{ fontSize: '15px', color: '#00FF24', fontWeight: 800 }}>SAR</span>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              {avgTicket}
            </span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '6px', fontWeight: 500 }}>
            {isAr ? 'مدى وأبل باي والبطاقات' : 'mada, Apple Pay, & Cards'}
          </div>
        </Card>
      </div>

      {/* 2. Main Desktop 2-Column Dashboard Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column (65%): SoundBox Alert, Quick Action Hub & Recent Collections Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Smart SoundBox Pro Status Card */}
          <Card
            variant="interactive"
            onClick={() => navigateTo('SOUNDBOX_NOTIFIER')}
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#0E1422',
              border: '1px solid rgba(0, 255, 36, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 255, 36, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00FF24',
                  flexShrink: 0,
                }}
              >
                <Volume2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'جهاز الإشعار الصوتي الذكي (SoundBox Pro)' : 'Smart SoundBox Pro Speaker'}
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                  {isAr ? 'متصل بشبكة الجيل الرابع 4G • بطارية ٩٨٪ • نطق صوتي فوري بالعربية' : 'Connected via 4G • Battery 98% • Instant Arabic & English voice'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTestSoundBox();
              }}
              className="interactive-tap"
              style={{
                backgroundColor: '#151C2C',
                border: '1px solid #1E293B',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Megaphone size={14} color="#00FF24" />
              <span>{isAr ? 'تجربة الصوت' : 'Test Audio'}</span>
            </button>
          </Card>

          {/* Accept Payment Action Hub (4 Cards) */}
          <div>
            <SectionHeader title={isAr ? 'طرق تحصيل وقبول المدفوعات' : 'Accept Payment Channels'} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {/* Tile 1: Show QR */}
              <Card
                variant="interactive"
                onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
                style={{
                  padding: '18px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(0, 255, 36, 0.12)',
                    border: '1px solid rgba(0, 255, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00FF24',
                  }}
                >
                  <QrCode size={22} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'رمز الفاتورة' : 'ZATCA QR'}
                </span>
              </Card>

              {/* Tile 2: SoftPOS Terminal */}
              <Card
                variant="interactive"
                onClick={() => navigateTo('SOFTPOS_TERMINAL')}
                style={{
                  padding: '18px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(0, 255, 36, 0.12)',
                    border: '1px solid rgba(0, 255, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00FF24',
                  }}
                >
                  <SmartphoneNfc size={22} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'الدفع باللمس' : 'SoftPOS'}
                </span>
              </Card>

              {/* Tile 3: Send Pay Link */}
              <Card
                variant="interactive"
                onClick={() => navigateTo('PAYMENT_LINK_GENERATOR')}
                style={{
                  padding: '18px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(0, 255, 36, 0.12)',
                    border: '1px solid rgba(0, 255, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00FF24',
                  }}
                >
                  <Share2 size={22} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'روابط الدفع' : 'Pay Links'}
                </span>
              </Card>

              {/* Tile 4: Cash Sale */}
              <Card
                variant="interactive"
                onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
                style={{
                  padding: '18px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(0, 255, 36, 0.12)',
                    border: '1px solid rgba(0, 255, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00FF24',
                  }}
                >
                  <Banknote size={22} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'سجل النقد' : 'Cash Sales'}
                </span>
              </Card>
            </div>
          </div>

          {/* Recent Collections Live Ledger Table */}
          <Card variant="elevated" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {isAr ? 'أحدث التحصيلات المباشرة' : 'Live Collections Ledger'}
                </h3>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                  {isAr ? 'سجل العمليات المتوافقة مع ضريبة القيمة المضافة ١٥٪' : 'Real-time ZATCA Phase 2 compliant transactions'}
                </div>
              </div>

              <button
                onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
                className="interactive-tap"
                style={{
                  backgroundColor: '#151C2C',
                  border: '1px solid #1E293B',
                  color: '#00FF24',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{isAr ? 'عرض الكل' : 'View Full Ledger'}</span>
                <ChevronRight size={14} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
              </button>
            </div>

            {/* Desktop Table View */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1E293B', color: '#64748B', fontSize: '12px', fontWeight: 700 }}>
                    <th style={{ padding: '10px 12px' }}>{isAr ? 'العميل / الطريقة' : 'Customer / Method'}</th>
                    <th style={{ padding: '10px 12px' }}>{isAr ? 'المرجع البنكي UTR' : 'Sarie Reference'}</th>
                    <th style={{ padding: '10px 12px' }}>{isAr ? 'الوقت' : 'Time'}</th>
                    <th style={{ padding: '10px 12px' }}>{isAr ? 'الحالة' : 'Status'}</th>
                    <th style={{ padding: '10px 12px', textAlign: isRtl ? 'left' : 'right' }}>{isAr ? 'المبلغ' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody>
                  {merchantCollections.slice(0, 5).map((col) => (
                    <tr
                      key={col.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        fontSize: '13px',
                      }}
                    >
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: '#161F30',
                              border: '1px solid #1E293B',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 800,
                              color: '#00FF24',
                            }}
                          >
                            {col.customerMasked ? col.customerMasked.slice(0, 2).toUpperCase() : 'TX'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{col.customerMasked || 'Customer'}</div>
                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{col.paymentMethod.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#94A3B8', fontFamily: 'monospace', fontSize: '12px' }}>
                        {col.id}
                      </td>
                      <td style={{ padding: '12px', color: '#94A3B8', fontSize: '12px' }}>
                        {col.date}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <StatusBadge
                          status={col.status === 'settled' ? 'success' : col.status === 'refunded' ? 'warning' : 'neutral'}
                          size="sm"
                          label={col.status === 'settled' ? (isAr ? 'مكتمل' : 'Settled') : col.status}
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: isRtl ? 'left' : 'right', fontWeight: 900, color: '#00FF24' }}>
                        SAR {col.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column (35%): Instant Settlement Station, Store Stand QR & Settlement Account */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Instant Sarie Payout Station Card */}
          <Card
            variant="elevated"
            style={{
              padding: '22px',
              backgroundColor: '#0E1422',
              border: '1px solid rgba(0, 255, 36, 0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'محطة التسوية الفورية' : 'Instant Sarie Payout'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(0, 255, 36, 0.15)',
                  color: '#00FF24',
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                {isAr ? 'سريع ٢٤/٧' : 'Sarie 24/7'}
              </span>
            </div>

            <div style={{ margin: '18px 0', padding: '14px', backgroundColor: '#080C14', borderRadius: '12px', border: '1px solid #1E293B' }}>
              <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>{isAr ? 'الحساب البنكي المعتمد' : 'Destination IBAN'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <Building2 size={16} color="#00FF24" />
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {merchantInfo.settlementBank || 'Al Rajhi Bank'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'monospace', marginTop: '4px' }}>
                {merchantInfo.settlementIban || 'SA44 8000 0201 6080 1005 5005'}
              </div>
            </div>

            <button
              onClick={handleSettleNowClick}
              disabled={isSettling}
              className="interactive-tap"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#00FF24',
                color: '#080C14',
                fontSize: '14px',
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(0, 255, 36, 0.35)',
              }}
            >
              <Zap size={18} fill="#080C14" />
              <span>
                {isSettling
                  ? (isAr ? 'جاري التحويل عبر سريع...' : 'Processing Payout...')
                  : (isAr ? `تسوية ${displayTotal.toFixed(2)} ر.س للبنك` : `Settle SAR ${displayTotal.toFixed(2)} Now`)}
              </span>
            </button>
          </Card>

          {/* Store Stand QR Card Preview */}
          <Card variant="elevated" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'باركود المتجر المعتمد' : 'Store Stand QR'}
              </span>
              <span style={{ fontSize: '11px', color: '#00FF24', fontWeight: 800 }}>ZATCA Phase 2</span>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px',
                display: 'inline-block',
                margin: '8px auto',
              }}
            >
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://qtpay-merchant.vercel.app"
                alt="Store QR"
                style={{ width: '150px', height: '150px', display: 'block' }}
              />
            </div>

            <div style={{ fontSize: '12px', color: '#94A3B8', margin: '10px 0' }}>
              {merchantInfo.businessName || 'GreenLeaf Markets LLC'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '12px' }}>
              <button
                onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
                className="interactive-tap"
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#151C2C',
                  border: '1px solid #1E293B',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Download size={14} color="#00FF24" />
                <span>{isAr ? 'تحميل الملصق' : 'Get Poster'}</span>
              </button>

              <button
                onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
                className="interactive-tap"
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#151C2C',
                  border: '1px solid #1E293B',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Share2 size={14} color="#00FF24" />
                <span>{isAr ? 'مشاركة' : 'Share'}</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
