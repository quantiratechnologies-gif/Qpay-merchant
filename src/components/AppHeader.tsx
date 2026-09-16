import React from 'react';
import { ArrowLeft, Search, Settings, Store } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { AlphPayLogo } from './AlphPayLogo';
import { designSystem } from '../design-system';
import { LanguageSwitchPill } from './LanguageSwitchPill';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  onSearchClick?: () => void;
  showSettings?: boolean;
  showUserInfo?: boolean;
  showLanguageSwitch?: boolean;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showSearch = false,
  onSearchClick,
  showSettings = false,
  showLanguageSwitch = true,
  rightAction,
}) => {
  const { goBack, navigateTo, currentScreen, isRtl, t } = useApp();

  const handleBack = () => {
    if (onBack) onBack();
    else goBack();
  };

  const handleAvatarClick = () => {
    if (currentScreen === 'PROFILE') {
      navigateTo('MERCHANT_HOME');
    } else {
      navigateTo('PROFILE');
    }
  };

  const displayTitle = title ? t(title, title) : undefined;

  return (
    <header
      className="app-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'calc(14px + env(safe-area-inset-top, 0px)) 16px 12px 16px',
        backgroundColor: 'rgba(11, 11, 20, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: `1px solid ${designSystem.colors.borderHairline}`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
        minHeight: 'calc(62px + env(safe-area-inset-top, 0px))',
        boxSizing: 'border-box',
        width: '100%',
        gap: '12px',
      }}
    >
      {/* Left Slot: Back Button or Merchant Avatar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          minWidth: '40px',
        }}
      >
        {showBack ? (
          <button
            onClick={handleBack}
            aria-label={t('btn.back', 'Go back')}
            className="interactive-tap"
            style={{
              backgroundColor: '#151524',
              border: `1px solid ${designSystem.colors.borderHairline}`,
              color: '#FFFFFF',
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'background-color 0.15s ease, transform 0.1s ease',
            }}
          >
            <ArrowLeft size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        ) : (
          <button
            onClick={handleAvatarClick}
            aria-label="Store Profile"
            className="interactive-tap"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 200, 83, 0.12)',
              border: '1px solid rgba(0, 200, 83, 0.25)',
              color: '#00C853',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'transform 0.15s ease',
              flexShrink: 0,
            }}
          >
            <Store size={18} color="#00C853" />
          </button>
        )}
      </div>

      {/* Center Slot: Flexible Non-overlapping Brand Logo or Screen Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          minWidth: 0,
          textAlign: 'center',
        }}
      >
        {displayTitle ? (
          <h2
            style={{
              fontSize: '15.5px',
              fontWeight: '800',
              color: '#FFFFFF',
              margin: 0,
              textAlign: 'center',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {displayTitle}
          </h2>
        ) : (
          <div
            onClick={() => navigateTo('MERCHANT_HOME')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '100%',
            }}
          >
            <AlphPayLogo variant="header" size={22} themeMode="dark" />
          </div>
        )}
      </div>

      {/* Right Slot: Search / Settings / LanguageSwitch / Custom Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
          minWidth: '40px',
          justifyContent: 'flex-end',
        }}
      >
        {showLanguageSwitch && <LanguageSwitchPill variant="compact" />}

        {showSearch && (
          <button
            onClick={onSearchClick}
            aria-label="Search"
            className="interactive-tap"
            style={{
              backgroundColor: '#151524',
              border: `1px solid ${designSystem.colors.borderHairline}`,
              color: '#FFFFFF',
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'background-color 0.15s ease',
            }}
          >
            <Search size={18} />
          </button>
        )}

        {rightAction}

        {showSettings && !rightAction && (
          <button
            onClick={() => navigateTo('MERCHANT_SETUP')}
            aria-label="Settings"
            className="interactive-tap"
            style={{
              backgroundColor: '#151524',
              border: `1px solid ${designSystem.colors.borderHairline}`,
              color: '#FFFFFF',
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'background-color 0.15s ease',
            }}
          >
            <Settings size={18} />
          </button>
        )}

        {!showLanguageSwitch && !showSearch && !rightAction && !showSettings && (
          <div style={{ width: '38px', height: '38px' }} />
        )}
      </div>
    </header>
  );
};

