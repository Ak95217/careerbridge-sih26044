import React, { useState } from 'react';
import { 
  AIDetectedSkill, 
  SkillCategory, 
  ProficiencyLevel 
} from '../../types';
import { 
  Check, 
  X, 
  Edit2, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface DetectedSkillsReviewCardProps {
  detectedSkills: AIDetectedSkill[];
  onSkillUpdate: (skillId: string, updates: Partial<AIDetectedSkill>) => void;
  onApplyConfirmed: () => void;
  isApplying?: boolean;
}

const CATEGORIES: SkillCategory[] = [
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
  'Tools',
  'Soft Skills',
  'Domain Skills',
  'Technical'
];

const PROFICIENCIES: ProficiencyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const DetectedSkillsReviewCard: React.FC<DetectedSkillsReviewCardProps> = ({
  detectedSkills,
  onSkillUpdate,
  onApplyConfirmed,
  isApplying = false
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<SkillCategory>('Technical');
  const [editProficiency, setEditProficiency] = useState<ProficiencyLevel>('Intermediate');
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Ignored'>('All');

  const startEdit = (skill: AIDetectedSkill) => {
    setEditingId(skill.id);
    setEditName(skill.name);
    setEditCategory(skill.category);
    setEditProficiency(skill.suggestedProficiency || 'Intermediate');
  };

  const saveEdit = (skillId: string) => {
    if (!editName.trim()) return;
    onSkillUpdate(skillId, {
      name: editName.trim(),
      category: editCategory,
      suggestedProficiency: editProficiency,
      status: 'Confirmed'
    });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleConfirmAll = () => {
    detectedSkills.forEach(s => {
      if (s.status !== 'Confirmed') {
        onSkillUpdate(s.id, { status: 'Confirmed' });
      }
    });
  };

  const filtered = detectedSkills.filter(s => {
    if (filter === 'All') return true;
    return s.status === filter;
  });

  const confirmedCount = detectedSkills.filter(s => s.status === 'Confirmed').length;
  const pendingCount = detectedSkills.filter(s => s.status === 'Pending').length;

  return (
    <div id="detected-skills-review" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      {/* Header & Batch Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">AI-Detected Skills Review</h3>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {detectedSkills.length} Detected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review skills extracted from your resume. Approve, customize, or ignore before adding to your verified profile.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {pendingCount > 0 && (
            <button
              id="confirm-all-skills-btn"
              onClick={handleConfirmAll}
              className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              Confirm All ({pendingCount})
            </button>
          )}

          <button
            id="apply-confirmed-skills-btn"
            onClick={onApplyConfirmed}
            disabled={isApplying || confirmedCount === 0}
            className={`text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm ${
              confirmedCount > 0 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {isApplying ? 'Applying...' : `Sync to Profile (${confirmedCount})`}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['All', 'Pending', 'Confirmed', 'Ignored'] as const).map(tab => {
          const count = tab === 'All' ? detectedSkills.length : detectedSkills.filter(s => s.status === tab).length;
          return (
            <button
              key={tab}
              id={`filter-tab-${tab.toLowerCase()}`}
              onClick={() => setFilter(tab)}
              className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors ${
                filter === tab 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-xs">
          No skills found in the "{filter}" filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
          {filtered.map(skill => {
            const isEditing = editingId === skill.id;

            return (
              <div 
                key={skill.id}
                id={`detected-skill-${skill.id}`}
                className={`p-3.5 rounded-lg border transition-all ${
                  skill.status === 'Confirmed' 
                    ? 'border-emerald-200 bg-emerald-50/40' 
                    : skill.status === 'Ignored' 
                    ? 'border-slate-200 bg-slate-50 opacity-60' 
                    : 'border-slate-200 bg-white hover:border-indigo-200'
                }`}
              >
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Skill Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md font-semibold text-slate-900 focus:outline-indigo-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                        <select
                          value={editCategory}
                          onChange={e => setEditCategory(e.target.value as SkillCategory)}
                          className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-md font-medium text-slate-800"
                        >
                          {CATEGORIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Proficiency</label>
                        <select
                          value={editProficiency}
                          onChange={e => setEditProficiency(e.target.value as ProficiencyLevel)}
                          className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-md font-medium text-slate-800"
                        >
                          {PROFICIENCIES.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        onClick={cancelEdit}
                        className="text-xs px-2.5 py-1 rounded text-slate-600 hover:bg-slate-200 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(skill.id)}
                        className="text-xs px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save & Confirm
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="flex flex-col justify-between h-full space-y-2">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-slate-900">{skill.name}</span>
                          <span className="block text-[11px] font-medium text-slate-500">{skill.category}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            skill.confidence === 'High' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : skill.confidence === 'Medium' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {skill.confidence} Conf.
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            skill.status === 'Confirmed' 
                              ? 'bg-emerald-600 text-white' 
                              : skill.status === 'Ignored' 
                              ? 'bg-slate-200 text-slate-600' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {skill.status}
                          </span>
                        </div>
                      </div>

                      {/* Evidence snippet */}
                      <div className="mt-1.5 bg-slate-50/80 rounded px-2 py-1 text-[11px] text-slate-600 border border-slate-100 flex items-start gap-1">
                        <HelpCircle className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-2 italic">"{skill.evidence}"</span>
                      </div>

                      {skill.suggestedProficiency && (
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600">
                          <span className="text-slate-400">Suggested Level:</span>
                          <span className="font-semibold text-indigo-700">{skill.suggestedProficiency}</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
                      <button
                        onClick={() => startEdit(skill)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                        title="Edit Skill Name/Category"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>

                      <div className="flex items-center gap-1.5">
                        {skill.status !== 'Ignored' && (
                          <button
                            onClick={() => onSkillUpdate(skill.id, { status: 'Ignored' })}
                            className="text-[11px] font-semibold px-2 py-0.5 text-slate-500 hover:bg-slate-100 rounded flex items-center gap-1"
                            title="Ignore this skill"
                          >
                            <X className="w-3 h-3 text-slate-400" />
                            Ignore
                          </button>
                        )}

                        {skill.status !== 'Confirmed' && (
                          <button
                            onClick={() => onSkillUpdate(skill.id, { status: 'Confirmed' })}
                            className="text-[11px] font-bold px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1 shadow-xs"
                            title="Confirm skill"
                          >
                            <Check className="w-3 h-3" />
                            Confirm
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
