import React, { useState } from 'react';
import { ArrowRight, ChevronDown, User, Phone } from 'lucide-react';
import { AlphPayLogo } from '../components/AlphPayLogo';
import { LanguageSwitchPill } from '../components/LanguageSwitchPill';
import { useApp } from '../state/AppContext';

export const MobileNumberScreen: React.FC = () => {
  const { navigateTo, user, updateUser, setUserRole, isRtl, language } = useApp();
  const isAr = language === 'العربية';
  const [fullName, setFullName] = useState<string>(user.name || (isAr ? 'فهد الحربي' : 'Fahad Al-Harbi'));
  const [mobileNumber, setMobileNumber] = useState<string>('501234567');

  const isFormValid = mobileNumber.length >= 9 && fullName.trim().length > 0;

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isFormValid) {
      setUserRole('merchant');
      updateUser({ name: fullName, mobile: `+966 ${mobileNumber}` });
      navigateTo('SMS_OTP', { mobile: mobileNumber, name: fullName });
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
            justifyContent: 'space-between',
            height: '40px',
            marginBottom: '24px',
          }}
        >
          <div style={{ width: '40px' }} />
          <AlphPayLogo variant="horizontal" size={26} themeMode="dark" />
          <LanguageSwitchPill variant="compact" />
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
        <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                placeholder={isAr ? 'أدخل اسم المالك' : 'Enter owner name'}
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
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder="50 123 4567"
                  maxLength={9}
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
            <span>{isAr ? 'الحصول على رمز التحقق' : 'Get OTP & Verify'}</span>
            <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </form>
      </div>
    </div>
  );
};
