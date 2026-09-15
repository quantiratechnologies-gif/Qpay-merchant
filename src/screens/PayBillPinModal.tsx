import React, { useState } from 'react';
import { BottomSheet } from '../components/BottomSheet';
import { PinPad } from '../components/PinPad';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import { authService } from '../services/authService';

export const PayBillPinModal: React.FC = () => {
  const { isPinModalOpen, closePinModal, pendingPaymentData, bankAccounts, t, language } = useApp();
  const [error, setError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const primaryBank = bankAccounts.find((b) => b.isPrimary) || bankAccounts[0];

  if (!pendingPaymentData) return null;

  const isCheckBalance = pendingPaymentData.title.toLowerCase().includes('balance');
  const displayTitle = t(pendingPaymentData.title, pendingPaymentData.title);
  const displaySubTitle = t(pendingPaymentData.subTitle, pendingPaymentData.subTitle);
  const displayBankName = primaryBank ? t(primaryBank.bankName, primaryBank.bankName) : '';

  const handlePinComplete = async (pin: string) => {
    setIsVerifying(true);
    setError('');
    try {
      const isValid = await authService.verifyPin(pin);
      if (isValid) {
        closePinModal();
        if (pendingPaymentData.onSuccess) {
          pendingPaymentData.onSuccess();
        }
      } else {
        setError(language === 'العربية' ? 'الرمز السري غير صحيح. يرجى المحاولة مرة أخرى.' : 'Incorrect PIN. Please try again.');
      }
    } catch (err) {
      setError(language === 'العربية' ? 'فشل التحقق من الرمز. حاول مرة أخرى.' : 'Verification failed. Try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <BottomSheet
      isOpen={isPinModalOpen}
      onClose={closePinModal}
      title={isCheckBalance ? (language === 'العربية' ? 'التحقق من الرمز السري لعرض الرصيد' : 'Verify PIN to Check Balance') : displayTitle}
    >
      <div style={{ paddingBottom: '10px' }}>
        {/* Payment / Check Balance Summary Box */}
        <div
          style={{
            backgroundColor: '#3A3A52',
            border: '1px solid #4D4D6B',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px',
            boxShadow: 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '800', fontSize: '15px', color: '#FFFFFF' }}>{displayTitle}</div>
              <div style={{ fontSize: '12px', color: '#B3B3C2', marginTop: '2px' }}>
                {displaySubTitle}
              </div>
            </div>
            {pendingPaymentData.amount > 0 && !isCheckBalance && (
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#7FE87F' }}>
                {formatCurrency(pendingPaymentData.amount, language)}
              </div>
            )}
            {isCheckBalance && (
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '4px' }}>
                ••••••••
              </div>
            )}
          </div>

          <div
            style={{
              borderTop: '1px solid #4D4D6B',
              marginTop: '12px',
              paddingTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
            }}
          >
            <span style={{ color: '#B3B3C2' }}>{language === 'العربية' ? 'الحساب المصدر:' : 'Account:'}</span>
            <span style={{ fontWeight: '700', color: '#FFFFFF' }}>
              {primaryBank ? `${displayBankName} (${primaryBank.accountNumberMasked})` : (language === 'العربية' ? 'الحساب البنكي المرتبط' : 'Linked Bank Account')}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#B3B3C2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isVerifying
              ? (language === 'العربية' ? 'جاري التحقق من الرمز السري...' : 'Verifying PIN...')
              : (language === 'العربية' ? 'أدخل الرمز السري المكون من ٤ أرقام' : 'ENTER 4-DIGIT PIN')}
          </span>
        </div>

        <PinPad length={4} onComplete={handlePinComplete} error={error} />
      </div>
    </BottomSheet>
  );
};
