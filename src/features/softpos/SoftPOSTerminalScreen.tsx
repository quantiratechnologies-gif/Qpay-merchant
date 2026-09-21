import React, { useState } from 'react';
import { Delete, CheckCircle2, Wifi, ArrowLeft } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { toArabicNumerals } from '../../utils/i18n';
import { AppHeader } from '../../components/AppHeader';

interface PaymentRail {
  id: string;
  name: string;
  accentColor: string;
  activeBg: string;
  renderIcon: () => React.ReactNode;
}

const PAYMENT_RAILS: PaymentRail[] = [
  {
    id: 'debit',
    name: 'Debit',
    accentColor: '#00C853',
    activeBg: 'rgba(0, 200, 83, 0.16)',
    renderIcon: () => (
      <span
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#00C853',
          boxShadow: '0 0 6px #00C853',
        }}
      />
    ),
  },
  {
    id: 'applepay',
    name: 'Pay',
    accentColor: '#FFFFFF',
    activeBg: 'rgba(255, 255, 255, 0.15)',
    renderIcon: () => (
      <svg
        viewBox="0 0 170 170"
        width="12"
        height="12"
        fill="currentColor"
        style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '1px' }}
      >
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.77-11.7-14.2-5.77-9.05-10.15-19.78-13.14-32.19-2.99-12.41-4.49-24.16-4.49-35.25 0-14.56 3.66-26.68 10.98-36.35 7.32-9.67 16.59-14.56 27.81-14.67 4.9.11 10.23 1.34 15.99 3.69 5.76 2.35 9.77 3.53 12.03 3.53 2.07 0 6.13-1.22 12.18-3.67 6.05-2.45 11.24-3.56 15.58-3.33 13.91 1.09 24.32 6.31 31.23 15.66-12.18 7.39-18.17 17.51-17.97 30.34.22 10.23 4.13 18.82 11.75 25.78 7.62 6.96 16.64 11.09 27.08 12.39-2.5 7.29-5.44 14.69-8.82 22.2zM119.22 33.55c0-6.74 2.45-13.16 7.36-19.26 4.9-6.1 11.09-10.44 18.57-13.02.65 3.91.76 7.29.33 10.12-.65 5-2.72 9.9-6.2 14.71-3.48 4.8-7.72 8.37-12.72 10.7-1.96 1.09-4.24 1.85-6.84 2.29-.33-1.85-.5-3.69-.5-5.54z" />
      </svg>
    ),
  },
  {
    id: 'visa',
    name: 'VISA',
    accentColor: '#3B82F6',
    activeBg: 'rgba(59, 130, 246, 0.18)',
    renderIcon: () => (
      <span
        style={{
          fontSize: '11px',
          fontWeight: 900,
          fontStyle: 'italic',
          color: '#3B82F6',
          letterSpacing: '0.05em',
        }}
      >
        VISA
      </span>
    ),
  },
  {
    id: 'mastercard',
    name: 'Master',
    accentColor: '#EB001B',
    activeBg: 'rgba(235, 0, 27, 0.16)',
    renderIcon: () => (
      <div style={{ display: 'flex', alignItems: 'center', width: '16px', height: '11px', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: '11px',
            height: '11px',
            borderRadius: '50%',
            backgroundColor: '#EB001B',
            opacity: 0.95,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            width: '11px',
            height: '11px',
            borderRadius: '50%',
            backgroundColor: '#F79E1B',
            opacity: 0.95,
          }}
        />
      </div>
    ),
  },
];

