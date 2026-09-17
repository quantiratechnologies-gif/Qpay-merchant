import React from 'react';
import { Smartphone, Monitor, ShieldCheck, LogOut, Lock, UserCheck, Key } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatLocalizedNumber, translateText } from '../utils/i18n';
import { Card, StatusBadge } from '../components/ui';
import { colors, radii } from '../design-system/tokens';

export const SecurityScreen: React.FC = () => {
  const { deviceSessions, terminateSession, navigateTo, language, isRtl } = useApp();
  const isAr = language === 'العربية';

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: colors.bgPage,
        color: colors.textPrimary,
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* ── Page Header ─────────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>
          {translateText('Security & Devices', language)}
        </h1>
        <p style={{ fontSize: '13.5px', color: colors.textSecondary, margin: '6px 0 0 0', fontWeight: 500 }}>
          {isAr
            ? 'إدارة الجلسات النشطة وضبط إعدادات الأمان'
            : 'Manage active sessions and configure security settings'}
        </p>
      </div>

      {/* ── 2-Column Layout ──────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* ─── LEFT: PIN & Active Devices ────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Manager Security PIN Card */}
          <Card
            variant="elevated"
            style={{
              padding: '20px',
              border: '1px solid rgba(0, 255, 36, 0.25)',
              backgroundColor: '#10182A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 255, 36, 0.12)',
                  color: '#00FF24',
                  border: '1px solid rgba(0, 255, 36, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Lock size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px', color: colors.textPrimary }}>
                  {isAr ? 'رمز الأمان للمدير (MPIN)' : 'Manager Security PIN (MPIN)'}
                </div>
                <div style={{ fontSize: '12px', color: colors.textSecondary, marginTop: '2px' }}>
                  {isAr
                    ? 'مطلوب لتأكيد التسويات الفورية وعمليات استرداد المبالغ'
                    : 'Required to authorize instant settlements and refund operations'}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo('MERCHANT_PIN_SETUP', { fromSettings: true })}
              className="interactive-tap cursor-pointer"
              style={{
                backgroundColor: 'rgba(0, 255, 36, 0.1)',
                border: '1px solid rgba(0, 255, 36, 0.4)',
                color: '#00FF24',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {isAr ? 'تغيير الرمز السري' : 'Change PIN'}
            </button>
          </Card>

          {/* Section Label */}
          <div style={{ fontSize: '11px', fontWeight: 800, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {translateText('Active Devices', language)} ({formatLocalizedNumber(deviceSessions.length, language)})
          </div>

          <Card variant="elevated" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 90px',
                padding: '11px 20px',
                backgroundColor: colors.bgInset,
                borderBottom: `1px solid ${colors.border}`,
                gap: '12px',
              }}
            >
              {[
                isAr ? 'الجهاز' : 'Device',
                isAr ? 'الموقع' : 'Location',
                isAr ? 'آخر نشاط' : 'Last Active',
                isAr ? 'إجراء' : 'Action',
              ].map((col, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '10.5px', fontWeight: 700,
                    color: colors.textMuted, textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    textAlign: i === 3 ? 'right' : 'left',
                  }}
                >
                  {col}
                </span>
              ))}
            </div>

            {/* Table Rows */}
            {deviceSessions.map((session, index) => (
              <div
                key={session.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 90px',
                  padding: '15px 20px',
                  borderBottom: index < deviceSessions.length - 1 ? `1px solid ${colors.border}` : 'none',
                  gap: '12px',
                  alignItems: 'center',
                  backgroundColor: session.isCurrent ? 'rgba(0, 200, 83, 0.04)' : 'transparent',
                }}
              >
                {/* Device col */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px', height: '40px',
                      borderRadius: '12px',
                      backgroundColor: session.isCurrent ? colors.primaryLight : colors.bgInset,
                      color: session.isCurrent ? colors.accentGreen : '#94A3B8',
                      border: `1px solid ${session.isCurrent ? 'rgba(0, 200, 83, 0.25)' : colors.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {session.deviceType === 'mobile' ? <Smartphone size={18} /> : <Monitor size={18} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '13.5px', color: colors.textPrimary }}>
                      {session.deviceName}
                    </div>
                    {session.isCurrent && (
                      <div style={{ marginTop: '2px' }}>
                        <StatusBadge status="success" size="sm" label={translateText('Current', language)} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <span style={{ fontSize: '12.5px', color: colors.textSecondary }}>{session.location}</span>

                {/* Last Active */}
                <span style={{ fontSize: '12.5px', color: colors.textSecondary }}>
                  {translateText(session.lastActive, language)}
                </span>

                {/* Action */}
                <div style={{ textAlign: 'right' }}>
                  {session.isCurrent ? (
                    <span
                      style={{
                        fontSize: '10.5px', fontWeight: 800,
                        color: '#080C14', backgroundColor: colors.accentGreen,
                        padding: '4px 10px', borderRadius: '10px',
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                      }}
                    >
                      {translateText('Current', language)}
                    </span>
                  ) : (
                    <button
                      onClick={() => terminateSession(session.id)}
                      className="interactive-tap"
                      style={{
                        backgroundColor: colors.bgInset,
                        border: '1px solid #3D1A1A',
                        color: colors.dangerText,
                        padding: '5px 12px',
                        borderRadius: '10px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                      }}
                    >
                      <LogOut size={11} />
                      {translateText('End', language)}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* ─── RIGHT: Security Status HUD ──────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>
          {/* Security Shield Card */}
          <Card
            variant="elevated"
            style={{
              padding: '22px',
              background: 'radial-gradient(ellipse at top left, rgba(0, 200, 83, 0.09) 0%, #111726 70%)',
              border: '1.5px solid rgba(0, 200, 83, 0.28)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <div
                style={{
                  width: '52px', height: '52px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  color: colors.accentGreen,
                  border: '1px solid rgba(0, 200, 83, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px', color: colors.textPrimary }}>
                  {translateText('256-Bit Protection Active', language)}
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>
                  {translateText('Hardware biometrics verified', language)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: <ShieldCheck size={14} />, label: isAr ? 'تشفير AES-256' : 'AES-256 Encryption', active: true },
                { icon: <Key size={14} />, label: isAr ? 'المصادقة الثنائية' : '2FA Authentication', active: true },
                { icon: <UserCheck size={14} />, label: isAr ? 'بيومتريكس الجهاز' : 'Device Biometrics', active: true },
                { icon: <Lock size={14} />, label: isAr ? 'قفل الجلسة التلقائي' : 'Auto Session Lock', active: true },
              ].map(({ icon, label, active }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 0',
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.textSecondary, fontSize: '13px' }}>
                    {icon}
                    {label}
                  </div>
                  {active && (
                    <span
                      style={{
                        fontSize: '10px', fontWeight: 800,
                        color: colors.accentGreen,
                        backgroundColor: 'rgba(0, 200, 83, 0.1)',
                        padding: '2px 8px',
                        borderRadius: radii.full,
                        border: '1px solid rgba(0, 200, 83, 0.25)',
                      }}
                    >
                      ON
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Security Footnote */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Lock size={13} color="#64748B" />
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
              {translateText('Automated session security enabled', language)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
