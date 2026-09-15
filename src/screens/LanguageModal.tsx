import React from 'react';
import { Check, Globe } from 'lucide-react';
import { BottomSheet } from '../components/BottomSheet';
import { useApp } from '../state/AppContext';

export const LanguageModal: React.FC = () => {
  const { isLanguageModalOpen, setIsLanguageModalOpen, language, setAppLanguage, t } = useApp();

  const languages = [
    { name: 'العربية', native: 'Arabic (Saudi Arabia / المملكة العربية السعودية)', badge: '🇸🇦 الرسمي' },
    { name: 'English', native: 'English (US / Global Fintech)', badge: '🇺🇸 Global' },
  ];

  return (
    <BottomSheet
      isOpen={isLanguageModalOpen}
      onClose={() => setIsLanguageModalOpen(false)}
      title={t('sec.select_lang', 'Select Language')}
    >
      <div role="radiogroup" aria-label="App Language Options" style={{ marginBottom: '16px' }}>
        {languages.map((lang) => {
          const isSelected = language === lang.name;
          return (
            <div
              key={lang.name}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => setAppLanguage(lang.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setAppLanguage(lang.name);
                }
              }}
              className="interactive-tap"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                backgroundColor: isSelected ? 'rgba(127, 232, 127, 0.14)' : '#151524',
                border: isSelected ? '1.5px solid #7FE87F' : '1px solid #2C2C44',
                borderRadius: '16px',
                marginBottom: '10px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? '#7FE87F' : '#1E1E32',
                    color: isSelected ? '#000000' : '#7FE87F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '15px',
                  }}
                >
                  <Globe size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '15.5px', color: '#FFFFFF' }}>
                      {lang.name}
                    </span>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 800,
                        backgroundColor: 'rgba(127, 232, 127, 0.12)',
                        color: '#7FE87F',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        border: '1px solid rgba(127, 232, 127, 0.25)',
                      }}
                    >
                      {lang.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#A2A2BA', marginTop: '3px' }}>
                    {lang.native}
                  </div>
                </div>
              </div>
              {isSelected && <Check size={20} color="#7FE87F" />}
            </div>
          );
        })}
      </div>
    </BottomSheet>
  );
};
