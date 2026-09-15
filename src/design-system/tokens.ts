/**
 * alph pay — Official Mobile App Design System Tokens
 * Primary: Vibrant Lime Green (#7FE87F)
 * UI Base: Deep Navy Charcoal (#1A1A2E) & Dark Card Surfaces (#2A2A3E)
 * Secondary: Pure Black (#000000) & Pure White (#FFFFFF)
 * Typography: Inter / SF Pro / Google Sans Flex Scale
 * Border Radius: 8px (Buttons/Inputs), 12px (Cards), 16px (Modals), 24px (Hero)
 * Contrast: High contrast WCAG AA compliant (black text on green CTAs, white text on dark cards)
 */

export const colors = {
  // 1. Primary Color — Vibrant Lime Green & Tiers
  primary: '#7FE87F',
  primaryHover: '#5FBF5F',
  primaryActive: '#3F963F',
  primaryLight: 'rgba(127, 232, 127, 0.12)',
  primaryLightHover: 'rgba(127, 232, 127, 0.2)',
  primaryBorder: '#7FE87F',
  primaryDark: '#1F6D1F',
  textOnPrimary: '#000000', // Black text on Lime Green for maximum readability

  // 2. Secondary Color — Pure Black & Grays
  secondary: '#000000',
  secondaryHover: '#2A2A2A',
  gray25: '#333333',
  gray50: '#666666',
  gray75: '#999999',
  gray90: '#CCCCCC',

  // 3. Accent Dark — Ultra Deep Pitch Navy Charcoal UI Surfaces
  darkBg: '#0B0B14',
  darkSurface: '#151524',
  darkSurfaceElevated: '#1E1E32',
  darkBorder: '#2C2C44',
  darkDisabled: '#2C2C44',
  darkPlaceholder: '#9E9EB2',

  // 4. Neutral — Pure White & Light Surfaces
  lightBg: '#FFFFFF',
  lightSurface: '#F5F5F7',
  lightSurfaceElevated: '#FFFFFF',
  lightBorder: '#E6E6E6',

  // Active App Surfaces (alph pay Signature Pitch Dark Experience)
  surface: '#151524',
  surfaceElevated: '#1E1E32',
  background: '#0B0B14',
  subSurface: '#1E1E32',
  surfaceHover: '#222238',
  inputFill: '#0F0F1D',
  overlay: 'rgba(5, 5, 10, 0.85)',

  // Typography Tiers
  textPrimary: '#FFFFFF',
  textSecondary: '#A2A2BA',
  textMuted: '#6E6E85',
  textDisabled: '#6E6E85',

  // Borders & Dividers
  borderHairline: '#2C2C44',
  borderStrong: '#4A4A68',
  borderFocus: '#7FE87F',

  // Semantic & Feedback Colors
  success: '#7FE87F',
  successLight: 'rgba(127, 232, 127, 0.12)',
  successText: '#7FE87F',

  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.12)',
  warningText: '#F59E0B',

  danger: '#FF4757',
  dangerLight: 'rgba(255, 71, 87, 0.12)',
  dangerText: '#FF6B7A',

  info: '#7FE87F',
  infoLight: 'rgba(127, 232, 127, 0.12)',
  infoText: '#000000',
} as const;

export const typography = {
  fontFamily: "'Inter', 'SF Pro Display', 'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  sizes: {
    display: { fontSize: '32px', lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.5px' },
    titleLarge: { fontSize: '24px', lineHeight: '32px', fontWeight: 600, letterSpacing: '-0.3px' },
    titleMedium: { fontSize: '20px', lineHeight: '28px', fontWeight: 600, letterSpacing: '0px' },
    titleSmall: { fontSize: '16px', lineHeight: '24px', fontWeight: 500, letterSpacing: '0px' },
    bodyLarge: { fontSize: '16px', lineHeight: '24px', fontWeight: 400, letterSpacing: '0px' },
    bodyRegular: { fontSize: '14px', lineHeight: '20px', fontWeight: 400, letterSpacing: '0px' },
    caption: { fontSize: '12px', lineHeight: '16px', fontWeight: 400, letterSpacing: '0.2px' },
    micro: { fontSize: '10px', lineHeight: '14px', fontWeight: 500, letterSpacing: '0.5px' },
  },
} as const;

export const radii = {
  none: '0px',
  xs: '4px',
  sm: '8px',   // Buttons, inputs, small chips
  md: '12px',  // Cards, list items
  lg: '16px',  // Balance cards, modals
  xl: '24px',  // Hero banners, large surfaces
  full: '999px',
} as const;

// STRICT 0 DROP SHADOWS GLOBALLY
export const shadows = {
  none: 'none',
  flat: 'none',
  sm: 'none',
  md: 'none',
  lg: 'none',
  xl: 'none',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

export const focus = {
  ring: '2.5px solid #7FE87F',
  offset: '2px',
  outline: 'none',
} as const;

export const componentPresets = {
  card: {
    backgroundColor: colors.darkSurface,
    border: `1px solid ${colors.darkBorder}`,
    borderRadius: radii.md,
    boxShadow: 'none',
  },
  header: {
    backgroundColor: colors.darkBg,
    borderBottom: `1px solid ${colors.darkBorder}`,
    boxShadow: 'none',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    color: colors.textOnPrimary,
    borderRadius: radii.sm,
    fontWeight: typography.weights.bold,
    border: 'none',
    boxShadow: 'none',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: colors.primary,
    borderRadius: radii.sm,
    fontWeight: typography.weights.semibold,
    border: `1.5px solid ${colors.primary}`,
    boxShadow: 'none',
  },
  input: {
    backgroundColor: colors.darkBg,
    border: `1px solid ${colors.darkBorder}`,
    borderRadius: radii.sm,
    color: colors.textPrimary,
    boxShadow: 'none',
  },
} as const;

export const designSystem = {
  colors,
  typography,
  radii,
  shadows,
  spacing,
  focus,
  componentPresets,
};

