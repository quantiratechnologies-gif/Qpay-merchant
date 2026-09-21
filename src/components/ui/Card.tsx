import React from 'react';

export type CardVariant = 'elevated' | 'inset' | 'interactive';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  ariaLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  children,
  className = '',
  style,
  onClick,
  ariaLabel,
  ...props
}) => {
  const isClickable = variant === 'interactive' || Boolean(onClick);

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'inset':
        return {
          backgroundColor: 'var(--bg-inset, #161F30)',
          border: '1px solid var(--border, #1E293B)',
          borderRadius: 'var(--radius-md, 12px)',
        };
      case 'interactive':
        return {
          backgroundColor: 'var(--bg-card, #111726)',
          border: '1px solid var(--border, #1E293B)',
          borderRadius: 'var(--radius-lg, 16px)',
          cursor: 'pointer',
        };
      case 'elevated':
      default:
        return {
          backgroundColor: 'var(--bg-card, #111726)',
          border: '1px solid var(--border, #1E293B)',
          borderRadius: 'var(--radius-lg, 16px)',
        };
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isClickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
    props.onKeyDown?.(e);
  };

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`card-primitive ${isClickable ? 'interactive-tap' : ''} ${className}`}
      style={{
        boxSizing: 'border-box',
        padding: 'var(--space-4, 16px)',
        color: 'var(--text-primary, #FFFFFF)',
        transition: isClickable
          ? 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.15s ease, background-color 0.15s ease'
          : undefined,
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
