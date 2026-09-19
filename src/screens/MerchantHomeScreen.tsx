import React, { useState } from 'react';
import {
  Store,
  ChevronDown,
  Bell,
  User,
  Volume2,
  Megaphone,
  Eye,
  EyeOff,
  Zap,
  ChevronRight,
  QrCode,
  SmartphoneNfc,
  Share2,
  Banknote,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatLocalizedNumber, formatSaudiCurrency } from '../utils/i18n';
import { AlphPayLogo } from '../components/AlphPayLogo';

import { LanguageSwitchPill } from '../components/LanguageSwitchPill';

export const MerchantHomeScreen: React.FC = () => {
  const {
    merchantInfo,
    merchantCollections,
    triggerSettleNow,
    navigateTo,
    speakSoundBox,
    language,
    isRtl,
  } = useApp();

  const [isSettling, setIsSettling] = useState(false);
  const [settleSuccessMsg, setSettleSuccessMsg] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [cashSaleSuccess, setCashSaleSuccess] = useState<string | null>(null);

  const isAr = language === 'العربية';
  const totalToday = merchantCollections.reduce(
    (acc, c) => acc + (c.status === 'settled' ? c.amount : 0),
    0
  );
  const displayTotal = totalToday > 0 ? totalToday : 14850.5;
  const paymentCount = 142;
  const avgTicket = (displayTotal / paymentCount).toFixed(2);

  const handleSettleNowClick = async () => {
    setIsSettling(true);
    try {
      const settlement = await triggerSettleNow();
      setSettleSuccessMsg(
        isAr
          ? `تم تحويل تسوية فورية بقيمة ${formatSaudiCurrency(settlement.amount, language)} عبر سريع إلى ${settlement.bankName}`
          : `Instant payout of SAR ${settlement.amount.toFixed(2)} dispatched via Sarie to ${settlement.bankName}`
      );
      setTimeout(() => {
        setSettleSuccessMsg(null);
      }, 4000);
    } catch {
      // noop
    } finally {
      setIsSettling(false);
    }
  };

  const handleTestSoundBox = () => {
    speakSoundBox(245.0);
  };

  const handleCashSale = () => {
    setCashSaleSuccess(
      isAr ? 'تم تسجيل مبيعات نقدية بقيمة ٥٠٫٠٠ ر.س بنجاح' : 'Cash sale of SAR 50.00 recorded successfully'
    );
    setTimeout(() => setCashSaleSuccess(null), 3000);
  };

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: '#080C14',
        minHeight: '100vh',
        paddingBottom: '100px',
        color: '#FFFFFF',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* 1. Top Sticky Header (Left: Store Icon, Center: AlphPay Logo, Right: Notifications & Profile) */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(8, 12, 20, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Left: Store Icon Button */}
        <button
          onClick={() => navigateTo('PROFILE')}
          aria-label="Store Profile"
          className="interactive-tap"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: '#161F30',
            border: '1px solid #2A364F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Store size={20} />
        </button>

        {/* Center: Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlphPayLogo variant="horizontal" size={24} themeMode="dark" />
        </div>

        {/* Right: Language Switcher & Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LanguageSwitchPill variant="compact" />
          
          {/* Notification Button */}
          <button
            onClick={() => navigateTo('NOTIFICATIONS')}
            aria-label="Notifications"
            className="interactive-tap"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#161F30',
              border: '1px solid #2A364F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '9px',
                right: '9px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#00C853',
                border: '1.5px solid #161F30',
              }}
            />
          </button>

          {/* Profile Button */}
          <button
            onClick={() => navigateTo('PROFILE')}
            aria-label="Profile"
            className="interactive-tap"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#161F30',
              border: '1px solid #2A364F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <User size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Store Name & Speaker Online Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2px 4px',
          }}
        >
          <div
            onClick={() => navigateTo('PROFILE')}
            className="interactive-tap"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              {merchantInfo.businessName || (isAr ? 'تموينات ستار مارت' : 'Starmart Supermarket')}
            </span>
            <ChevronDown size={15} color="#94A3B8" />
          </div>

          <div
            onClick={() => navigateTo('SOUNDBOX_NOTIFIER')}
            className="interactive-tap"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(0, 200, 83, 0.12)',
              border: '1px solid rgba(0, 200, 83, 0.25)',
              borderRadius: '20px',
              padding: '4px 10px',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#00C853',
                display: 'inline-block',
                boxShadow: '0 0 6px #00C853',
              }}
            />
            <span style={{ fontSize: '11px', color: '#00C853', fontWeight: 700 }}>
              {isAr ? 'مكبر الصوت متصل' : 'Speaker Online'}
            </span>
          </div>
        </div>
        {/* Toast / Notification Messages */}
        {settleSuccessMsg && (
          <div
            style={{
              backgroundColor: 'rgba(0, 200, 83, 0.15)',
              border: '1px solid #00C853',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            <CheckCircle2 size={18} color="#00C853" style={{ flexShrink: 0 }} />
            <span>{settleSuccessMsg}</span>
          </div>
        )}

        {cashSaleSuccess && (
          <div
            style={{
              backgroundColor: 'rgba(0, 200, 83, 0.15)',
              border: '1px solid #00C853',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            <CheckCircle2 size={18} color="#00C853" style={{ flexShrink: 0 }} />
            <span>{cashSaleSuccess}</span>
          </div>
        )}

        {/* 2. Smart Soundbox Pro Banner */}
        <div
          onClick={() => navigateTo('SOUNDBOX_NOTIFIER')}
          className="interactive-tap"
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 200, 83, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00C853',
                flexShrink: 0,
              }}
            >
              <Volume2 size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                Smart Soundbox Pro
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, marginTop: '2px' }}>
                98% {isAr ? 'البطارية' : 'Battery'} &bull; {isAr ? 'صوت عربي وإنجليزي' : 'Bilingual Voice'}
              </div>
            </div>
          </div>

          {/* Test Sound Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleTestSoundBox();
            }}
            className="interactive-tap"
            style={{
              backgroundColor: '#161F30',
              border: '1px solid #2A364F',
              color: '#FFFFFF',
              borderRadius: '10px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Megaphone size={14} color="#00C853" />
            <span>{isAr ? 'اختبار' : 'Test'}</span>
          </button>
        </div>

        {/* 3. Hero Today's Collection Card */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '20px',
            padding: '20px',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Card Top Row: Title + Live Badge + Balance Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#94A3B8' }}>
                {isAr ? 'تحصيلات اليوم' : "Today's Collection"}
              </span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  border: '1px solid rgba(0, 200, 83, 0.3)',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#00C853',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: '#00C853',
                    display: 'inline-block',
                  }}
                />
                {isAr ? 'مباشر' : 'Live'}
              </span>
            </div>

            <button
              onClick={() => setShowBalance(!showBalance)}
              aria-label="Toggle Balance Visibility"
              className="interactive-tap"
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Large Hero Amount */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#00C853' }}>SAR</span>
            <span
              className="tabular-nums"
              style={{
                fontSize: '34px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
              }}
            >
              {showBalance
                ? displayTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '••••••'}
            </span>
          </div>

          {/* Inset Sub-Card: Payments Count & Avg Ticket */}
          <div
            onClick={() => navigateTo('MERCHANT_INSIGHTS')}
            className="interactive-tap"
            style={{
              backgroundColor: '#161F30',
              border: '1px solid #2A364F',
              borderRadius: '14px',
              padding: '12px 16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '16px',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                {isAr ? 'العمليات' : 'Payments'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                {isAr ? `${formatLocalizedNumber(paymentCount, language)} عملية` : `${paymentCount} received`}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                {isAr ? 'متوسط العملية' : 'Avg Ticket'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                SAR {avgTicket}
              </div>
            </div>
          </div>

          {/* Bottom Dual Action Buttons: Settle Now + Statement */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <button
              onClick={handleSettleNowClick}
              disabled={isSettling}
              className="interactive-tap"
              style={{
                backgroundColor: '#00C853',
                color: '#080C14',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 14px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 16px rgba(0, 200, 83, 0.3)',
              }}
            >
              <Zap size={16} fill="#080C14" />
              <span>{isSettling ? (isAr ? 'جاري التحويل...' : 'Settling...') : (isAr ? 'تسوية فورية' : 'Settle Now')}</span>
            </button>

            <button
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              className="interactive-tap"
              style={{
                backgroundColor: '#161F30',
                border: '1px solid #2A364F',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '12px 14px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <span>{isAr ? 'كشف الحساب' : 'Statement'}</span>
              <ChevronRight size={16} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* 4. Accept Payment Section (4 Grid Tiles) */}
        <div>
          <h2
            style={{
              fontSize: '15px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 12px 0',
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            {isAr ? 'قبول المدفوعات' : 'Accept Payment'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {/* Tile 1: Show QR */}
            <div
              onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
              className="interactive-tap"
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '16px',
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  border: '1px solid rgba(0, 200, 83, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00C853',
                }}
              >
                <QrCode size={20} />
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                {isAr ? 'عرض الرمز' : 'Show QR'}
              </span>
            </div>

            {/* Tile 2: Tap to Pay */}
            <div
              onClick={() => navigateTo('SOFTPOS_TERMINAL')}
              className="interactive-tap"
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '16px',
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  border: '1px solid rgba(0, 200, 83, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00C853',
                }}
              >
                <SmartphoneNfc size={20} />
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                {isAr ? 'الدفع باللمس' : 'Tap to Pay'}
              </span>
            </div>

            {/* Tile 3: Send Link */}
            <div
              onClick={() => navigateTo('PAYMENT_LINK_GENERATOR')}
              className="interactive-tap"
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '16px',
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  border: '1px solid rgba(0, 200, 83, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00C853',
                }}
              >
                <Share2 size={19} />
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                {isAr ? 'إرسال رابط' : 'Send Link'}
              </span>
            </div>

            {/* Tile 4: Cash Sale */}
            <div
              onClick={handleCashSale}
              className="interactive-tap"
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '16px',
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  border: '1px solid rgba(0, 200, 83, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00C853',
                }}
              >
                <Banknote size={20} />
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                {isAr ? 'بيع نقدي' : 'Cash Sale'}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Recent Payments Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {isAr ? 'المدفوعات الأخيرة' : 'Recent Payments'}
              </h2>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00C853' }} />
            </div>

            <button
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              className="interactive-tap"
              style={{
                background: 'none',
                border: 'none',
                color: '#00C853',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: 0,
              }}
            >
              <span>{isAr ? `عرض الكل (${paymentCount})` : `See All (${paymentCount})`}</span>
              <ChevronRight size={15} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </button>
          </div>

          {/* Payment List Rows matching mockup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Row 1: mada */}
            <div
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              className="interactive-tap"
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 200, 83, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00C853',
                    flexShrink: 0,
                  }}
                >
                  <CreditCard size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                    Debit Card &bull; ****4021
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    {isAr ? 'تموينات • منذ دقيقتين' : 'Grocery • 2 mins ago'}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#00C853' }}>
                  + SAR 245.00
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: isRtl ? 'flex-start' : 'flex-end', gap: '3px', fontSize: '10.5px', color: '#00C853', fontWeight: 700, marginTop: '2px' }}>
                  <Check size={11} strokeWidth={3} />
                  <span>{isAr ? 'مدفوع' : 'Paid'}</span>
                </div>
              </div>
            </div>

            {/* Row 2: Apple Pay */}
            <div
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              className="interactive-tap"
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#161F30',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8',
                    flexShrink: 0,
                  }}
                >
                  <Smartphone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                    Apple Pay
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    {isAr ? 'مشروبات • منذ ١٢ دقيقة' : 'Beverages • 12 mins ago'}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#00C853' }}>
                  + SAR 89.50
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: isRtl ? 'flex-start' : 'flex-end', gap: '3px', fontSize: '10.5px', color: '#00C853', fontWeight: 700, marginTop: '2px' }}>
                  <Check size={11} strokeWidth={3} />
                  <span>{isAr ? 'تم الإشعار' : 'Announced'}</span>
                </div>
              </div>
            </div>

            {/* Row 3: Counter QR Code */}
            <div
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              className="interactive-tap"
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 200, 83, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00C853',
                    flexShrink: 0,
                  }}
                >
                  <QrCode size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                    {isAr ? 'رمز QR المنضدة' : 'Counter QR Code'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    {isAr ? 'نقطة بيع #٠٢ • منذ ٢٤ دقيقة' : 'Register #02 • 24 mins ago'}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#00C853' }}>
                  + SAR 512.00
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: isRtl ? 'flex-start' : 'flex-end', gap: '3px', fontSize: '10.5px', color: '#00C853', fontWeight: 700, marginTop: '2px' }}>
                  <Check size={11} strokeWidth={3} />
                  <span>{isAr ? 'مدفوع' : 'Paid'}</span>
                </div>
              </div>
            </div>

            {/* Row 4: STC Pay Link */}
            <div
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              className="interactive-tap"
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#161F30',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8',
                    flexShrink: 0,
                  }}
                >
                  <Share2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                    STC Pay Link
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    {isAr ? 'توصيل واتساب • منذ ٤١ دقيقة' : 'WhatsApp Delivery • 41 mins ago'}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#00C853' }}>
                  + SAR 130.00
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: isRtl ? 'flex-start' : 'flex-end', gap: '3px', fontSize: '10.5px', color: '#00C853', fontWeight: 700, marginTop: '2px' }}>
                  <Check size={11} strokeWidth={3} />
                  <span>{isAr ? 'مدفوع' : 'Paid'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
