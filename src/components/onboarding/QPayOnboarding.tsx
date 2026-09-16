import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Smartphone, QrCode, Radio } from 'lucide-react';
import { AlphPayLogo } from '../AlphPayLogo';
import { QPayOnboardingProgress } from './QPayOnboardingProgress';
import { QPayOnboardingSlide, type OnboardingSlideData } from './QPayOnboardingSlide';

interface QPayOnboardingProps {
  onComplete: () => void;
}

export const QPayOnboarding: React.FC<QPayOnboardingProps> = ({ onComplete }) => {
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
      title: 'Turn Phone into SoftPOS',
      subtitle: 'Accept mada, Apple Pay, Visa, and Mastercard contactless cards directly on your phone with zero POS hardware required.',
      visual: (
        <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(127, 232, 127, 0.15) 0%, transparent 70%)' }} />
          <div style={{ width: '150px', height: '180px', borderRadius: '24px', backgroundColor: '#111726', border: '1.5px solid #1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', boxSizing: 'border-box' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(127, 232, 127, 0.12)', border: '1px solid rgba(127, 232, 127, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7FE87F' }}>
              <Smartphone size={24} />
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#7FE87F', backgroundColor: 'rgba(127, 232, 127, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>🇸🇦 mada</span>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '2px 8px', borderRadius: '6px' }}> Pay</span>
            </div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8' }}>Tap & Pay NFC</div>
          </div>
        </div>
      ),
    },
    {
      id: 'zatca',
      title: 'ZATCA Phase 2 Invoicing',
      subtitle: 'Generate cryptographic QR tax invoices instantly with automated 15% VAT calculation and audit-ready compliance.',
      visual: (
        <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(235, 180, 50, 0.15) 0%, transparent 70%)' }} />
          <div style={{ width: '150px', height: '180px', borderRadius: '24px', backgroundColor: '#111726', border: '1.5px solid #1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', boxSizing: 'border-box' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(235, 180, 50, 0.12)', border: '1px solid rgba(235, 180, 50, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EBB432' }}>
              <QrCode size={24} />
            </div>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#EBB432', backgroundColor: 'rgba(235, 180, 50, 0.12)', padding: '3px 8px', borderRadius: '6px' }}>
              ZATCA Fatoora
            </span>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8' }}>15% VAT Auto-Calculated</div>
          </div>
        </div>
      ),
    },
    {
      id: 'soundbox',
      title: 'Instant Payouts & SoundBox',
      subtitle: 'Enjoy real-time voice payment announcements and automated daily settlements directly to your Saudi corporate IBAN.',
      visual: (
        <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(127, 232, 127, 0.15) 0%, transparent 70%)' }} />
          <div style={{ width: '150px', height: '180px', borderRadius: '24px', backgroundColor: '#111726', border: '1.5px solid #1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', boxSizing: 'border-box' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(127, 232, 127, 0.12)', border: '1px solid rgba(127, 232, 127, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7FE87F' }}>
              <Radio size={24} />
            </div>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#7FE87F', backgroundColor: 'rgba(127, 232, 127, 0.12)', padding: '3px 8px', borderRadius: '6px' }}>
              Voice Alert 5G
            </span>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8' }}>Sarie Daily Payouts</div>
          </div>
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
      }}
    >
      {/* Top Bar: Brand / Time & Skip Pill */}
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
          Skip
        </button>
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
            backgroundColor: '#7FE87F',
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
          <span>{isFinalSlide ? 'Get started' : 'Next'}</span>
          <ArrowRight size={16} />
        </button>
      </footer>
    </div>
  );
};
