import { 
  UserProfile, 
  StudentProfile, 
  CompanyProfile,
  FacultyProfile,
  MentorProfile,
  AdminProfile,
  InstitutionProfile,
  UserRole, 
  TaxonomySkill, 
  Opportunity, 
  Application, 
  AssessmentAttempt,
  SkillAssessment,
  AppNotification,
  InterviewSchedule,
  TrainingProgram,
  TrainingRegistration,
  PlacementRecord,
  MentorshipAssignment,
  MentorGoal,
  MentoringSession,
  AIResumeAnalysis,
  AICareerRoadmap,
  AILearningRecommendation,
  AIMockInterviewSession,
  AIDetectedSkill,
  SkillCategory,
  ProficiencyLevel,
  StudentSkill,
  SavedResume,
  IndustryCompany,
  StudentCertification,
  CertificateVerificationStatus,
  UserCourseEnrollment
} from '../types';
import { 
  ALL_DEMO_STUDENTS,
  INITIAL_SKILLS, 
  INITIAL_OPPORTUNITIES, 
  INDUSTRY_COMPANIES,
  INITIAL_APPLICATIONS, 
  INITIAL_ASSESSMENT_ATTEMPTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_INTERVIEWS,
  DEMO_INSTITUTION,
  ALL_DEMO_MENTORS,
  INITIAL_MENTORSHIPS,
  INITIAL_MENTOR_GOALS,
  INITIAL_MENTOR_SESSIONS,
  INITIAL_TRAINING_PROGRAMS,
  INITIAL_TRAINING_REGISTRATIONS,
  INITIAL_PLACEMENTS
} from './mockData';
import { ASSESSMENT_BANK } from './assessmentData';
import { COLLEGES_DATA, CollegeRecord } from '../data/collegesData';

const STORAGE_KEYS = {
  CURRENT_USER: 'sih_current_user',
  ALL_PROFILES: 'sih_all_profiles',
  SKILLS: 'sih_skills_taxonomy',
  OPPORTUNITIES: 'sih_opportunities',
  APPLICATIONS: 'sih_applications',
  ASSESSMENTS: 'sih_assessments',
  ATTEMPTS: 'sih_assessment_attempts',
  NOTIFICATIONS: 'sih_notifications',
  INTERVIEWS: 'sih_interviews',
  STUDENTS_POOL: 'sih_students_pool',
  INSTITUTION: 'sih_institution',
  MENTORS: 'sih_mentors',
  MENTORSHIPS: 'sih_mentorships',
  MENTOR_GOALS: 'sih_mentor_goals',
  MENTOR_SESSIONS: 'sih_mentor_sessions',
  TRAINING_PROGRAMS: 'sih_training_programs',
  TRAINING_REGISTRATIONS: 'sih_training_registrations',
  PLACEMENTS: 'sih_placements',
  AI_RESUME_ANALYSES: 'sih_ai_resume_analyses',
  AI_CAREER_ROADMAPS: 'sih_ai_career_roadmaps',
  AI_LEARNING_RECOMMENDATIONS: 'sih_ai_learning_recommendations',
  AI_MOCK_INTERVIEWS: 'sih_ai_mock_interviews',
  SAVED_RESUMES: 'sih_saved_resumes',
  CERTIFICATES: 'sih_student_certificates',
  COURSE_ENROLLMENTS: 'sih_course_enrollments',
  SAVED_COURSES: 'sih_saved_courses',
  AUTH_SESSION: 'sih_auth_session'
};

export interface AuthSession {
  token: string;
  email: string;
  role: UserRole;
  authenticatedAt: string;
  expiresAt: string;
}

// Helper for LocalStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving to storage key ${key}:`, err);
  }
}

export function calculateProfileCompletion(student: Partial<StudentProfile>): number {
  let score = 0;
  if (student.fullName && student.fullName !== 'Not provided' && student.email) score += 15;
  if (student.phone && student.bio) score += 10;
  if (student.collegeName && student.collegeName !== 'Not provided' && student.degree && student.cgpa && student.cgpa > 0) score += 20;
  if (student.skills && student.skills.length >= 3) score += 20;
  if (student.projects && student.projects.length >= 1) score += 15;
  if (student.certifications && student.certifications.length >= 1) score += 10;
  if (student.resumeFileName && student.resumeFileName.trim() !== '') score += 10;
  return Math.min(100, score);
}

