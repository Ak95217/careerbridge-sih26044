import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { calculateSkillMatch } from '../../services/skillMatching';
import { getRecommendedCoursesForSkill, CourseRecommendation } from '../../services/courseRecommendations';
import { StudentProfile, Opportunity, ProficiencyLevel, SkillMatchResult } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge, ProficiencyBadge } from '../common/Badge';
import { AISkillGapIntelligenceModal } from '../ai/AISkillGapIntelligenceModal';
import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Award, 
  BookOpen,
  Briefcase,
  Building2,
  Sliders,
  Brain,
  ArrowLeft,
  ExternalLink,
  Clock,
  GraduationCap
} from 'lucide-react';

interface SkillGapEngineViewProps {
  onNavigateTab: (tabId: string) => void;
}

// Preset Industry Career Benchmarks for Quick Analysis
const CAREER_BENCHMARKS = [
  {
    id: 'role-fullstack',
    title: 'Full Stack Cloud Engineer (Tier 1 Benchmark)',
    company: 'Industry Standard Standardized Profile',
    requiredSkills: [
      { skillName: 'React.js', proficiency: 'Advanced' as ProficiencyLevel, mandatory: true },
      { skillName: 'TypeScript', proficiency: 'Intermediate' as ProficiencyLevel, mandatory: true },
      { skillName: 'Node.js', proficiency: 'Intermediate' as ProficiencyLevel, mandatory: true },
      { skillName: 'SQL & PostgreSQL', proficiency: 'Intermediate' as ProficiencyLevel, mandatory: true },
      { skillName: 'Docker & Kubernetes', proficiency: 'Beginner' as ProficiencyLevel, mandatory: false },
      { skillName: 'Problem Solving & DSA', proficiency: 'Advanced' as ProficiencyLevel, mandatory: true }
    ]
  },
  {
    id: 'role-ai-engineer',
    title: 'Applied Generative AI & ML Engineer',
    company: 'Enterprise AI Lab Benchmark',
    requiredSkills: [
      { skillName: 'Python', proficiency: 'Advanced' as ProficiencyLevel, mandatory: true },
      { skillName: 'Machine Learning & Deep Learning', proficiency: 'Intermediate' as ProficiencyLevel, mandatory: true },
      { skillName: 'Generative AI & LLM Engineering', proficiency: 'Intermediate' as ProficiencyLevel, mandatory: true },
      { skillName: 'SQL & PostgreSQL', proficiency: 'Intermediate' as ProficiencyLevel, mandatory: false },
      { skillName: 'Problem Solving & DSA', proficiency: 'Advanced' as ProficiencyLevel, mandatory: true }
    ]
  },
  {
    id: 'role-devops',
    title: 'Cloud Infrastructure & SRE Engineer',
    company: 'DevOps & Cloud Benchmark',
    requiredSkills: [
      { skillName: 'Docker & Kubernetes', proficiency: 'Advanced' as ProficiencyLevel, mandatory: true },
      { skillName: 'Cloud Computing (AWS/GCP)', proficiency: 'Intermediate' as ProficiencyLevel, mandatory: true },
      { skillName: 'CI/CD Pipelines (GitHub Actions)', proficiency: 'Intermediate' as ProficiencyLevel, mandatory: true },
      { skillName: 'Python', proficiency: 'Intermediate' as ProficiencyLevel, mandatory: false },
      { skillName: 'Git & Version Control', proficiency: 'Advanced' as ProficiencyLevel, mandatory: true }
    ]
  }
];

