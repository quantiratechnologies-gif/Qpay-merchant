import React from 'react';
import { useApp } from '../state/AppContext';
import { Globe } from 'lucide-react';

interface LanguageSwitchPillProps {
  variant?: 'compact' | 'standard' | 'glass';
  className?: string;
  style?: React.CSSProperties;
}

export const LanguageSwitchPill: React.FC<LanguageSwitchPillProps> = ({
  variant = 'compact',
  className = '',
  style,
}) => {
  const { language, toggleLanguage, setIsLanguageModalOpen } = useApp();
  const isAr = language === 'العربية';

  // If in Arabic, target is English. If in English, target is Arabic.
  const targetLabel = isAr ? 'EN' : 'عربي';
  const targetFlag = isAr ? '🇬🇧' : '🇸🇦';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleLanguage();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setIsLanguageModalOpen(true);
      }}
      aria-label={`Switch language to ${isAr ? 'English' : 'Arabic'}`}
      title={isAr ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
      className={`interactive-tap ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        padding: variant === 'compact' ? '4px 10px' : '6px 14px',
        height: variant === 'compact' ? '32px' : '36px',
        borderRadius: '9999px',
        backgroundColor: variant === 'glass' ? 'rgba(255, 255, 255, 0.08)' : '#151524',
        border: '1px solid rgba(0, 200, 83, 0.28)',
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.02em',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.15s ease',
        userSelect: 'none',
        flexShrink: 0,
        ...style,
      }}
    >
      <span style={{ fontSize: '13px', lineHeight: 1 }}>{targetFlag}</span>
      <span style={{ color: '#00C853', fontWeight: 800 }}>{targetLabel}</span>
      <Globe size={13} color="rgba(255, 255, 255, 0.6)" style={{ marginLeft: '1px' }} />
    </button>
  );
};
