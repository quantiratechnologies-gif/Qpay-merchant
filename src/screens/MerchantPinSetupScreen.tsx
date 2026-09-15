import React, { useState } from 'react';
import { Lock, Delete, CheckCircle2 } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { SamaLogo } from '../components/SamaLogo';
import { toArabicNumerals } from '../utils/i18n';

export const MerchantPinSetupScreen: React.FC = () => {
  const { updateMerchantInfo, setUserRole, navigateTo, language, isRtl } = useApp();
  const isAr = language === 'العربية';
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleKeyPress = (digit: string) => {
    setErrorMsg('');
    if (step === 'create') {
      if (pin.length < 4) {
        const next = pin + digit;
        setPin(next);
        if (next.length === 4) {
          setTimeout(() => {
            setStep('confirm');
          }, 300);
        }
      }
    } else {
      if (confirmPin.length < 4) {
        const next = confirmPin + digit;
        setConfirmPin(next);
        if (next.length === 4) {
          if (next === pin) {
            setIsSuccess(true);
            updateMerchantInfo({ merchantPin: pin });
            setUserRole('merchant');
            setTimeout(() => {
              navigateTo('MERCHANT_HOME');
            }, 1200);
          } else {
            setErrorMsg(isAr ? 'الرمز غير متطابق. يرجى إعادة الإدخال.' : 'PINs do not match. Please re-enter.');
            setTimeout(() => {
              setConfirmPin('');
            }, 600);
          }
        }
      }
    }
  };

  const handleDelete = () => {
    setErrorMsg('');
    if (step === 'create') {
      setPin((prev) => prev.slice(0, -1));
    } else {
      if (confirmPin.length > 0) {
        setConfirmPin((prev) => prev.slice(0, -1));
      } else {
        setStep('create');
        setPin('');
      }
    }
  };

  const currentPin = step === 'create' ? pin : confirmPin;
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

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
        padding: '40px 24px 30px 24px',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Top Header */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            backgroundColor: '#151524',
            border: '1px solid #2C2C44',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
          }}
        >
          <Lock size={28} color="#7FE87F" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
          {step === 'create'
            ? (isAr ? 'تعيين الرمز السري للتاجر' : 'Create Merchant PIN')
            : (isAr ? 'تأكيد الرمز السري للتاجر' : 'Confirm Merchant PIN')}
        </h2>
        <p style={{ fontSize: '13px', color: '#A2A2BA', margin: 0 }}>
          {step === 'create'
            ? (isAr ? 'عيّن رمزاً سرياً مكوناً من ٤ أرقام لعمليات نقاط البيع والاسترداد' : 'Set a 4-digit encrypted PIN for SoftPOS terminal and refunds')
            : (isAr ? 'أعد إدخال رمز الأمان المكون من ٤ أرقام' : 'Re-enter your 4-digit security PIN')}
        </p>
      </div>

      {/* PIN Dots Indicator */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = idx < currentPin.length;
            return (
              <div
                key={idx}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: isFilled ? '#7FE87F' : '#151524',
                  border: isFilled ? '2px solid #7FE87F' : '2px solid #2C2C44',
                  transition: 'all 0.15s ease',
                  transform: isFilled ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            );
          })}
        </div>

        {errorMsg && (
          <div style={{ fontSize: '12px', color: '#FF6B6B', fontWeight: 700, marginBottom: '8px' }}>
            {errorMsg}
          </div>
        )}

        {isSuccess && (
          <div style={{ fontSize: '13px', color: '#7FE87F', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} /> {isAr ? 'تم تعيين الرمز السري للتاجر بنجاح' : 'Merchant PIN Created Successfully'}
          </div>
        )}
      </div>

      {/* Keypad */}
      <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {digits.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleKeyPress(d)}
              className="interactive-tap"
              style={{
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#151524',
                border: '1px solid #2C2C44',
                color: '#FFFFFF',
                fontSize: '22px',
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
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              color: '#FFFFFF',
              fontSize: '22px',
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
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              color: '#A2A2BA',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Delete size={22} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* SAMA Dock */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '20px' }}>
        <span style={{ fontSize: '10.5px', color: '#6E6E85', fontWeight: 700 }}>
          {isAr ? 'محمي بواسطة تشفير البنك المركزي السعودي' : 'SAMA 256-Bit Hardware Encrypted PIN'}
        </span>
        <SamaLogo height={14} themeMode="green" />
      </div>
    </div>
  );
};
