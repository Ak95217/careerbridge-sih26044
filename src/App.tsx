import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AuthView } from './components/auth/AuthView';
import { AppLayout } from './components/layout/AppLayout';
import { MainDashboardRouter } from './components/dashboard/MainDashboardRouter';
import { OnboardingRouter } from './components/onboarding/OnboardingRouter';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Reset tab to dashboard when switching role
  useEffect(() => {
    setActiveTab('dashboard');
  }, [role]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner message="Initializing SIH26044 Foundation Engine..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <AuthView />;
  }

  // If user hasn't completed onboarding, show role-specific onboarding setup
  if (!user.onboardingCompleted) {
    return <OnboardingRouter onComplete={() => setActiveTab('dashboard')} />;
  }

  return (
    <AppLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      <MainDashboardRouter activeTab={activeTab} onNavigateTab={setActiveTab} />
    </AppLayout>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
