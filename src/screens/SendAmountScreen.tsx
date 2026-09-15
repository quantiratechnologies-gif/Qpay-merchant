import React, { useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../state/AppContext';
import type { Contact } from '../types';
import { ShieldCheck, MessageSquare } from 'lucide-react';
import { toArabicNumerals } from '../utils/i18n';
import { formatCurrency } from '../utils/formatters';

export const SendAmountScreen: React.FC = () => {
  const { screenParams, openPinModal, contacts, navigateTo, completePayment, t, language } = useApp();
  const contact: Contact = screenParams.contact || contacts[0] || {
    id: 'default',
    name: 'Tariq Al-Otaibi',
    upiId: 'tariq@sarie',
    avatarInitials: 'TO',
    mobile: '+966 50 234 5678',
  };

  const initialAmount = screenParams.defaultAmount ? String(screenParams.defaultAmount) : '';
  const [amountStr, setAmountStr] = useState<string>(initialAmount);
  const [note, setNote] = useState<string>('');

  const numAmount = parseFloat(amountStr) || 0;
  const displayName = t(contact.name, contact.name);

  const handlePayClick = () => {
    if (numAmount <= 0) return;

    openPinModal({
      title: `${t('nav.pay', 'Pay')} ${displayName}`,
      amount: numAmount,
      subTitle: `${language === 'العربية' ? 'إلى' : 'To'} ${contact.upiId}`,
      onSuccess: async () => {
        const txn = await completePayment({
          title: contact.name,
          subTitle: `${language === 'العربية' ? 'إلى' : 'To'} ${contact.upiId}`,
          amount: numAmount,
          avatarInitials: contact.avatarInitials,
          category: 'Transfer',
        });
        navigateTo('PAYMENT_SUCCESS', {
          transaction: txn,
          recipientName: contact.name,
          amount: numAmount,
          upiId: contact.upiId,
          type: 'sent',
        });
      },
    });
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B14', minHeight: '100%', paddingBottom: '32px' }}>
      <AppHeader title={t('pay.send_money', 'Send Money')} showBack />

      <div style={{ padding: '20px', textAlign: 'center' }}>
        {/* Recipient Profile Card */}
        <div
          style={{
            backgroundColor: '#151524',
            border: '1px solid #2C2C44',
            borderRadius: '16px',
            padding: '24px 20px',
            marginBottom: '20px',
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#1E1E32',
              color: '#7FE87F',
              fontWeight: 800,
              fontSize: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              border: '2px solid #7FE87F',
            }}
          >
            {contact.avatarInitials}
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            {displayName}
          </h2>
          <div style={{ fontSize: '12.5px', color: '#A2A2BA', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span>{contact.upiId}</span>
            <span style={{ color: '#6E6E85' }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#7FE87F', fontWeight: 700 }}>
              <ShieldCheck size={14} /> {language === 'العربية' ? 'موثوق' : 'Verified'}
            </span>
          </div>
        </div>

        {/* Amount Input Card */}
        <div
          style={{
            backgroundColor: '#151524',
            border: '1px solid #2C2C44',
            borderRadius: '16px',
            padding: '24px 20px',
            marginBottom: '20px',
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              color: '#A2A2BA',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            {t('pay.enter_amount', 'Enter Amount')}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#7FE87F' }}>
              {language === 'العربية' ? 'ر.س' : 'SAR'}
            </span>
            <input
              type="number"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="0"
              autoFocus
              className="tabular-nums"
              style={{
                fontSize: '44px',
                fontWeight: 900,
                color: '#FFFFFF',
                background: 'none',
                border: 'none',
                outline: 'none',
                width: '240px',
                textAlign: 'center',
                padding: 0,
              }}
            />
          </div>

          {/* Quick Amount Chips */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '18px' }}>
            {['50', '100', '500', '1000', '2000'].map((val) => {
              const isSelected = amountStr === val;
              const formattedVal = language === 'العربية' ? `+${toArabicNumerals(val)} ر.س` : `+SAR ${val}`;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmountStr(val)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: isSelected ? 'rgba(127, 232, 127, 0.15)' : '#1E1E32',
                    border: isSelected ? '1.5px solid #7FE87F' : '1px solid #2C2C44',
                    color: isSelected ? '#7FE87F' : '#FFFFFF',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {formattedVal}
                </button>
              );
            })}
          </div>

          {/* Optional Note Field */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#1E1E32',
              border: '1px solid #2C2C44',
              borderRadius: '10px',
              padding: '10px 14px',
            }}
          >
            <MessageSquare size={16} color="#6E6E85" />
            <input
              type="text"
              placeholder={t('pay.add_note', 'Add note / Purpose')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#FFFFFF',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <PrimaryButton onClick={handlePayClick} disabled={numAmount <= 0}>
          {language === 'العربية'
            ? `دفع ${formatCurrency(numAmount, language)}`
            : `Pay SAR ${numAmount ? numAmount.toLocaleString() : '0'}`}
        </PrimaryButton>
      </div>
    </div>
  );
};
