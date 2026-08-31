import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FacultyProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { Button } from '../common/Button';
import { SearchableCollegeSelect } from '../common/SearchableCollegeSelect';
import { useToast } from '../../context/ToastContext';
import {
  GraduationCap,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  User,
  Plus,
  AlertCircle
} from 'lucide-react';

interface FacultyOnboardingViewProps {
  onComplete: () => void;
}

export const FacultyOnboardingView: React.FC<FacultyOnboardingViewProps> = ({ onComplete }) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const colleges = useMemo(() => StorageService.getColleges(), []);

  const [selectedCollegeName, setSelectedCollegeName] = useState<string>('');
  const [customCollege, setCustomCollege] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Computer Science and Engineering');
  const [designation, setDesignation] = useState('Assistant Professor & Placement Coordinator');
  const [employeeId, setEmployeeId] = useState('');
  const [specializations, setSpecializations] = useState('Algorithms, Distributed Systems, Cloud Architecture');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Faculty Name is required';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Mobile Number is required';
    }

    const finalCollege = selectedCollegeName === 'OTHER' ? customCollege.trim() : (selectedCollegeName || customCollege.trim());
    if (!finalCollege) {
      newErrors.college = 'Please select or enter your college / institute';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('error', 'Incomplete Details', 'Please enter all required faculty details.');
      return;
    }

    setIsSubmitting(true);

    const matchedCollege = colleges.find(c => c.name === finalCollege);
    const updatedFaculty: Partial<FacultyProfile> = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      institutionName: finalCollege,
      institutionId: matchedCollege?.id || `inst-${Date.now()}`,
      department: department.trim(),
      designation: designation.trim(),
      employeeId: employeeId.trim() || `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
      areasOfSpecialization: specializations.split(',').map(s => s.trim()).filter(Boolean),
      onboardingCompleted: true
    };

    updateProfile(updatedFaculty);
    setIsSubmitting(false);
    showToast('success', 'Faculty Profile Created', `Welcome Professor ${fullName.trim()}`);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 text-white relative">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 text-xs font-semibold mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            Academia & Faculty Setup • Step 2 of 2
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Select Your College / Institute
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
            Choose your academic institution and establish your department coordinator profile to monitor student cohorts and curriculum-industry skill alignment.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-850/90 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Institution Section */}
            <div className="space-y-3">
              <div className="border-b border-slate-700/80 pb-3 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">1. Institution Selection</h2>
                  <p className="text-xs text-slate-400">Select accredited college or university.</p>
                </div>
              </div>

              <div>
                <SearchableCollegeSelect
                  id="faculty-college-select"
                  value={selectedCollegeName}
                  onChange={(collegeName) => {
                    setSelectedCollegeName(collegeName);
                    if (errors.college) setErrors({ ...errors, college: '' });
                  }}
                  customCollegeValue={customCollege}
                  onCustomCollegeChange={(customVal) => {
                    setCustomCollege(customVal);
                    if (errors.college) setErrors({ ...errors, college: '' });
                  }}
                  required
                  error={errors.college}
                  label="Select Your College / Institute"
                  placeholder="-- Search & Choose Your Institution --"
                  helperText="Choose your institution from Jaipur B.Tech or National colleges, or specify Other."
                />
              </div>
            </div>

            {/* Faculty Details Section */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-slate-700/80 pb-3 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">2. Faculty & Coordinator Details</h2>
                  <p className="text-xs text-slate-400">Enter your designation, department, and specialization.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Faculty / Contact Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="faculty-name-input"
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Chander / Prof. Meenakshi Sundaram"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.fullName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="faculty-phone-input"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Department <span className="text-rose-400">*</span>
                  </label>
                  <select
                    id="faculty-department-select"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Computer Science and Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                    <option value="Electronics & Communication Engineering">Electronics & Communication</option>
                    <option value="Training & Placement Cell">Training & Placement Cell (T&P)</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Designation <span className="text-rose-400">*</span>
                  </label>
                  <select
                    id="faculty-designation-select"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Professor & Head of Department (HOD)">Professor & Head of Department (HOD)</option>
                    <option value="Professor & Dean of Academics">Professor & Dean of Academics</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor & Placement Coordinator">Assistant Professor & Placement Coordinator</option>
                    <option value="Head of Training & Placement (TPO)">Head of Training & Placement (TPO)</option>
                    <option value="Industry Institute Interaction Cell Lead">Industry Institute Interaction Cell Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Employee / Faculty ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FAC-CSE-2024"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Areas of Specialization (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Computing, Cloud Architectures, Machine Learning"
                    value={specializations}
                    onChange={(e) => setSpecializations(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Institutional analytics will be filtered for your college.
              </span>
              <Button
                id="btn-complete-faculty-onboarding"
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
              >
                Complete Faculty Setup & Open Dashboard
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
