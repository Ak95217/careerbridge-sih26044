import React, { useState, useEffect } from 'react';
import { 
  StudentProfile, 
  AIResumeAnalysis, 
  AIMockInterviewSession 
} from '../../types';
import { StorageService } from '../../services/storage';
import { ResumeAnalyzerModal } from './ResumeAnalyzerModal';
import { AICareerRoadmapCard } from './AICareerRoadmapCard';
import { AILearningRecommendationsView } from './AILearningRecommendationsView';
import { AIMockInterviewModal } from './AIMockInterviewModal';
import { 
  Sparkles, 
  FileText, 
  Compass, 
  BookOpen, 
  Brain, 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  ArrowRight, 
  Target, 
  Zap, 
  Layers, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

interface AICareerIntelligenceDashboardProps {
  student?: StudentProfile;
  onProfileUpdated?: (updatedStudent: StudentProfile) => void;
  onNavigateTab?: (tab: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const AICareerIntelligenceDashboard: React.FC<AICareerIntelligenceDashboardProps> = ({
  student: studentProp,
  onProfileUpdated: onProfileUpdatedProp,
  onNavigateTab,
  onNavigateToTab
}) => {
  const { user } = useAuth();
  const currentStudent = studentProp || (user as StudentProfile) || StorageService.getCurrentUser() as StudentProfile;
  const navigate = onNavigateTab || onNavigateToTab;

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'resume' | 'roadmap' | 'learning' | 'interview'>('overview');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState<AIResumeAnalysis | null>(null);
  const [mockSessions, setMockSessions] = useState<AIMockInterviewSession[]>([]);

  const handleProfileUpdated = (updated: StudentProfile) => {
    if (onProfileUpdatedProp) {
      onProfileUpdatedProp(updated);
    } else {
      StorageService.updateProfile(updated);
    }
  };

  useEffect(() => {
    if (!currentStudent?.id) return;
    const analysis = StorageService.getLatestResumeAnalysis(currentStudent.id);
    setLatestAnalysis(analysis);

    const sessions = StorageService.getMockInterviewSessions(currentStudent.id);
    setMockSessions(sessions);
  }, [currentStudent?.id]);

  const student = currentStudent;
  const verifiedSkillsCount = student?.skills ? student.skills.filter(s => s.verified).length : 0;
  const targetRole = student?.targetRole || student?.careerGoal || 'Full Stack Developer';

  return (
    <div id="ai-career-intelligence-dashboard" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/30 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full border border-indigo-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                AI Intelligence & Career Copilot
              </span>
              <span className="text-xs text-slate-300 font-medium">Gemini 3.7 Flash</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Empowering Your Placement Journey with Actionable Career AI
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
              Analyze your resume quality, trace personalized phased milestone roadmaps, bridge skill gaps with curated learning tasks, and practice live mock interviews.
            </p>
          </div>

          {/* Action Hub buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="hero-build-resume-btn"
              onClick={() => navigate ? navigate('resume-builder') : (window.location.hash = '#resume-builder')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              AI Resume Builder
            </button>

            <button
              id="hero-analyze-resume-btn"
              onClick={() => setIsResumeModalOpen(true)}
              className="px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              {latestAnalysis ? 'Re-Analyze PDF' : 'Analyze PDF'}
            </button>

            <button
              id="hero-start-mock-btn"
              onClick={() => setIsInterviewModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl border border-indigo-400/40 flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Brain className="w-4 h-4" />
              AI Mock Interview
            </button>
          </div>
        </div>

        {/* Decorative ambient background */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'overview', label: 'AI Intelligence Overview', icon: Layers },
          { id: 'roadmap', label: 'Career Phased Roadmap', icon: Compass },
          { id: 'learning', label: 'Gap-Mapped Learning', icon: BookOpen },
          { id: 'interview', label: 'AI Mock Interview Prep', icon: Brain }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`ai-tab-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* VIEW: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Resume Score */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Resume ATS Score</span>
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">
                  {latestAnalysis ? latestAnalysis.resumeScore : '--'}
                </span>
                <span className="text-xs text-slate-400 font-bold">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {latestAnalysis ? `${latestAnalysis.detectedSkills.length} skills detected` : 'Upload resume to calculate score'}
              </p>
            </div>

            {/* Metric 2: Target Career Goal */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Target Role</span>
                <Target className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <span className="text-base font-black text-slate-900 truncate block">
                  {targetRole}
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold">12-Week Roadmap</span>
              </div>
            </div>

            {/* Metric 3: Verified Skills */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Verified Skills</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-700">{verifiedSkillsCount}</span>
                <span className="text-xs text-slate-400">/ {student.skills.length} Total</span>
              </div>
              <p className="text-[11px] text-slate-500">Validated through skill assessments</p>
            </div>

            {/* Metric 4: Interview Readiness */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Mock Interviews</span>
                <Brain className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{mockSessions.length}</span>
                <span className="text-xs text-slate-400">Sessions</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {mockSessions.length > 0 ? `Latest Score: ${mockSessions[0].overallScore || 85}%` : 'Take your first live mock interview'}
              </p>
            </div>
          </div>

          {/* Split 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Resume Diagnostic & Action Plan */}
            <div className="lg:col-span-2 space-y-6">
              {/* Resume Intelligence Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Resume Quality Intelligence</h3>
                      <p className="text-xs text-slate-500">
                        {latestAnalysis ? `Last analyzed: ${new Date(latestAnalysis.analyzedAt).toLocaleDateString()} (${latestAnalysis.fileName})` : 'No resume analyzed yet'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsResumeModalOpen(true)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {latestAnalysis ? 'View Full Report' : 'Upload & Analyze'}
                  </button>
                </div>

                {latestAnalysis ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {latestAnalysis.summary}
                    </p>

                    {/* Strengths & Improvements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Key Strengths
                        </span>
                        <p className="text-xs text-slate-700">{latestAnalysis.strengths[0]}</p>
                      </div>

                      <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 space-y-1">
                        <span className="text-[10px] font-bold text-indigo-800 uppercase flex items-center gap-1">
                          <Zap className="w-3 h-3 text-indigo-600" />
                          Top Improvement
                        </span>
                        <p className="text-xs text-slate-700">{latestAnalysis.actionableImprovements[0]}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500">
                    Upload your resume to receive ATS scoring, detected skill extraction, and concrete improvements.
                  </div>
                )}
              </div>

              {/* Career Phased Roadmap Teaser */}
              <AICareerRoadmapCard
                student={student}
                onProfileUpdated={handleProfileUpdated}
              />
            </div>

            {/* Right 1 Col: Learning Tasks & Mock Interview Launch */}
            <div className="space-y-6">
              {/* Quick AI Mock Interview Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">AI Placement Mock Interview</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Practice interactive technical and behavioral questions evaluated in real time against Tier-1 campus placement rubrics.
                </p>
                <button
                  onClick={() => setIsInterviewModalOpen(true)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Launch Mock Interview
                </button>
              </div>

              {/* Learning Recommendations Teaser */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">Targeted Learning</h3>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('learning')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Personalized learning modules to bridge your highest-demand missing skills (PostgreSQL, Docker, System Design).
                </p>
                <button
                  onClick={() => setActiveSubTab('learning')}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  Explore Modules
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ROADMAP */}
      {activeSubTab === 'roadmap' && (
        <AICareerRoadmapCard
          student={student}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {/* VIEW: LEARNING */}
      {activeSubTab === 'learning' && (
        <AILearningRecommendationsView
          student={student}
          targetRole={targetRole}
          onNavigateToAssessment={skill => {
            if (navigate) navigate('assessments');
          }}
        />
      )}

      {/* VIEW: INTERVIEW */}
      {activeSubTab === 'interview' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Placement Mock Interview Practice</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Role: <span className="font-semibold text-slate-800">{targetRole}</span>
              </p>
            </div>

            <button
              onClick={() => setIsInterviewModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Open Interactive Interview Suite
            </button>
          </div>

          {/* Past Sessions List */}
          {mockSessions.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Past Mock Interview Sessions</h4>
              {mockSessions.map((sess, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center">
                      {sess.overallScore || 84}%
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{sess.targetRole} Mock Session</h5>
                      <p className="text-[11px] text-slate-500">
                        {sess.completedQuestions} questions answered • {new Date(sess.startedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsInterviewModalOpen(true)}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Review Feedback
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500 space-y-2">
              <Brain className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No completed mock interview sessions yet.</p>
              <button
                onClick={() => setIsInterviewModalOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Start your first session now →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <ResumeAnalyzerModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        student={student}
        initialAnalysis={latestAnalysis}
        onProfileUpdated={updated => {
          handleProfileUpdated(updated);
          setLatestAnalysis(StorageService.getLatestResumeAnalysis(updated.id));
        }}
      />

      <AIMockInterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => {
          setIsInterviewModalOpen(false);
          setMockSessions(StorageService.getMockInterviewSessions(student.id));
        }}
        student={student}
        targetRole={targetRole}
      />
    </div>
  );
};
