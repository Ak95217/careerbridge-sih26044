import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CompanyProfile, IndustryCompany } from '../../types';
import { StorageService } from '../../services/storage';
import { Button } from '../common/Button';
import { Input, Textarea, Select } from '../common/Input';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Globe,
  Briefcase,
  Users,
  UserCheck,
  Plus,
  AlertCircle
} from 'lucide-react';

interface CompanyOnboardingViewProps {
  onComplete: () => void;
}

export const CompanyOnboardingView: React.FC<CompanyOnboardingViewProps> = ({ onComplete }) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const existingCompany = user as CompanyProfile;

  const allCompanies = useMemo(() => StorageService.getCompanies(), []);

  // Selection & Mode State
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  // Representative Details
  const [repName, setRepName] = useState('');
  const [repDesignation, setRepDesignation] = useState('Head of University Relations / Campus Hiring');
  const [repPhone, setRepPhone] = useState('');

  // Custom Company Details
  const [customName, setCustomName] = useState('');
  const [customIndustry, setCustomIndustry] = useState('Software / IT');
  const [customWebsite, setCustomWebsite] = useState('');
  const [customLocation, setCustomLocation] = useState('Bengaluru, Karnataka');
  const [customSize, setCustomSize] = useState('51-200');
  const [customDescription, setCustomDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Get distinct industry categories for filtering
  const industries = useMemo(() => {
    const set = new Set(allCompanies.map(c => c.industry));
    return ['All', ...Array.from(set).sort()];
  }, [allCompanies]);

  // Filtered companies list
  const filteredCompanies = useMemo(() => {
    return allCompanies.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.headquarters.toLowerCase().includes(searchQuery.toLowerCase());
      const matchIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry;
      return matchSearch && matchIndustry;
    });
  }, [allCompanies, searchQuery, selectedIndustry]);

  const handleSelectCompany = (comp: IndustryCompany) => {
    setSelectedCompanyId(comp.id);
    setIsCustomMode(false);
    if (errors.company) setErrors({ ...errors, company: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!isCustomMode && !selectedCompanyId) {
      newErrors.company = 'Please select your company from the list or register a new one.';
    }

    if (isCustomMode && !customName.trim()) {
      newErrors.customName = 'Company name is required';
    }

    if (!repName.trim()) {
      newErrors.repName = 'Representative Name is required';
    }

    if (!repPhone.trim()) {
      newErrors.repPhone = 'Mobile Number is required';
    }

    if (!repDesignation.trim()) {
      newErrors.repDesignation = 'Designation / Role is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('error', 'Incomplete Selection', 'Please select a company and provide all required recruiter details.');
      return;
    }

    setIsSubmitting(true);

    let chosenCompany: Partial<CompanyProfile>;

    if (isCustomMode) {
      const newCompanyId = `comp-custom-${Date.now()}`;
      chosenCompany = {
        id: newCompanyId,
        companyName: customName.trim(),
        industry: customIndustry,
        website: customWebsite.trim(),
        location: customLocation.trim(),
        size: customSize,
        description: customDescription.trim(),
        fullName: repName.trim(),
        contactPerson: repName.trim(),
        contactEmail: user?.email || '',
        contactPhone: repPhone.trim(),
        verified: true,
        onboardingCompleted: true
      };
    } else {
      const selected = allCompanies.find(c => c.id === selectedCompanyId);
      if (!selected) {
        setIsSubmitting(false);
        return;
      }
      const existingOpps = StorageService.getOpportunitiesByCompany(selected.id);

      chosenCompany = {
        id: selected.id,
        companyName: selected.name,
        industry: selected.industry,
        website: selected.website,
        location: selected.headquarters,
        size: selected.size,
        description: selected.description,
        logoUrl: selected.logoUrl || '',
        fullName: repName.trim(),
        contactPerson: repName.trim(),
        contactEmail: user?.email || '',
        contactPhone: repPhone.trim(),
        verified: true,
        activeOpportunitiesCount: existingOpps.length,
        onboardingCompleted: true
      };
    }

    updateProfile(chosenCompany);
    setIsSubmitting(false);
    showToast('success', 'Company Profile Linked', `Authenticated for ${chosenCompany.companyName}`);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 text-white relative">
      <div className="max-w-4xl mx-auto">
        {/* Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Industry Partner Onboarding • Step 2 of 2
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Select Your Company
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
            Choose your organization from the 100 verified industry partners on the platform, or register a new company profile to post internships and hire verified talent.
          </p>
        </div>

        {/* Main Selection Card */}
        <div className="bg-slate-850/90 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Choose or Register Company */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">1. Select Company from 100 Partner Organizations</h2>
                    <p className="text-xs text-slate-400">Search by company name, industry sector, or headquarters.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomMode(!isCustomMode);
                    if (!isCustomMode) setSelectedCompanyId('');
                  }}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 border border-indigo-800/80 transition-colors"
                >
                  {isCustomMode ? <Building2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {isCustomMode ? 'Choose from 100 Partners' : '+ Register New Company'}
                </button>
              </div>

              {errors.company && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errors.company}</span>
                </div>
              )}

              {/* Mode A: Select from 100 Companies */}
              {!isCustomMode && (
                <div className="space-y-4">
                  {/* Search and Industry Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Search className="w-4 h-4" />
                      </div>
                      <input
                        id="company-search-input"
                        type="text"
                        placeholder="Search by company name (e.g. Infosys, TCS, Google, HCL, Zomato)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <select
                        id="company-industry-filter"
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {industries.map(ind => (
                          <option key={ind} value={ind}>{ind === 'All' ? 'All Industries (100)' : ind}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Company Cards Scrollable Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                    {filteredCompanies.map((comp) => {
                      const isSelected = selectedCompanyId === comp.id;
                      const oppsCount = StorageService.getOpportunitiesByCompany(comp.id).length;
                      return (
                        <div
                          key={comp.id}
                          id={`select-company-${comp.id}`}
                          onClick={() => handleSelectCompany(comp)}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-950/80 ring-2 ring-indigo-500/60 shadow-lg'
                              : 'border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                                {comp.name}
                              </h3>
                              {isSelected ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full shrink-0">
                                  <CheckCircle2 className="w-3 h-3" /> Selected
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 shrink-0">
                                  {oppsCount} Opportunities
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                              {comp.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-indigo-400" />
                              {comp.headquarters}
                            </span>
                            <span className="text-indigo-300 font-semibold">{comp.industry}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filteredCompanies.length === 0 && (
                    <div className="text-center py-8 bg-slate-900/40 rounded-xl border border-slate-800">
                      <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">No partner companies match your query.</p>
                      <button
                        type="button"
                        onClick={() => { setSearchQuery(''); setSelectedIndustry('All'); }}
                        className="mt-2 text-xs text-indigo-400 hover:underline"
                      >
                        Reset Search Filters
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mode B: Register New Custom Company */}
              {isCustomMode && (
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Company / Organization Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="custom-company-name-input"
                        type="text"
                        required
                        placeholder="e.g. NextGen Robotics Technologies Pvt Ltd"
                        value={customName}
                        onChange={(e) => {
                          setCustomName(e.target.value);
                          if (errors.customName) setErrors({ ...errors, customName: '' });
                        }}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Industry / Sector
                      </label>
                      <select
                        value={customIndustry}
                        onChange={(e) => setCustomIndustry(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Software / IT">Software / IT</option>
                        <option value="Fintech & Banking">Fintech & Banking</option>
                        <option value="Healthcare & HealthTech">Healthcare & HealthTech</option>
                        <option value="Automotive & EV">Automotive & EV</option>
                        <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                        <option value="Semiconductor & Hardware">Semiconductor & Hardware</option>
                        <option value="AI & Robotics">AI & Robotics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Company Size
                      </label>
                      <select
                        value={customSize}
                        onChange={(e) => setCustomSize(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="1-10">1-10 Employees (Seed / Early Stage)</option>
                        <option value="11-50">11-50 Employees</option>
                        <option value="51-200">51-200 Employees (Growth / Series A+)</option>
                        <option value="201-500">201-500 Employees</option>
                        <option value="500+">500+ Employees (Enterprise)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Official Website
                      </label>
                      <input
                        type="url"
                        placeholder="https://company.com"
                        value={customWebsite}
                        onChange={(e) => setCustomWebsite(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Headquarters Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru, Karnataka"
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Brief Company Overview
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Overview of company focus areas, mission, and products..."
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Recruiter / Representative Details */}
            <div className="space-y-4">
              <div className="border-b border-slate-700/80 pb-3 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">2. Recruiter / HR Representative Details</h2>
                  <p className="text-xs text-slate-400">Enter your name and contact info for candidate communication.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="rep-name-input"
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma / Rajesh Menon"
                    value={repName}
                    onChange={(e) => {
                      setRepName(e.target.value);
                      if (errors.repName) setErrors({ ...errors, repName: '' });
                    }}
                    className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.repName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {errors.repName && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.repName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Designation / Role <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="rep-designation-input"
                    type="text"
                    required
                    placeholder="e.g. Campus Talent Acquisition Lead / Head of HR"
                    value={repDesignation}
                    onChange={(e) => {
                      setRepDesignation(e.target.value);
                      if (errors.repDesignation) setErrors({ ...errors, repDesignation: '' });
                    }}
                    className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.repDesignation ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {errors.repDesignation && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.repDesignation}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="rep-phone-input"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={repPhone}
                    onChange={(e) => {
                      setRepPhone(e.target.value);
                      if (errors.repPhone) setErrors({ ...errors, repPhone: '' });
                    }}
                    className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.repPhone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {errors.repPhone && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.repPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Authenticated Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Submit & Enter Dashboard */}
            <div className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                You can switch or edit your company settings anytime.
              </span>
              <Button
                id="btn-complete-company-onboarding"
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
              >
                Confirm Company & Launch Portal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
