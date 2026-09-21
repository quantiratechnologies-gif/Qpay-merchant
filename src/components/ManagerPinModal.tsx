import React, { useState } from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { PinPad } from './PinPad';
import { useApp } from '../state/AppContext';

export const ManagerPinModal: React.FC = () => {
  const {
    isManagerPinModalOpen,
    managerPinModalData,
    closeManagerPinModal,
    verifyMerchantPin,
    language,
  } = useApp();

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isManagerPinModalOpen || !managerPinModalData) return null;

  const isAr = language === 'العربية';

  const handlePinComplete = (pin: string) => {
    if (isSuccess) return;
    setErrorMsg('');

    if (verifyMerchantPin(pin)) {
      setIsSuccess(true);
      setTimeout(() => {
        managerPinModalData.onSuccess();
        handleClose();
      }, 500);
    } else {
      setErrorMsg(
        isAr
          ? 'رمز المدير غير صحيح. يرجى المحاولة مرة أخرى.'
          : 'Incorrect Manager PIN. Please try again.'
      );
    }
  };

  const handleClose = () => {
    setErrorMsg('');
    setIsSuccess(false);
    closeManagerPinModal();
  };

  return (
    <BottomSheet
      isOpen={isManagerPinModalOpen}
      onClose={handleClose}
      title={managerPinModalData.title}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '16px' }}>
        {/* Security Subtitle Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(0, 200, 83, 0.08)',
            border: '1px solid rgba(0, 200, 83, 0.25)',
            borderRadius: '12px',
            padding: '10px 16px',
            marginBottom: '16px',
            maxWidth: '100%',
          }}
        >
          <Lock size={16} color="#00C853" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '12.5px', color: '#CBD5E1', margin: 0, lineHeight: 1.4, textAlign: 'center' }}>
            {managerPinModalData.subtitle ||
              (isAr
                ? 'أدخل رمز المدير السري المكون من ٤ أرقام للمتابعة'
                : 'Enter 4-digit Manager Security PIN to authorize')}
          </p>
        </div>

        {/* Success / Keypad View */}
        {isSuccess ? (
          <div
            className="fade-in"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '32px 16px',
              color: '#00C853',
            }}
          >
            <CheckCircle2 size={42} color="#00C853" />
            <span style={{ fontSize: '16px', fontWeight: 800 }}>
              {isAr ? 'تم التحقق بنجاح وتفويض العملية!' : 'Authorized Successfully!'}
            </span>
          </div>
        ) : (
          <PinPad
            length={4}
            onComplete={handlePinComplete}
            error={errorMsg}
          />
        )}

        {/* Helper Footer */}
        <div style={{ marginTop: '16px', fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
          {isAr ? 'الرمز الافتراضي للتجربة: 1234' : 'Default Demo PIN: 1234'}
        </div>
      </div>
    </BottomSheet>
  );
};
