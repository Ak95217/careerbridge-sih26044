import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CompanyProfile, Application, Opportunity, StudentProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { CandidateDetailModal } from '../company/CandidateDetailModal';
import { CompanyInterviewModal } from '../company/CompanyInterviewModal';
import { 
  Building2, 
  Briefcase, 
  Users, 
  UserCheck, 
  Plus, 
  Calendar, 
  Target, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Edit3,
  Search
} from 'lucide-react';

interface CompanyFoundationViewProps {
  onNavigateTab: (tabId: string) => void;
  onSelectOpportunityForMatching?: (opp: Opportunity) => void;
}

export const CompanyFoundationView: React.FC<CompanyFoundationViewProps> = ({ 
  onNavigateTab,
  onSelectOpportunityForMatching
}) => {
  const { user, updateProfile } = useAuth();
  const company = user as CompanyProfile;

  // Real Data from Storage
  const opportunities = useMemo(
    () => StorageService.getOpportunitiesByCompany(company?.id || ''),
    [company?.id]
  );
  const applications = useMemo(
    () => StorageService.getApplications({ companyId: company?.id || '' }),
    [company?.id]
  );
  const interviews = useMemo(
    () => StorageService.getInterviews(company?.id || ''),
    [company?.id]
  );

  // Modals
  const [inspectCandidate, setInspectCandidate] = useState<StudentProfile | null>(null);
  const [inspectTargetOpp, setInspectTargetOpp] = useState<Opportunity | null>(null);
  const [interviewApplication, setInterviewApplication] = useState<Application | null>(null);

  if (!company) return null;

  // Statistics Calculations
  const activePostings = opportunities.filter(o => o.status === 'Open');
  const internshipsCount = opportunities.filter(o => o.type === 'Internship').length;
  const jobsCount = opportunities.filter(o => o.type === 'Job').length;
  
  const totalApplicants = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const interviewCount = applications.filter(a => a.status === 'Interview').length;
  const selectedCount = applications.filter(a => a.status === 'Selected').length;

  const getStageCount = (status: Application['status']) => {
    return applications.filter(a => a.status === status).length;
  };

  const handleOpenCandidateModal = (app: Application) => {
    const student = StorageService.getStudentById(app.studentId);
    const opp = StorageService.getOpportunityById(app.opportunityId);
    if (student) {
      setInspectCandidate(student);
      setInspectTargetOpp(opp);
    } else {
      const fallback: StudentProfile = {
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
          verifiedScore: 88
        })),
        certifications: [],
        projects: [],
        profileCompletion: 85,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setInspectCandidate(fallback);
      setInspectTargetOpp(opp);
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={company.logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80'}
            alt={company.companyName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs bg-purple-50"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{company.companyName}</h2>
              <Badge variant="purple">Industry Partner</Badge>
              {company.verified && (
                <Badge variant="success" className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  AICTE Verified
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {company.industry} • {company.location} • {company.size} Employees
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{company.website}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Building2 className="w-4 h-4" />}
            onClick={() => updateProfile({ onboardingCompleted: false })}
          >
            Switch Company
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Edit3 className="w-4 h-4" />}
            onClick={() => onNavigateTab('profile')}
          >
            Edit Profile
          </Button>
          <Button 
            size="sm" 
            variant="primary" 
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => onNavigateTab('internships')}
          >
            Post Opening
          </Button>
        </div>
      </div>

      {/* Real Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Postings</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{activePostings.length}</h3>
                <p className="text-[11px] text-purple-700 mt-0.5 font-medium">
                  {internshipsCount} Internships • {jobsCount} Placements
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Applicants</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalApplicants}</h3>
                <p className="text-[11px] text-indigo-600 mt-0.5 font-medium">Across all open campus roles</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Shortlisted Talent</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{shortlistedCount}</h3>
                <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">≥ 80% Skill Match Score</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Interviews & Offers</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{interviewCount + selectedCount}</h3>
                <p className="text-[11px] text-amber-700 mt-0.5 font-medium">{interviewCount} Active • {selectedCount} Selected</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Recruitment Pipeline Preview */}
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Application Stage Breakdown</h3>
            <p className="text-xs text-slate-500">Live candidate status distribution across active hiring funnels</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => onNavigateTab('applications')}>
            Open Full Pipeline →
          </Button>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Applied</span>
              <p className="text-lg font-black text-slate-800 mt-1">{getStageCount('Applied')}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs text-amber-800 font-medium">Under Review</span>
              <p className="text-lg font-black text-amber-900 mt-1">{getStageCount('Under Review')}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
              <span className="text-xs text-indigo-800 font-medium">Shortlisted</span>
              <p className="text-lg font-black text-indigo-900 mt-1">{getStageCount('Shortlisted')}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
              <span className="text-xs text-purple-800 font-medium">Interview</span>
              <p className="text-lg font-black text-purple-900 mt-1">{getStageCount('Interview')}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs text-emerald-800 font-medium">Selected</span>
              <p className="text-lg font-black text-emerald-900 mt-1">{getStageCount('Selected')}</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-xs text-rose-800 font-medium">Rejected</span>
              <p className="text-lg font-black text-rose-900 mt-1">{getStageCount('Rejected')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Recent High-Match Applicants & Active Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Top Matched Applicants */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Candidate Applications</h3>
                <p className="text-xs text-slate-500">Evaluated with deterministic competency match scores</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onNavigateTab('applications')}>
                View All ({applications.length})
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {applications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No applications received yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {applications.slice(0, 5).map((app) => {
                    const isHigh = app.skillMatchScore >= 80;
                    return (
                      <div key={app.id} className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900">{app.studentName}</span>
                            <Badge variant="emerald">CGPA {app.studentCgpa}</Badge>
                            <Badge
                              variant={
                                app.status === 'Selected' ? 'success' :
                                app.status === 'Interview' ? 'purple' :
                                app.status === 'Shortlisted' ? 'emerald' :
                                app.status === 'Under Review' ? 'amber' : 'slate'
                              }
                            >
                              {app.status}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {app.studentCollege} • Role: <span className="font-semibold text-slate-700">{app.opportunityTitle}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-medium">Match</span>
                            <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                              isHigh ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {app.skillMatchScore}%
                            </span>
                          </div>

                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => handleOpenCandidateModal(app)}
                          >
                            Inspect
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Active Postings Quick Card & Skill Demand Link */}
        <div className="space-y-6">
          {/* Postings Quick List */}
          <Card>
            <CardHeader>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Your Active Openings</h3>
                <p className="text-xs text-slate-500">{opportunities.length} Total Postings</p>
              </div>
              <Button size="xs" variant="outline" onClick={() => onNavigateTab('internships')}>
                Manage
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {opportunities.map((opp) => (
                <div key={opp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{opp.title}</h4>
                    <Badge variant={opp.type === 'Internship' ? 'purple' : 'primary'}>
                      {opp.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{opp.openings} Openings • {opp.stipendOrSalary}</span>
                    <span className="font-semibold text-purple-700">{opp.applicantCount || 0} Applicants</span>
                  </div>
                  <div className="pt-1 flex items-center justify-end">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => onNavigateTab('candidates')}
                    >
                      Find Candidates →
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Direct Talent Discovery Callout */}
          <div className="p-5 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl text-white space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Discover Verified Talent
              </h4>
            </div>
            <p className="text-xs text-purple-100 leading-relaxed">
              Explore our candidate pool of AICTE-verified engineering students with proctored skill scores and GitHub repositories.
            </p>
            <div className="pt-1">
              <Button
                size="sm"
                variant="primary"
                className="w-full bg-white text-purple-950 hover:bg-purple-50 font-bold border-none"
                onClick={() => onNavigateTab('candidates')}
              >
                Search Candidate Pool
              </Button>
            </div>
          </div>
        </div>
      </div>

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
      />

      {/* Interview Schedule Modal */}
      <CompanyInterviewModal
        isOpen={!!interviewApplication}
        onClose={() => setInterviewApplication(null)}
        application={interviewApplication}
        company={company}
        onInterviewScheduled={() => {}}
      />
    </div>
  );
};
