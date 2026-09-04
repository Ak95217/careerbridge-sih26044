import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { MentorProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Input, Textarea, Select } from '../common/Input';
import { Badge } from '../common/Badge';
import { 
  UserCircle, 
  Building2, 
  Mail, 
  Phone, 
  Linkedin, 
  Save, 
  Upload, 
  Users, 
  CheckCircle2, 
  Award, 
  Plus, 
  X 
} from 'lucide-react';

interface MentorProfileEditorProps {
  onNavigateTab?: (tabId: string) => void;
}

export const MentorProfileEditor: React.FC<MentorProfileEditorProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const currentMentor = user as MentorProfile;

  const [mentor, setMentor] = useState<MentorProfile>(() => {
    const list = StorageService.getMentors();
    const found = list.find(m => m.id === currentMentor?.id || m.email === currentMentor?.email);
    return found || currentMentor || list[0];
  });

  const [isSaving, setIsSaving] = useState(false);
  const [newSkillTag, setNewSkillTag] = useState('');
  const [newDomainTag, setNewDomainTag] = useState('');

  const handleChange = (field: keyof MentorProfile, value: any) => {
    setMentor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkillTag.trim() && !mentor.skills.includes(newSkillTag.trim())) {
      setMentor(prev => ({ ...prev, skills: [...prev.skills, newSkillTag.trim()] }));
      setNewSkillTag('');
    }
  };

  const handleRemoveSkill = (tag: string) => {
    setMentor(prev => ({ ...prev, skills: prev.skills.filter(s => s !== tag) }));
  };

  const handleAddDomain = () => {
    if (newDomainTag.trim() && !mentor.expertise.includes(newDomainTag.trim())) {
      setMentor(prev => ({ ...prev, expertise: [...prev.expertise, newDomainTag.trim()] }));
      setNewDomainTag('');
    }
  };

  const handleRemoveDomain = (tag: string) => {
    setMentor(prev => ({ ...prev, expertise: prev.expertise.filter(e => e !== tag) }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentor.fullName.trim() || !mentor.email.trim()) {
      addToast('error', 'Validation Error', 'Full name and email are required.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      StorageService.updateMentor(mentor);
      setIsSaving(false);
      addToast('success', 'Profile Updated! 🌟', 'Your industry mentor profile and availability have been saved.');
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={mentor.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
              alt={mentor.fullName}
              className="w-16 h-16 rounded-xl border border-slate-200 object-cover shadow-xs"
            />
            <button
              type="button"
              onClick={() => {
                const url = prompt('Enter avatar image URL:', mentor.avatarUrl);
                if (url) handleChange('avatarUrl', url);
              }}
              className="absolute inset-0 bg-slate-900/60 rounded-xl text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] font-medium transition-opacity"
            >
              <Upload className="w-4 h-4 mb-0.5" />
              Change
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{mentor.fullName}</h2>
              <Badge variant="warning">Industry Mentor</Badge>
              <Badge variant={mentor.availability === 'Available' ? 'success' : 'default'}>{mentor.availability}</Badge>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {mentor.title} • <b className="text-slate-800">{mentor.organization}</b>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {mentor.yearsOfExperience}+ Years Experience • Mentees: {mentor.currentMenteesCount || 0} / {mentor.maxMentees || 5}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateTab && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigateTab('students')}
              leftIcon={<Users className="w-4 h-4" />}
            >
              View Mentees
            </Button>
          )}
          <Button
            size="sm"
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile
          </Button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Professional Identity" subtitle="Your organizational title and career background" />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={mentor.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Email <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={mentor.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Organization <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={mentor.organization}
                    onChange={(e) => handleChange('organization', e.target.value)}
                    placeholder="e.g. Google Cloud, Microsoft"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation / Title <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={mentor.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g. Principal Cloud Architect"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Experience (Years)
                  </label>
                  <Input
                    type="number"
                    value={mentor.yearsOfExperience}
                    onChange={(e) => handleChange('yearsOfExperience', parseInt(e.target.value) || 5)}
                    min={1}
                    max={40}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  LinkedIn Profile URL
                </label>
                <Input
                  type="url"
                  value={mentor.linkedInUrl || ''}
                  onChange={(e) => handleChange('linkedInUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Professional Bio & Mentorship Philosophy
                </label>
                <Textarea
                  value={mentor.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={4}
                  placeholder="Briefly describe your career journey, architecture principles, and how you help students build production-grade engineering skills..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Technical Expertise & Skill Tags" subtitle="Matched deterministically with student skill deficits" />
            <CardContent className="space-y-4">
              {/* Technical Skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Core Technical Skills ({mentor.skills.length})
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {mentor.skills.map(sk => (
                    <span key={sk} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-medium flex items-center gap-1.5">
                      {sk}
                      <button type="button" onClick={() => handleRemoveSkill(sk)} className="text-indigo-400 hover:text-indigo-700">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={newSkillTag}
                    onChange={(e) => setNewSkillTag(e.target.value)}
                    placeholder="Add technical skill (e.g. Distributed Caching, Kubernetes)..."
                    className="text-xs"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                  />
                  <Button size="sm" variant="outline" type="button" onClick={handleAddSkill}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Functional Domains */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Functional Expertise Domains ({mentor.expertise.length})
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {mentor.expertise.map(dom => (
                    <span key={dom} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium flex items-center gap-1.5">
                      {dom}
                      <button type="button" onClick={() => handleRemoveDomain(dom)} className="text-emerald-400 hover:text-emerald-700">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={newDomainTag}
                    onChange={(e) => setNewDomainTag(e.target.value)}
                    placeholder="Add functional domain (e.g. System Design, Mock Interviews)..."
                    className="text-xs"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDomain(); } }}
                  />
                  <Button size="sm" variant="outline" type="button" onClick={handleAddDomain}>
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Capacity & Availability */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Mentorship Capacity & Slots" subtitle="Control your pairing bandwidth" />
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Availability Status <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={mentor.availability}
                  onChange={(e) => handleChange('availability', e.target.value as any)}
                  options={[
                    { value: 'Available', label: '🟢 Available (Open for Mentees)' },
                    { value: 'Busy', label: '🟡 Busy (Limited Slots)' },
                    { value: 'Unavailable', label: '🔴 Unavailable (On Leave / Full)' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Maximum Mentee Capacity
                </label>
                <Input
                  type="number"
                  value={mentor.maxMentees || 5}
                  onChange={(e) => handleChange('maxMentees', parseInt(e.target.value) || 5)}
                  min={1}
                  max={20}
                />
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Current Active Mentees:</span>
                  <b className="text-slate-900">{mentor.currentMenteesCount || 0}</b>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Available Open Slots:</span>
                  <b className="text-emerald-600">{Math.max(0, (mentor.maxMentees || 5) - (mentor.currentMenteesCount || 0))} Slots</b>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="w-full"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Mentor Profile
          </Button>
        </div>
      </form>
    </div>
  );
};
