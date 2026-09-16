import React, { useState } from 'react';
import { Landmark, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppHeader } from '../components/AppHeader';
import { colors, spacing, radii } from '../design-system/tokens';

const SAUDI_SETTLEMENT_BANKS = [
  {
    name: 'Al Rajhi Bank',
    arabicName: 'مصرف الراجحي',
    iban: 'SA55 8000 0000 6271 5005',
    code: '03',
  },
  {
    name: 'Saudi National Bank (SNB)',
    arabicName: 'البنك الأهلي السعودي (SNB)',
    iban: 'SA12 1000 0000 1903 4004',
    code: '10',
  },
  {
    name: 'Riyad Bank',
    arabicName: 'بنك الرياض',
    iban: 'SA03 2000 0000 9397 1001',
    code: '20',
  },
  {
    name: 'Alinma Bank',
    arabicName: 'مصرف الإنماء',
    iban: 'SA84 0500 0000 4102 2002',
    code: '05',
  },
  {
    name: 'Saudi Awwal Bank (SAB)',
    arabicName: 'البنك السعودي الأول (SAB)',
    iban: 'SA44 5000 0000 8821 3003',
    code: '45',
  },
];

export const MerchantSettlementBankScreen: React.FC = () => {
  const { merchantInfo, updateMerchantInfo, navigateTo, language, isRtl, t } = useApp();
  const isAr = language === 'العربية';
  const [selectedBank, setSelectedBank] = useState(merchantInfo.settlementBank || 'Al Rajhi Bank');
  const [selectedIban, setSelectedIban] = useState(merchantInfo.settlementIban || 'SA55 8000 0000 6271 5005');

  const handleSelectBank = (bank: typeof SAUDI_SETTLEMENT_BANKS[0]) => {
    setSelectedBank(bank.name);
    setSelectedIban(bank.iban);
  };

  const handleContinue = () => {
    updateMerchantInfo({
      settlementBank: selectedBank,
      settlementIban: selectedIban,
    });
    navigateTo('MERCHANT_PIN_SETUP');
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bgPage,
        color: colors.textPrimary,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: spacing.space6,
        boxSizing: 'border-box',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div>
        <AppHeader
          title={isAr ? 'حساب التسوية البنكي' : 'Settlement Account'}
          showBack={true}
          showSettings={false}
        />

        {/* Clean Screen Intro */}
        <div style={{ padding: `${spacing.space3} ${spacing.space5} ${spacing.space4} ${spacing.space5}` }}>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 700,
              margin: '0 0 6px 0',
              color: colors.textPrimary,
              letterSpacing: '-0.01em',
            }}
          >
            {isAr ? 'اختر حساب التسوية للمنشأة' : 'Select Settlement Account'}
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: colors.textSecondary,
              margin: 0,
              lineHeight: 1.45,
              fontWeight: 400,
            }}
          >
            {isAr
              ? 'يتم إيداع وتحويل مبيعات المتجر اليومية تلقائياً إلى هذا الحساب عبر سريع.'
              : 'Daily collections from cards and QR will be deposited directly via Sarie.'}
          </p>
        </div>

        {/* Single Selectable Bank List */}
        <div style={{ padding: `0 ${spacing.space5}`, display: 'flex', flexDirection: 'column', gap: spacing.space2 }}>
          {SAUDI_SETTLEMENT_BANKS.map((bank) => {
            const isSelected = selectedBank === bank.name;
            return (
              <div
                key={bank.name}
                onClick={() => handleSelectBank(bank)}
                className="interactive-tap"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  backgroundColor: isSelected ? 'rgba(0, 200, 83, 0.08)' : colors.bgCard,
                  border: `1.5px solid ${isSelected ? colors.accentGreen : colors.border}`,
                  borderRadius: radii.lg,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space3 }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: radii.md,
                      backgroundColor: isSelected ? 'rgba(0, 200, 83, 0.12)' : colors.bgInset,
                      border: `1px solid ${isSelected ? 'rgba(0, 200, 83, 0.25)' : colors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? colors.accentGreen : colors.textMuted,
                      flexShrink: 0,
                    }}
                  >
                    <Landmark size={20} />
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: isSelected ? 700 : 600,
                        color: isSelected ? colors.textPrimary : '#CBD5E1',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {isAr ? bank.arabicName : bank.name}
                    </div>
                    <div
                      style={{
                        fontSize: '11.5px',
                        color: colors.textSecondary,
                        fontFamily: 'monospace',
                        marginTop: '2px',
                        letterSpacing: '0.02em',
                        direction: 'ltr',
                        textAlign: isRtl ? 'right' : 'left',
                      }}
                    >
                      {bank.iban}
                    </div>
                  </div>
                </div>

                {/* Selection Radio Indicator */}
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: radii.full,
                    backgroundColor: isSelected ? colors.accentGreen : 'transparent',
                    border: `1.5px solid ${isSelected ? colors.accentGreen : colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#080C14',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                  }}
                >
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div style={{ padding: `0 ${spacing.space5}`, marginTop: spacing.space4 }}>
        <PrimaryButton onClick={handleContinue}>
          {t('btn.continue', 'Continue')} <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        </PrimaryButton>
      </div>
    </div>
  );
};
