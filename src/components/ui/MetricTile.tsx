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
          gap: '4px',
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-secondary, #94A3B8)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
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
          fontSize: '16px',
          fontWeight: 800,
          color: highlightGreen
            ? 'var(--accent-green-bright, #00C853)'
            : 'var(--text-primary, #FFFFFF)',
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </div>

      {(subtitle || trend) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            color: 'var(--text-muted, #64748B)',
            marginTop: '1px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
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
