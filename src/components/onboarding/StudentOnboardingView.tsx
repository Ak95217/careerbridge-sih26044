import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfile, StudentSkill, StudentCertification } from '../../types';
import { StorageService } from '../../services/storage';
import { Button } from '../common/Button';
import { Input, Textarea, Select } from '../common/Input';
import { SearchableCollegeSelect } from '../common/SearchableCollegeSelect';
import { useToast } from '../../context/ToastContext';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  FileText,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Building2,
  Code2,
  ArrowRight,
  ArrowLeft,
  User,
  Compass,
  AlertCircle,
  Briefcase,
  Target,
  MapPin
} from 'lucide-react';

interface StudentOnboardingViewProps {
  onComplete: () => void;
}

const COMMON_SKILLS迷 = [
  'React.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java',
  'C++', 'SQL & PostgreSQL', 'MongoDB', 'Docker', 'AWS Cloud', 'Git & GitHub',
  'Machine Learning', 'Data Structures & Algorithms', 'Tailwind CSS', 'Next.js',
  'REST APIs', 'Cybersecurity', 'DevOps', 'Figma / UI Design'
];

const CAREER_ROLES = [
  'Full Stack Software Engineer',
  'Frontend Engineer',
  'Backend & API Engineer',
  'Data Scientist / AI Engineer',
  'Cloud & DevOps Engineer',
  'Cybersecurity Analyst',
  'Mobile App Developer (iOS/Android)',
  'Embedded Systems & IoT Engineer',
  'Quality Assurance & Automation Engineer',
  'UI/UX & Product Designer',
  'OTHER'
];

const CAREER_DOMAINS = [
  'Software & Technology',
  'Artificial Intelligence & DeepTech',
  'FinTech & Banking',
  'Healthcare & BioTech',
  'E-Commerce & Retail',
  'Automotive & EV',
  'EdTech & Learning Platforms',
  'Consulting & Enterprise Services'
];

