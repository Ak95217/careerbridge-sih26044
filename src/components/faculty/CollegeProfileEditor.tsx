import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { InstitutionProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Input, Textarea, Select } from '../common/Input';
import { Badge } from '../common/Badge';
import { 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Users, 
  GraduationCap, 
  Save, 
  Upload, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface CollegeProfileEditorProps {
  onNavigateTab: (tabId: string) => void;
}

export const CollegeProfileEditor: React.FC<CollegeProfileEditorProps> = ({ onNavigateTab }) => {
  const { addToast } = useToast();
  const [institution, setInstitution] = useState<InstitutionProfile>(() => StorageService.getInstitution());
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof InstitutionProfile, value: any) => {
    setInstitution(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.name.trim()) {
      addToast('error', 'Validation Error', 'Institution name is required.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      StorageService.updateInstitution(institution);
      setIsSaving(false);
      addToast('success', 'Profile Updated! 🏛️', 'Institution credentials and accreditation details saved successfully.');
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={institution.logoUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80'}
              alt={institution.name}
              className="w-16 h-16 rounded-xl border border-slate-200 object-cover shadow-xs"
            />
            <button
              type="button"
              onClick={() => {
                const newUrl = prompt('Enter image URL for College Logo:', institution.logoUrl);
                if (newUrl) handleChange('logoUrl', newUrl);
              }}
              className="absolute inset-0 bg-slate-900/60 rounded-xl text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] font-medium transition-opacity"
            >
              <Upload className="w-4 h-4 mb-0.5" />
              Change
            </button>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{institution.name}</h2>
              <Badge variant="primary">{institution.type}</Badge>
              <Badge variant="success">Accredited</Badge>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {institution.city}, {institution.state} • Estd. {institution.establishedYear}
            </p>
            <p className="text-xs text-indigo-600 font-medium mt-0.5">{institution.accreditation}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigateTab('students')}
            leftIcon={<GraduationCap className="w-4 h-4 text-slate-600" />}
          >
            View Students
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Institutional Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader 
              title="Institution Identification"
              subtitle="Official administrative name, classification, and statutory affiliations"
            />
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institution Official Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={institution.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. National Institute of Technology, New Delhi"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution Category / Type <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={institution.type}
                    onChange={(e) => handleChange('type', e.target.value as any)}
                    options={[
                      { value: 'NIT', label: 'National Institute of Technology (NIT)' },
                      { value: 'IIT', label: 'Indian Institute of Technology (IIT)' },
                      { value: 'IIIT', label: 'Indian Institute of Information Technology (IIIT)' },
                      { value: 'Autonomous Engineering College', label: 'Autonomous Engineering College' },
                      { value: 'State University', label: 'State Technical University' },
                      { value: 'Central University', label: 'Central University' },
                      { value: 'Private University', label: 'Private Technical University' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Established Year
                  </label>
                  <Input
                    type="number"
                    value={institution.establishedYear || 2010}
                    onChange={(e) => handleChange('establishedYear', parseInt(e.target.value) || 2010)}
                    placeholder="2010"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University Affiliation / Statutory Authority
                </label>
                <Input
                  value={institution.affiliation}
                  onChange={(e) => handleChange('affiliation', e.target.value)}
                  placeholder="e.g. Autonomous Institute of National Importance (Ministry of Education, GoI)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Accreditation & NIRF Rank Ranking Badges
                </label>
                <Input
                  value={institution.accreditation}
                  onChange={(e) => handleChange('accreditation', e.target.value)}
                  placeholder="e.g. NAAC A++ Grade (3.78) | NBA Tier-1 | NIRF Ranked #28"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institution Overview / T&P Cell Mission
                </label>
                <Textarea
                  value={institution.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  placeholder="Provide institutional vision, research focus, and placement achievements..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Official Contact & Location"
              subtitle="Verified communication channels for industry recruiters and state placement audits"
            />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={institution.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="director@nitdelhi.ac.in"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Administrative / T&P Phone
                  </label>
                  <Input
                    type="tel"
                    value={institution.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 11 2778 7500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Institutional Website URL
                </label>
                <Input
                  type="url"
                  value={institution.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://nitdelhi.ac.in"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campus Street Address
                </label>
                <Input
                  value={institution.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Plot No. FA7, Zone P1, GT Karnal Road"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={institution.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="New Delhi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State / Union Territory <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={institution.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="Delhi (NCR)"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Statistics & Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Campus Demographics" subtitle="Active academic headcount" />
            <CardContent className="space-y-4">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Enrolled Students</p>
                  <h4 className="text-xl font-bold text-slate-900 mt-0.5">{institution.totalStudentsCount || 1450}</h4>
                </div>
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Full-Time Faculty Members</p>
                  <h4 className="text-xl font-bold text-slate-900 mt-0.5">{institution.totalFacultyCount || 94}</h4>
                </div>
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Established</p>
                  <h4 className="text-xl font-bold text-slate-900 mt-0.5">{institution.establishedYear} ({new Date().getFullYear() - institution.establishedYear} yrs)</h4>
                </div>
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Accreditation Status" subtitle="Verified statutory seals" />
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-950">NAAC A++ Certified</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Highest grade institutional quality benchmark valid through 2029.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl">
                <Award className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-indigo-950">NBA Washington Accord Tier-1</p>
                  <p className="text-[11px] text-indigo-700 mt-0.5">All undergraduate engineering degree tracks globally recognized.</p>
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
            Save College Profile
          </Button>
        </div>
      </form>
    </div>
  );
};
