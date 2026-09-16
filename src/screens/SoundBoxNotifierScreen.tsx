import React, { useState } from 'react';
import { Volume2, Radio, Play } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { SamaLogo } from '../components/SamaLogo';
import { AppHeader } from '../components/AppHeader';
import { formatSaudiCurrency, formatLocalizedNumber } from '../utils/i18n';

export const SoundBoxNotifierScreen: React.FC = () => {
  const {
    soundBoxLanguage,
    setSoundBoxLanguage,
    soundBoxVolume,
    setSoundBoxVolume,
    speakSoundBox,
    language,
  } = useApp();

  const isAr = language === 'العربية';
  const [lastPlayedLog, setLastPlayedLog] = useState<string>(
    isAr ? 'جاهز لاستقبال إشعارات سريع ومدى الفورية' : 'Ready for incoming Sarie/mada payments'
  );

  const handlePlayTest = (amount: number) => {
    speakSoundBox(amount);
    const msg = soundBoxLanguage === 'ar' || isAr
      ? `تم تشغيل الإشعار الصوتي: تم استلام ${amount} ريال سعودي عبر كيو تي باي`
      : `Played audio announcement: Received SAR ${amount}.00 on QTPay`;
    setLastPlayedLog(msg);
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
        paddingBottom: '24px',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Top Header */}
      <div>
        <AppHeader
          title={isAr ? 'مكبر الصوت الذكي للتحصيلات' : 'QTPay Smart SoundBox'}
          showBack={true}
          showSettings={false}
          rightAction={
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: 'rgba(127, 232, 127, 0.12)',
                border: '1px solid rgba(127, 232, 127, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7FE87F',
              }}
            >
              <Radio size={18} />
            </div>
          }
        />
      </div>

      {/* Virtual 3D SoundBox Speaker Graphic */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '14px 0' }}>
        <div
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '36px',
            background: 'linear-gradient(145deg, #1C1C2E 0%, #111726 50%, #080C14 100%)',
            border: '2px solid #1E293B',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 0 35px rgba(127, 232, 127, 0.15)',
          }}
        >
          {/* Status Indicator LED */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#7FE87F',
              boxShadow: '0 0 8px #7FE87F',
            }}
          />

          {/* Concentric Speaker Grille */}
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: '#080C14',
              border: '2px solid #1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7FE87F',
            }}
          >
            <Volume2 size={40} />
          </div>

          <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#94A3B8', marginTop: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            QTPay SoundBox 5G
          </div>
        </div>

        {/* Live Audio Status */}
        <div style={{ fontSize: '12px', color: '#7FE87F', fontWeight: 700, marginTop: '14px', textAlign: 'center', maxWidth: '300px' }}>
          ✓ {lastPlayedLog}
        </div>
      </div>

      {/* SoundBox Controls */}
      <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Language Switcher */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
            {isAr ? 'لغة الإشعار الصوتي' : 'Voice Announcement Language'}
          </span>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setSoundBoxLanguage('ar')}
              style={{
                backgroundColor: soundBoxLanguage === 'ar' ? '#7FE87F' : '#1A2234',
                color: soundBoxLanguage === 'ar' ? '#000000' : '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              العربية 🇸🇦
            </button>
            <button
              onClick={() => setSoundBoxLanguage('en')}
              style={{
                backgroundColor: soundBoxLanguage === 'en' ? '#7FE87F' : '#1A2234',
                color: soundBoxLanguage === 'en' ? '#000000' : '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              English 🇬🇧
            </button>
          </div>
        </div>

        {/* Volume Level Slider */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
              {isAr ? 'مستوى الصوت' : 'SoundBox Volume Level'}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#7FE87F' }}>
              {isAr ? `${formatLocalizedNumber(Math.round(soundBoxVolume * 100), language)}٪` : `${Math.round(soundBoxVolume * 100)}%`}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={soundBoxVolume}
            onChange={(e) => setSoundBoxVolume(parseFloat(e.target.value))}
            style={{
              width: '100%',
              accentColor: '#7FE87F',
              cursor: 'pointer',
            }}
          />
        </div>

        {/* Quick Test Voice Triggers */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>
            {isAr ? 'تجربة سريعة للإشعارات الصوتية' : 'Quick Audio Triggers'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[50, 150, 1200].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handlePlayTest(amt)}
                className="interactive-tap"
                style={{
                  backgroundColor: '#1A2234',
                  border: '1px solid #1E293B',
                  borderRadius: '12px',
                  padding: '10px 8px',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <Play size={13} color="#7FE87F" /> {formatSaudiCurrency(amt, language)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SAMA Dock */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
        <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>
          {isAr ? 'عتاد ذكي معتمد ومتصل بشبكة البنك المركزي' : 'SAMA Certified IoT Hardware Integration'}
        </span>
        <SamaLogo height={14} themeMode="green" />
      </div>
    </div>
  );
};

