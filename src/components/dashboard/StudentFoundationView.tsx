import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { calculateSkillMatch } from '../../services/skillMatching';
import { StudentProfile, AIResumeAnalysis } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge, ProficiencyBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { AIInsightsSummaryCard } from '../ai/AIInsightsSummaryCard';
import { ResumeAnalyzerModal } from '../ai/ResumeAnalyzerModal';
import { AIMockInterviewModal } from '../ai/AIMockInterviewModal';
import { StudentActionMenu } from '../student/StudentActionMenu';
import { 
  Award, 
  Briefcase, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  FileText, 
  ExternalLink,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Clock,
  Building2,
  Brain,
  Compass,
  MoreVertical,
  Layers,
  Wand2
} from 'lucide-react';

interface StudentFoundationViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const StudentFoundationView: React.FC<StudentFoundationViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const student = user as StudentProfile;

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState<AIResumeAnalysis | null>(null);

  useEffect(() => {
    if (student?.id) {
      const analysis = StorageService.getLatestResumeAnalysis(student.id);
      setLatestAnalysis(analysis);
    }
  }, [student?.id]);

  if (!student) return null;

  const applications = StorageService.getApplications(student.id);
  const oppTypeFilter = student.targetOpportunityType === 'Job' ? 'Job' : student.targetOpportunityType === 'Internship' ? 'Internship' : undefined;
  const allOpps = StorageService.getOpportunities(oppTypeFilter);
  const attempts = StorageService.getAssessmentAttempts(student.id);
  const studentSkills = student.skills || [];
  const certificates = StorageService.getCertificates(student.id);

  const verifiedSkillsCount = studentSkills.filter(s => s.verified).length;
  const verifiedCertsCount = certificates.filter(c => c.status === 'Verified').length;
  const activeAppsCount = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview').length;

  const completionItems = [
    { label: 'Profile', complete: Boolean(student.fullName && student.collegeName && student.degree && student.branch && student.cgpa > 0 && student.targetRole && student.careerDomain && student.preferredWorkMode && student.location) },
    { label: 'Skills', complete: studentSkills.length > 0 },
    { label: 'Projects', complete: (student.projects || []).length > 0 },
    { label: 'Certificates', complete: certificates.length > 0 },
    { label: 'Resume', complete: Boolean(student.resumeFileName || student.resumeUrl) }
  ];
  const completionPercent = Math.round((completionItems.filter(item => item.complete).length / completionItems.length) * 100);

  // Rank opportunities by student skills + target role & domain alignment
  const uniqueOpps = Array.from(
    new Map(allOpps.map(opp => [`${opp.companyId}-${opp.companyName.toLowerCase()}-${opp.title.toLowerCase()}`, opp])).values()
  );

  const scoredOpportunities = uniqueOpps.map((opp) => {
    const match = calculateSkillMatch(studentSkills, opp.requiredSkills || []);
    let relevanceScore = match.scorePercentage;
    
    // Boost relevance if opportunity matches student's target role or domain
    const targetRoleLower = (student.targetRole || student.careerGoal || '').toLowerCase();
    const domainLower = (student.careerDomain || '').toLowerCase();
    const titleLower = opp.title.toLowerCase();
    const descLower = (opp.description || '').toLowerCase();

    const matchesRole = targetRoleLower && (titleLower.includes(targetRoleLower) || targetRoleLower.includes(titleLower));
    const matchesDomain = domainLower && (titleLower.includes(domainLower) || descLower.includes(domainLower));
    const matchesWorkMode = student.preferredWorkMode && (opp.workMode?.toLowerCase() === student.preferredWorkMode.toLowerCase() || opp.location?.toLowerCase().includes(student.preferredWorkMode.toLowerCase()));

    if (matchesRole) relevanceScore += 25;
    if (matchesDomain) relevanceScore += 15;
    if (matchesWorkMode) relevanceScore += 5;

    return {
      opp,
      match,
      relevanceScore,
      matchesRole,
      matchesDomain
    };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Calculate average match score across open opportunities
  let avgMatchScore = 0;
  if (uniqueOpps.length > 0 && studentSkills.length > 0) {
    const total = uniqueOpps.reduce((acc, opp) => {
      const match = calculateSkillMatch(studentSkills, opp.requiredSkills || []);
      return acc + match.scorePercentage;
    }, 0);
    avgMatchScore = Math.round(total / uniqueOpps.length);
  }

  const strongestMatch = scoredOpportunities[0]?.match;

  const isNewProfile = (!student.skills || student.skills.length === 0) && (!student.projects || student.projects.length === 0) && (!student.profileCompletion || student.profileCompletion < 20);

  return (
    <div className="space-y-6">
      {/* Welcome to the SIH Skill & Placement Portal Empty State Banner */}
      {isNewProfile && (
        <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50/40 border border-indigo-200/90 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Getting Started
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Welcome to the SIH Skill & Placement Portal
              </h2>
              <p className="text-xs text-slate-600 max-w-2xl">
                Get started by setting up your profile, adding your verified skills, or generating an AI-optimized resume to unlock personalized internship recommendations.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="primary" onClick={() => onNavigateTab('profile')}>
                Set Up Profile
              </Button>
              <Button size="sm" variant="outline" onClick={() => onNavigateTab('skills')}>
                Add Skills
              </Button>
              <Button size="sm" variant="outline" onClick={() => onNavigateTab('resume-builder')}>
                Upload Resume
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome & Profile Summary Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl border border-slate-200 bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-xs shrink-0 overflow-hidden">
            {student.avatarUrl ? (
              <img
                src={student.avatarUrl}
                alt={student.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{student.fullName && student.fullName !== 'Not provided' ? student.fullName.charAt(0) : '?'}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{student.fullName || 'Not provided'}</h2>
              <Badge variant="primary">Student</Badge>
              {student.profileCompletion > 0 && <Badge variant="success">Verified ID</Badge>}
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              <span>{(student.degree ? student.degree + ' • ' : '') + (student.collegeName || 'Not provided')}</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              CGPA: <strong className="text-slate-800">{student.cgpa > 0 ? student.cgpa : '—'}</strong> / 10 • Graduating Batch: <strong className="text-slate-800">{student.graduationYear || '—'}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-3 w-full md:w-auto">
          <div className="w-full sm:w-44 bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-center sm:text-left">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Profile Score</span>
              <span className="text-indigo-600">{student.profileCompletion || 0}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${student.profileCompletion || 0}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onNavigateTab('profile')}
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              Edit Profile
            </Button>

            {/* Three-Dot Action Menu */}
            <StudentActionMenu onNavigateTab={onNavigateTab} />
          </div>
        </div>
      </div>

      {/* AI Intelligence Summary Hub */}
      <AIInsightsSummaryCard
        student={student}
        latestAnalysis={latestAnalysis}
        onOpenResumeAnalyzer={() => setIsResumeModalOpen(true)}
        onOpenResumeBuilder={() => onNavigateTab('resume-builder')}
        onOpenRoadmap={() => onNavigateTab('ai-career')}
        onOpenMockInterview={() => setIsMockModalOpen(true)}
        onOpenLearning={() => onNavigateTab('learning')}
      />

      {/* Dynamic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-indigo-200 transition-all cursor-pointer" onClick={() => onNavigateTab('skills')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Mapped Skills</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{studentSkills.length}</h3>
                <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                  {verifiedSkillsCount} Assessment Verified
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-purple-200 transition-all cursor-pointer" onClick={() => onNavigateTab('applications')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Active Applications</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{activeAppsCount}</h3>
                <p className="text-[11px] text-indigo-600 mt-0.5 font-medium">
                  {shortlistedCount} In Advanced Stages
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-amber-200 transition-all cursor-pointer" onClick={() => onNavigateTab('skill-gap')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Avg Market Match</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{studentSkills.length > 0 ? `${avgMatchScore}%` : '—'}</h3>
                <p className="text-[11px] text-amber-600 mt-0.5 font-medium">
                  {studentSkills.length > 0 ? 'Deterministic Fit' : 'Awaiting Skills'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-emerald-200 transition-all cursor-pointer" onClick={() => onNavigateTab('certificates')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Certificates</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{certificates.length}</h3>
                <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                  {verifiedCertsCount} Verified Credentials
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Skills & Recommended Internships */}
      <div className="space-y-6">
        
        {/* Current Skills and Recommended Opportunities */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Your Current Skills Transcript</h3>
                  <p className="text-xs text-slate-500">Mapped against National Industry Skill Taxonomy</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => onNavigateTab('skills')}>
                  Taxonomy Manager
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {studentSkills.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">No skills mapped yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
                      Map your technical competencies or complete verified skill assessments to unlock role matching and ATS scoring.
                    </p>
                  </div>
                  <Button size="sm" variant="primary" onClick={() => onNavigateTab('skills')}>
                    Add Skills to Profile
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  {studentSkills.map((sk) => (
                    <div
                      key={sk.id}
                      className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/70"
                    >
                      <span className="text-xs font-semibold text-slate-800">{sk.name}</span>
                      <ProficiencyBadge level={sk.proficiency} />
                      {sk.verified && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                          {sk.verifiedScore}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Matched Opportunities for Student */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">Recommended Opportunities</h3>
                  </div>
                  {student.targetRole && (
                    <p className="text-[11px] text-indigo-600 font-medium mt-0.5">
                      Tailored for your target role: <span className="font-bold">{student.targetRole}</span>
                    </p>
                  )}
                </div>
                <Button size="sm" variant="outline" onClick={() => onNavigateTab('internships')}>
                  View All ({uniqueOpps.length})
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {scoredOpportunities.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">No personalized matches yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
                      Add your skills or complete your profile to calculate deterministic skill-fit percentages for open opportunities.
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => onNavigateTab('internships')}>
                    Browse All Opportunities
                  </Button>
                </div>
              ) : (
                scoredOpportunities.slice(0, 3).map(({ opp, match, matchesRole, matchesDomain }) => {
                  return (
                    <div
                      key={opp.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                        matchesRole
                          ? 'border-indigo-200 bg-indigo-50/30 hover:border-indigo-300'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-slate-900">{opp.title}</h4>
                            {matchesRole && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-600 text-white rounded">
                                Target Role Match
                              </span>
                            )}
                            {matchesDomain && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-purple-600 text-white rounded">
                                Domain Match
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 mt-0.5">
                            {opp.companyName} • {opp.stipendOrSalary} • {opp.location} ({opp.workMode})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <div className="text-right">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            match.scorePercentage >= 70
                              ? 'text-emerald-700 bg-emerald-50'
                              : match.scorePercentage >= 40
                              ? 'text-indigo-700 bg-indigo-50'
                              : 'text-slate-600 bg-slate-100'
                          }`}>
                            {match.scorePercentage}% Fit
                          </span>
                        </div>
                        <Button size="sm" variant="primary" onClick={() => onNavigateTab('internships')}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Skill & Career Insights</h3>
                  <p className="text-xs text-slate-500">Based on your strongest current match</p>
                </div>
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Top Current Skills</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {studentSkills.slice(0, 6).map(skill => (
                    <span key={skill.id} className="text-[11px] px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold">{skill.name}</span>
                  ))}
                  {studentSkills.length === 0 && <span className="text-xs text-slate-400">Add skills to see insights.</span>}
                </div>
              </div>
              {strongestMatch && (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-rose-600">Missing / Weak Skills</span>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {[...strongestMatch.missingSkills, ...strongestMatch.improvementSkills].slice(0, 4).map(skill => skill.name).join(', ') || 'No skill gaps identified'}
                    </p>
                  </div>
                  <Button size="xs" variant="outline" onClick={() => onNavigateTab('skill-gap')}>
                    Review Skill Gap
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

        {/* Career Progress uses persisted profile data to balance the desktop layout. */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Career Progress</h3>
                  <p className="text-xs text-slate-500">Profile readiness overview</p>
                </div>
                <span className="text-lg font-black text-indigo-600">{completionPercent}%</span>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${completionPercent}%` }} />
              </div>
              <div className="space-y-2.5">
                {completionItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <span className={`flex items-center gap-1 font-bold ${item.complete ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.complete ? 'Complete' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
              {completionPercent < 100 && (
                <Button size="sm" variant="outline" onClick={() => onNavigateTab('profile')} className="w-full">
                  Complete Profile
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Legacy dashboard navigation actions were removed; sidebar remains the single navigation surface. */}
        {/*
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-sm font-bold text-slate-900">Career & Placement Navigation</h3>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              <button
                onClick={() => onNavigateTab('resume-builder')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/80 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">AI Resume Builder</p>
                      <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-600 text-white rounded">NEW</span>
                    </div>
                    <p className="text-[11px] text-slate-500">ATS templates & Gemini tailoring</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </button>

              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50/70 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">AI Resume Intelligence</p>
                    <p className="text-[11px] text-slate-500">Quality score & skill extractor</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                onClick={() => setIsMockModalOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-purple-200 bg-purple-50/30 hover:bg-purple-50/70 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">AI Placement Mock Interview</p>
                    <p className="text-[11px] text-slate-500">Practice technical & behavioral Qs</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-600" />
              </button>

              <button
                onClick={() => onNavigateTab('assessments')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Verified Skill Assessments</p>
                    <p className="text-[11px] text-slate-500">Take evaluation & earn credentials</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('skill-gap')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Deterministic Skill Gap Engine</p>
                    <p className="text-[11px] text-slate-500">Identify role prerequisites & missing skills</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('internships')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Discover Internships</p>
                    <p className="text-[11px] text-slate-500">Browse opportunities with real match score</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('jobs')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Campus Placements & Jobs</p>
                    <p className="text-[11px] text-slate-500">Full-time graduate engineer positions</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('learning')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Learning Roadmaps</p>
                    <p className="text-[11px] text-slate-500">Curated modules for skill bridging</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </CardContent>
          </Card>
        </div>
        */}
      </div>

      {/* AI Resume Analyzer Modal */}
      <ResumeAnalyzerModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        student={student}
        initialAnalysis={latestAnalysis}
        onProfileUpdated={updated => {
          setLatestAnalysis(StorageService.getLatestResumeAnalysis(updated.id));
        }}
      />

      {/* AI Mock Interview Modal */}
      <AIMockInterviewModal
        isOpen={isMockModalOpen}
        onClose={() => setIsMockModalOpen(false)}
        student={student}
      />
    </div>
  );
};
