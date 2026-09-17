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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: '#0F172A',
          border: '1px solid rgba(0, 255, 36, 0.25)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 255, 36, 0.1)',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isSuccess}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Security Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors"
          style={{
            backgroundColor: isSuccess ? 'rgba(0, 255, 36, 0.15)' : 'rgba(30, 41, 59, 0.8)',
            border: `1px solid ${isSuccess ? '#00FF24' : 'rgba(255, 255, 255, 0.1)'}`,
            color: '#00FF24',
          }}
        >
          {isSuccess ? <CheckCircle2 size={30} /> : <Lock size={26} />}
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-lg font-bold text-white text-center mb-1">
          {managerPinModalData.title}
        </h3>
        <p className="text-xs text-slate-400 text-center mb-6 px-2">
          {managerPinModalData.subtitle ||
            (isAr
              ? 'أدخل رمز المدير السري المكون من ٤ أرقام للمتابعة'
              : 'Enter 4-digit Manager Security PIN to authorize')}
        </p>

        {/* 4-digit Pin Dots */}
        <div className="flex gap-4 mb-4" dir="ltr">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className="w-4 h-4 rounded-full transition-all duration-150"
                style={{
                  backgroundColor: isFilled ? '#00FF24' : 'transparent',
                  border: isFilled ? '2px solid #00FF24' : '2px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: isFilled ? '0 0 10px rgba(0, 255, 36, 0.5)' : 'none',
                  transform: isFilled ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            );
          })}
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold mb-3 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <ShieldAlert size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Keypad */}
        <div className="w-full grid grid-cols-3 gap-2.5 mt-2 max-w-[260px]">
          {digits.map((d) => (
            <button
              key={d}
              type="button"
              disabled={isSuccess}
              onClick={() => handleKeyPress(d)}
              className="h-12 rounded-xl text-lg font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 active:bg-[#00FF24]/20 active:border-[#00FF24] border border-slate-700/60 flex items-center justify-center transition-all cursor-pointer"
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
            className="h-12 rounded-xl text-lg font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 active:bg-[#00FF24]/20 active:border-[#00FF24] border border-slate-700/60 flex items-center justify-center transition-all cursor-pointer"
          >
            {isAr ? toArabicNumerals('0') : '0'}
          </button>

          {/* Delete */}
          <button
            type="button"
            disabled={isSuccess}
            onClick={handleDelete}
            className="h-12 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 active:bg-rose-500/20 active:border-rose-500 border border-slate-700/60 flex items-center justify-center transition-all cursor-pointer"
          >
            <Delete size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </div>

        {/* Helper Footer */}
        <div className="mt-5 text-[11px] text-slate-500 font-medium">
          {isAr ? 'الرمز الافتراضي للتجربة: 1234' : 'Default Demo PIN: 1234'}
        </div>
      </div>
    </div>
  );
};

export default ManagerPinModal;
