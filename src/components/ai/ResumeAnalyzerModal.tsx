import React, { useState, useRef } from 'react';
import { 
  AIResumeAnalysis, 
  AIDetectedSkill, 
  StudentProfile 
} from '../../types';
import { AIService } from '../../services/aiService';
import { StorageService } from '../../services/storage';
import { DetectedSkillsReviewCard } from './DetectedSkillsReviewCard';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Award, 
  Layers, 
  FolderGit2, 
  Briefcase, 
  GraduationCap, 
  X, 
  RefreshCw,
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ResumeAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onProfileUpdated: (updatedStudent: StudentProfile) => void;
  initialAnalysis?: AIResumeAnalysis | null;
}

export const ResumeAnalyzerModal: React.FC<ResumeAnalyzerModalProps> = ({
  isOpen,
  onClose,
  student,
  onProfileUpdated,
  initialAnalysis = null
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'analysis' | 'detectedSkills' | 'extractedDetails'>('upload');
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState(student.resumeFileName || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysis, setAnalysis] = useState<AIResumeAnalysis | null>(initialAnalysis || null);
  const [isApplying, setIsApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState<string | null>(null);
  const [extractedTab, setExtractedTab] = useState<'education' | 'projects' | 'experience' | 'certifications'>('projects');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const analysisSteps = [
    'Parsing resume structure and formatting...',
    'Cross-referencing technical skills with industry taxonomy...',
    'Evaluating project technical complexity and impact evidence...',
    'Computing multi-dimensional Resume Quality Score...'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    
    // Read text from uploaded file
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setResumeText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleRunAnalysis = async () => {
    if (!resumeText.trim()) return;

    setIsAnalyzing(true);
    setAnalysisStep(0);

    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
    }, 650);

    try {
      const result = await AIService.analyzeResume({
        resumeText,
        fileName,
        studentId: student.id
      });
      clearInterval(stepInterval);
      setAnalysis(result);
      setActiveTab('analysis');
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSkillUpdate = (skillId: string, updates: Partial<AIDetectedSkill>) => {
    if (!analysis) return;
    StorageService.updateDetectedSkill(analysis.id, skillId, updates);
    const updatedSkills = analysis.detectedSkills.map(s => s.id === skillId ? { ...s, ...updates } : s);
    setAnalysis({ ...analysis, detectedSkills: updatedSkills });
  };

  const handleApplyConfirmedSkills = () => {
    if (!analysis) return;
    setIsApplying(true);
    const { addedCount, updatedCount } = StorageService.applyConfirmedSkillsToStudent(student.id, analysis.id);
    const updated = (StorageService.getProfileById(student.id) as StudentProfile) || student;
    if (updated) {
      onProfileUpdated(updated);
    }
    setIsApplying(false);
    setApplyMessage(`Successfully synchronized ${addedCount} new skill(s) and updated ${updatedCount} existing skill(s) in your profile.`);
    setTimeout(() => setApplyMessage(null), 5000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 border-emerald-500 bg-emerald-50';
    if (score >= 70) return 'text-indigo-600 border-indigo-500 bg-indigo-50';
    if (score >= 50) return 'text-amber-600 border-amber-500 bg-amber-50';
    return 'text-rose-600 border-rose-500 bg-rose-50';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="resume-analyzer-modal"
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">AI Resume Intelligence & Quality Analyzer</h2>
                <span className="bg-indigo-100 text-indigo-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Extract skills, calculate ATS & quality scores, and review career strengths.
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

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-bold">
            <button
              id="tab-resume-upload"
              onClick={() => setActiveTab('upload')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'upload' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              Upload & Text Source
            </button>

            <button
              id="tab-resume-score"
              onClick={() => setActiveTab('analysis')}
              disabled={!analysis}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                !analysis 
                  ? 'border-transparent text-slate-300 cursor-not-allowed' 
                  : activeTab === 'analysis' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Quality Score ({analysis ? `${analysis.resumeScore}/100` : '--'})
            </button>

            <button
              id="tab-detected-skills"
              onClick={() => setActiveTab('detectedSkills')}
              disabled={!analysis}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                !analysis 
                  ? 'border-transparent text-slate-300 cursor-not-allowed' 
                  : activeTab === 'detectedSkills' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Detected Skills ({analysis?.detectedSkills.length || 0})
            </button>

            <button
              id="tab-extracted-details"
              onClick={() => setActiveTab('extractedDetails')}
              disabled={!analysis}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                !analysis 
                  ? 'border-transparent text-slate-300 cursor-not-allowed' 
                  : activeTab === 'extractedDetails' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              Extracted Resume Data
            </button>
          </div>

          {analysis && (
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Analyzed: {new Date(analysis.analyzedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Global Notification Banner */}
        {applyMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{applyMessage}</span>
            </div>
            <button onClick={() => setApplyMessage(null)} className="text-emerald-600 hover:text-emerald-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/40">
          {/* TAB 1: UPLOAD & TEXT SOURCE */}
          {activeTab === 'upload' && (
            <div className="space-y-5">
              {/* Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/20 hover:bg-indigo-50/40 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Upload Your Resume (PDF, DOCX, TXT)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Selected file: <span className="font-semibold text-indigo-700">{fileName}</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-md shadow-2xs hover:bg-slate-50"
                >
                  Browse Files
                </button>
              </div>

              {/* Resume Text Area */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Resume Content (Paste or Extracted Text)</label>
                  <span className="text-[11px] text-slate-400">{resumeText.length} characters</span>
                </div>
                <textarea
                  rows={10}
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here (Summary, Education, Skills, Projects, Experience, Certifications) or upload a file above..."
                  className="w-full font-mono text-xs p-3.5 border border-slate-300 rounded-xl focus:outline-indigo-600 bg-white leading-relaxed text-slate-800"
                />
              </div>

              {/* Run Button / Loader */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-500">
                  ⚡ Powered by Gemini 3.7 with deterministic taxonomy matching.
                </p>

                <button
                  id="run-resume-analysis-btn"
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing || !resumeText.trim()}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {analysis ? 'Re-Analyze Resume' : 'Analyze Resume with AI'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Loading Step Progress */}
              {isAnalyzing && (
                <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                    <span>{analysisSteps[analysisStep]}</span>
                    <span>Step {analysisStep + 1} of 4</span>
                  </div>
                  <div className="w-full bg-indigo-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full transition-all duration-300"
                      style={{ width: `${((analysisStep + 1) / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ANALYSIS & SCORE */}
          {activeTab === 'analysis' && analysis && (
            <div className="space-y-6">
              {/* Score Hero Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 shadow-xs ${getScoreColor(analysis.resumeScore)}`}>
                      <span className="text-2xl font-black">{analysis.resumeScore}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Score / 100</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">Resume Quality & ATS Index</h3>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {analysis.resumeScore >= 80 ? 'Top 15% Candidate' : 'Solid Base'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                        {analysis.scoreReasoning}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('detectedSkills')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs shrink-0 self-start md:self-auto"
                  >
                    Review Detected Skills ({analysis.detectedSkills.length})
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 8-Dimensional Metric Breakdown */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-700 mb-2.5">Detailed Quality Dimensions</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {Object.entries(analysis.scoreBreakdown).map(([dim, val]) => {
                      const label = dim.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      const numVal = typeof val === 'number' ? val : Number(val) || 0;
                      return (
                        <div key={dim} className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-600 truncate">{label}</span>
                            <span className="text-xs font-bold text-slate-900">{numVal}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div 
                              className={`h-full ${numVal >= 85 ? 'bg-emerald-500' : numVal >= 70 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                              style={{ width: `${numVal}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Candidate Strengths</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {analysis.strengths.map((st, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-emerald-50/40 p-2 rounded-md border border-emerald-100">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses / Gaps */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-700">
                    <AlertTriangle className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Growth Opportunities</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {analysis.weaknesses.map((wk, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-amber-50/40 p-2 rounded-md border border-amber-100">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Improvements */}
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-indigo-900">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">AI Recommended Action Items</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {analysis.actionableImprovements.map((imp, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-lg border border-indigo-100 text-xs text-slate-700 font-medium shadow-2xs">
                      <span className="text-indigo-600 font-bold mr-1">#{idx + 1}</span> {imp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DETECTED SKILLS REVIEW */}
          {activeTab === 'detectedSkills' && analysis && (
            <div className="space-y-4">
              <DetectedSkillsReviewCard
                detectedSkills={analysis.detectedSkills}
                onSkillUpdate={handleSkillUpdate}
                onApplyConfirmed={handleApplyConfirmedSkills}
                isApplying={isApplying}
              />
            </div>
          )}

          {/* TAB 4: EXTRACTED DETAILS */}
          {activeTab === 'extractedDetails' && analysis && (
            <div className="space-y-4">
              {/* Subtabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                {(['projects', 'experience', 'education', 'certifications'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setExtractedTab(tab)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg capitalize transition-colors ${
                      extractedTab === tab
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab} ({analysis[tab]?.length || 0})
                  </button>
                ))}
              </div>

              {/* Projects Tab */}
              {extractedTab === 'projects' && (
                <div className="space-y-3">
                  {analysis.projects.map((proj, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <FolderGit2 className="w-4 h-4 text-indigo-600" />
                          {proj.title}
                        </h4>
                        {proj.githubUrl && (
                          <span className="text-[11px] text-indigo-600 font-semibold">{proj.githubUrl}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.technologies?.map((tech, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Experience Tab */}
              {extractedTab === 'experience' && (
                <div className="space-y-3">
                  {analysis.experience.map((exp, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-indigo-600" />
                          <h4 className="text-xs font-bold text-slate-900">{exp.role}</h4>
                          <span className="text-xs text-slate-500 font-medium">at {exp.organization}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{exp.duration}</span>
                      </div>
                      <ul className="space-y-1">
                        {exp.responsibilities?.map((resp, rIdx) => (
                          <li key={rIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                            <span className="text-indigo-500">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Education Tab */}
              {extractedTab === 'education' && (
                <div className="space-y-3">
                  {analysis.education.map((edu, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-indigo-600" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{edu.degree} in {edu.branch}</h4>
                          <p className="text-xs text-slate-500">{edu.institution}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-indigo-700 block">{edu.cgpaOrPercentage}</span>
                        <span className="text-[11px] text-slate-400">{edu.graduationYear}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Certifications Tab */}
              {extractedTab === 'certifications' && (
                <div className="space-y-3">
                  {analysis.certifications.map((cert, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-indigo-600" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{cert.title}</h4>
                          <p className="text-xs text-slate-500">Issued by {cert.issuer} • {cert.date}</p>
                        </div>
                      </div>
                      {cert.credentialId && (
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          ID: {cert.credentialId}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Profile Sync: Safe & Confirmed Changes Only</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Close
            </button>

            {analysis && (
              <button
                onClick={handleApplyConfirmedSkills}
                disabled={isApplying}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                {isApplying ? 'Applying to Profile...' : 'Save & Sync to Profile'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