export const SoftPOSTerminalScreen: React.FC = () => {
  const {
    softPosAmount,
    setSoftPosAmount,
    softPosCardScheme,
    setSoftPosCardScheme,
    navigateTo,
    goBack,
    language,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';

  const [rawAmountStr, setRawAmountStr] = useState<string>(
    softPosAmount > 0 ? Math.round(softPosAmount * 100).toString() : '0'
  );

  const numericValue = (parseInt(rawAmountStr || '0', 10) / 100) || 0;
  const vatAmount = numericValue > 0 ? (numericValue - numericValue / 1.15).toFixed(2) : '0.00';

  const handleKeyPress = (digit: string) => {
    if (rawAmountStr.length < 8) {
      if (rawAmountStr === '0') setRawAmountStr(digit);
      else setRawAmountStr((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    setRawAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handleQuickAdd = (addSar: number) => {
    const current = (parseInt(rawAmountStr || '0', 10) / 100) || 0;
    const updated = current + addSar;
    setRawAmountStr(Math.round(updated * 100).toString());
  };

  const handleClear = () => {
    setRawAmountStr('0');
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
        minHeight: '100%',
        backgroundColor: '#080C14',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
        paddingBottom: '24px',
      }}
    >
      {/* Top Header */}
      <AppHeader
        title={isAr ? 'نقطة بيع بالجوال' : 'SoftPOS Terminal'}
        showBack={true}
        showSettings={false}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          padding: '12px 16px 20px 16px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Top Amount Display Card */}
        <div
          style={{
            backgroundColor: '#0D1424',
            border: '1px solid #1A263D',
            borderRadius: '20px',
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            background: 'radial-gradient(ellipse at top, rgba(0, 200, 83, 0.08) 0%, #0D1424 70%)',
          }}
        >
          {/* Header Tag */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#00C853',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '6px',
            }}
          >
            {isAr ? 'أدخل مبلغ التحصيل' : 'ENTER CHARGE AMOUNT'}
          </div>

          {/* Amount: Green SAR + Massive Number */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: '8px',
              margin: '2px 0 10px 0',
              direction: 'ltr',
            }}
          >
            <span
              style={{
                fontSize: '22px',
                fontWeight: 900,
                color: '#00C853',
                letterSpacing: '-0.01em',
              }}
            >
              SAR
            </span>
            <span
              className="tabular-nums"
              style={{
                fontSize: '48px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {numericValue.toFixed(2)}
            </span>
          </div>

          {/* 15% ZATCA VAT Breakdown Tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '20px',
              padding: '5px 14px',
              marginBottom: '16px',
            }}
          >
            <CheckCircle2 size={13} color="#00C853" />
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#E2E8F0' }}>
              {isAr ? (
                <>شامل {vatAmount} ر.س (ضريبة زاتكا ١٥٪)</>
              ) : (
                <>Includes SAR {vatAmount} (15% ZATCA VAT)</>
              )}
            </span>
          </div>

          {/* Quick Increment Chips + Clear */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            {[5, 10, 50, 100].map((sar) => (
              <button
                key={sar}
                type="button"
                onClick={() => handleQuickAdd(sar)}
                className="interactive-tap"
                style={{
                  backgroundColor: '#161F30',
                  border: '1px solid #2A364F',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                +{sar}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="interactive-tap"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#FF6B81',
                borderRadius: '12px',
                padding: '6px 14px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isAr ? 'مسح' : 'Clear'}
            </button>
          </div>
        </div>

        {/* Accepted Payment Rails Section */}
        <div>
          <div
            style={{
              fontSize: '10.5px',
              fontWeight: 800,
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textAlign: 'center',
              marginBottom: '8px',
            }}
          >
            {isAr ? 'طرق الدفع المقبولة' : 'ACCEPTED PAYMENT RAILS'}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
            }}
          >
            {PAYMENT_RAILS.map((rail) => {
              const isSelected = softPosCardScheme === rail.id;
              return (
                <button
                  key={rail.id}
                  type="button"
                  onClick={() => setSoftPosCardScheme(rail.id)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: isSelected ? rail.activeBg : '#111726',
                    border: isSelected ? `1.5px solid ${rail.accentColor}` : '1px solid #1E293B',
                    boxShadow: isSelected ? `0 0 14px ${rail.accentColor}33` : 'none',
                    borderRadius: '14px',
                    padding: '8px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {rail.id !== 'visa' && rail.renderIcon()}
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: isSelected ? '#FFFFFF' : '#CBD5E1',
                    }}
                  >
                    {rail.id === 'visa' ? rail.renderIcon() : rail.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3x4 POS Numeric Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {digits.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleKeyPress(d)}
              className="interactive-tap"
              style={{
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#151B28',
                border: '1px solid #1E293B',
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              {isAr ? toArabicNumerals(d) : d}
            </button>
          ))}

          {/* 00 */}
          <button
            type="button"
            onClick={() => handleKeyPress('00')}
            className="interactive-tap"
            style={{
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#151B28',
              border: '1px solid #1E293B',
              color: '#FFFFFF',
              fontSize: '20px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isAr ? '٠٠' : '00'}
          </button>

          {/* 0 */}
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="interactive-tap"
            style={{
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#151B28',
              border: '1px solid #1E293B',
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isAr ? '٠' : '0'}
          </button>

          {/* Backspace Delete */}
          <button
            type="button"
            onClick={handleDelete}
            className="interactive-tap"
            style={{
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#151B28',
              border: '1px solid #1E293B',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Delete size={22} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </div>

        {/* Big Vibrant Green Charge Button */}
        <button
          type="button"
          onClick={handleCharge}
          disabled={numericValue <= 0}
          className="interactive-tap"
          style={{
            marginTop: '4px',
            width: '100%',
            height: '54px',
            backgroundColor: '#00C853',
            color: '#080C14',
            border: 'none',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 900,
            cursor: numericValue <= 0 ? 'not-allowed' : 'pointer',
            opacity: numericValue <= 0 ? 0.45 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 4px 24px rgba(0, 200, 83, 0.4)',
            transition: 'all 0.15s ease',
          }}
        >
          <Wifi size={20} style={{ transform: 'rotate(90deg)' }} />
          <span>
            {isAr
              ? `تحصيل (${numericValue.toFixed(2)} ر.س)`
              : `Charge (SAR ${numericValue.toFixed(2)})`}
          </span>
        </button>
      </div>
    </div>
  );
};


