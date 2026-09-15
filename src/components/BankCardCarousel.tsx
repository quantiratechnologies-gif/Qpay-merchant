import React, { useState, useRef } from 'react';
import type { BankAccount } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useApp } from '../state/AppContext';
import {
  Landmark,
  Building2,
  Wallet,
  Star,
  PiggyBank,
  Briefcase,
  Zap,
  Eye,
  EyeOff,
  Plus,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface BankCardCarouselProps {
  banks: BankAccount[];
}

const getBankIcon = (bankName: string) => {
  const lower = bankName.toLowerCase();
  if (lower.includes('rajhi')) {
    return <Landmark size={20} color="#34d399" />;
  }
  if (lower.includes('snb') || lower.includes('national')) {
    return <Building2 size={20} color="#34d399" />;
  }
  if (lower.includes('riyad') || lower.includes('alinma')) {
    return <Wallet size={20} color="#34d399" />;
  }
  return <Landmark size={20} color="#34d399" />;
};

const getTierIcon = (bank: BankAccount) => {
  if (bank.isPrimary) {
    return <Star size={17} color="#34d399" fill="#34d399" />;
  }
  const lowerType = bank.accountType.toLowerCase();
  if (lowerType.includes('saving')) {
    return <PiggyBank size={17} color="#34d399" />;
  }
  if (lowerType.includes('business') || lowerType.includes('merchant')) {
    return <Briefcase size={17} color="#34d399" />;
  }
  return <Star size={17} color="#34d399" />;
};

export const BankCardCarousel: React.FC<BankCardCarouselProps> = ({ banks }) => {
  const { navigateTo, openPinModal, toggleShowBalance, setIsAddBankModalOpen, t, language, isRtl } = useApp();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftState(carouselRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const cardWidth = 320;
    const scrollPos = Math.abs(carouselRef.current.scrollLeft);
    const index = Math.round(scrollPos / cardWidth);
    setActiveCardIndex(Math.min(Math.max(index, 0), banks.length - 1));
  };

  const handleCardBalanceClick = (bank: BankAccount, e: React.MouseEvent) => {
    e.stopPropagation();
    const bankTitle = t(bank.bankName, bank.bankName);
    const accType = t(bank.accountType, bank.accountType);

    if (bank.showBalance) {
      toggleShowBalance(bank.id);
    } else {
      openPinModal({
        title: `${t('banks.check_balance', 'Check Balance')} - ${bankTitle}`,
        subTitle: `${accType} • ${bank.accountNumberMasked}`,
        amount: bank.balance,
        onSuccess: () => toggleShowBalance(bank.id),
      });
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Section Header Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          marginBottom: '12px',
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '0.2px' }}>
          {t('home.linked_banks', 'Linked Saudi Banks')}
        </h3>

        <button
          onClick={() => navigateTo('BANK_ACCOUNTS')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            color: '#34d399',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            boxShadow: 'none',
            padding: 0,
          }}
        >
          <span>{t('banks.title', 'Bank Accounts')}</span>
          <ChevronRight size={15} style={{ transform: isRtl ? 'scaleX(-1)' : 'none' }} />
        </button>
      </div>

      {/* Swipable Cards Container */}
      <div
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          scrollSnapType: isMouseDown ? 'none' : 'x mandatory',
          padding: '4px 20px 10px 20px',
          scrollPadding: '0 20px',
          scrollPaddingInline: '20px',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          cursor: isMouseDown ? 'grabbing' : 'grab',
          userSelect: 'none',
          boxSizing: 'border-box',
        }}
      >
        {banks.map((bank) => {
          const rawNumbers = bank.accountNumberMasked.replace(/[^0-9]/g, '') || '4821';
          const displayBankName = t(bank.bankName, bank.bankName);
          const displayAccType = t(bank.accountType, bank.accountType);

          return (
            <div
              key={bank.id}
              onClick={() => navigateTo('BANK_ACCOUNTS')}
              className="interactive-tap"
              style={{
                scrollSnapAlign: 'start',
                flex: '0 0 min(315px, calc(100% - 40px))',
                width: 'min(315px, calc(100% - 40px))',
                background: 'linear-gradient(135deg, #072e1f 0%, #021710 100%)',
                borderRadius: '24px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxSizing: 'border-box',
                cursor: 'pointer',
                color: '#FFFFFF',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* 1. Card Top Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      backgroundColor: 'rgba(8, 45, 30, 0.9)',
                      border: '1px solid rgba(52, 211, 153, 0.25)',
                      borderRadius: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getBankIcon(bank.bankName)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h4
                      style={{
                        fontSize: '14.5px',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        margin: 0,
                        letterSpacing: '0.01em',
                        lineHeight: '18px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {displayBankName}
                    </h4>
                    <div
                      style={{
                        fontSize: '11.5px',
                        color: '#a3d9bc',
                        fontWeight: 500,
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span>{displayAccType}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#34d399', fontWeight: 600 }}>
                        <ShieldCheck size={11} color="#34d399" /> {language === 'العربية' ? 'سريع' : 'Sarie'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Tier Icon Badge (Replaces long text) */}
                <div
                  title={bank.isPrimary ? (language === 'العربية' ? 'الحساب الأساسي' : 'Primary Account') : displayAccType}
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'rgba(8, 45, 30, 0.9)',
                    border: '1px solid rgba(52, 211, 153, 0.25)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getTierIcon(bank)}
                </div>
              </div>

              {/* 2. Middle Row: Chip Graphic + Masked Number */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 2 }}>
                {/* Gold EMV Chip Graphic */}
                <div
                  style={{
                    width: '36px',
                    height: '26px',
                    borderRadius: '5px',
                    background: 'linear-gradient(135deg, #fde047 0%, #ca8a04 100%)',
                    padding: '2px',
                    boxSizing: 'border-box',
                    border: '1px solid rgba(0,0,0,0.3)',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      border: '0.5px solid rgba(0,0,0,0.2)',
                      borderRadius: '3px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-around',
                      padding: '2px 0',
                    }}
                  >
                    <div style={{ height: '0.5px', backgroundColor: 'rgba(0,0,0,0.35)', width: '100%' }} />
                    <div style={{ height: '0.5px', backgroundColor: 'rgba(0,0,0,0.35)', width: '100%' }} />
                  </div>
                </div>

                {/* Masked Card Number */}
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '14.5px',
                    letterSpacing: '2px',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    direction: 'ltr',
                  }}
                >
                  ••••  ••••  ••••  {rawNumbers}
                </div>
              </div>

              {/* 3. Card Footer: Available Balance & Action */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(52, 211, 153, 0.15)',
                  paddingTop: '12px',
                  zIndex: 2,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {bank.showBalance ? (
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.01em' }}>
                      {formatCurrency(bank.balance, language)}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#a3d9bc', fontSize: '11.5px', fontWeight: 600 }}>
                      <Zap size={13} color="#4ade80" />
                      <span>{language === 'العربية' ? 'شبكة سريع ٢٤/٧' : 'Sarie 24/7 Rail'}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => handleCardBalanceClick(bank, e)}
                  title={bank.showBalance ? t('home.hide', 'Hide') : t('banks.check_balance', 'Balance')}
                  className="interactive-tap"
                  style={{
                    backgroundColor: '#4ade80',
                    color: '#022c1b',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '7px 14px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 4px 12px rgba(74, 222, 128, 0.25)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {bank.showBalance ? <EyeOff size={13} color="#022c1b" /> : <Eye size={13} color="#022c1b" />}
                  <span>{bank.showBalance ? t('home.hide', 'Hide') : t('banks.check_balance', 'Balance')}</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Bank CTA Card */}
        <div
          onClick={() => setIsAddBankModalOpen(true)}
          className="interactive-tap"
          style={{
            scrollSnapAlign: 'start',
            flex: '0 0 135px',
            background: 'linear-gradient(135deg, #072e1f 0%, #021710 100%)',
            border: '1.5px dashed rgba(52, 211, 153, 0.35)',
            borderRadius: '24px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxSizing: 'border-box',
            textAlign: 'center',
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(52, 211, 153, 0.15)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(52, 211, 153, 0.3)',
            }}
          >
            <Plus size={20} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>{t('banks.add_bank', 'Add Bank')}</span>
          <span style={{ fontSize: '10.5px', color: '#a3d9bc' }}>{language === 'العربية' ? 'ربط حساب' : 'Link Account'}</span>
        </div>
        <div style={{ flex: '0 0 1px', width: '1px', flexShrink: 0 }} />
      </div>

      {/* Pagination Indicator Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
        {banks.map((_, i) => (
          <span
            key={i}
            style={{
              width: i === activeCardIndex ? '16px' : '6px',
              height: '5px',
              borderRadius: i === activeCardIndex ? '3px' : '50%',
              backgroundColor: i === activeCardIndex ? '#34d399' : 'rgba(52, 211, 153, 0.25)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};
