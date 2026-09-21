import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Volume1,
  Radio,
  Play,
  CreditCard,
  QrCode,
  Share2,
  Banknote,
  Smartphone,
  Plus,
  Minus,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { AppHeader } from '../../components/AppHeader';
import { formatSaudiCurrency, formatLocalizedNumber } from '../../utils/i18n';

export const SoundBoxNotifierScreen: React.FC = () => {
  const {
    soundBoxLanguage,
    setSoundBoxLanguage,
    soundBoxVolume,
    setSoundBoxVolume,
    speakSoundBox,
    merchantCollections,
    language,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';
  const [customAmount, setCustomAmount] = useState<string>('');
  const [lastAnnounced, setLastAnnounced] = useState<number | null>(null);

  const handlePlayAnnouncement = (amount: number) => {
    setLastAnnounced(amount);
    speakSoundBox(amount);
    setTimeout(() => setLastAnnounced(null), 3000);
  };

  const handleCustomSpeak = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(customAmount);
    if (!isNaN(num) && num > 0) {
      handlePlayAnnouncement(num);
    }
  };

  const adjustVolume = (delta: number) => {
    setSoundBoxVolume(Math.min(100, Math.max(0, soundBoxVolume + delta)));
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'softpos_mada':
      case 'softpos_visa':
      case 'softpos_mastercard':
        return <CreditCard size={14} color="#00C853" />;
      case 'softpos_applepay':
        return <Smartphone size={14} color="#00C853" />;
      case 'zatca_qr':
        return <QrCode size={14} color="#00C853" />;
      case 'payment_link':
        return <Share2 size={14} color="#00C853" />;
      default:
        return <Banknote size={14} color="#00C853" />;
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
        paddingBottom: '32px',
        boxSizing: 'border-box',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '12px 0 6px 0' }}>
        <div
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '32px',
            background: 'linear-gradient(145deg, #1C1C2E 0%, #111726 50%, #080C14 100%)',
            border: '2px solid #1E293B',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 0 35px rgba(0, 200, 83, 0.18)',
          }}
        >
          {/* Status Indicator LED */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00C853',
              boxShadow: '0 0 10px #00C853',
            }}
          />

          {/* Speaker Grille Pattern */}
          <div
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              backgroundColor: '#0F172A',
              border: '2px solid #2A364F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {soundBoxVolume === 0 ? (
              <VolumeX size={38} color="#94A3B8" />
            ) : soundBoxVolume < 50 ? (
              <Volume1 size={38} color="#00C853" />
            ) : (
              <Volume2 size={38} color="#00C853" />
            )}
          </div>

          <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', marginTop: '8px' }}>
            SoundBox 4G &bull; Online
          </span>
        </div>

        {lastAnnounced !== null && (
          <div
            className="fade-in"
            style={{
              marginTop: '10px',
              backgroundColor: 'rgba(0, 200, 83, 0.15)',
              border: '1px solid #00C853',
              borderRadius: '20px',
              padding: '4px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#00C853',
            }}
          >
            <Sparkles size={14} />
            <span>{isAr ? `جاري نطق: ${formatSaudiCurrency(lastAnnounced, language)}` : `Announcing SAR ${lastAnnounced.toFixed(2)}...`}</span>
          </div>
        )}
      </div>

      {/* Control Panel Area */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Card 1: Volume & Voice Language Settings */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '18px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {/* Volume Header & Controls */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'مستوى صوت المكبر' : 'Announcement Volume'}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#00C853' }}>
                {formatLocalizedNumber(soundBoxVolume, language)}%
              </span>
            </div>

            {/* Slider */}
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
                marginBottom: '10px',
              }}
            />

            {/* Quick Volume Adjustment Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setSoundBoxVolume(0)}
                className="interactive-tap"
                style={{
                  backgroundColor: soundBoxVolume === 0 ? '#00C853' : '#161F30',
                  color: soundBoxVolume === 0 ? '#080C14' : '#94A3B8',
                  border: '1px solid #2A364F',
                  borderRadius: '10px',
                  padding: '6px 2px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'كتم' : 'Mute'}
              </button>
              <button
                type="button"
                onClick={() => adjustVolume(-10)}
                className="interactive-tap"
                style={{
                  backgroundColor: '#161F30',
                  color: '#FFFFFF',
                  border: '1px solid #2A364F',
                  borderRadius: '10px',
                  padding: '6px 2px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Minus size={13} />
              </button>
              <button
                type="button"
                onClick={() => setSoundBoxVolume(50)}
                className="interactive-tap"
                style={{
                  backgroundColor: soundBoxVolume === 50 ? '#00C853' : '#161F30',
                  color: soundBoxVolume === 50 ? '#080C14' : '#FFFFFF',
                  border: '1px solid #2A364F',
                  borderRadius: '10px',
                  padding: '6px 2px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => adjustVolume(10)}
                className="interactive-tap"
                style={{
                  backgroundColor: '#161F30',
                  color: '#FFFFFF',
                  border: '1px solid #2A364F',
                  borderRadius: '10px',
                  padding: '6px 2px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus size={13} />
              </button>
              <button
                type="button"
                onClick={() => setSoundBoxVolume(100)}
                className="interactive-tap"
                style={{
                  backgroundColor: soundBoxVolume === 100 ? '#00C853' : '#161F30',
                  color: soundBoxVolume === 100 ? '#080C14' : '#FFFFFF',
                  border: '1px solid #2A364F',
                  borderRadius: '10px',
                  padding: '6px 2px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                100%
              </button>
            </div>
          </div>

          {/* Voice Language Selector */}
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#CBD5E1', marginBottom: '8px' }}>
              {isAr ? 'لغة النطق الصوتي' : 'Voice Language'}
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
        </div>

        {/* Card 2: Custom Real Transaction Announce Input */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '18px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
            {isAr ? 'نطق مبلغ مخصص مباشر' : 'Broadcast Custom Amount'}
          </div>

          <form onSubmit={handleCustomSpeak} style={{ display: 'flex', gap: '8px' }}>
            <div
              style={{
                flex: 1,
                backgroundColor: '#161F30',
                border: '1px solid #2A364F',
                borderRadius: '12px',
                padding: '0 12px',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#00C853' }}>SAR</span>
              <input
                type="number"
                step="0.01"
                inputMode="decimal"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0.00"
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  width: '100%',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!customAmount || parseFloat(customAmount) <= 0}
              className="interactive-tap"
              style={{
                backgroundColor: customAmount && parseFloat(customAmount) > 0 ? '#00C853' : '#161F30',
                color: customAmount && parseFloat(customAmount) > 0 ? '#080C14' : '#64748B',
                border: 'none',
                borderRadius: '12px',
                padding: '0 16px',
                height: '46px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: customAmount && parseFloat(customAmount) > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <Play size={14} />
              <span>{isAr ? 'نطق' : 'Speak'}</span>
            </button>
          </form>
        </div>

        {/* Card 3: Real Transactions Voice Replay List */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '18px',
            padding: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
              {isAr ? 'التحصيلات الحقيقية الأخيرة' : 'Recent Real Collections'}
            </span>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>
              {isAr ? 'انقر للاستماع' : 'Tap to replay voice'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {merchantCollections.slice(0, 5).map((col) => (
              <div
                key={col.id}
                style={{
                  backgroundColor: '#161F30',
                  border: '1px solid #2A364F',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 200, 83, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getMethodIcon(col.paymentMethod)}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                      SAR {col.amount.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>
                      {col.orderRef || col.id} &bull; {col.customerMasked || col.date}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayAnnouncement(col.amount)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: 'rgba(0, 200, 83, 0.12)',
                    border: '1px solid rgba(0, 200, 83, 0.3)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: '#00C853',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Play size={12} fill="#00C853" />
                  <span>{isAr ? 'استماع' : 'Announce'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
