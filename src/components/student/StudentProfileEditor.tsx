import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StudentProfile, StudentEducation, StudentProject, StudentCertification } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Input, Textarea } from '../common/Input';
import { Badge, ProficiencyBadge } from '../common/Badge';
import { ResumeAnalyzerModal } from '../ai/ResumeAnalyzerModal';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Award, 
  FileText, 
  Globe, 
  Github, 
  Linkedin, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Upload, 
  CheckCircle2, 
  ExternalLink,
  Download,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Target,
  Compass
} from 'lucide-react';

interface StudentProfileEditorProps {
  onNavigateTab: (tabId: string) => void;
}

export const StudentProfileEditor: React.FC<StudentProfileEditorProps> = ({ onNavigateTab }) => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const student = user as StudentProfile;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<StudentProfile>(() => JSON.parse(JSON.stringify(student)));
  
  // Project Modal State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<StudentProject | null>(null);
  const [projectForm, setProjectForm] = useState<StudentProject>({
    id: '',
    title: '',
    description: '',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    startDate: '',
    endDate: ''
  });
  const [techInput, setTechInput] = useState('');

  // Certification Modal State
  const [showCertModal, setShowCertModal] = useState(false);
  const [certForm, setCertForm] = useState<StudentCertification>({
    id: '',
    title: '',
    issuer: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: ''
  });

  // Education Modal State
  const [showEduModal, setShowEduModal] = useState(false);
  const [eduForm, setEduForm] = useState<StudentEducation>({
    id: '',
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startYear: 2022,
    endYear: 2026,
    grade: '',
    current: false
  });

  // Resume Upload State
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [showResumeAIModal, setShowResumeAIModal] = useState(false);

  if (!student) return null;

  const handleSaveProfile = async () => {
    // Basic Validation
    if (!formData.fullName.trim()) {
      addToast('error', 'Validation Error', 'Full name is required.');
      return;
    }
    if (!formData.collegeName.trim()) {
      addToast('error', 'Validation Error', 'College name is required.');
      return;
    }
    if (formData.cgpa < 0 || formData.cgpa > 10) {
      addToast('error', 'Validation Error', 'CGPA must be between 0.0 and 10.0');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      addToast('success', 'Profile Updated', 'Your student profile has been saved successfully.');
    } catch (err: any) {
      addToast('error', 'Save Failed', err.message || 'Could not update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(JSON.parse(JSON.stringify(student)));
    setIsEditing(false);
  };

  // Resume Upload Handler (Simulated Supabase Storage upload)
  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      addToast('error', 'Invalid File Format', 'Please upload a PDF document (.pdf).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('error', 'File Too Large', 'Resume file size must be less than 5MB.');
      return;
    }

    setIsUploadingResume(true);
    setTimeout(async () => {
      const updated: StudentProfile = {
        ...formData,
        resumeFileName: file.name,
        resumeUrl: URL.createObjectURL(file),
        resumeUploadedAt: new Date().toISOString()
      };
      setFormData(updated);
      await updateProfile(updated);
      setIsUploadingResume(false);
      addToast('success', 'Resume Uploaded', `${file.name} saved to your profile.`);
    }, 800);
  };

  // Project Handlers
  const handleSaveProject = () => {
    if (!projectForm.title.trim()) {
      addToast('error', 'Project Title Required', 'Please enter a valid project title.');
      return;
    }

    const techs = techInput.split(',').map(t => t.trim()).filter(Boolean);
    const finalizedProj: StudentProject = {
      ...projectForm,
      id: projectForm.id || `proj-${Date.now()}`,
      technologies: techs.length > 0 ? techs : projectForm.technologies
    };

    let updatedProjects = [...(formData.projects || [])];
    if (editingProject) {
      updatedProjects = updatedProjects.map(p => p.id === finalizedProj.id ? finalizedProj : p);
    } else {
      updatedProjects.push(finalizedProj);
    }

    const updated = { ...formData, projects: updatedProjects };
    setFormData(updated);
    updateProfile(updated);
    setShowProjectModal(false);
    setEditingProject(null);
    addToast('success', 'Project Saved', `Project "${finalizedProj.title}" has been updated.`);
  };

  const handleDeleteProject = (id: string) => {
    const updated = {
      ...formData,
      projects: (formData.projects || []).filter(p => p.id !== id)
    };
    setFormData(updated);
    updateProfile(updated);
    addToast('info', 'Project Removed', 'Project has been removed from your profile.');
  };

  // Certification Handlers
  const handleSaveCert = () => {
    if (!certForm.title.trim() || !certForm.issuer.trim()) {
      addToast('error', 'Required Fields', 'Please enter certification title and issuer.');
      return;
    }

    const finalizedCert: StudentCertification = {
      ...certForm,
      id: certForm.id || `cert-${Date.now()}`
    };

    const updatedCerts = [...(formData.certifications || []), finalizedCert];
    const updated = { ...formData, certifications: updatedCerts };
    setFormData(updated);
    updateProfile(updated);
    setShowCertModal(false);
    addToast('success', 'Certification Added', `${finalizedCert.title} added.`);
  };

  const handleDeleteCert = (id: string) => {
    const updated = {
      ...formData,
      certifications: (formData.certifications || []).filter(c => c.id !== id)
    };
    setFormData(updated);
    updateProfile(updated);
    addToast('info', 'Certification Removed', 'Certification removed.');
  };

  // Education Handlers
  const handleSaveEdu = () => {
    if (!eduForm.institution.trim() || !eduForm.degree.trim()) {
      addToast('error', 'Required Fields', 'Please specify institution and degree.');
      return;
    }

    const finalizedEdu: StudentEducation = {
      ...eduForm,
      id: eduForm.id || `edu-${Date.now()}`
    };

    const currentHistory = formData.educationHistory || [];
    const updatedHistory = [...currentHistory, finalizedEdu];
    const updated = { ...formData, educationHistory: updatedHistory };
    setFormData(updated);
    updateProfile(updated);
    setShowEduModal(false);
    addToast('success', 'Education Record Added', `${finalizedEdu.degree} added.`);
  };

  const handleDeleteEdu = (id: string) => {
    const updated = {
      ...formData,
      educationHistory: (formData.educationHistory || []).filter(e => e.id !== id)
    };
    setFormData(updated);
    updateProfile(updated);
    addToast('info', 'Education Record Removed', 'Education record removed.');
  };

  return (
    <div className="space-y-6">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-dashboard"
          type="button"
          onClick={() => onNavigateTab('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Header Profile Title Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={formData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={formData.fullName}
              className="w-20 h-20 rounded-2xl border-2 border-slate-200 object-cover shadow-xs"
            />
            {formData.skills?.some(s => s.verified) && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs" title="Verified Skill Assessments">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{formData.fullName || 'Not provided'}</h2>
              <Badge variant="primary">Student Profile</Badge>
              {formData.graduationYear ? <Badge variant="success">{formData.graduationYear} Batch</Badge> : null}
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              <span>{formData.degree ? `${formData.degree} • ` : ''}{formData.branch || 'Branch not specified'}</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {formData.collegeName || 'College: Not provided'} • CGPA: <strong className="text-slate-800">{formData.cgpa > 0 ? formData.cgpa : '—'}</strong> / 10
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Profile Completion Meter */}
          <div className="hidden sm:block text-right pr-3 border-r border-slate-200">
            <div className="flex items-center gap-1.5 justify-end text-xs font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Completion: {formData.profileCompletion || 0}%</span>
            </div>
            <div className="w-32 bg-slate-200 rounded-full h-1.5 mt-1 ml-auto">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all"
                style={{ width: `${formData.profileCompletion || 0}%` }}
              />
            </div>
          </div>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleCancel} leftIcon={<X className="w-3.5 h-3.5" />}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" isLoading={isSaving} onClick={handleSaveProfile} leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save Changes
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="primary" onClick={() => setIsEditing(true)} leftIcon={<Edit2 className="w-3.5 h-3.5" />}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Grid Layout for Profile Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Details, Education, Projects */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Career Targets & Placement Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Career Targets & Preferences</h3>
                </div>
                <Badge variant="primary" size="sm">Powers AI Recommendations</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Target Job / Internship Role"
                    value={formData.targetRole || formData.careerGoal || ''}
                    placeholder="e.g. Full Stack Developer, Data Scientist, DevOps Engineer"
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value, careerGoal: e.target.value })}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Career Domain / Track
                    </label>
                    <select
                      value={formData.careerDomain || 'Software Development & Web'}
                      onChange={(e) => setFormData({ ...formData, careerDomain: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Software Development & Web">Software Development & Web</option>
                      <option value="AI / Machine Learning & Data Science">AI / Machine Learning & Data Science</option>
                      <option value="Cloud, DevOps & Cybersecurity">Cloud, DevOps & Cybersecurity</option>
                      <option value="Mobile App Development (Android/iOS)">Mobile App Development (Android/iOS)</option>
                      <option value="Embedded Systems, IoT & Robotics">Embedded Systems, IoT & Robotics</option>
                      <option value="Core Engineering (Mechanical/Civil/Electrical)">Core Engineering (Mechanical/Civil/Electrical)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Target Opportunity Type
                    </label>
                    <select
                      value={formData.targetOpportunityType || 'Both'}
                      onChange={(e) => setFormData({ ...formData, targetOpportunityType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Internship">Internship (Summer / Pre-Final / Final Year)</option>
                      <option value="Job">Full-time Campus Placement / Graduate Job</option>
                      <option value="Both">Open to Both Internships & Full-time Jobs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Preferred Work Mode
                    </label>
                    <select
                      value={formData.preferredWorkMode || 'Hybrid'}
                      onChange={(e) => setFormData({ ...formData, preferredWorkMode: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="In-office">In-office (On-site)</option>
                      <option value="Remote">Remote (Work from Anywhere)</option>
                      <option value="Hybrid">Hybrid (Flexible)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Target Role</span>
                    <span className="font-bold text-indigo-700 text-xs mt-0.5 block">{formData.targetRole || formData.careerGoal || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Domain</span>
                    <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{formData.careerDomain || 'General Engineering'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Opportunity</span>
                    <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{formData.targetOpportunityType || 'Both'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Work Mode</span>
                    <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{formData.preferredWorkMode || 'Hybrid'}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Personal & Bio Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Personal & Academic Bio</h3>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      disabled
                      helperText="Official university login email"
                    />
                    <Input
                      label="Phone Number"
                      value={formData.phone || ''}
                      placeholder="+91 98765 43210"
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <Input
                      label="Current Location"
                      value={formData.location || ''}
                      placeholder="e.g. New Delhi, India"
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                    <Input
                      label="Profile Photo URL"
                      value={formData.avatarUrl || ''}
                      placeholder="https://..."
                      onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    />
                    <Input
                      label="Graduation Year"
                      type="number"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2026 })}
                    />
                  </div>

                  <Textarea
                    label="Professional Bio / Summary"
                    rows={3}
                    value={formData.bio || ''}
                    placeholder="Brief summary of your skills, career objectives, and technical interests..."
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                    {formData.bio || 'No professional bio added yet.'}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Email</span>
                      <span className="font-semibold text-slate-800">{formData.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Phone</span>
                      <span className="font-semibold text-slate-800">{formData.phone || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Location</span>
                      <span className="font-semibold text-slate-800">{formData.location || 'India'}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Education Records */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Education History</h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setEduForm({
                      id: '',
                      institution: '',
                      degree: '',
                      fieldOfStudy: '',
                      startYear: 2022,
                      endYear: 2026,
                      grade: '',
                      current: false
                    });
                    setShowEduModal(true);
                  }}
                >
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {/* Primary College Details */}
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{formData.collegeName || 'College: Not provided'}</h4>
                    <Badge variant="primary" size="sm">Primary Degree</Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {formData.degree ? `${formData.degree} in ` : ''}{formData.branch || 'Branch not specified'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Batch: {formData.graduationYear || '—'} • Cumulative CGPA: <strong className="text-indigo-700">{formData.cgpa > 0 ? formData.cgpa : '—'}</strong> / 10
                  </p>
                </div>
              </div>

              {/* Additional Education Entries */}
              {formData.educationHistory?.map((edu) => (
                <div key={edu.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{edu.institution}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{edu.degree} • {edu.fieldOfStudy}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {edu.startYear} - {edu.endYear} • Score: <strong className="text-slate-800">{edu.grade}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteEdu(edu.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Remove entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section 3: Technical Projects Portfolio */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Technical Projects ({formData.projects?.length || 0})</h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm({
                      id: '',
                      title: '',
                      description: '',
                      technologies: [],
                      githubUrl: '',
                      liveUrl: ''
                    });
                    setTechInput('');
                    setShowProjectModal(true);
                  }}
                >
                  Add Project
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {(!formData.projects || formData.projects.length === 0) ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No projects added yet. Click "Add Project" to showcase your builds to recruiters.
                </div>
              ) : (
                formData.projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                            title="GitHub Repository"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg border border-slate-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies?.map((tech, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Resume, Skills, Certifications, Links */}
        <div className="space-y-6">

          {/* Resume Upload Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Resume / CV Document</h3>
                </div>
                <button
                  onClick={() => setShowResumeAIModal(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyze with AI
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {formData.resumeFileName ? (
                <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{formData.resumeFileName}</p>
                      <p className="text-[10px] text-slate-500">
                        Uploaded on {formData.resumeUploadedAt ? new Date(formData.resumeUploadedAt).toLocaleDateString() : 'Active'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-indigo-100/80">
                    <a
                      href={formData.resumeUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center justify-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      View / Download
                    </a>
                    <label className="flex-1 text-center py-1.5 px-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 cursor-pointer">
                      Replace PDF
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleResumeFileChange}
                      />
                    </label>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => setShowResumeAIModal(true)}
                      className="w-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Run AI ATS & Skill Extraction Review
                    </button>
                    <button
                      onClick={() => onNavigateTab('resume-builder')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Open AI Resume Builder (from Profile)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2 hover:border-indigo-300 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-800">Upload your PDF Resume or Build One</p>
                  <p className="text-[11px] text-slate-500">Max size: 5MB (PDF format only)</p>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                    <label className="inline-block">
                      <span className="py-1.5 px-3 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 cursor-pointer">
                        Browse Files
                      </span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleResumeFileChange}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowResumeAIModal(true)}
                      className="py-1.5 px-3 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-lg hover:bg-indigo-100 cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      AI Analyzer
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('resume-builder')}
                      className="py-1.5 px-3 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3" />
                      AI Resume Builder
                    </button>
                  </div>
                </div>
              )}

              {isUploadingResume && (
                <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium justify-center">
                  <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span>Syncing with Cloud Storage...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Skills Summary Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Mapped Skills ({formData.skills?.length || 0})</h3>
                </div>
                <Button size="sm" variant="outline" onClick={() => onNavigateTab('skills')}>
                  Taxonomy
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {(!formData.skills || formData.skills.length === 0) ? (
                <p className="text-xs text-slate-400 text-center py-2">No skills mapped yet</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {formData.skills.map((sk) => (
                    <div
                      key={sk.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                    >
                      <span className="font-semibold text-slate-800">{sk.name}</span>
                      <ProficiencyBadge level={sk.proficiency} />
                      {sk.verified && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold">
                          {sk.verifiedScore}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certifications Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Certifications</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                    onClick={() => onNavigateTab('certificates')}
                  >
                    Verification Vault
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setCertForm({
                        id: '',
                        title: '',
                        issuer: '',
                        issueDate: '',
                        credentialId: '',
                        credentialUrl: ''
                      });
                      setShowCertModal(true);
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {(!formData.certifications || formData.certifications.length === 0) ? (
                <p className="text-xs text-slate-400 text-center py-2">No certifications added</p>
              ) : (
                formData.certifications.map((cert) => (
                  <div key={cert.id} className="p-3 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{cert.title}</h4>
                      <p className="text-[11px] text-slate-600">{cert.issuer} • Issued {cert.issueDate}</p>
                      {cert.credentialId && (
                        <p className="text-[10px] text-slate-400 mt-0.5">ID: {cert.credentialId}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteCert(cert.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Social & Portfolio Links */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Social & Portfolios</h3>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    label="GitHub URL"
                    value={formData.githubUrl || ''}
                    placeholder="https://github.com/..."
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  />
                  <Input
                    label="LinkedIn URL"
                    value={formData.linkedinUrl || ''}
                    placeholder="https://linkedin.com/in/..."
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  />
                  <Input
                    label="Portfolio Website"
                    value={formData.portfolioUrl || ''}
                    placeholder="https://yourname.dev"
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  />
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {formData.githubUrl && (
                    <a
                      href={formData.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                    >
                      <Github className="w-4 h-4 text-slate-800" />
                      <span className="truncate flex-1">{formData.githubUrl}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                  {formData.linkedinUrl && (
                    <a
                      href={formData.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                    >
                      <Linkedin className="w-4 h-4 text-indigo-600" />
                      <span className="truncate flex-1">{formData.linkedinUrl}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                  {formData.portfolioUrl && (
                    <a
                      href={formData.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                    >
                      <Globe className="w-4 h-4 text-emerald-600" />
                      <span className="truncate flex-1">{formData.portfolioUrl}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button onClick={() => setShowProjectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <Input
                label="Project Title"
                placeholder="e.g. Real-Time Distributed Task Manager"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                required
              />

              <Textarea
                label="Project Description"
                rows={3}
                placeholder="Key architecture, challenges solved, metrics..."
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              />

              <Input
                label="Technologies (Comma separated)"
                placeholder="React, TypeScript, Node.js, PostgreSQL"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="GitHub Repo URL"
                  placeholder="https://github.com/..."
                  value={projectForm.githubUrl || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                />
                <Input
                  label="Live App Demo URL"
                  placeholder="https://..."
                  value={projectForm.liveUrl || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setShowProjectModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveProject}>
                Save Project
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Certification Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Verified Certification</h3>
              <button onClick={() => setShowCertModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <Input
                label="Certification Title"
                placeholder="e.g. AWS Certified Solutions Architect"
                value={certForm.title}
                onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                required
              />

              <Input
                label="Issuing Organization"
                placeholder="e.g. Amazon Web Services, Meta, Coursera"
                value={certForm.issuer}
                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Issue Date"
                  type="date"
                  value={certForm.issueDate}
                  onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                />
                <Input
                  label="Credential ID"
                  placeholder="e.g. AWS-9928"
                  value={certForm.credentialId || ''}
                  onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                />
              </div>

              <Input
                label="Verification URL"
                placeholder="https://coursera.org/verify/..."
                value={certForm.credentialUrl || ''}
                onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setShowCertModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveCert}>
                Add Certification
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {showEduModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Education Record</h3>
              <button onClick={() => setShowEduModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <Input
                label="School / Institution Name"
                placeholder="e.g. Delhi Public School, R.K. Puram"
                value={eduForm.institution}
                onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                required
              />

              <Input
                label="Degree / Certificate"
                placeholder="e.g. Senior Secondary (Class XII CBSE) / Diploma"
                value={eduForm.degree}
                onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                required
              />

              <Input
                label="Field of Study / Stream"
                placeholder="e.g. Science (PCM), CS"
                value={eduForm.fieldOfStudy}
                onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
              />

              <div className="grid grid-cols-3 gap-2">
                <Input
                  label="Start Year"
                  type="number"
                  value={eduForm.startYear}
                  onChange={(e) => setEduForm({ ...eduForm, startYear: parseInt(e.target.value) || 2020 })}
                />
                <Input
                  label="End Year"
                  type="number"
                  value={eduForm.endYear}
                  onChange={(e) => setEduForm({ ...eduForm, endYear: parseInt(e.target.value) || 2022 })}
                />
                <Input
                  label="Grade / %"
                  placeholder="94.6%"
                  value={eduForm.grade}
                  onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setShowEduModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdu}>
                Save Record
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Resume Analyzer Modal */}
      <ResumeAnalyzerModal
        isOpen={showResumeAIModal}
        onClose={() => setShowResumeAIModal(false)}
        student={formData}
        onProfileUpdated={(updated) => {
          setFormData(updated);
          updateProfile(updated);
        }}
      />
    </div>
  );
};
