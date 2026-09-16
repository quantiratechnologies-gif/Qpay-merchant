import React from 'react';

export type BadgeStatus = 'success' | 'info' | 'purple' | 'warning' | 'neutral';

export interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string | React.ReactNode;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  children,
  size = 'md',
  dot = false,
  className = '',
  style,
}) => {
  const content = label ?? children;

  const getStatusStyles = (): { bg: string; color: string; border: string; dotColor: string } => {
    switch (status) {
      case 'success':
        return {
          bg: 'rgba(0, 200, 83, 0.12)',
          color: 'var(--accent-green, #00C853)',
          border: 'rgba(0, 200, 83, 0.25)',
          dotColor: 'var(--accent-green, #00C853)',
        };
      case 'info':
        return {
          bg: 'rgba(56, 189, 248, 0.12)',
          color: 'var(--accent-blue, #38BDF8)',
          border: 'rgba(56, 189, 248, 0.25)',
          dotColor: 'var(--accent-blue, #38BDF8)',
        };
      case 'purple':
        return {
          bg: 'rgba(168, 85, 247, 0.12)',
          color: 'var(--accent-purple, #A855F7)',
          border: 'rgba(168, 85, 247, 0.25)',
          dotColor: 'var(--accent-purple, #A855F7)',
        };
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.12)',
          color: 'var(--accent-amber, #F59E0B)',
          border: 'rgba(245, 158, 11, 0.25)',
          dotColor: 'var(--accent-amber, #F59E0B)',
        };
      case 'neutral':
      default:
        return {
          bg: 'rgba(148, 163, 184, 0.12)',
          color: 'var(--text-secondary, #94A3B8)',
          border: 'rgba(148, 163, 184, 0.25)',
          dotColor: 'var(--text-secondary, #94A3B8)',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '2px 8px',
          fontSize: '11px',
        };
      case 'lg':
        return {
          padding: '6px 14px',
          fontSize: '13px',
        };
      case 'md':
      default:
        return {
          padding: '4px 10px',
          fontSize: '12px',
        };
    }
  };

  const statusStyle = getStatusStyles();
  const sizeStyle = getSizeStyles();

  return (
    <span
      className={`status-badge status-badge-${status} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontWeight: 600,
        borderRadius: 'var(--radius-full, 9999px)',
        backgroundColor: statusStyle.bg,
        color: statusStyle.color,
        border: `1px solid ${statusStyle.border}`,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...sizeStyle,
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: size === 'sm' ? '5px' : '6px',
            height: size === 'sm' ? '5px' : '6px',
            borderRadius: '50%',
            backgroundColor: statusStyle.dotColor,
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
      )}
      {content}
    </span>
  );
};

export default StatusBadge;
