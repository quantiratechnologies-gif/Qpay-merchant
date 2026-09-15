import React, { useState } from 'react';
import { ShoppingBag, Tag, ChevronRight, X, Check, Copy } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { useApp } from '../state/AppContext';
import { formatSaudiCurrency, translateText } from '../utils/i18n';

interface DealItem {
  id: string;
  merchant: string;
  title: string;
  offer: string;
  category: string;
  couponCode: string;
  originalPrice: number;
  discountedPrice: number;
}

export const ShoppingScreen: React.FC = () => {
  const { openPinModal, completePayment, language, t, isRtl } = useApp();
  const isAr = language === 'العربية' || language === 'ar';
  const [selectedDeal, setSelectedDeal] = useState<DealItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [purchasedDeal, setPurchasedDeal] = useState<{
    title: string;
    merchant: string;
    paidAmount: number;
  } | null>(null);

  const deals: DealItem[] = [
    {
      id: 'deal-1',
      merchant: isAr ? 'أسواق بنده' : 'Panda Supermarket',
      title: isAr ? 'توفير البقالة والمقاضي الأسبوعية' : 'Weekly Grocery Smart Saver',
      offer: isAr ? 'كاش باك ٥٠ ر.س عبر سريع' : 'Flat SAR 50 Cashback on Sarie',
      category: isAr ? 'بقالة ومواد غذائية طازجة' : 'Groceries & Fresh Food',
      couponCode: 'PANDASAVER50',
      originalPrice: 350,
      discountedPrice: 300,
    },
    {
      id: 'deal-2',
      merchant: isAr ? 'مكتبة جرير' : 'Jarir Bookstore',
      title: isAr ? 'أفضل الكتب والأدوات الرقمية' : 'Trending Books & Digital Stationery',
      offer: isAr ? 'خصم فوري ٧٥ ر.س' : 'Flat SAR 75 Instant OFF',
      category: isAr ? 'كتب وإلكترونيات' : 'Books & Electronics',
      couponCode: 'JARIR75',
      originalPrice: 450,
      discountedPrice: 375,
    },
    {
      id: 'deal-3',
      merchant: isAr ? 'معارض إكسترا' : 'eXtra Stores',
      title: isAr ? 'سماعات لاسلكية عازلة للضوضاء' : 'Wireless Active Noise Cancelling Earbuds',
      offer: isAr ? 'خصم فوري يصل إلى ٢٠٠ ر.س' : 'Up to SAR 200 Instant Discount',
      category: isAr ? 'صوتيات وتقنية' : 'Audio & Tech Gadgets',
      couponCode: 'EXTRA200',
      originalPrice: 799,
      discountedPrice: 599,
    },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  const handleBuyNow = () => {
    if (!selectedDeal) return;

    openPinModal({
      title: `${translateText('Buy', language)} ${selectedDeal.title}`,
      subTitle: `${selectedDeal.merchant} • ${formatSaudiCurrency(selectedDeal.discountedPrice, language)}`,
      amount: selectedDeal.discountedPrice,
      onSuccess: async () => {
        await completePayment({
          title: selectedDeal.merchant,
          subTitle: selectedDeal.title,
          amount: selectedDeal.discountedPrice,
          category: 'Shopping Purchase',
        });

        setPurchasedDeal({
          title: selectedDeal.title,
          merchant: selectedDeal.merchant,
          paidAmount: selectedDeal.discountedPrice,
        });
        setSelectedDeal(null);
      },
    });
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B14', minHeight: '100vh', paddingBottom: '96px', color: '#FFFFFF' }}>
      <AppHeader title={translateText('Shopping & Deals', language)} showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {/* Shopping Hero Banner */}
        <div
          style={{
            backgroundColor: '#2A2A3E',
            border: '1.5px solid rgba(127, 232, 127, 0.35)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              backgroundColor: 'rgba(127, 232, 127, 0.15)',
              color: '#7FE87F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1.5px solid rgba(127, 232, 127, 0.3)',
            }}
          >
            <ShoppingBag size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>{translateText('QTPay Partner Deals', language)}</h3>
            <p style={{ fontSize: '12px', color: '#B3B3C2', margin: '3px 0 0 0' }}>
              {translateText('Exclusive promo codes & instant discounts on top shopping brands', language)}
            </p>
          </div>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 800, color: '#B3B3C2', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', marginInlineStart: '4px' }}>
          {translateText('Featured Partner Offers', language)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {deals.map((deal) => (
            <div
              key={deal.id}
              onClick={() => setSelectedDeal(deal)}
              className="interactive-tap"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: '#2A2A3E',
                border: '1px solid #4D4D6B',
                borderRadius: '16px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#3A3A52',
                    color: '#7FE87F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #4D4D6B',
                  }}
                >
                  <Tag size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#FFFFFF' }}>{deal.merchant}</div>
                  <div style={{ fontSize: '12px', color: '#B3B3C2', marginTop: '2px' }}>{deal.title}</div>
                  <div style={{ fontSize: '12px', color: '#7FE87F', marginTop: '3px', fontWeight: 800 }}>{deal.offer}</div>
                </div>
              </div>
              <ChevronRight size={18} color="#B3B3C2" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Deal Checkout Modal */}
      {selectedDeal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 15, 26, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setSelectedDeal(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: '#2A2A3E',
              borderTop: '1px solid #4D4D6B',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '24px 20px',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>{selectedDeal.merchant}</h3>
                <p style={{ fontSize: '12px', color: '#B3B3C2', margin: '2px 0 0 0' }}>{selectedDeal.category}</p>
              </div>
              <button
                onClick={() => setSelectedDeal(null)}
                aria-label="Close"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#3A3A52',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#B3B3C2',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#1A1A2E', border: '1px solid #4D4D6B', borderRadius: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>{selectedDeal.title}</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#7FE87F', marginTop: '4px' }}>
                {selectedDeal.offer}
              </div>

              {/* Coupon Copy Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '14px',
                  padding: '10px 14px',
                  backgroundColor: '#2A2A3E',
                  border: '1.5px dashed #7FE87F',
                  borderRadius: '12px',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: '#B3B3C2', display: 'block' }}>{translateText('Coupon Code', language)}</span>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.05em' }}>
                    {selectedDeal.couponCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(selectedDeal.couponCode)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: '#7FE87F',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000000',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                  {copiedCode ? translateText('Copied!', language) : t('copy')}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '10px', borderTop: '1px dashed #4D4D6B' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#B3B3C2' }}>{translateText('Special Discount Price', language)}</span>
                <div>
                  <span style={{ fontSize: '13px', color: '#808099', textDecoration: 'line-through', marginInlineEnd: '8px', fontVariantNumeric: 'tabular-nums' }}>
                    {formatSaudiCurrency(selectedDeal.originalPrice, language)}
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#7FE87F', fontVariantNumeric: 'tabular-nums' }}>
                    {formatSaudiCurrency(selectedDeal.discountedPrice, language)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBuyNow}
              className="interactive-tap"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#7FE87F',
                border: 'none',
                color: '#000000',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {translateText('Order Now', language)} ({formatSaudiCurrency(selectedDeal.discountedPrice, language)})
            </button>
          </div>
        </div>
      )}

      {/* Confirmed Purchase Modal */}
      {purchasedDeal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 15, 26, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setPurchasedDeal(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '360px',
              backgroundColor: '#2A2A3E',
              border: '1px solid #4D4D6B',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              position: 'relative',
              animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(127, 232, 127, 0.15)',
                color: '#7FE87F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                border: '1.5px solid rgba(127, 232, 127, 0.3)',
              }}
            >
              <Check size={32} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>
              {translateText('Order Placed!', language)}
            </h3>
            <p style={{ fontSize: '12px', color: '#B3B3C2', margin: '0 0 20px 0' }}>
              {isAr ? `تم تفعيل قسيمة الخصم لدى ${purchasedDeal.merchant}` : `Discount voucher redeemed at ${purchasedDeal.merchant}`}
            </p>

            <div style={{ backgroundColor: '#1A1A2E', border: '1px solid #4D4D6B', borderRadius: '16px', padding: '16px', textAlign: isRtl ? 'right' : 'left', marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{purchasedDeal.title}</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#7FE87F', marginTop: '6px', fontVariantNumeric: 'tabular-nums' }}>
                {isAr ? `تم دفع ${formatSaudiCurrency(purchasedDeal.paidAmount, language)} عبر كيو تي باي` : `Paid ${formatSaudiCurrency(purchasedDeal.paidAmount, language)} via QTPay`}
              </div>
            </div>

            <button
              onClick={() => setPurchasedDeal(null)}
              className="interactive-tap"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#7FE87F',
                border: 'none',
                color: '#000000',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {translateText('Done & View Receipt', language)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

