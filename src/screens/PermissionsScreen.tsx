import React, { useState } from 'react';
import { Wifi, Camera, MapPin, Radio, Bell, ShieldCheck, ArrowRight, Landmark, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { useApp } from '../state/AppContext';

export const PermissionsScreen: React.FC = () => {
  const { navigateTo, goBack, t, isRtl, language } = useApp();

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    nfc: true,
    camera: true,
    location: true,
    bluetooth: true,
    notifications: true,
  });
  const [isDiscovering, setIsDiscovering] = useState<boolean>(false);
  const [discoveryStep, setDiscoveryStep] = useState<number>(0);

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const permissions = [
    {
      key: 'nfc',
      icon: <Wifi size={19} />,
      name: language === 'العربية' ? 'شريحة الدفع اللاتلامسي (NFC SoftPOS)' : 'NFC SoftPOS & Contactless Reader',
      required: true,
    },
    {
      key: 'camera',
      icon: <Camera size={19} />,
      name: language === 'العربية' ? 'كاميرا مسح فواتير زاتكا (ZATCA QR)' : 'Camera & ZATCA QR Scanner',
      required: true,
    },
    {
      key: 'location',
      icon: <MapPin size={19} />,
      name: language === 'العربية' ? 'الموقع الجغرافي لأمان نقاط البيع' : 'Location & POS Geofencing',
      required: true,
    },
    {
      key: 'bluetooth',
      icon: <Radio size={19} />,
      name: language === 'العربية' ? 'بلوتوث الربط بمكبر الصوت SoundBox' : 'Bluetooth SoundBox Gateway',
      required: false,
    },
    {
      key: 'notifications',
      icon: <Bell size={19} />,
      name: language === 'العربية' ? 'إشعارات التحصيل والتسوية اليومية' : 'Daily Settlement Alerts',
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
      navigateTo('MERCHANT_SETUP');
    }, 2700);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#080C14', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '32px', color: '#FFFFFF' }}>
      <div>
        <AppHeader title={t('auth.permissions_title', 'SoftPOS Permissions')} showBack={true} onBack={goBack} showSettings={false} />

        <div style={{ padding: '20px' }}>
          {/* Header Card */}
          <div
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
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
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  color: '#00C853',
                  border: '1px solid rgba(0, 200, 83, 0.3)',
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
                  {language === 'العربية' ? 'معايير أمان نقاط البيع المعتمدة' : 'SoftPOS Terminal Security Standard'}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                  {language === 'العربية' ? 'تشفير متقدم لعمليات نقاط البيع والدفع' : 'Encrypted Contactless & QR POS Processing'}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '10px',
              paddingInlineStart: '4px',
            }}
          >
            {language === 'العربية'
              ? `صلاحيات نقطة البيع (تم منح ${Object.values(toggles).filter(Boolean).length}/٥)`
              : `POS Hardware Access (${Object.values(toggles).filter(Boolean).length}/5 Granted)`}
          </div>

          {/* Grouped Permissions Card */}
          <div
            style={{
              backgroundColor: '#111726',
              borderRadius: '16px',
              border: '1px solid #1E293B',
              overflow: 'hidden',
              boxShadow: 'none',
            }}
          >
            {permissions.map((perm, index) => {
              const isOn = toggles[perm.key];
              return (
                <React.Fragment key={perm.key}>
                  {index > 0 && <div style={{ height: '1px', backgroundColor: '#1E293B', margin: '0 16px' }} />}
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
                          backgroundColor: isOn ? 'rgba(0, 200, 83, 0.12)' : '#1A2234',
                          color: isOn ? '#00C853' : '#94A3B8',
                          border: isOn ? '1px solid rgba(0, 200, 83, 0.35)' : '1px solid #1E293B',
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
                          <span style={{ fontSize: '9px', fontWeight: 800, backgroundColor: 'rgba(0, 200, 83, 0.12)', color: '#00C853', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(0, 200, 83, 0.3)' }}>
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
                        backgroundColor: isOn ? '#00C853' : '#1A2234',
                        border: isOn ? 'none' : '1px solid #1E293B',
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
                          backgroundColor: isOn ? '#080C14' : '#94A3B8',
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
          {t('auth.allow_continue', 'Allow & Configure Store')}{' '}
          <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        </PrimaryButton>
        <SecondaryButton onClick={handleGrantPermissions}>
          {language === 'العربية' ? 'تخطي الآن' : 'Skip for Now'}
        </SecondaryButton>
      </div>

      {/* Interactive Terminal Initialization Modal */}
      {isDiscovering && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 8, 15, 0.85)',
            backdropFilter: 'blur(10px)',
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
              backgroundColor: '#111726',
              borderRadius: '20px',
              border: '1px solid #1E293B',
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
                backgroundColor: 'rgba(0, 200, 83, 0.12)',
                color: '#00C853',
                border: '1px solid rgba(0, 200, 83, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              {discoveryStep === 1 && <Loader2 size={32} className="animate-spin" />}
              {discoveryStep === 2 && <Landmark size={32} />}
              {discoveryStep === 3 && <CheckCircle2 size={36} color="#00C853" />}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>
              {discoveryStep === 1 && (language === 'العربية' ? 'تهيئة شريحة نقطة البيع SoftPOS...' : 'Initializing SoftPOS Chipset...')}
              {discoveryStep === 2 && (language === 'العربية' ? 'التحقق من السجل التجاري وزاتكا...' : 'ZATCA & CR Verified')}
              {discoveryStep === 3 && (language === 'العربية' ? 'منظومة نقاط البيع جاهزة' : 'POS Engine Ready')}
            </h3>

            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 20px 0', lineHeight: '1.4' }}>
              {discoveryStep === 1 && (language === 'العربية' ? 'تأمين اتصال NFC المشفر لنقاط البيع' : 'Securing NFC SoftPOS encrypted connection')}
              {discoveryStep === 2 && (language === 'العربية' ? 'الربط بمنظومة الفوترة الإلكترونية المرحلة الثانية' : 'Enrolled in ZATCA Phase 2 E-Invoicing')}
              {discoveryStep === 3 && (language === 'العربية' ? 'تم تفعيل منظومة المدفوعات وسريع. جاري إكمال بيانات المتجر...' : 'POS Engine & Sarie enabled. Proceeding to store setup...')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: isRtl ? 'right' : 'left' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: discoveryStep >= 1 ? 'rgba(0, 200, 83, 0.12)' : '#1A2234',
                  border: `1px solid ${discoveryStep >= 1 ? 'rgba(0, 200, 83, 0.35)' : '#1E293B'}`,
                }}
              >
                {discoveryStep >= 1 ? <CheckCircle2 size={16} color="#00C853" /> : <Loader2 size={16} color="#94A3B8" />}
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: discoveryStep >= 1 ? '#FFFFFF' : '#94A3B8' }}>
                  {language === 'العربية' ? 'ربط الجهاز وتفويض نقطة البيع SoftPOS' : 'Device Binding & SoftPOS Authorization'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: discoveryStep >= 2 ? 'rgba(0, 200, 83, 0.12)' : '#1A2234',
                  border: `1px solid ${discoveryStep >= 2 ? 'rgba(0, 200, 83, 0.35)' : '#1E293B'}`,
                }}
              >
                {discoveryStep >= 2 ? <CheckCircle2 size={16} color="#00C853" /> : <Loader2 size={16} color="#94A3B8" />}
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: discoveryStep >= 2 ? '#FFFFFF' : '#94A3B8' }}>
                  {language === 'العربية' ? 'التحقق من منصة فاتورة وهيئة الزكاة' : 'ZATCA Fatoora Platform Verified'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: discoveryStep >= 3 ? 'rgba(0, 200, 83, 0.2)' : '#1A2234',
                  border: `1px solid ${discoveryStep >= 3 ? '#00C853' : '#1E293B'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {discoveryStep >= 3 ? <CheckCircle2 size={16} color="#00C853" /> : <Sparkles size={16} color="#94A3B8" />}
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: discoveryStep >= 3 ? '#00C853' : '#94A3B8' }}>
                    {language === 'العربية' ? 'جاهزية منظومة نقاط البيع وسريع' : 'POS Engine & Sarie Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
