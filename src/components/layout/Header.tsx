import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  LogOut, 
  RefreshCw, 
  Database, 
  UserCheck, 
  ChevronDown,
  Bell,
  CheckCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { UserRole, AppNotification } from '../../types';
import { Badge } from '../common/Badge';
import { StudentActionMenu } from '../student/StudentActionMenu';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onSelectTab?: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, onSelectTab }) => {
  const { user, role, switchRole, logout, isLiveSupabase, resetDemoState } = useAuth();
  const { showToast } = useToast();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (user?.id) {
      setNotifications(StorageService.getNotifications(user.id));
    }
  }, [user?.id, role]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; badgeVariant: 'primary' | 'success' | 'warning' | 'purple' | 'neutral' }> = {
    student: { label: 'Student', badgeVariant: 'primary' },
    company: { label: 'Industry / Company', badgeVariant: 'purple' },
    faculty: { label: 'College / Faculty', badgeVariant: 'success' },
    mentor: { label: 'Mentor', badgeVariant: 'warning' },
    admin: { label: 'Admin', badgeVariant: 'neutral' }
  };

  const handleRoleSwitch = (targetRole: UserRole) => {
    switchRole(targetRole);
    setIsRoleDropdownOpen(false);
    showToast('info', 'Switched Persona', `Switched active session to ${roleLabels[targetRole].label}`);
  };

  const handleResetDemo = () => {
    resetDemoState();
    showToast('success', 'Demo State Reset', 'Restored default demo records and initial profile state.');
  };

  const handleLogout = async () => {
    await logout();
    showToast('info', 'Logged Out', 'You have been signed out.');
  };

  const handleViewAllNotifications = () => {
    setIsNotifDropdownOpen(false);
    if (onSelectTab) {
      onSelectTab('notifications');
    }
  };

  return (
    <header 
      id="app-header" 
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6"
    >
      {/* Left side: Hamburger + Branding */}
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-menu-toggle"
          onClick={onToggleMobileMenu}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-xs">
            <span className="text-base tracking-tighter">SIH</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 leading-none">
                SIH26044 Skill & Placement Portal
              </h1>
              <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 md:inline-block">
                Govt of India / AICTE
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-500 sm:block leading-tight mt-0.5">
              Academia–Industry Collaboration & Skill-Gap Mapping
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Role Switcher Demo Tool, Notifications & User Avatar */}
      <div className="flex items-center gap-2.5">
        {/* Quick Role Switcher for SIH Jury & Demonstrations */}
        <div className="relative">
          <button
            id="btn-role-switcher"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Role:</span>
            <Badge variant={role ? roleLabels[role].badgeVariant : 'default'} size="sm">
              {role ? roleLabels[role].label : 'Select Role'}
            </Badge>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div 
              id="role-dropdown-menu"
              className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in slide-in-from-top-1 z-50"
            >
              <div className="px-2 py-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Switch Role Persona
              </div>
              {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                <button
                  key={r}
                  id={`role-opt-${r}`}
                  onClick={() => handleRoleSwitch(r)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                    role === r ? 'bg-indigo-50 text-indigo-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{roleLabels[r].label}</span>
                  {role === r && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                </button>
              ))}
              <div className="my-1 border-t border-slate-100" />
              <button
                id="btn-reset-demo-state"
                onClick={handleResetDemo}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw className="w-3 h-3 text-slate-400" />
                Reset Demo Records
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            id="btn-notifications-header"
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl animate-in fade-in slide-in-from-top-1 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded">
                    {unreadCount} New
                  </span>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.slice(0, 3).map((n) => (
                  <div 
                    key={n.id} 
                    onClick={handleViewAllNotifications}
                    className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs space-y-0.5"
                  >
                    <p className="font-semibold text-slate-900 line-clamp-1">{n.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{n.message}</p>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No notifications</p>
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100">
                <button
                  onClick={handleViewAllNotifications}
                  className="w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 py-1"
                >
                  View all alerts →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Supabase connection indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100/80 text-[11px] text-slate-600">
          <Database className={`w-3.5 h-3.5 ${isLiveSupabase ? 'text-emerald-500' : 'text-indigo-500'}`} />
          <span>{isLiveSupabase ? 'Supabase Live' : 'Local Persistence'}</span>
        </div>

        {/* User Info & Logout */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            {role === 'student' && onSelectTab && (
              <StudentActionMenu onNavigateTab={onSelectTab} className="hidden sm:inline-block" />
            )}
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user.fullName}
              className="h-8 w-8 rounded-full border border-slate-200 object-cover"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                {user.fullName}
              </p>
              <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
            </div>
            <button
              id="btn-logout"
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};
