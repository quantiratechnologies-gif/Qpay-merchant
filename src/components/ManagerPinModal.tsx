import React, { useState } from 'react';
import { Lock, Delete, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { toArabicNumerals } from '../utils/i18n';

export const ManagerPinModal: React.FC = () => {
  const {
    isManagerPinModalOpen,
    managerPinModalData,
    closeManagerPinModal,
    verifyMerchantPin,
    language,
    isRtl,
  } = useApp();

  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isManagerPinModalOpen || !managerPinModalData) return null;

  const isAr = language === 'العربية';

  const handleKeyPress = (digit: string) => {
    if (isSuccess) return;
    setErrorMsg('');

    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);

      if (nextPin.length === 4) {
        if (verifyMerchantPin(nextPin)) {
          setIsSuccess(true);
          setTimeout(() => {
            managerPinModalData.onSuccess();
            handleClose();
          }, 600);
        } else {
          setErrorMsg(
            isAr
              ? 'رمز المدير غير صحيح. يرجى المحاولة مرة أخرى.'
              : 'Incorrect Manager PIN. Please try again.'
          );
          setTimeout(() => {
            setPin('');
          }, 700);
        }
      }
    }
  };

  const handleDelete = () => {
    if (isSuccess) return;
    setErrorMsg('');
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClose = () => {
    setPin('');
    setErrorMsg('');
    setIsSuccess(false);
    closeManagerPinModal();
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div
        className="slide-up"
        style={{
          width: '100%',
          maxWidth: '360px',
          borderRadius: '24px',
          padding: '24px 20px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#0F172A',
          border: '1px solid rgba(0, 255, 36, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 24px rgba(0, 255, 36, 0.15)',
          boxSizing: 'border-box',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isSuccess}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            [isRtl ? 'left' : 'right']: '16px',
            color: '#94A3B8',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            padding: '6px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        {/* Security Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            backgroundColor: isSuccess ? 'rgba(0, 255, 36, 0.18)' : 'rgba(30, 41, 59, 0.8)',
            border: `1.5px solid ${isSuccess ? '#00FF24' : 'rgba(255, 255, 255, 0.1)'}`,
            color: '#00FF24',
          }}
        >
          {isSuccess ? <CheckCircle2 size={30} /> : <Lock size={26} />}
        </div>

        {/* Title & Subtitle */}
        <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#FFFFFF', textAlign: 'center', margin: '0 0 4px 0' }}>
          {managerPinModalData.title}
        </h3>
        <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', margin: '0 0 20px 0', padding: '0 8px', lineHeight: 1.4 }}>
          {managerPinModalData.subtitle ||
            (isAr
              ? 'أدخل رمز المدير السري المكون من ٤ أرقام للمتابعة'
              : 'Enter 4-digit Manager Security PIN to authorize')}
        </p>

        {/* 4-digit Pin Dots */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '18px' }} dir="ltr">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: isFilled ? '#00FF24' : 'transparent',
                  border: isFilled ? '2px solid #00FF24' : '2px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: isFilled ? '0 0 12px rgba(0, 255, 36, 0.6)' : 'none',
                  transform: isFilled ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                }}
              />
            );
          })}
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11.5px',
              color: '#FB7185',
              fontWeight: 700,
              marginBottom: '12px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
            }}
          >
            <ShieldAlert size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Keypad */}
        <div
          style={{
            width: '100%',
            maxWidth: '260px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginTop: '8px',
          }}
        >
          {digits.map((d) => (
            <button
              key={d}
              type="button"
              disabled={isSuccess}
              onClick={() => handleKeyPress(d)}
              style={{
                height: '48px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 800,
                color: '#FFFFFF',
                backgroundColor: 'rgba(30, 41, 59, 0.85)',
                border: '1px solid rgba(51, 65, 85, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              {isAr ? toArabicNumerals(d) : d}
            </button>
          ))}

          {/* Empty slot */}
          <div />

          {/* Zero */}
          <button
            type="button"
            disabled={isSuccess}
            onClick={() => handleKeyPress('0')}
            style={{
              height: '48px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 800,
              color: '#FFFFFF',
              backgroundColor: 'rgba(30, 41, 59, 0.85)',
              border: '1px solid rgba(51, 65, 85, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {isAr ? toArabicNumerals('0') : '0'}
          </button>

          {/* Delete */}
          <button
            type="button"
            disabled={isSuccess}
            onClick={handleDelete}
            style={{
              height: '48px',
              borderRadius: '12px',
              color: '#94A3B8',
              backgroundColor: 'rgba(30, 41, 59, 0.85)',
              border: '1px solid rgba(51, 65, 85, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <Delete size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </div>

        {/* Helper Footer */}
        <div style={{ marginTop: '16px', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
          {isAr ? 'الرمز الافتراضي للتجربة: 1234' : 'Default Demo PIN: 1234'}
        </div>
      </div>
    </div>
  );
};

export default ManagerPinModal;
