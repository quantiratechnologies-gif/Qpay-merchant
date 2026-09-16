import React from 'react';

export interface SamaLogoProps {
  size?: number;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  themeMode?: 'dark' | 'light' | 'green' | 'gold' | 'original';
  color?: string;
}

export const SamaLogo: React.FC<SamaLogoProps> = () => {
  return null;
};
