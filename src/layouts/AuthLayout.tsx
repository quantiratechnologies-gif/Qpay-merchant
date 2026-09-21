import React from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { LanguageModal } from '../components/modals/LanguageModal';

export const AuthLayout: React.FC = () => {
  const { isRtl } = useApp();

  return (
    <div className={`app-viewport ${isRtl ? 'rtl' : ''}`}>
      <div className="screen-content">
        <Outlet />
      </div>
      <LanguageModal />
    </div>
  );
};