export const StorageService = {
  // Authentication Session
  getAuthSession(): AuthSession | null {
    return getFromStorage<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
  },

  setAuthSession(session: AuthSession | null): void {
    if (session === null) {
      try {
        localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      } catch (err) {
        console.error('Error removing auth session:', err);
      }
    } else {
      saveToStorage(STORAGE_KEYS.AUTH_SESSION, session);
    }
  },

  // Profiles & Users
  getCurrentUser(): UserProfile | null {
    return getFromStorage<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: UserProfile | null): void {
    if (user === null) {
      try {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        this.setAuthSession(null);
      } catch (err) {
        console.error('Error clearing current user:', err);
      }
    } else {
      saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
      this.updateProfile(user);
    }
  },

  getAllProfiles(): Record<string, UserProfile> {
    return getFromStorage<Record<string, UserProfile>>(STORAGE_KEYS.ALL_PROFILES, {});
  },

  getAllUsers(): UserProfile[] {
    const profiles = this.getAllProfiles();
    const roleProfiles = Object.values(profiles) as UserProfile[];
    const poolStudents = this.getStudents();
    const mentors = this.getMentors();
    
    // Combine unique users by id
    const userMap = new Map<string, UserProfile>();
    roleProfiles.forEach(p => {
      if (p && p.id) userMap.set(p.id, p);
    });
    poolStudents.forEach(s => {
      if (s && s.id && !userMap.has(s.id)) userMap.set(s.id, s);
    });
    mentors.forEach(m => {
      if (m && m.id && !userMap.has(m.id)) userMap.set(m.id, m);
    });
    
    return Array.from(userMap.values());
  },

  getProfileById(id: string): UserProfile | null {
    const profiles = this.getAllProfiles();
    const list: UserProfile[] = Object.values(profiles);
    const found = list.find((p) => p.id === id);
    if (found) return found;
    
    // Check students pool
    const students = this.getStudents();
    return students.find(s => s.id === id) || null;
  },

  getColleges(): CollegeRecord[] {
    return COLLEGES_DATA;
  },

  getCollegeById(id: string): CollegeRecord | null {
    return COLLEGES_DATA.find(c => c.id === id || c.code === id) || null;
  },

  getProfileByEmail(email: string): UserProfile | null {
    const clean = email.trim().toLowerCase();
    const current = this.getCurrentUser();
    if (current && current.email && current.email.toLowerCase() === clean) {
      return current;
    }
    const profiles = this.getAllProfiles() as Record<string, UserProfile>;
    const foundInProfiles = (Object.values(profiles) as UserProfile[]).find(
      (p) => p && p.email && p.email.toLowerCase() === clean
    );
    if (foundInProfiles) return foundInProfiles;

    return null;
  },

  getProfileByEmailAndRole(email: string, role: UserRole): UserProfile | null {
    const clean = email.trim().toLowerCase();
    const current = this.getCurrentUser();
    if (current && current.email && current.email.toLowerCase() === clean && current.role === role) {
      return current;
    }
    const profiles = this.getAllProfiles() as Record<string, UserProfile>;
    
    // Check specific email_role composite key or direct role
    const compositeKey = `${clean}_${role}`;
    if (profiles[compositeKey] && profiles[compositeKey].role === role) {
      return profiles[compositeKey];
    }
    
    const roleKeyProfile = profiles[role];
    if (roleKeyProfile && roleKeyProfile.email && roleKeyProfile.email.toLowerCase() === clean && roleKeyProfile.role === role) {
      return roleKeyProfile;
    }

    const foundInProfiles = (Object.values(profiles) as UserProfile[]).find(
      (p) => p && p.email && p.email.toLowerCase() === clean && p.role === role
    );
    if (foundInProfiles) return foundInProfiles;

    // Check student pool if student
    if (role === 'student') {
      const students = this.getStudents();
      const s = students.find(st => st.email && st.email.toLowerCase() === clean);
      if (s) return s;
    }

    // Check mentor pool if mentor
    if (role === 'mentor') {
      const mentors = this.getMentors();
      const m = mentors.find(me => me.email && me.email.toLowerCase() === clean);
      if (m) return m;
    }

    return null;
  },

  createBlankStudentProfile(email: string, fullName = '', collegeName = ''): StudentProfile {
    const now = new Date().toISOString();
    const newStudent: StudentProfile = {
      id: `usr-student-${Date.now()}`,
      email: email.trim().toLowerCase(),
      fullName: fullName.trim() || '',
      phone: '',
      role: 'student',
      avatarUrl: '',
      bio: '',
      location: '',
      collegeName: collegeName.trim() || '',
      degree: '',
      branch: '',
      graduationYear: new Date().getFullYear() + 1,
      cgpa: 0,
      skills: [],
      certifications: [],
      projects: [],
      educationHistory: [],
      resumeFileName: '',
      resumeUrl: '',
      resumeUploadedAt: '',
      githubUrl: '',
      linkedinUrl: '',
      portfolioUrl: '',
      profileCompletion: 0,
      onboardingCompleted: false,
      createdAt: now,
      updatedAt: now
    };
    return newStudent;
  },

  createBlankCompanyProfile(email: string): CompanyProfile {
    const now = new Date().toISOString();
    return {
      id: `usr-company-${Date.now()}`,
      email: email.trim().toLowerCase(),
      fullName: '',
      phone: '',
      role: 'company',
      avatarUrl: '',
      bio: '',
      companyName: '',
      industry: '',
      website: '',
      location: '',
      size: '51-200',
      description: '',
      logoUrl: '',
      contactPerson: '',
      contactEmail: email.trim().toLowerCase(),
      contactPhone: '',
      verified: false,
      activeOpportunitiesCount: 0,
      onboardingCompleted: false,
      createdAt: now,
      updatedAt: now
    };
  },

  createBlankFacultyProfile(email: string): FacultyProfile {
    const now = new Date().toISOString();
    return {
      id: `usr-faculty-${Date.now()}`,
      email: email.trim().toLowerCase(),
      fullName: '',
      phone: '',
      role: 'faculty',
      avatarUrl: '',
      bio: '',
      institutionId: '',
      institutionName: '',
      department: '',
      designation: '',
      employeeId: '',
      areasOfSpecialization: [],
      onboardingCompleted: false,
      createdAt: now,
      updatedAt: now
    };
  },

  createBlankMentorProfile(email: string): MentorProfile {
    const now = new Date().toISOString();
    return {
      id: `usr-mentor-${Date.now()}`,
      email: email.trim().toLowerCase(),
      fullName: '',
      phone: '',
      role: 'mentor',
      avatarUrl: '',
      bio: '',
      organization: '',
      title: '',
      expertise: [],
      skills: [],
      yearsOfExperience: 0,
      linkedInUrl: '',
      maxMentees: 5,
      currentMenteesCount: 0,
      availability: 'Available',
      onboardingCompleted: false,
      createdAt: now,
      updatedAt: now
    };
  },

  createBlankAdminProfile(email: string): AdminProfile {
    const now = new Date().toISOString();
    return {
      id: `usr-admin-${Date.now()}`,
      email: email.trim().toLowerCase(),
      fullName: '',
      phone: '',
      role: 'admin',
      avatarUrl: '',
      bio: 'Platform administration & governance authority',
      department: 'Platform Administration',
      permissions: ['manage_users', 'verify_institutions', 'verify_companies', 'manage_taxonomy', 'audit_system'],
      onboardingCompleted: false,
      createdAt: now,
      updatedAt: now
    };
  },

  createProfileForRole(role: UserRole, email: string): UserProfile {
    const cleanEmail = email.trim().toLowerCase();
    switch (role) {
      case 'student':
        return this.createBlankStudentProfile(cleanEmail);
      case 'company':
        return this.createBlankCompanyProfile(cleanEmail);
      case 'faculty':
        return this.createBlankFacultyProfile(cleanEmail);
      case 'mentor':
        return this.createBlankMentorProfile(cleanEmail);
      case 'admin':
        return this.createBlankAdminProfile(cleanEmail);
      default:
        return this.createBlankStudentProfile(cleanEmail);
    }
  },

  getProfileByRole(role: UserRole): UserProfile | null {
    const profiles = this.getAllProfiles();
    return profiles[role] || null;
  },

  updateProfile(updated: UserProfile): void {
    const profiles = this.getAllProfiles();
    const cleanEmail = updated.email ? updated.email.trim().toLowerCase() : '';
    
    // Auto-calculate completion if student
    if (updated.role === 'student') {
      const student = updated as StudentProfile;
      student.profileCompletion = calculateProfileCompletion(student);
      
      // Also sync to students pool
      const students = this.getStudents();
      const updatedStudents = students.map(s => s.id === student.id ? student : s);
      if (!students.some(s => s.id === student.id)) {
        updatedStudents.unshift(student);
      }
      saveToStorage(STORAGE_KEYS.STUDENTS_POOL, updatedStudents);
    }

    const updatedWithTime = { ...updated, updatedAt: new Date().toISOString() };
    profiles[updated.role] = updatedWithTime;
    if (cleanEmail) {
      profiles[`${cleanEmail}_${updated.role}`] = updatedWithTime;
    }
    saveToStorage(STORAGE_KEYS.ALL_PROFILES, profiles);
    
    const current = this.getCurrentUser();
    if (current && (current.id === updated.id || (current.email === updated.email && current.role === updated.role))) {
      saveToStorage(STORAGE_KEYS.CURRENT_USER, updatedWithTime);
    }
  },

  // Students Talent Pool (for Company Discovery & Matching)
  getStudents(): StudentProfile[] {
    const students = getFromStorage<StudentProfile[]>(STORAGE_KEYS.STUDENTS_POOL, ALL_DEMO_STUDENTS);
    // Ensure current active student profile is up to date in the pool
    const current = this.getCurrentUser();
    if (current && current.role === 'student') {
      const curStudent = current as StudentProfile;
      const idx = students.findIndex(s => s.id === curStudent.id);
      if (idx >= 0) {
        students[idx] = curStudent;
      } else {
        students.unshift(curStudent);
      }
    }
    return students;
  },

  getStudentById(id: string): StudentProfile | null {
    const students = this.getStudents();
    return students.find(s => s.id === id) || null;
  },

  // Skills Taxonomy
  getSkills(): TaxonomySkill[] {
    return getFromStorage<TaxonomySkill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  },

  addSkill(skill: TaxonomySkill): void {
    const skills = this.getSkills();
    skills.push(skill);
    saveToStorage(STORAGE_KEYS.SKILLS, skills);
  },

  // Opportunities (100+ Industry Opportunities)
  getOpportunities(type?: 'Internship' | 'Job'): Opportunity[] {
    let opps = getFromStorage<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    // If cache has old small demo set, migrate to the full 100-company industry dataset
    if (!opps || opps.length < INITIAL_OPPORTUNITIES.length) {
      opps = INITIAL_OPPORTUNITIES;
      saveToStorage(STORAGE_KEYS.OPPORTUNITIES, opps);
    }
    if (type) {
      if (type === 'Internship') {
        return opps.filter(o => o.type === 'Internship' || o.type === 'Internship + PPO' || o.opportunity_type === 'Internship' || o.opportunity_type === 'Internship + PPO');
      }
      return opps.filter(o => o.type === 'Job' || o.type === 'Full-Time Placement' || o.opportunity_type === 'Full-Time Placement');
    }
    return opps;
  },

  // Companies (100 Verified Industry Organizations)
  getCompanies(): IndustryCompany[] {
    return INDUSTRY_COMPANIES;
  },

  getCompanyById(id: string): IndustryCompany | null {
    return INDUSTRY_COMPANIES.find(c => c.id === id || c.company_id === id) || null;
  },

  getOpportunitiesByCompany(companyId: string): Opportunity[] {
    if (!companyId) return [];
    const opps = this.getOpportunities();
    return opps.filter(o => o.companyId === companyId || o.company_id === companyId);
  },

  getOpportunityById(id: string): Opportunity | null {
    const opps = this.getOpportunities();
    return opps.find(o => o.id === id) || null;
  },

  addOpportunity(opp: Opportunity): void {
    const opps = this.getOpportunities();
    opps.unshift(opp);
    saveToStorage(STORAGE_KEYS.OPPORTUNITIES, opps);

    // Update active opportunities count on company profile
    const current = this.getCurrentUser();
    if (current && current.role === 'company' && current.id === opp.companyId) {
      const company = current as CompanyProfile;
      const compOpps = opps.filter(o => o.companyId === opp.companyId && o.status === 'Open');
      this.updateProfile({
        ...company,
        activeOpportunitiesCount: compOpps.length
      });
    }
  },

  updateOpportunity(opp: Opportunity): void {
    const opps = this.getOpportunities().map(o => o.id === opp.id ? opp : o);
    saveToStorage(STORAGE_KEYS.OPPORTUNITIES, opps);

    // Update active count
    const current = this.getCurrentUser();
    if (current && current.role === 'company' && current.id === opp.companyId) {
      const company = current as CompanyProfile;
      const compOpps = opps.filter(o => o.companyId === opp.companyId && o.status === 'Open');
      this.updateProfile({
        ...company,
        activeOpportunitiesCount: compOpps.length
      });
    }
  },

  deleteOpportunity(oppId: string): void {
    const opps = this.getOpportunities().filter(o => o.id !== oppId);
    saveToStorage(STORAGE_KEYS.OPPORTUNITIES, opps);
  },

  // Applications
  getApplications(filter?: string | { studentId?: string; companyId?: string; opportunityId?: string }): Application[] {
    let apps = getFromStorage<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    // Sanitize any legacy demo applications for usr-student-1 or Arjun Sharma
    if (apps.some(a => a.studentId === 'usr-student-1' || a.studentName === 'Arjun Sharma')) {
      apps = apps.filter(a => a.studentId !== 'usr-student-1' && a.studentName !== 'Arjun Sharma');
      saveToStorage(STORAGE_KEYS.APPLICATIONS, apps);
    }
    if (!filter) return apps;

    if (typeof filter === 'string') {
      return apps.filter(a => a.studentId === filter);
    }

    return apps.filter(a => {
      if (filter.studentId && a.studentId !== filter.studentId) return false;
      if (filter.companyId && a.companyId !== filter.companyId) return false;
      if (filter.opportunityId && a.opportunityId !== filter.opportunityId) return false;
      return true;
    });
  },

  hasStudentApplied(studentId: string, opportunityId: string): boolean {
    const apps = this.getApplications();
    return apps.some(a => a.studentId === studentId && a.opportunityId === opportunityId);
  },

  addApplication(app: Application): { success: boolean; message: string; application?: Application } {
    const apps = this.getApplications();
    const alreadyApplied = apps.some(a => a.studentId === app.studentId && a.opportunityId === app.opportunityId);
    if (alreadyApplied) {
      return { success: false, message: 'You have already submitted an application for this role.' };
    }

    apps.unshift(app);
    saveToStorage(STORAGE_KEYS.APPLICATIONS, apps);

    // Increment applicant count on opportunity
    const opps = this.getOpportunities().map(o => {
      if (o.id === app.opportunityId) {
        return { ...o, applicantCount: (o.applicantCount || 0) + 1 };
      }
      return o;
    });
    saveToStorage(STORAGE_KEYS.OPPORTUNITIES, opps);

    // Create confirmation notification for student
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: app.studentId,
      title: `Applied to ${app.opportunityTitle}`,
      message: `Your application has been received by ${app.companyName} and is currently Under Review.`,
      type: 'application',
      read: false,
      createdAt: new Date().toISOString()
    });

    // Create notification for company
    if (app.companyId) {
      this.addNotification({
        id: `notif-comp-${Date.now()}`,
        userId: app.companyId,
        title: `New Applicant for ${app.opportunityTitle}`,
        message: `${app.studentName} (${app.studentCollege}) applied with a ${app.skillMatchScore}% skill match.`,
        type: 'application',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    return { success: true, message: 'Application submitted successfully!', application: app };
  },

  updateApplicationStatus(appId: string, status: Application['status'], notes?: string): void {
    const apps = this.getApplications().map(a => {
      if (a.id === appId) {
        return { ...a, status, notes: notes !== undefined ? notes : a.notes, updatedAt: new Date().toISOString() };
      }
      return a;
    });
    saveToStorage(STORAGE_KEYS.APPLICATIONS, apps);

    const updatedApp = apps.find(a => a.id === appId);
    if (updatedApp) {
      // Notify student of status transition
      let notifTitle = `Application Status Update: ${status}`;
      let notifMsg = `Your application for ${updatedApp.opportunityTitle} at ${updatedApp.companyName} has moved to ${status}.`;
      if (status === 'Shortlisted') {
        notifTitle = `You've been Shortlisted! 🎉`;
        notifMsg = `Congratulations! ${updatedApp.companyName} shortlisted your profile for ${updatedApp.opportunityTitle}.`;
      } else if (status === 'Selected') {
        notifTitle = `Offer Selected! 🌟`;
        notifMsg = `Congratulations! ${updatedApp.companyName} has selected you for ${updatedApp.opportunityTitle}.`;
      }

      this.addNotification({
        id: `notif-status-${Date.now()}`,
        userId: updatedApp.studentId,
        title: notifTitle,
        message: notifMsg,
        type: status === 'Interview' ? 'interview' : 'application',
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  },

  // Interview Management
  getInterviews(companyId?: string, studentId?: string): InterviewSchedule[] {
    let interviews = getFromStorage<InterviewSchedule[]>(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEWS);
    if (interviews.some(i => i.studentId === 'usr-student-1' || (i as any).studentName === 'Arjun Sharma')) {
      interviews = interviews.filter(i => i.studentId !== 'usr-student-1' && (i as any).studentName !== 'Arjun Sharma');
      saveToStorage(STORAGE_KEYS.INTERVIEWS, interviews);
    }
    if (companyId) {
      return interviews.filter(i => i.companyId === companyId);
    }
    if (studentId) {
      return interviews.filter(i => i.studentId === studentId);
    }
    return interviews;
  },

  scheduleInterview(interview: InterviewSchedule): void {
    const interviews = this.getInterviews();
    interviews.unshift(interview);
    saveToStorage(STORAGE_KEYS.INTERVIEWS, interviews);

    // Update corresponding application
    this.updateApplicationStatus(interview.applicationId, 'Interview');
    const apps = this.getApplications().map(a => {
      if (a.id === interview.applicationId) {
        return {
          ...a,
          interviewDate: `${interview.scheduledDate}T${interview.scheduledTime}:00Z`,
          interviewId: interview.id
        };
      }
      return a;
    });
    saveToStorage(STORAGE_KEYS.APPLICATIONS, apps);

    // Notify Student
    this.addNotification({
      id: `notif-int-${Date.now()}`,
      userId: interview.studentId,
      title: `Interview Scheduled: ${interview.roundName} 📅`,
      message: `${interview.companyName} scheduled your ${interview.roundName} for ${interview.opportunityTitle} on ${interview.scheduledDate} at ${interview.scheduledTime}.`,
      type: 'interview',
      read: false,
      createdAt: new Date().toISOString()
    });
  },

  updateInterviewStatus(interviewId: string, status: InterviewSchedule['status']): void {
    const interviews = this.getInterviews().map(i => {
      if (i.id === interviewId) {
        return { ...i, status };
      }
      return i;
    });
    saveToStorage(STORAGE_KEYS.INTERVIEWS, interviews);
  },

  // Candidate Direct Invitation
  inviteCandidate(
    studentId: string, 
    opportunityId: string, 
    companyProfile: CompanyProfile, 
    customMessage?: string
  ): void {
    const opp = this.getOpportunityById(opportunityId);
    if (!opp) return;

    this.addNotification({
      id: `notif-inv-${Date.now()}`,
      userId: studentId,
      title: `Direct Invitation from ${companyProfile.companyName} 🚀`,
      message: customMessage || `${companyProfile.companyName} reviewed your verified skill profile and invited you to apply for ${opp.title}.`,
      type: 'recommendation',
      read: false,
      createdAt: new Date().toISOString()
    });
  },

  // Skill Assessments
  getAssessments(): SkillAssessment[] {
    return getFromStorage<SkillAssessment[]>(STORAGE_KEYS.ASSESSMENTS, ASSESSMENT_BANK);
  },

  getAssessmentById(id: string): SkillAssessment | null {
    const list = this.getAssessments();
    return list.find(a => a.id === id || a.skillId === id) || null;
  },

  getAssessmentAttempts(studentId?: string): AssessmentAttempt[] {
    let attempts = getFromStorage<AssessmentAttempt[]>(STORAGE_KEYS.ATTEMPTS, INITIAL_ASSESSMENT_ATTEMPTS);
    if (attempts.some(a => a.studentId === 'usr-student-1')) {
      attempts = attempts.filter(a => a.studentId !== 'usr-student-1');
      saveToStorage(STORAGE_KEYS.ATTEMPTS, attempts);
    }
    if (studentId) {
      return attempts.filter(a => a.studentId === studentId);
    }
    return attempts;
  },

  saveAssessmentAttempt(attempt: AssessmentAttempt): void {
    const attempts = this.getAssessmentAttempts();
    attempts.unshift(attempt);
    saveToStorage(STORAGE_KEYS.ATTEMPTS, attempts);

    // Also update student skill profile with verified badge & score
    const current = this.getCurrentUser();
    if (current && current.role === 'student' && current.id === attempt.studentId) {
      const student = current as StudentProfile;
      const existingSkill = student.skills.find(s => s.name.toLowerCase() === attempt.skillName.toLowerCase());
      
      let updatedSkills = [...student.skills];
      if (existingSkill) {
        updatedSkills = updatedSkills.map(s => {
          if (s.name.toLowerCase() === attempt.skillName.toLowerCase()) {
            return {
              ...s,
              proficiency: attempt.evaluatedProficiency,
              verified: attempt.passed,
              verifiedScore: attempt.scorePercentage,
              lastAssessedAt: new Date().toISOString().split('T')[0]
            };
          }
          return s;
        });
      } else {
        // Add new skill with verified score
        updatedSkills.push({
          id: `ssk-${Date.now()}`,
          skillId: attempt.assessmentId,
          name: attempt.skillName,
          category: 'Technical',
          proficiency: attempt.evaluatedProficiency,
          verified: attempt.passed,
          verifiedScore: attempt.scorePercentage,
          lastAssessedAt: new Date().toISOString().split('T')[0]
        });
      }

      this.updateProfile({
        ...student,
        skills: updatedSkills
      });
    }
  },

  // Notifications
  getNotifications(userId: string): AppNotification[] {
    const notifs = getFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return notifs.filter(n => n.userId === userId);
  },

  getUnreadNotificationsCount(userId: string): number {
    const notifs = this.getNotifications(userId);
    return notifs.filter(n => !n.read).length;
  },

  markNotificationRead(id: string): void {
    const notifs = getFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  markAllNotificationsRead(userId: string): void {
    const notifs = getFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = notifs.map(n => n.userId === userId ? { ...n, read: true } : n);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  deleteNotification(id: string): void {
    const notifs = getFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = notifs.filter(n => n.id !== id);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  clearAllReadNotifications(userId: string): void {
    const notifs = getFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = notifs.filter(n => !(n.userId === userId && n.read));
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  addNotification(notif: AppNotification): void {
    const notifs = getFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    // Guard against duplicate notification for exact same user, title and time (within 1 min)
    const isDuplicate = notifs.some(n => 
      n.userId === notif.userId && 
      n.title === notif.title && 
      Math.abs(new Date(n.createdAt).getTime() - new Date(notif.createdAt).getTime()) < 60000
    );
    if (isDuplicate) return;

    notifs.unshift(notif);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  // Faculty Assessments Creation & Management
  createAssessment(assessment: SkillAssessment): void {
    const list = this.getAssessments();
    list.unshift(assessment);
    saveToStorage(STORAGE_KEYS.ASSESSMENTS, list);
  },

  deleteAssessment(assessmentId: string): void {
    const list = this.getAssessments().filter(a => a.id !== assessmentId);
    saveToStorage(STORAGE_KEYS.ASSESSMENTS, list);
  },

  // Institution Profile
  getInstitution(): InstitutionProfile {
    return getFromStorage<InstitutionProfile>(STORAGE_KEYS.INSTITUTION, DEMO_INSTITUTION);
  },

  updateInstitution(inst: InstitutionProfile): void {
    saveToStorage(STORAGE_KEYS.INSTITUTION, { ...inst, updatedAt: new Date().toISOString() });
    
    // Also sync institutionName across current faculty user profile if active
    const current = this.getCurrentUser();
    if (current && current.role === 'faculty') {
      this.updateProfile({
        ...current,
        institutionName: inst.name
      } as FacultyProfile);
    }
  },

  // Training Programs
  getTrainingPrograms(institutionId?: string): TrainingProgram[] {
    const programs = getFromStorage<TrainingProgram[]>(STORAGE_KEYS.TRAINING_PROGRAMS, INITIAL_TRAINING_PROGRAMS);
    if (institutionId) {
      return programs.filter(p => p.institutionId === institutionId);
    }
    return programs;
  },

  getTrainingProgramById(id: string): TrainingProgram | null {
    const list = this.getTrainingPrograms();
    return list.find(p => p.id === id) || null;
  },

  createTrainingProgram(prog: TrainingProgram): void {
    const list = this.getTrainingPrograms();
    list.unshift(prog);
    saveToStorage(STORAGE_KEYS.TRAINING_PROGRAMS, list);

    // Broadcast notification to college students
    const students = this.getStudents();
    students.forEach(st => {
      this.addNotification({
        id: `notif-train-${Date.now()}-${st.id}`,
        userId: st.id,
        title: `New Training Program: ${prog.title} 🎓`,
        message: `Department faculty scheduled a new upskilling bootcamp on ${prog.skillName} (${prog.duration}, ${prog.mode}). Register before ${prog.registrationDeadline}.`,
        type: 'announcement',
        read: false,
        createdAt: new Date().toISOString()
      });
    });
  },

  updateTrainingProgram(prog: TrainingProgram): void {
    const list = this.getTrainingPrograms().map(p => p.id === prog.id ? prog : p);
    saveToStorage(STORAGE_KEYS.TRAINING_PROGRAMS, list);
  },

  deleteTrainingProgram(id: string): void {
    const list = this.getTrainingPrograms().filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.TRAINING_PROGRAMS, list);
  },

  // Training Registrations
  getTrainingRegistrations(programId?: string, studentId?: string): TrainingRegistration[] {
    const registrations = getFromStorage<TrainingRegistration[]>(
      STORAGE_KEYS.TRAINING_REGISTRATIONS, 
      INITIAL_TRAINING_REGISTRATIONS
    );
    return registrations.filter(r => {
      if (programId && r.programId !== programId) return false;
      if (studentId && r.studentId !== studentId) return false;
      return true;
    });
  },

  isStudentRegisteredForTraining(programId: string, studentId: string): boolean {
    const registrations = this.getTrainingRegistrations();
    return registrations.some(r => r.programId === programId && r.studentId === studentId);
  },

  registerForTraining(programId: string, student: StudentProfile): { success: boolean; message: string } {
    const isReg = this.isStudentRegisteredForTraining(programId, student.id);
    if (isReg) {
      return { success: false, message: 'You are already enrolled in this training program.' };
    }

    const program = this.getTrainingProgramById(programId);
    if (!program) {
      return { success: false, message: 'Training program not found.' };
    }

    if (program.enrolledCount >= program.capacity) {
      return { success: false, message: 'This program has reached maximum student capacity.' };
    }

    const newReg: TrainingRegistration = {
      id: `treg-${Date.now()}`,
      programId,
      programTitle: program.title,
      studentId: student.id,
      studentName: student.fullName,
      studentEmail: student.email,
      studentCollege: student.collegeName,
      studentBranch: student.branch,
      registeredAt: new Date().toISOString(),
      status: 'Enrolled'
    };

    const registrations = this.getTrainingRegistrations();
    registrations.unshift(newReg);
    saveToStorage(STORAGE_KEYS.TRAINING_REGISTRATIONS, registrations);

    // Increment enrolled count
    this.updateTrainingProgram({
      ...program,
      enrolledCount: program.enrolledCount + 1
    });

    // Notify Student
    this.addNotification({
      id: `notif-treg-${Date.now()}`,
      userId: student.id,
      title: `Enrollment Confirmed: ${program.title} ✅`,
      message: `You are enrolled for ${program.skillName} Bootcamp starting ${program.startDate}. Instructor: ${program.instructorName}.`,
      type: 'announcement',
      read: false,
      createdAt: new Date().toISOString()
    });

    return { success: true, message: `Successfully enrolled in ${program.title}!` };
  },

  // Placements Module
  getPlacements(filter?: { studentId?: string; branch?: string; companyId?: string }): PlacementRecord[] {
    const list = getFromStorage<PlacementRecord[]>(STORAGE_KEYS.PLACEMENTS, INITIAL_PLACEMENTS);
    if (!filter) return list;
    return list.filter(p => {
      if (filter.studentId && p.studentId !== filter.studentId) return false;
      if (filter.branch && p.studentBranch !== filter.branch) return false;
      if (filter.companyId && p.companyId !== filter.companyId) return false;
      return true;
    });
  },

  addPlacement(record: PlacementRecord): void {
    const list = this.getPlacements();
    list.unshift(record);
    saveToStorage(STORAGE_KEYS.PLACEMENTS, list);

    // Student notification
    this.addNotification({
      id: `notif-plc-${Date.now()}`,
      userId: record.studentId,
      title: `Campus Placement Confirmed! 🎉`,
      message: `Congratulations! Your placement offer as ${record.jobTitle} at ${record.companyName} (${record.packageLpa} LPA) has been recorded by the College T&P Cell.`,
      type: 'application',
      read: false,
      createdAt: new Date().toISOString()
    });
  },

  updatePlacement(record: PlacementRecord): void {
    const list = this.getPlacements().map(p => p.id === record.id ? record : p);
    saveToStorage(STORAGE_KEYS.PLACEMENTS, list);
  },

  calculatePlacementStats(collegeName?: string) {
    const students = this.getStudents();
    const placements = this.getPlacements();

    const filteredStudents = collegeName 
      ? students.filter(s => s.collegeName.toLowerCase().includes(collegeName.toLowerCase()) || collegeName.toLowerCase().includes(s.collegeName.toLowerCase()))
      : students;

    const totalStudents = filteredStudents.length || 50; // default baseline for display
    const eligibleStudents = filteredStudents.filter(s => s.cgpa >= 6.5 && s.profileCompletion >= 70).length || Math.floor(totalStudents * 0.85);
    
    const placedStudentsSet = new Set(placements.map(p => p.studentId));
    const placedCount = placements.length;
    const seekingCount = Math.max(0, eligibleStudents - placedCount);
    const placementRate = eligibleStudents > 0 ? Math.min(100, Math.round((placedCount / eligibleStudents) * 100)) : 79;
    
    const totalPackage = placements.reduce((acc, p) => acc + (p.packageLpa || 0), 0);
    const averagePackage = placedCount > 0 ? +(totalPackage / placedCount).toFixed(2) : 12.5;
    const highestPackage = placements.length > 0 ? Math.max(...placements.map(p => p.packageLpa)) : 18.0;

    return {
      totalStudents,
      eligibleStudents,
      placedCount,
      seekingCount,
      placementRate,
      averagePackage,
      highestPackage,
      placements
    };
  },

  // Mentors & Mentorship Management
  getMentors(): MentorProfile[] {
    const mentors = getFromStorage<MentorProfile[]>(STORAGE_KEYS.MENTORS, ALL_DEMO_MENTORS);
    // Ensure current active mentor profile is synced if active
    const current = this.getCurrentUser();
    if (current && current.role === 'mentor') {
      const curMentor = current as MentorProfile;
      const idx = mentors.findIndex(m => m.id === curMentor.id);
      if (idx >= 0) mentors[idx] = curMentor;
      else mentors.unshift(curMentor);
    }
    return mentors;
  },

  getMentorById(id: string): MentorProfile | null {
    const list = this.getMentors();
    return list.find(m => m.id === id) || null;
  },

  updateMentorProfile(profile: MentorProfile): void {
    const mentors = this.getMentors().map(m => m.id === profile.id ? profile : m);
    saveToStorage(STORAGE_KEYS.MENTORS, mentors);
    this.updateProfile(profile);
  },

  updateMentor(profile: MentorProfile): void {
    this.updateMentorProfile(profile);
  },

  getMentorshipAssignments(filter?: { mentorId?: string; studentId?: string }): MentorshipAssignment[] {
    const list = getFromStorage<MentorshipAssignment[]>(STORAGE_KEYS.MENTORSHIPS, INITIAL_MENTORSHIPS);
    if (!filter) return list;
    return list.filter(m => {
      if (filter.mentorId && m.mentorId !== filter.mentorId) return false;
      if (filter.studentId && m.studentId !== filter.studentId) return false;
      return true;
    });
  },

  assignMentor(assignment: MentorshipAssignment): void {
    const list = this.getMentorshipAssignments();
    // Check if already assigned
    const exists = list.some(m => m.studentId === assignment.studentId && m.mentorId === assignment.mentorId && m.status === 'Active');
    if (exists) return;

    list.unshift(assignment);
    saveToStorage(STORAGE_KEYS.MENTORSHIPS, list);

    // Notify Student
    this.addNotification({
      id: `notif-ment-st-${Date.now()}`,
      userId: assignment.studentId,
      title: `Industry Mentor Assigned! 🤝`,
      message: `${assignment.mentorName} (${assignment.mentorOrganization}) has been assigned as your technical mentor by ${assignment.assignedBy}.`,
      type: 'mentor',
      read: false,
      createdAt: new Date().toISOString()
    });

    // Notify Mentor
    this.addNotification({
      id: `notif-ment-m-${Date.now()}`,
      userId: assignment.mentorId,
      title: `New Mentee Assigned: ${assignment.studentName} 🎓`,
      message: `${assignment.studentName} (${assignment.studentCollege}, ${assignment.studentBranch}) has been assigned to you.`,
      type: 'mentor',
      read: false,
      createdAt: new Date().toISOString()
    });
  },

  updateMentorshipStatus(assignmentId: string, status: MentorshipAssignment['status']): void {
    const list = this.getMentorshipAssignments().map(m => m.id === assignmentId ? { ...m, status } : m);
    saveToStorage(STORAGE_KEYS.MENTORSHIPS, list);
  },

  // Mentor Goals
  getMentorGoals(studentId?: string, mentorId?: string): MentorGoal[] {
    const list = getFromStorage<MentorGoal[]>(STORAGE_KEYS.MENTOR_GOALS, INITIAL_MENTOR_GOALS);
    return list.filter(g => {
      if (studentId && g.studentId !== studentId) return false;
      if (mentorId && g.mentorId !== mentorId) return false;
      return true;
    });
  },

  createMentorGoal(goal: MentorGoal): void {
    const list = this.getMentorGoals();
    list.unshift(goal);
    saveToStorage(STORAGE_KEYS.MENTOR_GOALS, list);

    // Notify student
    this.addNotification({
      id: `notif-goal-${Date.now()}`,
      userId: goal.studentId,
      title: `New Mentorship Goal Assigned 🎯`,
      message: `${goal.mentorName || 'Your Mentor'} assigned a new milestone: "${goal.title}" (Target: ${goal.targetDate}).`,
      type: 'mentor',
      read: false,
      createdAt: new Date().toISOString()
    });
  },

  addMentorGoal(goal: MentorGoal): void {
    this.createMentorGoal(goal);
  },

  updateMentorGoalStatus(goalId: string, status: MentorGoal['status']): void {
    const list = this.getMentorGoals().map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          status,
          completedAt: status === 'Completed' ? new Date().toISOString() : undefined
        };
      }
      return g;
    });
    saveToStorage(STORAGE_KEYS.MENTOR_GOALS, list);

    const goal = list.find(g => g.id === goalId);
    if (goal && status === 'Completed') {
      // Notify mentor that student completed goal
      this.addNotification({
        id: `notif-goal-done-${Date.now()}`,
        userId: goal.mentorId,
        title: `Goal Milestone Completed! 🎉`,
        message: `Your mentee marked goal "${goal.title}" (${goal.targetSkill}) as Completed.`,
        type: 'mentor',
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  },

  // Mentoring Sessions
  getMentoringSessions(studentId?: string, mentorId?: string): MentoringSession[] {
    const list = getFromStorage<MentoringSession[]>(STORAGE_KEYS.MENTOR_SESSIONS, INITIAL_MENTOR_SESSIONS);
    return list.filter(s => {
      if (studentId && s.studentId !== studentId) return false;
      if (mentorId && s.mentorId !== mentorId) return false;
      return true;
    });
  },

  scheduleMentoringSession(session: MentoringSession): void {
    const list = this.getMentoringSessions();
    list.unshift(session);
    saveToStorage(STORAGE_KEYS.MENTOR_SESSIONS, list);

    // Notify Student
    this.addNotification({
      id: `notif-sess-${Date.now()}`,
      userId: session.studentId,
      title: `Mentoring Session Scheduled 📅`,
      message: `${session.mentorName} scheduled a 1-on-1 session on ${session.sessionDate} at ${session.sessionTime} (${session.sessionType}).`,
      type: 'mentor',
      read: false,
      createdAt: new Date().toISOString()
    });
  },

  addMentoringSession(session: MentoringSession): void {
    this.scheduleMentoringSession(session);
  },

  updateMentoringSession(session: MentoringSession): void {
    const list = this.getMentoringSessions().map(s => s.id === session.id ? session : s);
    saveToStorage(STORAGE_KEYS.MENTOR_SESSIONS, list);
  },

  updateMentoringSessionNotes(sessionId: string, notes: string): void {
    const list = this.getMentoringSessions().map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          notes,
          status: 'Completed' as const
        };
      }
      return s;
    });
    saveToStorage(STORAGE_KEYS.MENTOR_SESSIONS, list);
  },

  // Deterministic Mentor Match Scoring (Student Needs + Mentor Expertise)
  calculateMentorMatch(student: StudentProfile, mentor: MentorProfile): {
    matchScore: number;
    matchedAreas: string[];
    explanation: string;
  } {
    const studentMissingOrLearning: string[] = [];
    student.skills.forEach(s => {
      if (s.proficiency === 'Beginner' || s.proficiency === 'Intermediate' || !s.verified) {
        studentMissingOrLearning.push(s.name.toLowerCase());
      }
    });

    // Also include high industry demand skills if missing
    const taxonomy = this.getSkills();
    taxonomy.filter(t => t.industryDemandWeight >= 8).forEach(t => {
      if (!student.skills.some(s => s.name.toLowerCase() === t.name.toLowerCase())) {
        studentMissingOrLearning.push(t.name.toLowerCase());
      }
    });

    const mentorCapabilities = [
      ...mentor.expertise.map(e => e.toLowerCase()),
      ...(mentor.skills || []).map(s => s.toLowerCase())
    ];

    const matchedAreas: string[] = [];
    studentMissingOrLearning.forEach(skill => {
      if (mentorCapabilities.some(m => m.includes(skill) || skill.includes(m))) {
        if (!matchedAreas.includes(skill)) {
          matchedAreas.push(skill);
        }
      }
    });

    // Mentor expertise keyword match
    mentor.expertise.forEach(exp => {
      if (student.projects.some(p => p.technologies.some(t => t.toLowerCase().includes(exp.toLowerCase())))) {
        if (!matchedAreas.includes(exp)) {
          matchedAreas.push(exp);
        }
      }
    });

    const matchScore = Math.min(98, Math.max(45, Math.round(50 + (matchedAreas.length * 12) + (mentor.yearsOfExperience > 10 ? 10 : 5))));
    const explanation = `Matches ${matchedAreas.length} target learning areas: ${matchedAreas.slice(0, 3).join(', ') || 'System Design, Backend Architecture'}.`;

    return {
      matchScore,
      matchedAreas,
      explanation
    };
  },

  // Institutional Skill Analytics Engine (Academic Supply vs Industry Demand)
  getInstitutionalSkillAnalytics(collegeName?: string) {
    const students = this.getStudents();
    const opportunities = this.getOpportunities();
    const taxonomy = this.getSkills();

    const filteredStudents = collegeName
      ? students.filter(s => s.collegeName.toLowerCase().includes(collegeName.toLowerCase()) || collegeName.toLowerCase().includes(s.collegeName.toLowerCase()))
      : students;

    const totalStudents = filteredStudents.length || 1;

    // 1. Calculate Student Skill Supply
    const skillCounts: Record<string, { count: number; category: string; proficiencies: Record<string, number>; verifiedCount: number }> = {};

    taxonomy.forEach(t => {
      skillCounts[t.name] = {
        count: 0,
        category: t.category,
        proficiencies: { Beginner: 0, Intermediate: 0, Advanced: 0, Expert: 0 },
        verifiedCount: 0
      };
    });

    filteredStudents.forEach(st => {
      st.skills.forEach(sk => {
        if (!skillCounts[sk.name]) {
          skillCounts[sk.name] = {
            count: 0,
            category: sk.category,
            proficiencies: { Beginner: 0, Intermediate: 0, Advanced: 0, Expert: 0 },
            verifiedCount: 0
          };
        }
        skillCounts[sk.name].count += 1;
        skillCounts[sk.name].proficiencies[sk.proficiency] = (skillCounts[sk.name].proficiencies[sk.proficiency] || 0) + 1;
        if (sk.verified) {
          skillCounts[sk.name].verifiedCount += 1;
        }
      });
    });

    // 2. Calculate Industry Demand Weight from Active Postings & Taxonomy
    const industryDemandCounts: Record<string, number> = {};
    opportunities.forEach(opp => {
      opp.requiredSkills.forEach(req => {
        industryDemandCounts[req.skillName] = (industryDemandCounts[req.skillName] || 0) + (req.mandatory ? 3 : 1);
      });
    });

    // 3. Compile Comparative Analytics
    const comparativeList = taxonomy.map(t => {
      const supply = skillCounts[t.name] || { count: 0, category: t.category, proficiencies: { Beginner: 0, Intermediate: 0, Advanced: 0, Expert: 0 }, verifiedCount: 0 };
      const studentPercentage = Math.round((supply.count / totalStudents) * 100);
      const postingDemandCount = industryDemandCounts[t.name] || 0;
      
      // Demand Score (0-100)
      const demandScore = Math.min(100, Math.round((t.industryDemandWeight * 7) + (postingDemandCount * 5)));
      
      // Gap Deficit Score: High demand vs Low Student Supply
      const gapDeficit = Math.max(0, demandScore - studentPercentage);
      const isCriticalGap = gapDeficit >= 25 && demandScore >= 60;

      return {
        skillId: t.id,
        skillName: t.name,
        category: t.category,
        industryDemandWeight: t.industryDemandWeight,
        demandScore,
        studentCount: supply.count,
        studentPercentage,
        verifiedCount: supply.verifiedCount,
        proficiencies: supply.proficiencies,
        gapDeficit,
        isCriticalGap
      };
    });

    // Sort by largest gap deficit
    comparativeList.sort((a, b) => b.gapDeficit - a.gapDeficit);

    // 4. Branch Breakdown
    const branches = ['Computer Science and Engineering', 'Information Technology', 'Electronics and Communication'];
    const branchStats = branches.map(branch => {
      const branchStudents = filteredStudents.filter(s => s.branch === branch);
      const bTotal = branchStudents.length || 1;
      const topSkills = ['React.js', 'Node.js', 'SQL & PostgreSQL', 'Docker & Kubernetes', 'Python'].map(skName => {
        const count = branchStudents.filter(s => s.skills.some(sk => sk.name === skName)).length;
        return {
          skillName: skName,
          percentage: Math.round((count / bTotal) * 100),
          count
        };
      });

      return {
        branchName: branch,
        studentCount: branchStudents.length,
        topSkills
      };
    });

    return {
      totalStudents,
      comparativeList,
      topGaps: comparativeList.filter(c => c.isCriticalGap).slice(0, 6),
      topSupplies: [...comparativeList].sort((a, b) => b.studentPercentage - a.studentPercentage).slice(0, 5),
      branchStats
    };
  },

  // ============================================================
  // PHASE 6: AI INTELLIGENCE LAYER STORAGE & TAXONOMY METHODS
  // ============================================================

  // Normalize extracted or user skills against canonical taxonomy
  normalizeSkillToTaxonomy(rawName: string): { name: string; category: SkillCategory; taxonomyId?: string } {
    const raw = rawName.trim().toLowerCase();
    const taxonomy = this.getSkills();

    // Direct match
    const exact = taxonomy.find(t => t.name.toLowerCase() === raw);
    if (exact) {
      return { name: exact.name, category: exact.category, taxonomyId: exact.id };
    }

    // Synonym / Alias mapping table
    const aliases: Record<string, { targetName: string; category: SkillCategory }> = {
      'react': { targetName: 'React.js', category: 'Frontend' },
      'reactjs': { targetName: 'React.js', category: 'Frontend' },
      'react.js': { targetName: 'React.js', category: 'Frontend' },
      'nextjs': { targetName: 'Next.js', category: 'Frontend' },
      'next.js': { targetName: 'Next.js', category: 'Frontend' },
      'vue': { targetName: 'Vue.js', category: 'Frontend' },
      'vuejs': { targetName: 'Vue.js', category: 'Frontend' },
      'tailwind': { targetName: 'Tailwind CSS', category: 'Frontend' },
      'tailwindcss': { targetName: 'Tailwind CSS', category: 'Frontend' },
      'node': { targetName: 'Node.js', category: 'Backend' },
      'nodejs': { targetName: 'Node.js', category: 'Backend' },
      'node.js': { targetName: 'Node.js', category: 'Backend' },
      'express': { targetName: 'Express.js', category: 'Backend' },
      'expressjs': { targetName: 'Express.js', category: 'Backend' },
      'fastapi': { targetName: 'FastAPI', category: 'Backend' },
      'spring': { targetName: 'Spring Boot', category: 'Backend' },
      'springboot': { targetName: 'Spring Boot', category: 'Backend' },
      'postgres': { targetName: 'SQL & PostgreSQL', category: 'Database' },
      'postgresql': { targetName: 'SQL & PostgreSQL', category: 'Database' },
      'sql': { targetName: 'SQL & PostgreSQL', category: 'Database' },
      'mysql': { targetName: 'SQL & PostgreSQL', category: 'Database' },
      'mongo': { targetName: 'MongoDB', category: 'Database' },
      'mongodb': { targetName: 'MongoDB', category: 'Database' },
      'redis': { targetName: 'Redis', category: 'Database' },
      'aws': { targetName: 'Cloud Computing (AWS/GCP)', category: 'Cloud' },
      'gcp': { targetName: 'Cloud Computing (AWS/GCP)', category: 'Cloud' },
      'azure': { targetName: 'Cloud Computing (AWS/GCP)', category: 'Cloud' },
      'docker': { targetName: 'Docker & Kubernetes', category: 'DevOps' },
      'kubernetes': { targetName: 'Docker & Kubernetes', category: 'DevOps' },
      'k8s': { targetName: 'Docker & Kubernetes', category: 'DevOps' },
      'cicd': { targetName: 'CI/CD Pipelines (GitHub Actions)', category: 'DevOps' },
      'github actions': { targetName: 'CI/CD Pipelines (GitHub Actions)', category: 'DevOps' },
      'machine learning': { targetName: 'Machine Learning & Deep Learning', category: 'AI/ML' },
      'deep learning': { targetName: 'Machine Learning & Deep Learning', category: 'AI/ML' },
      'ml': { targetName: 'Machine Learning & Deep Learning', category: 'AI/ML' },
      'pytorch': { targetName: 'Machine Learning & Deep Learning', category: 'AI/ML' },
      'tensorflow': { targetName: 'Machine Learning & Deep Learning', category: 'AI/ML' },
      'genai': { targetName: 'Generative AI & LLM Engineering', category: 'AI/ML' },
      'generative ai': { targetName: 'Generative AI & LLM Engineering', category: 'AI/ML' },
      'llm': { targetName: 'Generative AI & LLM Engineering', category: 'AI/ML' },
      'rag': { targetName: 'Generative AI & LLM Engineering', category: 'AI/ML' },
      'dsa': { targetName: 'Problem Solving & DSA', category: 'Technical' },
      'data structures': { targetName: 'Problem Solving & DSA', category: 'Technical' },
      'algorithms': { targetName: 'Problem Solving & DSA', category: 'Technical' },
      'system design': { targetName: 'System Design & Scalability', category: 'Domain Skills' },
      'git': { targetName: 'Git & Version Control', category: 'Tools' },
      'github': { targetName: 'Git & Version Control', category: 'Tools' },
      'cybersecurity': { targetName: 'Cybersecurity & OWASP Security', category: 'Cybersecurity' },
      'security': { targetName: 'Cybersecurity & OWASP Security', category: 'Cybersecurity' },
      'react native': { targetName: 'React Native', category: 'Mobile Development' },
      'mobile': { targetName: 'React Native', category: 'Mobile Development' }
    };

    if (aliases[raw]) {
      const target = aliases[raw];
      const matchInTaxonomy = taxonomy.find(t => t.name === target.targetName);
      return {
        name: target.targetName,
        category: target.category,
        taxonomyId: matchInTaxonomy?.id
      };
    }

    // Substring match in taxonomy
    const partialMatch = taxonomy.find(t => 
      t.name.toLowerCase().includes(raw) || raw.includes(t.name.toLowerCase())
    );
    if (partialMatch) {
      return { name: partialMatch.name, category: partialMatch.category, taxonomyId: partialMatch.id };
    }

    // Default category inference
    let category: SkillCategory = 'Technical';
    if (/python|java|c\+\+|javascript|typescript|golang|rust|c#/i.test(raw)) category = 'Programming Languages';
    else if (/react|angular|vue|svelte|html|css|tailwind|ui/i.test(raw)) category = 'Frontend';
    else if (/node|express|fastapi|django|flask|spring|nest/i.test(raw)) category = 'Backend';
    else if (/sql|postgres|mongo|redis|database|graphql/i.test(raw)) category = 'Database';
    else if (/aws|cloud|gcp|azure|s3|serverless/i.test(raw)) category = 'Cloud';
    else if (/docker|k8s|kubernetes|devops|ci\/cd|pipeline|jenkins/i.test(raw)) category = 'DevOps';
    else if (/ml|ai|llm|deep learning|vision|nlp|pytorch/i.test(raw)) category = 'AI/ML';
    else if (/communication|leadership|teamwork|agile|scrum/i.test(raw)) category = 'Soft Skills';

    return {
      name: rawName.trim(),
      category
    };
  },

  // Resume Analyses Storage
  getResumeAnalyses(studentId?: string): AIResumeAnalysis[] {
    const list = getFromStorage<AIResumeAnalysis[]>(STORAGE_KEYS.AI_RESUME_ANALYSES, []);
    return studentId ? list.filter(a => a.studentId === studentId) : list;
  },

  getLatestResumeAnalysis(studentId: string): AIResumeAnalysis | null {
    const list = this.getResumeAnalyses(studentId);
    if (list.length === 0) return null;
    return list.sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())[0];
  },

  saveResumeAnalysis(analysis: AIResumeAnalysis): void {
    const list = this.getResumeAnalyses();
    const existingIdx = list.findIndex(a => a.id === analysis.id);
    let updated: AIResumeAnalysis[];
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = analysis;
    } else {
      updated = [analysis, ...list];
    }
    saveToStorage(STORAGE_KEYS.AI_RESUME_ANALYSES, updated);

    // Update student's lastResumeAnalysisId
    const student = this.getStudent(analysis.studentId);
    if (student) {
      this.updateStudentProfile({
        ...student,
        lastResumeAnalysisId: analysis.id,
        resumeFileName: analysis.fileName,
        resumeUploadedAt: analysis.analyzedAt
      });
    }
  },

  updateDetectedSkill(analysisId: string, skillId: string, updates: Partial<AIDetectedSkill>): void {
    const list = this.getResumeAnalyses();
    const updated = list.map(analysis => {
      if (analysis.id === analysisId) {
        return {
          ...analysis,
          detectedSkills: analysis.detectedSkills.map(sk => 
            sk.id === skillId ? { ...sk, ...updates } : sk
          )
        };
      }
      return analysis;
    });
    saveToStorage(STORAGE_KEYS.AI_RESUME_ANALYSES, updated);
  },

  // Student Explicit Confirmation: Apply confirmed skills from AI Resume Analysis to Profile
  applyConfirmedSkillsToStudent(studentId: string, analysisId: string): { addedCount: number; updatedCount: number } {
    const analysis = this.getResumeAnalyses().find(a => a.id === analysisId);
    const student = this.getStudent(studentId);
    if (!analysis || !student) return { addedCount: 0, updatedCount: 0 };

    const confirmedSkills = analysis.detectedSkills.filter(s => s.status === 'Confirmed');
    const existingSkills = [...student.skills];
    let addedCount = 0;
    let updatedCount = 0;

    confirmedSkills.forEach(conf => {
      const normalized = this.normalizeSkillToTaxonomy(conf.name);
      const existingIdx = existingSkills.findIndex(
        s => s.name.toLowerCase() === normalized.name.toLowerCase()
      );

      if (existingIdx >= 0) {
        // Update proficiency if suggested or keep current
        existingSkills[existingIdx] = {
          ...existingSkills[existingIdx],
          name: normalized.name,
          category: normalized.category,
          proficiency: conf.suggestedProficiency || existingSkills[existingIdx].proficiency
        };
        updatedCount++;
      } else {
        // Add new student skill
        const newSkill: StudentSkill = {
          id: `ssk-ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          skillId: normalized.taxonomyId || `sk-gen-${Date.now()}`,
          name: normalized.name,
          category: normalized.category,
          proficiency: conf.suggestedProficiency || 'Intermediate',
          yearsOfExperience: 1,
          verified: false
        };
        existingSkills.push(newSkill);
        addedCount++;
      }
    });

    const completion = calculateProfileCompletion({ ...student, skills: existingSkills });
    this.updateStudentProfile({
      ...student,
      skills: existingSkills,
      profileCompletion: completion
    });

    // Also add projects and education if missing
    if (analysis.projects && analysis.projects.length > 0 && (!student.projects || student.projects.length === 0)) {
      const newProjects = analysis.projects.map((p, idx) => ({
        id: `proj-ai-${idx}-${Date.now()}`,
        title: p.title,
        description: p.description,
        technologies: p.technologies,
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl
      }));
      const current = this.getStudent(studentId);
      if (current) {
        this.updateStudentProfile({
          ...current,
          projects: newProjects
        });
      }
    }

    return { addedCount, updatedCount };
  },

  // Career Goal Management
  updateStudentCareerGoal(studentId: string, careerGoal: string, targetRole?: string): void {
    const student = this.getStudent(studentId);
    if (student) {
      this.updateStudentProfile({
        ...student,
        careerGoal,
        targetRole: targetRole || careerGoal
      });
    }
  },

  // Career Roadmaps Storage
  getCareerRoadmaps(studentId?: string): AICareerRoadmap[] {
    const list = getFromStorage<AICareerRoadmap[]>(STORAGE_KEYS.AI_CAREER_ROADMAPS, []);
    return studentId ? list.filter(r => r.studentId === studentId) : list;
  },

  getCareerRoadmap(studentId: string, targetRole?: string): AICareerRoadmap | null {
    const list = this.getCareerRoadmaps(studentId);
    if (list.length === 0) return null;
    if (targetRole) {
      const match = list.find(r => r.targetRole.toLowerCase() === targetRole.toLowerCase());
      if (match) return match;
    }
    return list.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())[0];
  },

  saveCareerRoadmap(roadmap: AICareerRoadmap): void {
    const list = this.getCareerRoadmaps();
    const existingIdx = list.findIndex(r => r.id === roadmap.id);
    let updated: AICareerRoadmap[];
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = roadmap;
    } else {
      updated = [roadmap, ...list];
    }
    saveToStorage(STORAGE_KEYS.AI_CAREER_ROADMAPS, updated);
  },

  toggleRoadmapStep(roadmapId: string, stepNumber: number): void {
    const list = this.getCareerRoadmaps();
    const updated = list.map(r => {
      if (r.id === roadmapId) {
        return {
          ...r,
          steps: r.steps.map(step => 
            step.stepNumber === stepNumber ? { ...step, completed: !step.completed } : step
          )
        };
      }
      return r;
    });
    saveToStorage(STORAGE_KEYS.AI_CAREER_ROADMAPS, updated);
  },

  // Learning Recommendations Storage
  getLearningRecommendations(studentId: string): AILearningRecommendation[] {
    const list = getFromStorage<AILearningRecommendation[]>(STORAGE_KEYS.AI_LEARNING_RECOMMENDATIONS, []);
    return list.filter(r => r.studentId === studentId);
  },

  saveLearningRecommendations(studentId: string, recs: AILearningRecommendation[]): void {
    const all = getFromStorage<AILearningRecommendation[]>(STORAGE_KEYS.AI_LEARNING_RECOMMENDATIONS, []);
    const filtered = all.filter(r => r.studentId !== studentId);
    saveToStorage(STORAGE_KEYS.AI_LEARNING_RECOMMENDATIONS, [...filtered, ...recs]);
  },

  // Mock Interview Sessions Storage
  getMockInterviewSessions(studentId?: string): AIMockInterviewSession[] {
    const list = getFromStorage<AIMockInterviewSession[]>(STORAGE_KEYS.AI_MOCK_INTERVIEWS, []);
    return studentId ? list.filter(s => s.studentId === studentId) : list;
  },

  getMockInterviewSession(sessionId: string): AIMockInterviewSession | null {
    const list = this.getMockInterviewSessions();
    return list.find(s => s.id === sessionId) || null;
  },

  saveMockInterviewSession(session: AIMockInterviewSession): void {
    const list = this.getMockInterviewSessions();
    const existingIdx = list.findIndex(s => s.id === session.id);
    let updated: AIMockInterviewSession[];
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = session;
    } else {
      updated = [session, ...list];
    }
    saveToStorage(STORAGE_KEYS.AI_MOCK_INTERVIEWS, updated);
  },

  // Saved Resumes Management (Phase 6 AI Resume Builder)
  getSavedResumes(studentId?: string): SavedResume[] {
    const list = getFromStorage<SavedResume[]>(STORAGE_KEYS.SAVED_RESUMES, []);
    return studentId ? list.filter(r => r.studentId === studentId) : list;
  },

  getSavedResume(resumeId: string): SavedResume | null {
    const list = this.getSavedResumes();
    return list.find(r => r.id === resumeId) || null;
  },

  saveResume(resume: SavedResume): void {
    const list = this.getSavedResumes();
    const existingIdx = list.findIndex(r => r.id === resume.id);
    let updated: SavedResume[];
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = { ...resume, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...resume, updatedAt: new Date().toISOString() }, ...list];
    }
    saveToStorage(STORAGE_KEYS.SAVED_RESUMES, updated);
  },

  deleteSavedResume(resumeId: string): void {
    const list = this.getSavedResumes();
    const updated = list.filter(r => r.id !== resumeId);
    saveToStorage(STORAGE_KEYS.SAVED_RESUMES, updated);
  },

  duplicateSavedResume(resumeId: string): SavedResume | null {
    const original = this.getSavedResume(resumeId);
    if (!original) return null;
    const duplicated: SavedResume = {
      ...original,
      id: `resume-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.saveResume(duplicated);
    return duplicated;
  },

  // ==========================================
  // PHASE 7: PLATFORM-WIDE ANALYTICS & INSIGHTS
  // ==========================================

  getAdminPlatformAnalytics() {
    const students = this.getStudents();
    const opportunities = this.getOpportunities();
    const applications = this.getApplications();
    const mentors = this.getMentors();
    const institution = this.getInstitution();
    const skillsTaxonomy = this.getSkills();
    const placements = this.getPlacements();

    const totalStudents = students.length;
    const totalCompanies = 84; // Platform registered organizations
    const totalInstitutions = 45; // Affiliated colleges/universities
    const totalMentors = mentors.length;
    const totalOpportunities = opportunities.length;
    const totalApplications = applications.length;

    const internshipOpportunities = opportunities.filter(o => o.type === 'Internship');
    const jobOpportunities = opportunities.filter(o => o.type === 'Job');

    const selectedApplications = applications.filter(a => a.status === 'Selected');
    const placementCount = selectedApplications.length + placements.length;
    const internshipCount = internshipOpportunities.length;
    const jobCount = jobOpportunities.length;

    // Average Skill Match
    let avgSkillMatch = 76;
    if (applications.length > 0) {
      const sumMatch = applications.reduce((acc, a) => acc + (a.skillMatchScore || 75), 0);
      avgSkillMatch = Math.round(sumMatch / applications.length);
    }

    // Skill demand frequency from active postings
    const skillDemandCounts: Record<string, { count: number; category: string }> = {};
    opportunities.forEach(opp => {
      opp.requiredSkills?.forEach(req => {
        if (!skillDemandCounts[req.skillName]) {
          const tax = skillsTaxonomy.find(s => s.name.toLowerCase() === req.skillName.toLowerCase());
          skillDemandCounts[req.skillName] = { count: 0, category: tax?.category || 'Technical' };
        }
        skillDemandCounts[req.skillName].count += (req.mandatory ? 2 : 1);
      });
    });

    const mostDemandedSkills = Object.entries(skillDemandCounts)
      .map(([name, data]) => ({ name, count: data.count, category: data.category }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Skill Gaps Calculation across student supply vs market demand
    const studentSkillSupply: Record<string, number> = {};
    students.forEach(st => {
      st.skills?.forEach(sk => {
        studentSkillSupply[sk.name] = (studentSkillSupply[sk.name] || 0) + 1;
      });
    });

    const mostCommonSkillGaps = skillsTaxonomy.map(tax => {
      const demand = skillDemandCounts[tax.name]?.count || (tax.industryDemandWeight > 7 ? tax.industryDemandWeight : 0);
      const supply = studentSkillSupply[tax.name] || 0;
      const deficit = Math.max(0, (demand * 3) - supply);
      return {
        skillName: tax.name,
        category: tax.category,
        demandScore: demand,
        studentSupply: supply,
        deficitScore: deficit
      };
    })
    .sort((a, b) => b.deficitScore - a.deficitScore)
    .slice(0, 8);

    // Application Status Funnel
    const statusCounts = {
      Applied: applications.filter(a => a.status === 'Applied').length,
      'Under Review': applications.filter(a => a.status === 'Under Review').length,
      Shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
      Interview: applications.filter(a => a.status === 'Interview').length,
      Selected: applications.filter(a => a.status === 'Selected').length,
      Rejected: applications.filter(a => a.status === 'Rejected').length
    };

    // Opportunity Distribution by Domain
    const domainCounts: Record<string, number> = {
      'Frontend & UI': 0,
      'Backend & Cloud': 0,
      'Full Stack Web': 0,
      'AI & Data Science': 0,
      'DevOps & Infra': 0,
      'Cybersecurity': 0
    };

    opportunities.forEach(opp => {
      const titleLower = opp.title.toLowerCase();
      if (titleLower.includes('frontend') || titleLower.includes('ui') || titleLower.includes('react')) domainCounts['Frontend & UI'] += 1;
      else if (titleLower.includes('backend') || titleLower.includes('node') || titleLower.includes('java')) domainCounts['Backend & Cloud'] += 1;
      else if (titleLower.includes('full stack') || titleLower.includes('fullstack')) domainCounts['Full Stack Web'] += 1;
      else if (titleLower.includes('ai') || titleLower.includes('ml') || titleLower.includes('data')) domainCounts['AI & Data Science'] += 1;
      else if (titleLower.includes('devops') || titleLower.includes('cloud')) domainCounts['DevOps & Infra'] += 1;
      else domainCounts['Cybersecurity'] += 1;
    });

    // Student department breakdown
    const departmentStats: Record<string, number> = {};
    students.forEach(st => {
      const branch = st.branch || 'Computer Science and Engineering';
      departmentStats[branch] = (departmentStats[branch] || 0) + 1;
    });

    return {
      totalStudents,
      totalCompanies,
      totalInstitutions,
      totalMentors,
      totalOpportunities,
      totalApplications,
      placementCount,
      internshipCount,
      jobCount,
      avgSkillMatch,
      mostDemandedSkills,
      mostCommonSkillGaps,
      statusCounts,
      domainCounts,
      departmentStats,
      institutionName: institution.name
    };
  },

  getMentorActionableInsights(mentorId?: string) {
    const students = this.getStudents();
    const goals = this.getMentorGoals();
    const applications = this.getApplications();

    const insights: {
      id: string;
      studentId: string;
      studentName: string;
      type: 'skill_gap' | 'goal_pending' | 'interview_prep' | 'profile_incomplete' | 'ready_for_roles';
      title: string;
      description: string;
      actionText: string;
      priority: 'high' | 'medium' | 'low';
    }[] = [];

    students.forEach(st => {
      const skills = st.skills || [];
      const hasFrontend = skills.some(s => ['react.js', 'vue.js', 'tailwind css', 'javascript'].includes(s.name.toLowerCase()) && (s.proficiency === 'Advanced' || s.proficiency === 'Intermediate'));
      const lacksBackend = !skills.some(s => ['node.js', 'sql & postgresql', 'fastapi', 'spring boot', 'mongodb'].includes(s.name.toLowerCase()) && s.verified);
      
      // Insight 1: Frontend heavy but targeting Full Stack
      if ((st.targetRole?.toLowerCase().includes('full stack') || st.careerGoal?.toLowerCase().includes('full stack')) && hasFrontend && lacksBackend) {
        insights.push({
          id: `ins-fe-be-${st.id}`,
          studentId: st.id,
          studentName: st.fullName,
          type: 'skill_gap',
          title: `Full Stack Gap: Backend Verification Needed`,
          description: `${st.fullName} has strong frontend proficiency (${skills.filter(s => s.category === 'Frontend').map(s => s.name).join(', ')}) but lacks verified backend (Node.js/SQL) credentials for Full Stack targets.`,
          actionText: 'Assign Node.js Milestone',
          priority: 'high'
        });
      }

      // Insight 2: High match applicant needing interview mock
      const studentApps = applications.filter(a => a.studentId === st.id);
      const interviewApps = studentApps.filter(a => a.status === 'Interview' || a.status === 'Shortlisted');
      if (interviewApps.length > 0) {
        insights.push({
          id: `ins-int-${st.id}`,
          studentId: st.id,
          studentName: st.fullName,
          type: 'interview_prep',
          title: `Active Interview Pipeline (${interviewApps[0].opportunityTitle})`,
          description: `${st.fullName} has been shortlisted by ${interviewApps[0].companyName}. Recommend a 1-on-1 mock technical session.`,
          actionText: 'Schedule Mock Session',
          priority: 'high'
        });
      }

      // Insight 3: Pending goals
      const stGoals = goals.filter(g => g.studentId === st.id && g.status === 'In Progress');
      if (stGoals.length > 0) {
        insights.push({
          id: `ins-goal-${st.id}`,
          studentId: st.id,
          studentName: st.fullName,
          type: 'goal_pending',
          title: `Active Goal: "${stGoals[0].title}"`,
          description: `Target skill: ${stGoals[0].targetSkill}. Target completion date is ${stGoals[0].targetDate}.`,
          actionText: 'Review Progress',
          priority: 'medium'
        });
      }
    });

    return insights;
  },

  // ==========================================
  // Certificate Verification & Credential Management
  // ==========================================
  getCertificates(studentId?: string): StudentCertification[] {
    const certs = getFromStorage<StudentCertification[]>(STORAGE_KEYS.CERTIFICATES, []);
    if (studentId) {
      return certs.filter(c => c.studentId === studentId);
    }
    return certs;
  },

  getCertificateById(id: string): StudentCertification | null {
    const certs = this.getCertificates();
    return certs.find(c => c.id === id) || null;
  },

  addCertificate(cert: Omit<StudentCertification, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): StudentCertification {
    const certs = this.getCertificates();
    const hasDocument = Boolean(cert.documentFileName || cert.documentUrl);
    
    // Strict Verification Rule: Student submission can only be 'Pending Verification' (with doc) or 'Not Submitted' (without doc).
    const initialStatus: CertificateVerificationStatus = hasDocument 
      ? 'Pending Verification' 
      : 'Not Submitted';

    const newCert: StudentCertification = {
      ...cert,
      id: cert.id || `cert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: initialStatus,
      verifiedAt: undefined,
      verifiedBy: undefined,
      verificationNote: hasDocument 
        ? 'Certificate document attached. Pending administrative review by National Credential Verification Cell.' 
        : 'Certificate metadata recorded without document file. Status: Not Submitted.',
      createdAt: cert.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newCert, ...certs];
    saveToStorage(STORAGE_KEYS.CERTIFICATES, updated);

    // Sync into student profile
    if (newCert.studentId) {
      const student = this.getProfileById(newCert.studentId) as StudentProfile | null;
      if (student && student.role === 'student') {
        const studentCerts = student.certifications || [];
        const existingIdx = studentCerts.findIndex(c => c.id === newCert.id);
        let updatedCerts: StudentCertification[];
        if (existingIdx >= 0) {
          updatedCerts = studentCerts.map(c => c.id === newCert.id ? newCert : c);
        } else {
          updatedCerts = [newCert, ...studentCerts];
        }
        this.updateProfile({
          ...student,
          certifications: updatedCerts
        });
      }
    }
    return newCert;
  },

  updateCertificate(cert: StudentCertification): void {
    const certs = this.getCertificates();
    const updated = certs.map(c => c.id === cert.id ? { ...cert, updatedAt: new Date().toISOString() } : c);
    saveToStorage(STORAGE_KEYS.CERTIFICATES, updated);

    // Also sync to student profile
    if (cert.studentId) {
      const student = this.getProfileById(cert.studentId) as StudentProfile | null;
      if (student && student.role === 'student') {
        const studentCerts = (student.certifications || []).map(c => c.id === cert.id ? cert : c);
        
        // If certified and verified, auto-verify corresponding skill in student skills if present
        let updatedSkills = student.skills || [];
        if (cert.status === 'Verified' && (cert.skillName || cert.title)) {
          const targetSkillName = (cert.skillName || cert.title).toLowerCase();
          updatedSkills = updatedSkills.map(s => {
            if (s.name.toLowerCase().includes(targetSkillName) || targetSkillName.includes(s.name.toLowerCase())) {
              return { 
                ...s, 
                verified: true, 
                verifiedScore: s.verifiedScore || 92, 
                lastAssessedAt: new Date().toISOString() 
              };
            }
            return s;
          });
        }

        this.updateProfile({
          ...student,
          skills: updatedSkills,
          certifications: studentCerts
        });
      }
    }
  },

  deleteCertificate(id: string): void {
    const certs = this.getCertificates();
    const target = certs.find(c => c.id === id);
    const updated = certs.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CERTIFICATES, updated);

    if (target && target.studentId) {
      const student = this.getProfileById(target.studentId) as StudentProfile | null;
      if (student && student.role === 'student') {
        const studentCerts = (student.certifications || []).filter(c => c.id !== id);
        this.updateProfile({
          ...student,
          certifications: studentCerts
        });
      }
    }
  },

  verifyCertificate(
    id: string, 
    status: 'Verified' | 'Rejected', 
    verifiedBy = 'National Credential Verification Cell (AICTE Prototype Demo Authority)', 
    verificationNote?: string
  ): StudentCertification | null {
    const cert = this.getCertificateById(id);
    if (!cert) return null;

    // Security Check: Cannot mark as Verified if no document was submitted
    if (status === 'Verified' && !cert.documentFileName && !cert.documentUrl) {
      console.warn(`[Security] Attempted to verify certificate ${id} without submitted document.`);
      return null;
    }

    const updatedCert: StudentCertification = {
      ...cert,
      status,
      verifiedAt: new Date().toISOString(),
      verifiedBy,
      verificationNote: verificationNote || (status === 'Verified' 
        ? 'Credential verified against national issuer registry API & official database.' 
        : 'Could not validate credential ID with issuer registry.')
    };

    this.updateCertificate(updatedCert);
    return updatedCert;
  },

  // ==========================================
  // LEARNING CATALOGUE ENROLLMENT & TRACKING
  // ==========================================
  getCourseEnrollments(studentId?: string): UserCourseEnrollment[] {
    const list = getFromStorage<UserCourseEnrollment[]>(STORAGE_KEYS.COURSE_ENROLLMENTS, []);
    if (!studentId) return list;
    return list.filter(e => e.studentId === studentId);
  },

  enrollInCourse(enrollment: Omit<UserCourseEnrollment, 'id' | 'enrolledAt'>): UserCourseEnrollment {
    const list = getFromStorage<UserCourseEnrollment[]>(STORAGE_KEYS.COURSE_ENROLLMENTS, []);
    // Check if already enrolled
    const existing = list.find(e => e.studentId === enrollment.studentId && e.courseId === enrollment.courseId);
    if (existing) {
      return existing;
    }

    const newEnrollment: UserCourseEnrollment = {
      ...enrollment,
      id: `enr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      enrolledAt: new Date().toISOString()
    };

    const updated = [newEnrollment, ...list];
    saveToStorage(STORAGE_KEYS.COURSE_ENROLLMENTS, updated);
    return newEnrollment;
  },

  updateCourseProgress(id: string, progressPercent: number, status?: 'Not Started' | 'In Progress' | 'Completed'): UserCourseEnrollment | null {
    const list = getFromStorage<UserCourseEnrollment[]>(STORAGE_KEYS.COURSE_ENROLLMENTS, []);
    const idx = list.findIndex(e => e.id === id);
    if (idx === -1) return null;

    const current = list[idx];
    const newStatus = status || (progressPercent >= 100 ? 'Completed' : progressPercent > 0 ? 'In Progress' : 'Not Started');
    const updatedItem: UserCourseEnrollment = {
      ...current,
      progressPercent: Math.min(100, Math.max(0, progressPercent)),
      status: newStatus,
      completedAt: newStatus === 'Completed' ? (current.completedAt || new Date().toISOString()) : undefined
    };

    list[idx] = updatedItem;
    saveToStorage(STORAGE_KEYS.COURSE_ENROLLMENTS, list);
    return updatedItem;
  },

  getBookmarkedCourseIds(studentId?: string): string[] {
    const map = getFromStorage<Record<string, string[]>>(STORAGE_KEYS.SAVED_COURSES, {});
    if (!studentId) return [];
    return map[studentId] || [];
  },

  toggleBookmarkCourse(studentId: string, courseId: string): boolean {
    const map = getFromStorage<Record<string, string[]>>(STORAGE_KEYS.SAVED_COURSES, {});
    const current = map[studentId] || [];
    let isBookmarked = false;
    let updated: string[];

    if (current.includes(courseId)) {
      updated = current.filter(id => id !== courseId);
      isBookmarked = false;
    } else {
      updated = [courseId, ...current];
      isBookmarked = true;
    }

    map[studentId] = updated;
    saveToStorage(STORAGE_KEYS.SAVED_COURSES, map);
    return isBookmarked;
  },

  // Reset demo storage to fresh state
  resetToDefaults(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    } catch {
      // Ignore
    }
    saveToStorage(STORAGE_KEYS.ALL_PROFILES, {});
    saveToStorage(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
    saveToStorage(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    saveToStorage(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    saveToStorage(STORAGE_KEYS.ASSESSMENTS, ASSESSMENT_BANK);
    saveToStorage(STORAGE_KEYS.ATTEMPTS, INITIAL_ASSESSMENT_ATTEMPTS);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    saveToStorage(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEWS);
    saveToStorage(STORAGE_KEYS.STUDENTS_POOL, ALL_DEMO_STUDENTS);
    saveToStorage(STORAGE_KEYS.INSTITUTION, DEMO_INSTITUTION);
    saveToStorage(STORAGE_KEYS.MENTORS, ALL_DEMO_MENTORS);
    saveToStorage(STORAGE_KEYS.MENTORSHIPS, INITIAL_MENTORSHIPS);
    saveToStorage(STORAGE_KEYS.MENTOR_GOALS, INITIAL_MENTOR_GOALS);
    saveToStorage(STORAGE_KEYS.MENTOR_SESSIONS, INITIAL_MENTOR_SESSIONS);
    saveToStorage(STORAGE_KEYS.TRAINING_PROGRAMS, INITIAL_TRAINING_PROGRAMS);
    saveToStorage(STORAGE_KEYS.TRAINING_REGISTRATIONS, INITIAL_TRAINING_REGISTRATIONS);
    saveToStorage(STORAGE_KEYS.PLACEMENTS, INITIAL_PLACEMENTS);
    saveToStorage(STORAGE_KEYS.AI_RESUME_ANALYSES, []);
    saveToStorage(STORAGE_KEYS.AI_CAREER_ROADMAPS, []);
    saveToStorage(STORAGE_KEYS.AI_LEARNING_RECOMMENDATIONS, []);
    saveToStorage(STORAGE_KEYS.AI_MOCK_INTERVIEWS, []);
    saveToStorage(STORAGE_KEYS.CERTIFICATES, []);
  }
};
