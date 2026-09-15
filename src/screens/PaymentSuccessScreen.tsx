import React, { useState } from 'react';
import { Check, Share2, FileText, CheckCircle2 } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { PaymentPartnerLogo } from '../components/PaymentPartnerLogo';
import { useApp } from '../state/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Transaction } from '../types';

export const PaymentSuccessScreen: React.FC = () => {
  const { screenParams, lastTransaction, navigateTo, t, language, isRtl } = useApp();
  const [downloadMsg, setDownloadMsg] = useState(false);

  const txn: Transaction = screenParams.transaction || lastTransaction || {
    id: 'QT98472910482',
    title: 'Saudi Electricity Company (SEC)',
    subTitle: 'Utility Bill Payment',
    amount: 2620.14,
    type: 'sent',
    date: 'TODAY',
    timestamp: new Date(),
    utr: 'SARIE984729104821',
  };

  const displayTitle = t(txn.title, txn.title);

  const handleDone = () => {
    navigateTo('HOME');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QTPay Receipt',
        text: `${language === 'العربية' ? 'تم التحويل بنجاح!' : 'Payment Successful!'} ${formatCurrency(txn.amount, language)} ${language === 'العربية' ? 'إلى' : 'paid to'} ${displayTitle}. Ref: ${txn.utr}`,
      }).catch(() => {});
    } else {
      setDownloadMsg(true);
      setTimeout(() => setDownloadMsg(false), 2500);
    }
  };

  const handleDownloadReceipt = () => {
    setDownloadMsg(true);
    setTimeout(() => setDownloadMsg(false), 2500);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B14', minHeight: '100%', paddingBottom: '30px' }}>
      <AppHeader title={language === 'العربية' ? 'إيصال التحويل' : 'Receipt'} showSettings={false} />

      <div style={{ padding: '24px 20px', textAlign: 'center' }}>
        {/* Animated Diamond Checkmark */}
        <div style={{ margin: '12px 0 20px 0' }}>
          <div className="diamond-check-container">
            <div className="diamond-shape" />
            <Check size={38} className="diamond-icon" strokeWidth={3.5} />
          </div>
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
          {t('pay.success_title', 'Payment Successful')}
        </h2>
        <div style={{ fontSize: '13px', color: '#A2A2BA', marginBottom: '14px' }}>
          {language === 'العربية' ? 'تم الدفع إلى ' : 'Paid to '}<strong style={{ color: '#FFFFFF' }}>{displayTitle}</strong>
        </div>

        {/* Large Amount Display */}
        <div
          style={{
            fontSize: '32px',
            fontWeight: '900',
            color: '#7FE87F',
            marginBottom: '20px',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
          }}
        >
          {formatCurrency(txn.amount, language)}
        </div>

        {/* Transaction Details Breakdown Card */}
        <div
          style={{
            backgroundColor: '#151524',
            border: '1px solid #2C2C44',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: isRtl ? 'right' : 'left',
            boxShadow: 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#A2A2BA', fontSize: '13px' }}>{t('pay.recipient', 'Payee')}</span>
            <span style={{ fontWeight: '700', fontSize: '13px', color: '#FFFFFF' }}>{displayTitle}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#A2A2BA', fontSize: '13px' }}>{language === 'العربية' ? 'رقم العملية' : 'Transaction ID'}</span>
            <span style={{ fontWeight: '600', fontSize: '12px', color: '#FFFFFF', fontFamily: 'monospace' }}>{txn.id}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#A2A2BA', fontSize: '13px' }}>{t('pay.txn_reference', 'Reference / UTR')}</span>
            <span style={{ fontWeight: '600', fontSize: '12px', color: '#FFFFFF', fontFamily: 'monospace' }}>{txn.utr}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#A2A2BA', fontSize: '13px' }}>{language === 'العربية' ? 'التاريخ والوقت' : 'Date & Time'}</span>
            <span style={{ fontWeight: '600', fontSize: '13px', color: '#FFFFFF' }}>{formatDate(txn.timestamp, language)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #2C2C44', paddingTop: '12px' }}>
            <span style={{ color: '#A2A2BA', fontSize: '13px' }}>{t('pay.source_account', 'Payment Method')}</span>
            <span style={{ fontWeight: '700', fontSize: '13px', color: '#7FE87F' }}>
              {t('Al Rajhi Bank', 'Al Rajhi Bank')} •••• 4821
            </span>
          </div>
        </div>

        {downloadMsg && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: '#7FE87F', fontWeight: '700', marginBottom: '16px' }}>
            <CheckCircle2 size={16} color="#7FE87F" /> {language === 'العربية' ? 'تم حفظ الإيصال بنجاح' : 'Receipt saved successfully'}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
          <SecondaryButton onClick={handleShare}>
            <Share2 size={16} /> {t('btn.share', 'Share')}
          </SecondaryButton>
          <SecondaryButton onClick={handleDownloadReceipt}>
            <FileText size={16} /> {language === 'العربية' ? 'الإيصال' : 'Receipt'}
          </SecondaryButton>
        </div>

        <PrimaryButton onClick={handleDone}>{t('btn.done', 'Done')}</PrimaryButton>

        {/* Verified Payment Partner Footer */}
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#6E6E85', fontWeight: 600 }}>
            {language === 'العربية' ? 'معتمد عبر' : 'Verified by'}
          </span>
          <PaymentPartnerLogo size={18} width={54} height={30} themeMode="dark" />
        </div>
      </div>
    </div>
  );
};
