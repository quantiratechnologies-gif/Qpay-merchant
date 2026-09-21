import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Edit2,
  ChevronDown,
  Building2,
  Tag,
  Hash,
  MapPin,
  Mail,
} from 'lucide-react';
import { useApp } from '../../state/AppContext';

const CATEGORIES = [
  { en: 'Grocery & Daily Essentials', ar: 'بقالة وتموينات واحتياجات يومية' },
  { en: 'Food & Beverage / Cafes', ar: 'مطاعم ومقاهي ومشروبات' },
  { en: 'Retail & Fashion Boutique', ar: 'تجارة تجزئة وملابس وأزياء' },
  { en: 'Electronics & Smart Devices', ar: 'إلكترونيات وأجهزة ذكية' },
  { en: 'Pharmacy & Wellness', ar: 'صيدليات ورعاية صحية' },
  { en: 'Automotive & Fuel Stations', ar: 'محطات وقود وخدمات سيارات' },
  { en: 'Professional Services', ar: 'خدمات مهنية واستشارية' },
  { en: 'General Wholesale Trade', ar: 'تجارة جملة وتوريدات' },
];

const CITIES = [
  { en: 'Riyadh', ar: 'الرياض' },
  { en: 'Jeddah', ar: 'جدة' },
  { en: 'Dammam', ar: 'الدمام' },
  { en: 'Khobar', ar: 'الخبر' },
  { en: 'Mecca', ar: 'مكة المكرمة' },
  { en: 'Medina', ar: 'المدينة المنورة' },
  { en: 'Tabuk', ar: 'تبوك' },
  { en: 'Abha', ar: 'أبها' },
];

