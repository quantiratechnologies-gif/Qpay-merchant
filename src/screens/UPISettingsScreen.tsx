import React, { useState } from 'react';
import { Copy, ShieldCheck, Key, QrCode, Check } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { ListRow } from '../components/ListRow';
import { Modal } from '../components/Modal';
import { useApp } from '../state/AppContext';
import { translateText } from '../utils/i18n';

export const UPISettingsScreen: React.FC = () => {
  const { user, navigateTo, language, t } = useApp();
  const isAr = language === 'العربية' || language === 'ar';
  const [copied, setCopied] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (oldPin.length !== 4) {
      setPinError(translateText('Old PIN must be 4 digits', language));
      return;
    }
    if (newPin.length !== 4) {
      setPinError(translateText('New PIN must be 4 digits', language));
      return;
    }
    if (newPin !== confirmPin) {
      setPinError(translateText('New PIN and Confirm PIN do not match', language));
      return;
    }

    setPinSuccess(true);
    setTimeout(() => {
      setPinSuccess(false);
      setIsPinModalOpen(false);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
    }, 1200);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B14', minHeight: '100%', paddingBottom: '96px', color: '#FFFFFF' }}>
      <AppHeader title={translateText('Sarie Settings', language)} showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {/* Active Sarie ID Banner */}
        <div
          style={{
            backgroundColor: '#151524',
            border: '1.5px solid rgba(127, 232, 127, 0.35)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            color: '#FFFFFF',
            boxShadow: 'none',
          }}
        >
          <div style={{ fontSize: '11px', color: '#7FE87F', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
            {translateText('Primary Sarie ID', language)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.01em', direction: 'ltr' }}>
              {user.upiId}
            </span>
            <button
              onClick={handleCopy}
              className="interactive-tap"
              style={{
                backgroundColor: '#7FE87F',
                border: 'none',
                color: '#0B0B14',
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: 'none',
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? translateText('Copied', language) : t('copy')}
            </button>
          </div>
        </div>

        {/* Config Menu Items */}
        <div style={{ backgroundColor: '#151524', border: '1px solid #2C2C44', borderRadius: '16px', overflow: 'hidden', boxShadow: 'none' }}>
          <ListRow
            icon={<QrCode size={18} color="#7FE87F" />}
            label={translateText('My Sarie QR Code', language)}
            onClick={() => navigateTo('RECEIVE')}
          />
          <div style={{ height: '1px', backgroundColor: '#2C2C44', margin: '0 16px' }} />
          <ListRow
            icon={<Key size={18} color="#7FE87F" />}
            label={translateText('Change Payment PIN', language)}
            onClick={() => setIsPinModalOpen(true)}
          />
          <div style={{ height: '1px', backgroundColor: '#2C2C44', margin: '0 16px' }} />
          <ListRow
            icon={<ShieldCheck size={18} color="#7FE87F" />}
            label={translateText('Daily Transfer Limit', language)}
            rightElement={<span style={{ fontSize: '11px', color: '#7FE87F', fontWeight: 800, backgroundColor: '#1E1E32', border: '1px solid #2C2C44', padding: '3px 8px', borderRadius: '6px' }}>{isAr ? '٥٠,٠٠٠ ر.س / يومياً' : 'SAR 50,000 / day'}</span>}
          />
        </div>
      </div>

      {/* Change PIN Modal */}
      <Modal isOpen={isPinModalOpen} onClose={() => setIsPinModalOpen(false)} title={translateText('Change Payment PIN', language)}>
        {pinSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(127, 232, 127, 0.15)',
                color: '#7FE87F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <Check size={28} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>{translateText('Payment PIN Updated', language)}</h4>
          </div>
        ) : (
          <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pinError && (
              <div style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: '#1E1E32', border: '1px solid #FF4757', color: '#FF4757', fontSize: '12px', fontWeight: 700 }}>
                {pinError}
              </div>
            )}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#A2A2BA', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                {translateText('Current 4-Digit PIN', language)}
              </label>
              <input
                type="password"
                maxLength={4}
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                required
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #2C2C44', backgroundColor: '#1E1E32', color: '#FFFFFF', fontSize: '18px', textAlign: 'center', letterSpacing: '8px', outline: 'none', direction: 'ltr' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#A2A2BA', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                {translateText('New 4-Digit PIN', language)}
              </label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                required
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #2C2C44', backgroundColor: '#1E1E32', color: '#FFFFFF', fontSize: '18px', textAlign: 'center', letterSpacing: '8px', outline: 'none', direction: 'ltr' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#A2A2BA', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                {translateText('Confirm New PIN', language)}
              </label>
              <input
                type="password"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                required
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #2C2C44', backgroundColor: '#1E1E32', color: '#FFFFFF', fontSize: '18px', textAlign: 'center', letterSpacing: '8px', outline: 'none', direction: 'ltr' }}
              />
            </div>

            <button
              type="submit"
              className="interactive-tap"
              style={{
                marginTop: '10px',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#7FE87F',
                color: '#0B0B14',
                border: 'none',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: 'none',
              }}
            >
              {translateText('Update PIN', language)}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};


