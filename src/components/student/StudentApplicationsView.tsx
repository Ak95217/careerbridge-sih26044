import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { StudentProfile, Application, ApplicationStatus } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { 
  Briefcase, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  AlertCircle, 
  FileText, 
  ExternalLink,
  Users
} from 'lucide-react';

interface StudentApplicationsViewProps {
  onNavigateTab: (tabId: string) => void;
}

const PIPELINE_STEPS: ApplicationStatus[] = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Selected'
];

export const StudentApplicationsView: React.FC<StudentApplicationsViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const student = user as StudentProfile;

  const [applications, setApplications] = useState<Application[]>(() => StorageService.getApplications(student?.id));
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredApps = applications.filter(app => {
    if (statusFilter === 'All') return true;
    return app.status === statusFilter;
  });

  const getStatusBadgeVariant = (status: ApplicationStatus) => {
    switch (status) {
      case 'Selected': return 'success';
      case 'Interview': return 'purple';
      case 'Shortlisted': return 'primary';
      case 'Under Review': return 'warning';
      case 'Rejected': return 'danger';
      default: return 'neutral';
    }
  };

  const getStepIndex = (status: ApplicationStatus) => {
    if (status === 'Rejected') return -1;
    return PIPELINE_STEPS.indexOf(status);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Application Pipeline & Tracking</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Real-time status updates, recruiter reviews, and scheduled technical interview rounds across your submitted internship and placement applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigateTab('internships')}
            leftIcon={<Briefcase className="w-3.5 h-3.5" />}
          >
            Browse More Internships
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onNavigateTab('jobs')}
          >
            Explore Jobs
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === status
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {status} ({status === 'All' ? applications.length : applications.filter(a => a.status === status).length})
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center space-y-3">
              <Clock className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No applications in this category</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You haven't submitted applications with status "{statusFilter}". Explore new opportunities and submit your profile with 1-click.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigateTab('internships')}
              >
                Discover Internships
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredApps.map((app) => {
            const currentStepIdx = getStepIndex(app.status);

            return (
              <Card key={app.id} className="hover:border-slate-300 transition-all">
                <CardContent className="p-6 space-y-5">
                  {/* Top Row: Title, Company, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{app.opportunityTitle}</h3>
                          <Badge variant={getStatusBadgeVariant(app.status)} size="sm">
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">{app.companyName}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Applied on {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Skill Match Badge */}
                    <div className="text-right sm:text-right shrink-0">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-800 font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{app.skillMatchScore || 0}% Skill Match</span>
                      </div>
                    </div>
                  </div>

                  {/* 5-Step Visual Pipeline Timeline */}
                  {app.status !== 'Rejected' ? (
                    <div className="pt-2">
                      <div className="grid grid-cols-5 gap-2 relative">
                        {PIPELINE_STEPS.map((step, idx) => {
                          const isCompleted = idx <= currentStepIdx;
                          const isCurrent = idx === currentStepIdx;

                          return (
                            <div key={step} className="flex flex-col items-center text-center space-y-1.5">
                              <div
                                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                                  isCompleted
                                    ? isCurrent
                                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-xs'
                                      : 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                                }`}
                              >
                                {isCompleted && !isCurrent ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  idx + 1
                                )}
                              </div>
                              <span className={`text-[11px] font-semibold ${
                                isCurrent ? 'text-indigo-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                              }`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Application not moved forward. Review feedback below and apply for related openings.</span>
                    </div>
                  )}

                  {/* Extra Details & Recruiter Notes */}
                  {(app.notes || app.interviewDate) && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-2 text-xs">
                      {app.interviewDate && (
                        <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          <span>Interview Scheduled: <strong>{new Date(app.interviewDate).toLocaleString()}</strong></span>
                        </div>
                      )}
                      {app.notes && (
                        <p className="text-slate-600">
                          <strong>Recruiter Feedback / Notes:</strong> {app.notes}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
