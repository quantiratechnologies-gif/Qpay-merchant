import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { designSystem } from '../design-system';

interface QRCodeViewProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  size = 200,
  fgColor = designSystem.colors.textPrimary,
  bgColor = designSystem.colors.surface,
}) => {
  return (
    <div
      style={{
        backgroundColor: designSystem.colors.surface,
        padding: '16px',
        borderRadius: designSystem.radii.md,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: designSystem.shadows.none,
        border: `3px solid ${designSystem.colors.primary}`,
      }}
    >
      <QRCodeSVG
        value={value}
        size={size}
        fgColor={fgColor}
        bgColor={bgColor}
        level="H"
        includeMargin={false}
      />
    </div>
  );
};
