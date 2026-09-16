import React from 'react';
import { Card } from './Card';

export interface MetricTileProps {
  title: string | React.ReactNode;
  value: string | number | React.ReactNode;
  subtitle?: string | React.ReactNode;
  highlightGreen?: boolean;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const MetricTile: React.FC<MetricTileProps> = ({
  title,
  value,
  subtitle,
  highlightGreen = false,
  icon,
  trend,
  onClick,
  className = '',
  style,
}) => {
  return (
    <Card
      variant={onClick ? 'interactive' : 'elevated'}
      onClick={onClick}
      className={`metric-tile ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2, 8px)',
        padding: 'var(--space-4, 16px)',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-2, 8px)',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-secondary, #94A3B8)',
            letterSpacing: '0.01em',
          }}
        >
          {title}
        </div>
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
      </div>

      <div
        className="tabular-nums"
        style={{
          fontSize: '24px',
          fontWeight: 800,
          color: highlightGreen
            ? 'var(--accent-green-bright, #7FE87F)'
            : 'var(--text-primary, #FFFFFF)',
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>

      {(subtitle || trend) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2, 8px)',
            fontSize: '12px',
            color: 'var(--text-muted, #64748B)',
            marginTop: '2px',
          }}
        >
          {trend && (
            <span
              style={{
                fontWeight: 700,
                color: trend.isPositive !== false
                  ? 'var(--accent-green, #00C853)'
                  : 'var(--accent-amber, #F59E0B)',
              }}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};

export default MetricTile;
