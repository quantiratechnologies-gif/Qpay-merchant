import React from 'react';
import { Smartphone, Monitor, ShieldCheck, LogOut, Lock } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { useApp } from '../state/AppContext';
import { formatLocalizedNumber, translateText } from '../utils/i18n';

export const SecurityScreen: React.FC = () => {
  const { deviceSessions, terminateSession, language } = useApp();

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B14', minHeight: '100vh', paddingBottom: '36px', color: '#FFFFFF' }}>
      <AppHeader title={translateText('Security & Devices', language)} showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {/* Biometrics / Security Status HUD Card */}
        <div
          style={{
            backgroundColor: '#151524',
            border: '1.5px solid rgba(127, 232, 127, 0.35)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            color: '#FFFFFF',
            boxShadow: 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 2 }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'rgba(127, 232, 127, 0.15)',
                color: '#7FE87F',
                border: '1px solid rgba(127, 232, 127, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800, fontSize: '15px', color: '#FFFFFF' }}>
                  {translateText('256-Bit Protection Active', language)}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#A2A2BA', marginTop: '2px' }}>
                {translateText('Hardware biometrics verified', language)}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#6E6E85',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '12px',
            paddingInlineStart: '4px',
          }}
        >
          {translateText('Active Devices', language)} ({formatLocalizedNumber(deviceSessions.length, language)})
        </div>

        <div
          style={{
            backgroundColor: '#151524',
            borderRadius: '16px',
            border: '1px solid #2C2C44',
            overflow: 'hidden',
            boxShadow: 'none',
          }}
        >
          {deviceSessions.map((session, index) => (
            <React.Fragment key={session.id}>
              {index > 0 && <div style={{ height: '1px', backgroundColor: '#2C2C44', margin: '0 16px' }} />}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 18px',
                  backgroundColor: session.isCurrent ? '#1E1E32' : '#151524',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: '#151524',
                      color: session.isCurrent ? '#7FE87F' : '#A2A2BA',
                      border: '1px solid #2C2C44',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {session.deviceType === 'mobile' ? <Smartphone size={20} /> : <Monitor size={20} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#FFFFFF' }}>
                      {session.deviceName}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#A2A2BA', marginTop: '2px' }}>
                      {session.location} • {translateText(session.lastActive, language)}
                    </div>
                  </div>
                </div>

                {session.isCurrent ? (
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      color: '#0B0B14',
                      backgroundColor: '#7FE87F',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {translateText('Current', language)}
                  </span>
                ) : (
                  <button
                    onClick={() => terminateSession(session.id)}
                    className="interactive-tap"
                    style={{
                      backgroundColor: '#1E1E32',
                      border: '1px solid #2C2C44',
                      color: '#A2A2BA',
                      padding: '6px 12px',
                      borderRadius: '10px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: 'none',
                    }}
                  >
                    <LogOut size={12} /> {translateText('End', language)}
                  </button>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Security Footnote */}
        <div style={{ marginTop: '24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Lock size={13} color="#6E6E85" />
          <span style={{ fontSize: '11px', color: '#6E6E85', fontWeight: 600 }}>
            {translateText('Automated session security enabled', language)}
          </span>
        </div>
      </div>
    </div>
  );
};

