import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../common/Button';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback
}) => {
  const { role, switchRole } = useAuth();

  if (!role || !allowedRoles.includes(role)) {
    if (fallback) return <>{fallback}</>;

    return (
      <div 
        id="access-denied-view"
        className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-rose-200 shadow-sm max-w-md mx-auto my-12"
      >
        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">Access Restricted</h3>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          This section is protected by Row Level Security and role-based policies. It requires one of the following permissions: <strong className="font-semibold text-slate-900">{allowedRoles.join(', ')}</strong>.
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => switchRole(allowedRoles[0])}
          >
            Switch to {allowedRoles[0]}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
