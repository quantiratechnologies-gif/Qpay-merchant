import React, { useState, useEffect } from 'react';
import { Delete } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { toArabicNumerals } from '../utils/i18n';

interface PinPadProps {
  length?: number;
  onComplete: (pin: string) => void;
  error?: string;
}

export const PinPad: React.FC<PinPadProps> = ({ length = 4, onComplete, error }) => {
  const { language } = useApp();
  const [pin, setPin] = useState<string>('');

  const handleKeyPress = (num: string) => {
    if (pin.length < length) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === length) {
        setTimeout(() => {
          onComplete(nextPin);
          setPin('');
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, length]);

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* PIN Dots Display */}
      <div
        role="group"
        aria-label={`PIN input, ${pin.length} of ${length} digits entered`}
        style={{ display: 'flex', gap: '20px', margin: '20px 0 28px 0', alignItems: 'center', direction: 'ltr' }}
      >
        {Array.from({ length }).map((_, index) => {
          const isFilled = index < pin.length;
          return (
            <div
              key={index}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: isFilled ? '#00C853' : '#1A1A2E',
                border: isFilled ? '2px solid #00C853' : '2px solid #4D4D6B',
                transform: isFilled ? 'scale(1.15)' : 'scale(1)',
                boxShadow: isFilled ? '0 0 10px rgba(0, 200, 83, 0.4)' : 'none',
                transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          );
        })}
      </div>

      {error && (
        <div role="alert" style={{ color: '#FF4757', fontSize: '13px', marginBottom: '20px', fontWeight: 700 }}>
          {error}
        </div>
      )}

      {/* Numeric Keypad Grid */}
      <div
        role="group"
        aria-label="Numeric PIN keypad"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          width: '100%',
          maxWidth: '300px',
          direction: 'ltr',
        }}
      >
        {keys.map((key, i) => {
          if (key === '') return <div key={i} />;

          if (key === 'delete') {
            return (
              <button
                key={i}
                onClick={handleDelete}
                aria-label="Backspace"
                className="interactive-tap"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '56px',
                  backgroundColor: '#2A2A3E',
                  border: '1px solid #4D4D6B',
                  borderRadius: '12px',
                  color: '#B3B3C2',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transition: 'background-color 0.12s ease',
                }}
              >
                <Delete size={22} />
              </button>
            );
          }

          const displayDigit = language === 'العربية' ? toArabicNumerals(key) : key;

          return (
            <button
              key={i}
              onClick={() => handleKeyPress(key)}
              aria-label={`Digit ${key}`}
              className="interactive-tap"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '56px',
                backgroundColor: '#2A2A3E',
                border: '1px solid #4D4D6B',
                borderRadius: '12px',
                fontSize: '22px',
                fontWeight: 800,
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: 'none',
                transition: 'background-color 0.12s ease, transform 0.08s ease',
              }}
            >
              {displayDigit}
            </button>
          );
        })}
      </div>
    </div>
  );
};
