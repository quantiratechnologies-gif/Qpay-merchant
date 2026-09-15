import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { AlphPayLogo } from '../AlphPayLogo';
import { QPayOnboardingProgress } from './QPayOnboardingProgress';
import { QPayOnboardingSlide, type OnboardingSlideData } from './QPayOnboardingSlide';
import { CardsIllustration } from './CardsIllustration';
import { HubIllustration } from './HubIllustration';
import { SecurityIllustration } from './SecurityIllustration';

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
      id: 'cards',
      title: 'Diverse Card Options',
      subtitle: 'Explore a variety of payment cards tailored to your daily needs. Pay instantly with bank-grade security.',
      visual: <CardsIllustration />,
    },
    {
      id: 'wealth',
      title: 'Grow Your Wealth',
      subtitle: 'Discover a smarter way to manage your finances. Link and control all Saudi bank accounts in one unified dashboard.',
      visual: <HubIllustration />,
    },
    {
      id: 'security',
      title: 'Secure & Reliable',
      subtitle: 'Your security is our top priority. Protected by SAMA 256-bit encryption and Sarie national payment rail.',
      visual: <SecurityIllustration />,
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
        backgroundColor: '#0B0B14',
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
            backgroundColor: '#1E1E32',
            border: '1px solid #2C2C44',
            color: '#A2A2BA',
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
            color: '#0B0B14',
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
