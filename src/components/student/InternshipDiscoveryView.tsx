import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { calculateSkillMatch } from '../../services/skillMatching';
import { StudentProfile, Opportunity, WorkMode } from '../../types';
import { OpportunityDetailModal } from './OpportunityDetailModal';
import { Card, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge, ProficiencyBadge } from '../common/Badge';
import { 
  Search, 
  Building2, 
  MapPin, 
  IndianRupee, 
  Clock, 
  Sparkles, 
  Calendar, 
  SlidersHorizontal, 
  Check, 
  Briefcase,
  Users
} from 'lucide-react';

interface InternshipDiscoveryViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const InternshipDiscoveryView: React.FC<InternshipDiscoveryViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const student = user as StudentProfile;

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => StorageService.getOpportunities('Internship'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'recent' | 'stipend'>('match');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshOpportunities = () => {
    setOpportunities(StorageService.getOpportunities('Internship'));
  };

  const handleOpenDetail = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setIsModalOpen(true);
  };

  // Filter and Sort Internships
  const filtered = opportunities.filter(opp => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.requiredSkills?.some(s => s.skillName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesWorkMode = selectedWorkMode === 'All' || opp.workMode === selectedWorkMode;
    return matchesSearch && matchesWorkMode;
  });

  // Calculate dynamic skill match score for sorting & display
  const withMatchScores = filtered.map(opp => {
    const match = calculateSkillMatch(student?.skills || [], opp.requiredSkills || []);
    const isApplied = StorageService.hasStudentApplied(student?.id || '', opp.id);
    return {
      opportunity: opp,
      matchResult: match,
      isApplied
    };
  });

  // Sort
  withMatchScores.sort((a, b) => {
    if (sortBy === 'match') {
      return b.matchResult.scorePercentage - a.matchResult.scorePercentage;
    }
    if (sortBy === 'recent') {
      return new Date(b.opportunity.createdAt).getTime() - new Date(a.opportunity.createdAt).getTime();
    }
    return 0;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    if (score >= 40) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Internship Discovery & Matching Portal</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Explore curated corporate & startup internships. Each listing includes an automated, deterministic skill match score calculated specifically for your verified profile.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onNavigateTab('applications')}
          leftIcon={<Clock className="w-3.5 h-3.5" />}
        >
          Track My Applications
        </Button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search internships by title, tech, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Work Mode Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {['All', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedWorkMode(mode)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedWorkMode === mode
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-hidden"
          >
            <option value="match">Sort: Highest Skill Match</option>
            <option value="recent">Sort: Most Recent</option>
          </select>
        </div>
      </div>

      {/* Internships List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {withMatchScores.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No internships match your filter criteria. Try clearing search filters.
          </div>
        ) : (
          withMatchScores.map(({ opportunity, matchResult, isApplied }) => (
            <Card
              key={opportunity.id}
              className="hover:border-indigo-200 transition-all flex flex-col justify-between"
            >
              <CardContent className="p-5 space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{opportunity.title}</h3>
                      <p className="text-xs text-slate-600 font-medium">{opportunity.companyName}</p>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className={`px-2.5 py-1 rounded-xl border font-bold text-xs shrink-0 flex items-center gap-1 ${getScoreColor(matchResult.scorePercentage)}`}>
                    <Sparkles className="w-3 h-3" />
                    <span>{matchResult.scorePercentage}% Fit</span>
                  </div>
                </div>

                {/* Key Tags */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" />
                    {opportunity.stipendOrSalary}
                  </span>
                  <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {opportunity.location}
                  </span>
                  <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {opportunity.duration}
                  </span>
                </div>

                {/* Required Skills Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Required Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {opportunity.requiredSkills?.map((sk) => {
                      const isStudentHas = student?.skills?.some(
                        s => s.name.toLowerCase() === sk.skillName.toLowerCase()
                      );

                      return (
                        <span
                          key={sk.skillName}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 border ${
                            isStudentHas
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {isStudentHas && <Check className="w-2.5 h-2.5 text-emerald-600" />}
                          <span>{sk.skillName}</span>
                          <span className="text-[9px] text-slate-400">({sk.proficiency})</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Action Row */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Deadline: {opportunity.applicationDeadline}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isApplied ? (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Applied
                      </span>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenDetail(opportunity)}
                      >
                        View & Apply
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail & 1-Click Apply Modal */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          opportunity={selectedOpportunity}
          student={student}
          onApplicationSubmitted={refreshOpportunities}
        />
      )}
    </div>
  );
};
