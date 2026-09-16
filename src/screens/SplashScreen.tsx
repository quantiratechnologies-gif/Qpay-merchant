import React, { useEffect } from 'react';
import { AlphPayLogo } from '../components/AlphPayLogo';
import { QuantiraLogo } from '../components/QuantiraLogo';
import { useApp } from '../state/AppContext';

export const SplashScreen: React.FC = () => {
  const { navigateTo } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('ONBOARDING');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#080C14',
        backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(0, 200, 83, 0.12) 0%, rgba(8, 12, 20, 0.98) 70%)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 24px 44px 24px',
        boxSizing: 'border-box',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Spacer */}
      <div style={{ height: '30px' }} />

      {/* Central App Brand Logo with Ambient Aura */}
      <div
        className="fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 200, 83, 0.18)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <AlphPayLogo variant="horizontal" size={48} themeMode="dark" />
        <div
          style={{
            marginTop: '14px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: '#00C853',
            textTransform: 'uppercase',
          }}
        >
          QUICK | TRUSTED | PAYMENTS
        </div>
      </div>

      {/* Bottom Center: Powered by Quantira Technologies */}
      <div
        className="fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#71717A',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          powered by
        </span>
        <QuantiraLogo size={24} color="#00C853" textColor="#FFFFFF" />
      </div>
    </div>
  );
};
