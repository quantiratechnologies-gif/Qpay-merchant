import React, { useState } from 'react';
import { Delete, CheckCircle2, Wifi, ArrowLeft } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { toArabicNumerals } from '../utils/i18n';
import { Card } from '../components/ui';
import { colors, spacing, radii } from '../design-system/tokens';

interface PaymentRail {
  id: string;
  name: string;
  renderIcon: () => React.ReactNode;
}

const PAYMENT_RAILS: PaymentRail[] = [
  {
    id: 'debit',
    name: 'Debit',
    renderIcon: () => (
      <span
        style={{
          display: 'inline-block',
          width: '7px',
          height: '7px',
          borderRadius: radii.full,
          backgroundColor: colors.accentGreen,
        }}
      />
    ),
  },
  {
    id: 'applepay',
    name: 'Pay',
    renderIcon: () => <span style={{ fontSize: '13px', lineHeight: 1 }}></span>,
  },
  {
    id: 'visa',
    name: 'VISA',
    renderIcon: () => (
      <span
        style={{
          fontSize: '11px',
          fontWeight: 900,
          fontStyle: 'italic',
          color: colors.accentBlue,
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
    renderIcon: () => (
      <div style={{ display: 'flex', alignItems: 'center', width: '16px', height: '11px', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: '11px',
            height: '11px',
            borderRadius: radii.full,
            backgroundColor: '#EB001B',
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            width: '11px',
            height: '11px',
            borderRadius: radii.full,
            backgroundColor: '#F79E1B',
            opacity: 0.9,
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
    softPosAmount > 0 ? (softPosAmount * 100).toString() : '6700'
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
        backgroundColor: colors.bgPage,
        color: colors.textPrimary,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: `${spacing.space4} ${spacing.space5} 96px ${spacing.space5}`,
        boxSizing: 'border-box',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Top Bar with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.space2 }}>
        <button
          onClick={goBack}
          aria-label="Go Back"
          className="interactive-tap"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: radii.md,
            backgroundColor: colors.bgCard,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.textPrimary,
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        </button>

        <span style={{ fontSize: '14px', fontWeight: 700, color: colors.textSecondary }}>
          {isAr ? 'نقطة بيع بالجوال' : 'SoftPOS Terminal'}
        </span>

        <div style={{ width: '38px' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: spacing.space3 }}>
        {/* Top Amount Display Card */}
        <Card
          variant="elevated"
          style={{
            padding: `${spacing.space5} ${spacing.space4}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'radial-gradient(ellipse at top, rgba(0, 200, 83, 0.08) 0%, #0D1424 70%)',
          }}
        >
          {/* Header Tag */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: colors.accentGreen,
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
              gap: spacing.space2,
              margin: '2px 0 10px 0',
              direction: 'ltr',
            }}
          >
            <span
              style={{
                fontSize: '22px',
                fontWeight: 600,
                color: colors.accentGreen,
                letterSpacing: '-0.01em',
              }}
            >
              SAR
            </span>
            <span
              className="tabular-nums"
              style={{
                fontSize: '48px',
                fontWeight: 800,
                color: colors.textPrimary,
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
              backgroundColor: colors.bgInset,
              border: `1px solid ${colors.border}`,
              borderRadius: radii.full,
              padding: '5px 14px',
              marginBottom: spacing.space4,
            }}
          >
            <CheckCircle2 size={13} color={colors.accentGreen} />
            <span style={{ fontSize: '11.5px', fontWeight: 500, color: colors.textPrimary }}>
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
                  backgroundColor: colors.bgInset,
                  border: `1px solid ${colors.borderStrong}`,
                  color: colors.textPrimary,
                  borderRadius: radii.md,
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
                backgroundColor: colors.dangerLight,
                border: '1px solid rgba(255, 71, 87, 0.35)',
                color: colors.dangerText,
                borderRadius: radii.md,
                padding: '6px 14px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isAr ? 'مسح' : 'Clear'}
            </button>
          </div>
        </Card>

        {/* Accepted Payment Rails Section */}
        <div>
          <div
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: colors.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textAlign: 'center',
              marginBottom: spacing.space2,
            }}
          >
            {isAr ? 'طرق الدفع المقبولة' : 'ACCEPTED PAYMENT RAILS'}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: spacing.space2,
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
                    backgroundColor: isSelected ? colors.primaryLight : colors.bgCard,
                    border: isSelected ? `1.5px solid ${colors.accentGreen}` : `1px solid ${colors.border}`,
                    borderRadius: radii.md,
                    padding: '8px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {rail.id !== 'visa' && rail.renderIcon()}
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? colors.textPrimary : colors.textSecondary,
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
                borderRadius: radii.lg,
                backgroundColor: '#151B28',
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
                fontSize: '24px',
                fontWeight: 700,
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
              borderRadius: radii.lg,
              backgroundColor: '#151B28',
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary,
              fontSize: '20px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
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
              borderRadius: radii.lg,
              backgroundColor: '#151B28',
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary,
              fontSize: '24px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            {isAr ? toArabicNumerals('0') : '0'}
          </button>

          {/* Backspace Delete */}
          <button
            type="button"
            onClick={handleDelete}
            className="interactive-tap"
            style={{
              height: '56px',
              borderRadius: radii.lg,
              backgroundColor: '#151B28',
              border: `1px solid ${colors.border}`,
              color: colors.textSecondary,
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
            backgroundColor: colors.accentGreen,
            color: '#080C14',
            border: 'none',
            borderRadius: radii.lg,
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
