import React from 'react';
import { CheckCircle2, Info, BellRing } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { useApp } from '../state/AppContext';
import { translateText } from '../utils/i18n';

export const NotificationsScreen: React.FC = () => {
  const { notifications, language, t } = useApp();

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B14', minHeight: '100%', paddingBottom: '36px' }}>
      <AppHeader title={t('notifications')} showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {notifications.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              borderRadius: '16px',
              padding: '48px 20px',
              color: '#A2A2BA',
              boxShadow: 'none',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#1E1E32',
                color: '#7FE87F',
                border: '1px solid #2C2C44',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <BellRing size={22} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>{translateText('No notifications', language)}</div>
            <p style={{ fontSize: '12.5px', color: '#6E6E85', marginTop: '4px' }}>
              {translateText("You're all caught up.", language)}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="interactive-tap"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '16px 18px',
                  backgroundColor: '#151524',
                  border: '1px solid #2C2C44',
                  borderRadius: '16px',
                  boxShadow: 'none',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#1E1E32',
                    color: '#7FE87F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid #2C2C44',
                  }}
                >
                  {notif.type === 'success' ? (
                    <CheckCircle2 size={20} />
                  ) : notif.type === 'alert' ? (
                    <BellRing size={20} />
                  ) : (
                    <Info size={20} />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: '#FFFFFF' }}>
                      {translateText(notif.title, language)}
                    </span>
                    <span style={{ fontSize: '11px', color: '#6E6E85', fontWeight: 600 }}>
                      {translateText(notif.timestamp, language)}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#A2A2BA',
                      marginTop: '4px',
                      lineHeight: '1.45',
                    }}
                  >
                    {translateText(notif.description, language)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

