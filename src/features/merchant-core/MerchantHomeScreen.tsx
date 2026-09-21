import React, { useState } from 'react';
import {
  Store,
  ChevronDown,
  Bell,
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
  Landmark,
  ShieldCheck,
  X,
  Receipt,
  ArrowRight,
  Delete,
} from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { formatLocalizedNumber, formatSaudiCurrency } from '../../utils/i18n';
import { AlphPayLogo } from '../../components/AlphPayLogo';

export const MerchantHomeScreen: React.FC = () => {
  const {
    merchantInfo,
    merchantCollections,
    merchantSettlements,
    bankAccounts,
    triggerSettleNow,
    navigateTo,
    speakSoundBox,
    openManagerPinModal,
    language,
    isRtl,
  } = useApp();

  const [isSettling, setIsSettling] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [settleMode, setSettleMode] = useState<'full' | 'custom'>('full');
  const [customSettleAmount, setCustomSettleAmount] = useState<number>(500);
  const [settledReceipt, setSettledReceipt] = useState<any | null>(null);
  const [settleSuccessMsg, setSettleSuccessMsg] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState(false);
  const [cashSaleSuccess, setCashSaleSuccess] = useState<string | null>(null);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [rawCashStr, setRawCashStr] = useState<string>('0');
  const [cashSaleNote, setCashSaleNote] = useState<string>('');

  const isAr = language === 'العربية';
  const totalToday = merchantCollections.reduce(
    (acc, c) => acc + (c.status === 'settled' ? c.amount : 0),
    0
  );
  const displayTotal = totalToday > 0 ? totalToday : 14850.5;
  const paymentCount = 142 + (merchantCollections.length - 5);
  const avgTicket = (displayTotal / Math.max(1, paymentCount)).toFixed(2);
  const primaryBank = bankAccounts.find((b) => b.isPrimary) || bankAccounts[0] || { balance: 50000.0 };

  const effectiveSettleAmount = settleMode === 'full' ? displayTotal : Math.min(customSettleAmount, displayTotal > 0 ? displayTotal : customSettleAmount);
  const vatDeduction = Number((effectiveSettleAmount - effectiveSettleAmount / 1.15).toFixed(2));
  const netPayout = Number((effectiveSettleAmount / 1.15).toFixed(2));
  const cashNumValue = (parseInt(rawCashStr || '0', 10) / 100) || 0;

  const handleToggleBalance = () => {
    if (!showBalance) {
      openManagerPinModal({
        title: isAr ? 'التحقق من رمز الأمان' : 'Security Verification',
        subtitle: isAr
          ? 'أدخل رمز MPIN المكون من ٤ أرقام لعرض رصيد الحساب'
          : 'Enter 4-digit Manager MPIN to view account balance',
        onSuccess: () => setShowBalance(true),
      });
    } else {
      setShowBalance(false);
    }
  };

  const handleSettleNowClick = () => {
    setSettleMode('full');
    setCustomSettleAmount(Math.min(500, Math.round(displayTotal)));
    setIsSettleModalOpen(true);
  };

  const handleConfirmSettlementWithPin = () => {
    setIsSettleModalOpen(false);
    const amountToSettle = effectiveSettleAmount;
    openManagerPinModal({
      title: isAr ? 'تفويض التحويل المصرفي' : 'Authorize Sarie Payout',
      subtitle: isAr
        ? `أدخل رمز MPIN لتفويض تحويل ${formatSaudiCurrency(amountToSettle, language)} إلى حسابك المصرفي`
        : `Enter 4-digit MPIN to authorize SAR ${amountToSettle.toFixed(2)} instant payout to your bank`,
      onSuccess: async () => {
        setIsSettling(true);
        try {
          const settlement = await triggerSettleNow(amountToSettle);
          speakSoundBox(settlement.amount);
          setSettledReceipt(settlement);
        } catch {
          // noop
        } finally {
          setIsSettling(false);
        }
      },
    });
  };

  const handleTestSoundBox = () => {
    speakSoundBox(245.0);
  };

  const handleCashSale = () => {
    setRawCashStr('0');
    setCashSaleNote('');
    setIsCashModalOpen(true);
  };

  const handleCashDigit = (d: string) => {
    if (rawCashStr.length < 8) {
      setRawCashStr((prev) => (prev === '0' ? d : prev + d));
    }
  };

  const handleCashDelete = () => {
    setRawCashStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handleQuickAddCash = (amt: number) => {
    const curr = (parseInt(rawCashStr || '0', 10) / 100) || 0;
    const next = curr + amt;
    setRawCashStr(Math.round(next * 100).toString());
  };

  const handleCashClear = () => {
    setRawCashStr('0');
  };

  const handleConfirmCashSale = async () => {
    if (cashNumValue <= 0) return;

    setIsCashModalOpen(false);
    await processMerchantCollection({
      amount: cashNumValue,
      paymentMethod: 'cash',
      orderRef: cashSaleNote.trim() || `CSH-REG-${Math.floor(100 + Math.random() * 900)}`,
      customerMasked: isAr ? 'عميل نقدي • كاشير ١' : 'Cash Customer • Register 1',
    });
    speakSoundBox(cashNumValue);
    setCashSaleSuccess(
      isAr
        ? `تم تسجيل مبيعات نقدية بقيمة ${cashNumValue.toFixed(2)} ر.س بنجاح`
        : `Cash sale of SAR ${cashNumValue.toFixed(2)} recorded successfully`
    );
    setTimeout(() => setCashSaleSuccess(null), 4000);
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
      {/* 1. Top Sticky Header (Left: Store Icon, Center: AlphPay Logo, Right: Notifications) */}
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
            border: merchantInfo.logoUrl ? '1.5px solid #00C853' : '1px solid #2A364F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {merchantInfo.logoUrl ? (
            <img
              src={merchantInfo.logoUrl}
              alt="Store"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Store size={20} />
          )}
        </button>

        {/* Center: Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlphPayLogo variant="horizontal" size={24} themeMode="dark" />
        </div>

        {/* Right: Notifications Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            {merchantInfo.logoUrl && (
              <img
                src={merchantInfo.logoUrl}
                alt="Store Avatar"
                style={{ width: '22px', height: '22px', borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(0, 200, 83, 0.5)' }}
              />
            )}
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
              onClick={handleToggleBalance}
              aria-label="Toggle Balance Visibility"
              className="interactive-tap"
              style={{
                background: 'none',
                border: 'none',
                color: showBalance ? '#00C853' : '#94A3B8',
                cursor: 'pointer',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              <span>{showBalance ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'عرض بالرمز' : 'View (MPIN)')}</span>
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
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

      {/* Modal 1: Instant Sarie Settlement Confirmation Drawer */}
      {isSettleModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setIsSettleModalOpen(false)}
        >
          <div
            className="slide-up"
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              padding: '24px 20px',
              width: '100%',
              maxWidth: '440px',
              boxSizing: 'border-box',
              color: '#FFFFFF',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(0, 200, 83, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00C853',
                  }}
                >
                  <Zap size={20} fill="#00C853" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                    {isAr ? 'تسوية بنكية فورية عبر سريع' : 'Instant Sarie Settlement'}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                    {isAr ? 'تحويل فوري ٢٤/٧ إلى حسابك المصرفي' : 'Real-time 24/7 direct payout'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSettleModalOpen(false)}
                style={{
                  background: '#161F30',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Settlement Option Toggle: Full vs Custom */}
            <div
              style={{
                display: 'flex',
                backgroundColor: '#0D1424',
                padding: '4px',
                borderRadius: '14px',
                border: '1px solid #1E293B',
                marginBottom: '14px',
                gap: '4px',
              }}
            >
              <button
                type="button"
                onClick={() => setSettleMode('full')}
                className="interactive-tap"
                style={{
                  flex: 1,
                  padding: '9px 10px',
                  borderRadius: '10px',
                  border: settleMode === 'full' ? '1px solid #00C853' : '1px solid transparent',
                  backgroundColor: settleMode === 'full' ? 'rgba(0, 200, 83, 0.15)' : 'transparent',
                  color: settleMode === 'full' ? '#00C853' : '#94A3B8',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isAr ? 'تسوية كامل الرصيد' : 'Settle Full Balance'}
              </button>
              <button
                type="button"
                onClick={() => setSettleMode('custom')}
                className="interactive-tap"
                style={{
                  flex: 1,
                  padding: '9px 10px',
                  borderRadius: '10px',
                  border: settleMode === 'custom' ? '1px solid #00C853' : '1px solid transparent',
                  backgroundColor: settleMode === 'custom' ? 'rgba(0, 200, 83, 0.15)' : 'transparent',
                  color: settleMode === 'custom' ? '#00C853' : '#94A3B8',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isAr ? 'تسوية مبلغ مخصص' : 'Settle Custom Amount'}
              </button>
            </div>

            {/* Custom Amount Controls if custom mode selected */}
            {settleMode === 'custom' && (
              <div
                style={{
                  backgroundColor: '#161F30',
                  border: '1px solid #2A364F',
                  borderRadius: '16px',
                  padding: '14px',
                  marginBottom: '14px',
                }}
              >
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, marginBottom: '6px' }}>
                  {isAr ? 'حدد المبلغ المطلوب تسويته (ر.س)' : 'ENTER CUSTOM SETTLEMENT AMOUNT (SAR)'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#00C853' }}>SAR</span>
                  <input
                    type="number"
                    value={customSettleAmount}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(displayTotal, parseFloat(e.target.value) || 0));
                      setCustomSettleAmount(val);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#0D1424',
                      border: '1.5px solid #00C853',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#FFFFFF',
                      fontSize: '18px',
                      fontWeight: 800,
                      outline: 'none',
                    }}
                  />
                </div>
                {/* Quick Increment Chips */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[100, 500, 1000, 2500].map((sar) => (
                    <button
                      key={sar}
                      type="button"
                      onClick={() => setCustomSettleAmount(Math.min(displayTotal, sar))}
                      className="interactive-tap"
                      style={{
                        backgroundColor: '#0D1424',
                        border: '1px solid #1E293B',
                        borderRadius: '8px',
                        padding: '5px 10px',
                        color: '#00C853',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      SAR {sar}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCustomSettleAmount(displayTotal)}
                    className="interactive-tap"
                    style={{
                      backgroundColor: 'rgba(0, 200, 83, 0.12)',
                      border: '1px solid rgba(0, 200, 83, 0.3)',
                      borderRadius: '8px',
                      padding: '5px 12px',
                      color: '#00C853',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {isAr ? 'الحد الأقصى (الكل)' : 'Max (All)'}
                  </button>
                </div>
              </div>
            )}

            {/* Payout Breakdown Card */}
            <div
              style={{
                backgroundColor: '#161F30',
                border: '1px solid #2A364F',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#94A3B8' }}>{isAr ? 'المبلغ المطلوب تسويته' : 'Requested Settlement Payout'}</span>
                <strong style={{ color: '#FFFFFF' }}>SAR {effectiveSettleAmount.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#94A3B8' }}>{isAr ? 'ضريبة القيمة المضافة المتضمنة (١٥٪)' : 'ZATCA VAT Portion (15%)'}</span>
                <span style={{ color: '#94A3B8' }}>SAR {vatDeduction.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#94A3B8' }}>{isAr ? 'رسوم التحويل الفوري (سريع)' : 'Sarie Payout Fee'}</span>
                <span style={{ color: '#00C853', fontWeight: 700 }}>{isAr ? 'مجاني (٠٫٠٠ ر.س)' : 'Free (SAR 0.00)'}</span>
              </div>
              <div style={{ height: '1px', backgroundColor: '#2A364F', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{isAr ? 'المبلغ الصافي المودع بالبنك' : 'Net Credited to Bank'}</span>
                <strong style={{ fontSize: '18px', fontWeight: 900, color: '#00C853' }}>SAR {effectiveSettleAmount.toFixed(2)}</strong>
              </div>
            </div>

            {/* Destination Bank & Security Pill */}
            <div
              style={{
                backgroundColor: '#080C14',
                border: '1px solid #1E293B',
                borderRadius: '14px',
                padding: '12px 14px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <Landmark size={22} color="#00C853" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {merchantInfo.settlementBank || 'Al Rajhi Bank'}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace', marginTop: '2px' }}>
                  {merchantInfo.settlementIban || 'SA44 8000 0456 6080 1012 3456'}
                </div>
              </div>
              <div style={{ fontSize: '10.5px', color: '#00C853', fontWeight: 800, backgroundColor: 'rgba(0, 200, 83, 0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                {isAr ? 'سريع فوري' : 'Sarie RTGS'}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={handleConfirmSettlementWithPin}
                className="interactive-tap"
                style={{
                  width: '100%',
                  height: '50px',
                  backgroundColor: '#00C853',
                  color: '#080C14',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(0, 200, 83, 0.4)',
                }}
              >
                <ShieldCheck size={18} />
                <span>{isAr ? 'تأكيد وتحويل فوري (MPIN)' : 'Authorize & Transfer Payout'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSettleModalOpen(false)}
                className="interactive-tap"
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: 'transparent',
                  color: '#94A3B8',
                  border: '1px solid #1E293B',
                  borderRadius: '14px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Settlement Success Receipt Modal */}
      {settledReceipt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          <div
            className="scale-up"
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '24px',
              padding: '28px 20px',
              width: '100%',
              maxWidth: '380px',
              boxSizing: 'border-box',
              textAlign: 'center',
              color: '#FFFFFF',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Animated Check Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 200, 83, 0.15)',
                border: '2px solid #00C853',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 0 24px rgba(0, 200, 83, 0.4)',
              }}
            >
              <CheckCircle2 size={36} color="#00C853" />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
              {isAr ? 'تمت التسوية البنكية بنجاح!' : 'Settlement Transferred!'}
            </h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 20px 0' }}>
              {isAr ? 'تم إيداع المبلغ مباشرة في حساب المنشأة عبر شبكة سريع' : 'Funds dispatched directly to your business account via Sarie RTGS'}
            </p>

            {/* Receipt Summary Card */}
            <div
              style={{
                backgroundColor: '#161F30',
                border: '1px solid #2A364F',
                borderRadius: '16px',
                padding: '16px',
                textAlign: isRtl ? 'right' : 'left',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '12.5px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>{isAr ? 'المبلغ المحول:' : 'Amount:'}</span>
                <strong style={{ color: '#00C853', fontSize: '14px' }}>SAR {settledReceipt.amount.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>{isAr ? 'البنك المستلم:' : 'Bank:'}</span>
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{settledReceipt.bankName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>{isAr ? 'رقم الحساب (آيبان):' : 'IBAN:'}</span>
                <span style={{ color: '#FFFFFF', fontFamily: 'monospace', fontSize: '11px' }}>{settledReceipt.ibanMasked}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>{isAr ? 'مرجع سريع (UTR):' : 'Sarie UTR:'}</span>
                <span style={{ color: '#CBD5E1', fontFamily: 'monospace', fontSize: '11px' }}>{settledReceipt.utr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>{isAr ? 'وقت التسوية:' : 'Time:'}</span>
                <span style={{ color: '#CBD5E1' }}>{settledReceipt.date}</span>
              </div>
            </div>

            {/* Dual Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSettledReceipt(null)}
                className="interactive-tap"
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: '#00C853',
                  color: '#080C14',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'تم، إغلاق الإيصال' : 'Done & Close Receipt'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSettledReceipt(null);
                  navigateTo('MERCHANT_COLLECTIONS');
                }}
                className="interactive-tap"
                style={{
                  width: '100%',
                  height: '42px',
                  backgroundColor: 'transparent',
                  color: '#94A3B8',
                  border: '1px solid #1E293B',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Receipt size={15} />
                <span>{isAr ? 'عرض كشف التسويات' : 'View in Settlements Statement'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Cash Sale Register Modal (with On-Screen Touch Register Keypad) */}
      {isCashModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div
            className="scale-up"
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '24px',
              padding: '20px 18px',
              width: '100%',
              maxWidth: '380px',
              boxSizing: 'border-box',
              color: '#FFFFFF',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
              direction: isRtl ? 'rtl' : 'ltr',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
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
                  <Banknote size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    {isAr ? 'تسجيل بيع نقدي' : 'Cash Sale Register'}
                  </h3>
                  <p style={{ fontSize: '11px', color: '#94A3B8', margin: '2px 0 0 0' }}>
                    {isAr ? 'حساب الضريبة والتحصيل فورياً' : 'Instant 15% VAT & SoundBox Log'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCashModalOpen(false)}
                className="interactive-tap"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: '#182236',
                  border: '1px solid #1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Prominent Amount Display Card */}
            <div
              style={{
                backgroundColor: '#0D1424',
                border: '1px solid #1A263D',
                borderRadius: '18px',
                padding: '14px 16px',
                textAlign: 'center',
                marginBottom: '10px',
                background: 'radial-gradient(ellipse at top, rgba(0, 200, 83, 0.1) 0%, #0D1424 70%)',
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#00C853', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
                {isAr ? 'المبلغ المستلم نقداً' : 'CASH AMOUNT TENDERED'}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '6px', direction: 'ltr' }}>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#00C853' }}>SAR</span>
                <span className="tabular-nums" style={{ fontSize: '36px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {cashNumValue.toFixed(2)}
                </span>
              </div>
              {cashNumValue > 0 && (
                <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600, marginTop: '4px' }}>
                  {isAr
                    ? `شامل ضريبة زاتكا ١٥٪ (${((cashNumValue - cashNumValue / 1.15)).toFixed(2)} ر.س)`
                    : `Includes SAR ${(cashNumValue - cashNumValue / 1.15).toFixed(2)} (15% VAT)`}
                </div>
              )}
            </div>

            {/* Quick-Add Cash Bills */}
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              {[10, 20, 50, 100, 500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickAddCash(amt)}
                  className="interactive-tap"
                  style={{
                    flex: 1,
                    backgroundColor: '#161F30',
                    border: '1px solid #1E293B',
                    borderRadius: '10px',
                    padding: '7px 0',
                    color: '#00C853',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  +{amt}
                </button>
              ))}
              <button
                type="button"
                onClick={handleCashClear}
                className="interactive-tap"
                style={{
                  padding: '7px 10px',
                  backgroundColor: 'rgba(235, 0, 27, 0.1)',
                  border: '1px solid rgba(235, 0, 27, 0.3)',
                  borderRadius: '10px',
                  color: '#FF5252',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'مسح' : 'Clear'}
              </button>
            </div>

            {/* 3x4 On-Screen POS Touch Keypad */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleCashDigit(digit)}
                  className="interactive-tap"
                  style={{
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#161F30',
                    border: '1px solid #1E293B',
                    color: '#FFFFFF',
                    fontSize: '18px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isAr ? formatLocalizedNumber(digit, language) : digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleCashDigit('00')}
                className="interactive-tap"
                style={{
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#161F30',
                  border: '1px solid #1E293B',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                00
              </button>
              <button
                type="button"
                onClick={() => handleCashDigit('0')}
                className="interactive-tap"
                style={{
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#161F30',
                  border: '1px solid #1E293B',
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isAr ? '٠' : '0'}
              </button>
              <button
                type="button"
                onClick={handleCashDelete}
                className="interactive-tap"
                style={{
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#161F30',
                  border: '1px solid #1E293B',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Delete size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                onClick={handleConfirmCashSale}
                disabled={cashNumValue <= 0}
                className="interactive-tap"
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: '#00C853',
                  color: '#080C14',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: cashNumValue > 0 ? 'pointer' : 'not-allowed',
                  opacity: cashNumValue > 0 ? 1 : 0.45,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 16px rgba(0, 200, 83, 0.35)',
                }}
              >
                <CheckCircle2 size={16} />
                <span>
                  {isAr
                    ? `تأكيد وقيد البيع النقدي (${cashNumValue.toFixed(2)} ر.س)`
                    : `Record Cash Sale (${cashNumValue.toFixed(2)} SAR)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
