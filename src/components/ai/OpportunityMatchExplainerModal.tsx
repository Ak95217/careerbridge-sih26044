import React, { useState, useEffect } from 'react';
import { 
  Opportunity, 
  StudentProfile, 
  SkillMatchResult 
} from '../../types';
import { AIService } from '../../services/aiService';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  X, 
  Building2, 
  Briefcase, 
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';

interface OpportunityMatchExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  student: StudentProfile;
  matchResult?: SkillMatchResult;
  onApply?: () => void;
}

export const OpportunityMatchExplainerModal: React.FC<OpportunityMatchExplainerModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  student,
  matchResult,
  onApply
}) => {
  const [explanation, setExplanation] = useState<{
    explanationText: string;
    matchingStrengths: string[];
    missingRequirements: string[];
    recommendedAction: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchExplanation();
    }
  }, [isOpen, opportunity.id]);

  const fetchExplanation = async () => {
    setIsLoading(true);
    try {
      const data = await AIService.explainOpportunityRecommendation({
        opportunity,
        studentSkills: student.skills,
        studentProjects: student.projects,
        matchResult
      });
      setExplanation(data);
    } catch (err) {
      console.error('Error explaining match:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="opportunity-match-explainer-modal"
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">AI Match Explanation</h3>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Explainable Match
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {opportunity.title} at {opportunity.companyName}
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
          {/* Match Score Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-xl bg-indigo-50 border-2 border-indigo-500 text-indigo-700 flex flex-col items-center justify-center shrink-0">
                <span className="text-lg font-black">{matchResult?.scorePercentage || 82}%</span>
                <span className="text-[9px] font-bold uppercase">Fit</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Opportunity Matching Fit</span>
                <h4 className="text-xs font-bold text-slate-900">{opportunity.title}</h4>
                <span className="text-xs text-slate-500">{opportunity.companyName} • {opportunity.location}</span>
              </div>
            </div>

            <button
              onClick={fetchExplanation}
              disabled={isLoading}
              className="text-xs font-semibold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              Re-Explain
            </button>
          </div>

          {isLoading ? (
            <div className="py-12 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-600">Cross-referencing candidate profile and job requirements...</p>
            </div>
          ) : explanation ? (
            <div className="space-y-4">
              {/* Executive reasoning */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-900">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Why You Are Recommended</h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {explanation.explanationText}
                </p>
              </div>

              {/* Matching Strengths */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Strong Alignment Factors</h4>
                </div>
                <ul className="space-y-1.5">
                  {explanation.matchingStrengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-emerald-50/40 p-2 rounded-md border border-emerald-100">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Requirements if any */}
              {explanation.missingRequirements && explanation.missingRequirements.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Potential Skill Gaps to Address</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {explanation.missingRequirements.map((mis, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-amber-50/40 p-2 rounded-md border border-amber-100">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{mis}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Action */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-slate-800">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Recommended Next Step</h4>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {explanation.recommendedAction}
                </p>
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

          {onApply && (
            <button
              onClick={() => {
                onClose();
                onApply();
              }}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              Proceed to Apply
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
