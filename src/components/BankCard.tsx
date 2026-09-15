import React from 'react';
import { Eye, EyeOff, Send, Download, Settings2, CreditCard } from 'lucide-react';
import type { BankAccount } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useApp } from '../state/AppContext';
import { designSystem } from '../design-system';

interface BankCardProps {
  bank: BankAccount;
  onSendClick?: () => void;
  onRequestClick?: () => void;
  onManageClick?: () => void;
}

export const BankCard: React.FC<BankCardProps> = ({
  bank,
  onSendClick,
  onRequestClick,
  onManageClick,
}) => {
  const { toggleShowBalance, openPinModal, navigateTo, t, language, isRtl } = useApp();

  const displayBankName = t(bank.bankName, bank.bankName);
  const displayAccountType = t(bank.accountType, bank.accountType);

  const handleCheckBalance = () => {
    if (bank.showBalance) {
      toggleShowBalance(bank.id);
    } else {
      openPinModal({
        title: `${t('banks.check_balance', 'Check Balance')} - ${displayBankName}`,
        subTitle: `${displayAccountType} • ${bank.accountNumberMasked}`,
        amount: bank.balance,
        onSuccess: () => toggleShowBalance(bank.id),
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: designSystem.colors.surface,
        border: `1px solid ${designSystem.colors.borderHairline}`,
        borderRadius: designSystem.radii.md,
        padding: '16px',
        margin: '12px 16px',
        boxShadow: designSystem.shadows.none,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: designSystem.radii.md,
              backgroundColor: designSystem.colors.primaryLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designSystem.colors.primary,
              border: `1px solid ${designSystem.colors.primaryBorder}`,
            }}
          >
            <CreditCard size={22} />
          </div>
          <div>
            <div style={{ fontWeight: designSystem.typography.weights.extrabold, fontSize: '15px', color: designSystem.colors.textPrimary }}>
              {displayBankName}
            </div>
            <div style={{ fontSize: '12px', color: designSystem.colors.textSecondary }}>
              {displayAccountType} &bull; {bank.accountNumberMasked}
            </div>
          </div>
        </div>

        {bank.isPrimary && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: designSystem.typography.weights.extrabold,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backgroundColor: designSystem.colors.primaryLight,
              color: designSystem.colors.primary,
              padding: '3px 8px',
              borderRadius: designSystem.radii.full,
              border: `1px solid ${designSystem.colors.primaryBorder}`,
            }}
          >
            {t('banks.primary', 'PRIMARY')}
          </span>
        )}
      </div>

      <div
        style={{
          backgroundColor: designSystem.colors.subSurface,
          borderRadius: designSystem.radii.md,
          padding: '12px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          border: `1px solid ${designSystem.colors.borderHairline}`,
        }}
      >
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: designSystem.typography.weights.bold }}>
            {t('home.total_balance', 'Available Balance')}
          </div>
          <div style={{ fontSize: '18px', fontWeight: designSystem.typography.weights.black, marginTop: '2px', color: designSystem.colors.textPrimary }}>
            {bank.showBalance ? formatCurrency(bank.balance, language) : (language === 'العربية' ? '•••••••• ر.س' : '••••••••')}
          </div>
        </div>

        <button
          onClick={handleCheckBalance}
          style={{
            backgroundColor: designSystem.colors.primary,
            color: designSystem.colors.textOnPrimary,
            border: 'none',
            borderRadius: designSystem.radii.sm,
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: designSystem.typography.weights.bold,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: designSystem.shadows.none,
          }}
        >
          {bank.showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
          {bank.showBalance ? t('home.hide', 'Hide') : t('banks.check_balance', 'Check Balance')}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onSendClick || (() => navigateTo('PAY_ANYONE'))}
          style={{
            flex: 1,
            backgroundColor: designSystem.colors.surface,
            border: `1px solid ${designSystem.colors.borderHairline}`,
            borderRadius: designSystem.radii.sm,
            padding: '8px',
            fontSize: '13px',
            fontWeight: designSystem.typography.weights.semibold,
            color: designSystem.colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: designSystem.shadows.none,
          }}
        >
          <Send size={14} color={designSystem.colors.primary} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          {t('home.send_money', 'Send')}
        </button>

        <button
          onClick={onRequestClick || (() => navigateTo('REQUEST_MONEY'))}
          style={{
            flex: 1,
            backgroundColor: designSystem.colors.surface,
            border: `1px solid ${designSystem.colors.borderHairline}`,
            borderRadius: designSystem.radii.sm,
            padding: '8px',
            fontSize: '13px',
            fontWeight: designSystem.typography.weights.semibold,
            color: designSystem.colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: designSystem.shadows.none,
          }}
        >
          <Download size={14} color={designSystem.colors.primary} />
          {t('home.request_money', 'Request')}
        </button>

        <button
          onClick={onManageClick || (() => navigateTo('BANK_ACCOUNTS'))}
          style={{
            flex: 1,
            backgroundColor: designSystem.colors.surface,
            border: `1px solid ${designSystem.colors.borderHairline}`,
            borderRadius: designSystem.radii.sm,
            padding: '8px',
            fontSize: '13px',
            fontWeight: designSystem.typography.weights.semibold,
            color: designSystem.colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: designSystem.shadows.none,
          }}
        >
          <Settings2 size={14} color={designSystem.colors.textSecondary} />
          {t('banks.title', 'Manage')}
        </button>
      </div>
    </div>
  );
};
