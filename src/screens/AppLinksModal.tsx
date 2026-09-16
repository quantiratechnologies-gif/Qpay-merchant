import React, { useEffect } from 'react';
import { X, Smartphone, Globe, Download, CheckCircle2 } from 'lucide-react';
import { AlphPayLogo } from '../components/AlphPayLogo';
import { useApp } from '../state/AppContext';

export const AppLinksModal: React.FC = () => {
  const { isAppLinksModalOpen, setIsAppLinksModalOpen } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAppLinksModalOpen) {
        setIsAppLinksModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAppLinksModalOpen, setIsAppLinksModalOpen]);

  if (!isAppLinksModalOpen) return null;

  const currentHost = window.location.origin;
  const webUrl = currentHost;

  const handleDownloadApk = () => {
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,QTPay%20Android%20APK%20Installation%20Package';
    link.download = 'qtpay-v2.4-release.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-links-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={() => setIsAppLinksModalOpen(false)}
    >
      <div
        className="slide-up"
        style={{
          width: '100%',
          maxWidth: '440px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#111726',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px',
          boxShadow: 'none',
          border: '1px solid #1E293B',
          color: '#FFFFFF',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 id="app-links-title" style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: 0 }}>QTPay Application Links</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0 0' }}>Web, Android APK & iOS Access</p>
          </div>
          <button
            onClick={() => setIsAppLinksModalOpen(false)}
            aria-label="Close modal"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#1A2234',
              border: '1px solid #1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#94A3B8',
              boxShadow: 'none',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Logo Banner */}
        <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#1A2234', borderRadius: '16px', marginBottom: '20px', border: '1px solid #1E293B' }}>
          <AlphPayLogo variant="horizontal" themeMode="dark" />
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          {/* Web App */}
          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: '#1A2234',
              border: '1.5px solid #00C853',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(0, 200, 83, 0.12)',
                    color: '#00C853',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Globe size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '15px', color: '#ffffff' }}>Web Application</div>
                  <div style={{ fontSize: '11px', color: '#00C853', fontWeight: '700' }}>
                    Live Web Version (Active)
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  color: '#00C853',
                  padding: '4px 8px',
                  borderRadius: '10px',
                }}
              >
                Online
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0 0' }}>
              URL: <code style={{ color: '#00C853', fontWeight: '700' }}>{webUrl}</code>
            </p>
          </div>

          {/* Android App */}
          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: '#1A2234',
              border: '1px solid #1E293B',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: '#111726',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Smartphone size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '15px', color: '#ffffff' }}>Android Application</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>Google Play & APK Direct</div>
                </div>
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#94A3B8',
                  padding: '4px 8px',
                  borderRadius: '10px',
                }}
              >
                v2.4 APK
              </span>
            </div>
            <button
              onClick={handleDownloadApk}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#00C853',
                color: '#080C14',
                border: 'none',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: 'none',
              }}
            >
              <Download size={16} /> Download Android APK
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8', justifyContent: 'center' }}>
          <CheckCircle2 size={14} color="#00C853" /> All links are secured and verified for QTPay
        </div>
      </div>
    </div>
  );
};
