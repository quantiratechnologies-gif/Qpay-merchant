import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
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

  const isOtpComplete = otp.every((d) => d.trim().length > 0);

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

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
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
    if (isOtpComplete) {
      navigateTo('PERMISSIONS');
    }
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
        minHeight: '100%',
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
      {/* Top Section */}
      <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        {/* Top Navigation Row (Back Button at exact top-left) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: '40px',
            marginBottom: '24px',
          }}
        >
          <button
            onClick={goBack}
            aria-label="Go Back"
            className="interactive-tap"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
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

        {/* Title Block (Exact same vertical Y-position & font hierarchy) */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 8px 0',
              letterSpacing: '-0.02em',
            }}
          >
            {isAr ? 'التحقق من الرمز' : 'Verify OTP'}
          </h1>
          <p
            style={{
              fontSize: '13.5px',
              color: '#94A3B8',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {isAr ? 'تم إرسال رمز التحقق في رسالة نصية إلى' : 'Code sent via SMS to'}{' '}
            <span style={{ color: '#00C853', fontWeight: 700 }} dir="ltr">
              +966 {mobile}
            </span>
          </p>
        </div>

        {/* Form Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* OTP Digit Boxes */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
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
                    width: '48px',
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
                      borderRadius: '14px',
                      backgroundColor: '#111726',
                      border: isFilled ? '1.5px solid #00C853' : '1px solid #1E293B',
                      fontSize: '22px',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      textAlign: 'center',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
                    }}
                  />
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
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              padding: '12px 16px',
              borderRadius: '14px',
              height: '52px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#00C853" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#E2E8F0' }}>
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
                padding: '6px 12px',
                fontSize: '11.5px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {isAr ? 'تعبئة' : 'Autofill'}
            </button>
          </div>

          {/* Resend SMS Counter */}
          <div style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8', margin: '4px 0' }}>
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
                  : 'إعادة إرسال الآن'
                : timer > 0
                ? `Resend in 00:${timer < 10 ? `0${timer}` : timer}`
                : 'Resend Now'}
            </button>
          </div>

          {isResent && (
            <div
              style={{
                textAlign: 'center',
                fontSize: '12px',
                color: '#00C853',
                fontWeight: 700,
              }}
            >
              {isAr ? '✓ تم إرسال رمز جديد بنجاح' : '✓ New OTP code dispatched to mobile'}
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={!isOtpComplete}
            className="interactive-tap"
            style={{
              marginTop: '4px',
              height: '52px',
              backgroundColor: isOtpComplete ? '#00C853' : '#161F30',
              color: isOtpComplete ? '#080C14' : '#64748B',
              border: isOtpComplete ? 'none' : '1px solid #1E293B',
              borderRadius: '14px',
              fontSize: '15.5px',
              fontWeight: 800,
              cursor: isOtpComplete ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: isOtpComplete ? '0 4px 20px rgba(0, 200, 83, 0.35)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{isAr ? 'التحقق والمتابعة' : 'Verify & Proceed'}</span>
            <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

