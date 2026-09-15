import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wifi, CheckCircle2 } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import { translateText, formatLocalizedNumber } from '../utils/i18n';
import type { PaymentAcceptanceMethod } from '../types';

export const TapCardScreen: React.FC = () => {
  const {
    screenParams,
    softPosAmount,
    softPosCardScheme,
    processMerchantCollection,
    navigateTo,
    goBack,
    merchantInfo,
    language,
    isRtl,
    t,
  } = useApp();

  const isAr = language === 'العربية';
  const amount = screenParams.amount || softPosAmount || 67.0;
  const scheme = screenParams.cardScheme || softPosCardScheme || 'mada';

  const [step, setStep] = useState<'waiting' | 'reading' | 'authorizing' | 'success'>('waiting');

  useEffect(() => {
    // 1. Simulate NFC Card Tap after 1.2s
    const t1 = setTimeout(() => {
      setStep('reading');
    }, 1200);

    // 2. Authorizing with SAMA after 2.0s
    const t2 = setTimeout(() => {
      setStep('authorizing');
    }, 2000);

    // 3. Complete and record collection
    const t3 = setTimeout(async () => {
      setStep('success');

      let paymentMethod: PaymentAcceptanceMethod = 'softpos_mada';
      if (scheme === 'applepay') paymentMethod = 'softpos_applepay';
      else if (scheme === 'visa') paymentMethod = 'softpos_visa';
      else if (scheme === 'mastercard') paymentMethod = 'softpos_mastercard';

      await processMerchantCollection({
        amount,
        paymentMethod,
        cardLast4: Math.floor(1000 + Math.random() * 9000).toString(),
        orderRef: 'ORD-' + Math.floor(1000 + Math.random() * 9000).toString(),
        customerMasked: '+966 5' + Math.floor(10 + Math.random() * 90) + ' ••• ' + Math.floor(1000 + Math.random() * 9000),
      });

      setTimeout(() => {
        navigateTo('MERCHANT_PAYMENT_SUCCESS');
      }, 800);
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [amount, scheme]);

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
        padding: '20px 24px 36px 24px',
        boxSizing: 'border-box',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes nfcPulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 0.3; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px) rotate(-6deg); }
          50% { transform: translateY(-8px) rotate(-4deg); }
        }
      `}</style>

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
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#A2A2BA' }}>
            {translateText(merchantInfo.businessName, language)}
          </div>
          <div style={{ fontSize: '11px', color: '#7FE87F', fontWeight: 700 }}>
            {isAr ? `جهاز رقم #${formatLocalizedNumber(merchantInfo.terminalId, language)}` : `Terminal #${merchantInfo.terminalId}`}
          </div>
        </div>

        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            backgroundColor: 'rgba(127, 232, 127, 0.12)',
            border: '1px solid rgba(127, 232, 127, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7FE87F',
          }}
        >
          <Wifi size={18} style={{ transform: 'rotate(90deg)' }} />
        </div>
      </div>

      {/* Center Animated NFC Receiver Animation */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 'auto 0' }}>
        {/* Pulsating NFC Circles */}
        <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <div
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              border: '2px solid rgba(127, 232, 127, 0.25)',
              animation: 'nfcPulse 2.4s infinite ease-out',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              border: '2px solid rgba(127, 232, 127, 0.45)',
              animation: 'nfcPulse 2.4s infinite ease-out 0.6s',
            }}
          />

          {/* Central NFC Receiver Icon */}
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '26px',
              backgroundColor: '#151524',
              border: '2px solid #7FE87F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7FE87F',
              zIndex: 2,
              boxShadow: '0 0 30px rgba(127, 232, 127, 0.25)',
            }}
          >
            {step === 'success' ? (
              <CheckCircle2 size={44} color="#7FE87F" />
            ) : (
              <Wifi size={44} style={{ transform: 'rotate(90deg)' }} />
            )}
          </div>
        </div>

        {/* Charge Amount Display */}
        <div className="tabular-nums" style={{ fontSize: '38px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          {formatCurrency(amount, language)}
        </div>

        {/* Dynamic Status Text */}
        <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px', textAlign: 'center' }}>
          {step === 'waiting' && (isAr ? 'مرر البطاقة أو الجوال خلف الجهاز' : 'Hold Card or Phone to Back of Device')}
          {step === 'reading' && (isAr ? 'جاري قراءة الشريحة اللاتلامسية...' : 'Reading Contactless Chip...')}
          {step === 'authorizing' && (isAr ? 'جاري التفويض مع شبكة البنك المركزي...' : 'Authorizing with SAMA Sarie Network...')}
          {step === 'success' && (isAr ? 'تمت العملية بنجاح!' : 'Payment Approved!')}
        </div>

        <p style={{ fontSize: '12px', color: '#A2A2BA', textAlign: 'center', maxWidth: '280px', margin: 0 }}>
          {step === 'waiting'
            ? (isAr ? 'يدعم بطاقات مدى وأبل باي وفيزا وماستركارد اللاتلامسية' : 'Accepts mada contactless debit cards, Apple Pay, Visa, and Mastercard')
            : (isAr ? 'يرجى إبقاء البطاقة ثابتة حتى انتهاء التفويض' : 'Please keep the card still until authorization finishes')}
        </p>
      </div>

      {/* Footer Support Badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          backgroundColor: '#151524',
          border: '1px solid #2C2C44',
          borderRadius: '16px',
          padding: '12px 18px',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#7FE87F' }}>🇸🇦 مدى mada</span>
        <span style={{ color: '#444' }}>•</span>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF' }}> Apple Pay</span>
        <span style={{ color: '#444' }}>•</span>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#5CA3FF' }}>VISA</span>
        <span style={{ color: '#444' }}>•</span>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#FF7B54' }}>Mastercard</span>
      </div>
    </div>
  );
};

