import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  fullWidth = true,
  className = '',
  disabled,
  style,
  ...props
}) => {
  return (
    <button
      className={`interactive-tap ${className}`}
      style={{
        width: fullWidth ? '100%' : 'auto',
        backgroundColor: disabled ? '#1E293B' : '#00C853',
        color: disabled ? '#64748B' : '#080C14',
        border: 'none',
        borderRadius: '14px',
        padding: '14px 20px',
        fontSize: '15px',
        fontWeight: 800,
        letterSpacing: '-0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 4px 20px rgba(0, 200, 83, 0.35)',
        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        userSelect: 'none',
        ...style,
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
