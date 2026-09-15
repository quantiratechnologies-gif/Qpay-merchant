import React from 'react';

interface ServiceCardProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: string;
  bgColor?: string;
  iconBg?: string;
  iconColor?: string;
  borderColor?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  label,
  icon,
  onClick,
  badge,
  iconBg = '#1E1E32',
  iconColor = '#7FE87F',
  borderColor = '#2C2C44',
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-label={label}
      className="interactive-tap"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: '-6px',
            right: '2px',
            fontSize: '9px',
            fontWeight: 800,
            backgroundColor: '#7FE87F',
            color: '#000000',
            padding: '2px 6px',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            zIndex: 2,
          }}
        >
          {badge}
        </span>
      )}
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          backgroundColor: iconBg,
          border: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor,
          boxShadow: 'none',
          transition: 'all 0.15s ease',
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: '11.5px',
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: '14px',
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </span>
    </div>
  );
};
