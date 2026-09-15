import React, { useState } from 'react';
import { Store, MapPin, Hash, ArrowRight } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { PrimaryButton } from '../components/PrimaryButton';
import { SamaLogo } from '../components/SamaLogo';
import { AlphPayLogo } from '../components/AlphPayLogo';
import { formatLocalizedNumber } from '../utils/i18n';

const CATEGORIES = [
  { en: 'Groceries & Gourmet', ar: 'بقالة وتموينات' },
  { en: 'Food & Drink', ar: 'مطاعم ومقاهي' },
  { en: 'Retail & Fashion', ar: 'تجارة تجزئة وأزياء' },
  { en: 'Electronics & Tech', ar: 'إلكترونيات وتقنية' },
  { en: 'Fuel & Auto', ar: 'محطات وقود وسيارات' },
  { en: 'Services', ar: 'خدمات مهنية' },
  { en: 'Pharmacy & Health', ar: 'صيدليات ورعاية صحية' },
  { en: 'Other Business', ar: 'أنشطة أخرى' },
];

const CITIES = [
  { en: 'Riyadh', ar: 'الرياض' },
  { en: 'Jeddah', ar: 'جدة' },
  { en: 'Dammam', ar: 'الدمام' },
  { en: 'Mecca', ar: 'مكة المكرمة' },
  { en: 'Medina', ar: 'المدينة المنورة' },
  { en: 'Khobar', ar: 'الخبر' },
  { en: 'Tabuk', ar: 'تبوك' },
  { en: 'Abha', ar: 'أبها' },
];

export const MerchantSetupScreen: React.FC = () => {
  const { merchantInfo, updateMerchantInfo, navigateTo, language, isRtl, t } = useApp();
  const isAr = language === 'العربية';
  const [businessName, setBusinessName] = useState(merchantInfo.businessName || (isAr ? 'تموينات ستار مارت' : 'Starmart Supermarket'));
  const [category, setCategory] = useState(merchantInfo.category || 'Groceries & Gourmet');
  const [city, setCity] = useState(merchantInfo.city || 'Riyadh');
  const storePhone = merchantInfo.storePhone || '0501234567';
  const [vatNumber] = useState(merchantInfo.vatNumber || '310948201900003');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMerchantInfo({
      businessName,
      category,
      city,
      storePhone,
      vatNumber,
    });
    navigateTo('MERCHANT_BANK_LINK');
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px 24px 30px 24px',
        boxSizing: 'border-box',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Top Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            backgroundColor: '#151524',
            border: '1px solid #2C2C44',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
          }}
        >
          <AlphPayLogo variant="icon" size={36} themeMode="dark" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
          {t('merchant.setup_title', 'Business Profile Setup')}
        </h2>
        <p style={{ fontSize: '13px', color: '#A2A2BA', margin: 0 }}>
          {isAr ? 'إعداد الملف التجاري للمنشأة للتوافق مع منظومة الفوترة الإلكترونية زاتكا' : 'Configure your merchant trading identity for ZATCA e-invoicing'}
        </p>
      </div>

      {/* Main Form */}
      <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Business Name */}
          <div>
            <label
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#A2A2BA',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {t('merchant.business_name', 'Business / Store Trade Name')}
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#151524',
                border: '1px solid #2C2C44',
                borderRadius: '14px',
                padding: '12px 16px',
              }}
            >
              <Store size={18} color="#7FE87F" style={{ marginRight: isRtl ? 0 : '12px', marginLeft: isRtl ? '12px' : 0, flexShrink: 0 }} />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={isAr ? 'تموينات ستار مارت' : 'Starmart Supermarket'}
                required
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  width: '100%',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              />
            </div>
          </div>

          {/* Business Category Selection Pills */}
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
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {t('merchant.category', 'Business Category')}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: isRtl ? 'flex-end' : 'flex-start' }}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.en;
                return (
                  <button
                    key={cat.en}
                    type="button"
                    onClick={() => setCategory(cat.en)}
                    className="interactive-tap"
                    style={{
                      backgroundColor: isSelected ? 'rgba(127, 232, 127, 0.2)' : '#151524',
                      border: isSelected ? '1.5px solid #7FE87F' : '1px solid #2C2C44',
                      color: isSelected ? '#FFFFFF' : '#A2A2BA',
                      borderRadius: '12px',
                      padding: '7px 12px',
                      fontSize: '11.5px',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                    }}
                  >
                    {isAr ? cat.ar : cat.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Operating City */}
          <div>
            <label
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#A2A2BA',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {t('merchant.city', 'Operating City')}
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#151524',
                border: '1px solid #2C2C44',
                borderRadius: '14px',
                padding: '12px 16px',
              }}
            >
              <MapPin size={18} color="#7FE87F" style={{ marginRight: isRtl ? 0 : '12px', marginLeft: isRtl ? '12px' : 0, flexShrink: 0 }} />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  width: '100%',
                  cursor: 'pointer',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                {CITIES.map((c) => (
                  <option key={c.en} value={c.en} style={{ backgroundColor: '#151524', color: '#FFFFFF' }}>
                    {isAr ? c.ar : c.en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ZATCA VAT ID (Pre-filled from e-KYC) */}
          <div>
            <label
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#A2A2BA',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {t('zatca.vat_id', 'ZATCA VAT ID (15-Digit)')}
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#151524',
                border: '1px solid #2C2C44',
                borderRadius: '14px',
                padding: '12px 16px',
              }}
            >
              <Hash size={18} color="#7FE87F" style={{ marginRight: isRtl ? 0 : '12px', marginLeft: isRtl ? '12px' : 0, flexShrink: 0 }} />
              <input
                type="text"
                value={isAr ? formatLocalizedNumber(vatNumber, language) : vatNumber}
                readOnly
                disabled
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#7FE87F',
                  fontFamily: 'monospace',
                  width: '100%',
                  direction: 'ltr',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              />
            </div>
          </div>

          {/* Action Button */}
          <div style={{ marginTop: '10px' }}>
            <PrimaryButton type="submit">
              {t('btn.continue', 'Continue')} <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
            </PrimaryButton>
          </div>
        </form>
      </div>

      {/* SAMA Dock */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <span style={{ fontSize: '10.5px', color: '#6E6E85', fontWeight: 700 }}>
          {isAr ? 'بيانات منشأة موثقة عبر منصة النفاذ الوطني وأبشر' : 'SAMA & Absher Verified Merchant Identity'}
        </span>
        <SamaLogo height={14} themeMode="green" />
      </div>
    </div>
  );
};
