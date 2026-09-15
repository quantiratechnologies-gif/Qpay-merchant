# QTPay Classic Design System & Style Guide (Archived Theme)

> **Theme Identifier**: `qtpay`  
> **Brand Name**: QTPay  
> **Primary Accent**: Electric Blue (`#2e83ff`)  
> **Aesthetic**: Flat High-Contrast Fintech, 0 Drop Shadows, 8px/12px Corner Radii  
> **Primary Font**: Google Sans Flex  

---

## 1. Brand Tokens & Colors

```typescript
export const colors = {
  primary: '#2e83ff',
  primaryHover: '#1a6ee8',
  primaryActive: '#0f5cd1',
  primaryLight: '#eef5ff',
  primaryBorder: '#d6e6ff',
  primaryDark: '#004fc4',

  surface: '#ffffff',
  background: '#f8fafc',
  subSurface: '#f1f5f9',
  overlay: 'rgba(15, 23, 42, 0.55)',

  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#64748b',
  textDisabled: '#94a3b8',
  textOnPrimary: '#ffffff',

  borderHairline: '#e2e8f0',
  borderStrong: '#cbd5e1',
  borderFocus: '#2e83ff',

  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#ef4444',
  dangerLight: '#fee2e2',
};
```

---

## 2. Typography Rules

- **Font Family**: `'Google Sans Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Scale**:
  - `Display`: `32px` / Weight `800` / Line Height `40px`
  - `Title Large`: `20px` / Weight `800` / Line Height `28px`
  - `Title Medium`: `17px` / Weight `700` / Line Height `24px`
  - `Title Small`: `15px` / Weight `700` / Line Height `22px`
  - `Body Large`: `15px` / Weight `500` / Line Height `22px`
  - `Body Regular`: `14px` / Weight `400` / Line Height `20px`
  - `Caption`: `12px` / Weight `600` / Line Height `16px`
  - `Micro Tag`: `10px` / Weight `700` / Line Height `14px`
- **Tabular Figures**: All currency, balances, OTP, and reference numbers use `font-variant-numeric: tabular-nums;`.

---

## 3. Elevation, Radius & Spacing

- **Shadows**: `box-shadow: none !important;`
- **Corner Radii**:
  - `xs`: `4px` (Badges, tags)
  - `sm`: `6px` (Pills, filter chips)
  - `md`: `8px` (Container cards, input fields, primary buttons)
  - `lg`: `12px` (Bottom sheets, modals)
  - `full`: `9999px` (Avatars, status chips)
- **Spacing Scale**:
  - `4px`, `8px`, `12px`, `16px`, `20px` (Screen horizontal padding), `24px`, `32px`

---

## 4. Reusable Component Recipes

### Primary Button
```tsx
<button
  style={{
    backgroundColor: '#2e83ff',
    color: '#ffffff',
    height: '48px',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '15px',
    border: 'none',
    boxShadow: 'none',
    cursor: 'pointer',
  }}
>
  Proceed to Pay
</button>
```

### Card Container
```tsx
<div
  style={{
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: 'none',
  }}
>
  {/* Content */}
</div>
```

---

## 5. How to Re-Apply This Theme

Import from `src/design-system/themes/qtpay`:
```typescript
import { qtPayDesignSystem, qtPayColors } from '../design-system/themes/qtpay';
```
