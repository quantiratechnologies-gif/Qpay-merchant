import React, { useState } from 'react';
import { ArrowRight, ChevronDown, User, Phone, Store, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import { AlphPayLogo } from '../../components/AlphPayLogo';
import { useApp } from '../../state/AppContext';

export const MobileNumberScreen: React.FC = () => {
  const { navigateTo, updateUser, setUserRole, isRtl, language } = useApp();
  const isAr = language === 'العربية';
  const [fullName, setFullName] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rawDigits = mobileNumber.replace(/\D/g, '');
  const isFormValid = rawDigits.length >= 9 && fullName.trim().length > 0 && !isLoading;

  const handleContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);

    const phone = '+966' + rawDigits;

    try {
      await authService.sendOtp(phone, 'merchant');
      setUserRole('merchant');
      updateUser({ name: fullName.trim(), mobile: '+966 ' + rawDigits });
      navigateTo('SMS_OTP', {
        mobile: rawDigits,
        phone,
        name: fullName.trim(),
        fullName: fullName.trim(),
        businessName: businessName.trim(),
      });
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('rate') || err?.status === 429) {
        setError(isAr ? 'محاولات كثيرة. يرجى الانتظار قليلاً.' : 'Too many requests. Please wait a moment.');
      } else if (err?.status === 400) {
        setError(isAr ? 'رقم الهاتف غير صالح.' : 'Invalid phone number.');
      } else {
        setError(err?.message || (isAr ? 'تعذر إرسال الرمز. تحقق من اتصالك.' : 'Could not send OTP. Check your connection.'));
      }
    } finally {
      setIsLoading(false);
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
      {/* Top Header Section (Aligned at consistent Y-position) */}
      <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        {/* Top Navigation Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40px',
            marginBottom: '24px',
          }}
        >
          <AlphPayLogo variant="horizontal" size={26} themeMode="dark" />
        </div>

        {/* Title Block */}
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
            {isAr ? 'تسجيل دخول التاجر' : 'Merchant Login'}
          </h1>
          <p
            style={{
              fontSize: '13.5px',
              color: '#94A3B8',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {isAr
              ? 'أدخل بيانات المالك ورقم الجوال للوصول إلى نقطة البيع'
              : 'Enter your merchant credentials to access your POS terminal'}
          </p>
        </div>

        {/* Form Container */}
        <form noValidate onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Error Banner */}
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#EF4444',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Business Name Field */}
          <div>
            <label
              htmlFor="business-name-input"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#CBD5E1',
                marginBottom: '8px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {isAr ? 'اسم المنشأة أو المتجر' : 'Business / Store Name'}{' '}
              <span style={{ color: '#64748B', fontWeight: 500 }}>({isAr ? 'اختياري' : 'Optional'})</span>
            </label>
            <div
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                height: '52px',
                boxSizing: 'border-box',
              }}
            >
              <Store size={18} color="#00C853" style={{ flexShrink: 0 }} />
              <input
                id="business-name-input"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={isAr ? 'مثال: قهوة المختص' : 'e.g. Specialty Roasters'}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  width: '100%',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              />
            </div>
          </div>
          {/* Owner Name Field */}
          <div>
            <label
              htmlFor="owner-name-input"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#CBD5E1',
                marginBottom: '8px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {isAr ? 'اسم مالك المنشأة' : 'Merchant Owner Name'} <span style={{ color: '#00C853' }}>*</span>
            </label>
            <div
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                height: '52px',
                boxSizing: 'border-box',
              }}
            >
              <User size={18} color="#00C853" style={{ flexShrink: 0 }} />
              <input
                id="owner-name-input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isAr ? 'أدخل اسم المالك (مثال: فهد العتيبي)' : 'e.g. Fahad Al-Otaibi'}
                required
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  width: '100%',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              />
            </div>
          </div>

          {/* Phone Number Field */}
          <div>
            <label
              htmlFor="merchant-phone-input"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#CBD5E1',
                marginBottom: '8px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {isAr ? 'رقم الجوال' : 'Phone Number'} <span style={{ color: '#00C853' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Country Code Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
                  borderRadius: '14px',
                  padding: '0 14px',
                  height: '52px',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  color: '#FFFFFF',
                  flexShrink: 0,
                  direction: 'ltr',
                  boxSizing: 'border-box',
                }}
              >
                <span>🇸🇦</span>
                <span>+966</span>
                <ChevronDown size={14} color="#94A3B8" />
              </div>

              {/* Number Input */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
                  borderRadius: '14px',
                  padding: '0 16px',
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxSizing: 'border-box',
                }}
              >
                <Phone size={17} color="#00C853" style={{ flexShrink: 0 }} />
                <input
                  id="merchant-phone-input"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={mobileNumber}
                  onChange={(e) => {
                    const rawDigits = e.target.value.replace(/\D/g, '').slice(0, 9);
                    let formatted = rawDigits;
                    if (rawDigits.length > 2 && rawDigits.length <= 5) {
                      formatted = `${rawDigits.slice(0, 2)} ${rawDigits.slice(2)}`;
                    } else if (rawDigits.length > 5) {
                      formatted = `${rawDigits.slice(0, 2)} ${rawDigits.slice(2, 5)} ${rawDigits.slice(5)}`;
                    }
                    setMobileNumber(formatted);
                  }}
                  placeholder="50 123 4567"
                  maxLength={11}
                  required
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    width: '100%',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.04em',
                    direction: 'ltr',
                    textAlign: isRtl ? 'right' : 'left',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className="interactive-tap"
            style={{
              marginTop: '12px',
              height: '52px',
              backgroundColor: isFormValid ? '#00C853' : '#161F30',
              color: isFormValid ? '#080C14' : '#64748B',
              border: isFormValid ? 'none' : '1px solid #1E293B',
              borderRadius: '14px',
              fontSize: '15.5px',
              fontWeight: 800,
              cursor: isFormValid ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: isFormValid ? '0 4px 20px rgba(0, 200, 83, 0.35)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{isLoading ? (isAr ? 'جاري الإرسال...' : 'Sending OTP...') : (isAr ? 'الحصول على رمز التحقق' : 'Get OTP & Verify')}</span>
            <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </form>
      </div>
    </div>
  );
};
