import React, { useState, useEffect } from 'react';
import { 
  AILearningRecommendation, 
  StudentProfile 
} from '../../types';
import { AIService } from '../../services/aiService';
import { StorageService } from '../../services/storage';
import { 
  BookOpen, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  FolderGit2, 
  Clock, 
  Award, 
  FileCode2, 
  ExternalLink, 
  RefreshCw, 
  Filter,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface AILearningRecommendationsViewProps {
  student: StudentProfile;
  onNavigateToAssessment?: (skillName: string) => void;
  targetRole?: string;
}

export const AILearningRecommendationsView: React.FC<AILearningRecommendationsViewProps> = ({
  student,
  onNavigateToAssessment,
  targetRole = student.careerGoal || 'Full Stack Developer'
}) => {
  const [recommendations, setRecommendations] = useState<AILearningRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState<'All' | 'Missing' | 'Improvement'>('All');
  const [filterPriority, setFilterPriority] = useState<'All' | 'High' | 'Medium'>('All');

  // Load existing recommendations or generate fresh ones
  useEffect(() => {
    const existing = StorageService.getLearningRecommendations(student.id);
    if (existing.length > 0) {
      setRecommendations(existing);
    } else {
      handleGenerateRecommendations();
    }
  }, [student.id]);

  const handleGenerateRecommendations = async () => {
    setIsLoading(true);

    // Compute missing / improvement skills against taxonomy and industry demand
    const allTaxonomy = StorageService.getSkills();
    const studentSkillNames = student.skills.map(s => s.name.toLowerCase());

    const missingSkills = allTaxonomy
      .filter(t => !studentSkillNames.includes(t.name.toLowerCase()) && t.industryDemandWeight >= 8)
      .slice(0, 4)
      .map(t => t.name);

    const improvementSkills = student.skills
      .filter(s => s.proficiency === 'Beginner' || !s.verified)
      .map(s => s.name);

    try {
      const data = await AIService.generateLearningRecommendations({
        missingSkills,
        improvementSkills,
        careerGoal: targetRole,
        studentId: student.id
      });
      setRecommendations(data);
    } catch (err) {
      console.error('Error generating learning recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = recommendations.filter(rec => {
    if (filterType !== 'All' && rec.gapType !== filterType) return false;
    if (filterPriority !== 'All' && rec.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div id="ai-learning-recommendations-section" className="space-y-6">
      {/* Header & Generator Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">AI Gap-Mapped Learning Recommendations</h3>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  1-to-1 Gap Aligned
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Curated learning objectives, hands-on practice, and standout projects designed specifically to close your verified skill gaps.
              </p>
            </div>
          </div>
        </div>

        <button
          id="regenerate-learning-btn"
          onClick={handleGenerateRecommendations}
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Generating Modules...' : 'Refresh AI Recommendations'}
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filter Gap Type:
          </span>
          {(['All', 'Missing', 'Improvement'] as const).map(type => (
            <button
              key={type}
              id={`filter-gap-${type.toLowerCase()}`}
              onClick={() => setFilterType(type)}
              className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                filterType === type 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'Improvement' ? 'Needs Upgrade' : type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Priority:</span>
          {(['All', 'High', 'Medium'] as const).map(p => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`text-xs font-semibold px-2.5 py-0.5 rounded transition-colors ${
                filterPriority === p 
                  ? 'bg-indigo-100 text-indigo-800 font-bold' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-slate-900">Synthesizing Tailored Learning Pathways</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Cross-referencing your target role ({targetRole}) and missing skills with industry standards...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
          No learning recommendations matching selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(rec => (
            <div
              key={rec.id}
              id={`learning-card-${rec.id}`}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header tags */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rec.gapType === 'Missing' 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rec.gapType === 'Missing' ? 'Missing Mandatory Gap' : 'Proficiency Upgrade'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                        {rec.priority} Priority
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1.5">{rec.skillName}</h4>
                    <span className="text-xs font-semibold text-indigo-600">{rec.topic}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100 shrink-0">
                    <Clock className="w-3 h-3 text-slate-400" />
                    ~{rec.estimatedHours}h
                  </div>
                </div>

                {/* Core Recommendation */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {rec.recommendation}
                </p>

                {/* Practice & Project Sections */}
                <div className="space-y-2 pt-1">
                  {/* Hands-on Practice */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-700 uppercase flex items-center gap-1">
                      <FileCode2 className="w-3 h-3 text-indigo-600" />
                      Suggested Hands-on Task
                    </span>
                    <p className="text-xs text-slate-600 leading-normal">
                      {rec.suggestedPractice}
                    </p>
                  </div>

                  {/* Portfolio Project */}
                  <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                      <FolderGit2 className="w-3 h-3 text-emerald-600" />
                      Recommended Portfolio Project
                    </span>
                    <p className="text-xs text-emerald-950 font-medium leading-normal">
                      {rec.suggestedProject}
                    </p>
                  </div>
                </div>

                {/* Verified Resources / Documentation */}
                <div className="space-y-1 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-700">Resource:</span>
                    <span className="truncate">{rec.documentationResource}</span>
                  </div>

                  {rec.certificationName && (
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="font-semibold text-slate-700">Target Cert:</span>
                      <span className="truncate">{rec.certificationName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Ready to prove competency?</span>
                
                {onNavigateToAssessment ? (
                  <button
                    onClick={() => onNavigateToAssessment(rec.skillName)}
                    className="text-xs font-bold px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    Take Assessment
                  </button>
                ) : (
                  <button
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    View Curriculum <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
