import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { 
  StudentProfile, 
  StudentSkill, 
  TaxonomySkill, 
  SkillCategory, 
  ProficiencyLevel 
} from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Input';
import { Badge, ProficiencyBadge } from '../common/Badge';
import { 
  Search, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Award, 
  SlidersHorizontal, 
  Layers, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface SkillMappingViewProps {
  onNavigateTab: (tabId: string) => void;
}

const CATEGORIES: (SkillCategory | 'All Categories')[] = [
  'All Categories',
  'Programming Languages',
  'Frontend',
  'Backend',
  'Database',
  'Cloud',
  'DevOps',
  'AI/ML',
  'Data Science',
  'Cybersecurity',
  'Mobile Development',
  'Technical',
  'Tools',
  'Domain Skills',
  'Soft Skills'
];

const PROFICIENCY_OPTIONS: { label: string; value: ProficiencyLevel }[] = [
  { label: 'Beginner (Basic Syntax & Concepts)', value: 'Beginner' },
  { label: 'Intermediate (Built Projects / Working Knowledge)', value: 'Intermediate' },
  { label: 'Advanced (Production Architecture & Optimization)', value: 'Advanced' },
  { label: 'Expert (Staff Architect / Deep Domain Mastery)', value: 'Expert' }
];

export const SkillMappingView: React.FC<SkillMappingViewProps> = ({ onNavigateTab }) => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const student = user as StudentProfile;

  const [taxonomySkills, setTaxonomySkills] = useState<TaxonomySkill[]>(() => StorageService.getSkills());
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Skill Add Modal/Form
  const [customSkillName, setCustomSkillName] = useState('');
  const [customCategory, setCustomCategory] = useState<SkillCategory>('Technical');
  const [customProficiency, setCustomProficiency] = useState<ProficiencyLevel>('Intermediate');
  const [customExperience, setCustomExperience] = useState<number>(1);
  const [showAddCustom, setShowAddCustom] = useState(false);

  // Active student skills
  const studentSkills = student?.skills || [];

  const handleAddTaxonomySkill = (taxSkill: TaxonomySkill, defaultProficiency: ProficiencyLevel = 'Intermediate') => {
    // Duplicate check
    const exists = studentSkills.some(
      s => s.name.toLowerCase() === taxSkill.name.toLowerCase() || s.skillId === taxSkill.id
    );

    if (exists) {
      addToast('warning', 'Already Added', `${taxSkill.name} is already mapped to your skill profile.`);
      return;
    }

    const newSkill: StudentSkill = {
      id: `ssk-${Date.now()}`,
      skillId: taxSkill.id,
      name: taxSkill.name,
      category: taxSkill.category,
      proficiency: defaultProficiency,
      yearsOfExperience: 1,
      verified: false
    };

    const updatedSkills = [...studentSkills, newSkill];
    const updatedProfile: StudentProfile = {
      ...student,
      skills: updatedSkills
    };

    updateProfile(updatedProfile);
    addToast('success', 'Skill Mapped', `${taxSkill.name} has been added to your profile.`);
  };

  const handleAddCustomSkill = () => {
    if (!customSkillName.trim()) {
      addToast('error', 'Skill Name Required', 'Please provide a skill title.');
      return;
    }

    const exists = studentSkills.some(
      s => s.name.toLowerCase() === customSkillName.trim().toLowerCase()
    );

    if (exists) {
      addToast('warning', 'Already Added', `${customSkillName} already exists in your skill list.`);
      return;
    }

    const newSkill: StudentSkill = {
      id: `ssk-${Date.now()}`,
      skillId: `custom-${Date.now()}`,
      name: customSkillName.trim(),
      category: customCategory,
      proficiency: customProficiency,
      yearsOfExperience: customExperience,
      verified: false
    };

    const updatedSkills = [...studentSkills, newSkill];
    const updatedProfile: StudentProfile = {
      ...student,
      skills: updatedSkills
    };

    updateProfile(updatedProfile);
    setCustomSkillName('');
    setShowAddCustom(false);
    addToast('success', 'Skill Added', `${newSkill.name} added with ${newSkill.proficiency} proficiency.`);
  };

  const handleUpdateProficiency = (skillId: string, newProficiency: ProficiencyLevel) => {
    const updatedSkills = studentSkills.map(s => {
      if (s.id === skillId) {
        return { ...s, proficiency: newProficiency };
      }
      return s;
    });

    updateProfile({ ...student, skills: updatedSkills });
    addToast('info', 'Proficiency Updated', 'Your skill level has been adjusted.');
  };

  const handleRemoveSkill = (skillId: string, skillName: string) => {
    const updatedSkills = studentSkills.filter(s => s.id !== skillId);
    updateProfile({ ...student, skills: updatedSkills });
    addToast('info', 'Skill Removed', `${skillName} removed from profile.`);
  };

  // Filtered Taxonomy Skills
  const filteredTaxonomy = taxonomySkills.filter(s => {
    const matchesCat = selectedCategory === 'All Categories' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const verifiedCount = studentSkills.filter(s => s.verified).length;

  return (
    <div className="space-y-6">
      {/* Skill Mapping Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Student Skill Taxonomy & Mapping</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Map your competencies against industry-standard benchmarks. Verified assessment scores are directly matched with corporate internship and placement criteria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigateTab('assessment')}
            leftIcon={<Award className="w-3.5 h-3.5 text-indigo-600" />}
          >
            Take Skill Assessment
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setShowAddCustom(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Custom Skill
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Mapped Skills</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{studentSkills.length}</p>
          <span className="text-[10px] text-slate-400">In your active profile</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Verified Credentials</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{verifiedCount}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Assessment verified</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Industry Benchmark</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">Tier-1 Fit</p>
          <span className="text-[10px] text-slate-400">Based on demand weight</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Skill-Gap Status</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <button
            onClick={() => onNavigateTab('gap-engine')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-2.5"
          >
            <span>Analyze Role Gap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Mapped Skills (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Your Mapped Skills ({studentSkills.length})</h3>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {studentSkills.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No skills mapped yet. Select from the taxonomy catalog on the right or add a custom skill.
                </div>
              ) : (
                studentSkills.map((sk) => (
                  <div
                    key={sk.id}
                    className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{sk.name}</h4>
                          {sk.verified ? (
                            <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified {sk.verifiedScore}%</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => onNavigateTab('assessment')}
                              className="text-[10px] text-indigo-600 hover:underline font-semibold"
                            >
                              + Take Quiz
                            </button>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{sk.category}</span>
                      </div>

                      <button
                        onClick={() => handleRemoveSkill(sk.id, sk.name)}
                        className="text-slate-300 hover:text-rose-600 p-1 transition-colors"
                        title="Remove skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick Proficiency Selector */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[11px] text-slate-500 font-medium">Proficiency:</span>
                      <select
                        value={sk.proficiency}
                        onChange={(e) => handleUpdateProficiency(sk.id, e.target.value as ProficiencyLevel)}
                        className="text-xs font-semibold py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Taxonomy Directory Browser (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">National Industry Skill Taxonomy</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">{filteredTaxonomy.length} available</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search taxonomy (e.g. React, Docker, Python)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Taxonomy Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
                {filteredTaxonomy.map((tax) => {
                  const isMapped = studentSkills.some(
                    s => s.name.toLowerCase() === tax.name.toLowerCase()
                  );

                  return (
                    <div
                      key={tax.id}
                      className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                        isMapped 
                          ? 'border-emerald-200 bg-emerald-50/20' 
                          : 'border-slate-200 hover:border-indigo-200 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-slate-900">{tax.name}</h4>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            ★ {tax.industryDemandWeight}/10
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{tax.category}</span>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                          {tax.description}
                        </p>
                      </div>

                      <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between">
                        {isMapped ? (
                          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>In Profile</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAddTaxonomySkill(tax)}
                            className="w-full py-1 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Map to Profile</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom Skill Modal */}
      {showAddCustom && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Custom Skill</h3>
              <button onClick={() => setShowAddCustom(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <Input
                label="Skill Title"
                placeholder="e.g. WebSockets, Apache Kafka, GraphQL"
                value={customSkillName}
                onChange={(e) => setCustomSkillName(e.target.value)}
                required
              />

              <Select
                label="Category"
                options={CATEGORIES.filter(c => c !== 'All Categories').map(c => ({ label: c, value: c }))}
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as SkillCategory)}
              />

              <Select
                label="Your Current Proficiency"
                options={PROFICIENCY_OPTIONS}
                value={customProficiency}
                onChange={(e) => setCustomProficiency(e.target.value as ProficiencyLevel)}
              />

              <Input
                label="Years of Experience"
                type="number"
                value={customExperience}
                onChange={(e) => setCustomExperience(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setShowAddCustom(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddCustomSkill}>
                Save to Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
