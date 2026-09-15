import React, { useState } from 'react';
import {
  Zap,
  Droplets,
  Flame,
  Smartphone,
  PhoneCall,
  Globe,
  Tv,
  CreditCard,
  ShieldCheck,
  Building,
  Plane,
  Gift,
  FileText,
  Check,
  Car,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { ServiceCard } from '../components/ServiceCard';
import { Modal } from '../components/Modal';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../state/AppContext';
import { translateText } from '../utils/i18n';

export const AllServicesScreen: React.FC = () => {
  const { navigateTo, openPinModal, completePayment, language, t } = useApp();

  const [selectedService, setSelectedService] = useState<{
    title: string;
    subTitle: string;
    defaultAmount: number;
    placeholder: string;
    icon: React.ReactNode;
  } | null>(null);

  const [accountNumber, setAccountNumber] = useState<string>('9876543210');
  const [amount, setAmount] = useState<string>('');

  const handleOpenService = (
    title: string,
    subTitle: string,
    defaultAmount: number,
    placeholder: string,
    icon: React.ReactNode
  ) => {
    setSelectedService({ title, subTitle, defaultAmount, placeholder, icon });
    setAmount(defaultAmount.toString());
  };

  const handleProceedPayment = () => {
    if (!selectedService) return;
    const payAmt = parseFloat(amount) || selectedService.defaultAmount;
    const serviceTitle = selectedService.title;
    const serviceSubTitle = `${selectedService.subTitle} (${accountNumber})`;

    const modalTitle = serviceTitle;
    const modalSubTitle = serviceSubTitle;

    setSelectedService(null);

    openPinModal({
      title: modalTitle,
      amount: payAmt,
      subTitle: modalSubTitle,
      onSuccess: () => {
        completePayment({
          title: serviceTitle,
          subTitle: serviceSubTitle,
          amount: payAmt,
          category: 'Bill Payment',
        }).then((txn) => {
          navigateTo('PAYMENT_SUCCESS', { transaction: txn });
        });
      },
    });
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B14', minHeight: '100%', paddingBottom: '24px', color: '#FFFFFF' }}>
      <AppHeader title={t('all_services')} showBack showSettings />

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Bill Payments Grid */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#6E6E85', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginInlineStart: '4px' }}>
            {translateText('Recharge & Utilities', language)}
          </div>
          <div style={{ backgroundColor: '#151524', border: '1px solid #2C2C44', borderRadius: '16px', padding: '16px', boxShadow: 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <ServiceCard label={translateText('Electricity', language)} icon={<Zap size={20} />} onClick={() => navigateTo('ELECTRICITY')} />
              <ServiceCard
                label={translateText('Water', language)}
                icon={<Droplets size={20} />}
                onClick={() => handleOpenService(translateText('Water Bill', language), translateText('National Water Company (NWC)', language), 220, translateText('NWC Account No', language), <Droplets size={20} />)}
              />
              <ServiceCard
                label={translateText('Gas', language)}
                icon={<Flame size={20} />}
                onClick={() => handleOpenService(translateText('Gas Cylinder', language), translateText('National Gas (GASCO)', language), 45, translateText('Customer ID', language), <Flame size={20} />)}
              />
              <ServiceCard
                label={translateText('STC', language)}
                icon={<Smartphone size={20} />}
                onClick={() => handleOpenService(translateText('STC Sawa Recharge', language), translateText('STC Prepaid 5G', language), 115, '05X XXX XXXX', <Smartphone size={20} />)}
              />
              <ServiceCard
                label={translateText('Mobily', language)}
                icon={<PhoneCall size={20} />}
                onClick={() => handleOpenService(translateText('Mobily Postpaid', language), translateText('Mobily Mawaheb', language), 172, '05X XXX XXXX', <PhoneCall size={20} />)}
              />
              <ServiceCard
                label={translateText('Zain 5G', language)}
                icon={<Globe size={20} />}
                onClick={() => handleOpenService(translateText('Zain Fiber & 5G', language), translateText('Zain KSA', language), 287, translateText('Account Number', language), <Globe size={20} />)}
              />
              <ServiceCard
                label={translateText('Shahid VIP', language)}
                icon={<Tv size={20} />}
                onClick={() => handleOpenService(translateText('Shahid / OSN', language), translateText('Shahid VIP Subscription', language), 49, translateText('Mobile or Email', language), <Tv size={20} />)}
              />
              <ServiceCard
                label={translateText('Balady', language)}
                icon={<FileText size={20} />}
                onClick={() => handleOpenService(translateText('Balady Services', language), translateText('Municipal License & Fines', language), 450, translateText('Balady Invoice No', language), <FileText size={20} />)}
              />
            </div>
          </div>
        </div>

        {/* Financial Services */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#6E6E85', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginInlineStart: '4px' }}>
            {translateText('Banking & Finance (SAMA)', language)}
          </div>
          <div style={{ backgroundColor: '#151524', border: '1px solid #2C2C44', borderRadius: '16px', padding: '16px', boxShadow: 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <ServiceCard label={translateText('mada Cards', language)} icon={<CreditCard size={20} />} onClick={() => navigateTo('PAYMENT_METHODS')} />
              <ServiceCard
                label={translateText('Insurance', language)}
                icon={<ShieldCheck size={20} />}
                onClick={() => handleOpenService(translateText('Tawuniya Insurance', language), translateText('Motor & Health', language), 1250, translateText('Policy / National ID', language), <ShieldCheck size={20} />)}
              />
              <ServiceCard
                label={translateText('Finance EMI', language)}
                icon={<Building size={20} />}
                onClick={() => handleOpenService(translateText('Finance Installment', language), translateText('Al Rajhi / SNB Finance', language), 2150, translateText('Contract / IBAN No', language), <Building size={20} />)}
              />
              <ServiceCard
                label={translateText('Mawgif', language)}
                icon={<Car size={20} />}
                onClick={() => handleOpenService(translateText('Mawgif Parking', language), translateText('Riyadh & Jeddah Parking', language), 50, translateText('Plate / Mobile No', language), <Car size={20} />)}
              />
            </div>
          </div>
        </div>

        {/* Travel & Bookings */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#6E6E85', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginInlineStart: '4px' }}>
            {translateText('Travel & Lifestyle', language)}
          </div>
          <div style={{ backgroundColor: '#151524', border: '1px solid #2C2C44', borderRadius: '16px', padding: '16px', boxShadow: 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <ServiceCard
                label={translateText('Saudia', language)}
                icon={<Plane size={20} />}
                onClick={() => handleOpenService(translateText('Flight Booking', language), translateText('Saudia RUH ➔ JED', language), 650, translateText('Passenger PNR', language), <Plane size={20} />)}
              />
              <ServiceCard
                label={translateText('Jarir', language)}
                icon={<Gift size={20} />}
                onClick={() => handleOpenService(translateText('Jarir Gift Card', language), translateText('Jarir Bookstore Digital Voucher', language), 200, translateText('Mobile / Email', language), <Gift size={20} />)}
              />
              <ServiceCard
                label={translateText('Absher', language)}
                icon={<FileText size={20} />}
                onClick={() => handleOpenService(translateText('Traffic Fines (Absher)', language), translateText('Traffic Violations Settlement', language), 300, translateText('National ID / Iqama', language), <FileText size={20} />)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Bill Payment Input Modal */}
      {selectedService && (
        <Modal
          isOpen={Boolean(selectedService)}
          onClose={() => setSelectedService(null)}
          title={selectedService.title}
        >
          <div style={{ padding: '4px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(127, 232, 127, 0.15)',
                  color: '#7FE87F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid rgba(127, 232, 127, 0.3)',
                }}
              >
                {selectedService.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>{selectedService.title}</h3>
                <p style={{ fontSize: '12px', color: '#A2A2BA', margin: '2px 0 0 0' }}>{selectedService.subTitle}</p>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="modal-acc-input" style={{ fontSize: '11px', fontWeight: 800, color: '#A2A2BA', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' }}>
                {translateText('Account / Consumer Number', language)}
              </label>
              <input
                id="modal-acc-input"
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={selectedService.placeholder}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#1E1E32',
                  border: '1px solid #2C2C44',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="modal-amt-input" style={{ fontSize: '11px', fontWeight: 800, color: '#A2A2BA', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' }}>
                {t('amount')} ({t('sar')})
              </label>
              <input
                id="modal-amt-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t('enter_amount')}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#1E1E32',
                  border: '1.5px solid #7FE87F',
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#7FE87F',
                  outline: 'none',
                  fontVariantNumeric: 'tabular-nums',
                }}
              />
            </div>

            <PrimaryButton onClick={handleProceedPayment}>
              {t('pay_now')} <Check size={18} />
            </PrimaryButton>
          </div>
        </Modal>
      )}
    </div>
  );
};
