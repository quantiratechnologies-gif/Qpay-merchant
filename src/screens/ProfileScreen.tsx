import React from 'react';
import {
  Store,
  ShieldCheck,
  QrCode,
  SlidersHorizontal,
  CreditCard,
  Users,
  Languages,
  LogOut,
  Building2,
  LayoutGrid,
  Check,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Card, StatusBadge, ListRow } from '../components/ui';
import { colors, spacing, radii } from '../design-system/tokens';

export const ProfileScreen: React.FC = () => {
  const {
    merchantInfo,
    language,
    navigateTo,
    setIsLanguageModalOpen,
    setIsLogoutModalOpen,
    setIsKycModalOpen,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: colors.bgPage,
        minHeight: '100vh',
        paddingBottom: '96px',
        color: colors.textPrimary,
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* 1. Top Screen Header */}
      <div
        style={{
          padding: `${spacing.space5} ${spacing.space5} ${spacing.space3} ${spacing.space5}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space2 }}>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 900,
                margin: 0,
                color: colors.textPrimary,
                letterSpacing: '-0.02em',
              }}
            >
              {isAr ? 'متجري' : 'My Store'}
            </h1>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: radii.full,
                backgroundColor: colors.accentGreen,
                display: 'inline-block',
                boxShadow: `0 0 8px ${colors.accentGreen}`,
              }}
            />
          </div>
          <p
            style={{
              fontSize: '12.5px',
              color: colors.textSecondary,
              margin: '4px 0 0 0',
              fontWeight: 500,
            }}
          >
            {isAr ? 'إدارة ملف المتجر والأجهزة والامتثال' : 'Manage store profile, hardware & compliance'}
          </p>
        </div>

        {/* Quick Hub Grid Icon Button */}
        <button
          type="button"
          onClick={() => navigateTo('MERCHANT_WEB')}
          aria-label="App Hub"
          className="interactive-tap"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: radii.md,
            backgroundColor: colors.bgCard,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.textSecondary,
            cursor: 'pointer',
          }}
        >
          <LayoutGrid size={18} />
        </button>
      </div>

      {/* Main Container */}
      <div style={{ padding: `0 ${spacing.space5}`, display: 'flex', flexDirection: 'column', gap: spacing.space3 }}>
        {/* 2. Settlement Account Card */}
        <Card
          variant="elevated"
          style={{
            padding: '16px 18px',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.space3,
            }}
          >
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                color: colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {isAr ? 'حساب التسوية البنكي' : 'SETTLEMENT ACCOUNT'}
            </span>

            <StatusBadge
              status="success"
              size="sm"
              label={isAr ? 'الأساسي' : 'Primary'}
            />
          </div>

          {/* Account Details Row */}
          <div
            onClick={() => navigateTo('MERCHANT_BANK_LINK')}
            className="interactive-tap"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space3 }}>
              {/* Bank Squircle Badge */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: radii.md,
                  backgroundColor: colors.primaryLight,
                  border: '1px solid rgba(0, 200, 83, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.accentGreen,
                  flexShrink: 0,
                }}
              >
                <Building2 size={22} />
              </div>

              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: colors.textPrimary }}>
                  {merchantInfo.settlementBank || 'Al Rajhi Bank'}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: colors.textSecondary,
                    marginTop: '2px',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                  dir="ltr"
                >
                  •••• {merchantInfo.settlementIban ? merchantInfo.settlementIban.slice(-9) : '6271 5005'}
                </div>
              </div>
            </div>

            {/* Bank Verified Tag */}
            <StatusBadge
              status="success"
              size="sm"
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={12} color={colors.accentGreen} strokeWidth={3} />
                  {isAr ? 'حساب موثق' : 'Bank Verified'}
                </span>
              }
            />
          </div>
        </Card>

        {/* 3. Core Store Management Group (Group 1) */}
        <div>
          {/* Row 1: Business Profile */}
          <ListRow
            onClick={() => navigateTo('MERCHANT_SETUP')}
            leftIcon={<Store size={18} />}
            title={isAr ? 'ملف المنشأة' : 'Business Profile'}
            subtitle={isAr ? 'عرض وتعديل بيانات السجل والضريبة' : 'View & edit store & tax info'}
            showChevron={true}
          />

          {/* Row 2: KYC Verification */}
          <ListRow
            onClick={() => setIsKycModalOpen(true)}
            leftIcon={<ShieldCheck size={18} />}
            title={isAr ? 'التحقق والامتثال' : 'KYC Verification'}
            subtitle={isAr ? 'توثيق معتمد لرفع سقوف التحصيل' : 'Unlock exclusive tier benefits'}
            rightBadge={
              <StatusBadge
                status="success"
                size="sm"
                label={isAr ? 'موثق' : 'Verified'}
              />
            }
            showChevron={true}
          />

          {/* Row 3: Manage QR */}
          <ListRow
            onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
            leftIcon={<QrCode size={18} />}
            title={isAr ? 'إدارة الباركود' : 'Manage QR'}
            subtitle={isAr ? 'طباعة ومشاركة باركود المتجر' : 'Manage & order store QR'}
            showChevron={true}
          />

          {/* Row 4: Manage Business (Payment Settings) */}
          <ListRow
            onClick={() => navigateTo('SECURITY')}
            leftIcon={<SlidersHorizontal size={18} />}
            title={isAr ? 'إدارة الأعمال' : 'Manage Business'}
            subtitle={isAr ? 'إعدادات الدفع' : 'Payment settings'}
            showChevron={true}
          />
        </div>

        {/* 4. Operations & Settings Group (Group 2) */}
        <div>
          {/* Row 1: Payment Instruments */}
          <ListRow
            onClick={() => navigateTo('SOFTPOS_TERMINAL')}
            leftIcon={<CreditCard size={18} />}
            title={isAr ? 'أجهزة وطرق الدفع' : 'Payment Instruments'}
            showChevron={true}
          />

          {/* Row 2: Manage Staff */}
          <ListRow
            onClick={() => navigateTo('MERCHANT_WEB')}
            leftIcon={<Users size={18} />}
            title={isAr ? 'إدارة طاقم العمل' : 'Manage Staff'}
            rightElement={
              <span style={{ fontSize: '12px', color: colors.textSecondary, fontWeight: 600 }}>
                {isAr ? '٣ نشطين' : '3 Active'}
              </span>
            }
            showChevron={true}
          />

          {/* Row 3: Change Language */}
          <ListRow
            onClick={() => setIsLanguageModalOpen(true)}
            leftIcon={<Languages size={18} />}
            title={isAr ? 'تغيير اللغة' : 'Change Language'}
            rightElement={
              <span style={{ fontSize: '12px', color: colors.textSecondary, fontWeight: 600 }}>
                English (EN) / العربية
              </span>
            }
            showChevron={true}
          />
        </div>

        {/* 5. Logout Group (Group 3) */}
        <div>
          <ListRow
            danger={true}
            onClick={() => setIsLogoutModalOpen(true)}
            leftIcon={<LogOut size={18} />}
            title={isAr ? 'تسجيل الخروج من الحساب' : 'Log Out Account'}
            showChevron={true}
          />
        </div>

        {/* Quantira Technologies Dock */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
          <span style={{ fontSize: '10.5px', color: colors.textMuted, fontWeight: 700 }}>
            {isAr ? 'منصة مدفوعات تجارية مدعومة بتقنيات كوانتيرا' : 'Merchant Platform • Powered by Quantira Technologies'}
          </span>
        </div>
      </div>
    </div>
  );
};
