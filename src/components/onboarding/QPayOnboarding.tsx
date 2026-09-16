import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { AlphPayLogo } from '../AlphPayLogo';
import { LanguageSwitchPill } from '../LanguageSwitchPill';
import { useApp } from '../../state/AppContext';
import { QPayOnboardingProgress } from './QPayOnboardingProgress';
import { QPayOnboardingSlide, type OnboardingSlideData } from './QPayOnboardingSlide';

interface QPayOnboardingProps {
  onComplete: () => void;
}

export const QPayOnboarding: React.FC<QPayOnboardingProps> = ({ onComplete }) => {
  const { isRtl, language } = useApp();
  const isAr = language === 'العربية';
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Touch gesture handling for smooth horizontal swiping
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const triggerHaptic = () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(15);
      }
    } catch {
      // Ignore vibration errors
    }
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      triggerHaptic();
      setCurrentSlide(index);
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      triggerHaptic();
      onComplete();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    const threshold = 45;

    if (diff > threshold && currentSlide < slides.length - 1) {
      handleNext();
    } else if (diff < -threshold && currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (currentSlide < slides.length - 1) goToSlide(currentSlide + 1);
      } else if (e.key === 'ArrowLeft') {
        if (currentSlide > 0) goToSlide(currentSlide - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const slides: OnboardingSlideData[] = [
    {
      id: 'softpos',
      title: isAr ? 'حوّل جوالك إلى نقطة بيع' : 'Turn Phone into SoftPOS',
      subtitle: isAr ? 'قبول مدفوعات البطاقات ومدى فورياً' : 'Accept card payments instantly',
      visual: (
        <div style={{ position: 'relative', width: '360px', height: '360px', maxWidth: '92vw', maxHeight: '44vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 200, 83, 0.28) 0%, transparent 70%)',
              filter: 'blur(35px)',
              pointerEvents: 'none',
            }}
          />
          <img
            src="/onboarding-softpos.jpg"
            alt="SoftPOS NFC Tap"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              display: 'block',
              filter: 'contrast(1.05)',
            }}
          />
        </div>
      ),
    },
    {
      id: 'zatca',
      title: isAr ? 'فوترة متوافقة مع هيئة الزكاة' : 'ZATCA Phase 2 Invoicing',
      subtitle: isAr ? 'إصدار فواتير برمز استجابة ضريبية ١٥٪' : 'Instant 15% VAT QR invoices',
      visual: (
        <div style={{ position: 'relative', width: '360px', height: '360px', maxWidth: '92vw', maxHeight: '44vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 200, 83, 0.28) 0%, transparent 70%)',
              filter: 'blur(35px)',
              pointerEvents: 'none',
            }}
          />
          <img
            src="/onboarding-zatca.jpg"
            alt="ZATCA Phase 2 E-Invoice QR"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              display: 'block',
              filter: 'contrast(1.05)',
            }}
          />
        </div>
      ),
    },
    {
      id: 'soundbox',
      title: isAr ? 'تسويات فورية وجهاز إشعار صوتي' : 'Instant Payouts & SoundBox',
      subtitle: isAr ? 'تسوية لحظية عبر سريع مع تنبيهات صوتية' : 'Real-time payouts with voice alerts',
      visual: (
        <div style={{ position: 'relative', width: '360px', height: '360px', maxWidth: '92vw', maxHeight: '44vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 200, 83, 0.28) 0%, transparent 70%)',
              filter: 'blur(35px)',
              pointerEvents: 'none',
            }}
          />
          <img
            src="/onboarding-soundbox.jpg"
            alt="Instant Sarie Payouts & SoundBox"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              display: 'block',
              filter: 'contrast(1.05)',
            }}
          />
        </div>
      ),
    },
  ];

  const isFinalSlide = currentSlide === slides.length - 1;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#080C14',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 24px 28px 24px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Top Bar: Brand & Language Switch / Skip Pill */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: '4px',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlphPayLogo variant="horizontal" size={24} themeMode="dark" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LanguageSwitchPill variant="compact" />
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              onComplete();
            }}
            className="interactive-tap"
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              color: '#94A3B8',
              fontSize: '12px',
              fontWeight: 700,
              padding: '5px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {isAr ? 'تخطي' : 'Skip'}
          </button>
        </div>
      </header>

      {/* Main Slide Carousel Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
          margin: '10px 0',
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              position: index === currentSlide ? 'relative' : 'absolute',
              inset: 0,
              width: '100%',
              display: index === currentSlide ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <QPayOnboardingSlide slide={slide} isActive={index === currentSlide} />
          </div>
        ))}
      </main>

      {/* Bottom Controls: Pagination + Pill Button */}
      <footer
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
          zIndex: 10,
        }}
      >
        {/* Pagination Dots */}
        <QPayOnboardingProgress
          total={slides.length}
          activeIndex={currentSlide}
          onSelectDot={goToSlide}
        />

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleNext}
          className="interactive-tap"
          style={{
            width: '100%',
            maxWidth: '320px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#00C853',
            color: '#080C14',
            border: 'none',
            fontSize: '14px',
            fontWeight: 800,
            letterSpacing: '0.01em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <span>{isFinalSlide ? (isAr ? 'ابدأ الآن' : 'Get started') : (isAr ? 'التالي' : 'Next')}</span>
          {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </button>
      </footer>
    </div>
  );
};
