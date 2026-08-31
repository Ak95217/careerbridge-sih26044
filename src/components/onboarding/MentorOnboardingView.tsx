import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MentorProfile } from '../../types';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  User,
  Briefcase,
  Linkedin,
  AlertCircle
} from 'lucide-react';

interface MentorOnboardingViewProps {
  onComplete: () => void;
}

export const MentorOnboardingView: React.FC<MentorOnboardingViewProps> = ({ onComplete }) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [title, setTitle] = useState('Staff Engineer / Technical Lead');
  const [yearsOfExp, setYearsOfExp] = useState(8);
  const [expertise, setExpertise] = useState('System Design, Cloud Native, React Architecture');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [maxMentees, setMaxMentees] = useState(5);
  const [bio, setBio] = useState('Passionate about guiding engineering students through career navigation, mock technical interviews, and production best practices.');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Mentor Full Name is required';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Mobile Number is required';
    }

    if (!expertise.trim()) {
      newErrors.expertise = 'Domain / Area of Expertise is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('error', 'Incomplete Details', 'Please fill in your required mentor profile details.');
      return;
    }

    setIsSubmitting(true);

    const updatedMentor: Partial<MentorProfile> = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      organization: organization.trim(),
      title: title.trim(),
      yearsOfExperience: Number(yearsOfExp) || 5,
      expertise: expertise.split(',').map(s => s.trim()).filter(Boolean),
      linkedInUrl: linkedInUrl.trim(),
      maxMentees: Number(maxMentees) || 5,
      currentMenteesCount: 0,
      bio: bio.trim(),
      availability: 'Available',
      onboardingCompleted: true
    };

    updateProfile(updatedMentor);
    setIsSubmitting(false);
    showToast('success', 'Mentor Profile Activated', `Welcome ${fullName.trim()}!`);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 text-white relative">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            Industry Mentor Setup • Step 2 of 2
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mentor Profile Setup
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
            Provide your domain experience and guidance preferences to start mentoring aspiring students and providing 1-on-1 career guidance.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-850/90 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <div className="border-b border-slate-700/80 pb-3 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Professional Background</h2>
                  <p className="text-xs text-slate-400">Enter your current affiliation, role, and domain expertise.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="mentor-name-input"
                    type="text"
                    required
                    placeholder="e.g. Saurabh Mishra / Neha Kulkarni"
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
                    id="mentor-phone-input"
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
                    Organization / Employer
                  </label>
                  <input
                    id="mentor-org-input"
                    type="text"
                    placeholder="e.g. Google India / Microsoft / Amazon"
                    value={organization}
                    onChange={(e) => {
                      setOrganization(e.target.value);
                      if (errors.organization) setErrors({ ...errors, organization: '' });
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Designation / Job Title
                  </label>
                  <input
                    id="mentor-title-input"
                    type="text"
                    placeholder="e.g. Principal Cloud Architect / VP Engineering"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Domain / Area of Expertise <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="mentor-expertise-input"
                    type="text"
                    required
                    placeholder="e.g. Distributed Systems, Cloud Native, React Architecture, AI/ML"
                    value={expertise}
                    onChange={(e) => {
                      setExpertise(e.target.value);
                      if (errors.expertise) setErrors({ ...errors, expertise: '' });
                    }}
                    className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.expertise ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {errors.expertise && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.expertise}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Years of Industry Experience
                  </label>
                  <input
                    id="mentor-experience-input"
                    type="number"
                    min="1"
                    max="40"
                    value={yearsOfExp}
                    onChange={(e) => setYearsOfExp(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Max Mentees Capacity
                  </label>
                  <input
                    id="mentor-mentees-input"
                    type="number"
                    min="1"
                    max="20"
                    value={maxMentees}
                    onChange={(e) => setMaxMentees(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    LinkedIn Profile URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mentor Bio & Guidance Statement
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe how you help students (e.g. resume reviews, mock interviews, architecture guidance)..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Mentees can schedule 1-on-1 video sessions based on your availability.
              </span>
              <Button
                id="btn-complete-mentor-onboarding"
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
              >
                Complete Mentor Setup & Enter Portal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
