/**
 * QtPay Centralized Design System Tokens
 * Enforces MobiKwik Fintech Aesthetic:
 * - Electric Blue (#2e83ff) Primary Color
 * - Google Sans Flex Typography Scale
 * - 0 Drop Shadows (Flat Modern Aesthetics)
 * - 50% Reduced Corner Radius Scale (8px container base)
 * - WCAG 2.1 AA 4.5:1 Minimum Contrast
 */

export const colors = {
  // Brand & Accent Colors
  primary: '#2e83ff',
  primaryHover: '#1a6ee8',
  primaryActive: '#0f5cd1',
  primaryLight: '#eef5ff',
  primaryBorder: '#d6e6ff',
  primaryDark: '#004fc4',

  // Surfaces & Backgrounds
  surface: '#ffffff',
  background: '#f8fafc',
  subSurface: '#f1f5f9',
  surfaceHover: '#f8fafc',
  inputFill: '#f8fafc',
  overlay: 'rgba(15, 23, 42, 0.55)',

  // Text & Typography Tiers
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  textDisabled: '#94a3b8',
  textOnPrimary: '#ffffff',

  // Borders & Hairlines
  borderHairline: '#e2e8f0',
  borderStrong: '#cbd5e1',
  borderFocus: '#2e83ff',

  // Semantic Feedback Colors
  success: '#10b981',
  successLight: '#d1fae5',
  successText: '#065f46',

  warning: '#f59e0b',
  warningLight: '#fef3c7',
  warningText: '#92400e',

  danger: '#ef4444',
  dangerLight: '#fee2e2',
  dangerText: '#991b1b',

  info: '#3b82f6',
  infoLight: '#dbeafe',
  infoText: '#1e40af',
} as const;

export const typography = {
  fontFamily: "'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  sizes: {
    display: { fontSize: '32px', lineHeight: '40px', fontWeight: 800 },
    titleLarge: { fontSize: '20px', lineHeight: '28px', fontWeight: 800 },
    titleMedium: { fontSize: '17px', lineHeight: '24px', fontWeight: 700 },
    titleSmall: { fontSize: '15px', lineHeight: '22px', fontWeight: 700 },
    bodyLarge: { fontSize: '15px', lineHeight: '22px', fontWeight: 500 },
    bodyRegular: { fontSize: '14px', lineHeight: '20px', fontWeight: 400 },
    caption: { fontSize: '12px', lineHeight: '16px', fontWeight: 600 },
    micro: { fontSize: '10px', lineHeight: '14px', fontWeight: 700 },
  },
} as const;

export const radii = {
  none: '0px',
  xs: '4px',
  sm: '6px',
  md: '8px',   // Standard container card & primary button radius (50% reduction)
  lg: '12px',  // Modal / Bottom Sheet container radius
  xl: '16px',
  full: '9999px',
} as const;

export const shadows = {
  none: 'none !important',
  flat: 'none',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
} as const;

export const focus = {
  ring: '2.5px solid #2e83ff',
  offset: '2px',
  outline: 'none',
} as const;

export const componentPresets = {
  card: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.borderHairline}`,
    borderRadius: radii.md,
    boxShadow: shadows.flat,
  },
  header: {
    backgroundColor: colors.surface,
    borderBottom: `1px solid ${colors.borderHairline}`,
    boxShadow: shadows.flat,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    color: colors.textOnPrimary,
    borderRadius: radii.md,
    fontWeight: typography.weights.bold,
    border: 'none',
    boxShadow: shadows.flat,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    color: colors.primary,
    borderRadius: radii.md,
    fontWeight: typography.weights.bold,
    border: `1.5px solid ${colors.primary}`,
    boxShadow: shadows.flat,
  },
  input: {
    backgroundColor: colors.inputFill,
    border: `1px solid ${colors.borderHairline}`,
    borderRadius: radii.md,
    color: colors.textPrimary,
    boxShadow: shadows.flat,
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
