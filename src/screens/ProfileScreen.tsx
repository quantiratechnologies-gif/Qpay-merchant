import React from 'react';
import {
  Edit3,
  QrCode,
  Building2,
  CreditCard,
  History,
  ShieldCheck,
  Bell,
  Globe,
  HelpCircle,
  LogOut,
  Lock,
  Volume2,
  Smartphone,
  Link2,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { SamaLogo } from '../components/SamaLogo';
import { ListRow } from '../components/ListRow';
import { useApp } from '../state/AppContext';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    merchantInfo,
    language,
    navigateTo,
    setIsLanguageModalOpen,
    setIsLogoutModalOpen,
    setIsEditProfileModalOpen,
    t,
    isRtl,
  } = useApp();

  const displayName = merchantInfo.businessName || t(user.name, user.name);

  return (
    <div className="fade-in" style={{ backgroundColor: '#080C14', minHeight: '100%', paddingBottom: '96px' }}>
      <AppHeader title={t('profile.title', 'Merchant Profile')} showSettings={false} showBack={true} onBack={() => navigateTo('MERCHANT_HOME')} />

      {/* User Header Profile Hero Card */}
      <div
        style={{
          margin: '16px 20px 24px 20px',
          backgroundColor: '#111726',
          border: '1px solid #1E293B',
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
            backgroundColor: 'rgba(127, 232, 127, 0.12)',
            border: '1px solid rgba(127, 232, 127, 0.3)',
            borderRadius: '20px',
            padding: '4px 10px',
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
          <span>{language === 'العربية' ? 'موثق عبر نفاذ وسجل تجاري' : 'VERIFIED MERCHANT'}</span>
        </div>

        {/* Avatar with Edit Badge */}
        <div style={{ position: 'relative', marginBottom: '14px', marginTop: '6px' }}>
          <div
            onClick={() => navigateTo('MERCHANT_HOME')}
            role="button"
            tabIndex={0}
            aria-label={language === 'العربية' ? 'الذهاب للرئيسية' : 'Go to Home'}
            className="interactive-tap"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#1A2234',
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
              merchantInfo.businessName ? merchantInfo.businessName.substring(0, 2).toUpperCase() : user.avatarInitials
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
              backgroundColor: '#1A2234',
              border: '1px solid #1E293B',
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
          CR: {merchantInfo.crNumber || '1010892341'} • VAT: {merchantInfo.vatNumber || '310294857200003'}
        </div>
        <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', marginTop: '3px' }}>
          {user.email} • {merchantInfo.storePhone || user.mobile}
        </div>

        {/* Action Buttons: Edit Business Info & Merchant QR Code */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '18px', width: '100%', justifyContent: 'center' }}>
          <button
            onClick={() => navigateTo('MERCHANT_SETUP')}
            className="interactive-tap"
            style={{
              flex: 1,
              maxWidth: '160px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: '#7FE87F',
              border: 'none',
              color: '#080C14',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: 'none',
            }}
          >
            <Building2 size={14} color="#080C14" />
            {language === 'العربية' ? 'بيانات المنشأة' : 'Business Info'}
          </button>
          <button
            onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
            className="interactive-tap"
            style={{
              flex: 1,
              maxWidth: '160px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: '#1A2234',
              border: '1px solid #1E293B',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: 'none',
            }}
          >
            <QrCode size={14} color="#7FE87F" />
            {language === 'العربية' ? 'رمز المتجر QR' : 'Merchant QR'}
          </button>
        </div>
      </div>

      {/* Menu Sections */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Merchant Business & Settlement */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginInlineStart: '4px' }}>
            {language === 'العربية' ? 'بيانات المنشأة والتسوية' : 'Business & Settlement'}
          </div>
          <div style={{ backgroundColor: '#111726', border: '1px solid #1E293B', borderRadius: '16px', overflow: 'hidden', padding: '6px 6px 0 6px', boxShadow: 'none' }}>
            <ListRow icon={<Building2 size={18} color="#7FE87F" />} label={language === 'العربية' ? 'إعدادات المنشأة والسجل التجاري' : 'Business Profile & CR / VAT'} onClick={() => navigateTo('MERCHANT_SETUP')} />
            <ListRow icon={<CreditCard size={18} color="#7FE87F" />} label={language === 'العربية' ? 'الحساب البنكي للتسوية اليومية' : 'Daily Settlement Bank Account'} onClick={() => navigateTo('MERCHANT_BANK_LINK')} />
            <ListRow icon={<Volume2 size={18} color="#7FE87F" />} label={language === 'العربية' ? 'إعدادات الصندوق الصوتي SoundBox' : 'SoundBox Audio Notifier'} onClick={() => navigateTo('SOUNDBOX_NOTIFIER')} />
          </div>
        </div>

        {/* POS & Collections */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginInlineStart: '4px' }}>
            {language === 'العربية' ? 'نقاط البيع والتحصيل' : 'POS & Collections'}
          </div>
          <div style={{ backgroundColor: '#111726', border: '1px solid #1E293B', borderRadius: '16px', overflow: 'hidden', padding: '6px 6px 0 6px', boxShadow: 'none' }}>
            <ListRow icon={<Smartphone size={18} color="#7FE87F" />} label={language === 'العربية' ? 'نقطة البيع بالجوال SoftPOS' : 'SoftPOS Terminal (NFC Tap)'} onClick={() => navigateTo('SOFTPOS_TERMINAL')} />
            <ListRow icon={<History size={18} color="#7FE87F" />} label={language === 'العربية' ? 'سجل العمليات والتحصيلات' : 'Collections & Settlements'} onClick={() => navigateTo('MERCHANT_COLLECTIONS')} />
            <ListRow icon={<Link2 size={18} color="#7FE87F" />} label={language === 'العربية' ? 'روابط الدفع السريعة' : 'Instant Payment Links'} onClick={() => navigateTo('PAYMENT_LINK_GENERATOR')} />
            <ListRow icon={<QrCode size={18} color="#7FE87F" />} label={language === 'العربية' ? 'رمز QR المتوافق مع هيئة الزكاة' : 'ZATCA Compliant QR Code'} onClick={() => navigateTo('MERCHANT_QR_GENERATOR')} />
          </div>
        </div>

        {/* Security & System Settings */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginInlineStart: '4px' }}>
            {language === 'العربية' ? 'الإعدادات والأمان' : 'Settings & Security'}
          </div>
          <div style={{ backgroundColor: '#111726', border: '1px solid #1E293B', borderRadius: '16px', overflow: 'hidden', padding: '6px 6px 0 6px', boxShadow: 'none' }}>
            <ListRow icon={<ShieldCheck size={18} color="#7FE87F" />} label={language === 'العربية' ? 'الأمان والأجهزة المسجلة' : 'Security & Registered Devices'} onClick={() => navigateTo('SECURITY')} />
            <ListRow icon={<Bell size={18} color="#7FE87F" />} label={language === 'العربية' ? 'الإشعارات والتنبيهات' : 'Notifications & Alerts'} onClick={() => navigateTo('NOTIFICATIONS')} />
            <ListRow
              icon={<Globe size={18} color="#7FE87F" />}
              label={language === 'العربية' ? 'لغة التطبيق' : 'App Language'}
              rightElement={<span style={{ fontSize: '12px', fontWeight: 800, color: '#7FE87F' }}>{language}</span>}
              onClick={() => setIsLanguageModalOpen(true)}
            />
            <ListRow icon={<HelpCircle size={18} color="#7FE87F" />} label={language === 'العربية' ? 'المساعدة ودعم التجار' : 'Merchant Help & Support'} onClick={() => navigateTo('HELP_SUPPORT')} />
            <ListRow icon={<Lock size={18} color="#7FE87F" />} label={language === 'العربية' ? 'الشروط والامتثال المالي' : 'Compliance & Terms'} onClick={() => navigateTo('PRIVACY')} />
          </div>
        </div>

        {/* Log Out */}
        <div>
          <div style={{ backgroundColor: '#111726', border: '1px solid #1E293B', borderRadius: '16px', overflow: 'hidden', padding: '6px 6px 0 6px', boxShadow: 'none' }}>
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
