import React, { useState } from 'react';
import { ArrowLeft, Delete, ShieldCheck } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { formatCurrency } from '../utils/formatters';
import { translateText, formatSaudiCurrency, toArabicNumerals } from '../utils/i18n';

const CARD_SCHEMES = [
  { id: 'mada', label: 'mada Debit', labelAr: 'مدى', icon: '🇸🇦' },
  { id: 'applepay', label: 'Apple Pay', labelAr: 'أبل باي', icon: '' },
  { id: 'visa', label: 'Visa', labelAr: 'فيزا', icon: '💳' },
  { id: 'mastercard', label: 'Mastercard', labelAr: 'ماستركارد', icon: '💳' },
];

export const SoftPOSTerminalScreen: React.FC = () => {
  const {
    softPosAmount,
    setSoftPosAmount,
    softPosCardScheme,
    setSoftPosCardScheme,
    navigateTo,
    goBack,
    merchantInfo,
    language,
    isRtl,
    t,
  } = useApp();

  const isAr = language === 'العربية';

  const [rawAmountStr, setRawAmountStr] = useState<string>(
    softPosAmount > 0 ? (softPosAmount * 100).toString() : '6700'
  );

  const numericValue = (parseInt(rawAmountStr || '0', 10) / 100) || 0;

  const handleKeyPress = (digit: string) => {
    if (rawAmountStr.length < 8) {
      if (rawAmountStr === '0') setRawAmountStr(digit);
      else setRawAmountStr((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    setRawAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handleCharge = () => {
    if (numericValue > 0) {
      setSoftPosAmount(numericValue);
      navigateTo('SOFTPOS_TAP', {
        amount: numericValue,
        cardScheme: softPosCardScheme,
      });
    }
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 20px 24px 20px',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={goBack}
          aria-label={t('btn.back', 'Back')}
          className="interactive-tap"
          style={{
            backgroundColor: '#151524',
            border: '1px solid #2C2C44',
            color: '#FFFFFF',
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
            {t('merchant.softpos', 'SoftPOS Terminal')}
          </div>
          <div style={{ fontSize: '11px', color: '#7FE87F', fontWeight: 700 }}>
            {translateText(merchantInfo.businessName, language)}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(127, 232, 127, 0.12)',
            border: '1px solid rgba(127, 232, 127, 0.25)',
            borderRadius: '8px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#7FE87F',
          }}
        >
          <ShieldCheck size={13} />
          <span>mada NFC</span>
        </div>
      </div>

      {/* Center: Amount Display & Scheme Selector (Gradient Green-Black) */}
      <div
        style={{
          textAlign: 'center',
          margin: '14px 0',
          background: 'linear-gradient(135deg, #052e16 0%, #064e3b 35%, #031c12 70%, #0e0e18 100%)',
          border: '1px solid rgba(127, 232, 127, 0.35)',
          borderRadius: '20px',
          padding: '20px 16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: '11.5px', color: '#C8E6C9', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, marginBottom: '4px' }}>
          {isAr ? 'مبلغ التحصيل (نقاط بيع بالجوال)' : 'Charge Amount (Sarie SoftPOS)'}
        </div>

        <div className="tabular-nums" style={{ fontSize: '40px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', margin: '4px 0 8px 0' }}>
          {formatCurrency(numericValue, language)}
        </div>

        {/* 15% ZATCA VAT Breakdown Tag */}
        <div style={{ fontSize: '12px', color: '#A2E6A2', fontWeight: 700 }}>
          {isAr ? (
            <>شامل ضريبة زاتكا ١٥٪ ({formatSaudiCurrency(numericValue - numericValue / 1.15, language)})</>
          ) : (
            <>Includes SAR {(numericValue - numericValue / 1.15).toFixed(2)} (15% ZATCA VAT)</>
          )}
        </div>

        {/* Card Scheme Selection */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '14px' }}>
          {CARD_SCHEMES.map((scheme) => {
            const isSelected = softPosCardScheme === scheme.id;
            return (
              <button
                key={scheme.id}
                type="button"
                onClick={() => setSoftPosCardScheme(scheme.id)}
                className="interactive-tap"
                style={{
                  backgroundColor: isSelected ? 'rgba(127, 232, 127, 0.22)' : 'rgba(0, 0, 0, 0.4)',
                  border: isSelected ? '1.5px solid #7FE87F' : '1px solid rgba(127, 232, 127, 0.2)',
                  color: isSelected ? '#FFFFFF' : '#A2A2BA',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <span>{scheme.icon}</span>
                <span>{isAr ? scheme.labelAr : scheme.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* POS Numeric Keypad */}
      <div style={{ width: '100%', maxWidth: '330px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {digits.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleKeyPress(d)}
              className="interactive-tap"
              style={{
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#151524',
                border: '1px solid #2C2C44',
                color: '#FFFFFF',
                fontSize: '22px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isAr ? toArabicNumerals(d) : d}
            </button>
          ))}

          {/* Quick Double Zero */}
          <button
            type="button"
            onClick={() => handleKeyPress('00')}
            className="interactive-tap"
            style={{
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isAr ? '٠٠' : '00'}
          </button>

          {/* Zero */}
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="interactive-tap"
            style={{
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isAr ? '٠' : '0'}
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={handleDelete}
            className="interactive-tap"
            style={{
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              color: '#A2A2BA',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Delete size={20} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </div>

        {/* Charge CTA */}
        <div style={{ marginTop: '16px' }}>
          <PrimaryButton onClick={handleCharge} disabled={numericValue <= 0}>
            {isAr
              ? `تحصيل لا تلامسي (${formatCurrency(numericValue, language)})`
              : `Charge Contactless (${formatCurrency(numericValue, language)})`}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

