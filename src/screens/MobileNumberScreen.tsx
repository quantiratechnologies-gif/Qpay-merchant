import React, { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { AlphPayLogo } from '../components/AlphPayLogo';
import { QuantiraLogo } from '../components/QuantiraLogo';
import { useApp } from '../state/AppContext';

export const MobileNumberScreen: React.FC = () => {
  const { navigateTo, user, updateUser, setUserRole, isRtl, language } = useApp();
  const isAr = language === 'العربية';
  const [fullName, setFullName] = useState<string>(user.name || (isAr ? 'فهد الحربي' : 'Fahad Al-Harbi'));
  const [mobileNumber, setMobileNumber] = useState<string>('501234567');

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (mobileNumber.length >= 9 && fullName.trim().length > 0) {
      setUserRole('merchant');
      updateUser({ name: fullName, mobile: `+966 ${mobileNumber}` });
      navigateTo('SMS_OTP', { mobile: mobileNumber, name: fullName });
    }
  };

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
        padding: '36px 20px 24px 20px',
        boxSizing: 'border-box',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Top Header with Brand Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '12px' }}>
        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlphPayLogo variant="horizontal" size={32} themeMode="dark" />
        </div>

        <h1
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 6px 0',
            textAlign: 'center',
            letterSpacing: '-0.02em',
          }}
        >
          {isAr ? 'تسجيل دخول التاجر' : 'Merchant Login'}
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: '#94A3B8',
            margin: 0,
            textAlign: 'center',
            maxWidth: '320px',
            lineHeight: 1.4,
          }}
        >
          {isAr ? 'إدارة نقاط البيع وعمليات الفوترة والمدفوعات' : 'Access your POS terminal & business payment hub'}
        </p>
      </div>

      {/* Main Form Box */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          margin: '24px auto',
          backgroundColor: '#111726',
          border: '1px solid #1E293B',
          borderRadius: '20px',
          padding: '24px 20px',
          boxSizing: 'border-box',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Merchant Owner Name Field */}
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
                backgroundColor: '#161F30',
                border: '1px solid #2A364F',
                borderRadius: '12px',
                padding: '12px 14px',
                transition: 'border-color 0.2s ease',
              }}
            >
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
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              {/* Country Code Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#161F30',
                  border: '1px solid #2A364F',
                  borderRadius: '12px',
                  padding: '12px 12px',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  color: '#FFFFFF',
                  flexShrink: 0,
                  direction: 'ltr',
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
                  backgroundColor: '#161F30',
                  border: '1px solid #2A364F',
                  borderRadius: '12px',
                  padding: '12px 14px',
                }}
              >
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
                    fontSize: '14.5px',
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

          {/* Primary CTA: Get OTP & Verify */}
          <button
            type="submit"
            disabled={mobileNumber.length < 9 || fullName.trim().length === 0}
            className="interactive-tap"
            style={{
              marginTop: '8px',
              backgroundColor: '#00C853',
              color: '#080C14',
              border: 'none',
              borderRadius: '14px',
              padding: '14px 20px',
              fontSize: '15px',
              fontWeight: 800,
              cursor: mobileNumber.length < 9 || fullName.trim().length === 0 ? 'not-allowed' : 'pointer',
              opacity: mobileNumber.length < 9 || fullName.trim().length === 0 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(0, 200, 83, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{isAr ? 'الحصول على رمز التحقق' : 'Get OTP & Verify'}</span>
            <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </form>
      </div>

      {/* Powered by Quantira Technologies */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          width: '100%',
          textAlign: 'center',
          paddingBottom: '8px',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            color: '#64748B',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {isAr ? 'مشغل بواسطة' : 'POWERED BY QUANTIRA TECHNOLOGIES'}
        </span>
        <QuantiraLogo size={18} color="#00C853" textColor="#CBD5E1" />
      </div>
    </div>
  );
};