export const StudentOnboardingView: React.FC<StudentOnboardingViewProps> = ({ onComplete }) => {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const student = user as StudentProfile;
  const colleges迷 = StorageService.getColleges();

  // Form State
  const [fullName, setFullName] = useState(student?.fullName && student.fullName !== 'Not provided' ? student.fullName : '');
  const [phone, setPhone] = useState(student?.phone || '');
  const [collegeName, setCollegeName] = useState(student?.collegeName && student.collegeName !== 'Not provided' ? student.collegeName : '');
  const [customCollege, setCustomCollege] = useState('');
  const [degree, setDegree] = useState(student?.degree || 'B.Tech / B.E.');
  const [branch, setBranch] = useState(student?.branch || 'Computer Science and Engineering');
  const [graduationYear, setGraduationYear] = useState<number>(student?.graduationYear || 2026);
  const [cgpa, setCgpa] = useState<string>(student?.cgpa && student.cgpa > 0 ? String(student.cgpa) : '');
  const [bio, setBio] = useState(student?.bio || '');

  // Career Preferences State
  const [targetRole, setTargetRole] = useState(student?.targetRole || 'Full Stack Software Engineer');
  const [customTargetRole, setCustomTargetRole] = useState('');
  const [targetOpportunityType, setTargetOpportunityType] = useState<string>(student?.targetOpportunityType || 'Both');
  const [preferredWorkMode, setPreferredWorkMode] = useState<string>(student?.preferredWorkMode || 'No Preference');
  const [careerDomain, setCareerDomain] = useState<string>(student?.careerDomain || 'Software & Technology');
  const [preferredLocation, setPreferredLocation] = useState<string>(student?.location || '');

  // Skills State
  const [skills, setSkills] = useState<StudentSkill[]>(student?.skills || []);
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillProficiency, setCustomSkillProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  // Projects State
  const [projects, setProjects] = useState<Array<{
    id: string;
    title: string;
    description: string;
    techStack: string[];
    link?: string;
  }>>([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectTech, setNewProjectTech] = useState('');
  const [newProjectLink, setNewProjectLink] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);

  // Certifications State
  const [certifications, setCertifications] = useState<StudentCertification[]>([]);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [showAddCert, setShowAddCert] = useState(false);

  // Resume State
  const [resumeFileName, setResumeFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleTogglePresetSkill = (skillName: string) => {
    const exists = skills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (exists) {
      setSkills(skills.filter(s => s.name.toLowerCase() !== skillName.toLowerCase()));
    } else {
      setSkills([...skills, {
        id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: skillName,
        proficiency: 'Intermediate',
        verified: false,
        source: 'Self Reported'
      }]);
    }
  };

  const handleAddCustomSkillnest = () => {
    if (!customSkillName.trim()) return;
    const exists = skills.some(s => s.name.toLowerCase() === customSkillName.trim().toLowerCase());
    if (exists) {
      showToast('info', 'Skill already added', customSkillName);
      return;
    }
    setSkills([...skills, {
      id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: customSkillName.trim(),
      proficiency: customSkillProficiency,
      verified: false,
      source: 'Self Reported'
    }]);
    setCustomSkillName('');
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  const handleAddProject = () => {
    if (!newProjectTitle.trim()) return;
    setProjects([...projects, {
      id: `proj-${Date.now()}`,
      title: newProjectTitle.trim(),
      description: newProjectDesc.trim(),
      techStack: newProjectTech.split(',').map(t => t.trim()).filter(Boolean),
      link: newProjectLink.trim()
    }]);
    setNewProjectTitle('');
    setNewProjectDesc('');
    setNewProjectTech('');
    setNewProjectLink('');
    setShowAddProject(false);
  };

  const handleAddCertification = () => {
    if (!newCertTitle.trim()) return;
    const newCert: StudentCertification = {
      id: `cert-${Date.now()}`,
      studentId: student?.id || 'usr-student-1',
      title: newCertTitle.trim(),
      issuer: newCertIssuer.trim() || 'Verified Institution',
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Not Submitted', // Strict Security: Never automatically verified
      verificationNote: 'Profile initial creation. Awaiting student document proof upload.'
    };
    setCertifications([...certifications, newCert]);
    setNewCertTitle('');
    setNewCertIssuer('');
    setShowAddCert(false);
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFileName(file.name);
      showToast('success', 'Resume Attached', file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Mobile Number is required';
    }

    const finalCollege = collegeName === 'OTHER' ? customCollege.trim() : (collegeName || customCollege.trim());
    if (!finalCollege) {
      newErrors.collegeName = 'College / Institute is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('error', 'Incomplete Details', 'Please enter all required profile fields.');
      return;
    }

    setIsSubmitting(true);

    const parsedCgpa = parseFloat(cgpa);
    const finalCgpa = !isNaN(parsedCgpa) && parsedCgpa >= 0 && parsedCgpa <= 10 ? parsedCgpa : 0;
    const finalTargetRole = targetRole === 'OTHER' ? (customTargetRole.trim() || 'Software Engineer') : targetRole;

    const updatedProfile: Partial<StudentProfile> = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      collegeName: finalCollege,
      degree: degree.trim(),
      branch: branch.trim(),
      graduationYear: Number(graduationYear) || 2026,
      cgpa: finalCgpa,
      bio: bio.trim(),
      targetRole: finalTargetRole,
      careerGoal: bio.trim() || `Aspiring ${finalTargetRole}`,
      targetOpportunityType: targetOpportunityType,
      preferredWorkMode: preferredWorkMode,
      careerDomain: careerDomain,
      location: preferredLocation.trim(),
      skills: skills,
      projects: projects,
      certifications: certifications,
      resumeFileName: resumeFileName || undefined,
      resumeUploadedAt: resumeFileName ? new Date().toISOString() : undefined,
      onboardingCompleted: true
    };

    updateProfile(updatedProfile);

    // If certifications added, persist them in storage with Not Submitted state
    certifications.forEach(cert => {
      StorageService.addCertificate(cert);
    });

    setIsSubmitting(false);
    showToast('success', 'Profile Created Successfully', `Welcome to SkillBridge, ${fullName.trim()}!`);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 text-white relative">
      <div className="max-w-3xl mx-auto">
        {/* Back / Sign out option */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 border border-slate-700 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Login / Switch Role
          </button>
        </div>

        {/* Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Student Onboarding • Profile & Career Preferences
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Your Student Profile
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
            Set up your academic details, career preferences, and technical skills to unlock deterministic AI match scores and personalized opportunity recommendations.
          </p>
        </div>

        {/* Main Onboarding Card */}
        <div className="bg-slate-850/90 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Academic & Personal Information */}
            <div className="space-y-4">
              <div className="border-b border-slate-700/80 pb-3 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">1. Academic & Personal Details</h2>
                  <p className="text-xs text-slate-400">Enter your name, university, and program information.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="student-name-input"
                    type="text"
                    required
                    placeholder="e.g. Ananya Verma / Rohan Gupta"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
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
                  <input
                    id="student-phone-input"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>

                {/* College / Institute Selection */}
                <div className="sm:col-span-2">
                  <SearchableCollegeSelect
                    id="student-college-select"
                    value={collegeName}
                    onChange={(selectedName) => {
                      setCollegeName(selectedName);
                      if (errors.collegeName) setErrors({ ...errors, collegeName: '' });
                    }}
                    customCollegeValue={customCollege}
                    onCustomCollegeChange={(customVal) => {
                      setCustomCollege(customVal);
                      if (errors.collegeName) setErrors({ ...errors, collegeName: '' });
                    }}
                    required
                    error={errors.collegeName}
                    placeholder="-- Select or Search Your College / Institute --"
                    helperText="Explicitly select your institution from Jaipur B.Tech Colleges or National list, or choose Other to enter manually."
                  />
                </div>

                {/* Degree / Program */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Degree / Program
                  </label>
                  <select
                    id="student-degree-select"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="B.Tech / B.E.">B.Tech / B.E. (Bachelor of Technology)</option>
                    <option value="M.Tech / M.E.">M.Tech / M.E. (Master of Technology)</option>
                    <option value="MCA">MCA (Master of Computer Applications)</option>
                    <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                    <option value="B.Sc (Computer Science / IT)">B.Sc (Computer Science / IT)</option>
                    <option value="M.Sc (Data Science / AI)">M.Sc (Data Science / AI)</option>
                    <option value="Dual Degree (B.Tech + M.Tech)">Dual Degree (B.Tech + M.Tech)</option>
                    <option value="Diploma in Engineering">Diploma in Engineering</option>
                  </select>
                </div>

                {/* Branch / Discipline */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Branch / Major
                  </label>
                  <select
                    id="student-branch-select"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Computer Science and Engineering">Computer Science and Engineering (CSE)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="Artificial Intelligence and Data Science">AI & Data Science (AI/DS)</option>
                    <option value="Electronics and Communication Engineering">Electronics & Communication (ECE)</option>
                    <option value="Electrical and Electronics Engineering">Electrical & Electronics (EEE)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Robotics and Automation">Robotics & Automation</option>
                  </select>
                </div>

                {/* Graduation Year */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Graduation Year
                  </label>
                  <select
                    id="student-grad-year-select"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026 (Upcoming Batch)</option>
                    <option value={2027}>2027</option>
                    <option value={2028}>2028</option>
                  </select>
                </div>

                {/* CGPA (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    CGPA / Percentage <span className="text-slate-400 font-normal">(Optional, e.g. 8.5)</span>
                  </label>
                  <input
                    id="student-cgpa-input"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="e.g. 8.45 (out of 10)"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Career Targets & Placement Preferences */}
            <div className="space-y-4">
              <div className="border-b border-slate-700/80 pb-3 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">2. Career Targets & Placement Preferences</h2>
                  <p className="text-xs text-slate-400">Define your primary career goals to drive personalized opportunity matching.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Target Role */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Role / Career Focus <span className="text-rose-400">*</span>
                  </label>
                  <select
                    id="student-target-role-select"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CAREER_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r === 'OTHER' ? 'Other Custom Role' : r}
                      </option>
                    ))}
                  </select>

                  {targetRole === 'OTHER' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Enter your target role title (e.g. Embedded Firmware Engineer)"
                        value={customTargetRole}
                        onChange={(e) => setCustomTargetRole(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>

                {/* Target Opportunity Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Opportunity Interest
                  </label>
                  <select
                    value={targetOpportunityType}
                    onChange={(e) => setTargetOpportunityType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Both">Both Internships & Full-time Jobs</option>
                    <option value="Internship">Internships Only</option>
                    <option value="Placement / Full-time Job">Campus Placement / Full-Time Jobs Only</option>
                  </select>
                </div>

                {/* Preferred Work Mode */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Work Mode
                  </label>
                  <select
                    value={preferredWorkMode}
                    onChange={(e) => setPreferredWorkMode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="No Preference">No Preference (Open to All)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                {/* Target Industry Domain */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Industry Domain
                  </label>
                  <select
                    value={careerDomain}
                    onChange={(e) => setCareerDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CAREER_DOMAINS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Preferred Locations */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Location(s) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, Hyderabad, Pune, Remote"
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Technical Skills */}
            <div className="space-y-4">
              <div className="border-b border-slate-700/80 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">3. Technical & Professional Skills</h2>
                    <p className="text-xs text-slate-400">Select popular skills or add your own specialized competencies.</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full">
                  {skills.length} Selected
                </span>
              </div>

              {/* Quick Select Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Quick Select Common Skills:
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS迷.map((sk) => {
                    const isSelected = skills.some(s => s.name.toLowerCase() === sk.toLowerCase());
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => handleTogglePresetSkill(sk)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-xs font-bold'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3 inline mr-1 text-white" />}
                        {sk}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Skill Adder */}
              <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3.5 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Add Custom Skill / Framework:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="student-custom-skill-input"
                    type="text"
                    placeholder="e.g. PyTorch, Rust, Kubernetes, GraphQL"
                    value={customSkillName}
                    onChange={(e) => setCustomSkillName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSkillnest();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    value={customSkillProficiency}
                    onChange={(e) => setCustomSkillProficiency(e.target.value as any)}
                    className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCustomSkillnest}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    className="bg-indigo-950/70 border-indigo-700/60 text-indigo-300 hover:bg-indigo-900 cursor-pointer"
                  >
                    Add Skill
                  </Button>
                </div>

                {/* Selected Skills List */}
                {skills.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 text-xs font-semibold"
                      >
                        <span>{s.name}</span>
                        <span className="text-[10px] text-indigo-400 font-normal">({s.proficiency})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s.id)}
                          className="text-slate-400 hover:text-rose-400 ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Projects & Certifications (Optional) */}
            <div className="space-y-4">
              <div className="border-b border-slate-700/80 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">4. Projects & Certifications</h2>
                    <p className="text-xs text-slate-400">Add notable projects or verified credentials (optional).</p>
                  </div>
                </div>
              </div>

              {/* Projects Sub-section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Key Projects ({projects.length})</span>
                  <button
                    type="button"
                    onClick={() => setShowAddProject(!showAddProject)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {showAddProject ? 'Cancel' : 'Add Project'}
                  </button>
                </div>

                {showAddProject && (
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Project Title (e.g. AI-Powered Healthcare Diagnostics)"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <textarea
                      rows={2}
                      placeholder="Brief overview of problem solved and impact..."
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Technologies used (comma separated, e.g. React, Python, FastAPI)"
                      value={newProjectTech}
                      onChange={(e) => setNewProjectTech(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <Button size="sm" variant="primary" type="button" onClick={handleAddProject}>
                        Save Project
                      </Button>
                    </div>
                  </div>
                )}

                {projects.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{p.description}</p>
                      {p.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {p.techStack.map(t => (
                            <span key={t} className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setProjects(projects.filter(proj => proj.id !== p.id))}
                      className="text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Certifications Sub-section */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Certifications ({certifications.length})</span>
                  <button
                    type="button"
                    onClick={() => setShowAddCert(!showAddCert)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {showAddCert ? 'Cancel' : 'Add Certification'}
                  </button>
                </div>

                {showAddCert && (
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Certification Title (e.g. AWS Certified Cloud Practitioner)"
                      value={newCertTitle}
                      onChange={(e) => setNewCertTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Issuing Organization (e.g. Amazon Web Services / Coursera / NPTEL)"
                      value={newCertIssuer}
                      onChange={(e) => setNewCertIssuer(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-[11px] text-amber-400/90 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Certificates will be recorded as "Not Submitted" until you upload proof files in your Certificates portal.
                    </p>
                    <div className="flex justify-end gap-2 pt-1">
                      <Button size="sm" variant="primary" type="button" onClick={handleAddCertification}>
                        Save Certificate
                      </Button>
                    </div>
                  </div>
                )}

                {certifications.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.title}</h4>
                      <p className="text-[11px] text-slate-400">{c.issuer} • <span className="text-amber-400">Not Submitted</span></p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCertifications(certifications.filter(cert => cert.id !== c.id))}
                      className="text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Resume Upload (Optional) */}
            <div className="space-y-3">
              <div className="border-b border-slate-700/80 pb-3 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-sky-600/20 text-sky-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">5. Resume (Optional)</h2>
                  <p className="text-xs text-slate-400">Attach your CV/Resume for AI-powered keyword analysis & gap detection.</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/70 rounded-xl p-6 text-center transition-all bg-slate-900/50">
                <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-300">
                  {resumeFileName ? (
                    <span className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> {resumeFileName}
                    </span>
                  ) : (
                    'Click or drag & drop your PDF / DOCX resume here'
                  )}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Supports PDF, DOCX up to 5MB</p>
                <label className="mt-3 inline-block">
                  <span className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-bold text-slate-200 cursor-pointer transition-colors">
                    {resumeFileName ? 'Change Resume' : 'Browse File'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Submit & Complete Onboarding Button */}
            <div className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                All profile entries can be updated anytime from your dashboard.
              </span>
              <Button
                id="btn-complete-student-onboarding"
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Complete Profile & Enter Dashboard
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

