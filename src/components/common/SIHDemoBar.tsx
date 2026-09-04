import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Layers, 
  X, 
  Play, 
  UserCheck,
  TrendingUp,
  Brain,
  FileText,
  BarChart3,
  Award,
  Briefcase
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

interface SIHDemoBarProps {
  onNavigateTab: (tabId: string) => void;
}

interface DemoStep {
  id: number;
  title: string;
  role: UserRole;
  tabId: string;
  desc: string;
  badge: string;
}

const SIH_DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    title: 'Student Dashboard & Transcripts',
    role: 'student',
    tabId: 'dashboard',
    desc: 'NSQF-standardized skill transcribing & verified scores',
    badge: 'Student'
  },
  {
    id: 2,
    title: 'AI Resume Analyzer',
    role: 'student',
    tabId: 'dashboard',
    desc: 'PDF resume upload, Gemini parsing & scoring',
    badge: 'AI Core'
  },
  {
    id: 3,
    title: 'AI Resume Builder (ATS)',
    role: 'student',
    tabId: 'resume-builder',
    desc: 'Interactive live-preview builder with tailoring',
    badge: 'ATS Engine'
  },
  {
    id: 4,
    title: 'Deterministic Skill Gap Engine',
    role: 'student',
    tabId: 'skill-gap',
    desc: 'Target career role vs missing competencies',
    badge: 'Gap Matrix'
  },
  {
    id: 5,
    title: 'AI Career Intelligence Hub',
    role: 'student',
    tabId: 'ai-career',
    desc: 'Gemini adaptive career roadmap generator',
    badge: 'Gemini 2.5'
  },
  {
    id: 6,
    title: 'Deterministic Internship Discovery',
    role: 'student',
    tabId: 'internships',
    desc: 'Weighted skill matching fit scores & application',
    badge: 'Matching'
  },
  {
    id: 7,
    title: 'Recruiter Candidate Pipeline',
    role: 'company',
    tabId: 'applications',
    desc: 'Candidate ranking, review, shortlisting & interview scheduling',
    badge: 'Recruiter'
  },
  {
    id: 8,
    title: 'Industry Skill Demand Matrix',
    role: 'company',
    tabId: 'skill-demand',
    desc: 'Employer demand frequency vs student supply health',
    badge: 'Talent Demand'
  },
  {
    id: 9,
    title: 'Faculty Institutional Analytics',
    role: 'faculty',
    tabId: 'skill-analytics',
    desc: 'Curriculum deficit identification & branch benchmarks',
    badge: 'Academia'
  },
  {
    id: 10,
    title: 'Verified Skill Assessment Bank',
    role: 'faculty',
    tabId: 'assessments',
    desc: 'Custom faculty test creation & student attempt logs',
    badge: 'Assessment'
  },
  {
    id: 11,
    title: 'Industry Mentor Roadmap Progression',
    role: 'mentor',
    tabId: 'progress',
    desc: 'Mentee actionable growth insights & goal tracking',
    badge: 'Mentorship'
  },
  {
    id: 12,
    title: 'National Platform Intelligence',
    role: 'admin',
    tabId: 'analytics',
    desc: 'AICTE platform-wide analytics & recruitment funnel',
    badge: 'National Admin'
  },
  {
    id: 13,
    title: 'Security, RLS & System Governance',
    role: 'admin',
    tabId: 'settings',
    desc: 'Server proxy audit & anti-duplicate notification logs',
    badge: 'Security Audit'
  }
];

export const SIHDemoBar: React.FC<SIHDemoBarProps> = ({ onNavigateTab }) => {
  const { role, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const handleExecuteStep = (step: DemoStep, idx: number) => {
    setCurrentStepIdx(idx);
    if (role !== step.role) {
      switchRole(step.role);
    }
    setTimeout(() => {
      onNavigateTab(step.tabId);
    }, 50);
  };

  const handleNext = () => {
    const nextIdx = (currentStepIdx + 1) % SIH_DEMO_STEPS.length;
    handleExecuteStep(SIH_DEMO_STEPS[nextIdx], nextIdx);
  };

  const currentStep = SIH_DEMO_STEPS[currentStepIdx];

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg hover:bg-slate-800 transition-all border border-slate-700"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>SIH Evaluation Guide (13 Steps)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-indigo-600/30 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-bold">SIH Jury Demo Guide:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">
              Step {currentStep.id}/{SIH_DEMO_STEPS.length}:
            </span>
            <span className="text-white font-semibold">{currentStep.title}</span>
            <Badge variant="primary" size="sm">{currentStep.badge}</Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <p className="text-[11px] text-slate-400 hidden xl:inline-block">
            {currentStep.desc}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-colors"
            >
              <span>Next Demo Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-md transition-colors"
              title="Minimize Showcase Guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