export const MerchantSetupScreen: React.FC = () => {
  const { merchantInfo, updateMerchantInfo, navigateTo, goBack, language, isRtl } = useApp();
  const isAr = language === 'العربية';

  const [businessName, setBusinessName] = useState(merchantInfo.businessName || '');
  const [category, setCategory] = useState(merchantInfo.category || 'Grocery & Daily Essentials');
  const [city, setCity] = useState(merchantInfo.city || 'Riyadh');
  const [postalCode, setPostalCode] = useState(merchantInfo.postalCode || '');
  const [vatNumber, setVatNumber] = useState(merchantInfo.vatNumber || '');
  const [logoUrl, setLogoUrl] = useState<string>(merchantInfo.logoUrl || '');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = businessName.trim().length > 0 && vatNumber.trim().length >= 10 && postalCode.trim().length >= 4;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    updateMerchantInfo({
      businessName: businessName.trim(),
      category,
      city,
      postalCode: postalCode.trim(),
      vatNumber: vatNumber.trim(),
      logoUrl,
    });
    navigateTo('MERCHANT_BANK_LINK');
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100%',
        backgroundColor: '#080C14',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px',
        boxSizing: 'border-box',
        userSelect: 'none',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Top Section */}
      <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        {/* Top Navigation Row (Back button at exact top-left) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: '40px',
            marginBottom: '24px',
          }}
        >
          <button
            onClick={goBack}
            aria-label="Go Back"
            className="interactive-tap"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </div>

        {/* Title Block (Exact same vertical Y-position & font hierarchy) */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 8px 0',
              letterSpacing: '-0.02em',
            }}
          >
            {isAr ? 'ملف المنشأة التجارية' : 'Business Profile'}
          </h1>
          <p
            style={{
              fontSize: '13.5px',
              color: '#94A3B8',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {isAr
              ? 'إعداد هوية المتجر والبيانات الضريبية لنظام الفوترة'
              : 'Configure store identity & ZATCA tax credentials'}
          </p>
        </div>

        {/* Form Container */}
        <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 1. Storefront & Brand Logo Inset Card */}
          <div
            style={{
              backgroundColor: '#111726',
              border: '1px solid #1E293B',
              borderRadius: '16px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Real Image Preview or Upload Button */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="interactive-tap"
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    border: '1.5px dashed rgba(0, 200, 83, 0.6)',
                    backgroundColor: 'rgba(0, 200, 83, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Store Logo"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#00C853' }}>
                      <Camera size={20} strokeWidth={2} />
                      <span style={{ fontSize: '7.5px', fontWeight: 800, marginTop: '2px' }}>
                        {isAr ? 'رفع' : 'UPLOAD'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF' }}>
                    {isAr ? 'صورة وهوية المنشأة' : 'Business Photo & Logo'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    {logoUrl
                      ? (isAr ? '✓ تم تحميل صورة المتجر بنجاح' : '✓ Real image active & verified')
                      : (isAr ? 'اضغط لرفع صورة من جهازك' : 'Tap to upload real photo from device')}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="interactive-tap"
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0, 200, 83, 0.12)',
                  border: '1px solid rgba(0, 200, 83, 0.3)',
                  color: '#00C853',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  flexShrink: 0,
                }}
              >
                <Camera size={13} />
                <span>{isAr ? 'تغيير الصورة' : 'Upload Image'}</span>
              </button>
            </div>
          </div>

          {/* 2. Registered Business Name */}
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#CBD5E1',
                marginBottom: '6px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {isAr ? 'اسم المنشأة المسجل' : 'Registered Business Name'} <span style={{ color: '#00C853' }}>*</span>
            </label>
            <div
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '14px',
                padding: '0 16px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxSizing: 'border-box',
              }}
            >
              <Building2 size={17} color="#00C853" style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value.slice(0, 60))}
                maxLength={60}
                placeholder={isAr ? 'أدخل اسم المنشأة' : 'Enter registered business name'}
                required
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  width: '100%',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              />
            </div>
          </div>

          {/* 3. Business Category Selector */}
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#CBD5E1',
                marginBottom: '6px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {isAr ? 'تصنيف النشاط التجاري' : 'Business Category'} <span style={{ color: '#00C853' }}>*</span>
            </label>
            <div
              style={{
                position: 'relative',
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '14px',
                padding: '0 16px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxSizing: 'border-box',
              }}
            >
              <Tag size={17} color="#00C853" style={{ flexShrink: 0 }} />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  width: '100%',
                  cursor: 'pointer',
                  appearance: 'none',
                  paddingRight: isRtl ? '0' : '24px',
                  paddingLeft: isRtl ? '24px' : '0',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.en} value={cat.en} style={{ backgroundColor: '#111726', color: '#FFFFFF' }}>
                    {isAr ? cat.ar : cat.en}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                color="#94A3B8"
                style={{
                  position: 'absolute',
                  right: isRtl ? 'auto' : '16px',
                  left: isRtl ? '16px' : 'auto',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* 4. ZATCA VAT ID */}
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#CBD5E1',
                marginBottom: '6px',
                display: 'block',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {isAr ? 'الرقم الضريبي زاتكا' : 'ZATCA VAT ID'} <span style={{ color: '#00C853' }}>*</span>
            </label>

            <div
              style={{
                backgroundColor: '#111726',
                border: '1px solid #1E293B',
                borderRadius: '14px',
                padding: '0 16px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxSizing: 'border-box',
              }}
            >
              <Hash size={17} color="#00C853" style={{ flexShrink: 0 }} />
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={15}
                value={vatNumber}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '');
                  setVatNumber(digits);
                }}
                placeholder="310948201900003"
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  fontFamily: 'monospace',
                  width: '100%',
                  direction: 'ltr',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              />
            </div>
          </div>

          {/* 5. 2-Column Row: City & Postal Code */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {/* City */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#CBD5E1',
                  marginBottom: '6px',
                  display: 'block',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                {isAr ? 'المدينة' : 'City'} <span style={{ color: '#00C853' }}>*</span>
              </label>
              <div
                style={{
                  position: 'relative',
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
                  borderRadius: '14px',
                  padding: '0 12px',
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxSizing: 'border-box',
                }}
              >
                <MapPin size={15} color="#00C853" style={{ flexShrink: 0 }} />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    width: '100%',
                    cursor: 'pointer',
                    appearance: 'none',
                    textAlign: isRtl ? 'right' : 'left',
                    paddingRight: isRtl ? '0' : '16px',
                    paddingLeft: isRtl ? '16px' : '0',
                  }}
                >
                  {CITIES.map((c) => (
                    <option key={c.en} value={c.en} style={{ backgroundColor: '#111726', color: '#FFFFFF' }}>
                      {isAr ? c.ar : c.en}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  color="#94A3B8"
                  style={{
                    position: 'absolute',
                    right: isRtl ? 'auto' : '10px',
                    left: isRtl ? '10px' : 'auto',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* Postal Code */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#CBD5E1',
                  marginBottom: '6px',
                  display: 'block',
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                {isAr ? 'الرمز البريدي' : 'Postal Code'} <span style={{ color: '#00C853' }}>*</span>
              </label>
              <div
                style={{
                  backgroundColor: '#111726',
                  border: '1px solid #1E293B',
                  borderRadius: '14px',
                  padding: '0 12px',
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxSizing: 'border-box',
                }}
              >
                <Mail size={15} color="#00C853" style={{ flexShrink: 0 }} />
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={5}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="12211"
                  required
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontVariantNumeric: 'tabular-nums',
                    width: '100%',
                    direction: 'ltr',
                    textAlign: isRtl ? 'right' : 'left',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            className="interactive-tap"
            style={{
              marginTop: '8px',
              height: '52px',
              backgroundColor: '#00C853',
              color: '#080C14',
              border: 'none',
              borderRadius: '14px',
              fontSize: '15.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: isFormValid ? '0 4px 20px rgba(0, 200, 83, 0.35)' : 'none',
              opacity: isFormValid ? 1 : 0.5,
              transition: 'all 0.2s ease',
            }}
            disabled={!isFormValid}
          >
            <span>{isAr ? 'حفظ ومتابعة' : 'Save & Continue'}</span>
            <ArrowRight size={18} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
          </button>
        </form>
      </div>
    </div>
  );
};

