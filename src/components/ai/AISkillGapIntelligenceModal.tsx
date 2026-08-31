import React, { useState, useEffect } from 'react';
import { 
  AISkillGapIntelligence, 
  StudentProfile, 
  Opportunity, 
  SkillMatchResult 
} from '../../types';
import { AIService } from '../../services/aiService';
import { 
  Sparkles, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  X, 
  BookOpen, 
  RefreshCw,
  Award,
  Layers
} from 'lucide-react';

interface AISkillGapIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTitle: string;
  targetCompany?: string;
  matchScore?: number;
  requiredSkills?: any[];
  matchedSkills?: any[];
  improvementSkills?: any[];
  missingSkills?: any[];
  matchResult?: SkillMatchResult;
  student: StudentProfile;
  onNavigateToLearning?: (skills: string[]) => void;
  onNavigateTab?: (tab: string) => void;
}

export const AISkillGapIntelligenceModal: React.FC<AISkillGapIntelligenceModalProps> = ({
  isOpen,
  onClose,
  targetTitle,
  targetCompany,
  matchScore: propMatchScore,
  requiredSkills: propRequiredSkills,
  matchedSkills: propMatchedSkills,
  improvementSkills: propImprovementSkills,
  missingSkills: propMissingSkills,
  matchResult,
  student,
  onNavigateToLearning,
  onNavigateTab
}) => {
  const [intelligence, setIntelligence] = useState<AISkillGapIntelligence | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const effectiveScore = matchResult ? matchResult.scorePercentage : (propMatchScore ?? 0);
  const effectiveRequired = matchResult ? matchResult.requiredSkills : (propRequiredSkills ?? []);
  const effectiveMatched = matchResult ? matchResult.matchedSkills : (propMatchedSkills ?? []);
  const effectiveImprovement = matchResult ? matchResult.improvementSkills : (propImprovementSkills ?? []);
  const effectiveMissing = matchResult ? matchResult.missingSkills : (propMissingSkills ?? []);

  useEffect(() => {
    if (isOpen) {
      fetchSkillGapIntelligence();
    }
  }, [isOpen, targetTitle, effectiveScore]);

  const fetchSkillGapIntelligence = async () => {
    setIsLoading(true);
    try {
      const data = await AIService.explainSkillGap({
        targetRoleOrOpportunity: targetTitle,
        matchScore: effectiveScore,
        requiredSkills: effectiveRequired,
        matchedSkills: effectiveMatched,
        improvementSkills: effectiveImprovement,
        missingSkills: effectiveMissing,
        studentProfile: student
      });
      setIntelligence(data);
    } catch (err) {
      console.error('Error fetching skill gap intelligence:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleOpenLearningPath = () => {
    const gapSkillNames = [
      ...effectiveMissing.map(s => typeof s === 'string' ? s : s.name),
      ...effectiveImprovement.map(s => typeof s === 'string' ? s : s.name)
    ];
    if (onNavigateToLearning) {
      onNavigateToLearning(gapSkillNames);
    } else if (onNavigateTab) {
      onNavigateTab('learning');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="ai-skill-gap-intelligence-modal"
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">AI Skill Gap Intelligence & Diagnostic</h3>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Explainable AI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Target: <span className="font-semibold text-slate-700">{targetTitle}</span> {targetCompany && `• ${targetCompany}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-slate-50/30">
          {/* Match Metric Summary Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-indigo-50 border-2 border-indigo-500 text-indigo-700 flex flex-col items-center justify-center shrink-0">
                <span className="text-xl font-black">{effectiveScore}%</span>
                <span className="text-[9px] font-bold uppercase">Match</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deterministic Engine Score</span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  {effectiveScore >= 80 ? 'High Placement Match' : effectiveScore >= 60 ? 'Moderate Match with Bridgeable Gaps' : 'Substantial Skill Development Needed'}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="text-emerald-700 font-semibold">{effectiveMatched.length} Matched</span>
                  <span>•</span>
                  <span className="text-amber-700 font-semibold">{effectiveImprovement.length} Needs Upgrade</span>
                  <span>•</span>
                  <span className="text-rose-700 font-semibold">{effectiveMissing.length} Missing</span>
                </div>
              </div>
            </div>

            <button
              onClick={fetchSkillGapIntelligence}
              disabled={isLoading}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Re-Analyze
            </button>
          </div>

          {/* AI Narrative Explanation */}
          {isLoading ? (
            <div className="py-12 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-600">Generating AI Skill Gap diagnostic & learning pathways...</p>
            </div>
          ) : intelligence ? (
            <div className="space-y-5">
              {/* Executive Summary */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-900">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">AI Diagnostic Assessment</h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {intelligence.explanation}
                </p>
              </div>

              {/* 3-Way Grid: Strengths, Improve, Missing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Matched Strengths */}
                <div className="bg-white border border-emerald-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-emerald-100">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Strengths ({intelligence.strengths.length})
                    </span>
                  </div>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {intelligence.strengths.map((st, i) => (
                      <li key={i} className="text-[11px] bg-emerald-50/50 p-2 rounded border border-emerald-100 space-y-0.5">
                        <span className="font-bold text-slate-900 block">{st.skill}</span>
                        <span className="text-slate-600 text-[10px] leading-tight block">{st.why}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Improvement Needed */}
                <div className="bg-white border border-amber-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-100">
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                      Level Up ({intelligence.improve.length})
                    </span>
                  </div>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {intelligence.improve.map((imp, i) => (
                      <li key={i} className="text-[11px] bg-amber-50/50 p-2 rounded border border-amber-100 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{imp.skill}</span>
                          <span className="text-[9px] font-bold text-amber-800">{imp.current} → {imp.required}</span>
                        </div>
                        <span className="text-slate-600 text-[10px] leading-tight block">{imp.recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Missing Skills */}
                <div className="bg-white border border-rose-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-rose-100">
                    <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      Missing Gaps ({intelligence.missing.length})
                    </span>
                  </div>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {intelligence.missing.map((mis, i) => (
                      <li key={i} className="text-[11px] bg-rose-50/50 p-2 rounded border border-rose-100 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{mis.skill}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            mis.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {mis.priority} Priority
                          </span>
                        </div>
                        <span className="text-slate-600 text-[10px] leading-tight block">{mis.learningPath}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Plan */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2 text-slate-800">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Prioritized Action Plan to Reach 90%+ Match</h4>
                </div>
                <div className="space-y-2">
                  {intelligence.actionPlan.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-medium pt-0.5">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleOpenLearningPath}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            Generate Targeted Learning Modules for Gaps
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
