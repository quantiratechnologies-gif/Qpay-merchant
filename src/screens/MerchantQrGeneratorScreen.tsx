import React, { useState } from 'react';
import {
  Share2,
  Sparkles,
  Download,
  Copy,
  Check,
  Receipt,
  QrCode,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import { translateText, formatSaudiCurrency, formatLocalizedNumber } from '../utils/i18n';
import { PrimaryButton } from '../components/PrimaryButton';
import { ZatcaLogo } from '../components/ZatcaLogo';
import { QRCodeView } from '../components/QRCodeView';
import { AppHeader } from '../components/AppHeader';

export const MerchantQrGeneratorScreen: React.FC = () => {
  const {
    merchantInfo,
    processMerchantCollection,
    navigateTo,
    language,
    t,
  } = useApp();

  const isAr = language === 'العربية';
  const [qrMode, setQrMode] = useState<'stand' | 'invoice'>('stand');
  const [invoiceAmount, setInvoiceAmount] = useState<string>('150.00');
  const [orderNote, setOrderNote] = useState<string>(isAr ? 'فاتورة رقم #INV-9901' : 'Invoice #INV-9901');
  const [copied, setCopied] = useState(false);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);

  const numAmount = qrMode === 'invoice' ? (parseFloat(invoiceAmount) || 0) : 0;
  const vatAmount = numAmount > 0 ? Number((numAmount - numAmount / 1.15).toFixed(2)) : 0;

  // Build ZATCA Phase 2 compliant TLV payload representation
  const zatcaPayload =
    qrMode === 'invoice'
      ? `zatca://taxinvoice?seller=${encodeURIComponent(merchantInfo.businessName)}&vat=${merchantInfo.vatNumber}&total=${numAmount.toFixed(2)}&vat_total=${vatAmount.toFixed(2)}&terminal=${merchantInfo.terminalId}&rail=sarie&ts=${encodeURIComponent(new Date().toISOString())}`
      : `zatca://posqr?seller=${encodeURIComponent(merchantInfo.businessName)}&cr=${merchantInfo.crNumber}&vat=${merchantInfo.vatNumber}&terminal=${merchantInfo.terminalId}&rail=sarie_mada`;

  const showToast = (_msg: string) => {};

  const handleSimulateCustomerPayment = async () => {
    const payAmount = qrMode === 'invoice' && numAmount > 0 ? numAmount : 85.0;
    setIsSimulatingScan(true);
    await processMerchantCollection({
      amount: payAmount,
      paymentMethod: 'zatca_qr',
      orderRef: qrMode === 'invoice' ? (orderNote || 'QR-INVOICE') : 'COUNTER-QR',
      customerMasked: '+966 54 ••• 8821',
    });
    setTimeout(() => {
      setIsSimulatingScan(false);
      navigateTo('MERCHANT_PAYMENT_SUCCESS');
    }, 800);
  };

  const handleDownloadPoster = () => {
    showToast(
      isAr
        ? 'جاري تنزيل ملصق الباركود عالي الدقة (PDF) للطباعة والتعليق في المتجر...'
        : 'Downloading High-Res Store Stand QR Poster (PDF) for print...'
    );
  };

  const handleShareWhatsApp = () => {
    const shareText = isAr
      ? `ادفع مباشرة لمتجر ${merchantInfo.businessName} عبر الرابط والباركود: ${zatcaPayload}`
      : `Pay directly to ${merchantInfo.businessName} via QR / Sarie: ${zatcaPayload}`;
    if (navigator.share) {
      navigator.share({ title: merchantInfo.businessName, text: shareText }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareText);
      showToast(isAr ? 'تم نسخ رابط ورسالة الدفع لمشاركتها عبر واتساب' : 'Payment details copied for WhatsApp sharing!');
    }
  };

  const handleCopyPayload = () => {
    navigator.clipboard?.writeText(zatcaPayload);
    setCopied(true);
    showToast(isAr ? 'تم نسخ نص رمز الاستجابة المشفر' : 'ZATCA payload string copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100vh',
        backgroundColor: '#080C14',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: '24px',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Top Bar */}
      <div>
        <AppHeader
          title={t('qr.hub_title', 'My Store QR Hub')}
          showBack={true}
          showSettings={false}
          rightAction={
            <div
              style={{
                backgroundColor: 'rgba(235, 180, 50, 0.12)',
                border: '1px solid rgba(235, 180, 50, 0.3)',
                borderRadius: '10px',
                padding: '6px 8px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ZatcaLogo size={16} themeMode="dark" />
            </div>
          }
        />

        {/* QR Mode Switcher: Store Stand QR vs Dynamic Invoice */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '14px',
            padding: '4px',
            display: 'flex',
            gap: '4px',
            marginBottom: '14px',
          }}
        >
          <button
            type="button"
            onClick={() => setQrMode('stand')}
            className="interactive-tap"
            style={{
              flex: 1,
              backgroundColor: qrMode === 'stand' ? '#00C853' : 'transparent',
              color: qrMode === 'stand' ? '#000000' : '#94A3B8',
              border: 'none',
              borderRadius: '10px',
              padding: '8px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <QrCode size={14} />
            <span>{isAr ? 'باركود المتجر (شامل)' : 'Store Stand QR'}</span>
          </button>

          <button
            type="button"
            onClick={() => setQrMode('invoice')}
            className="interactive-tap"
            style={{
              flex: 1,
              backgroundColor: qrMode === 'invoice' ? '#00C853' : 'transparent',
              color: qrMode === 'invoice' ? '#000000' : '#94A3B8',
              border: 'none',
              borderRadius: '10px',
              padding: '8px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Receipt size={14} />
            <span>{isAr ? 'فاتورة بمبلغ محدد' : 'Dynamic Invoice QR'}</span>
          </button>
        </div>

        {/* Printable Stand Poster Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4px 0 12px 0' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '320px',
              padding: '20px 18px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
              border: '2px solid rgba(0, 200, 83, 0.3)',
            }}
          >
            {/* Stand Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ZatcaLogo variant="icon" size={22} />
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#0F172A', display: 'block', lineHeight: 1.1 }}>
                  {isAr ? 'منظومة قبول المدفوعات والفوترة' : 'National Merchant Acceptance'}
                </span>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  ZATCA Phase 2 &bull; Sarie &bull; Quantira
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div style={{ padding: '8px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <QRCodeView value={zatcaPayload} size={165} />
            </div>

            {/* Store & Terminal Metadata */}
            <div style={{ marginTop: '12px', textAlign: 'center', width: '100%' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                {translateText(merchantInfo.businessName, language)}
              </div>
              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                {isAr
                  ? `الرقم الضريبي: ${formatLocalizedNumber(merchantInfo.vatNumber, language)}`
                  : `VAT: ${merchantInfo.vatNumber}`}
              </div>
              <div
                style={{
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px dashed #CBD5E1',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '9.5px',
                  color: '#475569',
                  fontWeight: 700,
                }}
              >
                <span>TID: {merchantInfo.terminalId}</span>
                <span>CR: {merchantInfo.crNumber}</span>
              </div>
            </div>
          </div>

          {/* Amount Badge (if in invoice mode) */}
          {qrMode === 'invoice' && (
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <div className="tabular-nums" style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF' }}>
                {formatCurrency(numAmount, language)}
              </div>
              <div style={{ fontSize: '11px', color: '#00C853', fontWeight: 700 }}>
                {isAr
                  ? `شامل ضريبة زاتكا ١٥٪ (${formatSaudiCurrency(vatAmount, language)})`
                  : `Includes SAR ${vatAmount.toFixed(2)} (15% ZATCA VAT)`}
              </div>
            </div>
          )}
        </div>

        {/* Invoice Controls (Visible when invoice mode is selected) */}
        {qrMode === 'invoice' && (
          <div style={{ width: '100%', maxWidth: '360px', margin: '0 auto 12px auto', display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '10.5px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                {isAr ? 'المبلغ الإجمالي (ر.س)' : 'Invoice Total (SAR)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
                placeholder="150.00"
                style={{
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
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
              <label style={{ fontSize: '10.5px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                {isAr ? 'رقم / مرجع الفاتورة' : 'Order Reference'}
              </label>
              <input
                type="text"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder={isAr ? 'فاتورة #INV-9901' : 'Invoice #INV-9901'}
                style={{
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
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
        )}

        {/* Action Button Grid */}
        <div style={{ width: '100%', maxWidth: '360px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleDownloadPoster}
              className="interactive-tap"
              style={{
                flex: 1,
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '12px',
                padding: '10px 12px',
                color: '#F8FAFC',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Download size={14} color="#00C853" />
              <span>{t('qr.download_poster', 'Download Poster')}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="interactive-tap"
              style={{
                flex: 1,
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '12px',
                padding: '10px 12px',
                color: '#F8FAFC',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Share2 size={14} color="#3B82F6" />
              <span>{t('qr.share_qr', 'Share via WhatsApp')}</span>
            </button>

            <button
              onClick={handleCopyPayload}
              className="interactive-tap"
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '12px',
                padding: '10px 12px',
                color: '#F8FAFC',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              {copied ? <Check size={14} color="#00C853" /> : <Copy size={14} color="#F59E0B" />}
              <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : isAr ? 'نسخ الرمز' : 'Copy'}</span>
            </button>
          </div>

          {/* Customer Scan Simulation CTA */}
          <PrimaryButton onClick={handleSimulateCustomerPayment} disabled={isSimulatingScan}>
            <Sparkles size={16} />{' '}
            {isAr ? 'محاكاة مسح ودفع العميل' : 'Simulate Customer Scan & Pay'}
          </PrimaryButton>
        </div>
      </div>

      {/* Quantira Technologies Dock */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
        <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>
          {isAr ? 'فوترة إلكترونية متوافقة مع زاتكا ونظام سريع • تقنيات كوانتيرا' : 'ZATCA & Sarie Compatible • Quantira Technologies'}
        </span>
      </div>
    </div>
  );
};

