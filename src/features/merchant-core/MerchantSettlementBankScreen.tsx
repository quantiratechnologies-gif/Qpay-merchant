import React, { useState } from 'react';
import { Landmark, Check, ArrowRight, ShieldCheck, ShieldAlert, Smartphone, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AppHeader } from '../../components/AppHeader';
import { colors, spacing, radii } from '../../design-system/tokens';

const VERIFIED_SAUDI_BANKS = [
  {
    name: 'Al Rajhi Bank',
    arabicName: 'مصرف الراجحي',
    iban: 'SA55 8000 0000 6271 5005',
    accountType: 'Corporate Settlement Account',
    code: '03',
  },
  {
    name: 'Saudi National Bank (SNB)',
    arabicName: 'البنك الأهلي السعودي (SNB)',
    iban: 'SA12 1000 0000 1903 4004',
    accountType: 'Business Current Account',
    code: '10',
  },
  {
    name: 'Riyad Bank',
    arabicName: 'بنك الرياض',
    iban: 'SA03 2000 0000 9397 1001',
    accountType: 'Commercial Settlement Account',
    code: '20',
  },
  {
    name: 'Alinma Bank',
    arabicName: 'مصرف الإنماء',
    iban: 'SA84 0500 0000 4102 2002',
    accountType: 'Corporate Account',
    code: '05',
  },
];

