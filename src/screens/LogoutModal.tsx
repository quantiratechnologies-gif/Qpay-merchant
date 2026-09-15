import React, { useState } from 'react';
import { LogOut, CheckCircle2 } from 'lucide-react';
import { BottomSheet } from '../components/BottomSheet';
import { useApp } from '../state/AppContext';

export const LogoutModal: React.FC = () => {
  const { isLogoutModalOpen, setIsLogoutModalOpen, performLogout, t, language } = useApp();
  const [isLoggedOutSuccess, setIsLoggedOutSuccess] = useState(false);

  const handleConfirmLogout = () => {
    setIsLoggedOutSuccess(true);
    setTimeout(() => {
      setIsLoggedOutSuccess(false);
      performLogout();
    }, 1400);
  };

  return (
    <BottomSheet
      isOpen={isLogoutModalOpen}
      onClose={() => {
        if (!isLoggedOutSuccess) setIsLogoutModalOpen(false);
      }}
      title={isLoggedOutSuccess ? undefined : t('profile.logout', 'Log out')}
    >
      {isLoggedOutSuccess ? (
        <div className="fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(127, 232, 127, 0.15)',
              color: '#7FE87F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              boxShadow: 'none',
              border: '2px solid #7FE87F',
            }}
          >
            <CheckCircle2 size={32} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF' }}>
            {language === 'العربية' ? 'تم تسجيل الخروج بنجاح' : 'Logged Out Successfully'}
          </h3>
          <p style={{ color: '#B3B3C2', fontSize: '13px', marginTop: '6px' }}>
            {language === 'العربية' ? 'جاري العودة لشاشة تسجيل الدخول...' : 'Returning to mobile registration screen...'}
          </p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '10px 0 20px 0' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#3A3A52',
              color: '#FF6B6B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '1px solid #4D4D6B',
            }}
          >
            <LogOut size={26} />
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF' }}>
            {language === 'العربية' ? 'تأكيد تسجيل الخروج' : 'Confirm Logout'}
          </h3>
          <p style={{ color: '#B3B3C2', fontSize: '14px', marginBottom: '24px' }}>
            {language === 'العربية'
              ? 'هل أنت متأكد من تسجيل الخروج من كيو تي باي؟ سيتم إنهاء جلستك بأمان.'
              : 'Are you sure you want to log out of QTPay? Your session will be safely cleared.'}
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              style={{
                flex: 1,
                backgroundColor: '#3A3A52',
                border: '1px solid #4D4D6B',
                borderRadius: '12px',
                padding: '14px',
                color: '#B3B3C2',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: 'none',
              }}
            >
              {t('btn.cancel', 'Cancel')}
            </button>
            <button
              onClick={handleConfirmLogout}
              style={{
                flex: 1,
                backgroundColor: '#FF6B6B',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                color: '#0B0B14',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: 'none',
              }}
            >
              {t('profile.logout', 'Log Out')}
            </button>
          </div>
        </div>
      )}
    </BottomSheet>
  );
};
