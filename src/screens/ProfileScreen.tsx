import React from 'react';
import {
  Store,
  ShieldCheck,
  QrCode,
  SlidersHorizontal,
  CreditCard,
  Users,
  Languages,
  LogOut,
  ChevronRight,
  Building2,
  LayoutGrid,
  Check,
} from 'lucide-react';
import { useApp } from '../state/AppContext';

export const ProfileScreen: React.FC = () => {
  const {
    merchantInfo,
    language,
    navigateTo,
    setIsLanguageModalOpen,
    setIsLogoutModalOpen,
    setIsKycModalOpen,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: '#080C14',
        minHeight: '100vh',
        paddingBottom: '96px',
        color: '#FFFFFF',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* 1. Top Screen Header */}
      <div
        style={{
          padding: '20px 20px 14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 900,
                margin: 0,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
              }}
            >
              {isAr ? 'متجري' : 'My Store'}
            </h1>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#00C853',
                display: 'inline-block',
                boxShadow: '0 0 8px #00C853',
              }}
            />
          </div>
          <p
            style={{
              fontSize: '12.5px',
              color: '#94A3B8',
              margin: '4px 0 0 0',
              fontWeight: 500,
            }}
          >
            {isAr ? 'إدارة ملف المتجر والأجهزة والامتثال' : 'Manage store profile, hardware & compliance'}
          </p>
        </div>

        {/* Quick Hub Grid Icon Button */}
        <button
          type="button"
          onClick={() => navigateTo('MERCHANT_WEB')}
          aria-label="App Hub"
          className="interactive-tap"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1',
            cursor: 'pointer',
          }}
        >
          <LayoutGrid size={18} />
        </button>
      </div>

      {/* Main Container */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* 2. Settlement Account Card */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '20px',
            padding: '16px 18px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {isAr ? 'حساب التسوية البنكي' : 'SETTLEMENT ACCOUNT'}
            </span>

            <span
              style={{
                fontSize: '9.5px',
                fontWeight: 800,
                backgroundColor: 'rgba(0, 200, 83, 0.12)',
                border: '1px solid rgba(0, 200, 83, 0.3)',
                color: '#00C853',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              {isAr ? 'الأساسي' : 'Primary'}
            </span>
          </div>

          {/* Account Details Row */}
          <div
            onClick={() => navigateTo('MERCHANT_BANK_LINK')}
            className="interactive-tap"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Bank Squircle Badge */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 200, 83, 0.1)',
                  border: '1px solid rgba(0, 200, 83, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00C853',
                  flexShrink: 0,
                }}
              >
                <Building2 size={22} />
              </div>

              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {merchantInfo.settlementBank || 'Al Rajhi Bank'}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#94A3B8',
                    marginTop: '2px',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                  dir="ltr"
                >
                  •••• {merchantInfo.settlementIban ? merchantInfo.settlementIban.slice(-9) : '6271 5005'}
                </div>
              </div>
            </div>

            {/* Bank Verified Tag */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(0, 200, 83, 0.1)',
                border: '1px solid rgba(0, 200, 83, 0.3)',
                borderRadius: '20px',
                padding: '4px 10px',
              }}
            >
              <Check size={12} color="#00C853" strokeWidth={3} />
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#00C853' }}>
                {isAr ? 'حساب موثق' : 'Bank Verified'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Core Store Management Group (Group 1) */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Row 1: Business Profile */}
          <div
            onClick={() => navigateTo('MERCHANT_SETUP')}
            className="interactive-tap"
            style={{
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #1E293B',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  border: '1px solid rgba(0, 200, 83, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00C853',
                  flexShrink: 0,
                }}
              >
                <Store size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'ملف المنشأة' : 'Business Profile'}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                  {isAr ? 'عرض وتعديل بيانات السجل والضريبة' : 'View & edit store & tax info'}
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#64748B" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </div>

          {/* Row 2: KYC Verification */}
          <div
            onClick={() => setIsKycModalOpen(true)}
            className="interactive-tap"
            style={{
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #1E293B',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  border: '1px solid rgba(0, 200, 83, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00C853',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                    {isAr ? 'التحقق والامتثال' : 'KYC Verification'}
                  </span>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 800,
                      backgroundColor: 'rgba(0, 200, 83, 0.12)',
                      border: '1px solid rgba(0, 200, 83, 0.3)',
                      color: '#00C853',
                      padding: '1px 6px',
                      borderRadius: '5px',
                    }}
                  >
                    {isAr ? 'موثق' : 'Verified'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                  {isAr ? 'توثيق معتمد لرفع سقوف التحصيل' : 'Unlock exclusive tier benefits'}
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#64748B" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </div>

          {/* Row 3: Manage QR */}
          <div
            onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
            className="interactive-tap"
            style={{
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #1E293B',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: '#161F30',
                  border: '1px solid #2A364F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#CBD5E1',
                  flexShrink: 0,
                }}
              >
                <QrCode size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'إدارة الباركود' : 'Manage QR'}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                  {isAr ? 'طباعة ومشاركة باركود المتجر' : 'Manage & order store QR'}
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#64748B" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </div>

          {/* Row 4: Manage Business (Payment Settings) */}
          <div
            onClick={() => navigateTo('SECURITY')}
            className="interactive-tap"
            style={{
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: '#161F30',
                  border: '1px solid #2A364F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#CBD5E1',
                  flexShrink: 0,
                }}
              >
                <SlidersHorizontal size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'إدارة الأعمال' : 'Manage Business'}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                  {isAr ? 'إعدادات الدفع' : 'Payment settings'}
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#64748B" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </div>
        </div>

        {/* 4. Operations & Settings Group (Group 2) */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Row 1: Payment Instruments */}
          <div
            onClick={() => navigateTo('SOFTPOS_TERMINAL')}
            className="interactive-tap"
            style={{
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #1E293B',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: '#161F30',
                  border: '1px solid #2A364F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#CBD5E1',
                  flexShrink: 0,
                }}
              >
                <CreditCard size={18} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'أجهزة وطرق الدفع' : 'Payment Instruments'}
              </div>
            </div>
            <ChevronRight size={16} color="#64748B" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </div>

          {/* Row 2: Manage Staff */}
          <div
            onClick={() => navigateTo('MERCHANT_WEB')}
            className="interactive-tap"
            style={{
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #1E293B',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: '#161F30',
                  border: '1px solid #2A364F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#CBD5E1',
                  flexShrink: 0,
                }}
              >
                <Users size={18} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'إدارة طاقم العمل' : 'Manage Staff'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
                {isAr ? '٣ نشطين' : '3 Active'}
              </span>
              <ChevronRight size={16} color="#64748B" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </div>
          </div>

          {/* Row 3: Change Language */}
          <div
            onClick={() => setIsLanguageModalOpen(true)}
            className="interactive-tap"
            style={{
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: '#161F30',
                  border: '1px solid #2A364F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#CBD5E1',
                  flexShrink: 0,
                }}
              >
                <Languages size={18} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'تغيير اللغة' : 'Change Language'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
                English (EN) / العربية
              </span>
              <ChevronRight size={16} color="#64748B" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </div>
          </div>
        </div>

        {/* 5. Logout Group (Group 3) */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div
            onClick={() => setIsLogoutModalOpen(true)}
            className="interactive-tap"
            style={{
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FF6B81',
                  flexShrink: 0,
                }}
              >
                <LogOut size={18} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'تسجيل الخروج من الحساب' : 'Log Out Account'}
              </span>
            </div>
            <ChevronRight size={16} color="#64748B" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </div>
        </div>

        {/* Quantira Technologies Dock */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
          <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>
            {isAr ? 'منصة مدفوعات تجارية مدعومة بتقنيات كوانتيرا' : 'Merchant Platform • Powered by Quantira Technologies'}
          </span>
        </div>
      </div>
    </div>
  );
};

