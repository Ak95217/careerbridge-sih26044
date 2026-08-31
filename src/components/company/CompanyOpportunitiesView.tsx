import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Opportunity, OpportunityType, WorkMode, ProficiencyLevel, CompanyProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Input, Textarea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { 
  Briefcase, 
  Plus, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  UserCheck, 
  Sparkles, 
  Search,
  Filter,
  Check
} from 'lucide-react';

interface CompanyOpportunitiesViewProps {
  initialType?: OpportunityType;
  onNavigateTab?: (tabId: string) => void;
  onSelectOpportunityForMatching?: (opp: Opportunity) => void;
}

export const CompanyOpportunitiesView: React.FC<CompanyOpportunitiesViewProps> = ({
  initialType,
  onNavigateTab,
  onSelectOpportunityForMatching
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const company = user as CompanyProfile;

  // Data State
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    return StorageService.getOpportunitiesByCompany(company?.id || '');
  });

  // Filter State
  const [filterType, setFilterType] = useState<string>(initialType || 'All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<OpportunityType>('Internship');
  const [workMode, setWorkMode] = useState<WorkMode>('Hybrid');
  const [location, setLocation] = useState('Bangalore (Hybrid)');
  const [duration, setDuration] = useState('6 Months');
  const [stipendOrSalary, setStipendOrSalary] = useState('₹35,000 / month');
  const [openings, setOpenings] = useState(5);
  const [minCgpa, setMinCgpa] = useState(7.0);
  const [applicationDeadline, setApplicationDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [eligibility, setEligibility] = useState('B.Tech / M.Tech in CS/IT (2025/2026 Batch)');
  const [description, setDescription] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState(
    'Build responsive full-stack features using React and TypeScript.\nDesign RESTful APIs and optimize SQL queries.\nCollaborate in agile sprint cycles and automated deployments.'
  );

  // Skills Builder
  const globalSkills = StorageService.getSkills();
  const [requiredSkills, setRequiredSkills] = useState<{
    skillName: string;
    proficiency: ProficiencyLevel;
    mandatory: boolean;
  }[]>([
    { skillName: 'React.js', proficiency: 'Advanced', mandatory: true },
    { skillName: 'TypeScript', proficiency: 'Intermediate', mandatory: true },
    { skillName: 'Node.js', proficiency: 'Intermediate', mandatory: true }
  ]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState<ProficiencyLevel>('Intermediate');
  const [newSkillMandatory, setNewSkillMandatory] = useState(true);

  const refreshList = () => {
    setOpportunities(StorageService.getOpportunitiesByCompany(company?.id || ''));
  };

  const handleOpenCreate = () => {
    setEditingOpp(null);
    setTitle('');
    setType(initialType || 'Internship');
    setWorkMode('Hybrid');
    setLocation(company?.location || 'Bangalore / Remote');
    setDuration('6 Months');
    setStipendOrSalary(initialType === 'Job' ? '₹10,00,000 - ₹14,00,000 LPA' : '₹35,000 / month');
    setOpenings(5);
    setMinCgpa(7.0);
    setDescription('Exciting opportunity to join our engineering division working on mission-critical applications.');
    setResponsibilitiesText('Build modern web applications with scalable architectures.\nParticipate in code reviews and test automation.\nCollaborate with senior technical architects.');
    setRequiredSkills([
      { skillName: 'React.js', proficiency: 'Advanced', mandatory: true },
      { skillName: 'TypeScript', proficiency: 'Intermediate', mandatory: true }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (opp: Opportunity) => {
    setEditingOpp(opp);
    setTitle(opp.title);
    setType(opp.type);
    setWorkMode(opp.workMode);
    setLocation(opp.location);
    setDuration(opp.duration || '6 Months');
    setStipendOrSalary(opp.stipendOrSalary);
    setOpenings(opp.openings);
    setMinCgpa(opp.minCgpa || 7.0);
    setApplicationDeadline(opp.applicationDeadline);
    setEligibility(opp.eligibility);
    setDescription(opp.description);
    setResponsibilitiesText((opp.responsibilities || []).join('\n'));
    setRequiredSkills(opp.requiredSkills || []);
    setIsModalOpen(true);
  };

  const handleAddSkillToReq = () => {
    if (!newSkillName.trim()) return;
    if (requiredSkills.some(s => s.skillName.toLowerCase() === newSkillName.trim().toLowerCase())) {
      showToast({
        type: 'warning',
        title: 'Skill already added',
        message: 'This skill is already included in requirements.'
      });
      return;
    }
    setRequiredSkills([
      ...requiredSkills,
      {
        skillName: newSkillName.trim(),
        proficiency: newSkillProficiency,
        mandatory: newSkillMandatory
      }
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkillFromReq = (idx: number) => {
    setRequiredSkills(requiredSkills.filter((_, i) => i !== idx));
  };

  const handleSaveOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || requiredSkills.length === 0) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please provide a role title and at least one required skill prerequisite.'
      });
      return;
    }

    const responsibilities = responsibilitiesText
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean);

    if (editingOpp) {
      // Update
      const updated: Opportunity = {
        ...editingOpp,
        title,
        type,
        workMode,
        location,
        duration: type === 'Internship' ? duration : undefined,
        stipendOrSalary,
        openings: Number(openings),
        minCgpa: Number(minCgpa),
        applicationDeadline,
        eligibility,
        description,
        responsibilities,
        requiredSkills
      };
      StorageService.updateOpportunity(updated);
      showToast({
        type: 'success',
        title: 'Posting Updated',
        message: `${title} details updated successfully.`
      });
    } else {
      // Create
      const newOpp: Opportunity = {
        id: `opp-${Date.now()}`,
        companyId: company?.id || `usr-company-${Date.now()}`,
        companyName: company?.companyName && company.companyName !== 'Not provided' ? company.companyName : (company?.fullName && company.fullName !== 'Not provided' ? company.fullName : 'Hiring Organization'),
        companyLogo: company?.logoUrl,
        title,
        type,
        workMode,
        location,
        duration: type === 'Internship' ? duration : undefined,
        stipendOrSalary,
        openings: Number(openings),
        minCgpa: Number(minCgpa),
        applicationDeadline,
        eligibility,
        description,
        responsibilities,
        requiredSkills,
        status: 'Open',
        createdAt: new Date().toISOString(),
        applicantCount: 0
      };
      StorageService.addOpportunity(newOpp);
      showToast({
        type: 'success',
        title: 'Opportunity Published',
        message: `${title} is now active and receiving candidate applications.`
      });
    }

    refreshList();
    setIsModalOpen(false);
  };

  const handleToggleStatus = (opp: Opportunity) => {
    const nextStatus = opp.status === 'Open' ? 'Closed' : 'Open';
    const updated: Opportunity = { ...opp, status: nextStatus };
    StorageService.updateOpportunity(updated);
    refreshList();
    showToast({
      type: 'info',
      title: `Status Changed to ${nextStatus}`,
      message: `${opp.title} is now ${nextStatus.toLowerCase()}.`
    });
  };

  const handleDeleteOpportunity = (oppId: string, titleStr: string) => {
    if (window.confirm(`Are you sure you want to delete "${titleStr}"?`)) {
      StorageService.deleteOpportunity(oppId);
      refreshList();
      showToast({
        type: 'success',
        title: 'Opportunity Deleted',
        message: 'The posting has been removed from active recruitment listings.'
      });
    }
  };

  // Filtered Opportunities
  const filtered = opportunities.filter(opp => {
    if (filterType !== 'All' && opp.type !== filterType) return false;
    if (filterStatus !== 'All' && opp.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchLoc = opp.location.toLowerCase().includes(q);
      const matchSkill = (opp.requiredSkills || []).some(s => s.skillName.toLowerCase().includes(q));
      if (!matchTitle && !matchLoc && !matchSkill) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              {initialType ? `${initialType} Management` : 'Internships & Job Opportunities'}
            </h2>
            <Badge variant="purple">Company Portal</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your recruitment drives, define skill prerequisites, and review incoming candidate talent
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Post New {initialType || 'Opportunity'}
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Input
            placeholder="Search by role title, location, or required skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!initialType && (
            <div className="w-36">
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Internship">Internships Only</option>
                <option value="Job">Jobs Only</option>
              </Select>
            </div>
          )}

          <div className="w-36">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open / Active</option>
              <option value="Closed">Closed</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No Postings Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || filterStatus !== 'All' 
                ? 'Try adjusting your filters or search terms.' 
                : 'You have not created any postings yet. Publish an internship or job opening to start attracting top students.'}
            </p>
            <div className="pt-2">
              <Button size="sm" variant="primary" onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
                Create Opportunity
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((opp) => (
            <Card key={opp.id} className="hover:border-purple-200 transition-colors">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">{opp.title}</h3>
                      <Badge variant={opp.type === 'Internship' ? 'purple' : 'primary'}>
                        {opp.type}
                      </Badge>
                      <Badge variant={opp.status === 'Open' ? 'success' : 'slate'}>
                        {opp.status}
                      </Badge>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {opp.workMode} • {opp.location}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenEdit(opp)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(opp)}
                    >
                      {opp.status === 'Open' ? 'Close' : 'Re-open'}
                    </Button>
                    <button
                      onClick={() => handleDeleteOpportunity(opp.id, opp.title)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Posting"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Compensation</span>
                    <p className="font-bold text-slate-900 mt-0.5">{opp.stipendOrSalary}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Openings</span>
                    <p className="font-bold text-slate-900 mt-0.5">{opp.openings} Seats Available</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Min. CGPA Cutoff</span>
                    <p className="font-bold text-slate-900 mt-0.5">{opp.minCgpa || 7.0} CGPA</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Application Deadline</span>
                    <p className="font-bold text-slate-900 mt-0.5">{opp.applicationDeadline}</p>
                  </div>
                </div>

                {/* Required Skills & Quick Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-slate-600 mr-1">Prerequisites:</span>
                    {opp.requiredSkills?.map((req, i) => (
                      <span
                        key={i}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                          req.mandatory
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {req.skillName} ({req.proficiency})
                        {req.mandatory && ' *'}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<Users className="w-3.5 h-3.5" />}
                      onClick={() => onNavigateTab && onNavigateTab('applications')}
                    >
                      {opp.applicantCount || 0} Applicants
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<UserCheck className="w-3.5 h-3.5 text-indigo-200" />}
                      onClick={() => {
                        if (onSelectOpportunityForMatching) {
                          onSelectOpportunityForMatching(opp);
                        } else if (onNavigateTab) {
                          onNavigateTab('candidates');
                        }
                      }}
                    >
                      Match Candidates
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal for Create / Edit Opportunity */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOpp ? `Edit ${editingOpp.title}` : `Post New ${type}`}
        description="Configure role requirements, compensation, and required technical competencies."
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveOpportunity} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Role Title *"
              placeholder="e.g. Full Stack Cloud Engineering Intern"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Opportunity Type *</label>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <option value="Internship">Internship (Seasonal / 3-6 Months)</option>
                <option value="Job">Full-Time Job (Campus Placement)</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode *</label>
              <Select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as any)}
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </Select>
            </div>

            <Input
              label="Location *"
              placeholder="e.g. Bangalore / Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            {type === 'Internship' ? (
              <Input
                label="Duration *"
                placeholder="e.g. 6 Months"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            ) : (
              <Input
                label="Number of Openings *"
                type="number"
                min={1}
                value={openings}
                onChange={(e) => setOpenings(Number(e.target.value))}
                required
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label={type === 'Internship' ? 'Stipend *' : 'Salary Package (CTC) *'}
              placeholder={type === 'Internship' ? '₹35,000 / month' : '₹10,00,000 - ₹14,00,000 LPA'}
              value={stipendOrSalary}
              onChange={(e) => setStipendOrSalary(e.target.value)}
              leftIcon={<DollarSign className="w-4 h-4" />}
              required
            />

            <Input
              label="Minimum CGPA Cutoff"
              type="number"
              step="0.1"
              min={0}
              max={10}
              placeholder="7.0"
              value={minCgpa}
              onChange={(e) => setMinCgpa(Number(e.target.value))}
            />

            <Input
              label="Application Deadline *"
              type="date"
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4" />}
              required
            />
          </div>

          <Input
            label="Eligibility Criteria *"
            placeholder="e.g. B.Tech / M.Tech in CS/IT/ECE (2025/2026 Batch)"
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
            required
          />

          <Textarea
            label="Role Overview & Mission"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the platform team, mission, and learning environment..."
          />

          <Textarea
            label="Key Responsibilities (One per line)"
            rows={3}
            value={responsibilitiesText}
            onChange={(e) => setResponsibilitiesText(e.target.value)}
            placeholder="Build scalable APIs&#10;Optimize database queries&#10;Collaborate in agile sprints"
          />

          {/* Required Skills Builder */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Prerequisite Technical Skills ({requiredSkills.length})
              </label>
              <span className="text-[11px] text-slate-500">
                Used for deterministic student matching & gap analysis
              </span>
            </div>

            {/* Current Skills List */}
            <div className="flex flex-wrap gap-2">
              {requiredSkills.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-2xs"
                >
                  <span className="font-bold text-slate-900">{req.skillName}</span>
                  <span className="text-indigo-600 font-medium">({req.proficiency})</span>
                  {req.mandatory && (
                    <span className="text-[10px] text-rose-600 bg-rose-50 px-1 rounded font-bold">Mandatory</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkillFromReq(idx)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200">
              <div className="sm:col-span-2">
                <Select
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                >
                  <option value="">-- Pick from Taxonomy or Type below --</option>
                  {globalSkills.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.category})</option>
                  ))}
                </Select>
              </div>

              <div>
                <Select
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value as any)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newSkillMandatory}
                    onChange={(e) => setNewSkillMandatory(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Mandatory</span>
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddSkillToReq}
                  disabled={!newSkillName.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingOpp ? 'Update Opportunity' : 'Publish Opportunity'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
