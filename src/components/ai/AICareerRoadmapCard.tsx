import React, { useState, useEffect } from 'react';
import { 
  AICareerRoadmap, 
  AICareerRoadmapStep, 
  StudentProfile 
} from '../../types';
import { AIService } from '../../services/aiService';
import { StorageService } from '../../services/storage';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Target, 
  Lightbulb, 
  FolderGit2, 
  BookOpen, 
  RefreshCw, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Award,
  Zap
} from 'lucide-react';

interface AICareerRoadmapCardProps {
  student: StudentProfile;
  onProfileUpdated?: (updatedStudent: StudentProfile) => void;
}

const PRESET_ROLES = [
  'Full Stack Developer',
  'Backend Systems Engineer',
  'AI/ML & LLM Engineer',
  'Cloud & DevOps Architect',
  'Data Scientist & Analytics Engineer',
  'Mobile Application Engineer',
  'Cybersecurity & Application Security Engineer'
];

export const AICareerRoadmapCard: React.FC<AICareerRoadmapCardProps> = ({
  student,
  onProfileUpdated
}) => {
  const [selectedRole, setSelectedRole] = useState(student.targetRole || student.careerGoal || 'Full Stack Developer');
  const [isCustom, setIsCustom] = useState(false);
  const [customRole, setCustomRole] = useState('');
  const [roadmap, setRoadmap] = useState<AICareerRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  useEffect(() => {
    const savedRole = student.targetRole || student.careerGoal || 'Full Stack Developer';
    setSelectedRole(savedRole);
    setCustomRole('');
    setIsCustom(false);
  }, [student.id, student.targetRole, student.careerGoal]);

  // Load existing roadmap from storage on mount
  useEffect(() => {
    const existing = StorageService.getCareerRoadmap(student.id, selectedRole);
    if (existing) {
      setRoadmap(existing);
    }
  }, [student.id, selectedRole]);

  const handleGenerateRoadmap = async () => {
    const targetRole = isCustom && customRole.trim() ? customRole.trim() : (selectedRole || student.targetRole || student.careerGoal || 'Full Stack Developer');
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const profileWithTarget = {
        ...student,
        targetRole,
        careerGoal: targetRole
      } as StudentProfile;

      StorageService.updateStudentCareerGoal(student.id, targetRole, targetRole);
      const updated = (StorageService.getProfileById(student.id) as StudentProfile) || profileWithTarget;
      if (updated && onProfileUpdated) {
        onProfileUpdated(updated);
      }

      const newRoadmap = await AIService.generateCareerRoadmap({
        studentProfile: profileWithTarget,
        targetRole,
        careerGoal: targetRole,
        skillGaps: []
      });

      setRoadmap(newRoadmap);
      setExpandedStep(1);
      setErrorMessage(null);
    } catch (err) {
      console.error('Error generating roadmap:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Unable to generate a roadmap right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStep = (stepNumber: number) => {
    if (!roadmap) return;
    StorageService.toggleRoadmapStep(roadmap.id, stepNumber);
    const updatedSteps = roadmap.steps.map(s => 
      s.stepNumber === stepNumber ? { ...s, completed: !s.completed } : s
    );
    setRoadmap({ ...roadmap, steps: updatedSteps });
  };

  const completedStepsCount = roadmap?.steps.filter(s => s.completed).length || 0;
  const totalStepsCount = roadmap?.steps.length || 6;
  const progressPercent = Math.round((completedStepsCount / totalStepsCount) * 100);

  return (
    <div id="ai-career-roadmap-section" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header & Goal Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">AI Phased Career Roadmap</h3>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Personalized Path
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tailored multi-week milestone plan based on your current verified skills and target industry role.
              </p>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {errorMessage}
          </div>
        )}

        {/* Role Picker Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {!isCustom ? (
            <select
              id="career-role-select"
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 focus:outline-indigo-600"
            >
              {PRESET_ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="e.g. Distributed Database Engineer"
              value={customRole}
              onChange={e => setCustomRole(e.target.value)}
              className="text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-indigo-600 w-52"
            />
          )}

          <button
            onClick={() => setIsCustom(!isCustom)}
            className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 underline px-1"
          >
            {isCustom ? 'Use Presets' : 'Custom Goal'}
          </button>

          <button
            id="generate-roadmap-btn"
            onClick={handleGenerateRoadmap}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                {roadmap ? 'Refresh Roadmap' : 'Generate AI Roadmap'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Roadmap Display */}
      {errorMessage && !roadmap && (
        <div className="text-center py-8 px-4 bg-rose-50/60 rounded-xl border border-rose-200 text-rose-700 text-xs">
          We could not generate a roadmap right now. Please check the AI service configuration and try again.
        </div>
      )}

      {roadmap ? (
        <div className="space-y-6">
          {/* Summary & Progress Banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-900">Target Role: {roadmap.targetRole}</h4>
                <span className="text-[11px] text-slate-400 font-medium">• {roadmap.targetTimelineWeeks} Weeks Total</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                {roadmap.currentProficiencySummary}
              </p>
            </div>

            {/* Progress Counter */}
            <div className="shrink-0 text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-xs font-bold text-slate-700">Roadmap Progress</span>
                <span className="text-xs font-black text-indigo-600">{progressPercent}%</span>
              </div>
              <div className="w-36 bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {completedStepsCount} of {totalStepsCount} milestones achieved
              </span>
            </div>
          </div>

          {/* Interactive Steps Timeline */}
          <div className="space-y-3.5">
            {roadmap.steps.map((step, idx) => {
              const isExpanded = expandedStep === step.stepNumber;

              return (
                <div
                  key={step.stepNumber}
                  id={`roadmap-step-${step.stepNumber}`}
                  className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                    step.completed 
                      ? 'border-emerald-200 bg-emerald-50/20' 
                      : isExpanded 
                      ? 'border-indigo-200 bg-white shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Step Header Bar */}
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleStep(step.stepNumber)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                        title={step.completed ? 'Mark incomplete' : 'Mark completed'}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      {/* Phase Badge */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        step.completed 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        Phase {step.stepNumber}
                      </span>

                      {/* Title */}
                      <div>
                        <h4 className={`text-xs font-bold ${
                          step.completed ? 'text-emerald-900 line-through' : 'text-slate-900'
                        }`}>
                          {step.phaseTitle}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {step.estimatedDuration}
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-xs">{step.skillsOrTopics.slice(0, 3).join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expand/Collapse Toggle */}
                    <button
                      onClick={() => setExpandedStep(isExpanded ? null : step.stepNumber)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Step Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/40 space-y-3.5 animate-in fade-in">
                      {/* Why it matters */}
                      <div className="flex items-start gap-2 bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100 text-xs text-indigo-950">
                        <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Why this milestone matters: </span>
                          <span>{step.whyItMatters}</span>
                        </div>
                      </div>

                      {/* Topics & Skills Pills */}
                      <div>
                        <h5 className="text-[11px] font-bold text-slate-500 uppercase mb-1.5">Key Competencies & Topics</h5>
                        <div className="flex flex-wrap gap-1.5">
                          {step.skillsOrTopics.map((topic, tIdx) => (
                            <span key={tIdx} className="text-xs font-semibold bg-white border border-slate-200 text-slate-800 px-2.5 py-1 rounded-md shadow-2xs">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actionable Practice & Portfolio Project Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {/* Hands-on Practice */}
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            Suggested Hands-On Practice
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {step.suggestedPractice}
                          </p>
                        </div>

                        {/* Portfolio Project */}
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
                            <FolderGit2 className="w-3 h-3" />
                            Standout Portfolio Project
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {step.suggestedProject}
                          </p>
                        </div>
                      </div>

                      {/* Expected Outcome */}
                      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span className="font-bold">Expected Milestone Outcome:</span> {step.expectedOutcome}
                        </span>

                        <button
                          onClick={() => handleToggleStep(step.stepNumber)}
                          className={`text-xs font-bold px-3 py-1 rounded-md transition-colors ${
                            step.completed 
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                          }`}
                        >
                          {step.completed ? 'Mark Incomplete' : 'Mark Completed'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty / Call to Action state */
        <div className="text-center py-10 px-4 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">No Career Roadmap Generated Yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Select your dream role and let Gemini AI create a personalized 6-phase engineering milestone roadmap to guide your preparation.
            </p>
          </div>
          <button
            onClick={handleGenerateRoadmap}
            disabled={isLoading}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Generate Roadmap for {selectedRole}
          </button>
        </div>
      )}
    </div>
  );
};
