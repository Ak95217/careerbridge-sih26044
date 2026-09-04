import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AuthView } from './components/auth/AuthView';
import { AppLayout } from './components/layout/AppLayout';
import { MainDashboardRouter } from './components/dashboard/MainDashboardRouter';
import { OnboardingRouter } from './components/onboarding/OnboardingRouter';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { navigateToRoute, parseAppLocation } from './lib/appHistory';
import { isStudentProfileComplete } from './services/profileCompletion';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const handleNavigateTab = (tabId: string) => {
    if (!user || !role) return;
    setActiveTab(tabId);
    navigateToRoute({ kind: 'app', role, tab: tabId });
  };

  useEffect(() => {
    if (isLoading) return;

    const syncFromHistory = () => {
      const route = parseAppLocation();

      if (!isAuthenticated || !user) {
        if (route.kind !== 'auth') {
          navigateToRoute({ kind: 'auth', step: 'email' }, { replace: true });
        }
        return;
      }

      const profileComplete = user.role === 'student'
        ? isStudentProfileComplete(user)
        : Boolean(user.onboardingCompleted);

      if (!profileComplete) {
        if (route.kind !== 'onboarding') {
          navigateToRoute({ kind: 'onboarding' }, { replace: true });
        }
        return;
      }

      if (route.kind === 'app' && route.role === role && route.tab) {
        setActiveTab(route.tab);
      } else if (route.kind !== 'app') {
        navigateToRoute({ kind: 'app', role, tab: activeTab }, { replace: true });
      }
    };

    syncFromHistory();
    window.addEventListener('popstate', syncFromHistory);
    window.addEventListener('hashchange', syncFromHistory);
    return () => {
      window.removeEventListener('popstate', syncFromHistory);
      window.removeEventListener('hashchange', syncFromHistory);
    };
  }, [isLoading, isAuthenticated, user, role, activeTab]);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user || !role || (user.role === 'student' ? !isStudentProfileComplete(user) : !user.onboardingCompleted)) return;
    const route = parseAppLocation();
    if (!window.location.hash || window.location.hash === '#/' || route.kind !== 'app') {
      navigateToRoute({ kind: 'app', role, tab: activeTab }, { replace: true });
    }
  }, [isLoading, isAuthenticated, user, role, activeTab]);

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

  if (user.role === 'student' ? !isStudentProfileComplete(user) : !user.onboardingCompleted) {
    return <OnboardingRouter onComplete={() => {
      setActiveTab('dashboard');
      navigateToRoute({ kind: 'app', role: role || user.role, tab: 'dashboard' }, { replace: true });
    }} />;
  }

  return (
    <AppLayout activeTab={activeTab} onSelectTab={handleNavigateTab}>
      <MainDashboardRouter activeTab={activeTab} onNavigateTab={handleNavigateTab} />
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
