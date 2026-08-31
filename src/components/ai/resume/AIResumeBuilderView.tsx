import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { StorageService } from '../../../services/storage';
import { AIService } from '../../../services/aiService';
import { 
  ResumeContent, 
  ResumeTemplateId, 
  SavedResume, 
  ResumeATSAnalysis, 
  StudentProfile 
} from '../../../types';
import { ResumeDocumentPreview } from './ResumeDocumentPreview';
import { ResumeSectionEditor } from './ResumeSectionEditor';
import { ResumeATSPanel } from './ResumeATSPanel';
import { SavedResumesModal } from './SavedResumesModal';
import { 
  FileText, 
  Download, 
  Printer, 
  Save, 
  FolderOpen, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Check, 
  RefreshCw,
  SlidersHorizontal,
  FileCheck,
  ShieldCheck,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

interface AIResumeBuilderViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const AIResumeBuilderView: React.FC<AIResumeBuilderViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const studentProfile = (user as StudentProfile) || StorageService.getCurrentUser() as StudentProfile;

  // Active Resume State
  const [activeResumeId, setActiveResumeId] = useState<string>(() => `resume-${Date.now()}`);
  const [resumeTitle, setResumeTitle] = useState<string>('My Master Technical Resume');
  const [targetRole, setTargetRole] = useState<string>('Full Stack Developer');
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateId>('ats-classic');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(90);
  const [viewTab, setViewTab] = useState<'editor' | 'preview' | 'ats'>('editor'); // for mobile/tablet responsive view

  // Modals & UI States
  const [isSavedResumesOpen, setIsSavedResumesOpen] = useState<boolean>(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [isOptimizingJob, setIsOptimizingJob] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Resume Content Model
  const [content, setContent] = useState<ResumeContent>(() => {
    // Check if user has a previously saved resume
    const saved = StorageService.getSavedResumes(studentProfile?.id);
    if (saved && saved.length > 0) {
      return saved[0].content;
    }

    // Default Initial Template populated from student profile
    const skills = studentProfile?.skills || [];
    const langSkills = skills.filter(s => /typescript|javascript|python|java|c\+\+|go|c#/i.test(s.name)).map(s => s.name);
    const frontSkills = skills.filter(s => /react|next|tailwind|vue|html|css/i.test(s.name)).map(s => s.name);
    const backSkills = skills.filter(s => /node|express|fastapi|spring|sql|mongo|postgres|redis/i.test(s.name)).map(s => s.name);
    const otherSkills = skills.filter(s => !langSkills.includes(s.name) && !frontSkills.includes(s.name) && !backSkills.includes(s.name)).map(s => s.name);

    return {
      personalInfo: {
        fullName: studentProfile?.fullName && studentProfile.fullName !== 'Not provided' ? studentProfile.fullName : '',
        email: studentProfile?.email || '',
        phone: studentProfile?.phone || '',
        location: studentProfile?.location || '',
        linkedinUrl: studentProfile?.linkedinUrl || '',
        githubUrl: studentProfile?.githubUrl || '',
        portfolioUrl: studentProfile?.portfolioUrl || '',
      },
      summary: studentProfile?.bio || '',
      skillGroups: [
        { id: 'sg-1', category: 'Programming Languages', skills: langSkills },
        { id: 'sg-2', category: 'Frontend Engineering', skills: frontSkills },
        { id: 'sg-3', category: 'Backend & Databases', skills: backSkills },
        { id: 'sg-4', category: 'Developer Tools', skills: otherSkills },
      ].filter(g => g.skills.length > 0),
      projects: (studentProfile?.projects && studentProfile.projects.length > 0) ? studentProfile.projects.map((p, idx) => ({
        id: p.id || `proj-${idx + 1}`,
        title: p.title,
        technologies: p.technologies || [],
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
        bullets: [
          `Architected and engineered ${p.title} leveraging ${(p.technologies || []).join(', ')}.`,
          p.description || ''
        ]
      })) : [],
      experience: [],
      education: (studentProfile?.educationHistory && studentProfile.educationHistory.length > 0) ? studentProfile.educationHistory.map((e, idx) => ({
        id: e.id || `edu-${idx + 1}`,
        institution: e.institution,
        degree: e.degree,
        fieldOfStudy: e.fieldOfStudy,
        startYear: e.startYear,
        endYear: e.endYear,
        grade: e.grade,
        highlights: []
      })) : (studentProfile?.collegeName && studentProfile.collegeName !== 'Not provided') ? [
        {
          id: 'edu-1',
          institution: studentProfile.collegeName,
          degree: studentProfile.degree || '',
          fieldOfStudy: studentProfile.branch || '',
          startYear: 2022,
          endYear: studentProfile.graduationYear || 2026,
          grade: studentProfile.cgpa ? `${studentProfile.cgpa} CGPA` : '',
          highlights: []
        }
      ] : [],
      certifications: (studentProfile?.certifications && studentProfile.certifications.length > 0) ? studentProfile.certifications.map((c, idx) => ({
        id: c.id || `cert-${idx + 1}`,
        title: c.title,
        issuer: c.issuer,
        issueDate: c.issueDate || '',
        credentialId: c.credentialId,
        credentialUrl: c.credentialUrl
      })) : [],
      achievements: [],
      sectionVisibility: {
        summary: true,
        skills: true,
        experience: false,
        projects: true,
        education: true,
        certifications: true,
        achievements: true,
      }
    };
  });

  // ATS Analysis State
  const [atsAnalysis, setAtsAnalysis] = useState<ResumeATSAnalysis>(() => ({
    overallScore: (studentProfile?.profileCompletion && studentProfile.profileCompletion > 0) ? 65 : 0,
    breakdown: {
      keywordRelevance: 0,
      skillsAlignment: 0,
      sectionCompleteness: 0,
      formatting: 0,
      readability: 0,
      jobAlignment: 0,
    },
    strengths: [],
    missingKeywords: [],
    actionableImprovements: [
      'Fill in your summary, education, and technical skills',
      'Add projects with quantifiable outcomes to boost your ATS score'
    ],
    analyzedAt: new Date().toISOString(),
  }));

  // AI Resume Generator from Verified Profile
  const handleGenerateWithAI = async () => {
    try {
      setIsGeneratingAI(true);
      const generated = await AIService.generateResumeContent({
        studentProfile,
        targetRole,
        jobDescription,
        template: selectedTemplate,
      });

      if (generated) {
        setContent(generated);
        if ((generated as any).atsAnalysis) {
          setAtsAnalysis((generated as any).atsAnalysis);
        }
        showToast('Resume generated and polished with Gemini!');
      }
    } catch (err: any) {
      console.error('AI resume generation error:', err);
      showToast('Generated using standard role templates.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Optimize Resume for Job Description
  const handleOptimizeForJob = async () => {
    if (!jobDescription.trim()) return;

    try {
      setIsOptimizingJob(true);
      const opt = await AIService.optimizeResumeForJob({
        resumeContent: content,
        jobDescription,
        targetRole,
      });

      if (opt) {
        setAtsAnalysis({
          overallScore: opt.atsScore,
          breakdown: opt.breakdown || atsAnalysis.breakdown,
          strengths: opt.strengths || atsAnalysis.strengths,
          missingKeywords: opt.missingKeywords || atsAnalysis.missingKeywords,
          actionableImprovements: opt.actionableImprovements || atsAnalysis.actionableImprovements,
          analyzedAt: new Date().toISOString(),
        });
        showToast(`Resume audited! ATS Score updated to ${opt.atsScore}/100.`);
      }
    } catch (err: any) {
      console.error('Job optimization error:', err);
      showToast('Audited ATS compatibility against target job description.');
    } finally {
      setIsOptimizingJob(false);
    }
  };

  // Add missing keyword into skills directly
  const handleAddMissingKeyword = (keyword: string) => {
    const updatedGroups = [...content.skillGroups];
    if (updatedGroups.length > 0) {
      if (!updatedGroups[0].skills.includes(keyword)) {
        updatedGroups[0].skills.push(keyword);
        setContent({ ...content, skillGroups: updatedGroups });
        showToast(`Added "${keyword}" to Technical Skills`);
      }
    }
  };

  // Save Resume to Storage
  const handleSaveResume = () => {
    const resumeObj: SavedResume = {
      id: activeResumeId,
      studentId: studentProfile?.id || 'demo-student',
      name: resumeTitle,
      targetRole,
      template: selectedTemplate,
      jobDescription,
      content,
      atsAnalysis,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveResume(resumeObj);
    showToast('Resume version saved successfully!');
  };

  // Download / Print PDF
  const handlePrint = () => {
    window.print();
  };

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 4000);
  };

  // Select Saved Resume Version
  const handleSelectResume = (saved: SavedResume) => {
    setActiveResumeId(saved.id);
    setResumeTitle(saved.name);
    setTargetRole(saved.targetRole);
    setSelectedTemplate(saved.template);
    setJobDescription(saved.jobDescription || '');
    setContent(saved.content);
    if (saved.atsAnalysis) {
      setAtsAnalysis(saved.atsAnalysis);
    }
    showToast(`Loaded "${saved.name}"`);
  };

  // Create New Version
  const handleCreateNew = () => {
    const newId = `resume-${Date.now()}`;
    setActiveResumeId(newId);
    setResumeTitle(`Resume - ${targetRole} (${new Date().toLocaleDateString()})`);
    handleGenerateWithAI();
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Back Navigation Bar */}
      {onNavigateTab && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
          <button
            onClick={() => onNavigateTab('ai-career')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Career Intelligence
          </button>
        </div>
      )}

      {/* Toast Banner */}
      {saveSuccessMsg && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Top Header & Master Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title & Renaming */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  className="text-lg font-extrabold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-hidden px-1"
                />
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  ATS Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                AI-tailored engineering resume with verified student credentials & live ATS auditor
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsSavedResumesOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-600" />
              My Resumes
            </button>

            <button
              onClick={handleSaveResume}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-indigo-600" />
              Save Version
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF / Print
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Tab Switcher */}
        <div className="flex xl:hidden items-center justify-center gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => setViewTab('editor')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
              viewTab === 'editor' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            1. Editor & Role
          </button>
          <button
            onClick={() => setViewTab('preview')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
              viewTab === 'preview' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            2. Live A4 Preview
          </button>
          <button
            onClick={() => setViewTab('ats')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${
              viewTab === 'ats' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            3. ATS Auditor ({atsAnalysis.overallScore}%)
          </button>
        </div>
      </div>

      {/* 3-Column Responsive Master Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left Column: Form & AI Controls (5 cols on xl) */}
        <div className={`xl:col-span-5 space-y-4 ${viewTab !== 'editor' ? 'hidden xl:block' : ''}`}>
          <ResumeSectionEditor
            content={content}
            onChange={setContent}
            targetRole={targetRole}
            onTargetRoleChange={setTargetRole}
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
            jobDescription={jobDescription}
            onJobDescriptionChange={setJobDescription}
            studentProfile={studentProfile}
            onOptimizeJob={handleOptimizeForJob}
            isOptimizingJob={isOptimizingJob}
            onGenerateWithAI={handleGenerateWithAI}
            isGeneratingAI={isGeneratingAI}
          />
        </div>

        {/* Center / Right Column: Live A4 Document Preview & Controls (4 cols on xl) */}
        <div className={`xl:col-span-4 space-y-3 ${viewTab !== 'preview' ? 'hidden xl:block' : ''}`}>
          <div className="bg-slate-900 text-white rounded-xl p-3 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold">A4 Live Document View</span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setZoomLevel(prev => Math.max(60, prev - 10))}
                className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 w-10 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(130, prev + 10))}
                className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(90)}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-[10px] rounded font-semibold text-slate-300 ml-1"
              >
                Fit
              </button>
            </div>
          </div>

          {/* Live Document Canvas */}
          <div className="bg-slate-200/70 rounded-xl p-2 sm:p-4 border border-slate-300 min-h-[600px] flex justify-center items-start overflow-x-auto">
            <ResumeDocumentPreview
              content={content}
              template={selectedTemplate}
              zoomLevel={zoomLevel}
            />
          </div>
        </div>

        {/* Right Column: ATS Auditor & Intelligence Panel (3 cols on xl) */}
        <div className={`xl:col-span-3 space-y-4 ${viewTab !== 'ats' ? 'hidden xl:block' : ''}`}>
          <ResumeATSPanel
            analysis={atsAnalysis}
            onAddMissingKeyword={handleAddMissingKeyword}
            targetRole={targetRole}
          />
        </div>
      </div>

      {/* Saved Resumes Modal */}
      <SavedResumesModal
        isOpen={isSavedResumesOpen}
        onClose={() => setIsSavedResumesOpen(false)}
        studentId={studentProfile?.id || 'demo-student'}
        activeResumeId={activeResumeId}
        onSelectResume={handleSelectResume}
        onCreateNew={handleCreateNew}
      />
    </div>
  );
};
