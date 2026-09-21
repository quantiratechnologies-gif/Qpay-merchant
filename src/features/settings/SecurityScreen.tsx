import React, { useState } from 'react';
import { Smartphone, Monitor, ShieldCheck, LogOut, Lock, Key, Fingerprint, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { formatLocalizedNumber, translateText } from '../../utils/i18n';
import { Card, StatusBadge } from '../../components/ui';
import { colors, radii } from '../../design-system/tokens';

export const SecurityScreen: React.FC = () => {
  const { deviceSessions, terminateSession, navigateTo, language, isRtl } = useApp();
  const isAr = language === 'العربية';

  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('qtpay_merchant_biometrics') !== 'false';
  });
  const [terminalLockEnabled, setTerminalLockEnabled] = useState<boolean>(() => {
    return localStorage.getItem('qtpay_merchant_terminal_lock') === 'true';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggleBiometrics = () => {
    const next = !biometricsEnabled;
    setBiometricsEnabled(next);
    localStorage.setItem('qtpay_merchant_biometrics', String(next));
    setToastMessage(
      next
        ? (isAr ? 'تم تفعيل المصادقة البيومترية (Face ID / البصمة)' : 'Hardware Biometrics (Face ID / Touch ID) enabled')
        : (isAr ? 'تم تعطيل المصادقة البيومترية' : 'Hardware Biometrics disabled')
    );
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleTerminalLock = () => {
    const next = !terminalLockEnabled;
    setTerminalLockEnabled(next);
    localStorage.setItem('qtpay_merchant_terminal_lock', String(next));
    setToastMessage(
      next
        ? (isAr ? 'تم تفعيل قفل جهاز نقطة البيع' : 'SoftPOS Terminal Lock enabled')
        : (isAr ? 'تم إلغاء قفل جهاز نقطة البيع' : 'SoftPOS Terminal Lock disabled')
    );
    setTimeout(() => setToastMessage(null), 2500);
  };

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

      {toastMessage && (
        <div
          className="fade-in"
          style={{
            backgroundColor: 'rgba(0, 200, 83, 0.15)',
            border: '1px solid #00C853',
            borderRadius: radii.md,
            padding: '10px 16px',
            color: '#00C853',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => navigateTo('MERCHANT_PIN_SETUP', { fromSettings: true })}
                className="interactive-tap cursor-pointer"
                style={{
                  backgroundColor: 'rgba(0, 255, 36, 0.1)',
                  border: '1px solid rgba(0, 255, 36, 0.4)',
                  color: '#00FF24',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {isAr ? 'تغيير الرمز' : 'Change PIN'}
              </button>
              <button
                type="button"
                onClick={() => navigateTo('MERCHANT_PIN_SETUP', { reset: true })}
                className="interactive-tap cursor-pointer"
                style={{
                  backgroundColor: colors.bgInset,
                  border: `1px solid ${colors.borderStrong}`,
                  color: colors.textSecondary,
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RefreshCw size={12} />
                {isAr ? 'إعادة ضبط' : 'Reset PIN'}
              </button>
            </div>
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
              {/* AES-256 */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 0',
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.textSecondary, fontSize: '13px' }}>
                  <ShieldCheck size={14} color={colors.accentGreen} />
                  {isAr ? 'تشفير AES-256' : 'AES-256 Encryption'}
                </div>
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
                  ACTIVE
                </span>
              </div>

              {/* Hardware Biometrics Toggle (Bug 26) */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 0',
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.textSecondary, fontSize: '13px' }}>
                  <Fingerprint size={14} color="#38BDF8" />
                  {isAr ? 'المصادقة البيومترية (Face ID / البصمة)' : 'Hardware Biometrics'}
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={biometricsEnabled}
                  onClick={handleToggleBiometrics}
                  style={{
                    width: '38px',
                    height: '22px',
                    borderRadius: '11px',
                    backgroundColor: biometricsEnabled ? '#00C853' : '#334155',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background-color 0.2s',
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: biometricsEnabled ? '18px' : '2px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      transition: 'left 0.2s',
                    }}
                  />
                </button>
              </div>

              {/* SoftPOS Terminal Lock Toggle */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 0',
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.textSecondary, fontSize: '13px' }}>
                  <Lock size={14} color="#F59E0B" />
                  {isAr ? 'قفل جهاز نقطة البيع' : 'SoftPOS Terminal Lock'}
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={terminalLockEnabled}
                  onClick={handleToggleTerminalLock}
                  style={{
                    width: '38px',
                    height: '22px',
                    borderRadius: '11px',
                    backgroundColor: terminalLockEnabled ? '#00C853' : '#334155',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background-color 0.2s',
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: terminalLockEnabled ? '18px' : '2px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      transition: 'left 0.2s',
                    }}
                  />
                </button>
              </div>

              {/* 2FA Authentication */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.textSecondary, fontSize: '13px' }}>
                  <Key size={14} color="#A855F7" />
                  {isAr ? 'المصادقة الثنائية (OTP)' : '2FA Authentication'}
                </div>
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
              </div>
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
