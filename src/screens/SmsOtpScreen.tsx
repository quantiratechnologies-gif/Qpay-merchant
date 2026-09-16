import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { QuantiraLogo } from '../components/QuantiraLogo';
import { useApp } from '../state/AppContext';
import { toArabicNumerals } from '../utils/i18n';

export const SmsOtpScreen: React.FC = () => {
  const { navigateTo, screenParams, goBack, isRtl, language } = useApp();
  const isAr = language === 'العربية';
  const mobile = screenParams.mobile || '501234567';

  const [otp, setOtp] = useState<string[]>(['5', '8', '2', '', '', '']);
  const [timer, setTimer] = useState(28);
  const [isResent, setIsResent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus first empty input on mount
  useEffect(() => {
    const firstEmptyIndex = otp.findIndex((d) => !d);
    const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
    inputRefs.current[targetIndex]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    // Handle paste or multi-character entry
    const digitsOnly = value.replace(/\D/g, '');
    if (!digitsOnly) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    if (digitsOnly.length > 1) {
      const pasteDigits = digitsOnly.slice(0, 6).split('');
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        if (i < pasteDigits.length) {
          newOtp[i] = pasteDigits[i];
        }
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pasteDigits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = digitsOnly.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance to next box
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Current is empty, delete previous and focus previous
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        // Current has value, clear it
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = () => {
    navigateTo('PERMISSIONS');
  };

  const handleResend = () => {
    setTimer(30);
    setIsResent(true);
    setTimeout(() => setIsResent(false), 3000);
  };

  const handleAutofillDemo = () => {
    const demo = ['5', '8', '2', '9', '0', '4'];
    setOtp(demo);
    inputRefs.current[5]?.focus();
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
        padding: '24px 20px',
        boxSizing: 'border-box',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Top Bar with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
        <button
          onClick={goBack}
          aria-label="Go Back"
          className="interactive-tap"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: '#161F30',
            border: '1px solid #2A364F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        </button>
      </div>

      {/* Main Content Hub */}
      <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}>
        {/* Verification Emblem */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <div
            style={{
              position: 'relative',
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00C853',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              marginBottom: '16px',
            }}
          >
            <ShieldCheck size={32} strokeWidth={2.2} />
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#00C853',
                border: '2px solid #111726',
              }}
            />
          </div>

          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 6px 0',
              textAlign: 'center',
            }}
          >
            {isAr ? 'التحقق من الرمز' : 'Verify OTP'}
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: '#94A3B8',
              margin: 0,
              textAlign: 'center',
            }}
          >
            {isAr ? 'تم إرسال رمز التحقق في رسالة نصية إلى' : 'Code sent via SMS to'}{' '}
            <span style={{ color: '#00C853', fontWeight: 700 }} dir="ltr">
              +966 {mobile}
            </span>
          </p>
        </div>

        {/* OTP Input Card */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '20px',
            padding: '24px 18px',
            boxSizing: 'border-box',
            marginBottom: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* OTP Digit Boxes */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              marginBottom: '20px',
              direction: 'ltr',
            }}
          >
            {otp.map((digit, i) => {
              const isFilled = Boolean(digit);
              return (
                <div
                  key={i}
                  style={{
                    position: 'relative',
                    width: '46px',
                    height: '54px',
                  }}
                >
                  <input
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className="tabular-nums"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px',
                      backgroundColor: '#161F30',
                      border: isFilled ? '1.5px solid #00C853' : '1px solid #2A364F',
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      textAlign: 'center',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
                    }}
                  />
                  {/* Active Indicator Underline */}
                  {isFilled && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '12px',
                        right: '12px',
                        height: '2.5px',
                        backgroundColor: '#00C853',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Autofill Helper */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#161F30',
              border: '1px solid #2A364F',
              padding: '10px 14px',
              borderRadius: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#00C853" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#E2E8F0' }}>
                {isAr ? `رمز الرسالة: ${toArabicNumerals('582904')}` : 'Demo OTP: 582904'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="interactive-tap"
              style={{
                backgroundColor: 'rgba(0, 200, 83, 0.15)',
                color: '#00C853',
                border: '1px solid rgba(0, 200, 83, 0.4)',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {isAr ? 'تعبئة' : 'Autofill'}
            </button>
          </div>

          {/* Resend SMS Counter */}
          <div style={{ textAlign: 'center', fontSize: '12.5px', color: '#94A3B8' }}>
            <span>{isAr ? 'لم تستلم الرمز؟ ' : "Didn't receive code? "}</span>
            <button
              disabled={timer > 0}
              onClick={handleResend}
              style={{
                background: 'none',
                border: 'none',
                color: timer > 0 ? '#64748B' : '#00C853',
                fontWeight: 800,
                cursor: timer > 0 ? 'not-allowed' : 'pointer',
                padding: 0,
              }}
            >
              {isAr
                ? timer > 0
                  ? `إعادة الإرسال بعد (${toArabicNumerals(timer < 10 ? `0${timer}` : timer)} ثانية)`
                  : 'إعادة إرسال'
                : `Resend in ${timer > 0 ? `00:${timer < 10 ? `0${timer}` : timer}` : 'Now'}`}
            </button>
          </div>

          {isResent && (
            <div
              style={{
                textAlign: 'center',
                fontSize: '11.5px',
                color: '#00C853',
                fontWeight: 700,
                marginTop: '10px',
              }}
            >
              {isAr ? '✓ تم إرسال رمز جديد بنجاح' : '✓ New OTP code dispatched to mobile'}
            </div>
          )}
        </div>

        {/* Primary CTA: Verify & Proceed */}
        <button
          onClick={handleVerify}
          disabled={otp.some((d) => !d)}
          className="interactive-tap"
          style={{
            width: '100%',
            backgroundColor: '#00C853',
            color: '#080C14',
            border: 'none',
            borderRadius: '14px',
            padding: '14px 20px',
            fontSize: '15px',
            fontWeight: 800,
            cursor: otp.some((d) => !d) ? 'not-allowed' : 'pointer',
            opacity: otp.some((d) => !d) ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(0, 200, 83, 0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          <span>{isAr ? 'التحقق والمتابعة' : 'Verify & Proceed'}</span>
          <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        </button>
      </div>

      {/* Powered by Quantira Technologies */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          width: '100%',
          textAlign: 'center',
          paddingBottom: '8px',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            color: '#64748B',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {isAr ? 'مشغل بواسطة' : 'POWERED BY QUANTIRA TECHNOLOGIES'}
        </span>
        <QuantiraLogo size={18} color="#00C853" textColor="#CBD5E1" />
      </div>
    </div>
  );
};

