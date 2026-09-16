import React, { useState } from 'react';
import { Landmark, Check, ArrowRight, Clock } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppHeader } from '../components/AppHeader';

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
        backgroundColor: '#080C14',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: '30px',
        boxSizing: 'border-box',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <AppHeader
        title={isAr ? 'حساب التسوية البنكية والآيبان' : 'Settlement IBAN & Bank'}
        showBack={true}
        showSettings={false}
      />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px', padding: '0 24px' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
          }}
        >
          <Landmark size={30} color="#00C853" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
          {isAr ? 'حساب بنك التسوية للمنشأة' : 'Settlement Bank Account'}
        </h2>
        <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
          {isAr ? 'اختر حساب المنشأة البنكي السعودي للتحويل والإيداع اليومي الفوري عبر سريع' : 'Choose your corporate Saudi bank for daily automated Sarie payouts'}
        </p>
      </div>

      {/* Single Verified Settlement Account Card */}
      <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div
          style={{
            backgroundColor: '#111726',
            border: '1.5px solid #00C853',
            borderRadius: '18px',
            padding: '18px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {isAr ? 'الحساب البنكي المعتمد للتسوية' : 'OFFICIAL SETTLEMENT ACCOUNT'}
            </span>
            <div
              style={{
                backgroundColor: 'rgba(0, 200, 83, 0.15)',
                border: '1px solid #00C853',
                color: '#00C853',
                fontSize: '10.5px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Check size={12} strokeWidth={3} />
              <span>{isAr ? 'نشط وموثق' : 'Active & Verified'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 200, 83, 0.12)',
                border: '1px solid rgba(0, 200, 83, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00C853',
                flexShrink: 0,
              }}
            >
              <Landmark size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                {selectedBank}
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'monospace', letterSpacing: '0.04em', marginTop: '3px', direction: 'ltr', textAlign: isRtl ? 'right' : 'left' }}>
                {selectedIban}
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: '12px',
              borderTop: '1px solid #1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#94A3B8',
            }}
          >
            <span>{isAr ? 'شبكة التحويل:' : 'Payout Rail:'} <strong style={{ color: '#FFFFFF' }}>Sarie Instant</strong></span>
            <span style={{ color: '#00C853', fontWeight: 700 }}>Daily 06:00 AM</span>
          </div>
        </div>

        {/* Change / Select Bank Dropdown List */}
        <div style={{ marginTop: '6px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px', padding: '0 4px' }}>
            {isAr ? 'تغيير أو اختيار بنك سعودي آخر للمنشأة:' : 'Or switch to another Saudi corporate bank:'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                    padding: '12px 14px',
                    backgroundColor: isSelected ? 'rgba(0, 200, 83, 0.08)' : '#111726',
                    border: isSelected ? '1.5px solid #00C853' : '1px solid #1E293B',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Landmark size={16} color={isSelected ? '#00C853' : '#64748B'} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#FFFFFF' : '#CBD5E1' }}>
                        {isAr ? bank.arabicName : bank.name}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#64748B', fontFamily: 'monospace' }}>
                        {bank.iban}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#00C853',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#080C14',
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Settlement Payout Notice */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '14px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '4px',
          }}
        >
          <Clock size={16} color="#00C853" />
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            {isAr
              ? 'تتم التسوية اليومية تلقائياً الساعة ٠٦:٠٠ صباحاً مباشرة إلى حساب المنشأة.'
              : 'Daily collections settle automatically at 06:00 AM directly via Sarie rail.'}
          </span>
        </div>
      </div>

      {/* Footer & CTA */}
      <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <PrimaryButton onClick={handleContinue}>
          {t('btn.continue', 'Continue')} <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        </PrimaryButton>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>
            {isAr ? 'تسوية مباشرة وفورية مدعومة بتقنيات كوانتيرا' : 'Instant Sarie Direct Settlement • Quantira Technologies'}
          </span>
        </div>
      </div>
    </div>
  );
};
