import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ShieldCheck, Users, Building2, GraduationCap, Award, Sliders } from 'lucide-react';

interface AdminFoundationViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const AdminFoundationView: React.FC<AdminFoundationViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const admin = user as AdminProfile;

  if (!admin) return null;

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{admin.fullName}</h2>
              <Badge variant="neutral">System Super Admin</Badge>
              <Badge variant="success">All Rights Granted</Badge>
            </div>
            <p className="text-xs text-slate-600 mt-1">{admin.department}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Permissions: <strong className="text-slate-700">{admin.permissions?.join(', ')}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="primary" 
            leftIcon={<Award className="w-4 h-4" />}
            onClick={() => onNavigateTab('skills')}
          >
            Manage Taxonomy
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            leftIcon={<Sliders className="w-4 h-4" />}
            onClick={() => onNavigateTab('settings')}
          >
            System Settings
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Registered Students</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">1,248</h3>
                <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">+142 this week</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Partner Companies</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">84</h3>
                <p className="text-[11px] text-purple-600 mt-0.5 font-medium">78 AICTE Verified</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Affiliated Colleges</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">45</h3>
                <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">Tier-1 & Tier-2 Institutes</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Active Mentors</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">36</h3>
                <p className="text-[11px] text-amber-600 mt-0.5 font-medium">Industry Leaders</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Governance Panel */}
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-sm font-bold text-slate-900">National Platform Health & Security Governance</h3>
            <p className="text-xs text-slate-500">Row Level Security active across all relational entities</p>
          </div>
          <Badge variant="success">All Systems Operational</Badge>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 className="text-xs font-bold text-slate-900">Row Level Security Status</h4>
              <p className="text-xs text-slate-600 mt-1">
                PostgreSQL RLS policies enabled for `profiles`, `students`, `companies`, `opportunities`, `applications`.
              </p>
              <div className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 16 Table Policies Verified
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 className="text-xs font-bold text-slate-900">Taxonomy Standardization</h4>
              <p className="text-xs text-slate-600 mt-1">
                Unified skill database standardizing 12+ industry categories, proficiency tiers, and assessment engines.
              </p>
              <div className="mt-2 text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> 100% Taxonomical Accuracy
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 className="text-xs font-bold text-slate-900">Audit & Session Logs</h4>
              <p className="text-xs text-slate-600 mt-1">
                Session tokens securely refreshed and synchronized with Supabase JWT and local encrypted storage.
              </p>
              <div className="mt-2 text-[11px] text-purple-700 font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Zero Unauthorized Escalations
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
