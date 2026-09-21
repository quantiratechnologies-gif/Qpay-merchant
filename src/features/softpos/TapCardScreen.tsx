import React, { useState, useEffect } from 'react';
import { Wifi, CheckCircle2, AlertCircle, RotateCcw, Clock, Smartphone, Zap } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { formatLocalizedNumber } from '../../utils/i18n';
import type { PaymentAcceptanceMethod } from '../../types';
import { AppHeader } from '../../components/AppHeader';

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
  } = useApp();

  const isAr = language === 'العربية';
  const amount = screenParams.amount || softPosAmount || 50.0;
  const rawScheme = screenParams.cardScheme || softPosCardScheme || 'debit';
  const scheme = rawScheme === 'mada' ? 'debit' : rawScheme;

  const [step, setStep] = useState<'waiting' | 'reading' | 'authorizing' | 'success' | 'timeout'>('waiting');
  const [countdown, setCountdown] = useState(5);

  const startTapFlow = () => {
    setStep('waiting');
    setCountdown(5);
  };

  const triggerSuccess = async () => {
    setStep('success');

    let paymentMethod: PaymentAcceptanceMethod = 'softpos_mada';
    let customerMasked = isAr ? 'عميل مدى اللاتلامسي' : 'mada Contactless Customer';
    let cardLast4 = '4821';

    if (scheme === 'applepay') {
      paymentMethod = 'softpos_applepay';
      customerMasked = isAr ? 'دفع عبر أبل باي (آيفون)' : 'Apple Pay (iPhone/Watch)';
      cardLast4 = '8920';
    } else if (scheme === 'visa') {
      paymentMethod = 'softpos_visa';
      customerMasked = isAr ? 'بطاقة فيزا إنفينيت' : 'Visa Infinite Cardholder';
      cardLast4 = '7193';
    } else if (scheme === 'mastercard') {
      paymentMethod = 'softpos_mastercard';
      customerMasked = isAr ? 'بطاقة ماستركارد ورلد' : 'Mastercard World Cardholder';
      cardLast4 = '9034';
    }

    await processMerchantCollection({
      amount,
      paymentMethod,
      cardLast4,
      orderRef: 'POS-' + Math.floor(1000 + Math.random() * 9000).toString(),
      customerMasked,
    });

    setTimeout(() => {
      navigateTo('MERCHANT_PAYMENT_SUCCESS');
    }, 900);
  };

  useEffect(() => {
    // 1. Live 1-second countdown ticker from 5 to 0
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 2. Step 1: Reading chip after 1.8s
    const t1 = setTimeout(() => {
      setStep('reading');
    }, 1800);

    // 3. Step 2: Authorizing with banking network after 3.2s
    const t2 = setTimeout(() => {
      setStep('authorizing');
    }, 3200);

    // 4. Step 3: Success at 5.0s, record collection & transition to receipt
    const t3 = setTimeout(() => {
      triggerSuccess();
    }, 5000);

    return () => {
      clearInterval(countdownTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Theme config per rail
  const railConfig = {
    debit: {
      name: isAr ? 'بطاقة مدى / الخصم المباشر' : 'mada / Debit Card',
      accent: '#00C853',
      bgGlow: 'rgba(0, 200, 83, 0.25)',
      gradient: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #022C22 100%)',
      instructionWaiting: isAr ? 'مرر بطاقة مدى اللاتلامسية خلف الجهاز' : 'Hold mada Card to Back of Phone',
      instructionReading: isAr ? 'جاري قراءة شريحة مدى اللاتلامسية...' : 'Reading mada Contactless Chip...',
      instructionAuth: isAr ? 'جاري التفويض عبر شبكة مدى وسريع...' : 'Authorizing with mada & Sarie Network...',
      subline: isAr
        ? 'يدعم جميع بطاقات مدى الصادرة من البنوك السعودية'
        : 'Accepts all Saudi bank-issued mada EMV cards',
    },
    applepay: {
      name: isAr ? 'أبل باي (Apple Pay)' : 'Apple Pay',
      accent: '#FFFFFF',
      bgGlow: 'rgba(255, 255, 255, 0.22)',
      gradient: 'linear-gradient(135deg, #18181B 0%, #27272A 60%, #09090B 100%)',
      instructionWaiting: isAr ? 'قرّب جهاز آيفون أو ساعة أبل من الهاتف' : 'Hold iPhone or Apple Watch near Device',
      instructionReading: isAr ? 'جاري استلام بيانات Apple Pay المشفرة...' : 'Receiving Apple Pay NFC Token...',
      instructionAuth: isAr ? 'جاري التحقق من مصادقة Face ID...' : 'Authorizing Apple Pay Token with SAMA...',
      subline: isAr
        ? 'انقر مرتين على الزر الجانبي للمصادقة عبر بصمة الوجه'
        : 'Double-click side button on Apple device to authenticate',
    },
    visa: {
      name: isAr ? 'فيزا اللاتلامسية (VISA)' : 'Visa Contactless',
      accent: '#3B82F6',
      bgGlow: 'rgba(59, 130, 246, 0.25)',
      gradient: 'linear-gradient(135deg, #0B192C 0%, #1E3A8A 55%, #172554 100%)',
      instructionWaiting: isAr ? 'مرر بطاقة فيزا اللاتلامسية أمام القارئ' : 'Hold Visa Contactless Card to Device',
      instructionReading: isAr ? 'جاري قراءة بطاقة فيزا اللاتلامسية...' : 'Reading Visa Contactless Chip...',
      instructionAuth: isAr ? 'جاري التفويض عبر شبكة Visa الدولية...' : 'Authorizing with Visa Global Network...',
      subline: isAr
        ? 'يدعم بطاقات فيزا إنفينيت، بلاتينيوم، وبطاقات الأعمال'
        : 'Accepts Visa Infinite, Platinum, and Business Cards',
    },
    mastercard: {
      name: isAr ? 'ماستركارد اللاتلامسية (Mastercard)' : 'Mastercard Contactless',
      accent: '#EB001B',
      bgGlow: 'rgba(235, 0, 27, 0.22)',
      gradient: 'linear-gradient(135deg, #18181B 0%, #2A1719 50%, #1C0A0A 100%)',
      instructionWaiting: isAr ? 'مرر بطاقة ماستركارد اللاتلامسية أمام القارئ' : 'Hold Mastercard to Back of Device',
      instructionReading: isAr ? 'جاري قراءة شريحة ماستركارد اللاتلامسية...' : 'Reading Mastercard Chip...',
      instructionAuth: isAr ? 'جاري التفويض عبر شبكة Mastercard...' : 'Authorizing with Mastercard Gateway...',
      subline: isAr
        ? 'يدعم بطاقات ماستركارد ورلد إيليت والبطاقات الائتمانية'
        : 'Accepts Mastercard World Elite and Contactless Cards',
    },
  }[scheme as 'debit' | 'applepay' | 'visa' | 'mastercard'] || {
    name: 'Contactless NFC',
    accent: '#00C853',
    bgGlow: 'rgba(0, 200, 83, 0.25)',
    gradient: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #022C22 100%)',
    instructionWaiting: 'Hold Card or Phone to Device',
    instructionReading: 'Reading Contactless Chip...',
    instructionAuth: 'Authorizing with Banking Network...',
    subline: 'Accepts all contactless payments',
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100%',
        backgroundColor: '#080C14',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: '28px',
        boxSizing: 'border-box',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <style>{`
        @keyframes nfcPulse {
          0% { transform: scale(0.92); opacity: 0.8; }
          50% { transform: scale(1.18); opacity: 0.3; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes laserScan {
          0% { top: 10%; opacity: 0.2; }
          50% { top: 80%; opacity: 0.9; }
          100% { top: 10%; opacity: 0.2; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px ${railConfig.accent}44; }
          50% { box-shadow: 0 0 35px ${railConfig.accent}88; }
        }
      `}</style>

      {/* Top Bar */}
      <AppHeader
        title={isAr ? `جهاز رقم #${formatLocalizedNumber(merchantInfo.terminalId, language)}` : `Terminal #${merchantInfo.terminalId}`}
        showBack={true}
        showSettings={false}
        rightAction={
          <div
            style={{
              padding: '6px 10px',
              borderRadius: '10px',
              backgroundColor: `${railConfig.accent}1A`,
              border: `1px solid ${railConfig.accent}44`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: railConfig.accent,
              fontSize: '11px',
              fontWeight: 800,
            }}
          >
            <Wifi size={13} />
            <span>NFC Ready</span>
          </div>
        }
      />

      {/* Center Dynamic Payment Mode Visual Animation */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 16px',
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Pulsating NFC Rings Area */}
        <div
          style={{
            position: 'relative',
            width: '260px',
            height: '190px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px',
          }}
        >
          {/* Outer Ripple 1 */}
          <div
            style={{
              position: 'absolute',
              width: '240px',
              height: '180px',
              borderRadius: '24px',
              border: `2px solid ${railConfig.accent}33`,
              animation: 'nfcPulse 2.4s infinite ease-out',
            }}
          />
          {/* Outer Ripple 2 */}
          <div
            style={{
              position: 'absolute',
              width: '200px',
              height: '150px',
              borderRadius: '20px',
              border: `2px solid ${railConfig.accent}55`,
              animation: 'nfcPulse 2.4s infinite ease-out 0.6s',
            }}
          />

          {/* DYNAMIC CARD / DEVICE ARTWORK ACCORDING TO SELECTED RAIL */}
          {scheme === 'debit' && (
            /* Saudi mada Debit Card Graphic */
            <div
              style={{
                width: '210px',
                height: '130px',
                borderRadius: '16px',
                background: railConfig.gradient,
                border: '1.5px solid rgba(0, 200, 83, 0.5)',
                boxShadow: '0 12px 35px rgba(0, 200, 83, 0.35)',
                animation: 'cardFloat 4s ease-in-out infinite',
                padding: '12px 14px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Gold EMV Chip + Contactless Wave */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '20px',
                      borderRadius: '5px',
                      backgroundColor: '#EAB308',
                      backgroundImage: 'linear-gradient(135deg, #FDE047 0%, #CA8A04 100%)',
                      border: '1px solid #FEF08A',
                      position: 'relative',
                    }}
                  >
                    <div style={{ position: 'absolute', inset: '4px', border: '1px solid rgba(0,0,0,0.2)' }} />
                  </div>
                  <Wifi size={16} color="#FFFFFF" style={{ transform: 'rotate(90deg)' }} />
                </div>
                {/* mada Badge */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#00843D',
                    borderRadius: '6px',
                    padding: '2px 7px',
                    fontSize: '11px',
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                  }}
                >
                  mada | مدى
                </div>
              </div>

              {/* Card Number & Holder */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.12em' }}>
                  •••• •••• •••• 4821
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#A7F3D0', letterSpacing: '0.05em' }}>
                    SAUDI DEBIT
                  </span>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#6EE7B7' }}>
                    SAMA / SARIE
                  </span>
                </div>
              </div>
            </div>
          )}

          {scheme === 'applepay' && (
            /* Apple Pay Device & Watch Graphic */
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                animation: 'cardFloat 4s ease-in-out infinite',
              }}
            >
              {/* iPhone Mockup */}
              <div
                style={{
                  width: '110px',
                  height: '145px',
                  borderRadius: '22px',
                  backgroundColor: '#1C1C1E',
                  border: '2.5px solid #3A3A3C',
                  boxShadow: '0 12px 35px rgba(255, 255, 255, 0.2)',
                  padding: '8px 7px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Laser scan line animation */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: '#38BDF8',
                    boxShadow: '0 0 10px #38BDF8',
                    animation: 'laserScan 2.5s infinite ease-in-out',
                    zIndex: 3,
                  }}
                />

                {/* Dynamic Island */}
                <div style={{ width: '32px', height: '8px', backgroundColor: '#000000', borderRadius: '5px' }} />

                {/* Apple Pay Card in Wallet */}
                <div
                  style={{
                    width: '100%',
                    height: '62px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #27272A 0%, #09090B 100%)',
                    border: '1px solid #52525B',
                    padding: '6px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <svg viewBox="0 0 170 170" width="10" height="10" fill="#FFFFFF">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.77-11.7-14.2-5.77-9.05-10.15-19.78-13.14-32.19-2.99-12.41-4.49-24.16-4.49-35.25 0-14.56 3.66-26.68 10.98-36.35 7.32-9.67 16.59-14.56 27.81-14.67 4.9.11 10.23 1.34 15.99 3.69 5.76 2.35 9.77 3.53 12.03 3.53 2.07 0 6.13-1.22 12.18-3.67 6.05-2.45 11.24-3.56 15.58-3.33 13.91 1.09 24.32 6.31 31.23 15.66-12.18 7.39-18.17 17.51-17.97 30.34.22 10.23 4.13 18.82 11.75 25.78 7.62 6.96 16.64 11.09 27.08 12.39-2.5 7.29-5.44 14.69-8.82 22.2zM119.22 33.55c0-6.74 2.45-13.16 7.36-19.26 4.9-6.1 11.09-10.44 18.57-13.02.65 3.91.76 7.29.33 10.12-.65 5-2.72 9.9-6.2 14.71-3.48 4.8-7.72 8.37-12.72 10.7-1.96 1.09-4.24 1.85-6.84 2.29-.33-1.85-.5-3.69-.5-5.54z" />
                    </svg>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#FFFFFF' }}>Pay</span>
                  </div>
                  <div style={{ fontSize: '8px', color: '#A1A1AA', fontFamily: 'monospace' }}>•••• 8920</div>
                </div>

                {/* Ready Check / NFC indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '8px', fontWeight: 800, color: '#00C853' }}>
                  <CheckCircle2 size={10} color="#00C853" />
                  <span>Hold Near</span>
                </div>
              </div>

              {/* Apple Watch Mockup */}
              <div
                style={{
                  width: '68px',
                  height: '82px',
                  borderRadius: '18px',
                  backgroundColor: '#1C1C1E',
                  border: '2px solid #3A3A3C',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  padding: '6px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <Wifi size={14} color="#38BDF8" style={{ transform: 'rotate(90deg)' }} />
                <div style={{ fontSize: '7.5px', fontWeight: 800, color: '#FFFFFF', textAlign: 'center' }}>
                  Apple Watch
                </div>
              </div>
            </div>
          )}

          {scheme === 'visa' && (
            /* Luxury Visa Platinum / Infinite Card Graphic */
            <div
              style={{
                width: '210px',
                height: '130px',
                borderRadius: '16px',
                background: railConfig.gradient,
                border: '1.5px solid rgba(59, 130, 246, 0.5)',
                boxShadow: '0 12px 35px rgba(59, 130, 246, 0.35)',
                animation: 'cardFloat 4s ease-in-out infinite',
                padding: '12px 14px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Silver EMV Chip + Wave */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '20px',
                      borderRadius: '5px',
                      backgroundColor: '#94A3B8',
                      backgroundImage: 'linear-gradient(135deg, #E2E8F0 0%, #64748B 100%)',
                      border: '1px solid #F1F5F9',
                      position: 'relative',
                    }}
                  >
                    <div style={{ position: 'absolute', inset: '4px', border: '1px solid rgba(0,0,0,0.2)' }} />
                  </div>
                  <Wifi size={16} color="#60A5FA" style={{ transform: 'rotate(90deg)' }} />
                </div>
                {/* VISA Logo */}
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    color: '#FFFFFF',
                    letterSpacing: '0.06em',
                    textShadow: '0 0 12px rgba(59, 130, 246, 0.8)',
                  }}
                >
                  VISA
                </div>
              </div>

              {/* Card Number & Platinum Tier */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.12em' }}>
                  •••• •••• •••• 7193
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#93C5FD', letterSpacing: '0.08em' }}>
                    INFINITE / PLATINUM
                  </span>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#60A5FA' }}>
                    CONTACTLESS
                  </span>
                </div>
              </div>
            </div>
          )}

          {scheme === 'mastercard' && (
            /* Luxury Mastercard World Elite Card Graphic */
            <div
              style={{
                width: '210px',
                height: '130px',
                borderRadius: '16px',
                background: railConfig.gradient,
                border: '1.5px solid rgba(235, 0, 27, 0.5)',
                boxShadow: '0 12px 35px rgba(235, 0, 27, 0.35)',
                animation: 'cardFloat 4s ease-in-out infinite',
                padding: '12px 14px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Bronze EMV Chip + Wave */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '20px',
                      borderRadius: '5px',
                      backgroundColor: '#CA8A04',
                      backgroundImage: 'linear-gradient(135deg, #FDE047 0%, #A16207 100%)',
                      border: '1px solid #FEF08A',
                      position: 'relative',
                    }}
                  >
                    <div style={{ position: 'absolute', inset: '4px', border: '1px solid rgba(0,0,0,0.2)' }} />
                  </div>
                  <Wifi size={16} color="#FB923C" style={{ transform: 'rotate(90deg)' }} />
                </div>

                {/* Mastercard Interlocking Circles */}
                <div style={{ display: 'flex', alignItems: 'center', width: '32px', height: '20px', position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#EB001B',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#F79E1B',
                      opacity: 0.95,
                    }}
                  />
                </div>
              </div>

              {/* Card Number & World Elite Tier */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.12em' }}>
                  •••• •••• •••• 9034
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#FCA5A5', letterSpacing: '0.08em' }}>
                    WORLD ELITE
                  </span>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#FDBA74' }}>
                    mastercard
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Charge Amount Display */}
        <div
          className="tabular-nums"
          style={{
            fontSize: '36px',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            marginBottom: '6px',
            lineHeight: 1.1,
          }}
        >
          {formatCurrency(amount, language)}
        </div>

        {/* Selected Scheme Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: `${railConfig.accent}1F`,
            border: `1px solid ${railConfig.accent}4D`,
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '12px',
            fontWeight: 800,
            color: railConfig.accent,
            marginBottom: '10px',
          }}
        >
          <span>{railConfig.name}</span>
        </div>

        {/* Dynamic Status Text */}
        <div
          style={{
            fontSize: '15px',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '4px',
            textAlign: 'center',
            minHeight: '24px',
          }}
        >
          {step === 'waiting' && railConfig.instructionWaiting}
          {step === 'reading' && railConfig.instructionReading}
          {step === 'authorizing' && railConfig.instructionAuth}
          {step === 'success' && (isAr ? 'تمت العملية بنجاح!' : 'Payment Approved!')}
          {step === 'timeout' && (isAr ? 'انتهت مهلة قراءة البطاقة (NFC)' : 'NFC Read Timeout')}
        </div>

        <p
          style={{
            fontSize: '12px',
            color: '#94A3B8',
            textAlign: 'center',
            maxWidth: '300px',
            margin: '0 0 14px 0',
            lineHeight: 1.4,
          }}
        >
          {step === 'waiting' && railConfig.subline}
          {(step === 'reading' || step === 'authorizing') &&
            (isAr ? 'يرجى إبقاء البطاقة / الجوال ثابتاً حتى اكتمال التفويض' : 'Please keep device or card still until authorization finishes')}
          {step === 'timeout' &&
            (isAr
              ? 'تعذر الاتصال بالشريحة اللاتلامسية أو تم إبعادها سريعاً. يرجى إعادة المحاولة.'
              : 'Could not read card chip or it was moved away too quickly. Please try tapping again.')}
        </p>

        {/* 5s Live Countdown Timer Bar */}
        {step !== 'timeout' && step !== 'success' && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: `${railConfig.accent}14`,
              border: `1px solid ${railConfig.accent}33`,
              padding: '5px 12px',
              borderRadius: '14px',
              fontSize: '11.5px',
              color: railConfig.accent,
              fontWeight: 700,
              marginBottom: '10px',
            }}
          >
            <Clock size={13} />
            <span>{isAr ? `مهلة التمرير: ${countdown} ثوانٍ` : `Simulating NFC Tap: ${countdown}s`}</span>
          </div>
        )}

        {/* Instant Manual Tap / Complete Button for Quick Prototyping */}
        {step !== 'timeout' && step !== 'success' && (
          <button
            type="button"
            onClick={triggerSuccess}
            className="interactive-tap"
            style={{
              marginTop: '4px',
              backgroundColor: '#131B2A',
              border: `1px dashed ${railConfig.accent}88`,
              borderRadius: '12px',
              padding: '8px 16px',
              color: railConfig.accent,
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Zap size={13} />
            <span>{isAr ? 'محاكاة التمرير الفوري (انقر الآن)' : 'Tap Now (Instant Simulate)'}</span>
          </button>
        )}

        {step === 'timeout' && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px', width: '100%', maxWidth: '280px' }}>
            <button
              type="button"
              onClick={startTapFlow}
              className="interactive-tap"
              style={{
                flex: 1,
                backgroundColor: railConfig.accent,
                color: '#080C14',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <RotateCcw size={14} />
              {isAr ? 'إعادة التمرير' : 'Retry Tap'}
            </button>
            <button
              type="button"
              onClick={goBack}
              className="interactive-tap"
              style={{
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '12px 18px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        )}
      </div>

      {/* Footer Support Badges with Active Highlight */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          padding: '0 16px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
            backgroundColor: '#0D1424',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '8px',
          }}
        >
          {/* Debit */}
          <div
            style={{
              padding: '6px 4px',
              borderRadius: '10px',
              textAlign: 'center',
              backgroundColor: scheme === 'debit' ? 'rgba(0, 200, 83, 0.18)' : 'transparent',
              border: scheme === 'debit' ? '1px solid #00C853' : '1px solid transparent',
              color: scheme === 'debit' ? '#00C853' : '#64748B',
              fontSize: '11px',
              fontWeight: 800,
            }}
          >
            💳 Debit
          </div>

          {/* Apple Pay */}
          <div
            style={{
              padding: '6px 4px',
              borderRadius: '10px',
              textAlign: 'center',
              backgroundColor: scheme === 'applepay' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              border: scheme === 'applepay' ? '1px solid #FFFFFF' : '1px solid transparent',
              color: scheme === 'applepay' ? '#FFFFFF' : '#64748B',
              fontSize: '11px',
              fontWeight: 800,
            }}
          >
             Pay
          </div>

          {/* VISA */}
          <div
            style={{
              padding: '6px 4px',
              borderRadius: '10px',
              textAlign: 'center',
              backgroundColor: scheme === 'visa' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              border: scheme === 'visa' ? '1px solid #3B82F6' : '1px solid transparent',
              color: scheme === 'visa' ? '#60A5FA' : '#64748B',
              fontSize: '11px',
              fontWeight: 800,
            }}
          >
            VISA
          </div>

          {/* Mastercard */}
          <div
            style={{
              padding: '6px 4px',
              borderRadius: '10px',
              textAlign: 'center',
              backgroundColor: scheme === 'mastercard' ? 'rgba(235, 0, 27, 0.18)' : 'transparent',
              border: scheme === 'mastercard' ? '1px solid #EB001B' : '1px solid transparent',
              color: scheme === 'mastercard' ? '#F87171' : '#64748B',
              fontSize: '11px',
              fontWeight: 800,
            }}
          >
            Master
          </div>
        </div>
      </div>
    </div>
  );
};
