import React from 'react';
import { ProficiencyLevel, ApplicationStatus, WorkMode } from '../../types';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'cyan' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  }[size];

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    cyan: 'bg-sky-50 text-sky-700 border border-sky-200',
    neutral: 'bg-slate-800 text-white',
  }[variant];

  return (
    <span className={`inline-flex items-center gap-1 rounded-md whitespace-nowrap ${sizeClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

export const ProficiencyBadge: React.FC<{ level: ProficiencyLevel }> = ({ level }) => {
  const map: Record<ProficiencyLevel, { variant: BadgeProps['variant'] }> = {
    Beginner: { variant: 'default' },
    Intermediate: { variant: 'primary' },
    Advanced: { variant: 'purple' },
    Expert: { variant: 'success' }
  };
  return <Badge variant={map[level]?.variant || 'default'}>{level}</Badge>;
};

export const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const map: Record<ApplicationStatus, { variant: BadgeProps['variant'] }> = {
    'Applied': { variant: 'default' },
    'Under Review': { variant: 'warning' },
    'Shortlisted': { variant: 'primary' },
    'Interview': { variant: 'purple' },
    'Selected': { variant: 'success' },
    'Rejected': { variant: 'danger' }
  };
  return <Badge variant={map[status]?.variant || 'default'}>{status}</Badge>;
};

export const WorkModeBadge: React.FC<{ mode: WorkMode }> = ({ mode }) => {
  const map: Record<WorkMode, { variant: BadgeProps['variant'] }> = {
    'Remote': { variant: 'purple' },
    'On-site': { variant: 'default' },
    'Hybrid': { variant: 'cyan' }
  };
  return <Badge variant={map[mode]?.variant || 'default'}>{mode}</Badge>;
};
