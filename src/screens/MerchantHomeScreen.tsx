import React from 'react';
import {
  CreditCard,
  QrCode,
  Link2,
  Volume2,
  ChevronRight,
  Landmark,
  Store,
  Monitor,
  User,
  ReceiptText,
  Radio,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import { translateText, formatLocalizedNumber, formatSaudiCurrency } from '../utils/i18n';
import { SamaLogo } from '../components/SamaLogo';
import { PaymentPartnerLogo } from '../components/PaymentPartnerLogo';
import { AlphPayLogo } from '../components/AlphPayLogo';

export const MerchantHomeScreen: React.FC = () => {
  const {
    merchantInfo,
    merchantCollections,
    navigateTo,
    setUserRole,
    speakSoundBox,
    language,
    isRtl,
    t,
  } = useApp();

  const isAr = language === 'العربية';
  const totalToday = merchantCollections.reduce((acc, c) => acc + (c.status === 'settled' ? c.amount : 0), 0);
  const totalVat = merchantCollections.reduce((acc, c) => acc + (c.status === 'settled' ? c.vatAmount : 0), 0);
  const settledCount = merchantCollections.filter((c) => c.status === 'settled').length;
  const recentCollections = merchantCollections.slice(0, 3);

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'softpos_mada':
        return { label: isAr ? 'مدى Tap' : 'mada Tap', bg: 'rgba(127, 232, 127, 0.12)', color: '#7FE87F' };
      case 'softpos_applepay':
        return { label: isAr ? 'أبل باي' : 'Apple Pay', bg: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF' };
      case 'softpos_visa':
      case 'softpos_mastercard':
        return { label: isAr ? 'بطاقة بنكية' : 'Card Tap', bg: 'rgba(92, 163, 255, 0.15)', color: '#5CA3FF' };
      case 'zatca_qr':
        return { label: isAr ? 'رمز زاتكا' : 'ZATCA QR', bg: 'rgba(235, 180, 50, 0.15)', color: '#EBB432' };
      case 'payment_link':
        return { label: isAr ? 'رابط دفع' : 'Remote Link', bg: 'rgba(180, 120, 255, 0.15)', color: '#B478FF' };
      default:
        return { label: isAr ? 'نقاط بيع سريع' : 'Sarie POS', bg: 'rgba(127, 232, 127, 0.12)', color: '#7FE87F' };
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: '#000000',
        minHeight: '100vh',
        paddingBottom: '96px',
        color: '#FFFFFF',
        userSelect: 'none',
      }}
    >
      {/* 1. Top Merchant Header with Icon-Only Profile, Exact Center Logo & Action Controls */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          backgroundColor: 'rgba(11, 11, 20, 0.96)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #2C2C44',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          minHeight: '58px',
          boxSizing: 'border-box',
        }}
      >
        {/* Left Slot: Merchant Profile Icon (No Text Next to It) */}
        <div style={{ display: 'flex', alignItems: 'center', zIndex: 2, minWidth: '38px' }}>
          <div
            onClick={() => navigateTo('PROFILE')}
            role="button"
            tabIndex={0}
            aria-label="Merchant Profile"
            className="interactive-tap"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(127, 232, 127, 0.15)',
              border: '1.5px solid #7FE87F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7FE87F',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Store size={18} />
          </div>
        </div>

        {/* Exact Top Center Slot: Logo Wordmark with Merchant Indicator */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            zIndex: 1,
          }}
        >
          <div onClick={() => navigateTo('MERCHANT_HOME')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlphPayLogo variant="header" size={22} themeMode="dark" />
            <span
              style={{
                fontSize: '9px',
                fontWeight: 900,
                backgroundColor: '#7FE87F',
                color: '#000000',
                padding: '2px 6px',
                borderRadius: '4px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {isAr ? 'تاجر' : 'MERCHANT'}
            </span>
          </div>
        </div>

        {/* Right Slot: Customer Switch Pill + Web Portal Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
          {/* Role Switcher Button */}
          <button
            onClick={() => {
              setUserRole('customer');
              navigateTo('HOME');
            }}
            title={isAr ? 'التبديل إلى وضع العميل' : 'Switch to Customer Mode'}
            className="interactive-tap"
            style={{
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '6px 10px',
              fontSize: '11.5px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
            }}
          >
            <User size={13} color="#7FE87F" />
            <span>{isAr ? 'عميل' : 'Customer'}</span>
          </button>

          {/* Web Admin Portal Button */}
          <button
            onClick={() => navigateTo('MERCHANT_WEB')}
            title={isAr ? 'فتح بوابة الإدارة الإلكترونية' : 'Open Merchant Web Admin'}
            className="interactive-tap"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7FE87F',
              cursor: 'pointer',
            }}
          >
            <Monitor size={17} />
          </button>
        </div>
      </header>

      {/* Merchant Business Context Strip */}
      <div style={{ padding: '16px 20px 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
            {translateText(merchantInfo.businessName, language)}
          </div>
          <div style={{ fontSize: '11px', color: '#7FE87F', fontWeight: 700, marginTop: '2px' }}>
            {isAr ? `السجل التجاري: ${formatLocalizedNumber(merchantInfo.crNumber, language)}` : `CR: ${merchantInfo.crNumber}`}
          </div>
        </div>
        <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#A2A2BA', backgroundColor: '#151524', border: '1px solid #2C2C44', padding: '4px 10px', borderRadius: '10px' }}>
          {isAr ? 'نقاط بيع معتمدة' : 'Verified SoftPOS'}
        </div>
      </div>

      {/* 2. Today's Total Collections Hero Summary Card (Gradient Green-Black) */}
      <div style={{ padding: '12px 20px 0 20px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #052e16 0%, #064e3b 35%, #031c12 70%, #0e0e18 100%)',
            border: '1px solid rgba(127, 232, 127, 0.35)',
            borderRadius: '20px',
            padding: '22px 20px',
            boxShadow: 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative ambient radial glow */}
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: isRtl ? 'auto' : '-30px',
              left: isRtl ? '-30px' : 'auto',
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(127, 232, 127, 0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Top metadata */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#C8E6C9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t('merchant.today_sales', "Today's Collections")}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(127, 232, 127, 0.18)',
                  color: '#7FE87F',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  border: '1px solid rgba(127, 232, 127, 0.3)',
                }}
              >
                {formatLocalizedNumber(settledCount, language)} {t('merchant.sales_count', 'Sales')}
              </span>
            </div>

            <button
              onClick={() => speakSoundBox(totalToday)}
              title={isAr ? 'تجربة إشعار الصوت الذكي' : 'Test SoundBox Voice Announcement'}
              className="interactive-tap"
              style={{
                background: 'rgba(127, 232, 127, 0.12)',
                border: '1px solid rgba(127, 232, 127, 0.25)',
                color: '#7FE87F',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11.5px',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: '8px',
              }}
            >
              <Volume2 size={14} /> {isAr ? 'صندوق الصوت' : 'SoundBox'}
            </button>
          </div>

          {/* Big Amount */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
            <div>
              <div className="tabular-nums" style={{ fontSize: '32px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                {formatCurrency(totalToday, language)}
              </div>
              <div style={{ fontSize: '11.5px', color: '#A2E6A2', marginTop: '2px', fontWeight: 600 }}>
                {isAr ? (
                  <>شامل ضريبة زاتكا ١٥٪ (<span style={{ color: '#FFFFFF', fontWeight: 800 }}>{formatSaudiCurrency(totalVat, language)}</span>)</>
                ) : (
                  <>Incl. <span style={{ color: '#FFFFFF', fontWeight: 800 }}>SAR {totalVat.toFixed(2)}</span> ZATCA 15% VAT</>
                )}
              </div>
            </div>

            <button
              onClick={() => navigateTo('SOFTPOS_TERMINAL')}
              className="interactive-tap"
              style={{
                backgroundColor: '#7FE87F',
                color: '#000000',
                border: 'none',
                borderRadius: '10px',
                padding: '9px 16px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'none',
              }}
            >
              <CreditCard size={15} /> {t('btn.collect', 'Collect')}
            </button>
          </div>

          {/* Payout & Settlement Info Footer */}
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11.5px',
              color: '#A2A2BA',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Landmark size={14} color="#7FE87F" />
              <span>{isAr ? `تسوية إلى ${translateText(merchantInfo.settlementBank, language)}` : `Settles to ${merchantInfo.settlementBank}`}</span>
            </div>
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{isAr ? 'تلقائياً ١٢:٠٠ ص' : 'Auto 12:00 AM'}</span>
          </div>
        </div>
      </div>

      {/* 3. Payment Acceptance Tools Grid */}
      <div style={{ padding: '14px 20px 0 20px' }}>
        <div
          style={{
            backgroundColor: '#151524',
            border: '1px solid #2C2C44',
            borderRadius: '18px',
            padding: '18px 16px',
            boxShadow: 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
              {isAr ? 'منظومة قبول المدفوعات' : 'Payment Acceptance Suite'}
            </h3>
            <span style={{ fontSize: '11px', color: '#7FE87F', fontWeight: 700 }}>
              {isAr ? 'نقاط بيع مدى وسريع' : 'mada & Sarie POS'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {/* 1. SoftPOS */}
            <div
              onClick={() => navigateTo('SOFTPOS_TERMINAL')}
              className="interactive-tap"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: '#1E1E32',
                  border: '1px solid #2C2C44',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7FE87F',
                  boxShadow: 'none',
                }}
              >
                <CreditCard size={22} />
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#FFFFFF', textAlign: 'center' }}>
                {t('merchant.softpos', 'SoftPOS')}
              </span>
            </div>

            {/* 2. ZATCA QR */}
            <div
              onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
              className="interactive-tap"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: '#1E1E32',
                  border: '1px solid #2C2C44',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EBB432',
                  boxShadow: 'none',
                }}
              >
                <QrCode size={22} />
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#FFFFFF', textAlign: 'center' }}>
                {t('merchant.zatca_qr', 'ZATCA QR')}
              </span>
            </div>

            {/* 3. Payment Link */}
            <div
              onClick={() => navigateTo('PAYMENT_LINK_GENERATOR')}
              className="interactive-tap"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: '#1E1E32',
                  border: '1px solid #2C2C44',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B478FF',
                  boxShadow: 'none',
                }}
              >
                <Link2 size={22} />
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#FFFFFF', textAlign: 'center' }}>
                {t('merchant.payment_link', 'Pay Link')}
              </span>
            </div>

            {/* 4. SoundBox Notifier */}
            <div
              onClick={() => navigateTo('SOUNDBOX_NOTIFIER')}
              className="interactive-tap"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: '#1E1E32',
                  border: '1px solid #2C2C44',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7FE87F',
                  boxShadow: 'none',
                }}
              >
                <Radio size={22} />
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#FFFFFF', textAlign: 'center' }}>
                {t('merchant.soundbox', 'SoundBox')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Customer Collections Ledger */}
      <div style={{ padding: '22px 20px 0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            {t('merchant.collections', 'Recent Collections')}
          </h3>
          <button
            onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
            className="interactive-tap"
            style={{
              background: 'none',
              border: 'none',
              color: '#7FE87F',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: 0,
            }}
          >
            {isAr ? 'سجل العمليات الكامل' : 'Full Ledger'}{' '}
            <ChevronRight size={14} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentCollections.map((col) => {
            const badge = getMethodBadge(col.paymentMethod);
            return (
              <div
                key={col.id}
                onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
                className="interactive-tap"
                style={{
                  backgroundColor: '#151524',
                  border: '1px solid #2C2C44',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '12px',
                      flexShrink: 0,
                    }}
                  >
                    <ReceiptText size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                      {col.orderRef} • {col.customerMasked}
                    </div>
                    <div style={{ fontSize: '11px', color: '#A2A2BA', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: badge.color, fontWeight: 700 }}>{badge.label}</span>
                      <span>&bull;</span>
                      <span>{translateText(col.date, language)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                  <div className="tabular-nums" style={{ fontSize: '15px', fontWeight: 900, color: col.status === 'refunded' ? '#FF6B6B' : '#7FE87F' }}>
                    {col.status === 'refunded' ? '- ' : '+ '}{formatCurrency(col.amount, language)}
                  </div>
                  <div style={{ fontSize: '10px', color: '#6E6E85', marginTop: '2px', fontWeight: 600 }}>
                    {isAr ? `الضريبة: ${formatSaudiCurrency(col.vatAmount, language)}` : `VAT: SAR ${col.vatAmount.toFixed(2)}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Trust & SAMA Compliance Dock */}
      <div style={{ padding: '20px 20px 0 20px' }}>
        <div
          style={{
            backgroundColor: '#151524',
            border: '1px solid #2C2C44',
            borderRadius: '18px',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '10px', color: '#7FE87F', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
              {isAr ? 'محرك مدفوعات معتمد من البنك المركزي' : 'SAMA Certified Merchant Engine'}
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF' }}>
              {isAr ? 'متوافق مع المرحلة الثانية للفوترة الإلكترونية (زاتكا)' : 'ZATCA Phase 2 E-Invoicing Compliant'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ backgroundColor: '#1E1E32', border: '1px solid #2C2C44', borderRadius: '10px', padding: '6px 8px', display: 'flex', alignItems: 'center' }}>
              <PaymentPartnerLogo size={20} width={64} height={32} themeMode="dark" />
            </div>
            <div style={{ backgroundColor: '#1E1E32', border: '1px solid #2C2C44', borderRadius: '10px', padding: '6px 8px', display: 'flex', alignItems: 'center' }}>
              <SamaLogo height={16} themeMode="green" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

