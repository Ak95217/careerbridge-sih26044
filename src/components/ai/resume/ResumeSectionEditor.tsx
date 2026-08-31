import React, { useState, useMemo } from 'react';
import { 
  ResumeContent, 
  ResumeTemplateId, 
  StudentProfile, 
  ResumeSkillCategoryGroup, 
  ResumeProjectItem, 
  ResumeExperienceItem,
  ResumeEducationItem,
  ResumeCertificationItem,
  ResumeAchievementItem,
  Opportunity,
  SkillMatchResult
} from '../../../types';
import { AIService } from '../../../services/aiService';
import { StorageService } from '../../../services/storage';
import { calculateSkillMatch } from '../../../services/skillMatching';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  User, 
  FileText, 
  Code, 
  Briefcase, 
  FolderGit2, 
  GraduationCap, 
  Award, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Target,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  SlidersHorizontal,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ResumeSectionEditorProps {
  content: ResumeContent;
  onChange: (updated: ResumeContent) => void;
  targetRole: string;
  onTargetRoleChange: (role: string) => void;
  selectedTemplate: ResumeTemplateId;
  onTemplateChange: (t: ResumeTemplateId) => void;
  jobDescription: string;
  onJobDescriptionChange: (jd: string) => void;
  studentProfile: StudentProfile;
  onOptimizeJob: () => void;
  isOptimizingJob: boolean;
  onGenerateWithAI: () => void;
  isGeneratingAI: boolean;
}

