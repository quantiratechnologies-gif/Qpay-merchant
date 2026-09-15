import React, { useState } from 'react';
import { User as UserIcon, ArrowRight, Store } from 'lucide-react';
import { AlphPayLogo } from '../components/AlphPayLogo';
import { PrimaryButton } from '../components/PrimaryButton';
import { SamaLogo } from '../components/SamaLogo';
import { useApp } from '../state/AppContext';

export const MobileNumberScreen: React.FC = () => {
  const { navigateTo, user, updateUser, setUserRole, setIsKycModalOpen, t, isRtl, language } = useApp();
  const [accountType, setAccountType] = useState<'customer' | 'merchant'>('customer');
  const [fullName, setFullName] = useState<string>(user.name || 'Fahad Al-Harbi');
  const [mobileNumber, setMobileNumber] = useState<string>('501234567');

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (mobileNumber.length >= 9 && fullName.trim().length > 0) {
      setUserRole(accountType);
      updateUser({ name: fullName, mobile: `+966 ${mobileNumber}` });
      if (accountType === 'merchant') {
        setIsKycModalOpen(true);
      } else {
        navigateTo('SMS_OTP', { mobile: mobileNumber, name: fullName });
      }
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100vh',
        backgroundColor: '#070D0A',
        backgroundImage: 'radial-gradient(circle at 50% 15%, rgba(52, 211, 153, 0.12) 0%, rgba(7, 13, 10, 0.98) 60%)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '50px 24px 36px 24px',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Top Center: App Brand Logo */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          position: 'relative',
        }}
      >
        <AlphPayLogo variant="horizontal" size={32} themeMode="dark" />
      </div>

      {/* Main Form: Account Type Selector, Input Fields & Action Button */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          margin: '0 auto',
          backgroundColor: 'rgba(21, 21, 36, 0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '24px 20px',
          boxSizing: 'border-box',
        }}
      >
        {/* Account Type Selector Toggle */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            backgroundColor: '#0E0E1A',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '4px',
            marginBottom: '18px',
          }}
        >
          <button
            type="button"
            onClick={() => setAccountType('customer')}
            className="interactive-tap"
            style={{
              backgroundColor: accountType === 'customer' ? '#7FE87F' : 'transparent',
              color: accountType === 'customer' ? '#000000' : '#A2A2BA',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <UserIcon size={15} /> {t('auth.customer', 'Customer')}
          </button>

          <button
            type="button"
            onClick={() => setAccountType('merchant')}
            className="interactive-tap"
            style={{
              backgroundColor: accountType === 'merchant' ? '#7FE87F' : 'transparent',
              color: accountType === 'merchant' ? '#000000' : '#A2A2BA',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Store size={15} /> {t('auth.merchant', 'Merchant')}
          </button>
        </div>

        <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Full Name Input */}
          <div>
            <label
              htmlFor="fullname-input"
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#A2A2BA',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              {language === 'العربية' ? 'الاسم الكامل (حسب الهوية الوطنية / الإقامة)' : 'Full Name (as per National ID / Iqama)'}
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#151524',
                border: '1px solid #2C2C44',
                borderRadius: '14px',
                padding: '14px 16px',
                transition: 'border-color 0.2s ease',
              }}
            >
              <UserIcon size={18} color="#7FE87F" style={{ marginInlineEnd: '12px', flexShrink: 0 }} />
              <input
                id="fullname-input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={language === 'العربية' ? 'فهد الحربي' : 'Fahad Al-Harbi'}
                required
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Saudi Mobile Number Input */}
          <div>
            <label
              htmlFor="mobile-input"
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#A2A2BA',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              {t('auth.mobile_number', 'Saudi Mobile Number')}
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#151524',
                border: '1px solid #2C2C44',
                borderRadius: '14px',
                padding: '14px 16px',
                transition: 'border-color 0.2s ease',
              }}
            >
              {/* Country Code Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  paddingInlineEnd: '12px',
                  marginInlineEnd: '12px',
                  borderInlineEnd: '1px solid #2C2C44',
                  fontWeight: 800,
                  fontSize: '14px',
                  color: '#FFFFFF',
                }}
              >
                <span>🇸🇦</span>
                <span dir="ltr">+966</span>
              </div>

              <input
                id="mobile-input"
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
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  width: '100%',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '0.05em',
                  direction: 'ltr',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              />
            </div>
          </div>

          {/* Primary Submit Button */}
          <div style={{ marginTop: '6px' }}>
            <PrimaryButton type="submit" disabled={mobileNumber.length < 9 || fullName.trim().length === 0}>
              {t('auth.get_otp', 'Get OTP & Verify')}{' '}
              <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </PrimaryButton>
          </div>
        </form>
      </div>

      {/* Down in Center: Associated with SAMA */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            color: '#6E6E85',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {t('home.associated_sama', 'Associated with')}
        </span>
        <SamaLogo height={20} themeMode="green" />
      </div>
    </div>
  );
};
