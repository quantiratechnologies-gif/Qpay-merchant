import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { BottomNavigation } from '../components/BottomNavigation';

// Modals
import { LanguageModal } from '../components/modals/LanguageModal';
import { LogoutModal } from '../components/modals/LogoutModal';
import { AddBankModal } from '../components/modals/AddBankModal';
import { EditProfileModal } from '../components/modals/EditProfileModal';
import { KycModal } from '../components/modals/KycModal';
import { ManagerPinModal } from '../components/ManagerPinModal';

export const MainLayout: React.FC = () => {
  const { isRtl, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/mobile-number" replace />;
  }

  return (
    <div className={`app-viewport ${isRtl ? 'rtl' : ''}`}>
      <div className="screen-content">
        <Outlet />
      </div>
      
      <BottomNavigation />

      <LanguageModal />
      <LogoutModal />
      <AddBankModal />
      <EditProfileModal />
      <KycModal />
      <ManagerPinModal />
    </div>
  );
};
