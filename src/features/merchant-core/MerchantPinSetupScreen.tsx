import React, { useState, useEffect } from 'react';
import { Lock, Delete, CheckCircle2, ArrowRight, RefreshCw, ChevronLeft } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { AppHeader } from '../../components/AppHeader';
import { toArabicNumerals } from '../../utils/i18n';

export const MerchantPinSetupScreen: React.FC = () => {
  const { updateMerchantInfo, setUserRole, navigateTo, goBack, screenParams, language, isRtl } = useApp();
  const isAr = language === 'العربية';
  const fromSettings = screenParams?.fromSettings === true;
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleKeyPress = (digit: string) => {
    setErrorMsg('');
    if (step === 'create') {
      if (pin.length < 4) {
        setPin((prev) => (prev.length < 4 ? prev + digit : prev));
      }
    } else {
      if (confirmPin.length < 4) {
        setConfirmPin((prev) => (prev.length < 4 ? prev + digit : prev));
      }
    }
  };

  const handleDelete = () => {
    setErrorMsg('');
    if (step === 'create') {
      setPin((prev) => prev.slice(0, -1));
    } else {
      setConfirmPin((prev) => prev.slice(0, -1));
    }
  };

  const handleProceedToConfirm = () => {
    if (pin.length === 4) {
      setErrorMsg('');
      setConfirmPin('');
      setStep('confirm');
    }
  };

  const handleFinalConfirm = () => {
    if (confirmPin.length !== 4) return;

    if (confirmPin === pin) {
      setIsSuccess(true);
      setErrorMsg('');
      updateMerchantInfo({ merchantPin: pin });
      if (typeof window !== 'undefined') {
        localStorage.setItem('qpay_merchant_pin', pin);
      }
      setUserRole('merchant');
      setTimeout(() => {
        if (fromSettings) {
          goBack();
        } else {
          navigateTo('MERCHANT_HOME');
        }
      }, 900);
    } else {
      setErrorMsg(isAr ? 'الرمز غير متطابق. يرجى إعادة الإدخال.' : 'PINs do not match. Please re-enter.');
      setConfirmPin('');
    }
  };

  const handleBackToCreate = () => {
    setErrorMsg('');
    setConfirmPin('');
    setStep('create');
  };

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        if (step === 'create' && pin.length === 4) {
          handleProceedToConfirm();
        } else if (step === 'confirm' && confirmPin.length === 4) {
          handleFinalConfirm();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, pin, confirmPin]);

  const currentPin = step === 'create' ? pin : confirmPin;
  const isButtonEnabled = step === 'create' ? pin.length === 4 : confirmPin.length === 4;
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

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
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <AppHeader
        title={isAr ? 'تعيين رمز الأمان للمدير' : 'Set Manager PIN'}
        showBack={true}
        showSettings={false}
      />

      {/* Top Header */}
      <div style={{ textAlign: 'center', padding: '16px 24px 0 24px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
          }}
        >
          <Lock size={26} color="#00C853" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
          {step === 'create'
            ? (isAr ? 'تعيين الرمز السري للتاجر' : 'Create Merchant PIN')
            : (isAr ? 'تأكيد الرمز السري للتاجر' : 'Confirm Merchant PIN')}
        </h2>
        <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
          {step === 'create'
            ? (isAr ? 'عيّن رمزاً سرياً مكوناً من ٤ أرقام لعمليات نقاط البيع والاسترداد' : 'Set a 4-digit encrypted PIN for SoftPOS terminal and refunds')
            : (isAr ? 'أعد إدخال رمز الأمان المكون من ٤ أرقام للتأكيد' : 'Re-enter your 4-digit security PIN to confirm')}
        </p>
      </div>

      {/* PIN Dots Indicator */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '14px 0' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = idx < currentPin.length;
            return (
              <div
                key={idx}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: errorMsg && isFilled ? '#FF4757' : isFilled ? '#00C853' : '#111726',
                  border: errorMsg && isFilled ? '2px solid #FF4757' : isFilled ? '2px solid #00C853' : '2px solid #1E293B',
                  boxShadow: errorMsg && isFilled ? '0 0 12px rgba(255, 71, 87, 0.4)' : isFilled ? '0 0 12px rgba(0, 200, 83, 0.4)' : 'none',
                  transition: 'all 0.15s ease',
                  transform: isFilled ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            );
          })}
        </div>

        {errorMsg && (
          <div style={{ fontSize: '12px', color: '#FF4757', fontWeight: 700, marginBottom: '6px' }}>
            {errorMsg}
          </div>
        )}

        {isSuccess && (
          <div style={{ fontSize: '13px', color: '#00C853', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} /> {isAr ? 'تم تعيين الرمز السري للتاجر بنجاح' : 'Merchant PIN Created Successfully'}
          </div>
        )}

        {step === 'confirm' && !isSuccess && (
          <button
            type="button"
            onClick={handleBackToCreate}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px',
            }}
          >
            <RefreshCw size={12} />
            <span>{isAr ? 'تعديل الرمز الأول' : 'Edit Initial PIN'}</span>
          </button>
        )}
      </div>

      {/* Keypad */}
      <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {digits.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleKeyPress(d)}
              className="interactive-tap"
              style={{
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isAr ? toArabicNumerals(d) : d}
            </button>
          ))}

          <div />

          {/* Zero */}
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="interactive-tap"
            style={{
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isAr ? '٠' : '0'}
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={handleDelete}
            className="interactive-tap"
            style={{
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Delete size={20} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </div>

        {/* User Explicit Action Confirmation Button */}
        <div style={{ marginTop: '16px' }}>
          {step === 'create' ? (
            <button
              type="button"
              disabled={!isButtonEnabled}
              onClick={handleProceedToConfirm}
              className="interactive-tap"
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: isButtonEnabled ? '#00C853' : '#161F30',
                color: isButtonEnabled ? '#080C14' : '#64748B',
                border: isButtonEnabled ? 'none' : '1px solid #1E293B',
                fontSize: '14px',
                fontWeight: 800,
                cursor: isButtonEnabled ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isButtonEnabled ? '0 4px 16px rgba(0, 200, 83, 0.35)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{isAr ? 'متابعة لتأكيد الرمز' : 'Continue to Confirm'}</span>
              <ArrowRight size={16} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </button>
          ) : (
            <button
              type="button"
              disabled={!isButtonEnabled}
              onClick={handleFinalConfirm}
              className="interactive-tap"
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: isButtonEnabled ? '#00C853' : '#161F30',
                color: isButtonEnabled ? '#080C14' : '#64748B',
                border: isButtonEnabled ? 'none' : '1px solid #1E293B',
                fontSize: '14px',
                fontWeight: 800,
                cursor: isButtonEnabled ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isButtonEnabled ? '0 4px 16px rgba(0, 200, 83, 0.35)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{isAr ? 'تأكيد وحفظ رمز MPIN' : 'Confirm & Save MPIN'}</span>
              <CheckCircle2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Security Dock */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
        <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>
          {isAr ? 'محمي بتشفير عتادي ٢٥٦-بت • تقنيات كوانتيرا' : '256-Bit Hardware Encrypted • Quantira Technologies'}
        </span>
      </div>
    </div>
  );
};
