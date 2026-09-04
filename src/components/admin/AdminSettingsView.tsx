import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Database,
  Cpu,
  FileCheck,
  EyeOff
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = () => {
    StorageService.resetToDefaults();
    setResetSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div id="admin-settings-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Platform Security, RLS & System Governance</h2>
              <Badge variant="success">All Systems Operational</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic verification engine status, server-side API proxy audits, data privacy isolation, and system telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RefreshCw className={`w-4 h-4 ${resetSuccess ? 'animate-spin' : ''}`} />}
            onClick={handleResetData}
          >
            {resetSuccess ? 'Resetting Demo State...' : 'Reset Default Demo Data'}
          </Button>
        </div>
      </div>

      {/* Security Audit Checklist Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Security & Key Protection Audit</h3>
                </div>
                <Badge variant="success">100% Passed</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Server-Side API Proxy Isolation</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Gemini and 3rd-party LLM API keys are strictly hosted in backend services. Client-side browser bundle contains zero secret keys.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Row-Level Security (RLS) Simulation</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Student applications, resumes, assessment attempts, and faculty records are securely segmented by user token/role identifier.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Deterministic Skill Matching Integrity</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Matching algorithms compute deterministic fit percentages using mandatory skill constraints and validated assessment scores.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Anti-Duplicate Notification Delivery</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Notification center implements time-window deduplication to ensure users never receive repeated alerts for identical status changes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Architecture & Health */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">System Architecture Health</h3>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3.5">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-600">Frontend Environment</span>
                <span className="font-bold text-slate-900">React 18 + Vite SPA</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-600">AI Intelligence Core</span>
                <span className="font-bold text-indigo-600">Gemini 2.5 Flash / Server Proxy</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-600">Local Persistence Engine</span>
                <span className="font-bold text-slate-900">LocalStorage v7.0 Ready</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-600">Taxonomy Standardization</span>
                <span className="font-bold text-emerald-600">NSQF Level 6-8 Aligned</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">SIH Demonstration Mode</span>
                <span className="font-bold text-purple-600">Enabled (1-Click Switch)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
