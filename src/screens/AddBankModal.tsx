import React, { useState } from 'react';
import { Landmark, Check } from 'lucide-react';
import { BottomSheet } from '../components/BottomSheet';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../state/AppContext';

export const AddBankModal: React.FC = () => {
  const { isAddBankModalOpen, setIsAddBankModalOpen, addBankAccount, t, language } = useApp();
  const [selectedBank, setSelectedBank] = useState<string>('Al Rajhi Bank');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const availableBanks = [
    { name: 'Al Rajhi Bank', code: 'SA03' },
    { name: 'Saudi National Bank (SNB)', code: 'SA58' },
    { name: 'Riyad Bank', code: 'SA44' },
    { name: 'Banque Saudi Fransi', code: 'SA12' },
    { name: 'Alinma Bank', code: 'SA05' },
    { name: 'Arab National Bank (anb)', code: 'SA10' },
    { name: 'Saudi Awwal Bank (SAB)', code: 'SA22' },
  ];

  const handleAdd = async () => {
    setIsLoading(true);
    await addBankAccount(selectedBank);
    setIsLoading(false);
    setIsAddBankModalOpen(false);
  };

  const displaySelectedBank = t(selectedBank, selectedBank);

  return (
    <BottomSheet
      isOpen={isAddBankModalOpen}
      onClose={() => setIsAddBankModalOpen(false)}
      title={language === 'العربية' ? 'ربط حساب بنكي عبر سريع' : 'Link Sarie Bank Account'}
    >
      <div style={{ marginBottom: '20px' }}>
        <div role="radiogroup" aria-label="Available Banks" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {availableBanks.map((bank) => {
            const isSelected = selectedBank === bank.name;
            const displayBankName = t(bank.name, bank.name);
            return (
              <div
                key={bank.name}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => setSelectedBank(bank.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedBank(bank.name);
                  }
                }}
                className="interactive-tap"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 16px',
                  backgroundColor: isSelected ? '#1A2234' : '#0B0F19',
                  border: isSelected ? '1.5px solid #00C853' : '1px solid #1E293B',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#111726',
                      color: isSelected ? '#00C853' : '#94A3B8',
                      border: `1px solid ${isSelected ? 'rgba(0, 200, 83, 0.4)' : '#1E293B'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '11px',
                    }}
                  >
                    <Landmark size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#FFFFFF' }}>
                      {displayBankName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px', fontFamily: 'monospace' }} dir="ltr">
                      Sarie Rail • IBAN {bank.code}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: isSelected ? 'none' : '1.5px solid #1E293B',
                    backgroundColor: isSelected ? '#00C853' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSelected && <Check size={13} color="#080C14" strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PrimaryButton onClick={handleAdd} disabled={isLoading}>
        {isLoading
          ? (language === 'العربية' ? 'جاري التحقق والربط...' : 'Verifying & Linking...')
          : (language === 'العربية' ? `ربط ${displaySelectedBank}` : `Link ${selectedBank}`)}
      </PrimaryButton>

      {/* Quantira Technologies Verification Footer */}
      <div style={{ marginTop: '14px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>
          {language === 'العربية'
            ? 'ربط بنكي مباشر ومشفر • مدعوم بتقنيات كوانتيرا وسريع'
            : 'Direct Bank Binding • Sarie Authenticated • Quantira Technologies'}
        </span>
      </div>
    </BottomSheet>
  );
};
