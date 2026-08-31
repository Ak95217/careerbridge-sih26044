import React from 'react';
import { StudentProfile, Opportunity, SkillMatchResult } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { calculateSkillMatch } from '../../services/skillMatching';
import { 
  GraduationCap, 
  MapPin, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Globe, 
  FileText, 
  CheckCircle2, 
  Award, 
  Calendar,
  ExternalLink,
  Target,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface CandidateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: StudentProfile | null;
  targetOpportunity?: Opportunity | null;
  onScheduleInterview?: (candidate: StudentProfile) => void;
  onShortlist?: (candidate: StudentProfile) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  isOpen,
  onClose,
  candidate,
  targetOpportunity,
  onScheduleInterview,
  onShortlist
}) => {
  if (!candidate) return null;

  // Calculate deterministic match against target opportunity if provided
  let matchResult: SkillMatchResult | null = null;
  if (targetOpportunity && targetOpportunity.requiredSkills) {
    matchResult = calculateSkillMatch(candidate.skills || [], targetOpportunity.requiredSkills);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={candidate.fullName}
      description={`${candidate.degree} • ${candidate.collegeName}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Candidate Profile Header Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={candidate.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900">{candidate.fullName}</h3>
                <Badge variant="primary">Batch {candidate.graduationYear || 2026}</Badge>
                <Badge variant="emerald">CGPA {candidate.cgpa}</Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>{candidate.branch} • {candidate.collegeName}</span>
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                {candidate.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {candidate.location}
                  </span>
                )}
                {candidate.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {candidate.email}
                  </span>
                )}
                {candidate.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {candidate.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {onShortlist && (
              <Button
                size="sm"
                variant="outline"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => onShortlist(candidate)}
              >
                Shortlist
              </Button>
            )}
            {onScheduleInterview && (
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Calendar className="w-4 h-4" />}
                onClick={() => onScheduleInterview(candidate)}
              >
                Schedule Interview
              </Button>
            )}
          </div>
        </div>

        {/* Deterministic Match Analysis if Opportunity Selected */}
        {targetOpportunity && matchResult && (
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Role Qualification Analysis for: {targetOpportunity.title}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Deterministic Match:</span>
                <span className={`text-sm font-black px-2.5 py-1 rounded-lg ${
                  matchResult.scorePercentage >= 80 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : matchResult.scorePercentage >= 60 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {matchResult.scorePercentage}%
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-indigo-100/50">
              {matchResult.explanation}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3.5 rounded-xl border border-indigo-100">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Directly Matched Skills ({matchResult.matchedSkills.length})
                </span>
                {matchResult.matchedSkills.length === 0 ? (
                  <p className="text-[11px] text-slate-400">No exact prerequisite match found.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.matchedSkills.map((s, i) => (
                      <span key={i} className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
                        {s.name} • {s.studentProficiency}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-indigo-100">
                <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Prerequisite Skill Gaps ({matchResult.missingSkills.length + matchResult.improvementSkills.length})
                </span>
                {matchResult.missingSkills.length === 0 && matchResult.improvementSkills.length === 0 ? (
                  <p className="text-[11px] text-emerald-600 font-medium">All prerequisite competencies satisfied!</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.missingSkills.map((s, i) => (
                      <span key={i} className="text-[11px] bg-rose-50 text-rose-800 px-2 py-0.5 rounded-md border border-rose-200 font-medium">
                        Missing: {s.name} ({s.requiredProficiency})
                      </span>
                    ))}
                    {matchResult.improvementSkills.map((s, i) => (
                      <span key={i} className="text-[11px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200 font-medium">
                        {s.name} ({s.studentProficiency} → {s.requiredProficiency})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bio */}
        {candidate.bio && (
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">About Candidate</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
              {candidate.bio}
            </p>
          </div>
        )}

        {/* Skills Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Candidate Skills & Verifications</h4>
            <span className="text-[11px] text-slate-500">
              {candidate.skills?.filter(s => s.verified).length || 0} AICTE Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {candidate.skills?.map((skill) => (
              <div
                key={skill.id || skill.name}
                className={`p-3 rounded-xl border ${
                  skill.verified 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{skill.name}</span>
                  {skill.verified ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      {skill.verifiedScore}% Verified
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      Self-rated
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span>{skill.category}</span>
                  <span className="font-semibold text-slate-700">{skill.proficiency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        {candidate.projects && candidate.projects.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Technical Projects</h4>
            <div className="space-y-3">
              {candidate.projects.map((proj) => (
                <div key={proj.id || proj.title} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900">{proj.title}</h5>
                    <div className="flex items-center gap-2">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        >
                          <Github className="w-3.5 h-3.5" />
                          Code
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.technologies?.map((tech, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {candidate.certifications && candidate.certifications.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Certifications</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {candidate.certifications.map((cert) => (
                <div key={cert.id || cert.title} className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-slate-900">{cert.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cert.issuer} • Issued {cert.issueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resume and External Links */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {candidate.githubUrl && (
              <a href={candidate.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {candidate.linkedinUrl && (
              <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
            {candidate.portfolioUrl && (
              <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Portfolio
              </a>
            )}
          </div>

          {candidate.resumeFileName && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                {candidate.resumeFileName}
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
