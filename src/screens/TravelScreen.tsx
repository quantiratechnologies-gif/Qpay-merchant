import React, { useState } from 'react';
import { Plane, Car, Hotel, Compass, X, Check } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { ListRow } from '../components/ListRow';
import { useApp } from '../state/AppContext';
import { formatSaudiCurrency, translateText } from '../utils/i18n';

interface TravelBooking {
  type: 'flight' | 'cab' | 'hotel' | 'holiday';
  title: string;
  subtitle: string;
  from?: string;
  to?: string;
  amount: number;
  provider: string;
}

export const TravelScreen: React.FC = () => {
  const { openPinModal, completePayment, language, t, isRtl } = useApp();
  const isAr = language === 'العربية' || language === 'ar';
  const [selectedBooking, setSelectedBooking] = useState<TravelBooking | null>(null);
  const [confirmedTicket, setConfirmedTicket] = useState<{
    title: string;
    pnr: string;
    amount: number;
    utr: string;
  } | null>(null);

  const bookings: TravelBooking[] = [
    {
      type: 'flight',
      title: isAr ? 'الرياض (RUH) ➔ جدة (JED)' : 'Riyadh (RUH) ➔ Jeddah (JED)',
      subtitle: isAr ? 'رحلة الخطوط السعودية SV1024 • مباشر • ساعة و٣٥ دقيقة' : 'Saudia Flight SV1024 • Direct • 1h 35m',
      from: 'Riyadh',
      to: 'Jeddah',
      amount: 650,
      provider: isAr ? 'الخطوط السعودية' : 'Saudia Airlines',
    },
    {
      type: 'cab',
      title: isAr ? 'توصيل مطار الملك خالد' : 'King Khalid Airport Transfer',
      subtitle: isAr ? 'سيدان فاخرة • استلام من باب المنزل' : 'Executive Sedan • Doorstep Pickup',
      from: 'Al Olaya, Riyadh',
      to: 'RUH Terminal 5',
      amount: 120,
      provider: isAr ? 'كيو تي باي شوفيير' : 'QTPay Chauffeur',
    },
    {
      type: 'hotel',
      title: isAr ? 'فندق ريتز كارلتون الرياض' : 'The Ritz-Carlton Riyadh',
      subtitle: isAr ? 'جناح ديلوكس • ليلة واحدة • شامل الإفطار' : 'Deluxe Suite • 1 Night • Breakfast Included',
      amount: 1450,
      provider: 'Marriott Bonvoy',
    },
    {
      type: 'holiday',
      title: isAr ? 'باقة عطلة واحة العلا' : 'AlUla Oasis Getaway Package',
      subtitle: isAr ? '٣ أيام / ليلتان • منتجع بيئي فاخر + جولة الحِجر' : '3 Days / 2 Nights • Luxury Eco-Resort + Hegra Tour',
      amount: 2800,
      provider: isAr ? 'استكشف العلا' : 'Experience AlUla',
    },
  ];

  const handleStartBooking = (booking: TravelBooking) => {
    setSelectedBooking(booking);
  };

  const handleConfirmPay = () => {
    if (!selectedBooking) return;

    openPinModal({
      title: `${translateText('Book', language)} ${selectedBooking.title}`,
      subTitle: `${selectedBooking.provider} • ${formatSaudiCurrency(selectedBooking.amount, language)}`,
      amount: selectedBooking.amount,
      onSuccess: async () => {
        const txn = await completePayment({
          title: selectedBooking.title,
          subTitle: selectedBooking.provider,
          amount: selectedBooking.amount,
          category: 'Travel Booking',
        });

        const pnr = 'PNR' + Math.floor(100000 + Math.random() * 900000).toString();
        setConfirmedTicket({
          title: selectedBooking.title,
          pnr,
          amount: selectedBooking.amount,
          utr: txn.utr,
        });
        setSelectedBooking(null);
      },
    });
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#1A1A2E', minHeight: '100vh', paddingBottom: '30px', color: '#FFFFFF' }}>
      <AppHeader title={translateText('Travel & Bookings', language)} showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {/* Travel Desk Hero Banner */}
        <div
          style={{
            backgroundColor: '#2A2A3E',
            border: '1.5px solid rgba(127, 232, 127, 0.35)',
            borderRadius: '20px',
            padding: '24px 20px',
            marginBottom: '20px',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
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
            <Plane size={26} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0', color: '#FFFFFF' }}>
            {translateText('QTPay Travel Desk', language)}
          </h3>
          <p style={{ fontSize: '12px', color: '#B3B3C2', margin: 0 }}>
            {translateText('Book flights, cabs, and hotels with zero convenience fee & instant cashbacks', language)}
          </p>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 800, color: '#B3B3C2', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginInlineStart: '4px' }}>
          {translateText('Available Travel Bookings', language)}
        </div>

        <div style={{ backgroundColor: '#2A2A3E', border: '1px solid #4D4D6B', borderRadius: '16px', overflow: 'hidden' }}>
          <ListRow
            icon={<Plane size={18} color="#7FE87F" />}
            label={translateText('Flight Bookings', language)}
            subLabel={bookings[0].subtitle}
            rightElement={<span style={{ fontSize: '12px', fontWeight: 800, color: '#000000', backgroundColor: '#7FE87F', padding: '4px 10px', borderRadius: '8px' }}>{isAr ? `حجز ${formatSaudiCurrency(650, language)}` : 'Book SAR 650'}</span>}
            onClick={() => handleStartBooking(bookings[0])}
          />
          <div style={{ height: '1px', backgroundColor: '#3A3A52', margin: '0 16px' }} />
          <ListRow
            icon={<Car size={18} color="#7FE87F" />}
            label={translateText('Airport Chauffeur', language)}
            subLabel={bookings[1].subtitle}
            rightElement={<span style={{ fontSize: '12px', fontWeight: 800, color: '#000000', backgroundColor: '#7FE87F', padding: '4px 10px', borderRadius: '8px' }}>{isAr ? `حجز ${formatSaudiCurrency(120, language)}` : 'Book SAR 120'}</span>}
            onClick={() => handleStartBooking(bookings[1])}
          />
          <div style={{ height: '1px', backgroundColor: '#3A3A52', margin: '0 16px' }} />
          <ListRow
            icon={<Hotel size={18} color="#7FE87F" />}
            label={translateText('Hotel Reservations', language)}
            subLabel={bookings[2].subtitle}
            rightElement={<span style={{ fontSize: '12px', fontWeight: 800, color: '#000000', backgroundColor: '#7FE87F', padding: '4px 10px', borderRadius: '8px' }}>{translateText('Reserve', language)}</span>}
            onClick={() => handleStartBooking(bookings[2])}
          />
          <div style={{ height: '1px', backgroundColor: '#3A3A52', margin: '0 16px' }} />
          <ListRow
            icon={<Compass size={18} color="#7FE87F" />}
            label={translateText('Holiday Packages', language)}
            subLabel={bookings[3].subtitle}
            rightElement={<span style={{ fontSize: '12px', fontWeight: 800, color: '#000000', backgroundColor: '#7FE87F', padding: '4px 10px', borderRadius: '8px' }}>{translateText('Explore', language)}</span>}
            onClick={() => handleStartBooking(bookings[3])}
          />
        </div>
      </div>

      {/* Booking Checkout Modal */}
      {selectedBooking && (
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
          onClick={() => setSelectedBooking(null)}
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
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {translateText('Confirm Booking', language)}
                </h3>
                <p style={{ fontSize: '12px', color: '#B3B3C2', margin: '2px 0 0 0' }}>{selectedBooking.provider}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
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
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>{selectedBooking.title}</div>
              <div style={{ fontSize: '12px', color: '#B3B3C2', marginTop: '4px' }}>{selectedBooking.subtitle}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed #4D4D6B' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#B3B3C2' }}>{translateText('Total Payable Amount', language)}</span>
                <span style={{ fontSize: '20px', fontWeight: 900, color: '#7FE87F', fontVariantNumeric: 'tabular-nums' }}>{formatSaudiCurrency(selectedBooking.amount, language)}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmPay}
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
              {isAr
                ? `دفع ${formatSaudiCurrency(selectedBooking.amount, language)} عبر رمز ساريع`
                : `Pay SAR ${selectedBooking.amount.toLocaleString()} via Sarie PIN`}
            </button>
          </div>
        </div>
      )}

      {/* Confirmed Ticket Receipt Modal */}
      {confirmedTicket && (
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
          onClick={() => setConfirmedTicket(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
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
              {translateText('Booking Confirmed!', language)}
            </h3>
            <p style={{ fontSize: '13px', color: '#B3B3C2', margin: '0 0 20px 0' }}>{confirmedTicket.title}</p>

            <div style={{ backgroundColor: '#1A1A2E', border: '1px solid #4D4D6B', borderRadius: '16px', padding: '16px', textAlign: isRtl ? 'right' : 'left', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#B3B3C2' }}>{translateText('Booking Reference (PNR)', language)}</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#7FE87F', fontFamily: 'monospace' }}>{confirmedTicket.pnr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#B3B3C2' }}>{t('txn_ref')}</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace' }}>{confirmedTicket.utr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed #4D4D6B' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{translateText('Amount Paid', language)}</span>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#7FE87F', fontVariantNumeric: 'tabular-nums' }}>{formatSaudiCurrency(confirmedTicket.amount, language)}</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmedTicket(null)}
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
              {translateText('Done & View Ticket', language)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

