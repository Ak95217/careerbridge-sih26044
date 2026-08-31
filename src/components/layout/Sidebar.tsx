import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_NAVIGATION, NavItem } from './navConfig';
import { X, ShieldAlert } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { role, user } = useAuth();
  const navItems: NavItem[] = role ? ROLE_NAVIGATION[role] || [] : [];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 font-bold text-white text-xs">
              SIH
            </div>
            <span className="text-xs font-bold text-slate-800">Navigation</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Badge Banner */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Workspace
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs font-bold capitalize text-slate-800">
              {role ? `${role} Portal` : 'Guest Session'}
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
              Active
            </span>
          </div>
          {user && (
            <p className="mt-1 text-[11px] text-slate-500 truncate">
              {user.fullName}
            </p>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info inside sidebar */}
        <div className="border-t border-slate-100 p-4 text-[11px] text-slate-500 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-1.5 text-slate-600">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-medium">RLS Protected</span>
          </div>
          <span className="text-[10px] text-slate-400">v1.0.0</span>
        </div>
      </aside>
    </>
  );
};
