import React, { useState } from 'react';
import { Opportunity, StudentProfile, SkillMatchResult } from '../../types';
import { calculateSkillMatch } from '../../services/skillMatching';
import { StorageService } from '../../services/storage';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge, ProficiencyBadge } from '../common/Badge';
import { OpportunityMatchExplainerModal } from '../ai/OpportunityMatchExplainerModal';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Clock, 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Send, 
  Check, 
  ExternalLink,
  Sparkles,
  Users,
  Brain
} from 'lucide-react';

interface OpportunityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  student: StudentProfile;
  onApplicationSubmitted?: () => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  student,
  onApplicationSubmitted
}) => {
  const { addToast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  if (!opportunity) return null;

  const matchResult: SkillMatchResult = calculateSkillMatch(
    student.skills || [],
    opportunity.requiredSkills || []
  );

  const isAlreadyApplied = StorageService.hasStudentApplied(student.id, opportunity.id);

  // Eligibility Checks
  const meetsCgpa = !opportunity.minCgpa || (student.cgpa >= opportunity.minCgpa);
  const isEligible = meetsCgpa;

  const handleApply = () => {
    if (isAlreadyApplied) {
      addToast('error', 'Already Applied', 'You have already submitted an application for this opportunity.');
      return;
    }

    if (!meetsCgpa) {
      addToast('warning', 'Eligibility Criteria', `This position requires a minimum CGPA of ${opportunity.minCgpa}. Your current CGPA is ${student.cgpa}.`);
    }

    setIsApplying(true);

    setTimeout(() => {
      const newApp = {
        id: `app-${Date.now()}`,
        opportunityId: opportunity.id,
        studentId: student.id,
        studentName: student.fullName,
        studentEmail: student.email,
        studentCollege: student.collegeName,
        studentCgpa: student.cgpa,
        studentSkills: student.skills.map(s => ({ name: s.name, proficiency: s.proficiency })),
        opportunityTitle: opportunity.title,
        companyName: opportunity.companyName,
        appliedAt: new Date().toISOString(),
        status: 'Applied' as const,
        skillMatchScore: matchResult.scorePercentage,
        matchingSkills: matchResult.matchedSkills.map(s => `${s.name} (${s.studentProficiency})`),
        missingSkills: matchResult.missingSkills.map(s => `${s.name} (Requires: ${s.requiredProficiency})`),
        resumeUrl: student.resumeUrl,
        notes: `Auto-submitted via SIH Portal with verified ${matchResult.scorePercentage}% skill match score.`
      };

      const res = StorageService.addApplication(newApp);
      setIsApplying(false);

      if (res.success) {
        addToast('success', 'Application Submitted!', `Your application for ${opportunity.title} at ${opportunity.companyName} was submitted successfully.`);
        if (onApplicationSubmitted) {
          onApplicationSubmitted();
        }
        onClose();
      } else {
        addToast('error', 'Submission Failed', res.message);
      }
    }, 600);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    if (score >= 40) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
    >
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-xs">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={opportunity.type === 'Internship' ? 'purple' : 'primary'}>
                  {opportunity.type}
                </Badge>
                <Badge variant="neutral">{opportunity.workMode}</Badge>
                {isAlreadyApplied && (
                  <Badge variant="success">Already Applied</Badge>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{opportunity.title}</h2>
              <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{opportunity.companyName}</span>
              </p>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className={`p-3 rounded-2xl border text-center shrink-0 ${getScoreColor(matchResult.scorePercentage)}`}>
            <div className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skill Match</span>
            </div>
            <div className="text-2xl font-black mt-0.5">
              {matchResult.scorePercentage}%
            </div>
            <p className="text-[10px] font-medium">
              {matchResult.matchedCount} of {matchResult.totalRequired} Skills Met
            </p>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] font-medium">Location</span>
              <span className="font-semibold text-slate-800">{opportunity.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] font-medium">
                {opportunity.type === 'Internship' ? 'Stipend' : 'CTC Package'}
              </span>
              <span className="font-semibold text-emerald-700">{opportunity.stipendOrSalary}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] font-medium">Duration / Type</span>
              <span className="font-semibold text-slate-800">{opportunity.duration || 'Full-Time'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] font-medium">Apply Before</span>
              <span className="font-semibold text-slate-800">{opportunity.applicationDeadline}</span>
            </div>
          </div>
        </div>

        {/* Skill Match Breakdown Box */}
        <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Automated Skill-Gap Match Breakdown
            </h4>
            <span className="text-xs font-bold text-indigo-600">
              {matchResult.scorePercentage}% Fit
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            {matchResult.explanation}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {/* Matching */}
            <div className="bg-white p-3 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Matching Skills ({matchResult.matchedSkills.length})</span>
              </div>
              {matchResult.matchedSkills.length === 0 ? (
                <p className="text-[11px] text-slate-400">None mapped yet</p>
              ) : (
                <div className="space-y-1">
                  {matchResult.matchedSkills.map((sk) => (
                    <div key={sk.name} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-700 font-medium">{sk.name}</span>
                      <span className="text-emerald-700 font-semibold">{sk.studentProficiency}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Improvement */}
            <div className="bg-white p-3 rounded-lg border border-amber-200">
              <div className="flex items-center gap-1 text-amber-700 font-bold text-xs mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Needs Improvement ({matchResult.improvementSkills.length})</span>
              </div>
              {matchResult.improvementSkills.length === 0 ? (
                <p className="text-[11px] text-slate-400">No skill gaps in mapped skills</p>
              ) : (
                <div className="space-y-1">
                  {matchResult.improvementSkills.map((sk) => (
                    <div key={sk.name} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-700 font-medium">{sk.name}</span>
                      <span className="text-amber-700 font-semibold">{sk.studentProficiency} → {sk.requiredProficiency}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Missing */}
            <div className="bg-white p-3 rounded-lg border border-rose-200">
              <div className="flex items-center gap-1 text-rose-700 font-bold text-xs mb-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>Missing Skills ({matchResult.missingSkills.length})</span>
              </div>
              {matchResult.missingSkills.length === 0 ? (
                <p className="text-[11px] text-slate-400">No missing required skills</p>
              ) : (
                <div className="space-y-1">
                  {matchResult.missingSkills.map((sk) => (
                    <div key={sk.name} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-700 font-medium">{sk.name}</span>
                      <span className="text-rose-600 font-semibold">Requires {sk.requiredProficiency}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={() => setIsExplainerOpen(true)}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-indigo-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Explain Why I'm A Good Fit (AI Intelligence Summary)</span>
            </button>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Role Overview</h4>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            {opportunity.description}
          </p>
        </div>

        {/* Responsibilities */}
        {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Key Responsibilities</h4>
            <ul className="space-y-1.5">
              {opportunity.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Eligibility & Prerequisite Check */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Eligibility Criteria</h4>
          <p className="text-slate-600">{opportunity.eligibility}</p>
          <div className="flex items-center gap-4 pt-1 text-slate-700">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              Min CGPA: <strong className="ml-1">{opportunity.minCgpa || 'Not Specified'}</strong>
            </span>
            <span className="flex items-center gap-1">
              Your CGPA: 
              <strong className={`ml-1 ${meetsCgpa ? 'text-emerald-700' : 'text-rose-600'}`}>
                {student.cgpa} {meetsCgpa ? '(Eligible)' : '(Below Threshold)'}
              </strong>
            </span>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{opportunity.applicantCount} candidates applied • {opportunity.openings} open positions</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>

            {isAlreadyApplied ? (
              <Button variant="outline" size="sm" disabled leftIcon={<Check className="w-4 h-4 text-emerald-600" />}>
                Application Submitted
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                isLoading={isApplying}
                onClick={handleApply}
                leftIcon={<Send className="w-4 h-4" />}
              >
                1-Click Apply Now
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* AI Match Explainer Modal */}
      <OpportunityMatchExplainerModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
        opportunity={opportunity}
        student={student}
        matchResult={matchResult}
      />
    </Modal>
  );
};
