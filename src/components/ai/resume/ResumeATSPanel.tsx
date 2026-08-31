import React from 'react';
import { ResumeATSAnalysis, ResumeContent } from '../../../types';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  HelpCircle, 
  Plus, 
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface ResumeATSPanelProps {
  analysis?: ResumeATSAnalysis;
  onAddMissingKeyword?: (keyword: string) => void;
  targetRole: string;
}

export const ResumeATSPanel: React.FC<ResumeATSPanelProps> = ({
  analysis,
  onAddMissingKeyword,
  targetRole,
}) => {
  const score = analysis?.overallScore ?? 0;
  const breakdown = analysis?.breakdown ?? {
    keywordRelevance: 0,
    skillsAlignment: 0,
    sectionCompleteness: 0,
    formatting: 0,
    readability: 0,
    jobAlignment: 0,
  };

  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (val >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getProgressColor = (val: number) => {
    if (val >= 85) return 'bg-emerald-500';
    if (val >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4.5 space-y-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">ATS Resume Auditor</h4>
            <p className="text-[11px] text-slate-500">Applicant Tracking System Compatibility</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
          Live AI Engine
        </span>
      </div>

      {/* Main Score Gauge */}
      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Overall ATS Score
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl font-extrabold text-slate-900">{score}</span>
            <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </div>
          <span className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded border ${getScoreColor(score)}`}>
            {score >= 85 ? 'Excellent ATS Match' : score >= 70 ? 'Moderate Match' : 'Requires Optimization'}
          </span>
        </div>

        {/* Circular Progress Bar Representation */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-200"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={score >= 85 ? 'text-emerald-500' : score >= 70 ? 'text-amber-500' : 'text-rose-500'}
              strokeDasharray={`${score}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute text-xs font-extrabold text-slate-800">
            {score}%
          </div>
        </div>
      </div>

      {/* 6-Parameter Metric Breakdown */}
      <div className="space-y-2.5">
        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
          <span>ATS Diagnostic Breakdown</span>
          <span className="text-[10px] text-slate-400 font-normal">Standard 6-vector analysis</span>
        </h5>

        <div className="space-y-2 text-xs">
          {[
            { label: 'Keyword Relevance', val: breakdown.keywordRelevance, desc: 'Presence of critical industry terms' },
            { label: 'Skills Alignment', val: breakdown.skillsAlignment, desc: `Tailored match for ${targetRole}` },
            { label: 'Section Completeness', val: breakdown.sectionCompleteness, desc: 'Full profile history representation' },
            { label: 'ATS Formatting & Cleanliness', val: breakdown.formatting, desc: 'Single-column machine parsable tags' },
            { label: 'Readability & Action Verbs', val: breakdown.readability, desc: 'High-impact verbs and concise structure' },
            { label: 'Role & Job Alignment', val: breakdown.jobAlignment, desc: 'Alignment with target job description' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-semibold text-slate-700">{item.label}</span>
                <span className="font-bold text-slate-900">{item.val}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getProgressColor(item.val)}`}
                  style={{ width: `${item.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      {analysis?.strengths && analysis.strengths.length > 0 && (
        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Key Strengths Identified
          </div>
          <ul className="space-y-1 text-xs text-slate-700">
            {analysis.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-snug">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Keywords & 1-Click Injection */}
      {analysis?.missingKeywords && analysis.missingKeywords.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Missing High-Priority Keywords
          </div>
          <p className="text-[11px] text-slate-500">
            Recommended terms frequently indexed by recruiters for this role:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.missingKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 rounded text-[11px] font-medium"
              >
                {kw}
                {onAddMissingKeyword && (
                  <button
                    onClick={() => onAddMissingKeyword(kw)}
                    title="Add to Skills"
                    className="text-amber-700 hover:text-amber-950 ml-0.5"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Recommendations */}
      {analysis?.actionableImprovements && analysis.actionableImprovements.length > 0 && (
        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            Actionable Optimization Tips
          </div>
          <ul className="space-y-1 text-xs text-slate-700">
            {analysis.actionableImprovements.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-snug">
                <span className="text-indigo-500 font-bold">→</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-500 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-snug">
          ATS evaluation uses semantic parsing models aligned with standard hiring ATS platforms. It evaluates formatting and keyword density without modifying official academic records.
        </p>
      </div>
    </div>
  );
};
