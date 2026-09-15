import React, { useState } from 'react';
import { MessageSquare, Phone, Users, Camera, MapPin, Mic, ShieldCheck, ArrowRight, Lock, Landmark, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { SamaLogo } from '../components/SamaLogo';
import { useApp } from '../state/AppContext';

export const PermissionsScreen: React.FC = () => {
  const { navigateTo, goBack, t, isRtl, language } = useApp();

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    sms: true,
    phone: true,
    contacts: true,
    camera: true,
    location: true,
    mic: false,
  });
  const [isDiscovering, setIsDiscovering] = useState<boolean>(false);
  const [discoveryStep, setDiscoveryStep] = useState<number>(0);

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const permissions = [
    {
      key: 'sms',
      icon: <MessageSquare size={19} />,
      name: language === 'العربية' ? 'التحقق عبر الرسائل القصيرة (SMS)' : 'SMS Verification',
      required: true,
    },
    {
      key: 'phone',
      icon: <Phone size={19} />,
      name: language === 'العربية' ? 'حالة الشريحة والجهاز' : 'Phone & SIM Status',
      required: true,
    },
    {
      key: 'contacts',
      icon: <Users size={19} />,
      name: language === 'العربية' ? 'الوصول لجهات الاتصال' : 'Contacts Access',
      required: false,
    },
    {
      key: 'camera',
      icon: <Camera size={19} />,
      name: language === 'العربية' ? 'الكاميرا ومسح الباركود' : 'Camera & QR Scanner',
      required: false,
    },
    {
      key: 'location',
      icon: <MapPin size={19} />,
      name: language === 'العربية' ? 'أمان الموقع الجغرافي' : 'Location Security',
      required: false,
    },
    {
      key: 'mic',
      icon: <Mic size={19} />,
      name: language === 'العربية' ? 'التنبيهات الصوتية والدفع الصوتي' : 'Audio Alerts & Voice Pay',
      required: false,
    },
  ];

  const handleGrantPermissions = () => {
    try {
      localStorage.setItem('hasGrantedPermissions', 'true');
      localStorage.setItem('hasCompletedOnboarding', 'true');
    } catch {
      // Ignore
    }

    setIsDiscovering(true);
    setDiscoveryStep(1);

    setTimeout(() => {
      setDiscoveryStep(2);
    }, 900);

    setTimeout(() => {
      setDiscoveryStep(3);
    }, 1800);

    setTimeout(() => {
      navigateTo('HOME');
    }, 2700);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B14', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '32px', color: '#FFFFFF' }}>
      <div>
        <AppHeader title={t('auth.permissions_title', 'App Permissions')} showBack={true} onBack={goBack} showSettings={false} />

        <div style={{ padding: '20px' }}>
          {/* Header Card with SAMA Central Bank Logo */}
          <div
            style={{
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              borderRadius: '16px',
              padding: '16px 18px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
              boxShadow: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(127, 232, 127, 0.15)',
                  color: '#7FE87F',
                  border: '1px solid rgba(127, 232, 127, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {language === 'العربية' ? 'معايير الأمان والتحقق المعتمدة من ساما' : 'SAMA Mandated Security & e-KYC'}
                </div>
                <div style={{ fontSize: '11px', color: '#A2A2BA', marginTop: '2px' }}>
                  {language === 'العربية' ? 'المعايير التنظيمية للبنك المركزي السعودي' : 'Saudi Central Bank Regulatory Standard'}
                </div>
              </div>
            </div>

            <div style={{ paddingInlineStart: '8px', borderInlineStart: '1px solid #2C2C44' }}>
              <SamaLogo height={20} themeMode="dark" />
            </div>
          </div>

          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 800,
              color: '#6E6E85',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '10px',
              paddingInlineStart: '4px',
            }}
          >
            {language === 'العربية'
              ? `صلاحيات الجهاز (تم منح ${Object.values(toggles).filter(Boolean).length}/٦)`
              : `Device Permissions (${Object.values(toggles).filter(Boolean).length}/6 Granted)`}
          </div>

          {/* Grouped Permissions Card */}
          <div
            style={{
              backgroundColor: '#151524',
              borderRadius: '16px',
              border: '1px solid #2C2C44',
              overflow: 'hidden',
              boxShadow: 'none',
            }}
          >
            {permissions.map((perm, index) => {
              const isOn = toggles[perm.key];
              return (
                <React.Fragment key={perm.key}>
                  {index > 0 && <div style={{ height: '1px', backgroundColor: '#2C2C44', margin: '0 16px' }} />}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '14px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          backgroundColor: isOn ? 'rgba(127, 232, 127, 0.15)' : '#1E1E32',
                          color: isOn ? '#7FE87F' : '#A2A2BA',
                          border: isOn ? '1px solid rgba(127, 232, 127, 0.35)' : '1px solid #2C2C44',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {perm.icon}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '14px', color: '#FFFFFF' }}>
                          {perm.name}
                        </span>
                        {perm.required && (
                          <span style={{ fontSize: '9px', fontWeight: 800, backgroundColor: 'rgba(127, 232, 127, 0.15)', color: '#7FE87F', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(127, 232, 127, 0.3)' }}>
                            {language === 'العربية' ? 'إلزامي' : 'REQUIRED'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Switch Toggle */}
                    <div
                      role="switch"
                      aria-checked={isOn}
                      aria-label={perm.name}
                      tabIndex={0}
                      onClick={() => handleToggle(perm.key)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleToggle(perm.key);
                        }
                      }}
                      style={{
                        width: '46px',
                        height: '26px',
                        borderRadius: '9999px',
                        backgroundColor: isOn ? '#7FE87F' : '#1E1E32',
                        border: isOn ? 'none' : '1px solid #2C2C44',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        flexShrink: 0,
                        direction: 'ltr',
                      }}
                    >
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: isOn ? '#0B0B14' : '#A2A2BA',
                          transform: isOn ? 'translateX(20px)' : 'translateX(0px)',
                          transition: 'transform 0.2s ease',
                          boxShadow: 'none',
                        }}
                      />
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <PrimaryButton onClick={handleGrantPermissions}>
          {t('auth.allow_continue', 'Allow & Continue')}{' '}
          <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        </PrimaryButton>
        <SecondaryButton onClick={handleGrantPermissions}>
          {language === 'العربية' ? 'تخطي الآن' : 'Skip for Now'}
        </SecondaryButton>

        <div style={{ textAlign: 'center', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Lock size={12} color="#6E6E85" />
          <span style={{ fontSize: '11px', color: '#6E6E85', fontWeight: 600 }}>
            {language === 'العربية' ? 'تشفير أجهزة متقدم بمستوى ٢٥٦ بت' : '256-Bit Hardware Encrypted'}
          </span>
        </div>
      </div>

      {/* Interactive Bank Discovery & Instant KYC Modal */}
      {isDiscovering && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 11, 20, 0.9)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="fade-in"
            style={{
              backgroundColor: '#151524',
              borderRadius: '20px',
              border: '1px solid #2C2C44',
              padding: '28px 24px',
              width: '100%',
              maxWidth: '380px',
              textAlign: 'center',
              boxShadow: 'none',
              color: '#FFFFFF',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(127, 232, 127, 0.15)',
                color: '#7FE87F',
                border: '1px solid rgba(127, 232, 127, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              {discoveryStep === 1 && <Loader2 size={32} className="animate-spin" />}
              {discoveryStep === 2 && <Landmark size={32} />}
              {discoveryStep === 3 && <CheckCircle2 size={36} color="#7FE87F" />}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>
              {discoveryStep === 1 && (language === 'العربية' ? 'جاري اكتشاف الحسابات البنكية...' : 'Discovering Bank Accounts...')}
              {discoveryStep === 2 && (language === 'العربية' ? 'تم ربط الحسابات بنجاح' : 'Accounts Linked')}
              {discoveryStep === 3 && (language === 'العربية' ? 'تم التحقق الإلكتروني (KYC)' : 'KYC Verified')}
            </h3>

            <p style={{ fontSize: '13px', color: '#A2A2BA', margin: '0 0 20px 0', lineHeight: '1.4' }}>
              {discoveryStep === 1 && (language === 'العربية' ? 'التحقق من تسجيل شبكة سريع على الرقم +966 50 123 4567' : 'Verifying SAMA Sarie registration on +966 50 123 4567')}
              {discoveryStep === 2 && (language === 'العربية' ? 'تم العثور على حسابات مصرف الراجحي والبنك الأهلي السعودي' : 'Discovered Al Rajhi Bank and SNB accounts')}
              {discoveryStep === 3 && (language === 'العربية' ? 'تم التحقق بنجاح من البنك المركزي السعودي. جاري الانتقال للرئيسية...' : 'SAMA e-KYC verified. Redirecting to home...')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: isRtl ? 'right' : 'left' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: discoveryStep >= 1 ? 'rgba(127, 232, 127, 0.12)' : '#1E1E32',
                  border: `1px solid ${discoveryStep >= 1 ? 'rgba(127, 232, 127, 0.35)' : '#2C2C44'}`,
                }}
              >
                {discoveryStep >= 1 ? <CheckCircle2 size={16} color="#7FE87F" /> : <Loader2 size={16} color="#A2A2BA" />}
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: discoveryStep >= 1 ? '#FFFFFF' : '#A2A2BA' }}>
                  {language === 'العربية' ? 'ربط الجهاز والتحقق من الشريحة' : 'Device Binding & SIM Verification'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: discoveryStep >= 2 ? 'rgba(127, 232, 127, 0.12)' : '#1E1E32',
                  border: `1px solid ${discoveryStep >= 2 ? 'rgba(127, 232, 127, 0.35)' : '#2C2C44'}`,
                }}
              >
                {discoveryStep >= 2 ? <CheckCircle2 size={16} color="#7FE87F" /> : <Loader2 size={16} color="#A2A2BA" />}
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: discoveryStep >= 2 ? '#FFFFFF' : '#A2A2BA' }}>
                  {language === 'العربية' ? 'تم اكتشاف الحسابات (الراجحي، الأهلي SNB)' : 'Bank Accounts Discovered (Al Rajhi Bank, SNB)'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: discoveryStep >= 3 ? 'rgba(127, 232, 127, 0.2)' : '#1E1E32',
                  border: `1px solid ${discoveryStep >= 3 ? '#7FE87F' : '#2C2C44'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {discoveryStep >= 3 ? <CheckCircle2 size={16} color="#7FE87F" /> : <Sparkles size={16} color="#A2A2BA" />}
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: discoveryStep >= 3 ? '#7FE87F' : '#A2A2BA' }}>
                    {language === 'العربية' ? 'التحقق الوطني الفوري عبر نفاذ' : 'SAMA Instant e-KYC (Nafath)'}
                  </span>
                </div>
                {discoveryStep >= 3 && <SamaLogo height={14} themeMode="green" />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