export const SkillGapEngineView: React.FC<SkillGapEngineViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const student = user as StudentProfile;
  const opportunities = StorageService.getOpportunities();

  const [selectedTargetId, setSelectedTargetId] = useState<string>(opportunities[0]?.id || 'role-fullstack');
  const [isAiGapModalOpen, setIsAiGapModalOpen] = useState(false);

  // Find target spec (either live opportunity or standard career benchmark)
  let targetTitle = '';
  let targetCompany = '';
  let targetRequiredSkills: { skillName: string; proficiency: ProficiencyLevel; mandatory: boolean }[] = [];

  const liveOpp = opportunities.find(o => o.id === selectedTargetId);
  if (liveOpp) {
    targetTitle = liveOpp.title;
    targetCompany = liveOpp.companyName;
    targetRequiredSkills = liveOpp.requiredSkills || [];
  } else {
    const bench = CAREER_BENCHMARKS.find(b => b.id === selectedTargetId) || CAREER_BENCHMARKS[0];
    targetTitle = bench.title;
    targetCompany = bench.company;
    targetRequiredSkills = bench.requiredSkills;
  }

  // Deterministic Skill Gap Calculation
  const matchResult: SkillMatchResult = calculateSkillMatch(
    student?.skills || [],
    targetRequiredSkills
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    if (score >= 40) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getProficiencyPercentage = (level: ProficiencyLevel) => {
    switch (level) {
      case 'Expert': return 100;
      case 'Advanced': return 75;
      case 'Intermediate': return 50;
      case 'Beginner': return 25;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigateTab('dashboard')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('learning')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Learning Modules</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Deterministic Skill-Gap Analysis Engine</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Real-time multi-dimensional comparison between your verified academic credentials and industry requirements. Instant actionable roadmap to achieve 100% role readiness.
          </p>
        </div>

        {/* Target Selector */}
        <div className="w-full md:w-80">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Select Target Opportunity / Benchmark
          </label>
          <select
            value={selectedTargetId}
            onChange={(e) => setSelectedTargetId(e.target.value)}
            className="w-full text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
          >
            <optgroup label="⚡ Live Active Opportunities">
              {opportunities.map(opp => (
                <option key={opp.id} value={opp.id}>
                  {opp.title} ({opp.companyName.split(' ')[0]})
                </option>
              ))}
            </optgroup>
            <optgroup label="🎯 Standard National Industry Benchmarks">
              {CAREER_BENCHMARKS.map(bench => (
                <option key={bench.id} value={bench.id}>
                  {bench.title}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Primary Match Overview & Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score & Gauge (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role Compatibility</span>
              <Target className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-1">{targetTitle}</h3>
            <p className="text-xs text-slate-500">{targetCompany}</p>
          </div>

          {/* Big Score Gauge */}
          <div className="text-center py-4">
            <div className={`inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 ${
              matchResult.scorePercentage >= 80 ? 'border-emerald-500 bg-emerald-50/40 text-emerald-800' :
              matchResult.scorePercentage >= 60 ? 'border-indigo-500 bg-indigo-50/40 text-indigo-800' :
              'border-amber-500 bg-amber-50/40 text-amber-800'
            }`}>
              <span className="text-4xl font-black">{matchResult.scorePercentage}%</span>
              <span className="text-[11px] font-bold uppercase tracking-wider mt-0.5">Skill Fit</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <span className="text-lg font-bold text-emerald-700 block">{matchResult.matchedCount}</span>
                <span className="text-[10px] text-emerald-800 font-medium">Matched</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
                <span className="text-lg font-bold text-amber-700 block">{matchResult.improvementSkills.length}</span>
                <span className="text-[10px] text-amber-800 font-medium">Upgrade</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-100">
                <span className="text-lg font-bold text-rose-700 block">{matchResult.missingSkills.length}</span>
                <span className="text-[10px] text-rose-800 font-medium">Missing</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
            {matchResult.explanation}
          </p>

          <button
            onClick={() => setIsAiGapModalOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Generate Deep AI Gap Diagnostic</span>
          </button>
        </div>

        {/* Detailed Competency Comparison Bar Visualizer (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Proficiency Level Comparison (Student vs Target)</h3>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" />
                <span>Your Level</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-300 inline-block" />
                <span>Required Level</span>
              </span>
            </div>
          </div>

          {/* Skill Comparison Bars */}
          <div className="space-y-4 pt-1">
            {targetRequiredSkills.map((req) => {
              const studentSkill = student?.skills?.find(
                s => s.name.toLowerCase() === req.skillName.toLowerCase()
              );
              const studentProf = studentSkill?.proficiency;
              const studentPercent = studentProf ? getProficiencyPercentage(studentProf) : 0;
              const reqPercent = getProficiencyPercentage(req.proficiency);

              const isMatch = studentProf && studentPercent >= reqPercent;
              const isPartial = studentProf && studentPercent < reqPercent;

              return (
                <div key={req.skillName} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{req.skillName}</span>
                      {req.mandatory && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          Mandatory
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      {studentProf ? (
                        <span className={`font-semibold ${isMatch ? 'text-emerald-700' : 'text-amber-700'}`}>
                          Current: {studentProf}
                        </span>
                      ) : (
                        <span className="text-rose-600 font-semibold">Not in Profile</span>
                      )}
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-medium">Target: {req.proficiency}</span>
                    </div>
                  </div>

                  {/* Dual Comparison Bar */}
                  <div className="space-y-1">
                    {/* Student Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isMatch ? 'bg-emerald-500' : isPartial ? 'bg-amber-500' : 'bg-rose-400'
                        }`}
                        style={{ width: `${studentPercent}%` }}
                      />
                    </div>
                    {/* Target Bar Marker */}
                    <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                      <div
                        className="h-full bg-slate-400 rounded-full"
                        style={{ width: `${reqPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3 Outcome Columns: Exact Matches, Needs Improvement, Missing Prerequisites */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Exact Matches */}
        <Card className="border-emerald-200">
          <CardHeader className="bg-emerald-50/50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Exact Matches ({matchResult.matchedSkills.length})
              </h4>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {matchResult.matchedSkills.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No exact skill matches yet</p>
            ) : (
              matchResult.matchedSkills.map((sk) => (
                <div key={sk.name} className="p-3 rounded-xl border border-emerald-100 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{sk.name}</span>
                    <ProficiencyBadge level={sk.studentProficiency} />
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    Meets or exceeds required {sk.requiredProficiency}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Column 2: Needs Improvement */}
        <Card className="border-amber-200">
          <CardHeader className="bg-amber-50/50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Needs Improvement ({matchResult.improvementSkills.length})
              </h4>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {matchResult.improvementSkills.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No mapped skills require upgrading</p>
            ) : (
              matchResult.improvementSkills.map((sk) => (
                <div key={sk.name} className="p-3 rounded-xl border border-amber-100 bg-white space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{sk.name}</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      {sk.studentProficiency} → {sk.requiredProficiency}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Target role requires production-level {sk.requiredProficiency}.
                  </p>
                  <button
                    onClick={() => onNavigateTab('assessment')}
                    className="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-1 pt-1"
                  >
                    <span>Take Assessment & Upgrade</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Column 3: Missing Prerequisites */}
        <Card className="border-rose-200">
          <CardHeader className="bg-rose-50/50">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600" />
              <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                Missing Prerequisites ({matchResult.missingSkills.length})
              </h4>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {matchResult.missingSkills.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">All required skills are present in profile</p>
            ) : (
              matchResult.missingSkills.map((sk) => {
                const recCourses = getRecommendedCoursesForSkill(sk.name);
                const primaryCourse = recCourses[0];

                return (
                  <div key={sk.name} className="p-3.5 rounded-xl border border-rose-100 bg-white space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{sk.name}</span>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                        Required: {sk.requiredProficiency}
                      </span>
                    </div>

                    {primaryCourse && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1.5">
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="text-[11px] font-bold text-indigo-950 leading-tight">
                            {primaryCourse.courseTitle}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2">
                          {primaryCourse.whyRequired}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-slate-200/60">
                          <span className="font-medium text-slate-700">{primaryCourse.provider}</span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {primaryCourse.duration}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => onNavigateTab('learning')}
                        className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Course Roadmap</span>
                      </button>

                      {primaryCourse?.url && (
                        <a
                          href={primaryCourse.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition-colors"
                        >
                          <span>Start Learning</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Direct Course Recommendations for All Identified Gaps */}
      {matchResult.missingSkills.length > 0 && (
        <Card className="border-indigo-200 bg-white">
          <CardHeader className="bg-indigo-50/60 border-b border-indigo-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-indigo-950">
                    Recommended Learning Paths & Courses for Identified Missing Skills
                  </h3>
                  <p className="text-[11px] text-indigo-700">
                    Direct industry & AICTE-accredited curriculum to bridge every prerequisite gap for {targetTitle}
                  </p>
                </div>
              </div>
              <Badge variant="primary" size="sm">
                {matchResult.missingSkills.length} Required Skills Mapped
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchResult.missingSkills.flatMap(sk => getRecommendedCoursesForSkill(sk.name).slice(0, 1)).map((course) => (
                <div 
                  key={course.id} 
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="primary" size="sm">
                        Bridge: {course.skillName}
                      </Badge>
                      {course.badgeTag && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                          {course.badgeTag}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {course.courseTitle}
                    </h4>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <strong className="text-slate-700">Why required: </strong>
                      {course.whyRequired}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-800">{course.provider}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {course.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigateTab('learning')}
                        className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      >
                        In-App Modules
                      </button>
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
                      >
                        <span>Start Learning</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actionable Learning Roadmap Recommendations */}
      <Card className="border-indigo-100 bg-indigo-50/30">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Personalized Action Roadmap for 100% Fit</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {matchResult.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-indigo-100/80 shadow-xs flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Skill Gap Intelligence Diagnostic Modal */}
      <AISkillGapIntelligenceModal
        isOpen={isAiGapModalOpen}
        onClose={() => setIsAiGapModalOpen(false)}
        targetTitle={targetTitle}
        targetCompany={targetCompany}
        matchResult={matchResult}
        student={student}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
};
