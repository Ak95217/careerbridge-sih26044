import React from 'react';
import { 
  StudentProfile, 
  AIResumeAnalysis 
} from '../../types';
import { 
  Sparkles, 
  FileText, 
  Compass, 
  Brain, 
  TrendingUp, 
  ArrowRight, 
  Award,
  Zap,
  Target
} from 'lucide-react';

interface AIInsightsSummaryCardProps {
  student: StudentProfile;
  latestAnalysis: AIResumeAnalysis | null;
  onOpenResumeAnalyzer: () => void;
  onOpenResumeBuilder?: () => void;
  onOpenRoadmap: () => void;
  onOpenMockInterview: () => void;
  onOpenLearning: () => void;
}

export const AIInsightsSummaryCard: React.FC<AIInsightsSummaryCardProps> = ({
  student,
  latestAnalysis,
  onOpenResumeAnalyzer,
  onOpenResumeBuilder,
  onOpenRoadmap,
  onOpenMockInterview,
  onOpenLearning
}) => {
  const targetRole = student.targetRole || student.careerGoal || 'Not specified';

  return (
    <div 
      id="ai-insights-summary-card"
      className="bg-gradient-to-r from-indigo-900/95 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4"
    >
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight">AI Career Intelligence Hub</h3>
              <span className="bg-indigo-500/20 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-400/20">
                Gemini 3.7
              </span>
            </div>
            <p className="text-[11px] text-indigo-200/80">
              Personalized career diagnostics, ATS scoring, and placement preparation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenResumeBuilder && (
            <button
              id="ai-card-resume-builder-btn"
              onClick={onOpenResumeBuilder}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Build Resume
            </button>
          )}
          <button
            onClick={onOpenRoadmap}
            className="text-xs font-bold text-indigo-200 hover:text-white flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            View Full AI Hub <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Quick Intelligence Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Resume Quality & Analyzer */}
        <div 
          onClick={onOpenResumeAnalyzer}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Resume Score
            </span>
            <span className="text-xs font-black text-white">
              {latestAnalysis ? `${latestAnalysis.resumeScore}/100` : 'Not Analyzed'}
            </span>
          </div>
          <p className="text-[11px] text-indigo-100/70 truncate">
            {latestAnalysis ? `${latestAnalysis.detectedSkills.length} skills verified` : 'Click to run AI analyzer or build new'}
          </p>
        </div>

        {/* 2. Target Role & Roadmap */}
        <div 
          onClick={onOpenRoadmap}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
              <Compass className="w-3 h-3" />
              Target Goal
            </span>
            <span className="text-xs font-bold text-white truncate max-w-[120px]">
              {targetRole}
            </span>
          </div>
          <p className="text-[11px] text-indigo-100/70 truncate">
            6-phase milestone roadmap
          </p>
        </div>

        {/* 3. Placement Readiness */}
        <div 
          onClick={onOpenMockInterview}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
              <Brain className="w-3 h-3" />
              Mock Interview
            </span>
            <span className="text-xs font-black text-emerald-400">
              Interactive
            </span>
          </div>
          <p className="text-[11px] text-indigo-100/70 truncate">
            Live technical evaluation
          </p>
        </div>
      </div>
    </div>
  );
};
