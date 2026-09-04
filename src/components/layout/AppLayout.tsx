import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SIHDemoBar } from '../common/SIHDemoBar';
import { useAuth } from '../../context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeTab,
  onSelectTab
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { role } = useAuth();
  const isStudentDashboard = role === 'student' && activeTab === 'dashboard';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* SIH Demonstration & Evaluation Guide Bar */}
      <SIHDemoBar onNavigateTab={onSelectTab} />

      {/* Top Header */}
      <Header 
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        onSelectTab={onSelectTab}
      />

      {/* Main App Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Main Workspace Canvas */}
        <main 
          id="main-content-canvas"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
        >
          <div className={isStudentDashboard ? 'w-full' : 'max-w-7xl mx-auto'}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

