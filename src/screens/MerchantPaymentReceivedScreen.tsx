import React, { useState } from 'react';
import {
  CheckCircle2,
  Share2,
  Plus,
  Volume2,
  Check,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import { translateText, formatSaudiCurrency, formatLocalizedNumber } from '../utils/i18n';
import { PrimaryButton } from '../components/PrimaryButton';
import { SamaLogo } from '../components/SamaLogo';
import { ZatcaLogo } from '../components/ZatcaLogo';

export const MerchantPaymentReceivedScreen: React.FC = () => {
  const {
    lastMerchantCollection,
    merchantInfo,
    navigateTo,
    speakSoundBox,
    language,
    t,
  } = useApp();

  const isAr = language === 'العربية';
  const [copied, setCopied] = useState(false);

  const collection = lastMerchantCollection || {
    id: 'POS-8839201',
    orderRef: 'ORD-9841',
    amount: 67.0,
    vatAmount: 8.74,
    netAmount: 58.26,
    paymentMethod: 'softpos_mada',
    cardLast4: '4821',
    customerMasked: '+966 50 ••• 1234',
    date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date(),
    status: 'settled' as const,
  };

  const handleShareReceipt = () => {
    const text = isAr
      ? `*إيصال فاتورة زاتكا الإلكترونية*\nالمتجر: ${merchantInfo.businessName}\nالسجل التجاري: ${merchantInfo.crNumber}\nالرقم الضريبي: ${merchantInfo.vatNumber}\nالمرجع: ${collection.id}\nالمبلغ: ${collection.amount.toFixed(2)} ر.س (شامل الضريبة: ${collection.vatAmount.toFixed(2)} ر.س)\nتمت التسوية عبر البنك المركزي السعودي شبكة سريع.`
      : `*ZATCA E-INVOICE RECEIPT*\nStore: ${merchantInfo.businessName}\nCR: ${merchantInfo.crNumber}\nVAT ID: ${merchantInfo.vatNumber}\nRef: ${collection.id}\nAmount: SAR ${collection.amount.toFixed(2)} (Incl. 15% VAT: SAR ${collection.vatAmount.toFixed(2)})\nSettled via SAMA Sarie Network.`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '30px 24px 24px 24px',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Top Success Icon */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: 'rgba(127, 232, 127, 0.15)',
            border: '2px solid #7FE87F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
          }}
        >
          <CheckCircle2 size={38} color="#7FE87F" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0', color: '#FFFFFF' }}>
          {t('merchant.payment_approved', 'Payment Approved')}
        </h2>
        <div className="tabular-nums" style={{ fontSize: '32px', fontWeight: 900, color: '#7FE87F', letterSpacing: '-0.02em', margin: '4px 0' }}>
          +{formatCurrency(collection.amount, language)}
        </div>
        <p style={{ fontSize: '12px', color: '#A2A2BA', margin: 0 }}>
          {isAr
            ? `تسوية مباشرة إلى ${translateText(merchantInfo.settlementBank, language)}`
            : `Direct settlement to ${merchantInfo.settlementBank}`}
        </p>
      </div>

      {/* Digital Receipt Card */}
      <div style={{ width: '100%', maxWidth: '380px', margin: '14px auto' }}>
        <div
          style={{
            backgroundColor: '#151524',
            border: '1px solid #2C2C44',
            borderRadius: '18px',
            padding: '18px',
            boxSizing: 'border-box',
          }}
        >
          {/* Header with Zatca Logo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #2C2C44', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ZatcaLogo variant="icon" size={20} />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>
                {t('zatca.title', 'ZATCA Phase 2 E-Invoice')}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: '#7FE87F', fontWeight: 700, backgroundColor: 'rgba(127, 232, 127, 0.12)', padding: '2px 6px', borderRadius: '6px' }}>
              {isAr ? 'مكتملة' : 'Settled'}
            </span>
          </div>

          {/* Breakdown Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#A2A2BA' }}>{isAr ? 'المنشأة' : 'Merchant'}</span>
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{translateText(merchantInfo.businessName, language)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#A2A2BA' }}>{t('zatca.vat_id', 'VAT ID')}</span>
              <span style={{ fontWeight: 700, color: '#FFFFFF', fontFamily: 'monospace' }}>{formatLocalizedNumber(merchantInfo.vatNumber, language)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#A2A2BA' }}>{isAr ? 'رقم العملية المرجعي' : 'Transaction Ref'}</span>
              <span style={{ fontWeight: 700, color: '#FFFFFF', fontFamily: 'monospace' }}>{collection.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#A2A2BA' }}>{isAr ? 'طريقة الدفع' : 'Method'}</span>
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>
                {collection.paymentMethod.replace('_', ' ').toUpperCase()}{collection.cardLast4 ? ` • ${isAr ? formatLocalizedNumber(collection.cardLast4, language) : collection.cardLast4}` : ''}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#A2A2BA' }}>{t('zatca.net_total', 'Net Amount (Excl. VAT)')}</span>
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{formatSaudiCurrency(collection.netAmount, language)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#7FE87F', fontWeight: 700 }}>{t('zatca.vat_amount', '15% ZATCA VAT')}</span>
              <span style={{ fontWeight: 800, color: '#7FE87F' }}>{formatSaudiCurrency(collection.vatAmount, language)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #2C2C44', paddingTop: '8px', marginTop: '2px' }}>
              <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '13px' }}>{t('zatca.gross_total', 'Gross Total')}</span>
              <span style={{ fontWeight: 900, color: '#FFFFFF', fontSize: '14px' }}>{formatSaudiCurrency(collection.amount, language)}</span>
            </div>
          </div>

          {/* Play Soundbox Voice Again */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <button
              onClick={() => speakSoundBox(collection.amount)}
              className="interactive-tap"
              style={{
                flex: 1,
                backgroundColor: '#1E1E32',
                border: '1px solid #2C2C44',
                color: '#7FE87F',
                borderRadius: '10px',
                padding: '9px 12px',
                fontSize: '11.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                cursor: 'pointer',
              }}
            >
              <Volume2 size={15} /> {isAr ? 'تشغيل صندوق الصوت' : 'Play SoundBox'}
            </button>

            <button
              onClick={handleShareReceipt}
              className="interactive-tap"
              style={{
                flex: 1,
                backgroundColor: '#1E1E32',
                border: '1px solid #2C2C44',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '9px 12px',
                fontSize: '11.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              {copied ? <Check size={15} color="#7FE87F" /> : <Share2 size={15} color="#7FE87F" />}
              {copied ? (isAr ? 'تم نسخ الإيصال' : 'Copied Receipt') : (isAr ? 'مشاركة الإيصال' : 'Share Receipt')}
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <PrimaryButton onClick={() => navigateTo('SOFTPOS_TERMINAL')}>
          <Plus size={18} /> {t('merchant.new_sale', 'New Sale (SoftPOS)')}
        </PrimaryButton>

        <button
          onClick={() => navigateTo('MERCHANT_HOME')}
          className="interactive-tap"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #2C2C44',
            borderRadius: '14px',
            padding: '14px',
            color: '#FFFFFF',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          {t('merchant.back_dashboard', 'Back to Merchant Dashboard')}
        </button>
      </div>

      {/* SAMA & ZATCA Compliance Dock */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: '100%',
          textAlign: 'center',
          marginTop: '10px',
        }}
      >
        <SamaLogo height={14} themeMode="green" />
        <span style={{ fontSize: '10px', color: '#6E6E85' }}>•</span>
        <ZatcaLogo variant="full" height={13} themeMode="dark" />
      </div>
    </div>
  );
};

