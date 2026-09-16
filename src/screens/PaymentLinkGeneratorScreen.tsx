import React, { useState } from 'react';
import { Link2, Copy, Check, MessageSquare, Sparkles } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppHeader } from '../components/AppHeader';
import { formatSaudiCurrency } from '../utils/i18n';

export const PaymentLinkGeneratorScreen: React.FC = () => {
  const {
    merchantInfo,
    processMerchantCollection,
    navigateTo,
    language,
  } = useApp();

  const isAr = language === 'العربية';
  const [orderRef, setOrderRef] = useState(isAr ? 'طلب #ORD-8839' : 'Order #ORD-8839');
  const [customerName, setCustomerName] = useState(isAr ? 'سارة المنصور' : 'Sara Al-Mansoor');
  const [amount, setAmount] = useState('320.00');
  const [generatedLink, setGeneratedLink] = useState('https://qtpay.sa/pay/lnk_8839201');
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const numAmount = parseFloat(amount) || 0;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const linkId = 'lnk_' + Math.floor(1000000 + Math.random() * 9000000);
    setGeneratedLink(`https://qtpay.sa/pay/${linkId}`);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      isAr
        ? `مرحباً ${customerName}، إليك رابط الدفع لطلبك ${orderRef} (${merchantInfo.businessName}):\nالمبلغ: ${numAmount.toFixed(2)} ر.س\nادفع بأمان عبر أبل باي / البطاقات البنكية / سريع:\n${generatedLink}`
        : `Hello ${customerName}, here is your payment link for ${orderRef} (${merchantInfo.businessName}):\nAmount: SAR ${numAmount.toFixed(2)}\nPay securely via Apple Pay / Debit Card / Sarie:\n${generatedLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleSimulateRemotePayment = async () => {
    if (numAmount <= 0) return;
    setIsSimulating(true);
    await processMerchantCollection({
      amount: numAmount,
      paymentMethod: 'payment_link',
      orderRef,
      customerMasked: customerName,
    });
    setTimeout(() => {
      setIsSimulating(false);
      navigateTo('MERCHANT_PAYMENT_SUCCESS');
    }, 800);
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
      {/* Top Header */}
      <div>
        <AppHeader
          title={isAr ? 'روابط الدفع السريع والتحصيل' : 'Remote Payment Links'}
          showBack={true}
          showSettings={false}
          rightAction={
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: 'rgba(180, 120, 255, 0.12)',
                border: '1px solid rgba(180, 120, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B478FF',
              }}
            >
              <Link2 size={18} />
            </div>
          }
        />
      </div>

      {/* Form & Link Card */}
      <div style={{ width: '100%', maxWidth: '380px', margin: '14px auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Order Ref */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
              {isAr ? 'رقم / مرجع الطلب' : 'Order Reference / Invoice #'}
            </label>
            <input
              type="text"
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value)}
              placeholder={isAr ? 'طلب #ORD-8839' : 'Order #ORD-8839'}
              required
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '12px',
                padding: '12px 14px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                width: '100%',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {/* Customer Name */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
              {isAr ? 'اسم العميل' : 'Customer Name'}
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={isAr ? 'سارة المنصور' : 'Sara Al-Mansoor'}
              required
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '12px',
                padding: '12px 14px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                width: '100%',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {/* Amount */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
              {isAr ? 'المبلغ الإجمالي (ر.س)' : 'Amount to Collect (SAR)'}
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="320.00"
              required
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '12px',
                padding: '12px 14px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 800,
                width: '100%',
                boxSizing: 'border-box',
                outline: 'none',
                direction: 'ltr',
              }}
            />
          </div>

          <button
            type="submit"
            className="interactive-tap"
            style={{
              backgroundColor: '#1A2234',
              border: '1px solid #1E293B',
              borderRadius: '12px',
              padding: '11px',
              color: '#B478FF',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Link2 size={16} /> {isAr ? 'تحديث وإنشاء الرابط' : 'Generate & Refresh Link'}
          </button>
        </form>

        {/* Generated Link Display Box */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid rgba(180, 120, 255, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: '11px', color: '#B478FF', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
            {isAr ? 'الرابط المباشر للعميل' : 'Live Payment Link'}
          </div>
          <div
            style={{
              backgroundColor: '#080C14',
              border: '1px solid #1E293B',
              borderRadius: '10px',
              padding: '10px 12px',
              fontSize: '12.5px',
              color: '#FFFFFF',
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              marginBottom: '12px',
              direction: 'ltr',
              textAlign: 'left',
            }}
          >
            {generatedLink}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCopy}
              className="interactive-tap"
              style={{
                flex: 1,
                backgroundColor: '#1A2234',
                border: '1px solid #1E293B',
                borderRadius: '10px',
                padding: '9px 12px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
              }}
            >
              {copied ? <Check size={14} color="#00C853" /> : <Copy size={14} />}
              {copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الرابط' : 'Copy Link')}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="interactive-tap"
              style={{
                flex: 1,
                backgroundColor: '#25D366',
                border: 'none',
                borderRadius: '10px',
                padding: '9px 12px',
                fontSize: '12px',
                fontWeight: 800,
                color: '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
              }}
            >
              <MessageSquare size={14} /> {isAr ? 'مشاركة واتساب' : 'WhatsApp'}
            </button>
          </div>
        </div>

        {/* Remote Simulation Action */}
        <PrimaryButton onClick={handleSimulateRemotePayment} disabled={isSimulating || numAmount <= 0}>
          <Sparkles size={16} /> {isAr ? `محاكاة دفع العميل (${formatSaudiCurrency(numAmount, language)})` : `Simulate Customer Paid (${numAmount.toFixed(2)} SAR)`}
        </PrimaryButton>
      </div>

      {/* Quantira Technologies Dock */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
        <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>
          {isAr ? 'روابط دفع آمنة مدعومة بتقنيات كوانتيرا' : '3DS Secure Hosted Checkout Rail • Quantira Technologies'}
        </span>
      </div>
    </div>
  );
};
