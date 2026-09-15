import React from 'react';

export interface OnboardingSlideData {
  id: string;
  category?: string;
  title: string;
  subtitle: string;
  visual: React.ReactNode;
}

interface QPayOnboardingSlideProps {
  slide: OnboardingSlideData;
  isActive: boolean;
}

export const QPayOnboardingSlide: React.FC<QPayOnboardingSlideProps> = ({
  slide,
  isActive,
}) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'scale(1) translateY(0px)' : 'scale(0.96) translateY(8px)',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      {/* 3D Visual Centerpiece */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '10px 0',
          minHeight: '260px',
        }}
      >
        {slide.visual}
      </div>

      {/* Clean Minimalist Typography Matching Reference */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 24px',
          boxSizing: 'border-box',
          marginTop: '16px',
        }}
      >
        {/* Bold Headline */}
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.25,
            marginBottom: '10px',
            letterSpacing: '-0.02em',
          }}
        >
          {slide.title}
        </h1>

        {/* Short, Readable Subtitle */}
        <p
          style={{
            fontSize: '13.5px',
            fontWeight: 500,
            color: '#A2A2BA',
            lineHeight: 1.5,
            maxWidth: '320px',
            margin: 0,
          }}
        >
          {slide.subtitle}
        </p>
      </div>
    </div>
  );
};
