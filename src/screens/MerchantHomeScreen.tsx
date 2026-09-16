import React, { useState } from 'react';
import {
  Store,
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
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatLocalizedNumber } from '../utils/i18n';
import { AlphPayLogo } from '../components/AlphPayLogo';
import { LanguageSwitchPill } from '../components/LanguageSwitchPill';
import { Card, StatusBadge, SectionHeader, ListRow } from '../components/ui';
import { colors, spacing, radii } from '../design-system/tokens';

export const MerchantHomeScreen: React.FC = () => {
  const {
    merchantCollections,
    triggerSettleNow,
    navigateTo,
    speakSoundBox,
    language,
    isRtl,
  } = useApp();

  const [isSettling, setIsSettling] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

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
      await triggerSettleNow();
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
    // Clean instant action
  };

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: colors.bgPage,
        minHeight: '100vh',
        paddingBottom: '100px',
        color: colors.textPrimary,
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* 1. Top Sticky Header (Left: Store Icon, Center: Brand Logo, Right: Notifications & Profile) */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(8, 12, 20, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: `${spacing.space3} ${spacing.space5}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
            borderRadius: radii.md,
            backgroundColor: colors.bgInset,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.textPrimary,
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

        {/* Right: Language Switcher & Notification Icon Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space2 }}>
          <LanguageSwitchPill variant="compact" />
          
          {/* Notification Button */}
          <button
            onClick={() => navigateTo('NOTIFICATIONS')}
            aria-label="Notifications"
            className="interactive-tap"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: radii.full,
              backgroundColor: colors.bgInset,
              border: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.textPrimary,
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
                borderRadius: radii.full,
                backgroundColor: colors.accentGreen,
                border: `1.5px solid ${colors.bgInset}`,
              }}
            />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: `${spacing.space3} ${spacing.space5}`, display: 'flex', flexDirection: 'column', gap: spacing.space4 }}>
        {/* 2. Smart Soundbox Pro Banner */}
        <Card
          variant="interactive"
          onClick={() => navigateTo('SOUNDBOX_NOTIFIER')}
          style={{
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space3 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: radii.full,
                backgroundColor: colors.primaryLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.accentGreen,
                flexShrink: 0,
              }}
            >
              <Volume2 size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary }}>
                Smart Soundbox Pro
              </div>
              <div style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: 400, marginTop: '2px' }}>
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
              backgroundColor: colors.bgInset,
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary,
              borderRadius: radii.sm,
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Megaphone size={14} color={colors.accentGreen} />
            <span>{isAr ? 'اختبار' : 'Test'}</span>
          </button>
        </Card>

        {/* 3. Hero Today's Collection Card */}
        <Card
          variant="elevated"
          style={{
            padding: spacing.space5,
            position: 'relative',
          }}
        >
          {/* Card Top Row: Title + Live Badge + Balance Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.space2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space2 }}>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: colors.textSecondary }}>
                {isAr ? 'تحصيلات اليوم' : "Today's Collection"}
              </span>
              <StatusBadge
                status="success"
                dot={true}
                size="sm"
                label={isAr ? 'مباشر' : 'Live'}
              />
            </div>

            <button
              onClick={() => setShowBalance(!showBalance)}
              aria-label="Toggle Balance Visibility"
              className="interactive-tap"
              style={{
                background: 'none',
                border: 'none',
                color: colors.textSecondary,
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
          <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing.space2, marginBottom: spacing.space4 }}>
            <span style={{ fontSize: '18px', fontWeight: 600, color: colors.accentGreen }}>SAR</span>
            <span
              className="tabular-nums"
              style={{
                fontSize: '34px',
                fontWeight: 800,
                color: colors.textPrimary,
                letterSpacing: '-0.02em',
              }}
            >
              {showBalance
                ? displayTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '••••••'}
            </span>
          </div>

          {/* Inset Sub-Card: Payments Count & Avg Ticket */}
          <Card
            variant="inset"
            onClick={() => navigateTo('MERCHANT_INSIGHTS')}
            style={{
              padding: '12px 16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: spacing.space3,
              marginBottom: spacing.space4,
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: 500 }}>
                {isAr ? 'العمليات' : 'Payments'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: colors.textPrimary, marginTop: '2px' }}>
                {isAr ? `${formatLocalizedNumber(paymentCount, language)} عملية` : `${paymentCount} received`}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: 500 }}>
                {isAr ? 'متوسط العملية' : 'Avg Ticket'}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: colors.textPrimary, marginTop: '2px' }}>
                SAR {avgTicket}
              </div>
            </div>
          </Card>

          {/* Bottom Dual Action Buttons: Settle Now + Statement */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <button
              onClick={handleSettleNowClick}
              disabled={isSettling}
              className="interactive-tap"
              style={{
                backgroundColor: colors.accentGreen,
                color: '#080C14',
                border: 'none',
                borderRadius: radii.md,
                padding: '12px 14px',
                fontSize: '13.5px',
                fontWeight: 700,
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
                backgroundColor: colors.bgInset,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
                borderRadius: radii.md,
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
        </Card>

        {/* 4. Accept Payment Section (4 Grid Tiles) */}
        <div>
          <SectionHeader
            title={isAr ? 'قبول المدفوعات' : 'Accept Payment'}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {/* Tile 1: Show QR */}
            <Card
              variant="interactive"
              onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
              style={{
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.space2,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: radii.full,
                  backgroundColor: colors.primaryLight,
                  border: '1px solid rgba(0, 200, 83, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.accentGreen,
                }}
              >
                <QrCode size={20} />
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: colors.textPrimary, lineHeight: 1.2 }}>
                {isAr ? 'عرض الرمز' : 'Show QR'}
              </span>
            </Card>

            {/* Tile 2: Tap to Pay */}
            <Card
              variant="interactive"
              onClick={() => navigateTo('SOFTPOS_TERMINAL')}
              style={{
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.space2,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: radii.full,
                  backgroundColor: colors.primaryLight,
                  border: '1px solid rgba(0, 200, 83, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.accentGreen,
                }}
              >
                <SmartphoneNfc size={20} />
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: colors.textPrimary, lineHeight: 1.2 }}>
                {isAr ? 'الدفع باللمس' : 'Tap to Pay'}
              </span>
            </Card>

            {/* Tile 3: Send Link */}
            <Card
              variant="interactive"
              onClick={() => navigateTo('PAYMENT_LINK_GENERATOR')}
              style={{
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.space2,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: radii.full,
                  backgroundColor: colors.primaryLight,
                  border: '1px solid rgba(0, 200, 83, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.accentGreen,
                }}
              >
                <Share2 size={19} />
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: colors.textPrimary, lineHeight: 1.2 }}>
                {isAr ? 'إرسال رابط' : 'Send Link'}
              </span>
            </Card>

            {/* Tile 4: Cash Sale */}
            <Card
              variant="interactive"
              onClick={handleCashSale}
              style={{
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.space2,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: radii.full,
                  backgroundColor: colors.primaryLight,
                  border: '1px solid rgba(0, 200, 83, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.accentGreen,
                }}
              >
                <Banknote size={20} />
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: colors.textPrimary, lineHeight: 1.2 }}>
                {isAr ? 'بيع نقدي' : 'Cash Sale'}
              </span>
            </Card>
          </div>
        </div>

        {/* 5. Recent Payments Section */}
        <div>
          <SectionHeader
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{isAr ? 'المدفوعات الأخيرة' : 'Recent Payments'}</span>
                <span style={{ width: '6px', height: '6px', borderRadius: radii.full, backgroundColor: colors.accentGreen }} />
              </div>
            }
            actionButton={{
              label: isAr ? `عرض الكل (${paymentCount})` : `See All (${paymentCount})`,
              onClick: () => navigateTo('MERCHANT_COLLECTIONS'),
            }}
          />

          {/* Payment List Rows using ListRow primitive */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.space2 }}>
            {/* Row 1: Debit Card */}
            <ListRow
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              leftIcon={<CreditCard size={18} />}
              title="Debit Card • ****4021"
              subtitle={isAr ? 'تموينات • منذ دقيقتين' : 'Grocery • 2 mins ago'}
              rightAmount={
                <div style={{ color: colors.accentGreen, fontWeight: 800 }}>
                  + SAR 245.00
                </div>
              }
              showChevron={true}
            />

            {/* Row 2: Apple Pay */}
            <ListRow
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              leftIcon={<Smartphone size={18} />}
              title="Apple Pay"
              subtitle={isAr ? 'مشروبات • منذ ١٢ دقيقة' : 'Beverages • 12 mins ago'}
              rightAmount={
                <div style={{ color: colors.accentGreen, fontWeight: 800 }}>
                  + SAR 89.50
                </div>
              }
              showChevron={true}
            />

            {/* Row 3: Counter QR Code */}
            <ListRow
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              leftIcon={<QrCode size={18} />}
              title={isAr ? 'رمز QR المنضدة' : 'Counter QR Code'}
              subtitle={isAr ? 'نقطة بيع #٠٢ • منذ ٢٤ دقيقة' : 'Register #02 • 24 mins ago'}
              rightAmount={
                <div style={{ color: colors.accentGreen, fontWeight: 800 }}>
                  + SAR 512.00
                </div>
              }
              showChevron={true}
            />

            {/* Row 4: STC Pay Link */}
            <ListRow
              onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
              leftIcon={<Share2 size={18} />}
              title="STC Pay Link"
              subtitle={isAr ? 'توصيل واتساب • منذ ٤١ دقيقة' : 'WhatsApp Delivery • 41 mins ago'}
              rightAmount={
                <div style={{ color: colors.accentGreen, fontWeight: 800 }}>
                  + SAR 130.00
                </div>
              }
              showChevron={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
