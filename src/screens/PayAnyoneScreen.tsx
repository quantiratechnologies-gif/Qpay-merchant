import React, { useState } from 'react';
import { Search, ChevronRight, Store, X, ArrowRight } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { useApp } from '../state/AppContext';
import type { Contact } from '../types';

export const PayAnyoneScreen: React.FC = () => {
  const { contacts, merchants, navigateTo, t, isRtl, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.upiId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.mobile.includes(searchQuery)
  );

  const filteredMerchants = merchants.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.upiId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectContact = (contact: Contact) => {
    navigateTo('SEND_AMOUNT', { contact });
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#0B0B14', minHeight: '100%', paddingBottom: '24px' }}>
      <AppHeader title={t('pay.send_money', 'Pay Anyone')} showBack showSettings />

      {/* Search Input Field */}
      <div style={{ padding: '0 20px', margin: '16px 0 20px 0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#151524',
            border: '1px solid #2C2C44',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: 'none',
            transition: 'border-color 0.2s ease',
          }}
        >
          <Search size={18} color="#7FE87F" />
          <input
            id="search-contact-input"
            type="text"
            placeholder={language === 'العربية' ? 'ابحث بالاسم، معرف سريع، أو رقم الجوال' : 'Search name, UPI ID, or number'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search UPI ID or mobile number"
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#FFFFFF',
              fontSize: '14.5px',
              fontWeight: 600,
              width: '100%',
              padding: 0,
              textAlign: isRtl ? 'right' : 'left',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="interactive-tap"
              style={{
                background: 'none',
                border: 'none',
                color: '#6E6E85',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Frequent Contacts */}
      <div style={{ padding: '0 20px', marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#A2A2BA',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('pay.quick_contacts', 'Contacts')}
          </span>
          <span style={{ fontSize: '11px', color: '#7FE87F', fontWeight: 700 }}>
            {filteredContacts.length}
          </span>
        </div>

        {filteredContacts.length === 0 ? (
          <div style={{ color: '#6E6E85', fontSize: '13px', padding: '16px', textAlign: 'center', backgroundColor: '#151524', borderRadius: '12px', border: '1px solid #2C2C44' }}>
            {language === 'العربية' ? 'لم يتم العثور على جهات اتصال' : 'No contacts found'}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: 'none',
            }}
          >
            {filteredContacts.map((contact, index) => {
              const displayName = t(contact.name, contact.name);
              return (
                <div
                  key={contact.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectContact(contact)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSelectContact(contact);
                    }
                  }}
                  className="interactive-tap"
                  aria-label={`Pay ${displayName}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderBottom: index < filteredContacts.length - 1 ? '1px solid #1E1E32' : 'none',
                    cursor: 'pointer',
                    backgroundColor: '#151524',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: '#1E1E32',
                        color: '#7FE87F',
                        fontWeight: 800,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #2C2C44',
                        flexShrink: 0,
                      }}
                    >
                      {contact.avatarInitials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14.5px', color: '#FFFFFF', lineHeight: '18px' }}>
                        {displayName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#7FE87F', fontWeight: 600, marginTop: '2px' }}>
                        {contact.upiId} &bull; <span style={{ color: '#A2A2BA' }} dir="ltr">{contact.mobile}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: '#7FE87F',
                        color: '#000000',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      {t('nav.pay', 'Pay')}{' '}
                      <ArrowRight size={12} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {filteredMerchants.length > 0 && (
        <div style={{ padding: '0 20px', marginBottom: '24px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#A2A2BA',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '12px',
            }}
          >
            {t('history.merchant', 'Merchants')}
          </div>

          <div
            style={{
              backgroundColor: '#151524',
              border: '1px solid #2C2C44',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: 'none',
            }}
          >
            {filteredMerchants.map((merchant, index) => {
              const displayMerchantName = t(merchant.name, merchant.name);
              return (
                <div
                  key={merchant.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectContact(merchant)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSelectContact(merchant);
                    }
                  }}
                  className="interactive-tap"
                  aria-label={`Pay merchant ${displayMerchantName}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderBottom: index < filteredMerchants.length - 1 ? '1px solid #1E1E32' : 'none',
                    cursor: 'pointer',
                    backgroundColor: '#151524',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: '#1E1E32',
                        color: '#7FE87F',
                        fontWeight: 800,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #2C2C44',
                        flexShrink: 0,
                      }}
                    >
                      <Store size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14.5px', color: '#FFFFFF', lineHeight: '18px' }}>
                        {displayMerchantName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#7FE87F', fontWeight: 600, marginTop: '2px' }}>
                        {merchant.upiId}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} color="#6E6E85" style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
