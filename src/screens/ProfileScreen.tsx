import React from 'react';
import {
  Edit3,
  QrCode,
  Landmark,
  Zap,
  CreditCard,
  Download,
  History,
  Gift,
  ShoppingBag,
  ShieldCheck,
  Bell,
  Globe,
  HelpCircle,
  LogOut,
  Lock,
  MessageSquare,
  Plane,
  Utensils,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { SamaLogo } from '../components/SamaLogo';
import { ListRow } from '../components/ListRow';
import { useApp } from '../state/AppContext';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    language,
    navigateTo,
    setIsLanguageModalOpen,
    setIsLogoutModalOpen,
    setIsEditProfileModalOpen,
    t,
    isRtl,
  } = useApp();

  const displayName = t(user.name, user.name);

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B14', minHeight: '100%', paddingBottom: '96px' }}>
      <AppHeader title={t('profile.title', 'Profile')} showSettings={false} showBack={true} onBack={() => navigateTo('HOME')} />

      {/* User Header Profile Hero Card */}
      <div
        style={{
          margin: '16px 20px 24px 20px',
          backgroundColor: '#151524',
          border: '1px solid #2C2C44',
          borderRadius: '20px',
          padding: '24px 20px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'none',
        }}
      >
        {/* Top Verified Pill */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            [isRtl ? 'left' : 'right']: '16px',
            backgroundColor: 'rgba(127, 232, 127, 0.15)',
            border: '1px solid #7FE87F',
            borderRadius: '20px',
            padding: '3px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.05em',
            color: '#7FE87F',
          }}
        >
          <SamaLogo height={10} themeMode="green" />
          <span>{language === 'العربية' ? 'موثق عبر نفاذ' : 'KYC VERIFIED'}</span>
        </div>

        {/* Avatar with Edit Badge */}
        <div style={{ position: 'relative', marginBottom: '14px', marginTop: '6px' }}>
          <div
            onClick={() => navigateTo('HOME')}
            role="button"
            tabIndex={0}
            aria-label={language === 'العربية' ? 'الذهاب للرئيسية' : 'Go to Home'}
            className="interactive-tap"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#1E1E32',
              color: '#7FE87F',
              fontWeight: '800',
              fontSize: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: '2px solid #7FE87F',
              cursor: 'pointer',
            }}
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              user.avatarInitials
            )}
          </div>
          <button
            onClick={() => setIsEditProfileModalOpen(true)}
            aria-label={t('btn.edit_profile', 'Edit profile picture')}
            className="interactive-tap"
            style={{
              position: 'absolute',
              bottom: '0',
              [isRtl ? 'left' : 'right']: '-2px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#1E1E32',
              border: '1px solid #2C2C44',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7FE87F',
              cursor: 'pointer',
              boxShadow: 'none',
            }}
            title={t('btn.edit_profile', 'Edit Profile')}
          >
            <Edit3 size={13} strokeWidth={2.5} />
          </button>
        </div>

        {/* User Details */}
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
          {displayName}
        </h2>
        <div style={{ fontSize: '12px', color: '#7FE87F', fontWeight: '700', marginTop: '4px', letterSpacing: '0.01em' }} dir="ltr">
          {user.upiId} • {user.mobile}
        </div>
        <div style={{ fontSize: '11px', color: '#A2A2BA', fontWeight: '600', marginTop: '3px' }}>
          {user.email}
        </div>

        {/* Action Buttons: Edit Profile & My QR Code */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '18px', width: '100%', justifyContent: 'center' }}>
          <button
            onClick={() => setIsEditProfileModalOpen(true)}
            className="interactive-tap"
            style={{
              flex: 1,
              maxWidth: '150px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: '#7FE87F',
              border: 'none',
              color: '#0B0B14',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: 'none',
            }}
          >
            <Edit3 size={14} color="#0B0B14" />
            {t('btn.edit_profile', 'Edit Profile')}
          </button>
          <button
            onClick={() => navigateTo('RECEIVE')}
            className="interactive-tap"
            style={{
              flex: 1,
              maxWidth: '150px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: '#1E1E32',
              border: '1px solid #2C2C44',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: 'none',
            }}
          >
            <QrCode size={14} color="#7FE87F" />
            {language === 'العربية' ? 'الرمز الخاص بي' : 'My QR'}
          </button>
        </div>
      </div>

      {/* Menu Sections */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Payment & Banking */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#6E6E85', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginInlineStart: '4px' }}>
            {language === 'العربية' ? 'المدفوعات والحسابات' : 'Payment & Accounts'}
          </div>
          <div style={{ backgroundColor: '#151524', border: '1px solid #2C2C44', borderRadius: '16px', overflow: 'hidden', padding: '6px 6px 0 6px', boxShadow: 'none' }}>
            <ListRow icon={<Landmark size={18} color="#7FE87F" />} label={language === 'العربية' ? 'الحسابات البنكية' : 'Bank Accounts'} onClick={() => navigateTo('BANK_ACCOUNTS')} />
            <ListRow icon={<Zap size={18} color="#7FE87F" />} label={language === 'العربية' ? 'إعدادات سريع والرمز السري' : 'Sarie Settings & PIN'} onClick={() => navigateTo('UPI_SETTINGS')} />
            <ListRow icon={<CreditCard size={18} color="#7FE87F" />} label={language === 'العربية' ? 'البطاقات وطرق الدفع' : 'Saved Cards & Methods'} onClick={() => navigateTo('PAYMENT_METHODS')} />
          </div>
        </div>

        {/* Transactions & Money */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#6E6E85', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginInlineStart: '4px' }}>
            {language === 'العربية' ? 'التحويلات والطلبات' : 'Transfers & Requests'}
          </div>
          <div style={{ backgroundColor: '#151524', border: '1px solid #2C2C44', borderRadius: '16px', overflow: 'hidden', padding: '6px 6px 0 6px', boxShadow: 'none' }}>
            <ListRow icon={<Download size={18} color="#7FE87F" />} label={language === 'العربية' ? 'طلبات الأموال' : 'Money Requests'} onClick={() => navigateTo('MONEY_REQUESTS')} />
            <ListRow icon={<History size={18} color="#7FE87F" />} label={language === 'العربية' ? 'سجل العمليات' : 'Transaction History'} onClick={() => navigateTo('HISTORY')} />
            <ListRow icon={<QrCode size={18} color="#7FE87F" />} label={language === 'العربية' ? 'الرمز الخاص بي' : 'My QR Code'} onClick={() => navigateTo('RECEIVE')} />
          </div>
        </div>

        {/* Lifestyle & Offers */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#6E6E85', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginInlineStart: '4px' }}>
            {language === 'العربية' ? 'المكافآت والخدمات' : 'Lifestyle & Rewards'}
          </div>
          <div style={{ backgroundColor: '#151524', border: '1px solid #2C2C44', borderRadius: '16px', overflow: 'hidden', padding: '6px 6px 0 6px', boxShadow: 'none' }}>
            <ListRow icon={<Gift size={18} color="#7FE87F" />} label={language === 'العربية' ? 'المكافآت والاسترداد' : 'Rewards & Cashback'} onClick={() => navigateTo('REWARDS')} />
            <ListRow icon={<ShoppingBag size={18} color="#7FE87F" />} label={language === 'العربية' ? 'عروض التسوق' : 'Shopping Deals'} onClick={() => navigateTo('SHOPPING')} />
            <ListRow icon={<MessageSquare size={18} color="#7FE87F" />} label={language === 'العربية' ? 'الرسائل' : 'Messages'} onClick={() => navigateTo('MESSAGES')} />
            <ListRow icon={<Plane size={18} color="#7FE87F" />} label={language === 'العربية' ? 'حجوزات السفر' : 'Travel Bookings'} onClick={() => navigateTo('TRAVEL')} />
            <ListRow icon={<Utensils size={18} color="#7FE87F" />} label={language === 'العربية' ? 'المطاعم والمقاهي' : 'Dining & Food'} onClick={() => navigateTo('FOOD')} />
          </div>
        </div>

        {/* Security & System Settings */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#6E6E85', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginInlineStart: '4px' }}>
            {language === 'العربية' ? 'الإعدادات والأمان' : 'Settings & Security'}
          </div>
          <div style={{ backgroundColor: '#151524', border: '1px solid #2C2C44', borderRadius: '16px', overflow: 'hidden', padding: '6px 6px 0 6px', boxShadow: 'none' }}>
            <ListRow icon={<ShieldCheck size={18} color="#7FE87F" />} label={language === 'العربية' ? 'الأمان والأجهزة' : 'Security & Devices'} onClick={() => navigateTo('SECURITY')} />
            <ListRow icon={<Bell size={18} color="#7FE87F" />} label={language === 'العربية' ? 'الإشعارات' : 'Notifications'} onClick={() => navigateTo('NOTIFICATIONS')} />
            <ListRow
              icon={<Globe size={18} color="#7FE87F" />}
              label={language === 'العربية' ? 'لغة التطبيق' : 'App Language'}
              rightElement={<span style={{ fontSize: '12px', fontWeight: 800, color: '#7FE87F' }}>{language}</span>}
              onClick={() => setIsLanguageModalOpen(true)}
            />
            <ListRow icon={<HelpCircle size={18} color="#7FE87F" />} label={language === 'العربية' ? 'المساعدة والدعم' : 'Help & Support'} onClick={() => navigateTo('HELP_SUPPORT')} />
            <ListRow icon={<Lock size={18} color="#7FE87F" />} label={language === 'العربية' ? 'الخصوصية والشروط' : 'Privacy & Terms'} onClick={() => navigateTo('PRIVACY')} />
          </div>
        </div>

        {/* Log Out */}
        <div>
          <div style={{ backgroundColor: '#151524', border: '1px solid #2C2C44', borderRadius: '16px', overflow: 'hidden', padding: '6px 6px 0 6px', boxShadow: 'none' }}>
            <ListRow
              icon={<LogOut size={18} color="#FF4757" />}
              label={language === 'العربية' ? 'تسجيل الخروج' : 'Log Out'}
              danger={true}
              onClick={() => setIsLogoutModalOpen(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