export const ResumeSectionEditor: React.FC<ResumeSectionEditorProps> = ({
  content,
  onChange,
  targetRole,
  onTargetRoleChange,
  selectedTemplate,
  onTemplateChange,
  jobDescription,
  onJobDescriptionChange,
  studentProfile,
  onOptimizeJob,
  isOptimizingJob,
  onGenerateWithAI,
  isGeneratingAI,
}) => {
  // Target Type selector: 'internship' | 'placement' | 'custom'
  const [targetType, setTargetType] = useState<'internship' | 'placement' | 'custom'>('custom');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>('');

  // Accordion open states
  const [openSection, setOpenSection] = useState<string>('role');
  const [improvingBulletIdx, setImprovingBulletIdx] = useState<{ section: 'project' | 'exp'; itemId: string; bulletIdx: number } | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isImprovingBullet, setIsImprovingBullet] = useState(false);
  const [isRewritingSummary, setIsRewritingSummary] = useState(false);

  // All opportunities from storage
  const allOpportunities = useMemo(() => StorageService.getOpportunities(), []);
  const filteredOpportunities = useMemo(() => {
    if (targetType === 'internship') return allOpportunities.filter(o => o.type === 'Internship');
    if (targetType === 'placement') return allOpportunities.filter(o => o.type === 'Job');
    return allOpportunities;
  }, [allOpportunities, targetType]);

  const selectedOpp = useMemo(() => {
    return allOpportunities.find(o => o.id === selectedOpportunityId) || null;
  }, [allOpportunities, selectedOpportunityId]);

  // Compute live deterministic skill match if an opportunity is selected
  const opportunityMatch: SkillMatchResult | null = useMemo(() => {
    if (!selectedOpp) return null;
    return calculateSkillMatch(
      studentProfile.skills || [],
      selectedOpp.requiredSkills || []
    );
  }, [selectedOpp, studentProfile.skills]);

  // Handle selecting an opportunity
  const handleSelectOpportunity = (oppId: string) => {
    setSelectedOpportunityId(oppId);
    if (!oppId) return;

    const opp = allOpportunities.find(o => o.id === oppId);
    if (opp) {
      onTargetRoleChange(opp.title);
      const jdText = `Job Title: ${opp.title} at ${opp.companyName}\nRole Type: ${opp.type}\nLocation: ${opp.location}\nRequired Skills: ${(opp.requiredSkills || []).map(s => `${s.skillName} (${s.proficiency})`).join(', ')}\n\nDescription:\n${opp.roleDescription || opp.description || ''}`;
      onJobDescriptionChange(jdText);
    }
  };

  const handleAddMissingSkillToResume = (skillName: string) => {
    const currentGroups = [...content.skillGroups];
    if (currentGroups.length === 0) {
      currentGroups.push({
        id: `sg-${Date.now()}`,
        category: 'Technical Skills',
        skills: [skillName]
      });
    } else {
      if (!currentGroups[0].skills.includes(skillName)) {
        currentGroups[0].skills.push(skillName);
      }
    }
    onChange({ ...content, skillGroups: currentGroups });
  };

  const toggleSection = (id: string) => {
    setOpenSection(prev => prev === id ? '' : id);
  };

  const ROLE_PRESETS = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Engineer',
    'Software Engineer',
    'Data Scientist',
    'Data Analyst',
    'AI / ML Engineer',
    'DevOps & Cloud Engineer',
    'Cybersecurity Analyst',
    'Mobile Application Developer'
  ];

  const TEMPLATES: { id: ResumeTemplateId; label: string; tag: string; desc: string }[] = [
    { id: 'ats-classic', label: 'ATS Classic', tag: '100% ATS Safe', desc: 'Standard single-column, clean serif typography for corporate parsers.' },
    { id: 'modern-pro', label: 'Modern Pro', tag: 'Popular', desc: 'Executive navy headers with skill badges and clean section hierarchy.' },
    { id: 'minimal', label: 'Minimal', tag: 'Editorial', desc: 'Spacious Swiss layout with subtle dividers and refined hierarchy.' },
    { id: 'developer', label: 'Developer', tag: 'Tech Focus', desc: 'Monospace accents, GitHub links, and structured technical stack badges.' },
  ];

  // Helper updater
  const updatePersonalInfo = (field: keyof typeof content.personalInfo, value: string) => {
    onChange({
      ...content,
      personalInfo: {
        ...content.personalInfo,
        [field]: value,
      },
    });
  };

  const toggleVisibility = (section: keyof typeof content.sectionVisibility) => {
    onChange({
      ...content,
      sectionVisibility: {
        ...content.sectionVisibility,
        [section]: !content.sectionVisibility[section],
      },
    });
  };

  // AI Summary Rewrite
  const handleRewriteSummary = async () => {
    try {
      setIsRewritingSummary(true);
      const res = await AIService.generateResumeContent({
        studentProfile,
        targetRole,
        jobDescription,
      });
      if (res && res.summary) {
        onChange({
          ...content,
          summary: res.summary,
        });
      }
    } catch (err) {
      console.error('Failed to rewrite summary', err);
    } finally {
      setIsRewritingSummary(false);
    }
  };

  // AI Bullet Point Polish
  const triggerImproveBullet = async (section: 'project' | 'exp', itemId: string, bulletIdx: number, bulletText: string, contextTitle: string) => {
    setImprovingBulletIdx({ section, itemId, bulletIdx });
    setIsImprovingBullet(true);
    setAiSuggestions([]);

    try {
      const res = await AIService.improveBulletPoint({
        originalBullet: bulletText,
        role: targetRole,
        context: contextTitle,
      });
      if (res && res.improvedBullets) {
        setAiSuggestions(res.improvedBullets);
      }
    } catch (err) {
      console.error('Failed to improve bullet', err);
    } finally {
      setIsImprovingBullet(false);
    }
  };

  const applyBulletSuggestion = (suggestion: string) => {
    if (!improvingBulletIdx) return;
    const { section, itemId, bulletIdx } = improvingBulletIdx;

    if (section === 'project') {
      const updatedProjects = content.projects.map(p => {
        if (p.id === itemId) {
          const newBullets = [...p.bullets];
          newBullets[bulletIdx] = suggestion;
          return { ...p, bullets: newBullets };
        }
        return p;
      });
      onChange({ ...content, projects: updatedProjects });
    } else {
      const updatedExp = content.experience.map(e => {
        if (e.id === itemId) {
          const newBullets = [...e.bullets];
          newBullets[bulletIdx] = suggestion;
          return { ...e, bullets: newBullets };
        }
        return e;
      });
      onChange({ ...content, experience: updatedExp });
    }

    setImprovingBulletIdx(null);
    setAiSuggestions([]);
  };

  // Sync Skills from Profile
  const syncSkillsFromProfile = () => {
    const skills = studentProfile.skills || [];
    const grouped: { [key: string]: string[] } = {};

    skills.forEach(s => {
      const cat = s.category || 'General Technical';
      if (!grouped[cat]) grouped[cat] = [];
      if (!grouped[cat].includes(s.name)) {
        grouped[cat].push(s.name);
      }
    });

    const newGroups: ResumeSkillCategoryGroup[] = Object.keys(grouped).map((cat, idx) => ({
      id: `sg-sync-${idx + 1}-${Date.now()}`,
      category: cat,
      skills: grouped[cat],
    }));

    onChange({
      ...content,
      skillGroups: newGroups.length > 0 ? newGroups : content.skillGroups,
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Target Role, Type & AI Generator Bar */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-xl p-4.5 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              AI Resume Intelligence & Tailoring
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">Target Opportunity & Alignment</h3>
          </div>
          <button
            onClick={onGenerateWithAI}
            disabled={isGeneratingAI}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            {isGeneratingAI ? 'Generating Resume with Gemini...' : '✨ Generate Resume from Profile'}
          </button>
        </div>

        {/* Target Type Selector Tabs */}
        <div className="pt-2 border-t border-indigo-800/60 flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-200 shrink-0 mr-1">Target Type:</span>
          <div className="flex bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/80 text-xs">
            <button
              onClick={() => setTargetType('internship')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                targetType === 'internship' ? 'bg-indigo-600 text-white shadow-2xs font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Internship
            </button>
            <button
              onClick={() => setTargetType('placement')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                targetType === 'placement' ? 'bg-indigo-600 text-white shadow-2xs font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Placement / Job
            </button>
            <button
              onClick={() => setTargetType('custom')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                targetType === 'custom' ? 'bg-indigo-600 text-white shadow-2xs font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Custom Role
            </button>
          </div>
        </div>

        {/* Opportunity Selector */}
        {(targetType === 'internship' || targetType === 'placement') && (
          <div className="space-y-1.5 bg-slate-800/50 p-3 rounded-lg border border-slate-700/60">
            <label className="block text-xs font-semibold text-indigo-200">
              Select Verified {targetType === 'internship' ? 'Internship' : 'Placement'} Opportunity
            </label>
            <select
              value={selectedOpportunityId}
              onChange={(e) => handleSelectOpportunity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-indigo-400"
            >
              <option value="">-- Choose an open opportunity to auto-tailor ({filteredOpportunities.length} available) --</option>
              {filteredOpportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.title} • {opp.companyName} ({opp.location} - {opp.stipend || opp.salary})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Target Role Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-indigo-200">
            Target Job Title / Career Objective
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={targetRole}
              onChange={(e) => onTargetRoleChange(e.target.value)}
              placeholder="e.g. Full Stack Developer"
              className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-indigo-400 placeholder:text-slate-500"
            />
            <select
              value={targetRole}
              onChange={(e) => onTargetRoleChange(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-indigo-200 focus:outline-hidden"
            >
              <option value="" disabled>Select Preset Role</option>
              {ROLE_PRESETS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Opportunity Comparison Matrix (Deterministic Skill Match) */}
        {selectedOpp && opportunityMatch && (
          <div className="bg-indigo-950/70 border border-indigo-700/60 rounded-xl p-3.5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-indigo-800/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                  {selectedOpp.companyName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{selectedOpp.title}</h4>
                  <p className="text-[11px] text-indigo-300">{selectedOpp.companyName} • {selectedOpp.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-indigo-300">Deterministic Match</span>
                  <div className={`text-base font-black ${
                    opportunityMatch.scorePercentage >= 75 ? 'text-emerald-400' :
                    opportunityMatch.scorePercentage >= 50 ? 'text-indigo-300' : 'text-amber-400'
                  }`}>
                    {opportunityMatch.scorePercentage}%
                  </div>
                </div>
                <button
                  onClick={onOptimizeJob}
                  disabled={isOptimizingJob}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isOptimizingJob ? 'Optimizing...' : 'Tailor Resume'}
                </button>
              </div>
            </div>

            {/* Matched Skills */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Matching Skills in Profile ({opportunityMatch.matchedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {opportunityMatch.matchedSkills.length > 0 ? (
                  opportunityMatch.matchedSkills.map((m, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-600/50 text-[11px] text-emerald-200 font-medium">
                      ✓ {m.name} ({m.studentProficiency})
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-400 italic">No direct required skill matches found.</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            {opportunityMatch.missingSkills.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1 mb-1">
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  Missing Required Skills ({opportunityMatch.missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {opportunityMatch.missingSkills.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddMissingSkillToResume(m.name)}
                      title="Click to add to resume skills"
                      className="px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-600/50 text-[11px] text-amber-200 font-medium hover:bg-amber-900 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      + {m.name} <span className="text-[9px] text-amber-400 font-normal">({m.requiredProficiency})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Job Description Drawer */}
        <div>
          <details className="group" open={!selectedOpp}>
            <summary className="cursor-pointer text-xs font-semibold text-indigo-300 hover:text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Target Job Description (for ATS Keyword & Content Optimization)
              </span>
              <span className="text-[11px] text-indigo-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2.5 space-y-2">
              <textarea
                value={jobDescription}
                onChange={(e) => onJobDescriptionChange(e.target.value)}
                placeholder="Paste the full job description or requirements here to auto-tune keywords and audit ATS score..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-400"
              />
              <div className="flex justify-end">
                <button
                  onClick={onOptimizeJob}
                  disabled={!jobDescription.trim() || isOptimizingJob}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isOptimizingJob ? 'Optimizing with Gemini...' : '✨ Optimize Resume for this Job'}
                </button>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* 2. Template Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Resume Design Template
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TEMPLATES.map((t) => {
            const isSelected = selectedTemplate === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onTemplateChange(t.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{t.label}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {t.tag}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Section Accordions */}
      <div className="space-y-2.5">
        {/* Accordion: Personal Info */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <button
            onClick={() => toggleSection('personal')}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100/80 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900">Personal Information & Links</span>
            </div>
            {openSection === 'personal' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {openSection === 'personal' && (
            <div className="p-4 space-y-3 border-t border-slate-200 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={content.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={content.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={content.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / City</label>
                  <input
                    type="text"
                    value={content.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={content.personalInfo.linkedinUrl || ''}
                    onChange={(e) => updatePersonalInfo('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={content.personalInfo.githubUrl || ''}
                    onChange={(e) => updatePersonalInfo('githubUrl', e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Portfolio / Personal Website</label>
                  <input
                    type="text"
                    value={content.personalInfo.portfolioUrl || ''}
                    onChange={(e) => updatePersonalInfo('portfolioUrl', e.target.value)}
                    placeholder="https://yourportfolio.dev"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion: Professional Summary */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <button
              onClick={() => toggleSection('summary')}
              className="flex items-center gap-2 text-left flex-1"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900">Professional Summary</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleVisibility('summary')}
                className="p-1 text-slate-400 hover:text-slate-600"
                title="Toggle Visibility"
              >
                {content.sectionVisibility.summary ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>
              <button onClick={() => toggleSection('summary')}>
                {openSection === 'summary' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>
          {openSection === 'summary' && (
            <div className="p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Role-Tailored Summary (2-3 Sentences)</span>
                <button
                  onClick={handleRewriteSummary}
                  disabled={isRewritingSummary}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isRewritingSummary ? 'animate-spin' : ''}`} />
                  {isRewritingSummary ? 'AI Rewriting...' : 'AI Rewrite for Role'}
                </button>
              </div>
              <textarea
                value={content.summary}
                onChange={(e) => onChange({ ...content, summary: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-800"
              />
            </div>
          )}
        </div>

        {/* Accordion: Technical Skills */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <button
              onClick={() => toggleSection('skills')}
              className="flex items-center gap-2 text-left flex-1"
            >
              <Code className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900">Technical Skills & Categories</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleVisibility('skills')}
                className="p-1 text-slate-400 hover:text-slate-600"
                title="Toggle Visibility"
              >
                {content.sectionVisibility.skills ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>
              <button onClick={() => toggleSection('skills')}>
                {openSection === 'skills' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>
          {openSection === 'skills' && (
            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-slate-500">Group skills logically for ATS parsers</span>
                <button
                  onClick={syncSkillsFromProfile}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Sync Verified Profile Skills
                </button>
              </div>

              {content.skillGroups.map((group, gIdx) => (
                <div key={group.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={group.category}
                      onChange={(e) => {
                        const updated = [...content.skillGroups];
                        updated[gIdx].category = e.target.value;
                        onChange({ ...content, skillGroups: updated });
                      }}
                      className="font-bold text-slate-900 bg-transparent border-b border-slate-300 focus:outline-hidden focus:border-indigo-500 px-1 py-0.5"
                    />
                    <button
                      onClick={() => {
                        const updated = content.skillGroups.filter((_, idx) => idx !== gIdx);
                        onChange({ ...content, skillGroups: updated });
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Skill Chips */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {group.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-800"
                      >
                        {skill}
                        <button
                          onClick={() => {
                            const updated = [...content.skillGroups];
                            updated[gIdx].skills = updated[gIdx].skills.filter((_, idx) => idx !== sIdx);
                            onChange({ ...content, skillGroups: updated });
                          }}
                          className="text-slate-400 hover:text-rose-500 ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="+ Add skill (Press Enter)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (!group.skills.includes(val)) {
                            const updated = [...content.skillGroups];
                            updated[gIdx].skills.push(val);
                            onChange({ ...content, skillGroups: updated });
                          }
                          e.currentTarget.value = '';
                        }
                      }}
                      className="px-2 py-0.5 text-[11px] bg-white border border-dashed border-slate-300 rounded focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  const newGroup: ResumeSkillCategoryGroup = {
                    id: `sg-${Date.now()}`,
                    category: 'New Category',
                    skills: [],
                  };
                  onChange({
                    ...content,
                    skillGroups: [...content.skillGroups, newGroup],
                  });
                }}
                className="w-full py-1.5 border border-dashed border-slate-300 hover:border-indigo-500 rounded-lg text-slate-600 hover:text-indigo-600 font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill Category Group
              </button>
            </div>
          )}
        </div>

        {/* Accordion: Technical Projects */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <button
              onClick={() => toggleSection('projects')}
              className="flex items-center gap-2 text-left flex-1"
            >
              <FolderGit2 className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900">
                Technical Projects ({content.projects.length})
              </span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleVisibility('projects')}
                className="p-1 text-slate-400 hover:text-slate-600"
                title="Toggle Visibility"
              >
                {content.sectionVisibility.projects ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>
              <button onClick={() => toggleSection('projects')}>
                {openSection === 'projects' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>
          {openSection === 'projects' && (
            <div className="p-4 space-y-4 text-xs">
              {content.projects.map((proj, pIdx) => (
                <div key={proj.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...content.projects];
                        updated[pIdx].title = e.target.value;
                        onChange({ ...content, projects: updated });
                      }}
                      placeholder="Project Title"
                      className="font-bold text-slate-900 bg-transparent border-b border-slate-300 focus:outline-hidden focus:border-indigo-500 px-1 py-0.5 text-xs flex-1"
                    />
                    <button
                      onClick={() => {
                        const updated = content.projects.filter((_, idx) => idx !== pIdx);
                        onChange({ ...content, projects: updated });
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Technologies (comma separated)</label>
                      <input
                        type="text"
                        value={proj.technologies.join(', ')}
                        onChange={(e) => {
                          const updated = [...content.projects];
                          updated[pIdx].technologies = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                          onChange({ ...content, projects: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">GitHub URL</label>
                      <input
                        type="text"
                        value={proj.githubUrl || ''}
                        onChange={(e) => {
                          const updated = [...content.projects];
                          updated[pIdx].githubUrl = e.target.value;
                          onChange({ ...content, projects: updated });
                        }}
                        placeholder="https://github.com/..."
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Live Demo URL</label>
                      <input
                        type="text"
                        value={proj.liveUrl || ''}
                        onChange={(e) => {
                          const updated = [...content.projects];
                          updated[pIdx].liveUrl = e.target.value;
                          onChange({ ...content, projects: updated });
                        }}
                        placeholder="https://demo.app"
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  {/* Bullet Points with AI Polish */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700">
                      <span>Bullet Points (Action Verb + Tech + Impact)</span>
                      <button
                        onClick={() => {
                          const updated = [...content.projects];
                          updated[pIdx].bullets.push('Engineered modular component architecture and responsive user workflows.');
                          onChange({ ...content, projects: updated });
                        }}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    {proj.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="space-y-1">
                        <div className="flex items-start gap-1.5">
                          <textarea
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...content.projects];
                              updated[pIdx].bullets[bIdx] = e.target.value;
                              onChange({ ...content, projects: updated });
                            }}
                            rows={2}
                            className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => triggerImproveBullet('project', proj.id, bIdx, bullet, proj.title)}
                              title="Improve with AI"
                              className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded border border-indigo-200 transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                const updated = [...content.projects];
                                updated[pIdx].bullets = updated[pIdx].bullets.filter((_, idx) => idx !== bIdx);
                                onChange({ ...content, projects: updated });
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* AI Suggestions Dropdown for this bullet */}
                        {improvingBulletIdx?.section === 'project' &&
                          improvingBulletIdx.itemId === proj.id &&
                          improvingBulletIdx.bulletIdx === bIdx && (
                            <div className="p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-lg space-y-2 mt-1 animate-in fade-in">
                              <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900">
                                <span className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-indigo-600" />
                                  AI Suggested Improvements:
                                </span>
                                <button
                                  onClick={() => setImprovingBulletIdx(null)}
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  ✕
                                </button>
                              </div>

                              {isImprovingBullet ? (
                                <div className="text-[11px] text-indigo-600 py-1 flex items-center gap-1.5">
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  Crafting high-impact action bullets with Gemini...
                                </div>
                              ) : (
                                <div className="space-y-1.5">
                                  {aiSuggestions.map((sug, sIdx) => (
                                    <div
                                      key={sIdx}
                                      onClick={() => applyBulletSuggestion(sug)}
                                      className="p-2 bg-white hover:bg-indigo-100/80 border border-indigo-100 rounded text-xs text-slate-800 cursor-pointer transition-colors"
                                    >
                                      <p className="leading-snug">{sug}</p>
                                      <span className="text-[10px] font-semibold text-indigo-600 mt-1 inline-block">
                                        Click to Apply ↵
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  const newProj: ResumeProjectItem = {
                    id: `proj-${Date.now()}`,
                    title: 'New Technical Project',
                    technologies: ['React', 'TypeScript'],
                    bullets: ['Architected and implemented project core features using modern design patterns.'],
                  };
                  onChange({ ...content, projects: [...content.projects, newProj] });
                }}
                className="w-full py-1.5 border border-dashed border-slate-300 hover:border-indigo-500 rounded-lg text-slate-600 hover:text-indigo-600 font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Technical Project
              </button>
            </div>
          )}
        </div>

        {/* Accordion: Experience / Internships */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <button
              onClick={() => toggleSection('experience')}
              className="flex items-center gap-2 text-left flex-1"
            >
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900">
                Work & Internships ({content.experience.length})
              </span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleVisibility('experience')}
                className="p-1 text-slate-400 hover:text-slate-600"
                title="Toggle Visibility"
              >
                {content.sectionVisibility.experience ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>
              <button onClick={() => toggleSection('experience')}>
                {openSection === 'experience' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>
          {openSection === 'experience' && (
            <div className="p-4 space-y-4 text-xs">
              {content.experience.map((exp, eIdx) => (
                <div key={exp.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...content.experience];
                        updated[eIdx].role = e.target.value;
                        onChange({ ...content, experience: updated });
                      }}
                      placeholder="Role (e.g. Software Engineering Intern)"
                      className="font-bold text-slate-900 bg-transparent border-b border-slate-300 focus:outline-hidden focus:border-indigo-500 px-1 py-0.5 text-xs flex-1"
                    />
                    <button
                      onClick={() => {
                        const updated = content.experience.filter((_, idx) => idx !== eIdx);
                        onChange({ ...content, experience: updated });
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Organization / Company</label>
                      <input
                        type="text"
                        value={exp.organization}
                        onChange={(e) => {
                          const updated = [...content.experience];
                          updated[eIdx].organization = e.target.value;
                          onChange({ ...content, experience: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Duration</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => {
                          const updated = [...content.experience];
                          updated[eIdx].duration = e.target.value;
                          onChange({ ...content, experience: updated });
                        }}
                        placeholder="May 2025 - July 2025"
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  {/* Experience bullets with AI Polish */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700">
                      <span>Responsibility Bullets</span>
                      <button
                        onClick={() => {
                          const updated = [...content.experience];
                          updated[eIdx].bullets.push('Collaborated with engineering team to implement features and optimize database queries.');
                          onChange({ ...content, experience: updated });
                        }}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    {exp.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="space-y-1">
                        <div className="flex items-start gap-1.5">
                          <textarea
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...content.experience];
                              updated[eIdx].bullets[bIdx] = e.target.value;
                              onChange({ ...content, experience: updated });
                            }}
                            rows={2}
                            className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => triggerImproveBullet('exp', exp.id, bIdx, bullet, `${exp.role} at ${exp.organization}`)}
                              title="Improve with AI"
                              className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded border border-indigo-200 transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                const updated = [...content.experience];
                                updated[eIdx].bullets = updated[eIdx].bullets.filter((_, idx) => idx !== bIdx);
                                onChange({ ...content, experience: updated });
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {improvingBulletIdx?.section === 'exp' &&
                          improvingBulletIdx.itemId === exp.id &&
                          improvingBulletIdx.bulletIdx === bIdx && (
                            <div className="p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-lg space-y-2 mt-1 animate-in fade-in">
                              <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900">
                                <span className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-indigo-600" />
                                  AI Suggested Variations:
                                </span>
                                <button
                                  onClick={() => setImprovingBulletIdx(null)}
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  ✕
                                </button>
                              </div>

                              {isImprovingBullet ? (
                                <div className="text-[11px] text-indigo-600 py-1 flex items-center gap-1.5">
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  Polishing with Gemini...
                                </div>
                              ) : (
                                <div className="space-y-1.5">
                                  {aiSuggestions.map((sug, sIdx) => (
                                    <div
                                      key={sIdx}
                                      onClick={() => applyBulletSuggestion(sug)}
                                      className="p-2 bg-white hover:bg-indigo-100/80 border border-indigo-100 rounded text-xs text-slate-800 cursor-pointer transition-colors"
                                    >
                                      <p className="leading-snug">{sug}</p>
                                      <span className="text-[10px] font-semibold text-indigo-600 mt-1 inline-block">
                                        Click to Apply ↵
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  const newExp: ResumeExperienceItem = {
                    id: `exp-${Date.now()}`,
                    role: 'Software Development Intern',
                    organization: 'Tech Solutions Labs',
                    duration: 'June 2025 - August 2025',
                    bullets: ['Contributed to core product features and API integration workflows.'],
                  };
                  onChange({ ...content, experience: [...content.experience, newExp] });
                }}
                className="w-full py-1.5 border border-dashed border-slate-300 hover:border-indigo-500 rounded-lg text-slate-600 hover:text-indigo-600 font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Experience / Internship
              </button>
            </div>
          )}
        </div>

        {/* Accordion: Education */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <button
              onClick={() => toggleSection('education')}
              className="flex items-center gap-2 text-left flex-1"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900">Education Details</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleVisibility('education')}
                className="p-1 text-slate-400 hover:text-slate-600"
                title="Toggle Visibility"
              >
                {content.sectionVisibility.education ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </button>
              <button onClick={() => toggleSection('education')}>
                {openSection === 'education' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>
          {openSection === 'education' && (
            <div className="p-4 space-y-3 text-xs">
              {content.education.map((edu, eduIdx) => (
                <div key={edu.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Institution / College</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...content.education];
                          updated[eduIdx].institution = e.target.value;
                          onChange({ ...content, education: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...content.education];
                          updated[eduIdx].degree = e.target.value;
                          onChange({ ...content, education: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Field of Study / Branch</label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => {
                          const updated = [...content.education];
                          updated[eduIdx].fieldOfStudy = e.target.value;
                          onChange({ ...content, education: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Graduation Period (e.g. 2022 – 2026)</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={edu.startYear}
                          onChange={(e) => {
                            const updated = [...content.education];
                            updated[eduIdx].startYear = e.target.value;
                            onChange({ ...content, education: updated });
                          }}
                          className="w-1/2 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                        />
                        <span>–</span>
                        <input
                          type="text"
                          value={edu.endYear}
                          onChange={(e) => {
                            const updated = [...content.education];
                            updated[eduIdx].endYear = e.target.value;
                            onChange({ ...content, education: updated });
                          }}
                          className="w-1/2 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">CGPA / Percentage</label>
                      <input
                        type="text"
                        value={edu.grade}
                        onChange={(e) => {
                          const updated = [...content.education];
                          updated[eduIdx].grade = e.target.value;
                          onChange({ ...content, education: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accordion: Certifications & Honors */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <button
              onClick={() => toggleSection('certs')}
              className="flex items-center gap-2 text-left flex-1"
            >
              <Award className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900">
                Certifications & Achievements
              </span>
            </button>
            <button onClick={() => toggleSection('certs')}>
              {openSection === 'certs' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
          {openSection === 'certs' && (
            <div className="p-4 space-y-4 text-xs">
              {/* Certifications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Certifications</span>
                  <button
                    onClick={() => {
                      const newCert: ResumeCertificationItem = {
                        id: `cert-${Date.now()}`,
                        title: 'New Certification',
                        issuer: 'Issuing Body',
                        issueDate: '2025',
                      };
                      onChange({ ...content, certifications: [...content.certifications, newCert] });
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Add Cert
                  </button>
                </div>
                <div className="space-y-2">
                  {content.certifications.map((c, cIdx) => (
                    <div key={c.id} className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) => {
                          const updated = [...content.certifications];
                          updated[cIdx].title = e.target.value;
                          onChange({ ...content, certifications: updated });
                        }}
                        placeholder="Cert Title"
                        className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={c.issuer}
                        onChange={(e) => {
                          const updated = [...content.certifications];
                          updated[cIdx].issuer = e.target.value;
                          onChange({ ...content, certifications: updated });
                        }}
                        placeholder="Issuer (e.g. AWS)"
                        className="w-28 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                      <button
                        onClick={() => {
                          const updated = content.certifications.filter((_, idx) => idx !== cIdx);
                          onChange({ ...content, certifications: updated });
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Honors & Achievements</span>
                  <button
                    onClick={() => {
                      const newAch: ResumeAchievementItem = {
                        id: `ach-${Date.now()}`,
                        title: 'Academic / Competition Honor',
                        description: 'Details of recognition or rank',
                        year: '2025',
                      };
                      onChange({ ...content, achievements: [...content.achievements, newAch] });
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Add Achievement
                  </button>
                </div>
                <div className="space-y-2">
                  {content.achievements.map((a, aIdx) => (
                    <div key={a.id} className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                      <input
                        type="text"
                        value={a.title}
                        onChange={(e) => {
                          const updated = [...content.achievements];
                          updated[aIdx].title = e.target.value;
                          onChange({ ...content, achievements: updated });
                        }}
                        placeholder="Title"
                        className="w-1/3 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={a.description}
                        onChange={(e) => {
                          const updated = [...content.achievements];
                          updated[aIdx].description = e.target.value;
                          onChange({ ...content, achievements: updated });
                        }}
                        placeholder="Description"
                        className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                      <button
                        onClick={() => {
                          const updated = content.achievements.filter((_, idx) => idx !== aIdx);
                          onChange({ ...content, achievements: updated });
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
