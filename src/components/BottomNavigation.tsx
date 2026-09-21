import React, { useState, useEffect } from 'react';
import { Home, Smartphone, QrCode, BarChart3, Store } from 'lucide-react';
import { useApp } from '../state/AppContext';
import type { BottomTab } from '../types';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    // Detect when input fields are focused (keyboard open on mobile)
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.getAttribute('contenteditable') === 'true')) {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      setIsKeyboardOpen(false);
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);

    // Also listen to visualViewport height shrinkage for mobile browsers
    const handleViewportResize = () => {
      if (window.visualViewport) {
        const heightRatio = window.visualViewport.height / window.innerHeight;
        setIsKeyboardOpen(heightRatio < 0.78);
      }
    };

    window.visualViewport?.addEventListener('resize', handleViewportResize);

    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
    };
  }, []);

  const tabs: { id: BottomTab; label: string; verified?: boolean; icon: (active: boolean) => React.ReactNode }[] = [
    { id: 'home', label: t('nav.home', 'Dashboard'), icon: (a) => <Home size={20} strokeWidth={a ? 2.5 : 1.8} /> },
    { id: 'account', label: t('nav.accounts', 'SoftPOS'), icon: (a) => <Smartphone size={20} strokeWidth={a ? 2.5 : 1.8} /> },
    { id: 'scan', label: t('nav.scan', 'ZATCA QR'), icon: () => <QrCode size={24} strokeWidth={2.2} /> },
    { id: 'history', label: t('nav.insights', 'Insights'), icon: (a) => <BarChart3 size={20} strokeWidth={a ? 2.5 : 1.8} /> },
    { id: 'profile', label: t('nav.profile', 'My Store'), verified: true, icon: (a) => <Store size={20} strokeWidth={a ? 2.5 : 1.8} /> },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Bottom Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: '600px',
        margin: '0 auto',
        height: '68px',
        backgroundColor: 'rgba(8, 12, 20, 0.96)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid #1E293B',
        display: isKeyboardOpen ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        zIndex: 100,
        boxShadow: 'none',
        transform: isKeyboardOpen ? 'translateY(100%)' : 'translateY(0)',
        transition: 'transform 0.2s ease, opacity 0.2s ease',
        opacity: isKeyboardOpen ? 0 : 1,
        pointerEvents: isKeyboardOpen ? 'none' : 'auto',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isScan = tab.id === 'scan';

        if (isScan) {
          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveTab(tab.id);
                }
              }}
              style={{
                position: 'relative',
                top: '-18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 45,
                transition: 'transform 0.12s ease',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#00C853',
                  color: '#080C14',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3.5px solid #080C14',
                  outline: '1.5px solid #00C853',
                  boxShadow: '0 4px 16px rgba(0, 200, 83, 0.35)',
                  transition: 'transform 0.15s ease',
                }}
              >
                {tab.icon(isActive)}
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#00C853',
                  marginTop: '2px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {tab.label}
              </span>
            </div>
          );
        }

        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setActiveTab(tab.id);
              }
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              cursor: 'pointer',
              color: isActive ? '#00C853' : '#64748B',
              transition: 'color 0.15s ease',
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative', transform: isActive ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.15s ease' }}>
              {tab.icon(isActive)}
              {tab.verified && (
                <span
                  title={t('profile.verified_kyc', 'Verified')}
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-4px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#00C853',
                    border: '1.5px solid #080C14',
                  }}
                />
              )}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#FFFFFF' : '#94A3B8',
                marginTop: '3px',
                letterSpacing: '-0.01em',
              }}
            >
              {tab.label}
            </span>

            {/* Active Subtle Bottom Indicator Pill */}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  width: '14px',
                  height: '2.5px',
                  borderRadius: '2px',
                  backgroundColor: '#00C853',
                }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
};
