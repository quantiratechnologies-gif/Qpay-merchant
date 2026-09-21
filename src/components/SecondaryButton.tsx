import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
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
        backgroundColor: 'transparent',
        color: disabled ? '#64748B' : '#00C853',
        border: disabled ? '1.5px solid #1E293B' : '1.5px solid #1E293B',
        borderRadius: '14px',
        padding: '13px 20px',
        fontSize: '15px',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: 'none',
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
