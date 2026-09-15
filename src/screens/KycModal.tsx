import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, FileText, UserCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { SamaLogo } from '../components/SamaLogo';
import { ZatcaLogo } from '../components/ZatcaLogo';
import { PrimaryButton } from '../components/PrimaryButton';

export const KycModal: React.FC = () => {
  const { isKycModalOpen, setIsKycModalOpen, merchantInfo, updateMerchantInfo, navigateTo, t, isRtl, language } = useApp();
  const [nationalId, setNationalId] = useState(merchantInfo.nationalId || '1098472910');
  const [crNumber, setCrNumber] = useState(merchantInfo.crNumber || 'CR-1010849201');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isKycModalOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (nationalId.replace(/\D/g, '').length < 10) {
      setErrorMsg(language === 'العربية' ? 'يرجى إدخال رقم هوية وطنية أو إقامة صحيح من ١٠ أرقام.' : 'Please enter a valid 10-digit National ID or Iqama Number.');
      return;
    }
    if (!crNumber.trim()) {
      setErrorMsg(language === 'العربية' ? 'يرجى إدخال رقم السجل التجاري للمنشأة.' : 'Please enter your Commercial Registration (CR) Number.');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);

    // Simulate Absher & SAMA/ZATCA National Database Verification
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      updateMerchantInfo({
        nationalId,
        crNumber: crNumber.toUpperCase().startsWith('CR-') ? crNumber.toUpperCase() : `CR-${crNumber.toUpperCase()}`,
        isKycVerified: true,
      });

      setTimeout(() => {
        setIsKycModalOpen(false);
        navigateTo('MERCHANT_SETUP');
      }, 1200);
    }, 1500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
      onClick={() => !isVerifying && setIsKycModalOpen(false)}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#151524',
          border: '1px solid #2C2C44',
          borderRadius: '24px',
          padding: '26px 22px',
          boxSizing: 'border-box',
          boxShadow: 'none',
          color: '#FFFFFF',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(127, 232, 127, 0.12)',
                border: '1px solid rgba(127, 232, 127, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} color="#7FE87F" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                {t('sec.absher_kyc', 'SAMA & ZATCA e-KYC')}
              </h3>
              <span style={{ fontSize: '11px', color: '#7FE87F', fontWeight: 700 }}>
                {language === 'العربية' ? 'التحقق التجاري عبر أبشر' : 'Absher Business Validation'}
              </span>
            </div>
          </div>

          <button
            onClick={() => !isVerifying && setIsKycModalOpen(false)}
            aria-label={t('btn.close', 'Close')}
            style={{
              background: '#1E1E32',
              border: '1px solid #2C2C44',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#A2A2BA',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {verifiedSuccess ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }} className="fade-in">
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(127, 232, 127, 0.15)',
                border: '1.5px solid #7FE87F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <CheckCircle2 size={36} color="#7FE87F" />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0' }}>
              {language === 'العربية' ? 'تم التحقق من الهوية عبر منصة أبشر' : 'Identity Verified via Absher'}
            </h4>
            <p style={{ fontSize: '13px', color: '#A2A2BA', margin: 0 }}>
              {language === 'العربية'
                ? 'تم استيفاء متطلبات البنك المركزي وهيئة الزكاة. جاري الانتقال للملف التجاري...'
                : 'SAMA regulatory requirements fulfilled. Directing to Merchant Business Profile...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* National ID / Iqama */}
            <div>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#A2A2BA',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                {t('sec.national_id', 'National ID / Iqama Number (10 Digits)')}
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#1E1E32',
                  border: '1px solid #2C2C44',
                  borderRadius: '14px',
                  padding: '13px 16px',
                }}
              >
                <UserCheck size={18} color="#7FE87F" style={{ marginInlineEnd: '12px', flexShrink: 0 }} />
                <input
                  type="text"
                  maxLength={10}
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="1098472910"
                  required
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    width: '100%',
                    fontVariantNumeric: 'tabular-nums',
                    direction: 'ltr',
                    textAlign: isRtl ? 'right' : 'left',
                  }}
                />
              </div>
            </div>

            {/* Commercial Registration (CR) Number */}
            <div>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#A2A2BA',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                {t('zatca.cr_number', 'Commercial Registration (CR) Number')}
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#1E1E32',
                  border: '1px solid #2C2C44',
                  borderRadius: '14px',
                  padding: '13px 16px',
                }}
              >
                <FileText size={18} color="#7FE87F" style={{ marginInlineEnd: '12px', flexShrink: 0 }} />
                <input
                  type="text"
                  value={crNumber}
                  onChange={(e) => setCrNumber(e.target.value)}
                  placeholder="CR-1010849201"
                  required
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    width: '100%',
                    textTransform: 'uppercase',
                    direction: 'ltr',
                    textAlign: isRtl ? 'right' : 'left',
                  }}
                />
              </div>
            </div>

            {errorMsg && (
              <div style={{ fontSize: '12px', color: '#FF6B6B', fontWeight: 700 }}>
                {errorMsg}
              </div>
            )}

            {/* Trust badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(127, 232, 127, 0.06)',
                border: '1px solid rgba(127, 232, 127, 0.2)',
                borderRadius: '12px',
                padding: '10px 14px',
                marginTop: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ZatcaLogo variant="icon" size={18} />
                <span style={{ fontSize: '11px', color: '#A2A2BA', fontWeight: 600 }}>
                  {language === 'العربية' ? 'معتمد من ساما وهيئة الزكاة والضريبة (ZATCA)' : 'SAMA & ZATCA Verified'}
                </span>
              </div>
              <SamaLogo height={16} themeMode="green" />
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '8px' }}>
              <PrimaryButton type="submit" disabled={isVerifying || nationalId.length < 10 || !crNumber.trim()}>
                {isVerifying ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />{' '}
                    {language === 'العربية' ? 'جاري التحقق عبر أبشر...' : 'Verifying with Absher...'}
                  </>
                ) : (
                  <>
                    {t('btn.verify', 'Verify & Continue')}{' '}
                    <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
                  </>
                )}
              </PrimaryButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
