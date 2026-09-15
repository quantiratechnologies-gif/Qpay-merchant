import React, { useState } from 'react';
import { Gift, Trophy, Sparkles, X, Check } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { useApp } from '../state/AppContext';
import { formatLocalizedNumber, translateText } from '../utils/i18n';

interface ScratchCardItem {
  id: string;
  title: string;
  subtitle: string;
  rewardText: string;
  rewardType: 'cashback' | 'voucher' | 'points';
  amount?: number;
  isScratched: boolean;
  code?: string;
}

export const RewardsScreen: React.FC = () => {
  const { language, isRtl } = useApp();
  const isAr = language === 'العربية' || language === 'ar';
  const [points, setPoints] = useState(1450);
  const [cards, setCards] = useState<ScratchCardItem[]>([
    {
      id: 'sc-1',
      title: isAr ? 'مكافأة تحويل سريع' : 'Sarie Transfer Reward',
      subtitle: isAr ? 'مكتسبة عند سداد فاتورة كهرباء بمبلغ ٢,٦٢٠ ر.س' : 'Earned on SAR 2,620 SEC Bill Payment',
      rewardText: isAr ? 'كاش باك فوري ١٥ ر.س' : 'SAR 15 Instant Cashback',
      rewardType: 'cashback',
      amount: 15,
      isScratched: false,
    },
    {
      id: 'sc-2',
      title: isAr ? 'توفير المتاجر الكبرى' : 'Merchant Super Saver',
      subtitle: isAr ? 'مكتسبة لدى أسواق بنده' : 'Earned at Panda Supermarket',
      rewardText: isAr ? 'خصم ٢٥٪ على الأغذية والمقاضي' : 'Flat 25% Off Food & Groceries',
      rewardType: 'voucher',
      code: 'PANDAFOOD25',
      isScratched: false,
    },
    {
      id: 'sc-3',
      title: isAr ? 'مكافأة عطلة نهاية الأسبوع' : 'Weekend Bonus Scratch',
      subtitle: isAr ? 'مكافأة خاصة لإجراء أكثر من ٥ عمليات سريع' : 'Special reward for 5+ Sarie transactions',
      rewardText: isAr ? '+٥٠٠ نقطة كيو تي إضافية' : '+500 Extra QTPoints',
      rewardType: 'points',
      amount: 500,
      isScratched: false,
    },
    {
      id: 'sc-4',
      title: isAr ? 'قسيمة سفر خاصة' : 'Travel Special Voucher',
      subtitle: isAr ? 'بطاقة خصم رحلات الخطوط السعودية' : 'Saudia flight discount card',
      rewardText: isAr ? 'خصم فوري ١٥٠ ر.س على الطيران' : 'Flat SAR 150 Flight Discount',
      rewardType: 'voucher',
      code: 'FLYSAR150',
      isScratched: true,
    },
  ]);

  const [activeCard, setActiveCard] = useState<ScratchCardItem | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleCardClick = (card: ScratchCardItem) => {
    setActiveCard(card);
    setIsRevealed(card.isScratched);
    setIsScratching(false);
  };

  const handleScratchAction = () => {
    if (!activeCard || isRevealed) return;
    setIsScratching(true);
    setTimeout(() => {
      setIsScratching(false);
      setIsRevealed(true);

      // Update card state
      setCards((prev) =>
        prev.map((c) => (c.id === activeCard.id ? { ...c, isScratched: true } : c))
      );

      // Add points if points reward
      if (activeCard.rewardType === 'points' && activeCard.amount) {
        setPoints((p) => p + activeCard.amount!);
      }
    }, 1200);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B14', minHeight: '100vh', paddingBottom: '96px', color: '#FFFFFF' }}>
      <AppHeader title={translateText('Rewards & Scratch Cards', language)} showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {/* QTPoints Balance Hero Banner */}
        <div
          style={{
            backgroundColor: '#151524',
            border: '1.5px solid rgba(127, 232, 127, 0.35)',
            borderRadius: '20px',
            padding: '24px 20px',
            textAlign: 'center',
            marginBottom: '20px',
            color: '#FFFFFF',
          }}
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
            <Trophy size={28} />
          </div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#7FE87F', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {translateText('Total Reward Balance', language)}
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#FFFFFF', margin: '4px 0 6px 0', fontVariantNumeric: 'tabular-nums' }}>
            {formatLocalizedNumber(points, language)} {isAr ? 'نقاط كيو تي' : 'QTPoints'}
          </h2>
          <p style={{ fontSize: '12px', color: '#A2A2BA', margin: 0 }}>
            {isAr ? 'اكسب ١٠ نقاط مكافأة على كل ١٠٠ ر.س تنفقها عبر كيو تي باي' : 'Earn 10 QTPoints on every SAR 100 spent via QTPay'}
          </p>
        </div>

        {/* Unlocked Scratch Cards Grid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>{translateText('Unlocked Scratch Cards', language)}</h3>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#7FE87F' }}>
            {formatLocalizedNumber(cards.filter((c) => !c.isScratched).length, language)} {translateText('Unopened', language)}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="interactive-tap"
              style={{
                backgroundColor: card.isScratched ? '#2A2A3E' : '#3A3A52',
                border: card.isScratched ? '1px solid #4D4D6B' : '1.5px dashed #7FE87F',
                borderRadius: '16px',
                padding: '18px 14px',
                textAlign: 'center',
                cursor: 'pointer',
                color: '#FFFFFF',
              }}
            >
              {card.isScratched ? (
                <>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(127, 232, 127, 0.15)',
                      color: '#7FE87F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px auto',
                    }}
                  >
                    <Check size={20} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#FFFFFF' }}>{card.rewardText}</div>
                  <div style={{ fontSize: '11px', color: '#7FE87F', marginTop: '4px', fontWeight: 800 }}>{translateText('Claimed', language)}</div>
                </>
              ) : (
                <>
                  <Sparkles size={28} color="#7FE87F" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#FFFFFF' }}>{translateText('Tap to Scratch', language)}</div>
                  <div style={{ fontSize: '11px', color: '#B3B3C2', marginTop: '4px', fontWeight: 700 }}>
                    {card.title}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Scratch Modal */}
      {activeCard && (
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
          onClick={() => setActiveCard(null)}
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
            <button
              onClick={() => setActiveCard(null)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '16px',
                right: isRtl ? 'auto' : '16px',
                left: isRtl ? '16px' : 'auto',
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

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: '8px 0 4px 0' }}>
              {activeCard.title}
            </h3>
            <p style={{ fontSize: '12px', color: '#B3B3C2', margin: '0 0 20px 0' }}>{activeCard.subtitle}</p>

            {/* Scratch Surface Box */}
            <div
              onClick={handleScratchAction}
              style={{
                width: '200px',
                height: '200px',
                margin: '0 auto 20px auto',
                borderRadius: '20px',
                backgroundColor: isRevealed ? '#1A1A2E' : '#3A3A52',
                border: isRevealed ? '2px solid #7FE87F' : '2px dashed #7FE87F',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isRevealed ? 'default' : 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isScratching ? (
                <div>
                  <Sparkles size={36} color="#7FE87F" style={{ animation: 'spin 1s linear infinite' }} />
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', marginTop: '10px' }}>
                    {translateText('Revealing Reward...', language)}
                  </div>
                </div>
              ) : isRevealed ? (
                <div style={{ padding: '16px' }}>
                  <Gift size={40} color="#7FE87F" style={{ margin: '0 auto 10px auto' }} />
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                    {activeCard.rewardText}
                  </div>
                  {activeCard.code && (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '6px 12px',
                        backgroundColor: '#2A2A3E',
                        border: '1px dashed #7FE87F',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#7FE87F',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {translateText('CODE', language)}: {activeCard.code}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Sparkles size={40} color="#7FE87F" style={{ margin: '0 auto 10px auto' }} />
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{translateText('Tap to Scratch', language)}</div>
                  <div style={{ fontSize: '11px', color: '#B3B3C2', marginTop: '4px' }}>{translateText('Click to reveal your reward!', language)}</div>
                </div>
              )}
            </div>

            {isRevealed ? (
              <button
                onClick={() => setActiveCard(null)}
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
                {translateText('Claimed & Saved', language)}
              </button>
            ) : (
              <button
                onClick={handleScratchAction}
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
                {translateText('Scratch Now', language)}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

