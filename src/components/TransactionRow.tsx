import React from 'react';
import type { Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useApp } from '../state/AppContext';

interface TransactionRowProps {
  transaction: Transaction;
  onClick?: () => void;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  onClick,
}) => {
  const { language, t } = useApp();
  const isReceived = transaction.type === 'received';

  const defaultSub = isReceived ? 'Received via Sarie' : 'Paid via Sarie';
  const displayTitle = t(transaction.title, transaction.title);
  const displaySub = t(transaction.subTitle || defaultSub, transaction.subTitle || defaultSub);
  const displayDate = t(transaction.date, transaction.date);

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          onClick();
        }
      }}
      className={onClick ? 'interactive-tap' : ''}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        backgroundColor: '#151524',
        border: '1px solid #2C2C44',
        borderRadius: '14px',
        marginBottom: '10px',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: 'none',
        transition: 'border-color 0.15s ease, transform 0.1s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: isReceived ? 'rgba(0, 200, 83, 0.12)' : '#1E1E32',
            border: `1px solid ${isReceived ? 'rgba(0, 200, 83, 0.3)' : '#2C2C44'}`,
            color: isReceived ? '#00C853' : '#FFFFFF',
            fontWeight: 800,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {transaction.avatarInitials || transaction.title.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '14px', color: '#FFFFFF', lineHeight: '18px' }}>
            {displayTitle}
          </div>
          <div style={{ fontSize: '11.5px', color: '#A2A2BA', marginTop: '2px' }}>
            {displaySub} &bull; {transaction.utr.substring(0, 10)}
          </div>
        </div>
      </div>

      <div style={{ textAlign: language === 'العربية' ? 'left' : 'right' }}>
        <div
          className="tabular-nums"
          style={{
            fontWeight: 900,
            fontSize: '15px',
            color: isReceived ? '#00C853' : '#FFFFFF',
          }}
        >
          {isReceived ? '+' : '-'}{formatCurrency(transaction.amount, language)}
        </div>
        <div style={{ fontSize: '10.5px', color: '#6E6E85', marginTop: '2px', fontWeight: 600 }}>
          {displayDate}
        </div>
      </div>
    </div>
  );
};
