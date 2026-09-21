import React from 'react';

interface QPayOnboardingProgressProps {
  total: number;
  activeIndex: number;
  onSelectDot?: (index: number) => void;
}

export const QPayOnboardingProgress: React.FC<QPayOnboardingProgressProps> = ({
  total,
  activeIndex,
  onSelectDot,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '8px 0',
      }}
      aria-label={`Slide ${activeIndex + 1} of ${total}`}
    >
      {Array.from({ length: total }).map((_, index) => {
        const isActive = activeIndex === index;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelectDot?.(index)}
            aria-label={`Go to slide ${index + 1}`}
            style={{
              width: isActive ? '32px' : '8px',
              height: '7px',
              borderRadius: '6px',
              backgroundColor: isActive ? '#00C853' : 'rgba(255, 255, 255, 0.2)',
              boxShadow: isActive ? '0 0 10px rgba(0, 200, 83, 0.6)' : 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              outline: 'none',
            }}
          />
        );
      })}
    </div>
  );
};
