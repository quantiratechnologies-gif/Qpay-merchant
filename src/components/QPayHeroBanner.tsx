import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../state/AppContext';

export const QPayHeroBanner: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div
      onClick={() => navigateTo('PAY_ANYONE')}
      role="banner"
      aria-label="Send money instantly with zero fees"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigateTo('PAY_ANYONE');
        }
      }}
      className="interactive-tap"
      style={{
        margin: '14px 20px 0 20px',
        backgroundColor: '#151524',
        border: '1px solid #2C2C44',
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        boxShadow: 'none',
      }}
    >
      <div style={{ flex: 1, zIndex: 2, paddingRight: '12px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(127, 232, 127, 0.12)',
            border: '1px solid rgba(127, 232, 127, 0.25)',
            color: '#7FE87F',
            fontSize: '11px',
            fontWeight: 800,
            padding: '3px 9px',
            borderRadius: '20px',
            marginBottom: '10px',
            letterSpacing: '0.03em',
          }}
        >
          <ShieldCheck size={13} color="#7FE87F" />
          <span>Zero Fees</span>
        </div>

        <h3
          style={{
            fontSize: '17px',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 4px 0',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}
        >
          Instant Sarie Transfers
        </h3>

        <p
          style={{
            fontSize: '12px',
            color: '#A2A2BA',
            margin: '0 0 14px 0',
            lineHeight: 1.4,
          }}
        >
          Direct Saudi bank-to-bank settlements.
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigateTo('PAY_ANYONE');
          }}
          style={{
            backgroundColor: '#7FE87F',
            color: '#000000',
            border: 'none',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '12.5px',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: 'none',
          }}
        >
          <span>Send Money</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          backgroundColor: '#1E1E32',
          border: '1px solid #2C2C44',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#7FE87F',
          flexShrink: 0,
          zIndex: 2,
          boxShadow: 'none',
        }}
      >
        <span style={{ fontSize: '18px', fontWeight: 900, color: '#7FE87F' }}>SAR</span>
      </div>
    </div>
  );
};

export default QPayHeroBanner;
