import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { AlphPayLogo } from '../../components/AlphPayLogo';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useApp } from '../../state/AppContext';
import { toArabicNumerals } from '../../utils/i18n';
import { authService } from '../../services/authService';
import { saveSession } from '../../services/sessionStore';
import { supabase } from '../../services/supabaseClient';

export const SmsOtpScreen: React.FC = () => {
  const {
    navigateTo,
    screenParams,
    goBack,
    isRtl,
    language,
    updateUser,
    updateMerchantInfo,
    initSession,
  } = useApp();

  const mobile = screenParams?.mobile || '';
  const phone = screenParams?.phone || (`+966${mobile.replace(/\D/g, '')}`);
  const fullName = screenParams?.name || screenParams?.fullName || '';
  const businessName = screenParams?.businessName || '';
  const isAr = language === 'العربية';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResent, setIsResent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

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
      if (pasteDigits.length === 6) {
        triggerVerifyWithCode(pasteDigits.join(''));
      }
      return;
    }

    const singleDigit = cleanVal.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = singleDigit;
    setOtp(newOtp);

    if (singleDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (singleDigit && index === 5) {
      const fullCode = newOtp.join('');
      if (fullCode.length === 6) {
        triggerVerifyWithCode(fullCode);
      }
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
    if (isVerifying || enteredCode.length < 6) return;
    setErrorMsg('');
    setIsVerifying(true);

    try {
      const result = await authService.verifyOtp(
        phone,
        enteredCode,
        'merchant',
        fullName || undefined,
        businessName || undefined,
      );

      const { user: apiUser, session } = result;

      await saveSession(
        {
          id: apiUser.id,
          role: apiUser.role,
          name: apiUser.name,
          mobile: apiUser.mobile,
          merchantCode: apiUser.merchantCode,
          businessName: apiUser.businessName,
        },
        session.access_token,
      );

      supabase.realtime.setAuth(session.access_token);

      updateUser({
        id: apiUser.id,
        name: apiUser.name,
        mobile: apiUser.mobile,
      });

      if (apiUser.merchantCode || apiUser.businessName) {
        updateMerchantInfo({
          merchantCode: apiUser.merchantCode,
          businessName: apiUser.businessName || fullName,
        });
      }

      await initSession(session.access_token, apiUser.id);
      navigateTo('PERMISSIONS');
    } catch (err: any) {
      const status = err?.status;
      const code = err?.code || '';
      const msg = err?.message || '';

      if (status === 409 || code === 'ROLE_MISMATCH' || msg.includes('ROLE_MISMATCH') || msg.includes('customer')) {
        setErrorMsg('This number is registered as a customer');
      } else if (status === 400 || msg.includes('invalid') || msg.includes('expired')) {
        setErrorMsg(
          isAr
            ? 'رمز التحقق غير صحيح أو انتهت صلاحيته. يرجى إعادة الإرسال.'
            : 'Invalid or expired verification code. Please request a new one.'
        );
      } else {
        setErrorMsg(
          msg || (isAr ? 'حدث خطأ أثناء التحقق. يرجى المحاولة لاحقاً.' : 'Verification failed. Please try again.')
        );
      }
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerify = async () => {
    if (!isComplete || isVerifying) return;
    await triggerVerifyWithCode(otp.join(''));
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setIsResent(true);
    setErrorMsg('');
    try {
      await authService.resendOtp(phone);
      setTimer(30);
      setTimeout(() => setIsResent(false), 4000);
    } catch (err: any) {
      setErrorMsg(isAr ? 'فشل إعادة إرسال الرمز.' : 'Failed to resend code.');
      setIsResent(false);
    }
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
      {/* Top Header */}
      <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '40px',
            marginBottom: '28px',
          }}
        >
          <button
            onClick={goBack}
            className="interactive-tap"
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '12px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            {isRtl ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          </button>
          <AlphPayLogo variant="horizontal" size={26} themeMode="dark" />
          <div style={{ width: '38px' }} />
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 8px 0',
              letterSpacing: '-0.02em',
            }}
          >
            {isAr ? 'رمز التحقق (٦ أرقام)' : 'Enter 6-Digit OTP'}
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
            {isAr
              ? `أدخل الرمز المكوّن من 6 أرقام المرسل إلى ${toArabicNumerals(phone)}`
              : `Enter the 6-digit code sent to ${phone}`}
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#EF4444',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* OTP Input Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '28px',
            direction: 'ltr',
          }}
        >
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="tel"
              inputMode="numeric"
              autoComplete={idx === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              style={{
                width: '46px',
                height: '54px',
                backgroundColor: '#111726',
                border: digit ? '2px solid #00C853' : '1px solid #1E293B',
                borderRadius: '14px',
                textAlign: 'center',
                fontSize: '22px',
                fontWeight: 800,
                color: '#FFFFFF',
                outline: 'none',
                fontVariantNumeric: 'tabular-nums',
                boxShadow: digit ? '0 0 12px rgba(0, 200, 83, 0.2)' : 'none',
                transition: 'all 0.15s ease',
              }}
            />
          ))}
        </div>

        {/* Timer / Resend */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {timer > 0 ? (
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              {isAr
                ? `إعادة الإرسال خلال ${toArabicNumerals(timer)} ثانية`
                : `Resend code in ${timer}s`}
            </p>
          ) : (
            <button
              onClick={handleResend}
              style={{
                background: 'none',
                border: 'none',
                color: '#00C853',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              {isResent ? (isAr ? 'تم الإرسال!' : 'Code Sent!') : (isAr ? 'إعادة إرسال الرمز' : 'Resend Code')}
            </button>
          )}
        </div>

        {/* Verify Button */}
        <PrimaryButton
          onClick={handleVerify}
          disabled={!isComplete || isVerifying}
          style={{ width: '100%', height: '52px' }}
        >
          {isVerifying ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              <span>{isAr ? 'جاري التحقق...' : 'Verifying...'}</span>
            </div>
          ) : (
            <span>{isAr ? 'تأكيد الرمز' : 'Verify & Continue'}</span>
          )}
        </PrimaryButton>
      </div>
    </div>
  );
};
