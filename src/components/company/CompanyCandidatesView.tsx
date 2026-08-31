import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile, Opportunity, CompanyProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { calculateSkillMatch } from '../../services/skillMatching';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Input, Select } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CandidateDetailModal } from './CandidateDetailModal';
import { useToast } from '../../context/ToastContext';
import { 
  Users, 
  Search, 
  Filter, 
  Sparkles, 
  GraduationCap, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Award, 
  ChevronRight, 
  Building2,
  Briefcase,
  Target
} from 'lucide-react';

interface CompanyCandidatesViewProps {
  selectedOpportunityForMatching?: Opportunity | null;
  onNavigateTab?: (tabId: string) => void;
}

export const CompanyCandidatesView: React.FC<CompanyCandidatesViewProps> = ({
  selectedOpportunityForMatching,
  onNavigateTab
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const company = user as CompanyProfile;

  // Data
  const students = useMemo(() => StorageService.getStudents(), []);
  const opportunities = useMemo(
    () => StorageService.getOpportunitiesByCompany(company?.id || ''),
    [company?.id]
  );

  // Active Opportunity for Deterministic Matching
  const [activeOpportunityId, setActiveOpportunityId] = useState<string>(
    selectedOpportunityForMatching ? selectedOpportunityForMatching.id : (opportunities[0]?.id || 'none')
  );

  const targetOpportunity = useMemo(() => {
    return opportunities.find(o => o.id === activeOpportunityId) || null;
  }, [opportunities, activeOpportunityId]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState('All');
  const [minCgpaFilter, setMinCgpaFilter] = useState('0');
  const [minMatchFilter, setMinMatchFilter] = useState('0');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Modals & Selected Candidate
  const [inspectedCandidate, setInspectedCandidate] = useState<StudentProfile | null>(null);
  const [invitedCandidateIds, setInvitedCandidateIds] = useState<Set<string>>(new Set());

  // Compute deterministic match scores and sort candidates
  const processedCandidates = useMemo(() => {
    return students.map(student => {
      let matchScore = 0;
      let matchResult = null;

      if (targetOpportunity && targetOpportunity.requiredSkills) {
        matchResult = calculateSkillMatch(student.skills || [], targetOpportunity.requiredSkills);
        matchScore = matchResult.scorePercentage;
      } else {
        // Average verified skill score fallback
        const verifiedSkills = (student.skills || []).filter(s => s.verified);
        if (verifiedSkills.length > 0) {
          const sum = verifiedSkills.reduce((acc, s) => acc + (s.verifiedScore || 75), 0);
          matchScore = Math.round(sum / verifiedSkills.length);
        } else {
          matchScore = (student.skills?.length || 0) * 15;
        }
      }

      return {
        student,
        matchScore,
        matchResult
      };
    });
  }, [students, targetOpportunity]);

  // Apply filters
  const filteredCandidates = useMemo(() => {
    return processedCandidates.filter(({ student, matchScore }) => {
      if (branchFilter !== 'All' && !student.branch.toLowerCase().includes(branchFilter.toLowerCase())) {
        return false;
      }
      if (batchFilter !== 'All' && String(student.graduationYear) !== batchFilter) {
        return false;
      }
      if (Number(minCgpaFilter) > 0 && student.cgpa < Number(minCgpaFilter)) {
        return false;
      }
      if (Number(minMatchFilter) > 0 && matchScore < Number(minMatchFilter)) {
        return false;
      }
      if (verifiedOnly) {
        const hasVerified = (student.skills || []).some(s => s.verified);
        if (!hasVerified) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = student.fullName.toLowerCase().includes(q);
        const matchCollege = student.collegeName.toLowerCase().includes(q);
        const matchSkill = (student.skills || []).some(s => s.name.toLowerCase().includes(q));
        if (!matchName && !matchCollege && !matchSkill) return false;
      }
      return true;
    }).sort((a, b) => b.matchScore - a.matchScore); // Highest match first
  }, [processedCandidates, branchFilter, batchFilter, minCgpaFilter, minMatchFilter, verifiedOnly, searchQuery]);

  const handleInviteCandidate = (student: StudentProfile) => {
    if (!targetOpportunity) {
      showToast({
        type: 'warning',
        title: 'Select an Opportunity',
        message: 'Please choose an active opening to invite this candidate to apply.'
      });
      return;
    }

    StorageService.inviteCandidate(
      student.id,
      targetOpportunity.id,
      company || { companyName: 'Enterprise Partner' } as any
    );

    setInvitedCandidateIds(prev => new Set(prev).add(student.id));

    showToast({
      type: 'success',
      title: 'Direct Invitation Dispatched',
      message: `An invitation to apply for ${targetOpportunity.title} was sent to ${student.fullName}.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Talent Pool & Candidate Discovery</h2>
            <Badge variant="purple">Deterministic Matching Engine</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search verified engineering students across premier institutions and calculate deterministic competency matches against your active job specs
          </p>
        </div>

        {onNavigateTab && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigateTab('dashboard')}
          >
            ← Return to Dashboard
          </Button>
        )}
      </div>

      {/* Target Opportunity Selector Banner */}
      <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-100 rounded-xl text-purple-700">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
              Match Engine Target Role
            </span>
            <p className="text-xs text-slate-600">
              Select an active opening to compute mathematical skill alignment for all candidate profiles
            </p>
          </div>
        </div>

        <div className="w-full md:w-80">
          <Select
            value={activeOpportunityId}
            onChange={(e) => setActiveOpportunityId(e.target.value)}
          >
            <option value="none">-- General Talent Pool Search --</option>
            {opportunities.map(o => (
              <option key={o.id} value={o.id}>
                {o.title} ({o.type})
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Search and Multi-filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search candidate name, college (e.g. VJTI, COEP), or skill (e.g. React, Python)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-40">
              <Select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
              >
                <option value="All">All Branches</option>
                <option value="Computer">Computer Science</option>
                <option value="Information">Information Tech</option>
                <option value="Artificial Intelligence">AI & Data Science</option>
                <option value="Electronics">Electronics & Comm</option>
              </Select>
            </div>

            <div className="w-32">
              <Select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
              >
                <option value="All">All Batches</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </Select>
            </div>

            <div className="w-36">
              <Select
                value={minCgpaFilter}
                onChange={(e) => setMinCgpaFilter(e.target.value)}
              >
                <option value="0">Min CGPA: Any</option>
                <option value="7.5">≥ 7.5 CGPA</option>
                <option value="8.0">≥ 8.0 CGPA</option>
                <option value="8.5">≥ 8.5 CGPA</option>
                <option value="9.0">≥ 9.0 CGPA</option>
              </Select>
            </div>

            {targetOpportunity && (
              <div className="w-40">
                <Select
                  value={minMatchFilter}
                  onChange={(e) => setMinMatchFilter(e.target.value)}
                >
                  <option value="0">Match Score: Any</option>
                  <option value="85">≥ 85% Top Fit</option>
                  <option value="75">≥ 75% Strong</option>
                  <option value="60">≥ 60% Moderate</option>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span>Only candidates with AICTE Verified Assessments</span>
            </label>
          </div>

          <span className="text-slate-500">
            Showing <strong className="text-slate-900">{filteredCandidates.length}</strong> matching candidates
          </span>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      {filteredCandidates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No Candidates Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try loosening your filters or expanding your CGPA/Match score thresholds.
            </p>
            <div className="pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setBranchFilter('All');
                  setBatchFilter('All');
                  setMinCgpaFilter('0');
                  setMinMatchFilter('0');
                  setVerifiedOnly(false);
                  setSearchQuery('');
                }}
              >
                Reset All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCandidates.map(({ student, matchScore, matchResult }) => {
            const isInvited = invitedCandidateIds.has(student.id);
            const isHighMatch = matchScore >= 80;
            const isMediumMatch = matchScore >= 65 && matchScore < 80;
            const verifiedSkills = (student.skills || []).filter(s => s.verified);

            return (
              <Card key={student.id} className="hover:border-purple-200 transition-colors flex flex-col justify-between">
                <CardContent className="p-5 space-y-4">
                  {/* Candidate Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={student.fullName}
                        className="w-13 h-13 rounded-2xl object-cover border border-slate-200 bg-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">{student.fullName}</h4>
                          <Badge variant="emerald">CGPA {student.cgpa}</Badge>
                          <Badge variant="primary">Batch {student.graduationYear}</Badge>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-slate-400" />
                          <span>{student.branch}</span>
                        </p>
                        <p className="text-[11px] text-slate-500">{student.collegeName}</p>
                      </div>
                    </div>

                    {/* Deterministic Match / Verified Score Badge */}
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        {targetOpportunity ? 'Role Match' : 'Skill Score'}
                      </span>
                      <span className={`inline-block text-sm font-black px-2.5 py-0.5 rounded-lg mt-0.5 ${
                        isHighMatch ? 'bg-emerald-100 text-emerald-800' :
                        isMediumMatch ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {matchScore}%
                      </span>
                    </div>
                  </div>

                  {/* Deterministic Match Breakdown (if opportunity active) */}
                  {targetOpportunity && matchResult && (
                    <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-100 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-purple-900 font-semibold">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-purple-600" />
                          Requirements fit:
                        </span>
                        <span>{matchResult.matchedSkills.length} / {targetOpportunity.requiredSkills.length} Prerequisites</span>
                      </div>
                      <p className="text-[10px] text-slate-600 line-clamp-1">
                        {matchResult.explanation}
                      </p>
                    </div>
                  )}

                  {/* Skills Chips */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">Top Competencies:</span>
                      <span className="text-slate-400">{verifiedSkills.length} Verified</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {student.skills?.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                            skill.verified
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-1'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {skill.verified && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                          {skill.name} • {skill.proficiency}
                        </span>
                      ))}
                      {(student.skills?.length || 0) > 5 && (
                        <span className="text-[10px] text-slate-400 px-1.5 py-0.5">
                          +{(student.skills?.length || 0) - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => setInspectedCandidate(student)}
                      rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    >
                      Inspect Profile
                    </Button>

                    <Button
                      size="xs"
                      variant={isInvited ? 'outline' : 'primary'}
                      leftIcon={isInvited ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Send className="w-3.5 h-3.5" />}
                      onClick={() => handleInviteCandidate(student)}
                      disabled={isInvited}
                    >
                      {isInvited ? 'Invitation Sent' : 'Direct Invite'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Deep Candidate Modal */}
      <CandidateDetailModal
        isOpen={!!inspectedCandidate}
        onClose={() => setInspectedCandidate(null)}
        candidate={inspectedCandidate}
        targetOpportunity={targetOpportunity}
        onShortlist={(cand) => {
          handleInviteCandidate(cand);
          setInspectedCandidate(null);
        }}
      />
    </div>
  );
};
