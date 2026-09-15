import React, { useState } from 'react';
import { ArrowLeft, Share2, Check, Sparkles } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import { translateText, formatSaudiCurrency, formatLocalizedNumber } from '../utils/i18n';
import { PrimaryButton } from '../components/PrimaryButton';
import { SamaLogo } from '../components/SamaLogo';
import { ZatcaLogo } from '../components/ZatcaLogo';
import { QRCodeView } from '../components/QRCodeView';

export const MerchantQrGeneratorScreen: React.FC = () => {
  const {
    merchantInfo,
    processMerchantCollection,
    navigateTo,
    goBack,
    language,
    isRtl,
    t,
  } = useApp();

  const isAr = language === 'العربية';
  const [invoiceAmount, setInvoiceAmount] = useState<string>('150.00');
  const [orderNote, setOrderNote] = useState<string>(isAr ? 'فاتورة رقم #INV-9901' : 'Invoice #INV-9901');
  const [copied, setCopied] = useState(false);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);

  const numAmount = parseFloat(invoiceAmount) || 0;
  const vatAmount = numAmount > 0 ? Number((numAmount - numAmount / 1.15).toFixed(2)) : 0;

  // Build ZATCA Phase 2 compliant TLV payload representation
  const zatcaPayload = `zatca://taxinvoice?seller=${encodeURIComponent(merchantInfo.businessName)}&vat=${merchantInfo.vatNumber}&total=${numAmount.toFixed(2)}&vat_total=${vatAmount.toFixed(2)}&rail=sarie&ts=${encodeURIComponent(new Date().toISOString())}`;

  const handleSimulateCustomerPayment = async () => {
    if (numAmount <= 0) return;
    setIsSimulatingScan(true);
    await processMerchantCollection({
      amount: numAmount,
      paymentMethod: 'zatca_qr',
      orderRef: orderNote || 'QR-INVOICE',
      customerMasked: '+966 54 ••• 8821',
    });
    setTimeout(() => {
      setIsSimulatingScan(false);
      navigateTo('MERCHANT_PAYMENT_SUCCESS');
    }, 800);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(zatcaPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        padding: '16px 20px 24px 20px',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={goBack}
          aria-label={t('btn.back', 'Back')}
          className="interactive-tap"
          style={{
            backgroundColor: '#151524',
            border: '1px solid #2C2C44',
            color: '#FFFFFF',
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
            {t('zatca.title', 'ZATCA Phase 2 E-Invoice')}
          </div>
          <div style={{ fontSize: '11px', color: '#56bbb4', fontWeight: 700 }}>
            {t('zatca.tlv_qr', 'TLV Cryptographic QR')}
          </div>
        </div>

        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            backgroundColor: 'rgba(56, 171, 195, 0.12)',
            border: '1px solid rgba(56, 171, 195, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ZatcaLogo variant="icon" size={24} />
        </div>
      </div>

      {/* QR Code Card Display */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '14px 0' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '18px',
            borderRadius: '22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <ZatcaLogo variant="icon" size={20} />
            <span style={{ fontSize: '11px', fontWeight: 900, color: '#333333', letterSpacing: '0.04em' }}>
              {isAr ? 'منصة فاتورة زاتكا' : 'ZATCA Fatoora'}
            </span>
          </div>
          <QRCodeView value={zatcaPayload} size={175} />
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#000000' }}>
              {translateText(merchantInfo.businessName, language)}
            </div>
            <div style={{ fontSize: '10.5px', color: '#666666', fontWeight: 600 }}>
              {isAr ? `الرقم الضريبي: ${formatLocalizedNumber(merchantInfo.vatNumber, language)}` : `VAT ID: ${merchantInfo.vatNumber}`}
            </div>
          </div>
        </div>

        {/* Amount in QR */}
        <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 900, color: '#FFFFFF', marginTop: '12px' }}>
          {formatCurrency(numAmount, language)}
        </div>
        <div style={{ fontSize: '11.5px', color: '#7FE87F', fontWeight: 700 }}>
          {isAr ? (
            <>شامل ضريبة زاتكا ١٥٪ ({formatSaudiCurrency(vatAmount, language)})</>
          ) : (
            <>Includes SAR {vatAmount.toFixed(2)} (15% ZATCA VAT)</>
          )}
        </div>
      </div>

      {/* Controls: Edit Amount & Reference */}
      <div style={{ width: '100%', maxWidth: '360px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '10.5px', fontWeight: 800, color: '#A2A2BA', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
              {isAr ? 'المبلغ الإجمالي (ر.س)' : 'Invoice Total (SAR)'}
            </label>
            <input
              type="number"
              step="0.01"
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(e.target.value)}
              placeholder="150.00"
              style={{
                backgroundColor: '#151524',
                border: '1px solid #2C2C44',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                width: '100%',
                boxSizing: 'border-box',
                outline: 'none',
                direction: 'ltr',
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '10.5px', fontWeight: 800, color: '#A2A2BA', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
              {isAr ? 'رقم / مرجع الفاتورة' : 'Order Reference'}
            </label>
            <input
              type="text"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder={isAr ? 'فاتورة #INV-9901' : 'Invoice #INV-9901'}
              style={{
                backgroundColor: '#151524',
                border: '1px solid #2C2C44',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                width: '100%',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Customer Scan & Pay Simulation CTA */}
        <PrimaryButton onClick={handleSimulateCustomerPayment} disabled={isSimulatingScan || numAmount <= 0}>
          <Sparkles size={16} /> {isAr ? 'محاكاة مسح ودفع العميل' : 'Simulate Customer Scan & Pay'}
        </PrimaryButton>

        <button
          onClick={handleCopyLink}
          className="interactive-tap"
          style={{
            backgroundColor: '#151524',
            border: '1px solid #2C2C44',
            borderRadius: '12px',
            padding: '10px',
            color: '#A2A2BA',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          {copied ? <Check size={14} color="#7FE87F" /> : <Share2 size={14} />}
          {copied ? (isAr ? 'تم نسخ بيانات الرمز' : 'QR Payload Copied') : (isAr ? 'نسخ نص رمز الاستجابة المشفر' : 'Copy ZATCA Payload String')}
        </button>
      </div>

      {/* SAMA Dock */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
        <span style={{ fontSize: '10.5px', color: '#6E6E85', fontWeight: 700 }}>
          {isAr ? 'فوترة إلكترونية متوافقة مع زاتكا ونظام سريع' : 'SAMA Sarie & ZATCA Compatible E-Invoicing'}
        </span>
        <SamaLogo height={14} themeMode="green" />
      </div>
    </div>
  );
};

