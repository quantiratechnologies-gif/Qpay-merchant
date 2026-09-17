import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { authenticateMerchantWithAnyOtp } from '../services/supabaseClient';

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
    activeOtp,
    setActiveOtp,
    verifyOtp,
  } = useApp();

  const isAr = language === 'العربية';
  const mobile = screenParams.mobile || '501234567';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(28);
  const [isResent, setIsResent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showSmsBanner, setShowSmsBanner] = useState<boolean>(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isOtpComplete = otp.every((d) => d.trim().length > 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    setErrorMsg('');
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
    setErrorMsg('');
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

  const handleQuickFill = (codeToFill?: string) => {
    const targetCode = codeToFill || activeOtp || '589204';
    const digits = targetCode.slice(0, 6).split('');
    setOtp(digits);
    setErrorMsg('');
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async () => {
    if (!isOtpComplete || isVerifying) return;
    setErrorMsg('');

    const enteredCode = otp.join('');
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
    try {
      const { user: authedUser, merchantInfo: authedInfo } = await authenticateMerchantWithAnyOtp(mobile, enteredCode);
      updateUser(authedUser);
      if (authedInfo) updateMerchantInfo(authedInfo);
    } catch (e) {
      console.warn('Merchant auth notice:', e);
    } finally {
      setIsVerifying(false);
    }

    sessionStorage.setItem('qpay_merchant_authenticated', 'true');
    localStorage.setItem('qpay_merchant_authenticated', 'true');
    setIsAuthenticated(true);

    // If merchant PIN has not been set by the user, route to MERCHANT_PIN_SETUP
    const hasPin = typeof window !== 'undefined' ? localStorage.getItem('qpay_merchant_pin') : null;
    if (!hasPin) {
      navigateTo('MERCHANT_PIN_SETUP');
    } else {
      navigateTo('MERCHANT_HOME');
    }
  };

  const handleResend = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtp(newCode);
    setTimer(30);
    setIsResent(true);
    setShowSmsBanner(true);
    setTimeout(() => setIsResent(false), 3000);
  };

  return (
    <div className="w-full text-white flex flex-col select-none" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Simulated SMS Notification Banner */}
      {showSmsBanner && (
        <div className="mb-4 bg-[#182236]/95 border border-[#00FF24]/30 rounded-xl p-3 shadow-lg shadow-black/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💬</span>
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                {isAr ? 'رسالة نصية • الآن' : 'SMS OTP • Messages'}
              </div>
              <div className="text-xs text-white font-semibold">
                {isAr ? 'رمز تحقق بوابة التاجر: ' : 'Merchant Portal Code: '}
                <strong className="text-[#00FF24] text-sm font-mono tracking-wider">{activeOtp}</strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleQuickFill(activeOtp)}
            className="bg-[#00FF24] text-[#070D0A] font-extrabold text-xs px-3 py-1.5 rounded-lg hover:bg-[#00FF24]/90 transition-colors whitespace-nowrap cursor-pointer"
          >
            {isAr ? 'تعبئة تلقائية' : 'Autofill'}
          </button>
        </div>
      )}

      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? 'scale-x-[-1]' : ''}`} />
          <span>{isAr ? 'تغيير رقم الجوال' : 'Change Mobile Number'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-6 text-start">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          {isAr ? 'رمز التحقق السريع' : 'Enter Verification Code'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isAr ? 'تم إرسال رمز التحقق إلى الرقم' : 'Sent via SMS OTP to'}{' '}
          <span className="text-[#00FF24] font-bold" dir="ltr">
            +966 {mobile}
          </span>
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <ShieldAlert size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 6-Digit OTP Inputs */}
      <div className="grid grid-cols-6 gap-2 mb-4" dir="ltr">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-full h-12 rounded-xl text-center text-lg font-black outline-none transition-all ${
              digit
                ? 'bg-[#00FF24]/10 border-2 border-[#00FF24] text-white shadow-sm shadow-[#00FF24]/20'
                : 'bg-[#10182A] border border-slate-800 text-slate-400 focus:border-[#00FF24]'
            }`}
          />
        ))}
      </div>

      {/* Demo helper */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-6 bg-[#10182A] border border-slate-800/80 rounded-lg px-3 py-2">
        <button
          type="button"
          onClick={() => handleQuickFill('589204')}
          className="flex items-center gap-1.5 text-[11px] hover:text-white transition-colors cursor-pointer text-left"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-[#00FF24]" />
          <span>{isAr ? 'الرمز التجريبي الافتراضي: 589204' : 'Default Demo OTP: 589204'}</span>
        </button>
        <div>
          {timer > 0 ? (
            <span className="text-slate-500 font-mono text-[11px]">{timer}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-[#00FF24] font-bold text-[11px] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>{isAr ? 'إعادة الإرسال' : 'Resend'}</span>
            </button>
          )}
        </div>
      </div>

      {isResent && (
        <div className="text-center text-xs text-[#00FF24] mb-3 font-semibold animate-pulse">
          {isAr ? 'تم إرسال رمز جديد بنجاح' : 'New code dispatched successfully!'}
        </div>
      )}

      {/* Verify Button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={!isOtpComplete || isVerifying}
        className="w-full h-11 rounded-xl bg-[#00FF24] text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-[#00FF24]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#00FF24]/20 cursor-pointer"
      >
        <span>
          {isVerifying
            ? (isAr ? 'جاري التحقق...' : 'Authenticating...')
            : (isAr ? 'تأكيد ودخول البوابة' : 'Verify & Enter Dashboard')}
        </span>
        <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
export default SmsOtpScreen;
