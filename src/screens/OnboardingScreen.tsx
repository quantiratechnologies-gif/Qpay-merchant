import React from 'react';
import { useApp } from '../state/AppContext';
import { QPayOnboarding } from '../components/onboarding/QPayOnboarding';

export const OnboardingScreen: React.FC = () => {
  const { navigateTo } = useApp();

  const handleComplete = () => {
    try {
      localStorage.setItem('hasSeenOnboarding', 'true');
    } catch {
      // Ignore local storage error
    }
    navigateTo('MOBILE_NUMBER');
  };

  return <QPayOnboarding onComplete={handleComplete} />;
};
