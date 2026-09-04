import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { StudentProfile, FacultyProfile, MentorProfile, TrainingProgram } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Input, Select } from '../common/Input';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Github, 
  Mail, 
  Phone, 
  Users, 
  BookOpen, 
  SlidersHorizontal,
  Eye,
  UserCheck,
  Sparkles,
  X,
  ChevronDown,
  Briefcase
} from 'lucide-react';

interface FacultyStudentsViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const FacultyStudentsView: React.FC<FacultyStudentsViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const faculty = user as FacultyProfile;

  // Data
  const [students, setStudents] = useState<StudentProfile[]>(() => StorageService.getStudents());
  const [mentors] = useState<MentorProfile[]>(() => StorageService.getMentors());
  const [trainingPrograms] = useState<TrainingProgram[]>(() => StorageService.getTrainingPrograms());
  const [placements] = useState(() => StorageService.getPlacements());

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [gradYearFilter, setGradYearFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');
  const [proficiencyFilter, setProficiencyFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'cgpa' | 'completion' | 'name' | 'verifiedSkills'>('cgpa');

  // Modals
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [assigningMentorStudent, setAssigningMentorStudent] = useState<StudentProfile | null>(null);
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');

  const [recommendingTrainingStudent, setRecommendingTrainingStudent] = useState<StudentProfile | null>(null);
  const [selectedTrainingId, setSelectedTrainingId] = useState('');

  // Filtered & Sorted Student Pool
  const filteredStudents = useMemo(() => {
    return students.filter(st => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = st.fullName.toLowerCase().includes(q);
        const matchesEmail = st.email.toLowerCase().includes(q);
        const matchesSkills = st.skills.some(s => s.name.toLowerCase().includes(q));
        const matchesProjects = st.projects.some(p => p.technologies.some(t => t.toLowerCase().includes(q)));
        if (!matchesName && !matchesEmail && !matchesSkills && !matchesProjects) return false;
      }

      // Branch
      if (branchFilter !== 'All' && st.branch !== branchFilter) return false;

      // Grad Year
      if (gradYearFilter !== 'All' && st.graduationYear.toString() !== gradYearFilter) return false;

      // Skill & Proficiency
      if (skillFilter !== 'All') {
        const hasSkill = st.skills.some(s => {
          if (s.name !== skillFilter) return false;
          if (proficiencyFilter !== 'All' && s.proficiency !== proficiencyFilter) return false;
          return true;
        });
        if (!hasSkill) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'cgpa') return b.cgpa - a.cgpa;
      if (sortBy === 'completion') return b.profileCompletion - a.profileCompletion;
      if (sortBy === 'verifiedSkills') {
        const aVerified = a.skills.filter(s => s.verified).length;
        const bVerified = b.skills.filter(s => s.verified).length;
        return bVerified - aVerified;
      }
      return a.fullName.localeCompare(b.fullName);
    });
  }, [students, searchQuery, branchFilter, gradYearFilter, skillFilter, proficiencyFilter, sortBy]);

  // Handle Mentor Assignment
  const handleAssignMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningMentorStudent || !selectedMentorId) {
      addToast('error', 'Select Mentor', 'Please select an industry mentor from the directory.');
      return;
    }

    const mentor = mentors.find(m => m.id === selectedMentorId);
    if (!mentor) return;

    StorageService.assignMentor({
      id: `ment-${Date.now()}`,
      mentorId: mentor.id,
      mentorName: mentor.fullName,
      mentorEmail: mentor.email,
      mentorOrganization: mentor.organization,
      studentId: assigningMentorStudent.id,
      studentName: assigningMentorStudent.fullName,
      studentEmail: assigningMentorStudent.email,
      studentCollege: assigningMentorStudent.collegeName,
      studentBranch: assigningMentorStudent.branch,
      assignedBy: `${faculty?.fullName || 'Faculty HOD'} (${faculty?.department || 'CSE'})`,
      assignedAt: new Date().toISOString(),
      status: 'Active',
      notes: assignmentNote.trim() || 'Technical mentorship, code reviews, and mock interview guidance.'
    });

    addToast('success', 'Mentor Assigned! 🤝', `${mentor.fullName} assigned to ${assigningMentorStudent.fullName}.`);
    setAssigningMentorStudent(null);
    setSelectedMentorId('');
    setAssignmentNote('');
  };

  // Handle Training Recommendation
  const handleRecommendTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recommendingTrainingStudent || !selectedTrainingId) {
      addToast('error', 'Select Program', 'Please select a training program.');
      return;
    }

    const prog = trainingPrograms.find(p => p.id === selectedTrainingId);
    if (!prog) return;

    StorageService.addNotification({
      id: `notif-rec-${Date.now()}`,
      userId: recommendingTrainingStudent.id,
      title: `Faculty Recommendation: ${prog.title} 🎓`,
      message: `${faculty?.fullName || 'Department Faculty'} specifically recommended you enroll in "${prog.title}" to prepare for upcoming campus recruitment drives.`,
      type: 'recommendation',
      read: false,
      createdAt: new Date().toISOString()
    });

    addToast('success', 'Recommendation Sent! 📬', `Notified ${recommendingTrainingStudent.fullName} to enroll in ${prog.title}.`);
    setRecommendingTrainingStudent(null);
    setSelectedTrainingId('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Student Talent Management</h2>
            <Badge variant="primary">{filteredStudents.length} Students</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Department-wide student directory with verified skill scores, academic performance, and mentorship pairings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateTab && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigateTab('skill-analytics')}
              leftIcon={<Award className="w-4 h-4 text-indigo-600" />}
            >
              Institutional Skill Gaps
            </Button>
          )}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, skills, tech..."
                className="pl-9 text-xs"
              />
            </div>

            {/* Branch Filter */}
            <div>
              <Select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'All Branches' },
                  { value: 'Computer Science and Engineering', label: 'Computer Science & Eng' },
                  { value: 'Information Technology', label: 'Information Technology' },
                  { value: 'Electronics and Communication', label: 'Electronics & Comm' }
                ]}
              />
            </div>

            {/* Graduation Year */}
            <div>
              <Select
                value={gradYearFilter}
                onChange={(e) => setGradYearFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'All Batches' },
                  { value: '2026', label: 'Class of 2026 (Final Year)' },
                  { value: '2027', label: 'Class of 2027 (Pre-Final Year)' }
                ]}
              />
            </div>

            {/* Sort Order */}
            <div>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                options={[
                  { value: 'cgpa', label: 'Sort by CGPA (High to Low)' },
                  { value: 'verifiedSkills', label: 'Sort by Verified Skills' },
                  { value: 'completion', label: 'Sort by Profile Completion' },
                  { value: 'name', label: 'Sort by Name (A-Z)' }
                ]}
              />
            </div>
          </div>

          {/* Quick Skill Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Quick Skill:
            </span>
            {['All', 'React.js', 'Node.js', 'SQL & PostgreSQL', 'Docker & Kubernetes', 'Python', 'Go (Golang)'].map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => setSkillFilter(skill)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                  skillFilter === skill
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 p-8">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No students match current filters</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing or adjusting the search term or skill criteria.</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setBranchFilter('All');
                setGradYearFilter('All');
                setSkillFilter('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredStudents.map(student => {
            const verifiedSkillsCount = student.skills.filter(s => s.verified).length;
            const placementRecord = placements.find(p => p.studentId === student.id);

            return (
              <Card key={student.id} className="hover:border-indigo-200 transition-shadow">
                <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                  {/* Top: Avatar & Info */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={student.fullName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer" onClick={() => setSelectedStudent(student)}>
                            {student.fullName}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium">{student.branch}</p>
                          <p className="text-[10px] text-slate-400">Class of {student.graduationYear} • {student.collegeName}</p>
                        </div>
                      </div>

                      {placementRecord ? (
                        <Badge variant="success" className="shrink-0 text-[10px]">
                          Placed ({placementRecord.packageLpa} LPA)
                        </Badge>
                      ) : (
                        <Badge variant="default" className="shrink-0 text-[10px]">
                          CGPA: {student.cgpa}
                        </Badge>
                      )}
                    </div>

                    {/* Verified & Target Skills */}
                    <div className="mt-3">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Skills & Badges</span>
                        <span className="text-indigo-600">{verifiedSkillsCount} Verified</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {student.skills.slice(0, 4).map(sk => (
                          <span
                            key={sk.id}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
                              sk.verified 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {sk.verified && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                            {sk.name}
                          </span>
                        ))}
                        {student.skills.length > 4 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                            +{student.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats & Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Profile: <b className="text-slate-800">{student.profileCompletion}%</b></span>
                      <span>Projects: <b className="text-slate-800">{student.projects.length}</b></span>
                      <span>Certs: <b className="text-slate-800">{student.certifications.length}</b></span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => setSelectedStudent(student)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Inspect Dossier
                      </Button>

                      <Button
                        size="sm"
                        variant="primary"
                        className="w-full text-xs"
                        onClick={() => setAssigningMentorStudent(student)}
                        leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                      >
                        Assign Mentor
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* MODAL 1: Inspect Student Dossier */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedStudent.fullName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedStudent.fullName}</h3>
                  <p className="text-xs text-slate-500">{selectedStudent.email} • {selectedStudent.phone || 'Phone verified'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Academic Overview */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">CGPA</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedStudent.cgpa}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Graduation Year</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{selectedStudent.graduationYear}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Branch</p>
                  <p className="text-xs font-bold text-slate-900 mt-1 truncate">{selectedStudent.branch}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Profile Score</p>
                  <p className="text-base font-bold text-emerald-600 mt-0.5">{selectedStudent.profileCompletion}%</p>
                </div>
              </div>

              {/* Verified Skills Matrix */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Skill Breakdown & Verification</span>
                  <span className="text-indigo-600 font-medium">{selectedStudent.skills.length} Total</span>
                </h4>
                <div className="space-y-2">
                  {selectedStudent.skills.map(sk => (
                    <div key={sk.id} className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        {sk.verified ? (
                          <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-md bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-bold">
                            ○
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-900">{sk.name}</p>
                          <p className="text-[10px] text-slate-400">{sk.category} • {sk.yearsOfExperience || 1} yr exp</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={sk.proficiency === 'Expert' ? 'success' : sk.proficiency === 'Advanced' ? 'primary' : 'default'}>
                          {sk.proficiency}
                        </Badge>
                        {sk.verified && (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {sk.verifiedScore}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Technical Projects ({selectedStudent.projects.length})</h4>
                <div className="space-y-3">
                  {selectedStudent.projects.map(proj => (
                    <div key={proj.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-slate-900">{proj.title}</h5>
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 flex items-center gap-1 text-[11px]">
                            <Github className="w-3.5 h-3.5" /> Code
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setRecommendingTrainingStudent(selectedStudent);
                    setSelectedStudent(null);
                  }}
                  leftIcon={<BookOpen className="w-4 h-4 text-indigo-600" />}
                >
                  Recommend Training
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setAssigningMentorStudent(selectedStudent);
                    setSelectedStudent(null);
                  }}
                  leftIcon={<UserCheck className="w-4 h-4" />}
                >
                  Assign Industry Mentor
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Assign Mentor */}
      {assigningMentorStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Assign Industry Mentor</h3>
                <p className="text-xs text-slate-500">Pairing mentee: <b className="text-slate-800">{assigningMentorStudent.fullName}</b></p>
              </div>
              <button onClick={() => setAssigningMentorStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignMentor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Verified Industry Mentor <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={selectedMentorId}
                  onChange={(e) => setSelectedMentorId(e.target.value)}
                  options={[
                    { value: '', label: '-- Choose Industry Mentor --' },
                    ...mentors.map(m => ({
                      value: m.id,
                      label: `${m.fullName} — ${m.title} (${m.organization}) [${m.availability}]`
                    }))
                  ]}
                  required
                />
              </div>

              {selectedMentorId && (
                <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-3 text-xs space-y-1 text-indigo-950">
                  {(() => {
                    const m = mentors.find(item => item.id === selectedMentorId);
                    if (!m) return null;
                    const match = StorageService.calculateMentorMatch(assigningMentorStudent, m);
                    return (
                      <>
                        <div className="flex items-center justify-between font-bold">
                          <span>Deterministic Skill Match:</span>
                          <span className="text-indigo-700">{match.matchScore}% Compatibility</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{match.explanation}</p>
                      </>
                    );
                  })()}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mentorship Directives & Focus Notes
                </label>
                <Input
                  value={assignmentNote}
                  onChange={(e) => setAssignmentNote(e.target.value)}
                  placeholder="e.g. Focus on PostgreSQL indexing, distributed caches, and mock system design."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setAssigningMentorStudent(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit" leftIcon={<UserCheck className="w-4 h-4" />}>
                  Confirm Mentorship Assignment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Recommend Training */}
      {recommendingTrainingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recommend Upskilling Program</h3>
                <p className="text-xs text-slate-500">Student: <b className="text-slate-800">{recommendingTrainingStudent.fullName}</b></p>
              </div>
              <button onClick={() => setRecommendingTrainingStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecommendTraining} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Choose Training Bootcamp <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={selectedTrainingId}
                  onChange={(e) => setSelectedTrainingId(e.target.value)}
                  options={[
                    { value: '', label: '-- Select Training Program --' },
                    ...trainingPrograms.map(p => ({
                      value: p.id,
                      label: `${p.title} (${p.skillName}, ${p.duration})`
                    }))
                  ]}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setRecommendingTrainingStudent(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit" leftIcon={<BookOpen className="w-4 h-4" />}>
                  Send Recommendation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
