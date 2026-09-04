import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CompanyProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Input, Textarea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Save, 
  CheckCircle2,
  Image
} from 'lucide-react';

const PRESET_LOGOS = [
  { name: 'Modern Tech HQ', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80' },
  { name: 'Corporate Glass', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&auto=format&fit=crop&q=80' },
  { name: 'Innovation Hub', url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=150&auto=format&fit=crop&q=80' },
  { name: 'Digital Studio', url: 'https://images.unsplash.com/photo-1570126618953-d437176e8c79?w=150&auto=format&fit=crop&q=80' }
];

interface CompanyProfileEditorProps {
  onNavigateTab?: (tabId: string) => void;
}

export const CompanyProfileEditor: React.FC<CompanyProfileEditorProps> = ({ onNavigateTab }) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const company = user as CompanyProfile;

  const [companyName, setCompanyName] = useState(company?.companyName || '');
  const [industry, setIndustry] = useState(company?.industry || 'Enterprise Software & Cloud AI Solutions');
  const [size, setSize] = useState<CompanyProfile['size']>(company?.size || '500+');
  const [website, setWebsite] = useState(company?.website || 'https://tcs.com');
  const [location, setLocation] = useState(company?.location || 'Bangalore / Hyderabad / Pune');
  const [description, setDescription] = useState(
    company?.description || 
    'Global leader in IT services, digital consulting, and enterprise software engineering powering premier Fortune 500 solutions.'
  );
  const [logoUrl, setLogoUrl] = useState(company?.logoUrl || PRESET_LOGOS[0].url);
  const [contactPerson, setContactPerson] = useState(company?.contactPerson || company?.fullName || 'Talent Acquisition Head');
  const [contactEmail, setContactEmail] = useState(company?.contactEmail || company?.email || 'talent@tcs-innovations.com');
  const [contactPhone, setContactPhone] = useState(company?.contactPhone || company?.phone || '+91 22 6778 9000');
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Company name is required.'
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedCompany: CompanyProfile = {
        ...company,
        companyName,
        industry,
        size,
        website,
        location,
        description,
        logoUrl,
        fullName: contactPerson,
        contactPerson,
        contactEmail,
        contactPhone,
        email: contactEmail,
        phone: contactPhone,
        updatedAt: new Date().toISOString()
      };

      updateProfile(updatedCompany);

      showToast({
        type: 'success',
        title: 'Company Profile Updated',
        message: 'Your organization details have been saved and synchronized across all open opportunities.'
      });
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not update company profile. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={logoUrl}
            alt={companyName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs bg-slate-100"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{companyName || 'Your Company Name'}</h2>
              <Badge variant="purple">Industry Partner</Badge>
              {company?.verified && (
                <Badge variant="success" className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  AICTE Verified Employer
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {industry} • {location} • {size} Employees
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{website}</p>
          </div>
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Company Details */}
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Organization Profile & Brand Identity</h3>
              <p className="text-xs text-slate-500">Provide official company profile information visible to students and institutes</p>
            </div>
            <Badge variant="primary">Public Profile</Badge>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company / Enterprise Name *"
                placeholder="e.g. Tata Consultancy Digital Labs"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                leftIcon={<Building2 className="w-4 h-4" />}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Industry Domain *</label>
                <Select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="Enterprise Software & Cloud AI Solutions">Enterprise Software & Cloud AI Solutions</option>
                  <option value="FinTech & Digital Payments">FinTech & Digital Payments</option>
                  <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                  <option value="E-Commerce & Quick Commerce">E-Commerce & Quick Commerce</option>
                  <option value="Automotive & EV Engineering">Automotive & EV Engineering</option>
                  <option value="Cybersecurity & Defense Tech">Cybersecurity & Defense Tech</option>
                  <option value="Healthcare & BioTech">Healthcare & BioTech</option>
                  <option value="EdTech & Digital Learning">EdTech & Digital Learning</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Size (Employees) *</label>
                <Select
                  value={size}
                  onChange={(e) => setSize(e.target.value as any)}
                >
                  <option value="1-10">1-10 (Early Stage)</option>
                  <option value="11-50">11-50 (Growth Startup)</option>
                  <option value="51-200">51-200 (Mid-size Tech)</option>
                  <option value="201-500">201-500 (Large Enterprise)</option>
                  <option value="500+">500+ (Global Enterprise / MNC)</option>
                </Select>
              </div>

              <Input
                label="Official Website URL *"
                placeholder="https://company.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                leftIcon={<Globe className="w-4 h-4" />}
                required
              />

              <Input
                label="Primary Locations / Offices *"
                placeholder="Bangalore / Hyderabad / Pune"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                leftIcon={<MapPin className="w-4 h-4" />}
                required
              />
            </div>

            {/* Logo URL and Preset Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Logo / Image URL</label>
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="https://example.com/logo.png"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  leftIcon={<Image className="w-4 h-4" />}
                />
              </div>

              <div className="mt-2.5">
                <span className="text-[11px] font-medium text-slate-500">Or choose a high-resolution preset:</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {PRESET_LOGOS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLogoUrl(p.url)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                        logoUrl === p.url 
                          ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-semibold' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <img src={p.url} alt={p.name} className="w-5 h-5 rounded object-cover" referrerPolicy="no-referrer" />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <Textarea
              label="Company Overview & Campus Recruitment Vision *"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight your engineering culture, tech stacks, career growth opportunities, and mission..."
              required
            />
          </CardContent>
        </Card>

        {/* Primary Talent Acquisition Contact */}
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Talent Acquisition & Placement Contact</h3>
              <p className="text-xs text-slate-500">Primary point of contact for college T&P cells, students, and hackathon admins</p>
            </div>
            <Badge variant="purple">Authorized Representative</Badge>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Representative Name & Designation *"
                placeholder="e.g. Talent Acquisition Lead / HR Director"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Official Corporate Email *"
                type="email"
                placeholder="talent@company.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Direct Phone / Helpline *"
                placeholder="+91 22 6778 9000"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950">AICTE & SIH Industry Accreditation</h4>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                This account is certified for direct campus placement drives, AICTE internship credit approvals, and MoU agreements.
              </p>
            </div>
          </div>
          <Badge variant="success">Verified Enterprise</Badge>
        </div>

        {/* Save Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onNavigateTab && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigateTab('dashboard')}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Company Profile
          </Button>
        </div>
      </form>
    </div>
  );
};
