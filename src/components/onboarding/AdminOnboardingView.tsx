import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminProfile, UserRole } from '../../types';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  User,
  Phone,
  AlertCircle,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';

interface AdminOnboardingViewProps {
  onComplete: () => void;
}

export const AdminOnboardingView: React.FC<AdminOnboardingViewProps> = ({ onComplete }) => {
  const { user, updateProfile, switchRole, logout } = useAuth();
  const { showToast } = useToast();
  const admin = user as AdminProfile;
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const [fullName, setFullName] = useState(admin?.fullName || '');
  const [phone, setPhone] = useState(admin?.phone || '');
  const [department, setDepartment] = useState(admin?.department || 'Platform Administration');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Mobile Number is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('error', 'Incomplete Details', 'Please provide administrator full name and mobile number.');
      return;
    }

    setIsSubmitting(true);

    const updatedAdmin: Partial<AdminProfile> = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      department: department.trim(),
      onboardingCompleted: true
    };

    updateProfile(updatedAdmin);
    setIsSubmitting(false);
    showToast('success', 'Admin Profile Configured', `Welcome Administrator ${fullName.trim()}!`);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 text-white relative">
      <div className="max-w-2xl mx-auto">
        {/* Top Back / Persona Switch Bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="relative inline-block text-left">
            <button
              id="btn-admin-switch-role"
              type="button"
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/90 border border-slate-700 hover:bg-slate-750 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
              <span>Back / Switch Role</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute left-0 mt-1.5 w-48 rounded-xl bg-slate-900 border border-slate-700 p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Persona
                </div>
                {(['student', 'company', 'faculty', 'mentor', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      switchRole(r);
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium capitalize flex items-center justify-between cursor-pointer ${
                      user?.role === r ? 'bg-indigo-600/30 text-indigo-300 font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{r === 'faculty' ? 'College / Faculty' : r === 'company' ? 'Industry / Company' : r}</span>
                    {user?.role === r && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="text-xs text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Platform Administration Setup • Step 2 of 2
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Administrator Profile Setup
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Configure your administrator credentials to access national taxonomy, institutional verifications, and platform governance controls.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-850/90 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="border-b border-slate-700/80 pb-3 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Administrator Information</h2>
                <p className="text-xs text-slate-400">Official contact and identity details for audit trails.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  id="admin-fullname-input"
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Sharma / Admin Officer"
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

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mobile Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-phone-input"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Department / Unit
                </label>
                <input
                  id="admin-dept-input"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Verified Email Banner */}
              <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs text-slate-300">
                <span>Verified Email:</span>
                <span className="font-semibold text-indigo-300">{user?.email}</span>
              </div>
            </div>

            <Button
              id="btn-submit-admin-onboarding"
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 shadow-lg shadow-indigo-600/30"
            >
              Complete Admin Setup & Enter Dashboard
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
