import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Application, ApplicationStatus, CompanyProfile, Opportunity, StudentProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Input, Select, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { CandidateDetailModal } from './CandidateDetailModal';
import { CompanyInterviewModal } from './CompanyInterviewModal';
import { useToast } from '../../context/ToastContext';
import { 
  Users, 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Target, 
  Sparkles, 
  GraduationCap, 
  ChevronRight, 
  ExternalLink,
  MessageSquare,
  Building2,
  Briefcase
} from 'lucide-react';

const STATUS_OPTIONS: ApplicationStatus[] = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Selected',
  'Rejected'
];

interface CompanyApplicationsViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const CompanyApplicationsView: React.FC<CompanyApplicationsViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const company = user as CompanyProfile;

  // Data
  const [applications, setApplications] = useState<Application[]>(() => {
    return StorageService.getApplications({ companyId: company?.id || '' });
  });
  const opportunities = StorageService.getOpportunitiesByCompany(company?.id || '');

  // Filters
  const [selectedOppId, setSelectedOppId] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [inspectCandidate, setInspectCandidate] = useState<StudentProfile | null>(null);
  const [inspectTargetOpp, setInspectTargetOpp] = useState<Opportunity | null>(null);
  const [interviewApplication, setInterviewApplication] = useState<Application | null>(null);

  // Status Note Modal
  const [statusModalApp, setStatusModalApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Under Review');
  const [statusNotes, setStatusNotes] = useState('');

  const refreshApplications = () => {
    setApplications(StorageService.getApplications({ companyId: company?.id || '' }));
  };

  const handleOpenStatusModal = (app: Application, targetStatus: ApplicationStatus) => {
    setStatusModalApp(app);
    setNewStatus(targetStatus);
    setStatusNotes(app.notes || '');
  };

  const handleConfirmStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalApp) return;

    StorageService.updateApplicationStatus(statusModalApp.id, newStatus, statusNotes);
    showToast({
      type: 'success',
      title: `Status Updated to ${newStatus}`,
      message: `${statusModalApp.studentName}'s application has been moved to ${newStatus}.`
    });

    refreshApplications();
    setStatusModalApp(null);
  };

  const handleOpenInspect = (app: Application) => {
    const student = StorageService.getStudentById(app.studentId);
    const opp = StorageService.getOpportunityById(app.opportunityId);
    if (student) {
      setInspectCandidate(student);
      setInspectTargetOpp(opp);
    } else {
      // Create fallback student view from application data
      const fallbackStudent: StudentProfile = {
        id: app.studentId,
        email: app.studentEmail,
        fullName: app.studentName,
        role: 'student',
        collegeName: app.studentCollege,
        degree: 'Bachelor of Technology',
        branch: app.studentBranch || 'Computer Science and Engineering',
        graduationYear: app.studentGraduationYear || 2026,
        cgpa: app.studentCgpa,
        skills: app.studentSkills.map((s, idx) => ({
          id: `s-${idx}`,
          skillId: `sk-${idx}`,
          name: s.name,
          category: 'Technical',
          proficiency: s.proficiency,
          verified: true,
          verifiedScore: 85
        })),
        certifications: [],
        projects: [],
        profileCompletion: 80,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setInspectCandidate(fallbackStudent);
      setInspectTargetOpp(opp);
    }
  };

  // Filter Pipeline Count Helpers
  const getCountByStatus = (status: ApplicationStatus) => {
    return applications.filter(a => a.status === status).length;
  };

  // Filtered List
  const filtered = applications.filter(app => {
    if (selectedOppId !== 'All' && app.opportunityId !== selectedOppId) return false;
    if (selectedStatus !== 'All' && app.status !== selectedStatus) return false;
    if (app.skillMatchScore < minMatchFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.studentName.toLowerCase().includes(q);
      const matchCollege = app.studentCollege.toLowerCase().includes(q);
      const matchRole = app.opportunityTitle.toLowerCase().includes(q);
      const matchSkill = (app.matchingSkills || []).some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchCollege && !matchRole && !matchSkill) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Application Review Pipeline</h2>
            <Badge variant="purple">Candidate Management</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming student applications, evaluate deterministic skill matches, and coordinate interviews
          </p>
        </div>

        {onNavigateTab && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigateTab('internships')}
            >
              Post Opportunity
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => onNavigateTab('candidates')}
            >
              Discover Talent
            </Button>
          </div>
        )}
      </div>

      {/* Stage Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        {STATUS_OPTIONS.map((status) => {
          const count = getCountByStatus(status);
          const isCurrentFilter = selectedStatus === status;
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(isCurrentFilter ? 'All' : status)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isCurrentFilter 
                  ? 'border-purple-600 bg-purple-50/70 shadow-xs ring-1 ring-purple-600' 
                  : 'border-slate-200/80 bg-white hover:border-slate-300'
              }`}
            >
              <span className="text-[11px] font-semibold text-slate-500 block">{status}</span>
              <p className="text-xl font-black text-slate-900 mt-0.5">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Input
            placeholder="Search candidate name, college, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-48">
            <Select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
            >
              <option value="All">All Opportunities</option>
              {opportunities.map(o => (
                <option key={o.id} value={o.id}>{o.title}</option>
              ))}
            </Select>
          </div>

          <div className="w-36">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Stages</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>

          <div className="w-40">
            <Select
              value={String(minMatchFilter)}
              onChange={(e) => setMinMatchFilter(Number(e.target.value))}
            >
              <option value="0">All Match Scores</option>
              <option value="90">≥ 90% Match</option>
              <option value="80">≥ 80% Match</option>
              <option value="70">≥ 70% Match</option>
              <option value="60">≥ 60% Match</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No Applicants in this Filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No applicant records matched your criteria. Clear or widen your filters to view more candidates.
            </p>
            <div className="pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedOppId('All');
                  setSelectedStatus('All');
                  setMinMatchFilter(0);
                  setSearchQuery('');
                }}
              >
                Reset All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const isMatchHigh = app.skillMatchScore >= 80;
            const isMatchMedium = app.skillMatchScore >= 65 && app.skillMatchScore < 80;

            return (
              <Card key={app.id} className="hover:border-purple-200 transition-colors">
                <CardContent className="p-5 space-y-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Candidate Identity */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">{app.studentName}</h3>
                        <Badge variant="primary">CGPA {app.studentCgpa}</Badge>
                        <Badge
                          variant={
                            app.status === 'Selected' ? 'success' :
                            app.status === 'Interview' ? 'purple' :
                            app.status === 'Shortlisted' ? 'emerald' :
                            app.status === 'Under Review' ? 'amber' :
                            app.status === 'Rejected' ? 'rose' : 'slate'
                          }
                        >
                          {app.status}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.studentCollege}</span>
                      </p>

                      <p className="text-xs text-purple-700 font-semibold pt-0.5">
                        Applied for: {app.opportunityTitle}
                      </p>
                    </div>

                    {/* Skill Match Indicator & Header Action */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                          Skill Match
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`text-base font-black px-2 py-0.5 rounded-lg ${
                            isMatchHigh ? 'bg-emerald-100 text-emerald-800' :
                            isMatchMedium ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {app.skillMatchScore}%
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenInspect(app)}
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                      >
                        Inspect Profile
                      </Button>
                    </div>
                  </div>

                  {/* Matched Skills Chips */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Competencies:
                      </span>
                      {app.matchingSkills && app.matchingSkills.length > 0 ? (
                        app.matchingSkills.map((s, i) => (
                          <span key={i} className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400">Prerequisite review pending</span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400 shrink-0">
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Notes & Active Status Management Controls */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
                    <div className="text-xs text-slate-600 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span className="italic">
                        {app.notes || 'No review notes added yet.'}
                      </span>
                    </div>

                    {/* Quick Stage Transitions */}
                    <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto justify-end">
                      {app.status !== 'Under Review' && app.status !== 'Selected' && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleOpenStatusModal(app, 'Under Review')}
                        >
                          Review
                        </Button>
                      )}

                      {app.status !== 'Shortlisted' && app.status !== 'Selected' && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => handleOpenStatusModal(app, 'Shortlisted')}
                        >
                          Shortlist
                        </Button>
                      )}

                      <Button
                        size="xs"
                        variant="primary"
                        leftIcon={<Calendar className="w-3.5 h-3.5" />}
                        onClick={() => setInterviewApplication(app)}
                      >
                        Interview
                      </Button>

                      {app.status !== 'Selected' && (
                        <Button
                          size="xs"
                          variant="outline"
                          className="text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                          onClick={() => handleOpenStatusModal(app, 'Selected')}
                        >
                          Select
                        </Button>
                      )}

                      {app.status !== 'Rejected' && (
                        <Button
                          size="xs"
                          variant="outline"
                          className="text-rose-700 border-rose-200 hover:bg-rose-50"
                          onClick={() => handleOpenStatusModal(app, 'Rejected')}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Candidate Deep Detail Modal */}
      <CandidateDetailModal
        isOpen={!!inspectCandidate}
        onClose={() => setInspectCandidate(null)}
        candidate={inspectCandidate}
        targetOpportunity={inspectTargetOpp}
        onScheduleInterview={(cand) => {
          const app = applications.find(a => a.studentId === cand.id);
          if (app) {
            setInterviewApplication(app);
            setInspectCandidate(null);
          }
        }}
        onShortlist={(cand) => {
          const app = applications.find(a => a.studentId === cand.id);
          if (app) {
            handleOpenStatusModal(app, 'Shortlisted');
            setInspectCandidate(null);
          }
        }}
      />

      {/* Interview Scheduling Modal */}
      <CompanyInterviewModal
        isOpen={!!interviewApplication}
        onClose={() => setInterviewApplication(null)}
        application={interviewApplication}
        company={company}
        onInterviewScheduled={refreshApplications}
      />

      {/* Status & Feedback Notes Modal */}
      <Modal
        isOpen={!!statusModalApp}
        onClose={() => setStatusModalApp(null)}
        title={`Update Application Status: ${newStatus}`}
        description={`Changing stage for ${statusModalApp?.studentName}`}
        maxWidth="md"
      >
        <form onSubmit={handleConfirmStatusChange} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Stage *</label>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as any)}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>

          <Textarea
            label="Internal Evaluation & Feedback Notes"
            rows={3}
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            placeholder="Add specific comments regarding candidate performance, assessment verification, or next round prerequisites..."
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setStatusModalApp(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Status Transition
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
