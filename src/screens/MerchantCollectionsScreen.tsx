import React, { useState } from 'react';
import {
  Receipt,
  RotateCcw,
  CheckCircle2,
  X,
  Lock,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';
import type { MerchantCollection } from '../types';
import { SamaLogo } from '../components/SamaLogo';
import { PrimaryButton } from '../components/PrimaryButton';
import { AppHeader } from '../components/AppHeader';
import { translateText, formatSaudiCurrency } from '../utils/i18n';

export const MerchantCollectionsScreen: React.FC = () => {
  const {
    merchantCollections,
    processMerchantRefund,
    language,
    isRtl,
  } = useApp();

  const isAr = language === 'العربية';
  const [activeFilter, setActiveFilter] = useState<'all' | 'softpos' | 'qr' | 'link'>('all');
  const [selectedTxn, setSelectedTxn] = useState<MerchantCollection | null>(null);
  const [refundPin, setRefundPin] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundError, setRefundError] = useState('');
  const [refundSuccess, setRefundSuccess] = useState(false);

  const filtered = merchantCollections.filter((c) => {
    if (activeFilter === 'softpos') return c.paymentMethod.startsWith('softpos');
    if (activeFilter === 'qr') return c.paymentMethod === 'zatca_qr';
    if (activeFilter === 'link') return c.paymentMethod === 'payment_link';
    return true;
  });

  const totalSales = filtered.reduce((acc, c) => acc + (c.status === 'settled' ? c.amount : 0), 0);
  const totalVat = filtered.reduce((acc, c) => acc + (c.status === 'settled' ? c.vatAmount : 0), 0);

  const handleOpenRefundModal = (txn: MerchantCollection) => {
    if (txn.status === 'refunded') return;
    setSelectedTxn(txn);
    setRefundPin('');
    setRefundError('');
    setRefundSuccess(false);
  };

  const handleConfirmRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxn) return;
    setIsRefunding(true);
    setRefundError('');

    const success = await processMerchantRefund(selectedTxn.id, refundPin);
    setIsRefunding(false);

    if (success) {
      setRefundSuccess(true);
      setTimeout(() => {
        setSelectedTxn(null);
      }, 1200);
    } else {
      setRefundError(isAr ? 'رمز الأمان الخاص بالتاجر غير صحيح (الرمز الافتراضي: 2026)' : 'Incorrect Merchant Security PIN. (Default demo PIN: 2026)');
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100vh',
        backgroundColor: '#080C14',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: '24px',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Top Header */}
      <div>
        <AppHeader
          title={isAr ? 'سجل التحصيلات والفوترة' : 'Collections & ZATCA Ledger'}
          showBack={true}
          showSettings={false}
          rightAction={
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: 'rgba(127, 232, 127, 0.12)',
                border: '1px solid rgba(127, 232, 127, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7FE87F',
              }}
            >
              <Receipt size={18} />
            </div>
          }
        />

        {/* Total Ledger Summary Box */}
        <div
          style={{
            backgroundColor: '#111726',
            border: '1px solid #1E293B',
            borderRadius: '18px',
            padding: '16px 18px',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {isAr ? 'إجمالي التحصيلات المحددة' : 'Filtered Total Collections'}
              </div>
              <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>
                {formatCurrency(totalSales, language)}
              </div>
            </div>
            <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
                {isAr ? '١٥٪ ضريبة زاتكا' : '15% ZATCA VAT'}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#7FE87F', marginTop: '2px' }}>
                {formatSaudiCurrency(totalVat, language)}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {[
            { id: 'all', label: isAr ? 'جميع العمليات' : 'All Payments' },
            { id: 'softpos', label: isAr ? 'نقاط بيع Tap' : 'SoftPOS Tap' },
            { id: 'qr', label: isAr ? 'رمز زاتكا' : 'ZATCA QR' },
            { id: 'link', label: isAr ? 'روابط الدفع' : 'Payment Links' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id as any)}
              className="interactive-tap"
              style={{
                backgroundColor: activeFilter === f.id ? '#7FE87F' : '#111726',
                color: activeFilter === f.id ? '#000000' : '#94A3B8',
                border: activeFilter === f.id ? '1px solid #7FE87F' : '1px solid #1E293B',
                borderRadius: '12px',
                padding: '7px 14px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Collections List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => handleOpenRefundModal(c)}
              className="interactive-tap"
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: c.status === 'settled' ? 'pointer' : 'default',
                opacity: c.status === 'refunded' ? 0.6 : 1,
              }}
            >
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {c.orderRef} • {c.customerMasked}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                  {c.paymentMethod.replace('_', ' ').toUpperCase()} &bull; {isAr ? 'المرجع:' : 'Ref:'} {c.id} &bull; {translateText(c.date, language)}
                </div>
              </div>

              <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                <div className="tabular-nums" style={{ fontSize: '15px', fontWeight: 900, color: c.status === 'refunded' ? '#FF6B6B' : '#7FE87F' }}>
                  {c.status === 'refunded' ? (isAr ? 'مستردة' : 'REFUNDED') : `+${formatCurrency(c.amount, language)}`}
                </div>
                <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
                  {isAr ? `الضريبة: ${formatSaudiCurrency(c.vatAmount, language)}` : `VAT: SAR ${c.vatAmount.toFixed(2)}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refund Authorization Modal */}
      {selectedTxn && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box',
          }}
          onClick={() => !isRefunding && setSelectedTxn(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '22px',
              padding: '24px 20px',
              boxSizing: 'border-box',
              color: '#FFFFFF',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={18} color="#FF6B6B" />
                <span style={{ fontSize: '15px', fontWeight: 800 }}>{isAr ? 'تأكيد استرداد المبلغ' : 'Authorize Refund'}</span>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                style={{
                  background: '#1A2234',
                  border: '1px solid #1E293B',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8',
                  cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            </div>

            {refundSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={40} color="#7FE87F" style={{ margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'تم تأكيد الاسترداد بنجاح' : 'Refund Authorized'}
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                  {isAr
                    ? `تم إرجاع ${formatSaudiCurrency(selectedTxn.amount, language)} إلى حساب العميل البنكي فورياً.`
                    : `SAR ${selectedTxn.amount.toFixed(2)} returned to customer bank account.`}
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmRefund} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ backgroundColor: '#1A2234', borderRadius: '12px', padding: '12px', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#94A3B8' }}>{isAr ? 'العملية:' : 'Transaction:'}</span>
                    <span style={{ fontWeight: 700 }}>{selectedTxn.orderRef}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94A3B8' }}>{isAr ? 'مبلغ الاسترداد:' : 'Refund Amount:'}</span>
                    <span style={{ fontWeight: 900, color: '#FF6B6B' }}>{formatSaudiCurrency(selectedTxn.amount, language)}</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    {isAr ? 'أدخل الرمز السري للتاجر (٤ أرقام)' : 'Enter 4-Digit Merchant PIN'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1A2234', border: '1px solid #1E293B', borderRadius: '12px', padding: '12px 14px' }}>
                    <Lock size={16} color="#7FE87F" style={{ marginRight: isRtl ? 0 : '10px', marginLeft: isRtl ? '10px' : 0 }} />
                    <input
                      type="password"
                      maxLength={4}
                      value={refundPin}
                      onChange={(e) => setRefundPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      required
                      style={{
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        color: '#FFFFFF',
                        fontSize: '18px',
                        fontWeight: 900,
                        letterSpacing: '0.2em',
                        width: '100%',
                        direction: 'ltr',
                        textAlign: isRtl ? 'right' : 'left',
                      }}
                    />
                  </div>
                </div>

                {refundError && (
                  <div style={{ fontSize: '11.5px', color: '#FF6B6B', fontWeight: 700 }}>
                    {refundError}
                  </div>
                )}

                <PrimaryButton type="submit" disabled={isRefunding || refundPin.length < 4}>
                  {isRefunding
                    ? (isAr ? 'جاري معالجة الاسترداد...' : 'Processing Refund...')
                    : (isAr ? `تأكيد استرداد ${formatSaudiCurrency(selectedTxn.amount, language)}` : `Confirm Refund SAR ${selectedTxn.amount.toFixed(2)}`)}
                </PrimaryButton>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SAMA Dock */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
        <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>
          {isAr ? 'سجل تسوية للمنشآت خاضع لإشراف البنك المركزي السعودي' : 'SAMA Regulated Corporate Settlement Ledger'}
        </span>
        <SamaLogo height={14} themeMode="green" />
      </div>
    </div>
  );
};

