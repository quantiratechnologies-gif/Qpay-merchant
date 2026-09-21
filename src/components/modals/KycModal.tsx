import React, { useState, useRef } from 'react';
import { X, ShieldCheck, CheckCircle2, FileText, UserCheck, ArrowRight, Loader2, UploadCloud, Paperclip } from 'lucide-react';
import { useApp } from '../../state/AppContext';
import { ZatcaLogo } from '../../components/ZatcaLogo';
import { PrimaryButton } from '../../components/PrimaryButton';

export const KycModal: React.FC = () => {
  const { isKycModalOpen, setIsKycModalOpen, merchantInfo, updateMerchantInfo, navigateTo, t, isRtl, language } = useApp();
  const [nationalId, setNationalId] = useState(merchantInfo.nationalId || '1098472910');
  const [crNumber, setCrNumber] = useState((merchantInfo.crNumber || '1010849201').replace(/^CR-?/i, ''));
  const [docName, setDocName] = useState('');
  const [docUploaded, setDocUploaded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    if (!crNumber.trim() || crNumber.trim().length < 10) {
      setErrorMsg(language === 'العربية' ? 'يرجى إدخال رقم السجل التجاري المكون من ١٠ أرقام.' : 'Please enter your 10-digit Commercial Registration (CR) Number.');
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
        crNumber: crNumber.replace(/\D/g, ''),
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
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 2600,
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
          backgroundColor: '#111726',
          border: '1px solid #1E293B',
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
                backgroundColor: 'rgba(0, 200, 83, 0.12)',
                border: '1px solid rgba(0, 200, 83, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} color="#00C853" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                {t('sec.absher_kyc', 'Absher & ZATCA e-KYC')}
              </h3>
              <span style={{ fontSize: '11px', color: '#00C853', fontWeight: 700 }}>
                {language === 'العربية' ? 'التحقق التجاري عبر أبشر' : 'Absher Business Validation'}
              </span>
            </div>
          </div>

          <button
            onClick={() => !isVerifying && setIsKycModalOpen(false)}
            aria-label={t('btn.close', 'Close')}
            style={{
              background: '#1A2234',
              border: '1px solid #1E293B',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#94A3B8',
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
                backgroundColor: 'rgba(0, 200, 83, 0.12)',
                border: '1.5px solid #00C853',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <CheckCircle2 size={36} color="#00C853" />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0' }}>
              {language === 'العربية' ? 'تم التحقق من الهوية عبر منصة أبشر' : 'Identity Verified via Absher'}
            </h4>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
              {language === 'العربية'
                ? 'تم استيفاء متطلبات التحقق وهيئة الزكاة. جاري الانتقال للملف التجاري...'
                : 'Regulatory verification requirements fulfilled. Directing to Merchant Business Profile...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* National ID / Iqama */}
            <div>
              <label
                style={{
                  fontSize: '12px', fontWeight: 500, color: '#94A3B8',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                {language === 'العربية' ? 'رقم الهوية الوطنية / الإقامة للمالك' : 'Owner National ID / Iqama'}
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#161F30',
                  border: '1px solid #2A364F',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  gap: '10px',
                }}
              >
                <UserCheck size={18} color="#00C853" />
                <input
                  type="tel"
                  maxLength={10}
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="10XXXXXXXX"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 700,
                    width: '100%',
                  }}
                />
              </div>
            </div>

            {/* Commercial Registration (CR) */}
            <div>
              <label
                style={{
                  fontSize: '12px', fontWeight: 500, color: '#94A3B8',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                {language === 'العربية' ? 'رقم السجل التجاري (CR)' : 'Commercial Registration (CR) Number'}
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#161F30',
                  border: '1px solid #2A364F',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  gap: '10px',
                }}
              >
                <FileText size={18} color="#00C853" />
                <input
                  type="tel"
                  maxLength={10}
                  value={crNumber}
                  onChange={(e) => setCrNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="1010849201"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 700,
                    width: '100%',
                    fontFamily: 'monospace',
                  }}
                />
              </div>
            </div>

            {/* Commercial License & ZATCA Certificate PDF Document Upload */}
            <div>
              <label
                style={{
                  fontSize: '12px', fontWeight: 500, color: '#94A3B8',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                {language === 'العربية' ? 'وثيقة السجل التجاري / الشهادة الضريبية (ملف PDF فقط)' : 'Commercial Registration / ZATCA Certificate (PDF Only)'}
              </label>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="application/pdf,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
                    if (!isPdf) {
                      setErrorMsg(
                        language === 'العربية'
                          ? 'نوع الملف غير صالح. يُقبل فقط المستندات بصيغة PDF الرسمية.'
                          : 'Invalid file type. Only official PDF documents are accepted.'
                      );
                      setDocUploaded(false);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      return;
                    }
                    setErrorMsg('');
                    setDocName(file.name);
                    setDocUploaded(true);
                  }
                }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="interactive-tap"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#161F30',
                  border: '1px dashed #00C853',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                  <Paperclip size={18} color="#00C853" style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {docName || (language === 'العربية' ? 'السجل_التجاري_المعتمد.pdf' : 'Commercial_Registration_Certificate.pdf')}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      {docUploaded ? (language === 'العربية' ? 'مرفق ومتحقق منه (PDF • 1.4 MB)' : 'Attached & Verified (PDF • 1.4 MB)') : (language === 'العربية' ? 'انقر لرفع ملف PDF من جهازك' : 'Tap to browse PDF document')}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    backgroundColor: 'rgba(0, 200, 83, 0.15)',
                    color: '#00C853',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0,
                  }}
                >
                  <UploadCloud size={13} />
                  {language === 'العربية' ? 'تغيير' : 'Change'}
                </span>
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
                backgroundColor: 'rgba(0, 200, 83, 0.06)',
                border: '1px solid rgba(0, 200, 83, 0.2)',
                borderRadius: '12px',
                padding: '10px 14px',
                marginTop: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ZatcaLogo variant="icon" size={18} />
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                  {language === 'العربية' ? 'معتمد من هيئة الزكاة والضريبة والجمارك (ZATCA)' : 'ZATCA Tax Compliant'}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '8px' }}>
              <PrimaryButton type="submit" disabled={isVerifying || nationalId.length < 10 || crNumber.trim().length < 10}>
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
