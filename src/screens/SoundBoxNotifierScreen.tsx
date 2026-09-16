import React from 'react';
import { Volume2, Radio, Play } from 'lucide-react';
import { useApp } from '../state/AppContext';
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

  const handlePlayTest = (amount: number) => {
    speakSoundBox(amount);
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
                backgroundColor: 'rgba(0, 200, 83, 0.12)',
                border: '1px solid rgba(0, 200, 83, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00C853',
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
            boxShadow: '0 0 35px rgba(0, 200, 83, 0.15)',
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
              backgroundColor: '#00C853',
              boxShadow: '0 0 8px #00C853',
            }}
          />

          {/* Speaker Grille Pattern */}
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#0F172A',
              border: '2px solid #2A364F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Volume2 size={44} color="#00C853" />
          </div>

          <span style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8', marginTop: '10px' }}>
            SoundBox Pro v2.4
          </span>
        </div>
      </div>

      {/* Control Panel Card */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '20px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {/* Volume Control */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'مستوى الصوت' : 'Announcement Volume'}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#00C853' }}>
                {formatLocalizedNumber(soundBoxVolume, language)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={soundBoxVolume}
              onChange={(e) => setSoundBoxVolume(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#00C853',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Voice Language Selector */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              {isAr ? 'لغة النطق الصوتي' : 'Voice Announcement Language'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSoundBoxLanguage('ar')}
                className="interactive-tap"
                style={{
                  backgroundColor: soundBoxLanguage === 'ar' ? '#161F30' : '#080C14',
                  border: soundBoxLanguage === 'ar' ? '1.5px solid #00C853' : '1px solid #1E293B',
                  borderRadius: '12px',
                  padding: '10px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                🇸🇦 العربية (Arabic)
              </button>
              <button
                type="button"
                onClick={() => setSoundBoxLanguage('en')}
                className="interactive-tap"
                style={{
                  backgroundColor: soundBoxLanguage === 'en' ? '#161F30' : '#080C14',
                  border: soundBoxLanguage === 'en' ? '1.5px solid #00C853' : '1px solid #1E293B',
                  borderRadius: '12px',
                  padding: '10px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* Quick Audio Test Triggers */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              {isAr ? 'اختبار النطق الصوتي للمبالغ' : 'Trigger Audio Test Announcement'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[25, 150, 480].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handlePlayTest(amt)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: '#161F30',
                    border: '1px solid #2A364F',
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
                  <Play size={13} color="#00C853" /> {formatSaudiCurrency(amt, language)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
