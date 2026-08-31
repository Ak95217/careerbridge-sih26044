import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreVertical,
  LayoutDashboard,
  UserCircle,
  UserCheck,
  FileText,
  TrendingUp,
  Award,
  Briefcase,
  Sparkles,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface StudentActionMenuProps {
  onNavigateTab: (tabId: string) => void;
  className?: string;
  buttonClassName?: string;
}

export const StudentActionMenu: React.FC<StudentActionMenuProps> = ({
  onNavigateTab,
  className = '',
  buttonClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const { showToast } = useToast();

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleAction = (tabId: string) => {
    setIsOpen(false);
    onNavigateTab(tabId);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    showToast('info', 'Logged Out', 'You have been signed out successfully.');
  };

  return (
    <div ref={menuRef} className={`relative inline-block text-left ${className}`}>
      <button
        id="btn-student-three-dot"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${buttonClassName}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Student action menu"
        title="Student Quick Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          id="student-three-dot-menu"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="btn-student-three-dot"
          className="absolute right-0 mt-2 w-60 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100 mb-1">
            Student Quick Menu
          </div>

          <div className="space-y-0.5">
            {/* 1. Home / Dashboard — MUST be the FIRST item */}
            <button
              id="menu-item-dashboard"
              role="menuitem"
              onClick={() => handleAction('dashboard')}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-900 transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Home / Dashboard</span>
            </button>

            {/* 2. My Profile */}
            <button
              id="menu-item-my-profile"
              role="menuitem"
              onClick={() => handleAction('profile')}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <UserCircle className="w-4 h-4 text-slate-500 shrink-0" />
              <span>My Profile</span>
            </button>

            {/* 3. Edit Profile */}
            <button
              id="menu-item-edit-profile"
              role="menuitem"
              onClick={() => handleAction('profile')}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Edit Profile</span>
            </button>

            {/* 4. Resume */}
            <button
              id="menu-item-resume"
              role="menuitem"
              onClick={() => handleAction('resume-builder')}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex items-center justify-between w-full">
                <span>Resume</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Builder</span>
              </div>
            </button>

            {/* 5. Skills & Skill Gap */}
            <button
              id="menu-item-skills-gap"
              role="menuitem"
              onClick={() => handleAction('skill-gap')}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Skills & Skill Gap</span>
            </button>

            {/* 6. Certificates */}
            <button
              id="menu-item-certificates"
              role="menuitem"
              onClick={() => handleAction('certificates')}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="flex items-center justify-between w-full">
                <span>Certificates</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">Verify</span>
              </div>
            </button>

            {/* 7. Applications */}
            <button
              id="menu-item-applications"
              role="menuitem"
              onClick={() => handleAction('applications')}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Applications</span>
            </button>

            {/* 8. AI Career Intelligence */}
            <button
              id="menu-item-ai-career"
              role="menuitem"
              onClick={() => handleAction('ai-career')}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-900 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <div className="flex items-center justify-between w-full">
                <span>AI Career Intelligence</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">AI</span>
              </div>
            </button>

            {/* Divider */}
            <div className="my-1 border-t border-slate-100" />

            {/* 9. Settings */}
            <button
              id="menu-item-settings"
              role="menuitem"
              onClick={() => handleAction('settings')}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Settings</span>
            </button>

            {/* 10. Logout */}
            <button
              id="menu-item-logout"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
