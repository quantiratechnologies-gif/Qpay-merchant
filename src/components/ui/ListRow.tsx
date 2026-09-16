import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface ListRowProps {
  leftIcon?: React.ReactNode;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  rightAmount?: string | React.ReactNode;
  rightBadge?: React.ReactNode;
  rightElement?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  showChevron?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ListRow: React.FC<ListRowProps> = ({
  leftIcon,
  title,
  subtitle,
  rightAmount,
  rightBadge,
  rightElement,
  onClick,
  danger = false,
  showChevron,
  className = '',
  style,
}) => {
  const isInteractive = Boolean(onClick);
  const shouldShowChevron = showChevron ?? (isInteractive && !rightElement && !rightAmount && !rightBadge);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`list-row ${isInteractive ? 'interactive-tap' : ''} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        backgroundColor: 'var(--bg-card, #111726)',
        border: `1px solid ${danger ? 'rgba(255, 71, 87, 0.4)' : 'var(--border, #1E293B)'}`,
        borderRadius: 'var(--radius-md, 12px)',
        marginBottom: 'var(--space-2, 8px)',
        cursor: isInteractive ? 'pointer' : 'default',
        transition: 'border-color 0.15s ease, background-color 0.15s ease, transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3, 12px)',
          minWidth: 0,
          flex: 1,
        }}
      >
        {leftIcon && (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm, 8px)',
              backgroundColor: danger ? 'rgba(255, 71, 87, 0.12)' : 'var(--bg-inset, #161F30)',
              color: danger ? '#FF4757' : 'var(--accent-green, #00C853)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${danger ? 'rgba(255, 71, 87, 0.3)' : 'var(--border, #1E293B)'}`,
              flexShrink: 0,
            }}
          >
            {leftIcon}
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: '14.5px',
              fontWeight: 600,
              color: danger ? '#FF6B7A' : 'var(--text-primary, #FFFFFF)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary, #94A3B8)',
                marginTop: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2, 8px)',
          flexShrink: 0,
          marginLeft: 'var(--space-2, 8px)',
        }}
      >
        {rightAmount && (
          <div
            className="tabular-nums"
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--text-primary, #FFFFFF)',
              textAlign: 'right',
            }}
          >
            {rightAmount}
          </div>
        )}

        {rightBadge && <div>{rightBadge}</div>}

        {rightElement && <div>{rightElement}</div>}

        {shouldShowChevron && (
          <ChevronRight
            size={18}
            color="var(--text-muted, #64748B)"
            style={{ display: 'block' }}
          />
        )}
      </div>
    </div>
  );
};

export default ListRow;
