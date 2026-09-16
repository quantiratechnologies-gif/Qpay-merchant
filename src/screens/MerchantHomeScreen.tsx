import React, { useState } from 'react';
import {
  QrCode,
  Link2,
  Volume2,
  ChevronRight,
  Landmark,
  Monitor,
  ReceiptText,
  ShieldCheck,
  SmartphoneNfc,
  Zap,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import { translateText, formatLocalizedNumber, formatSaudiCurrency } from '../utils/i18n';
import { SamaLogo } from '../components/SamaLogo';
import { PaymentPartnerLogo } from '../components/PaymentPartnerLogo';
import { AppHeader } from '../components/AppHeader';

export const MerchantHomeScreen: React.FC = () => {
  const {
    merchantInfo,
    merchantCollections,
    triggerSettleNow,
    navigateTo,
    speakSoundBox,
    language,
    isRtl,
    t,
  } = useApp();

  const [isSettling, setIsSettling] = useState(false);
  const [settleSuccessMsg, setSettleSuccessMsg] = useState<string | null>(null);

  const isAr = language === 'العربية';
  const totalToday = merchantCollections.reduce((acc, c) => acc + (c.status === 'settled' ? c.amount : 0), 0);
  const totalVat = merchantCollections.reduce((acc, c) => acc + (c.status === 'settled' ? c.vatAmount : 0), 0);
  const settledCount = merchantCollections.filter((c) => c.status === 'settled').length;
  const recentCollections = merchantCollections.slice(0, 3);

  const handleSettleNowClick = async () => {
    setIsSettling(true);
    try {
      const settlement = await triggerSettleNow();
      setSettleSuccessMsg(
        isAr
          ? `تم إرسال تسوية فورية بقيمة ${formatSaudiCurrency(settlement.amount, language)} عبر سريع إلى ${settlement.bankName}`
          : `Instant payout of SAR ${settlement.amount.toFixed(2)} dispatched via Sarie to ${settlement.bankName}`
      );
      setTimeout(() => {
        setSettleSuccessMsg(null);
      }, 4000);
    } catch {
      // noop
    } finally {
      setIsSettling(false);
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'softpos_mada':
        return { label: isAr ? 'مدى Tap' : 'mada Tap', bg: 'rgba(0, 200, 83, 0.12)', color: '#00C853' };
      case 'softpos_applepay':
        return { label: isAr ? 'أبل باي' : 'Apple Pay', bg: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6' };
      case 'softpos_visa':
      case 'softpos_mastercard':
        return { label: isAr ? 'بطاقة بنكية' : 'Card Tap', bg: 'rgba(6, 182, 212, 0.12)', color: '#06B6D4' };
      case 'zatca_qr':
        return { label: isAr ? 'رمز زاتكا' : 'ZATCA QR', bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' };
      case 'payment_link':
        return { label: isAr ? 'رابط دفع' : 'Payment Link', bg: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6' };
      default:
        return { label: isAr ? 'نقاط بيع سريع' : 'Sarie POS', bg: 'rgba(0, 200, 83, 0.12)', color: '#00C853' };
    }
  };

  const paymentMixData = [
    { name: isAr ? 'مدى Tap' : 'mada Tap', percentage: 38, color: '#00C853', amount: totalToday * 0.38 },
    { name: isAr ? 'Apple Pay' : 'Apple Pay', percentage: 26, color: '#3B82F6', amount: totalToday * 0.26 },
    { name: isAr ? 'رمز زاتكا QR' : 'ZATCA QR', percentage: 18, color: '#F59E0B', amount: totalToday * 0.18 },
    { name: isAr ? 'روابط الدفع' : 'Payment Link', percentage: 12, color: '#8B5CF6', amount: totalToday * 0.12 },
    { name: isAr ? 'سريع POS' : 'Sarie POS', percentage: 6, color: '#06B6D4', amount: totalToday * 0.06 },
  ];

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: '#0B0E14',
        minHeight: '100vh',
        paddingBottom: '96px',
        color: '#F8FAFC',
        userSelect: 'none',
      }}
    >
      {/* 1. Standardized Responsive AppHeader */}
      <AppHeader
        showBack={false}
        rightAction={
          <button
            onClick={() => navigateTo('MERCHANT_WEB')}
            title={isAr ? 'فتح بوابة الإدارة الإلكترونية' : 'Open Merchant Web Admin'}
            className="interactive-tap"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#131B26',
              border: '1px solid #1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00C853',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <Monitor size={18} />
          </button>
        }
      />

      {/* 2. Store Metadata Banner */}
      <div
        style={{
          backgroundColor: '#0F151F',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #1E293B',
        }}
      >
        <div className="store-info">
          <h1 style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
            {translateText(merchantInfo.businessName || 'Starmart Supermarket', language)}
          </h1>
          <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', margin: 0 }} dir="ltr">
            {isAr ? `السجل التجاري: ${formatLocalizedNumber(merchantInfo.crNumber || '1010849201', language)}` : `CR: ${merchantInfo.crNumber || '1010849201'}`}
          </p>
        </div>
        <div
          style={{
            backgroundColor: 'rgba(0, 200, 83, 0.1)',
            color: '#00C853',
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '20px',
            border: '1px solid rgba(0, 200, 83, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <ShieldCheck size={13} />
          <span>SoftPOS</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '16px 20px 0 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Instant SettleNow Success Banner / Toast */}
        {settleSuccessMsg && (
          <div
            style={{
              backgroundColor: 'rgba(0, 200, 83, 0.15)',
              border: '1px solid #00C853',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#F8FAFC',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            <CheckCircle2 size={18} color="#00C853" style={{ flexShrink: 0 }} />
            <span>{settleSuccessMsg}</span>
          </div>
        )}

        {/* SettleNow Instant Sarie Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #07271B 0%, #0D3B2A 50%, #131B26 100%)',
            border: '1px solid rgba(0, 200, 83, 0.35)',
            borderRadius: '16px',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 8px 24px rgba(0, 200, 83, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 200, 83, 0.15)',
                border: '1px solid rgba(0, 200, 83, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00C853',
                flexShrink: 0,
              }}
            >
              <Zap size={20} fill="#00C853" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {t('settlenow.banner_title', 'SettleNow — Instant Sarie Transfer')}
                </h3>
                <span style={{ fontSize: '9.5px', fontWeight: 800, backgroundColor: '#00C853', color: '#000000', padding: '1px 5px', borderRadius: '4px' }}>
                  {isAr ? 'فوري' : 'INSTANT'}
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#94A3B8', margin: '3px 0 0 0', lineHeight: 1.3 }}>
                {t('settlenow.banner_sub', 'Direct 24/7 liquidity straight to your IBAN with 0 fees')}
              </p>
            </div>
          </div>

          <button
            onClick={handleSettleNowClick}
            disabled={isSettling}
            className="interactive-tap"
            style={{
              backgroundColor: '#00C853',
              color: '#000000',
              border: 'none',
              borderRadius: '10px',
              padding: '9px 14px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 12px rgba(0, 200, 83, 0.3)',
              flexShrink: 0,
            }}
          >
            {isSettling ? (
              isAr ? 'جاري التحويل...' : 'Settling...'
            ) : (
              <>
                <span>{t('settlenow.cta', 'Settle Now')}</span>
                <ArrowUpRight size={14} />
              </>
            )}
          </button>
        </div>

        {/* 3. Collections Overview Card */}
        <div
          style={{
            background: 'linear-gradient(145deg, #131B26 0%, #0F1722 100%)',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Card Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: '#94A3B8',
                textTransform: 'uppercase',
              }}
            >
              {t('merchant.today_sales', "Today's Collections")}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  backgroundColor: 'rgba(0, 200, 83, 0.15)',
                  color: '#00C853',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
              >
                {formatLocalizedNumber(settledCount, language)} {isAr ? 'عمليات مسجلة' : 'Sales Recorded'}
              </span>
              <button
                onClick={() => speakSoundBox(totalToday)}
                title={isAr ? 'إشعار الصندوق الصوتي' : 'SoundBox Voice Notifier'}
                className="interactive-tap"
                style={{
                  background: 'rgba(0, 200, 83, 0.1)',
                  border: '1px solid rgba(0, 200, 83, 0.25)',
                  color: '#00C853',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                <Volume2 size={12} /> {isAr ? 'صوت' : 'Audio'}
              </button>
            </div>
          </div>

          {/* Amount Display */}
          <div
            className="tabular-nums"
            style={{
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#F8FAFC',
              marginBottom: '6px',
            }}
          >
            {formatCurrency(totalToday, language)}
          </div>

          {/* Tax Info */}
          <div
            style={{
              fontSize: '12px',
              color: '#94A3B8',
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid #1E293B',
              fontWeight: 500,
            }}
          >
            {isAr ? (
              <>شامل ضريبة زاتكا ١٥٪ (<span style={{ color: '#F8FAFC', fontWeight: 700 }}>{formatSaudiCurrency(totalVat, language)}</span>)</>
            ) : (
              <>Incl. <span style={{ color: '#F8FAFC', fontWeight: 700 }}>SAR {totalVat.toFixed(2)}</span> ZATCA 15% VAT</>
            )}
          </div>

          {/* Settlement Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              color: '#94A3B8',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Landmark size={14} color="#00C853" />
              <span>{isAr ? `تسوية تلقائية إلى ${translateText(merchantInfo.settlementBank, language)}` : `Auto Settles to ${merchantInfo.settlementBank}`}</span>
            </div>
            <strong style={{ color: '#F8FAFC', fontWeight: 700 }}>{isAr ? '١٢:٠٠ ص' : '12:00 AM'}</strong>
          </div>
        </div>

        {/* 4. Payment Acceptance Suite (4-Column Action Grid) */}
        <div
          style={{
            backgroundColor: '#131B26',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '16px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: '#94A3B8',
              textTransform: 'uppercase',
              marginBottom: '12px',
              display: 'block',
            }}
          >
            {isAr ? 'منظومة قبول المدفوعات' : 'Payment Acceptance Suite'}
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {/* 1. SoftPOS Tap */}
            <div
              onClick={() => navigateTo('SOFTPOS_TERMINAL')}
              className="interactive-tap"
              style={{
                backgroundColor: '#131B26',
                border: '1px solid #1E293B',
                borderRadius: '12px',
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00C853',
                }}
              >
                <SmartphoneNfc size={18} />
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#94A3B8', lineHeight: 1.2 }}>
                {isAr ? 'مدى Tap' : 'SoftPOS Tap'}
              </span>
            </div>

            {/* 2. ZATCA QR */}
            <div
              onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
              className="interactive-tap"
              style={{
                backgroundColor: '#131B26',
                border: '1px solid #1E293B',
                borderRadius: '12px',
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00C853',
                }}
              >
                <QrCode size={18} />
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#94A3B8', lineHeight: 1.2 }}>
                {isAr ? 'رمز زاتكا' : 'ZATCA QR'}
              </span>
            </div>

            {/* 3. Link Pay */}
            <div
              onClick={() => navigateTo('PAYMENT_LINK_GENERATOR')}
              className="interactive-tap"
              style={{
                backgroundColor: '#131B26',
                border: '1px solid #1E293B',
                borderRadius: '12px',
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00C853',
                }}
              >
                <Link2 size={18} />
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#94A3B8', lineHeight: 1.2 }}>
                {isAr ? 'رابط دفع' : 'Link Pay'}
              </span>
            </div>

            {/* 4. SoundBox */}
            <div
              onClick={() => navigateTo('SOUNDBOX_NOTIFIER')}
              className="interactive-tap"
              style={{
                backgroundColor: '#131B26',
                border: '1px solid #1E293B',
                borderRadius: '12px',
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00C853',
                }}
              >
                <Volume2 size={18} />
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#94A3B8', lineHeight: 1.2 }}>
                {isAr ? 'الصوت الذكي' : 'SoundBox'}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Daily Payment Mix Analysis (Conic Donut Chart) */}
        <div
          style={{
            backgroundColor: '#131B26',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: '#94A3B8',
                textTransform: 'uppercase',
              }}
            >
              {isAr ? 'توزيع قنوات الدفع اليومية' : 'Daily Payment Mix'}
            </span>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>
              {isAr ? '٥ قنوات نشطة' : '5 Channels Active'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Donut Chart */}
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'conic-gradient(#00C853 0deg 137deg, #3B82F6 137deg 230deg, #F59E0B 230deg 295deg, #8B5CF6 295deg 338deg, #06B6D4 338deg 360deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '66px',
                  height: '66px',
                  backgroundColor: '#131B26',
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>{isAr ? 'الإجمالي' : 'Total'}</span>
                <strong style={{ fontSize: '11px', color: '#F8FAFC', fontWeight: 700 }}>100%</strong>
              </div>
            </div>

            {/* Breakdown List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginInlineStart: '16px' }}>
              {paymentMixData.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, display: 'inline-block' }} />
                    {item.name}
                  </span>
                  <span style={{ fontWeight: 700, color: '#F8FAFC' }}>
                    {formatLocalizedNumber(item.percentage, language)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Merchant Growth Financing Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #131B26 0%, #1A2738 100%)',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '16px 18px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3B82F6',
                }}
              >
                <TrendingUp size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {t('financing.title', 'Merchant Growth Financing')}
                </h4>
                <span style={{ fontSize: '10.5px', color: '#3B82F6', fontWeight: 700 }}>
                  {t('financing.badge', 'Pre-Approved')} &bull; {isAr ? 'معدل ربح ٠٪ للشهر الأول' : '0% Margin Month 1'}
                </span>
              </div>
            </div>
            <span
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                color: '#60A5FA',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              SAR 50,000
            </span>
          </div>

          <p style={{ fontSize: '11.5px', color: '#94A3B8', margin: '0 0 12px 0', lineHeight: 1.4 }}>
            {t('financing.sub', 'Get instant working capital up to SAR 50,000 based on your card sales')}
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                alert(
                  isAr
                    ? 'تم استلام طلب التمويل بقيمة ٥٠,٠٠٠ ر.س بنجاح! سيتم التواصل معكم فوراً.'
                    : 'Financing request for SAR 50,000 received! An approval specialist will reach out shortly.'
                );
              }}
              className="interactive-tap"
              style={{
                flex: 1,
                backgroundColor: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '9px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={14} color="#60A5FA" />
              <span>{t('financing.cta', 'Get Working Capital')}</span>
            </button>
          </div>
        </div>

        {/* 6. Recent Transactions */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
              {isAr ? 'العمليات الأخيرة' : 'Recent Transactions'}
            </h3>
            <button
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              className="interactive-tap"
              style={{
                background: 'none',
                border: 'none',
                color: '#00C853',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: 0,
              }}
            >
              {isAr ? 'سجل العمليات الكامل' : 'Full Ledger'}{' '}
              <ChevronRight size={16} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            {recentCollections.map((col) => {
              const badge = getMethodBadge(col.paymentMethod);
              return (
                <div
                  key={col.id}
                  onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
                  className="interactive-tap"
                  style={{
                    backgroundColor: '#131B26',
                    border: '1px solid #1E293B',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: badge.color,
                        flexShrink: 0,
                      }}
                    >
                      <ReceiptText size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                        {col.orderRef} • {col.customerMasked}
                      </h4>
                      <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', margin: 0 }}>
                        {badge.label} • {translateText(col.date, language)}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                    <div
                      className="tabular-nums"
                      style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        color: col.status === 'refunded' ? '#FF4757' : '#00C853',
                      }}
                    >
                      {col.status === 'refunded' ? '- ' : '+ '}SAR {col.amount.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>
                      {isAr ? `الضريبة: ${formatSaudiCurrency(col.vatAmount, language)}` : `VAT: SAR ${col.vatAmount.toFixed(2)}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. SAMA & ZATCA Compliance Footer */}
        <div
          style={{
            backgroundColor: '#131B26',
            border: '1px solid #1E293B',
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '4px',
          }}
        >
          <div>
            <div style={{ fontSize: '10px', color: '#00C853', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
              {isAr ? 'محرك مدفوعات معتمد من البنك المركزي' : 'SAMA Certified Merchant Engine'}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>
              {isAr ? 'متوافق مع المرحلة الثانية للفوترة الإلكترونية (زاتكا)' : 'ZATCA Phase 2 E-Invoicing Compliant'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ backgroundColor: '#0B0E14', border: '1px solid #1E293B', borderRadius: '8px', padding: '4px 6px', display: 'flex', alignItems: 'center' }}>
              <PaymentPartnerLogo size={18} width={56} height={28} themeMode="dark" />
            </div>
            <div style={{ backgroundColor: '#0B0E14', border: '1px solid #1E293B', borderRadius: '8px', padding: '4px 6px', display: 'flex', alignItems: 'center' }}>
              <SamaLogo height={14} themeMode="green" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

