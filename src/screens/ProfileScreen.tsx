import React from 'react';
import {
  Building2,
  Briefcase,
  BadgeCheck,
  QrCode,
  Settings,
  CreditCard,
  Users,
  Languages,
  LogOut,
  ChevronRight,
  Coins,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { SamaLogo } from '../components/SamaLogo';
import { translateText } from '../utils/i18n';

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
  const businessName = merchantInfo.businessName || 'Starmart Supermarket';

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: '#080C14',
        minHeight: '100vh',
        paddingBottom: '96px',
        color: '#FFFFFF',
        userSelect: 'none',
      }}
    >
      {/* 1. Top Store Canopy Header matching reference */}
      <header
        style={{
          backgroundColor: '#00C853',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#000000',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.85, display: 'block' }}>
            {isAr ? 'متجري' : 'My Store'}
          </span>
          <h1 style={{ fontSize: '18px', fontWeight: 900, margin: '2px 0 0 0', color: '#000000', letterSpacing: '-0.01em' }}>
            {translateText(businessName, language)}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => navigateTo('NOTIFICATIONS')}
            className="interactive-tap"
            style={{
              background: 'rgba(0, 0, 0, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              cursor: 'pointer',
            }}
            title={isAr ? 'التنبيهات' : 'Notifications'}
          >
            <Bell size={18} />
          </button>

          <button
            onClick={() => navigateTo('HELP_SUPPORT')}
            className="interactive-tap"
            style={{
              background: 'rgba(0, 0, 0, 0.1)',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#000000',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <HelpCircle size={15} />
            <span>{isAr ? 'مساعدة' : 'Help'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* 2. Avail Instant Business Loan Banner matching reference */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #0F3B2C 50%, #131B26 100%)',
            border: '1px solid rgba(0, 200, 83, 0.35)',
            borderRadius: '18px',
            padding: '16px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0, 200, 83, 0.08)',
          }}
        >
          <div style={{ flex: 1, zIndex: 1 }}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0' }}>
              {isAr ? 'تمويل فوري لنمو المتجر' : 'Avail Instant Business Loan'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px', color: '#CBD5E1', marginBottom: '12px', fontWeight: 600 }}>
              <span>✔ {isAr ? 'بدون ضمانات معقدة' : 'Collateral Free'}</span>
              <span>✔ {isAr ? 'إيداع فوري عبر سريع' : 'Instant Sarie Disbursal'}</span>
              <span>✔ {isAr ? 'هامش ربح منافس ومنخفض' : 'Low Profit Margin'}</span>
            </div>

            <button
              onClick={() => {
                alert(
                  isAr
                    ? 'تم استلام طلب التمويل بقيمة ٥٠,٠٠٠ ر.س بنجاح! سيتم التواصل معكم فوراً.'
                    : 'Business loan inquiry for SAR 50,000 received! A financing specialist will contact you shortly.'
                );
              }}
              className="interactive-tap"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#064E3B',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: 900,
                cursor: 'pointer',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              }}
            >
              {isAr ? 'معرفة المزيد' : 'KNOW MORE'}
            </button>
          </div>

          {/* 3D Gold Graphic Aura */}
          <div
            style={{
              width: '85px',
              height: '85px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(234, 179, 8, 0.25) 0%, rgba(0, 200, 83, 0.1) 70%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FACC15',
              flexShrink: 0,
            }}
          >
            <Coins size={44} />
          </div>
        </div>

        {/* 3. 2x2 Core Business Hub Cards Matrix matching reference */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {/* Card 1: Bank Account */}
          <div
            onClick={() => navigateTo('MERCHANT_BANK_LINK')}
            className="interactive-tap"
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '16px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '110px',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00C853',
                }}
              >
                <Building2 size={18} />
              </div>
              <ChevronRight size={16} color="#64748B" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginTop: '8px' }}>
                {merchantInfo.settlementIban ? merchantInfo.settlementIban.slice(-9) : 'XXXX 5005'}
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px', lineHeight: 1.2 }}>
                {merchantInfo.settlementBank || 'Al Rajhi Bank'}
              </div>
            </div>
          </div>

          {/* Card 2: Business Profile */}
          <div
            onClick={() => navigateTo('MERCHANT_SETUP')}
            className="interactive-tap"
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '16px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '110px',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3B82F6',
                }}
              >
                <Briefcase size={18} />
              </div>
              <ChevronRight size={16} color="#64748B" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginTop: '8px' }}>
                {isAr ? 'ملف المنشأة' : 'Business Profile'}
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px', lineHeight: 1.2 }}>
                {isAr ? 'عرض وتعديل بيانات السجل والضريبة' : 'View & edit store & tax info'}
              </div>
            </div>
          </div>

          {/* Card 3: KYC */}
          <div
            onClick={() => setIsKycModalOpen(true)}
            className="interactive-tap"
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '16px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '110px',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F59E0B',
                }}
              >
                <BadgeCheck size={18} />
              </div>
              <ChevronRight size={16} color="#64748B" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginTop: '8px' }}>
                {isAr ? 'التحقق والامتثال' : 'KYC Verification'}
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px', lineHeight: 1.2 }}>
                {isAr ? 'توثيق معتمد لرفع سقوف التحصيل' : 'Unlock exclusive tier benefits'}
              </div>
            </div>
          </div>

          {/* Card 4: Manage QR & Terminals */}
          <div
            onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
            className="interactive-tap"
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '16px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '110px',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(139, 92, 246, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8B5CF6',
                }}
              >
                <QrCode size={18} />
              </div>
              <ChevronRight size={16} color="#64748B" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginTop: '8px' }}>
                {isAr ? 'إدارة الباركود' : 'Manage QR'}
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px', lineHeight: 1.2 }}>
                {isAr ? 'طباعة ومشاركة باركود المتجر' : 'Manage & order store QR'}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Manage Business Quick Circular Tools Grid matching reference */}
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', display: 'block' }}>
            {isAr ? 'إدارة أعمال المتجر' : 'Manage Business'}
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {/* 1. Payment Settings */}
            <div
              onClick={() => navigateTo('SECURITY')}
              className="interactive-tap"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00C853',
                }}
              >
                <Settings size={20} />
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#94A3B8', lineHeight: 1.2 }}>
                {isAr ? 'إعدادات الدفع' : 'Payment settings'}
              </span>
            </div>

            {/* 2. Payment Instruments */}
            <div
              onClick={() => navigateTo('SOFTPOS_TERMINAL')}
              className="interactive-tap"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3B82F6',
                }}
              >
                <CreditCard size={20} />
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#94A3B8', lineHeight: 1.2 }}>
                {isAr ? 'أجهزة الدفع' : 'Payment Instruments'}
              </span>
            </div>

            {/* 3. Manage Staff */}
            <div
              onClick={() => navigateTo('MERCHANT_WEB')}
              className="interactive-tap"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F59E0B',
                }}
              >
                <Users size={20} />
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#94A3B8', lineHeight: 1.2 }}>
                {isAr ? 'إدارة الكاشير' : 'Manage Staff'}
              </span>
            </div>

            {/* 4. Change Language */}
            <div
              onClick={() => setIsLanguageModalOpen(true)}
              className="interactive-tap"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8B5CF6',
                }}
              >
                <Languages size={20} />
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#94A3B8', lineHeight: 1.2 }}>
                {isAr ? 'تغيير اللغة' : 'Change Language'}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Log Out & Compliance Section */}
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="interactive-tap"
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '14px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FF4757',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogOut size={16} />
              <span>{isAr ? 'تسجيل الخروج من الحساب' : 'Log Out Account'}</span>
            </div>
            <ChevronRight size={16} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
            <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>
              {isAr ? 'منصة مدفوعات تجارية مرخصة من البنك المركزي السعودي' : 'SAMA Regulated Merchant Platform'}
            </span>
            <SamaLogo height={13} themeMode="green" />
          </div>
        </div>

      </div>
    </div>
  );
};
