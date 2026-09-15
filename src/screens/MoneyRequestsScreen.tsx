import React from 'react';
import { Check, X, ArrowDownLeft } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../state/AppContext';
import { formatSaudiCurrency, translateText } from '../utils/i18n';

export const MoneyRequestsScreen: React.FC = () => {
  const { moneyRequests, openPinModal, completePayment, navigateTo, language, t } = useApp();

  const handlePayRequest = (req: typeof moneyRequests[0]) => {
    openPinModal({
      title: req.requesterName,
      amount: req.amount,
      subTitle: req.note || translateText('Requested Payment', language),
      onSuccess: async () => {
        const txn = await completePayment({
          title: req.requesterName,
          subTitle: translateText('Request Approved Payment', language),
          amount: req.amount,
          avatarInitials: req.requesterName.substring(0, 2).toUpperCase(),
        });
        navigateTo('PAYMENT_SUCCESS', { transaction: txn });
      },
    });
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#1A1A2E', minHeight: '100vh', paddingBottom: '32px', color: '#FFFFFF' }}>
      <AppHeader title={translateText('Money Requests', language)} showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {moneyRequests.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              backgroundColor: '#2A2A3E',
              borderRadius: '16px',
              border: '1px solid #4D4D6B',
              padding: '48px 24px',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(127, 232, 127, 0.15)',
                color: '#7FE87F',
                border: '1px solid rgba(127, 232, 127, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <ArrowDownLeft size={28} />
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>{translateText('No Pending Requests', language)}</div>
            <p style={{ fontSize: '13px', color: '#B3B3C2', marginTop: '6px', margin: '6px 0 0 0' }}>
              {translateText('When someone requests money from you via UPI, it will appear here.', language)}
            </p>
          </div>
        ) : (
          moneyRequests.map((req) => (
            <div
              key={req.id}
              style={{
                backgroundColor: '#2A2A3E',
                border: '1px solid #4D4D6B',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      backgroundColor: '#3A3A52',
                      color: '#7FE87F',
                      fontWeight: 800,
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #4D4D6B',
                      flexShrink: 0,
                    }}
                  >
                    {req.requesterName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#FFFFFF' }}>
                      {req.requesterName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#B3B3C2', marginTop: '2px' }}>{req.upiId}</div>
                  </div>
                </div>

                <div className="tabular-nums" style={{ fontSize: '18px', fontWeight: 900, color: '#7FE87F' }}>
                  {formatSaudiCurrency(req.amount, language)}
                </div>
              </div>

              {req.note && (
                <div
                  style={{
                    backgroundColor: '#1A1A2E',
                    border: '1px solid #4D4D6B',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '12.5px',
                    color: '#B3B3C2',
                    marginBottom: '16px',
                    fontStyle: 'italic',
                  }}
                >
                  "{req.note}"
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="interactive-tap"
                  style={{
                    flex: 1,
                    backgroundColor: '#3A3A52',
                    border: '1px solid #4D4D6B',
                    color: '#B3B3C2',
                    borderRadius: '12px',
                    padding: '12px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <X size={16} /> {translateText('Decline', language)}
                </button>
                <div style={{ flex: 1.4 }}>
                  <PrimaryButton onClick={() => handlePayRequest(req)}>
                    <Check size={16} /> {t('pay')} {formatSaudiCurrency(req.amount, language)}
                  </PrimaryButton>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

