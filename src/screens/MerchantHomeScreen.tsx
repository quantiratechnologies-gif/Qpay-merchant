import React, { useState } from 'react';
import {
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
  Building2,
  CreditCard,
  TrendingUp,
  Download,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { formatLocalizedNumber } from '../utils/i18n';
import { Card, StatusBadge, SectionHeader } from '../components/ui';
import { colors } from '../design-system/tokens';
import { X, CheckCircle2, FileText } from 'lucide-react';

export const MerchantHomeScreen: React.FC = () => {
  const {
    merchantCollections,
    merchantSettlements,
    merchantInfo,
    triggerSettleNow,
    processMerchantCollection,
    navigateTo,
    speakSoundBox,
    openManagerPinModal,
    language,
    isRtl,
  } = useApp();

  const [isSettling, setIsSettling] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [settlementReceipt, setSettlementReceipt] = useState<any | null>(null);
  const [isCashSaleModalOpen, setIsCashSaleModalOpen] = useState(false);
  const [cashAmount, setCashAmount] = useState('');
  const [cashNote, setCashNote] = useState('');
  const [cashSuccess, setCashSuccess] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const isAr = language === 'العربية';
  const totalToday = merchantCollections.reduce(
    (acc, c) => acc + (c.status === 'settled' ? c.amount : 0),
    0
  );
  const displayTotal = totalToday > 0 ? totalToday : 14850.5;
  const paymentCount = 142;
  const avgTicket = (displayTotal / paymentCount).toFixed(2);

  const handleSettleNowClick = () => {
    openManagerPinModal({
      title: isAr ? 'تأكيد التسوية الفورية عبر سريع' : 'Authorize Instant Settlement',
      subtitle: isAr
        ? 'أدخل رمز المدير السري لإتمام الصرف الفوري'
        : 'Enter Manager Security PIN to dispatch Sarie instant payout',
      onSuccess: async () => {
        setIsSettling(true);
        try {
          const settlement = await triggerSettleNow();
          setSettlementReceipt(settlement);
          showToast(
            isAr
              ? `تمت التسوية بنجاح! رقم الدفعة: ${settlement.id} عبر نظام سريع (SAMA IPS)`
              : `Settlement ${settlement.id} successfully dispatched via SAMA IPS Clearing`
          );
        } finally {
          setIsSettling(false);
        }
      },
    });
  };

  const handleRecordCashSale = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(cashAmount);
    if (isNaN(amount) || amount <= 0) return;

    await processMerchantCollection({
      amount,
      paymentMethod: 'cash',
      orderRef: 'CSH-' + Math.floor(1000 + Math.random() * 9000).toString(),
      customerMasked: cashNote ? `${cashNote} (Cash)` : (isAr ? 'بيع نقدي مباشر' : 'Direct Cash Sale'),
    });

    setCashSuccess(true);
    setTimeout(() => {
      setCashSuccess(false);
      setIsCashSaleModalOpen(false);
      setCashAmount('');
      setCashNote('');
      showToast(isAr ? 'تم تسجيل العملية النقدية بنجاح' : 'Cash sale recorded successfully');
    }, 1200);
  };

  const handleDownloadSettlementReport = () => {
    const dateStr = new Date().toLocaleDateString('en-GB');
    const html = `<!DOCTYPE html>
<html>
<head><title>SAMA Settlement Report - ${merchantInfo.businessName}</title>
<style>
  body { font-family: -apple-system, sans-serif; padding: 32px; color: #111; }
  .header { border-bottom: 2px solid #00C853; padding-bottom: 12px; margin-bottom: 20px; }
  .box { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px; border-radius: 8px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th, td { padding: 10px; border-bottom: 1px solid #E2E8F0; text-align: left; font-size: 13px; }
  th { background: #EDF2F7; font-size: 12px; }
</style>
</head>
<body>
  <div class="header">
    <h2>QTPay Merchant • SAMA Sarie Settlement Report</h2>
    <div>Merchant: <strong>${merchantInfo.businessName}</strong> | CR: <strong>${merchantInfo.crNumber}</strong> | VAT: <strong>${merchantInfo.vatNumber}</strong></div>
    <div>Generated: ${dateStr} | SAMA IPS Clearing Rail</div>
  </div>
  <div class="box">
    <div><strong>Settlement Destination:</strong> ${merchantInfo.settlementBank}</div>
    <div><strong>IBAN:</strong> ${merchantInfo.settlementIban}</div>
    <div><strong>Today's Settled Volume:</strong> SAR ${displayTotal.toFixed(2)}</div>
    <div><strong>Status:</strong> Dispatched via SAMA IPS Clearing</div>
  </div>
  <table>
    <thead><tr><th>Settlement Ref</th><th>Sarie UTR</th><th>Gross (SAR)</th><th>15% VAT (SAR)</th><th>Status</th></tr></thead>
    <tbody>
      ${merchantSettlements.slice(0, 10).map(s => `<tr><td>${s.id}</td><td>${s.utr}</td><td>${s.amount.toFixed(2)}</td><td>${s.vatAmount.toFixed(2)}</td><td><strong style="color: #00C853;">DISPATCHED</strong></td></tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QTPay_Settlement_Report_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(isAr ? 'تم تنزيل تقرير التسويات بنجاح' : 'Settlement report downloaded');
  };

  const handleTestSoundBox = () => {
    speakSoundBox(245.0);
  };

  return (
    <div
      className="fade-in"
      style={{
        width: '100%',
        color: colors.textPrimary,
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
        fontFamily: "'IBM Plex Sans Arabic', 'Inter', sans-serif",
      }}
    >
      {/* 1. Top Enterprise Metric KPI Strip (4 Columns) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* Metric 1: Today's Gross Collections */}
        <Card variant="elevated" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 600 }}>
              {isAr ? 'تحصيلات اليوم الإجمالية' : "Today's Gross Sales"}
            </span>
            <StatusBadge status="success" dot={true} size="sm" label={isAr ? 'مباشر' : 'Live'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span style={{ fontSize: '15px', color: '#00FF24', fontWeight: 800 }}>SAR</span>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              {showBalance ? displayTotal.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '••••••'}
            </span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '6px', fontWeight: 500 }}>
            {isAr ? 'شامل ١٥٪ ضريبة القيمة المضافة' : 'Includes 15% VAT breakdown'}
          </div>
        </Card>

        {/* Metric 2: Unsettled Balance */}
        <Card variant="elevated" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 600 }}>
              {isAr ? 'الرصيد القابل للتسوية' : 'Unsettled Available'}
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              aria-label="Toggle Balance Visibility"
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
            >
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span style={{ fontSize: '15px', color: '#00FF24', fontWeight: 800 }}>SAR</span>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#00FF24', letterSpacing: '-0.02em' }}>
              {showBalance ? displayTotal.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '••••••'}
            </span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#00FF24', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={13} />
            <span>{isAr ? 'تحويل فوري ٢٤/٧ عبر سريع' : 'Ready for Instant Sarie Payout'}</span>
          </div>
        </Card>

        {/* Metric 3: Total Transactions Count */}
        <Card variant="elevated" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 600 }}>
              {isAr ? 'عدد العمليات اليوم' : 'Total Transactions'}
            </span>
            <TrendingUp size={16} color="#00FF24" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', marginTop: '10px' }}>
            {formatLocalizedNumber(paymentCount, language)}
          </div>
          <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '6px', fontWeight: 500 }}>
            {isAr ? '+١٨٪ مقارنة بالأمس' : '+18.4% vs yesterday'}
          </div>
        </Card>

        {/* Metric 4: Average Ticket Size */}
        <Card variant="elevated" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#94A3B8', fontWeight: 600 }}>
              {isAr ? 'متوسط قيمة العملية' : 'Average Ticket'}
            </span>
            <CreditCard size={16} color="#00FF24" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span style={{ fontSize: '15px', color: '#00FF24', fontWeight: 800 }}>SAR</span>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              {avgTicket}
            </span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '6px', fontWeight: 500 }}>
            {isAr ? 'مدى وأبل باي والبطاقات' : 'mada, Apple Pay, & Cards'}
          </div>
        </Card>
      </div>

      {/* 2. Responsive Dashboard Grid */}
      <div className="merchant-home-grid">
        {/* Left Column (65%): SoundBox Alert, Quick Action Hub & Recent Collections Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Smart SoundBox Pro Status Card */}
          <Card
            variant="interactive"
            onClick={() => navigateTo('SOUNDBOX_NOTIFIER')}
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#0E1422',
              border: '1px solid rgba(0, 255, 36, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 255, 36, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00FF24',
                  flexShrink: 0,
                }}
              >
                <Volume2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'جهاز الإشعار الصوتي الذكي (SoundBox Pro)' : 'Smart SoundBox Pro Speaker'}
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                  {isAr ? 'متصل بشبكة الجيل الرابع 4G • بطارية ٩٨٪ • نطق صوتي فوري بالعربية' : 'Connected via 4G • Battery 98% • Instant Arabic & English voice'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTestSoundBox();
              }}
              className="interactive-tap"
              style={{
                backgroundColor: '#151C2C',
                border: '1px solid #1E293B',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Megaphone size={14} color="#00FF24" />
              <span>{isAr ? 'تجربة الصوت' : 'Test Audio'}</span>
            </button>
          </Card>

          {/* Accept Payment Action Hub (4 Cards) */}
          <div>
            <SectionHeader title={isAr ? 'طرق تحصيل وقبول المدفوعات' : 'Accept Payment Channels'} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {/* Tile 1: Show QR */}
              <Card
                variant="interactive"
                onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
                style={{
                  padding: '18px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(0, 255, 36, 0.12)',
                    border: '1px solid rgba(0, 255, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00FF24',
                  }}
                >
                  <QrCode size={22} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'رمز الفاتورة' : 'ZATCA QR'}
                </span>
              </Card>

              {/* Tile 2: SoftPOS Terminal */}
              <Card
                variant="interactive"
                onClick={() => navigateTo('SOFTPOS_TERMINAL')}
                style={{
                  padding: '18px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(0, 255, 36, 0.12)',
                    border: '1px solid rgba(0, 255, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00FF24',
                  }}
                >
                  <SmartphoneNfc size={22} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'الدفع باللمس' : 'SoftPOS'}
                </span>
              </Card>

              {/* Tile 3: Send Pay Link */}
              <Card
                variant="interactive"
                onClick={() => navigateTo('PAYMENT_LINK_GENERATOR')}
                style={{
                  padding: '18px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(0, 255, 36, 0.12)',
                    border: '1px solid rgba(0, 255, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00FF24',
                  }}
                >
                  <Share2 size={22} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'روابط الدفع' : 'Pay Links'}
                </span>
              </Card>

              {/* Tile 4: Cash Sale */}
              <Card
                variant="interactive"
                onClick={() => setIsCashSaleModalOpen(true)}
                style={{
                  padding: '18px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(0, 255, 36, 0.12)',
                    border: '1px solid rgba(0, 255, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00FF24',
                  }}
                >
                  <Banknote size={22} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                  {isAr ? 'سجل النقد' : 'Cash Sales'}
                </span>
              </Card>
            </div>
          </div>

          {/* Recent Collections Live Ledger Table */}
          <Card variant="elevated" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {isAr ? 'أحدث التحصيلات المباشرة' : 'Live Collections Ledger'}
                </h3>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                  {isAr ? 'سجل العمليات المتوافقة مع ضريبة القيمة المضافة ١٥٪' : 'Real-time ZATCA Phase 2 compliant transactions'}
                </div>
              </div>

              <button
                onClick={() => navigateTo('MERCHANT_COLLECTIONS')}
                className="interactive-tap"
                style={{
                  backgroundColor: '#151C2C',
                  border: '1px solid #1E293B',
                  color: '#00FF24',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{isAr ? 'عرض الكل' : 'View Full Ledger'}</span>
                <ChevronRight size={14} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
              </button>
            </div>

            {/* Desktop Table View */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isRtl ? 'right' : 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1E293B', color: '#64748B', fontSize: '12px', fontWeight: 700 }}>
                    <th style={{ padding: '10px 12px' }}>{isAr ? 'العميل / الطريقة' : 'Customer / Method'}</th>
                    <th style={{ padding: '10px 12px' }}>{isAr ? 'المرجع البنكي UTR' : 'Sarie Reference'}</th>
                    <th style={{ padding: '10px 12px' }}>{isAr ? 'الوقت' : 'Time'}</th>
                    <th style={{ padding: '10px 12px' }}>{isAr ? 'الحالة' : 'Status'}</th>
                    <th style={{ padding: '10px 12px', textAlign: isRtl ? 'left' : 'right' }}>{isAr ? 'المبلغ' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody>
                  {merchantCollections.slice(0, 5).map((col) => (
                    <tr
                      key={col.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        fontSize: '13px',
                      }}
                    >
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: '#161F30',
                              border: '1px solid #1E293B',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 800,
                              color: '#00FF24',
                            }}
                          >
                            {col.customerMasked ? col.customerMasked.slice(0, 2).toUpperCase() : 'TX'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{col.customerMasked || 'Customer'}</div>
                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{col.paymentMethod.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#94A3B8', fontFamily: 'monospace', fontSize: '12px' }}>
                        {col.id}
                      </td>
                      <td style={{ padding: '12px', color: '#94A3B8', fontSize: '12px' }}>
                        {col.date}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <StatusBadge
                          status={col.status === 'settled' ? 'success' : col.status === 'refunded' ? 'warning' : 'neutral'}
                          size="sm"
                          label={col.status === 'settled' ? (isAr ? 'مكتمل' : 'Settled') : col.status}
                        />
                      </td>
                      <td style={{ padding: '12px', textAlign: isRtl ? 'left' : 'right', fontWeight: 900, color: '#00FF24' }}>
                        SAR {col.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column (35%): Instant Settlement Station, Store Stand QR & Settlement Account */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Instant Sarie Payout Station Card */}
          <Card
            variant="elevated"
            style={{
              padding: '22px',
              backgroundColor: '#0E1422',
              border: '1px solid rgba(0, 255, 36, 0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'محطة التسوية الفورية' : 'Instant Sarie Payout'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(0, 255, 36, 0.15)',
                  color: '#00FF24',
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                {isAr ? 'سريع ٢٤/٧' : 'Sarie 24/7'}
              </span>
            </div>

            <div style={{ margin: '18px 0', padding: '14px', backgroundColor: '#080C14', borderRadius: '12px', border: '1px solid #1E293B' }}>
              <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>{isAr ? 'الحساب البنكي المعتمد' : 'Destination IBAN'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <Building2 size={16} color="#00FF24" />
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                  {merchantInfo.settlementBank || 'Al Rajhi Bank'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'monospace', marginTop: '4px' }}>
                {merchantInfo.settlementIban || 'SA44 8000 0201 6080 1005 5005'}
              </div>
            </div>

            <button
              onClick={handleSettleNowClick}
              disabled={isSettling}
              className="interactive-tap"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#00FF24',
                color: '#080C14',
                fontSize: '14px',
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(0, 255, 36, 0.35)',
              }}
            >
              <Zap size={18} fill="#080C14" />
              <span>
                {isSettling
                  ? (isAr ? 'جاري التحويل عبر سريع...' : 'Processing Payout...')
                  : (isAr ? `تسوية ${displayTotal.toFixed(2)} ر.س للبنك` : `Settle SAR ${displayTotal.toFixed(2)} Now`)}
              </span>
            </button>

            <button
              onClick={handleDownloadSettlementReport}
              className="interactive-tap cursor-pointer"
              style={{
                width: '100%',
                marginTop: '10px',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: '#151C2C',
                border: '1px solid #1E293B',
                color: '#00FF24',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Download size={14} />
              <span>{isAr ? 'تنزيل تقرير التسويات (SAMA)' : 'Download Settlement Report'}</span>
            </button>
          </Card>

          {/* Store Stand QR Card Preview */}
          <Card variant="elevated" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                {isAr ? 'باركود المتجر المعتمد' : 'Store Stand QR'}
              </span>
              <span style={{ fontSize: '11px', color: '#00FF24', fontWeight: 800 }}>ZATCA Phase 2</span>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px',
                display: 'inline-block',
                margin: '8px auto',
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`sarie://pay?pa=${merchantInfo.vatNumber || '300012345600003'}&pn=${encodeURIComponent(merchantInfo.businessName || 'Merchant')}`)}`}
                alt="Store QR"
                style={{ width: '150px', height: '150px', display: 'block' }}
              />
            </div>

            <div style={{ fontSize: '12px', color: '#94A3B8', margin: '10px 0' }}>
              {merchantInfo.businessName || 'GreenLeaf Markets LLC'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '12px' }}>
              <button
                onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
                className="interactive-tap"
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#151C2C',
                  border: '1px solid #1E293B',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Download size={14} color="#00FF24" />
                <span>{isAr ? 'تحميل الملصق' : 'Get Poster'}</span>
              </button>

              <button
                onClick={() => navigateTo('MERCHANT_QR_GENERATOR')}
                className="interactive-tap"
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#151C2C',
                  border: '1px solid #1E293B',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Share2 size={14} color="#00FF24" />
                <span>{isAr ? 'مشاركة' : 'Share'}</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Cash Sale Modal */}
      {isCashSaleModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 8, 15, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 2600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setIsCashSaleModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#111726',
              border: '1px solid rgba(0, 255, 36, 0.3)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '420px',
              padding: '24px',
              animation: 'scaleUp 0.2s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Banknote size={22} color="#00FF24" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {isAr ? 'تسجيل عملية بيع نقدي' : 'Record Cash Sale'}
                </h3>
              </div>
              <button
                onClick={() => setIsCashSaleModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRecordCashSale} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '6px', display: 'block' }}>
                  {isAr ? 'المبلغ المستلم نقداً (ر.س)' : 'Cash Amount Received (SAR)'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  autoFocus
                  required
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#182236',
                    border: '1px solid #1E293B',
                    borderRadius: '12px',
                    color: '#00FF24',
                    fontSize: '22px',
                    fontWeight: 900,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '6px', display: 'block' }}>
                  {isAr ? 'ملاحظة العملية / رقم الطلب' : 'Order Note / Register #'}
                </label>
                <input
                  type="text"
                  value={cashNote}
                  onChange={(e) => setCashNote(e.target.value)}
                  placeholder={isAr ? 'كاشير ١ • مبيعات إفطار' : 'Cashier 1 • Store order'}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#182236',
                    border: '1px solid #1E293B',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ backgroundColor: '#0A0E1A', padding: '12px 14px', borderRadius: '10px', fontSize: '12px', color: '#94A3B8' }}>
                {isAr ? 'سيتم احتساب ١٥٪ ضريبة القيمة المضافة زاتكا وإضافتها لتقرير التحصيلات اليومي.' : '15% ZATCA VAT will be calculated and logged into daily tax ledger.'}
              </div>

              <button
                type="submit"
                disabled={cashSuccess || !cashAmount}
                className="interactive-tap cursor-pointer"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#00FF24',
                  color: '#080C14',
                  fontWeight: 900,
                  fontSize: '14px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px',
                }}
              >
                {cashSuccess ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>{isAr ? 'تم تسجيل البيع والنطق الصوتي!' : 'Recorded & SoundBox Announced!'}</span>
                  </>
                ) : (
                  <span>{isAr ? 'تأكيد وحفظ البيع النقدي' : 'Confirm & Record Cash Sale'}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: isRtl ? 'auto' : '24px',
            left: isRtl ? '24px' : 'auto',
            backgroundColor: '#00FF24',
            color: '#080C14',
            padding: '14px 20px',
            borderRadius: '14px',
            fontWeight: 800,
            fontSize: '13.5px',
            zIndex: 3000,
            boxShadow: '0 8px 30px rgba(0, 255, 36, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
