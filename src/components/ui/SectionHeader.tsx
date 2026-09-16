import React from 'react';

export interface SectionHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  badge?: React.ReactNode;
  actionButton?: React.ReactNode | {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  actionButton,
  icon,
  className = '',
  style,
}) => {
  return (
    <div
      className={`section-header ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3, 12px)',
        marginBottom: 'var(--space-3, 12px)',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2, 8px)',
          flex: 1,
          minWidth: 0,
        }}
      >
        {icon && (
          <div
            style={{
              color: 'var(--accent-green, #00C853)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2, 8px)',
              flexWrap: 'wrap',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--text-primary, #FFFFFF)',
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </h3>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary, #94A3B8)',
                marginTop: '2px',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {actionButton && (
        <div style={{ flexShrink: 0 }}>
          {React.isValidElement(actionButton) ? (
            actionButton
          ) : typeof actionButton === 'object' && 'label' in actionButton && 'onClick' in actionButton ? (
            <button
              type="button"
              onClick={actionButton.onClick}
              className="interactive-tap"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-green-bright, #00C853)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {actionButton.label}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