export const MerchantSettlementBankScreen: React.FC = () => {
  const { merchantInfo, updateMerchantInfo, navigateTo, language, isRtl, t } = useApp();
  const isAr = language === 'العربية';

  // State: Has merchant completed eKYC identity query?
  const [isKycDone, setIsKycDone] = useState<boolean>(merchantInfo.isKycVerified || false);
  const [isVerifyingKyc, setIsVerifyingKyc] = useState<boolean>(false);
  const [nafathModalOpen, setNafathModalOpen] = useState<boolean>(false);
  const [nafathCode, setNafathCode] = useState<number>(42);

  const [selectedBank, setSelectedBank] = useState<string>(merchantInfo.settlementBank || (isKycDone ? 'Al Rajhi Bank' : ''));
  const [selectedIban, setSelectedIban] = useState<string>(merchantInfo.settlementIban || (isKycDone ? 'SA55 8000 0000 6271 5005' : ''));

  const handleStartNafathKyc = () => {
    const randomCode = Math.floor(10 + Math.random() * 89);
    setNafathCode(randomCode);
    setNafathModalOpen(true);
  };

  const handleConfirmNafathKyc = () => {
    setIsVerifyingKyc(true);
    setTimeout(() => {
      setIsVerifyingKyc(false);
      setNafathModalOpen(false);
      setIsKycDone(true);
      setSelectedBank('Al Rajhi Bank');
      setSelectedIban('SA55 8000 0000 6271 5005');
      updateMerchantInfo({
        isKycVerified: true,
        settlementBank: 'Al Rajhi Bank',
        settlementIban: 'SA55 8000 0000 6271 5005',
      });
    }, 1500);
  };

  const handleSelectBank = (bank: typeof VERIFIED_SAUDI_BANKS[0]) => {
    setSelectedBank(bank.name);
    setSelectedIban(bank.iban);
  };

  const handleContinue = () => {
    if (!selectedBank || !isKycDone) return;
    updateMerchantInfo({
      settlementBank: selectedBank,
      settlementIban: selectedIban,
      isKycVerified: true,
    });
    navigateTo('MERCHANT_PIN_SETUP');
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bgPage,
        color: colors.textPrimary,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: spacing.space6,
        boxSizing: 'border-box',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <div>
        <AppHeader
          title={isAr ? 'التحقق البنكي وربط التسوية' : 'Bank eKYC & Settlement'}
          showBack={true}
          showSettings={false}
        />

        {/* Intro */}
        <div style={{ padding: `${spacing.space3} ${spacing.space5} ${spacing.space4} ${spacing.space5}` }}>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 800,
              margin: '0 0 6px 0',
              color: colors.textPrimary,
              letterSpacing: '-0.01em',
            }}
          >
            {isAr ? 'التحقق الإلكتروني (eKYC) واسترداد الحسابات' : 'Identity eKYC & Bank Accounts'}
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: colors.textSecondary,
              margin: 0,
              lineHeight: 1.45,
              fontWeight: 400,
            }}
          >
            {isAr
              ? 'وفقاً لتعليمات البنك المركزي السعودي (ساما)، يلزم التحقق من هوية المنشأة عبر نفاذ الوطني لاسترداد وربط الحسابات البنكية المعتمدة للتسوية.'
              : 'Per SAMA regulations, merchant identity verification via Nafath is required to retrieve and link verified corporate settlement accounts.'}
          </p>
        </div>

        {/* eKYC Status Banner / Action Card */}
        <div style={{ padding: `0 ${spacing.space5}`, marginBottom: '16px' }}>
          {!isKycDone ? (
            <div
              style={{
                backgroundColor: '#111726',
                border: '1.5px solid rgba(234, 179, 8, 0.4)',
                borderRadius: '16px',
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, #111726 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(234, 179, 8, 0.15)',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FBBF24',
                    flexShrink: 0,
                  }}
                >
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                    {isAr ? 'التحقق من الهوية مطلوب (eKYC)' : 'Identity eKYC Verification Required'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px', lineHeight: 1.4 }}>
                    {isAr
                      ? 'الرجاء توثيق الهوية عبر تطبيق نفاذ الوطني للربط مع البنوك المعتمدة بالسجل التجاري.'
                      : 'Please authenticate via Nafath National Identity to fetch commercial bank accounts linked to your CR.'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartNafathKyc}
                className="interactive-tap"
                style={{
                  width: '100%',
                  backgroundColor: '#00C853',
                  color: '#080C14',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '13.5px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(0, 200, 83, 0.35)',
                }}
              >
                <ShieldCheck size={18} />
                <span>{isAr ? 'التحقق الفوري عبر نفاذ (eKYC)' : 'Verify Identity via Nafath (eKYC)'}</span>
              </button>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#111726',
                border: '1.5px solid rgba(0, 200, 83, 0.4)',
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, rgba(0, 200, 83, 0.08) 0%, #111726 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(0, 200, 83, 0.15)',
                    border: '1px solid #00C853',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00C853',
                  }}
                >
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                    {isAr ? 'تم التحقق الإلكتروني (eKYC) بنجاح' : 'Nafath Identity eKYC Verified'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#00C853', fontWeight: 600 }}>
                    {isAr ? 'تم استرداد الحسابات الرسمية من ساما' : 'Official SAMA Directory Accounts Retrieved'}
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(0, 200, 83, 0.15)',
                  border: '1px solid #00C853',
                  color: '#00C853',
                  padding: '2px 8px',
                  borderRadius: '6px',
                }}
              >
                {isAr ? 'موثق' : 'Verified'}
              </span>
            </div>
          )}
        </div>

        {/* Section Header */}
        <div style={{ padding: `0 ${spacing.space5} 8px ${spacing.space5}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {isAr ? 'الحسابات البنكية المعتمدة' : 'VERIFIED SETTLEMENT ACCOUNTS'}
          </span>
          {isKycDone && (
            <span style={{ fontSize: '11px', color: '#00C853', fontWeight: 700 }}>
              {isAr ? 'جاهزة للربط الفوري' : 'Ready for Linking'}
            </span>
          )}
        </div>

        {/* Bank List */}
        <div style={{ padding: `0 ${spacing.space5}`, display: 'flex', flexDirection: 'column', gap: spacing.space2 }}>
          {!isKycDone ? (
            <div
              style={{
                backgroundColor: '#111726',
                border: '1px dashed #2A364F',
                borderRadius: '16px',
                padding: '28px 20px',
                textAlign: 'center',
                color: '#94A3B8',
              }}
            >
              <Lock size={32} color="#64748B" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                {isAr ? 'الحسابات مقفلة حتى إتمام eKYC' : 'Bank Accounts Locked until eKYC'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                {isAr
                  ? 'انقر على زر التحقق عبر نفاذ أعلاه لعرض حساباتك المصرفية الرسمية'
                  : 'Tap the Nafath eKYC button above to authenticate and unlock your registered bank accounts.'}
              </div>
            </div>
          ) : (
            VERIFIED_SAUDI_BANKS.map((bank) => {
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
                    padding: '14px 16px',
                    backgroundColor: isSelected ? 'rgba(0, 200, 83, 0.08)' : colors.bgCard,
                    border: `1.5px solid ${isSelected ? colors.accentGreen : colors.border}`,
                    borderRadius: radii.lg,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.space3 }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: radii.md,
                        backgroundColor: isSelected ? 'rgba(0, 200, 83, 0.12)' : colors.bgInset,
                        border: `1px solid ${isSelected ? 'rgba(0, 200, 83, 0.25)' : colors.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? colors.accentGreen : colors.textMuted,
                        flexShrink: 0,
                      }}
                    >
                      <Landmark size={20} />
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: isSelected ? 800 : 600,
                          color: isSelected ? colors.textPrimary : '#CBD5E1',
                        }}
                      >
                        {isAr ? bank.arabicName : bank.name}
                      </div>
                      <div
                        style={{
                          fontSize: '11.5px',
                          color: colors.textSecondary,
                          fontFamily: 'monospace',
                          marginTop: '2px',
                          direction: 'ltr',
                          textAlign: isRtl ? 'right' : 'left',
                        }}
                      >
                        {bank.iban}
                      </div>
                    </div>
                  </div>

                  {/* Selection Radio Indicator */}
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: radii.full,
                      backgroundColor: isSelected ? colors.accentGreen : 'transparent',
                      border: `1.5px solid ${isSelected ? colors.accentGreen : colors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#080C14',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && <Check size={13} strokeWidth={3} />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div style={{ padding: `0 ${spacing.space5}`, marginTop: spacing.space4 }}>
        <PrimaryButton onClick={handleContinue} disabled={!selectedBank || !isKycDone}>
          {t('btn.continue', 'Continue & Set Manager PIN')} <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        </PrimaryButton>
      </div>

      {/* Nafath eKYC Verification Dialog Modal */}
      {nafathModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
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
              border: '1.5px solid #1E293B',
              borderRadius: '24px',
              padding: '24px 20px',
              width: '100%',
              maxWidth: '380px',
              boxSizing: 'border-box',
              textAlign: 'center',
              color: '#FFFFFF',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Nafath National Identity Icon */}
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
                margin: '0 auto 14px auto',
                boxShadow: '0 0 24px rgba(0, 200, 83, 0.35)',
              }}
            >
              <Smartphone size={32} color="#00C853" />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
              {isAr ? 'التحقق عبر تطبيق نفاذ الوطني' : 'Nafath National Identity eKYC'}
            </h3>

            <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '0 0 16px 0', lineHeight: 1.4 }}>
              {isAr
                ? 'افتح تطبيق نفاذ على هاتفك المحمول واختر الرقم الظاهر أدناه لتأكيد الهوية واسترداد الحسابات البنكية'
                : 'Open the Nafath app on your mobile device and approve the matching number shown below to verify your commercial accounts:'}
            </p>

            {/* Prominent Matching Number */}
            <div
              style={{
                backgroundColor: '#080C14',
                border: '2px dashed #00C853',
                borderRadius: '18px',
                padding: '16px',
                marginBottom: '18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                {isAr ? 'رمز المطابقة في تطبيق نفاذ' : 'NAFATH MATCHING NUMBER'}
              </span>
              <span style={{ fontSize: '48px', fontWeight: 900, color: '#00C853', letterSpacing: '0.05em', lineHeight: 1.1, marginTop: '4px' }}>
                {nafathCode}
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={handleConfirmNafathKyc}
                disabled={isVerifyingKyc}
                className="interactive-tap"
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: '#00C853',
                  color: '#080C14',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 900,
                  cursor: isVerifyingKyc ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {isVerifyingKyc ? (
                  <span>{isAr ? 'جاري التحقق واسترداد الحسابات...' : 'Verifying & Fetching Accounts...'}</span>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>{isAr ? 'تمت الموافقة في نفاذ' : 'I Approved in Nafath'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setNafathModalOpen(false)}
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
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
