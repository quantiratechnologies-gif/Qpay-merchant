import React from 'react';

interface QuantiraLogoProps {
  size?: number;
  showText?: boolean;
  color?: string;
  textColor?: string;
}

export const QuantiraLogo: React.FC<QuantiraLogoProps> = ({
  size = 20,
  showText = true,
  color = '#7FE87F',
  textColor = '#A2A2BA',
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        userSelect: 'none',
      }}
    >
      {/* Quantira Q Loop Vector Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 841.9 841.9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', flexShrink: 0 }}
      >
        <g fill={color}>
          <path d="M414.9,385.6l106.6,106.8c43-67.8,30.4-155.5-28.2-209.1-53.9-49.3-134.2-57.2-196.4-18.8l48.6,48.6-39.8,39.8-157.9-157.9,28.7-28.6,11.3-10.5c26.3,26.1,66.7,35.8,102.1,21.9,53.9-21,113.1-24.1,168.3-5.8,71.9,23.8,129.4,79.7,154.7,151.1,21.2,59.7,18.3,125.7-8.2,183.2-12.9,28.9-7.1,62.6,15.7,85.4l-38.5,38.5-206-206,38.5-38.5h.3Z" />
          <path d="M450.3,554.1l59.3,59.3c-100.4,61.2-230.2,41.8-308.2-45.2-72.6-79.4-83.8-198.9-27.8-290.8l59.3,59.2c-27.2,61.3-14.9,133.1,30.9,180.9,47.7,50,122.5,64.7,186.5,36.4h0Z" />
        </g>
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: textColor,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
            }}
          >
            Quantira Technologies
          </span>
        </div>
      )}
    </div>
  );
};
