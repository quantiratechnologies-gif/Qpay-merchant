import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { AlphPayLogo } from '../../components/AlphPayLogo';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useApp } from '../../state/AppContext';
import { toArabicNumerals } from '../../utils/i18n';
import { authenticateMerchantWithAnyOtp } from '../../services/supabaseClient';

export const SmsOtpScreen: React.FC = () => {
  const {
    navigateTo,
    screenParams,
    goBack,
    isRtl,
    language,
    updateUser,
    updateMerchantInfo,
    setIsAuthenticated,
    loginWithPhone,
    activeOtp,
    setActiveOtp,
    verifyOtp,
  } = useApp();

  const mobile = screenParams?.mobile || '';
  const userName = screenParams?.name || '';
  const isAr = language === 'العربية';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResent, setIsResent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showSmsBanner, setShowSmsBanner] = useState<boolean>(true);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    setErrorMsg('');
    const cleanVal = value.replace(/\D/g, '');

    if (cleanVal.length > 1) {
      const pasteDigits = cleanVal.slice(0, 6).split('');
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

    const singleDigit = cleanVal.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = singleDigit;
    setOtp(newOtp);

    if (singleDigit && index < 5) {
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

  const isComplete = otp.every((digit) => digit.length > 0);

  const triggerVerifyWithCode = async (enteredCode: string) => {
    if (isVerifying) return;
    setErrorMsg('');

    const isValid = verifyOtp(enteredCode);

    if (!isValid) {
      setErrorMsg(
        isAr
          ? 'رمز التحقق غير صحيح، يرجى التأكد من الرسائل النصية والمحاولة مرة أخرى'
          : 'Invalid verification code. Please check your SMS and try again.'
      );
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    setIsVerifying(true);

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('qpay_merchant_authenticated', 'true');
      localStorage.setItem('qpay_merchant_authenticated', 'true');
    }

    try {
      const { user: authedUser } = await authenticateMerchantWithAnyOtp(
        mobile,
        enteredCode,
        '',
        userName
      );
      if (authedUser) updateUser(authedUser);
    } catch (e) {
      console.warn('Merchant auth notice:', e);
    } finally {
      setIsVerifying(false);
    }

    // Check if returning merchant with saved store data or new merchant number
    const isReturning = loginWithPhone(mobile, userName);
    if (isReturning) {
      navigateTo('MERCHANT_HOME');
    } else {
      navigateTo('MERCHANT_SETUP');
    }
  };

  const handleVerify = async () => {
    if (!isComplete || isVerifying) return;
    await triggerVerifyWithCode(otp.join(''));
  };

  const handleResend = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtp(newCode);
    setTimer(30);
    setIsResent(true);
    setShowSmsBanner(true);
    setTimeout(() => setIsResent(false), 4000);
  };

  const handleQuickFill = (codeToFill?: string) => {
    const targetCode = codeToFill || activeOtp || '589204';
    const digits = targetCode.slice(0, 6).split('');
    setOtp(digits);
    setErrorMsg('');
    inputRefs.current[5]?.focus();
  };

  // Auto-retrieve OTP simulation after 1.2s
  useEffect(() => {
    const autoTimer = setTimeout(() => {
      if (otp.every((d) => d === '')) {
        const code = activeOtp || '589204';
        handleQuickFill(code);
      }
    }, 1400);
    return () => clearTimeout(autoTimer);
  }, []);

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
      {/* Top Simulated SMS Notification Banner */}
      {showSmsBanner && (
        <div
          onClick={() => handleQuickFill(activeOtp)}
          className="interactive-tap fade-in"
          style={{
            backgroundColor: '#111726',
            border: '1.5px solid rgba(0, 200, 83, 0.45)',
            borderRadius: '16px',
            padding: '12px 16px',
            marginBottom: '20px',
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto 20px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxSizing: 'border-box',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0, 200, 83, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>📩</span>
            <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#00C853', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isAr ? 'رسالة نصية واردة • ريال باي' : 'Incoming SMS • Riyal Pay'}
              </div>
              <div style={{ fontSize: '12.5px', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>
                {isAr ? 'رمز تحقق الدخول: ' : 'Verification Code: '}
                <strong style={{ color: '#00C853', fontSize: '15px', letterSpacing: '1.5px' }}>{activeOtp || '589204'}</strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleQuickFill(activeOtp);
            }}
            style={{
              backgroundColor: '#00C853',
              color: '#080C14',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0, 200, 83, 0.3)',
            }}
          >
            {isAr ? 'استرجاع الرمز' : 'Retrieve OTP'}
          </button>
        </div>
      )}

      {/* Top Center: App Brand Logo */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          marginBottom: '24px',
        }}
      >
        <AlphPayLogo variant="horizontal" size={30} themeMode="dark" />
      </div>

      {/* Main OTP Verification Form Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          backgroundColor: '#111726',
          border: '1px solid #1E293B',
          borderRadius: '24px',
          padding: '28px 20px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            {isAr ? 'رمز التحقق السريع' : 'Enter Verification Code'}
          </h2>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 10px 0' }}>
            {isAr ? 'تم إرسال رمز التحقق عبر SMS إلى' : 'Sent via SMS OTP to'}{' '}
            <span style={{ color: '#00C853', fontWeight: 700 }} dir="ltr">
              +966 {mobile}
            </span>
          </p>
          <button
            onClick={goBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ArrowLeft size={13} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            <span>{isAr ? 'تغيير رقم الجوال' : 'Change Mobile Number'}</span>
          </button>
        </div>

        {/* Error Alert if incorrect OTP */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '12px',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* 6-Digit Clean OTP Boxes */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '22px',
            direction: 'ltr',
          }}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              autoFocus={i === 0}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="tabular-nums"
              style={{
                width: '46px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#182236',
                border: digit ? '2px solid #00C853' : '1px solid #1E293B',
                fontSize: '22px',
                fontWeight: 800,
                color: '#FFFFFF',
                textAlign: 'center',
                outline: 'none',
                transition: 'all 0.15s ease',
                boxShadow: digit ? '0 0 10px rgba(0, 200, 83, 0.2)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Resend SMS Counter */}
        <div style={{ textAlign: 'center', fontSize: '12.5px', color: '#94A3B8', marginBottom: '20px' }}>
          {isAr ? 'لم تستلم الرمز؟ ' : "Didn't receive SMS? "}
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
                : 'إعادة إرسال الرمز'
              : `Resend Code ${timer > 0 ? `(00:${timer < 10 ? `0${timer}` : timer}s)` : ''}`}
          </button>
        </div>

        {isResent && (
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#00C853', fontWeight: 700, marginBottom: '14px' }}>
            {isAr ? 'تم إعادة إرسال رمز التحقق بنجاح' : 'New code sent successfully!'}
          </div>
        )}

        <PrimaryButton onClick={handleVerify} disabled={!isComplete || isVerifying}>
          {isVerifying ? (isAr ? 'جاري التحقق...' : 'Verifying...') : (isAr ? 'تأكيد ودخول البوابة' : 'Verify & Continue')} <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        </PrimaryButton>

        {/* Test OTP Helper Badge */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => handleQuickFill(activeOtp || '582904')}
            style={{
              background: 'rgba(0, 200, 83, 0.08)',
              border: '1px dashed rgba(0, 200, 83, 0.3)',
              borderRadius: '10px',
              padding: '6px 14px',
              color: '#94A3B8',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{isAr ? 'رمز التحقق التجريبي:' : 'Test OTP Passcode:'}</span>
            <strong style={{ color: '#00C853', letterSpacing: '1px' }}>{activeOtp || '582904'}</strong>
            <span style={{ fontSize: '10px', color: '#64748B' }}>({isAr ? 'انقر للتعبئة' : 'Tap to autofill'})</span>
          </button>
        </div>
      </div>

      <div style={{ height: '20px' }} />
    </div>
  );
};

export default SmsOtpScreen;
