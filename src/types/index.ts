// Core Domain Types for SIH26044 Portal

export type UserRole = 'student' | 'company' | 'faculty' | 'mentor' | 'admin';

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type SkillCategory = 
  | 'Programming Languages' 
  | 'Frontend' 
  | 'Backend' 
  | 'Database' 
  | 'Cloud' 
  | 'DevOps' 
  | 'AI/ML' 
  | 'Data Science' 
  | 'Cybersecurity' 
  | 'Mobile Development' 
  | 'Tools' 
  | 'Soft Skills' 
  | 'Domain Skills'
  | 'Technical' 
  | 'Frameworks' 
  | 'Certifications';

export type ApplicationStatus = 
  | 'Applied' 
  | 'Under Review' 
  | 'Shortlisted' 
  | 'Interview' 
  | 'Selected' 
  | 'Rejected';

export type WorkMode = 'Remote' | 'On-site' | 'Hybrid';

export type OpportunityType = 'Internship' | 'Job' | 'Full-Time Placement' | 'Internship + PPO';

// Standard Industry Company
export interface IndustryCompany {
  id: string; // company_id
  company_id?: string;
  name: string; // company_name
  company_name?: string;
  industry: string;
  description: string; // company_description
  company_description?: string;
  website?: string;
  size: string; // company_size/category
  company_size?: string;
  headquarters: string; // headquarters_location
  headquarters_location?: string;
  logoUrl?: string;
}

// Base User Profile
export interface BaseProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  onboardingCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  grade: string; // e.g. "8.85 CGPA" or "88%"
  current?: boolean;
}

// Student Specific Profile
export interface StudentProfile extends BaseProfile {
  role: 'student';
  collegeName: string;
  degree: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  careerGoal?: string;
  targetRole?: string;
  careerDomain?: string;
  targetOpportunityType?: 'Internship' | 'Placement / Full-time Job' | 'Both' | string;
  preferredRole?: string;
  preferredWorkMode?: 'On-site' | 'Hybrid' | 'Remote' | 'No Preference' | string;
  lastResumeAnalysisId?: string;
  educationHistory?: StudentEducation[];
  resumeUrl?: string;
  resumeFileName?: string;
  resumeUploadedAt?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skills: StudentSkill[];
  certifications: StudentCertification[];
  projects: StudentProject[];
  profileCompletion: number; // 0 to 100
}

export interface StudentSkill {
  id: string;
  skillId: string;
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  yearsOfExperience?: number;
  verified: boolean;
  verifiedScore?: number;
  lastAssessedAt?: string;
}

export interface SkillMatchResult {
  scorePercentage: number;
  matchedCount: number;
  totalRequired: number;
  matchedSkills: {
    name: string;
    studentProficiency: ProficiencyLevel;
    requiredProficiency: ProficiencyLevel;
    mandatory: boolean;
  }[];
  improvementSkills: {
    name: string;
    studentProficiency: ProficiencyLevel;
    requiredProficiency: ProficiencyLevel;
    mandatory: boolean;
  }[];
  missingSkills: {
    name: string;
    requiredProficiency: ProficiencyLevel;
    mandatory: boolean;
  }[];
  explanation: string;
  recommendations: string[];
}

export type CertificateVerificationStatus = 'Not Submitted' | 'Pending Verification' | 'Verified' | 'Rejected';

export interface StudentCertification {
  id: string;
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  studentCollege?: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  credentialId?: string;
  skillCategory?: string;
  skillName?: string;
  status?: CertificateVerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationNote?: string;
  documentUrl?: string;
  documentFileName?: string;
  fileSize?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  startDate?: string;
  endDate?: string;
}

// Company Specific Profile
export interface CompanyProfile extends BaseProfile {
  role: 'company';
  companyName: string;
  industry: string;
  website: string;
  location: string;
  size: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  description: string;
  logoUrl?: string;
  verified: boolean;
  activeOpportunitiesCount: number;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
}

// Faculty / College Profile
export interface FacultyProfile extends BaseProfile {
  role: 'faculty';
  institutionId?: string;
  institutionName: string;
  department: string;
  designation: string;
  employeeId: string;
  areasOfSpecialization: string[];
}

// College / Institution Profile
export interface InstitutionProfile {
  id: string;
  name: string;
  type: 'NIT' | 'IIT' | 'IIIT' | 'Central University' | 'State University' | 'Autonomous Engineering College' | 'Private University';
  affiliation: string;
  accreditation: string; // e.g. "NAAC A++ | NBA Tier-1 | NIRF Ranked #28"
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  logoUrl?: string;
  description: string;
  establishedYear: number;
  totalStudentsCount?: number;
  totalFacultyCount?: number;
  updatedAt: string;
}

// Mentor Profile
export interface MentorProfile extends BaseProfile {
  role: 'mentor';
  organization: string;
  title: string;
  expertise: string[];
  skills: string[];
  yearsOfExperience: number;
  linkedInUrl?: string;
  maxMentees: number;
  currentMenteesCount: number;
  availability: 'Available' | 'Busy' | 'Unavailable';
}

// Mentorship Assignment & Goals
export interface MentorGoal {
  id: string;
  studentId: string;
  mentorId: string;
  mentorName?: string;
  title: string;
  description: string;
  targetSkill: string;
  targetDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed';
  createdAt: string;
  completedAt?: string;
}

export interface MentoringSession {
  id: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  mentorName: string;
  sessionDate: string; // YYYY-MM-DD
  sessionTime: string; // HH:MM
  sessionType: 'Online' | 'Offline' | 'Phone';
  meetingLinkOrVenue: string;
  topic?: string;
  notes?: string;
  actionItems?: string[];
  nextSessionDate?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface MentorshipAssignment {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorEmail: string;
  mentorOrganization: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  studentBranch: string;
  assignedBy: string; // e.g. "Dr. Rameshwar V. Iyer (HOD)"
  assignedAt: string;
  status: 'Active' | 'Completed' | 'Paused';
  notes?: string;
}

// Training / Upskilling Program
export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  skillId?: string;
  skillName: string;
  category: SkillCategory;
  targetProficiency: ProficiencyLevel;
  duration: string; // e.g. "4 Weeks", "40 Hours"
  mode: 'Online' | 'Offline' | 'Hybrid';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  registrationDeadline: string; // YYYY-MM-DD
  instructorName: string;
  capacity: number;
  enrolledCount: number;
  institutionId: string;
  institutionName: string;
  createdByFacultyId: string;
  syllabus: string[];
  status: 'Upcoming' | 'Active' | 'Completed';
  createdAt: string;
}

export interface TrainingRegistration {
  id: string;
  programId: string;
  programTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  studentBranch: string;
  registeredAt: string;
  status: 'Enrolled' | 'Completed' | 'Dropped';
}

// Placement Record
export interface PlacementRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  studentBranch: string;
  studentGraduationYear: number;
  companyId?: string;
  companyName: string;
  jobTitle: string;
  packageLpa: number; // in LPA e.g. 14.5
  workMode: WorkMode;
  placementDate: string; // YYYY-MM-DD
  status: 'Selected' | 'Offer Accepted' | 'Joined' | 'Rejected';
  verifiedByFacultyId?: string;
  createdAt: string;
}

// Admin Profile
export interface AdminProfile extends BaseProfile {
  role: 'admin';
  department: string;
  permissions: string[];
}

export type UserProfile = 
  | StudentProfile 
  | CompanyProfile 
  | FacultyProfile 
  | MentorProfile 
  | AdminProfile;

// Global Skill Taxonomy
export interface TaxonomySkill {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string;
  industryDemandWeight: number; // 1 to 10
}

// Internship / Job Opportunity
export interface Opportunity {
  id: string;
  opportunity_id?: string;
  companyId: string;
  company_id?: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  type: OpportunityType;
  opportunity_type?: OpportunityType;
  department?: string;
  domain?: string;
  description: string;
  responsibilities: string[];
  eligibility: string;
  minimumQualification?: string;
  minQualification?: string;
  location: string;
  workMode: WorkMode;
  work_mode?: WorkMode;
  duration?: string; // For internships e.g., "3 Months", "6 Months"
  stipendOrSalary: string; // e.g. "₹25,000 / month" or "₹8-12 LPA"
  stipendRange?: string; // for internships
  salaryRange?: string; // for full-time
  experienceRequired?: string;
  requiredSkills: {
    skillName: string;
    proficiency: ProficiencyLevel;
    mandatory: boolean;
  }[];
  preferredSkills?: string[];
  minCgpa?: number;
  targetBranches?: string[];
  graduationYear?: string;
  graduationYears?: number[];
  applicationDeadline: string;
  openings: number;
  status: 'Open' | 'Closed' | 'Draft';
  opportunityStatus?: string; // e.g. "Demo Opportunity Data"
  isDemoData?: boolean;
  createdAt: string;
  applicantCount: number;
}

// Application Entity
export interface Application {
  id: string;
  opportunityId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  studentCgpa: number;
  studentBranch?: string;
  studentGraduationYear?: number;
  studentSkills: { name: string; proficiency: ProficiencyLevel }[];
  opportunityTitle: string;
  companyName: string;
  companyId?: string;
  appliedAt: string;
  status: ApplicationStatus;
  skillMatchScore: number; // 0 to 100%
  matchingSkills: string[];
  missingSkills: string[];
  resumeUrl?: string;
  notes?: string;
  interviewDate?: string;
  interviewId?: string;
  updatedAt?: string;
}

// Interview Schedule Entity
export interface InterviewSchedule {
  id: string;
  applicationId: string;
  opportunityId: string;
  opportunityTitle: string;
  companyId: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM (e.g. 14:30)
  interviewType: 'Online' | 'In-Person' | 'Telephonic';
  meetingLinkOrVenue: string;
  interviewerName?: string;
  roundName: string; // e.g. "Technical Round 1", "HR Round", "System Architecture"
  instructions?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  createdAt: string;
}

// Skill Assessment
export interface SkillAssessment {
  id: string;
  skillId: string;
  skillName: string;
  category: SkillCategory;
  title: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScorePercentage: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AssessmentAttempt {
  id: string;
  studentId: string;
  assessmentId: string;
  skillName: string;
  scorePercentage: number;
  passed: boolean;
  evaluatedProficiency: ProficiencyLevel;
  completedAt: string;
  answers: { questionId: string; selectedOptionIndex: number; isCorrect: boolean }[];
}

// Mentorship Entity
export interface MentorshipRelation {
  id: string;
  mentorId: string;
  mentorName: string;
  studentId: string;
  studentName: string;
  status: 'Active' | 'Pending' | 'Completed';
  startDate: string;
  goals: { id: string; title: string; completed: boolean; dueDate?: string }[];
  sessions: { id: string; title: string; scheduledAt: string; status: 'Upcoming' | 'Completed' | 'Cancelled'; notes?: string }[];
}

// Notifications
export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application' | 'recommendation' | 'interview' | 'mentor' | 'announcement' | 'system';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Toast Alert
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

// ==========================================
// PHASE 6: AI INTELLIGENCE LAYER TYPES
// ==========================================

export type CareerGoalType = 
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'Data Analyst'
  | 'Data Scientist'
  | 'AI/ML Engineer'
  | 'Cloud Engineer'
  | 'DevOps Engineer'
  | 'Cybersecurity Analyst'
  | 'Mobile Developer'
  | 'Systems / Embedded Engineer'
  | 'Product / QA Engineer'
  | string;

export interface AIDetectedSkill {
  id: string;
  name: string;
  category: SkillCategory;
  confidence: 'High' | 'Medium' | 'Low';
  evidence: string;
  status: 'Pending' | 'Confirmed' | 'Ignored';
  suggestedProficiency?: ProficiencyLevel;
}

export interface AIResumeScoreBreakdown {
  structure: number; // 0-100
  skillsPresentation: number; // 0-100
  projectQuality: number; // 0-100
  experienceRelevance: number; // 0-100
  educationClarity: number; // 0-100
  achievementEvidence: number; // 0-100
  completeness: number; // 0-100
  readability: number; // 0-100
}

export interface AIResumeAnalysis {
  id: string;
  studentId: string;
  fileName: string;
  fileSize?: string;
  resumeScore: number; // 0-100 overall
  scoreBreakdown: AIResumeScoreBreakdown;
  scoreReasoning: string;
  summary: string;
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
    careerInterests?: string[];
  };
  education: {
    degree: string;
    branch: string;
    institution: string;
    graduationYear: number;
    cgpaOrPercentage?: string;
  }[];
  detectedSkills: AIDetectedSkill[];
  experience: {
    role: string;
    organization: string;
    duration: string;
    responsibilities: string[];
  }[];
  projects: {
    title: string;
    technologies: string[];
    description: string;
    githubUrl?: string;
    liveUrl?: string;
  }[];
  certifications: {
    title: string;
    issuer: string;
    date?: string;
    credentialId?: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  actionableImprovements: string[];
  analyzedAt: string;
}

export interface AICareerRoadmapStep {
  stepNumber: number;
  phaseTitle: string;
  skillsOrTopics: string[];
  whyItMatters: string;
  suggestedPractice: string;
  suggestedProject: string;
  expectedOutcome: string;
  estimatedDuration: string;
  completed?: boolean;
}

export interface AICareerRoadmap {
  id: string;
  studentId: string;
  targetRole: string;
  careerGoal: string;
  currentProficiencySummary: string;
  targetTimelineWeeks: number;
  steps: AICareerRoadmapStep[];
  generatedAt: string;
}

export interface AISkillGapIntelligence {
  targetRoleOrOpportunity: string;
  matchScore: number;
  explanation: string;
  strengths: { skill: string; why: string }[];
  improve: { skill: string; current: ProficiencyLevel; required: ProficiencyLevel; recommendation: string }[];
  missing: { skill: string; priority: 'High' | 'Medium' | 'Low'; learningPath: string }[];
  actionPlan: string[];
}

export interface AILearningRecommendation {
  id: string;
  studentId: string;
  skillName: string;
  gapType: 'Missing' | 'Improvement';
  topic: string;
  recommendation: string;
  suggestedPractice: string;
  suggestedProject: string;
  documentationResource: string;
  certificationName: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedHours: number;
}

export interface AIOpportunityExplanation {
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  explanationText: string;
  matchingStrengths: string[];
  missingRequirements: string[];
  recommendedAction: string;
}

export interface AIInterviewQuestion {
  id: string;
  type: 'Technical' | 'Project-Based' | 'Behavioral';
  question: string;
  relatedSkillOrProject: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  hints: string[];
  modelAnswerGuidance: string[];
  followUpQuestions: string[];
}

export interface AIMockInterviewTurn {
  id: string;
  questionIndex: number;
  question: string;
  studentAnswer: string;
  feedback: {
    relevanceScore: number; // 1-10
    clarityScore: number; // 1-10
    technicalScore: number; // 1-10
    completenessScore: number; // 1-10
    communicationScore: number; // 1-10
    feedbackNotes: string;
    strengths: string[];
    missedKeyPoints: string[];
    suggestedRefinement: string;
  };
  followUpQuestion?: string;
  isCompleted?: boolean;
}

export interface AIMockInterviewSession {
  id: string;
  studentId: string;
  studentName: string;
  targetRole: string;
  opportunityTitle?: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  status: 'In Progress' | 'Completed';
  totalQuestions: number;
  currentQuestionIndex: number;
  turns: AIMockInterviewTurn[];
  overallScore?: number; // 1-100
  performanceSummary?: string;
  strengthsSummary?: string[];
  growthAreas?: string[];
  createdAt: string;
  completedAt?: string;
}

// ===================================================
// AI RESUME BUILDER MODULE TYPES (PHASE 6)
// ===================================================

export type ResumeTemplateId = 'ats-classic' | 'modern-pro' | 'minimal' | 'developer';

export interface ResumePersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface ResumeEducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string | number;
  endYear: string | number;
  grade: string;
  highlights?: string[];
}

export interface ResumeExperienceItem {
  id: string;
  role: string;
  organization: string;
  location?: string;
  duration: string;
  isInternship?: boolean;
  bullets: string[];
}

export interface ResumeProjectItem {
  id: string;
  title: string;
  technologies: string[];
  duration?: string;
  githubUrl?: string;
  liveUrl?: string;
  bullets: string[];
}

export interface ResumeSkillCategoryGroup {
  id: string;
  category: string;
  skills: string[];
}

export interface ResumeCertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  credentialId?: string;
}

export interface ResumeAchievementItem {
  id: string;
  title: string;
  description: string;
  year?: string;
}

export interface ResumeSectionVisibility {
  summary: boolean;
  skills: boolean;
  experience: boolean;
  projects: boolean;
  education: boolean;
  certifications: boolean;
  achievements: boolean;
}

export interface ResumeContent {
  personalInfo: ResumePersonalInfo;
  summary: string;
  skillGroups: ResumeSkillCategoryGroup[];
  experience: ResumeExperienceItem[];
  projects: ResumeProjectItem[];
  education: ResumeEducationItem[];
  certifications: ResumeCertificationItem[];
  achievements: ResumeAchievementItem[];
  sectionVisibility: ResumeSectionVisibility;
}

export interface ResumeATSScoreBreakdown {
  keywordRelevance: number; // 0-100
  skillsAlignment: number; // 0-100
  sectionCompleteness: number; // 0-100
  formatting: number; // 0-100
  readability: number; // 0-100
  jobAlignment: number; // 0-100
}

export interface ResumeATSAnalysis {
  overallScore: number; // 0-100
  breakdown: ResumeATSScoreBreakdown;
  strengths: string[];
  missingKeywords: string[];
  actionableImprovements: string[];
  analyzedAt: string;
}

export interface SavedResume {
  id: string;
  studentId: string;
  name: string;
  targetRole: string;
  template: ResumeTemplateId;
  jobDescription?: string;
  content: ResumeContent;
  atsAnalysis?: ResumeATSAnalysis;
  createdAt: string;
  updatedAt: string;
}

// ===================================================
// CURATED 500-RESOURCE LEARNING CATALOGUE TYPES
// ===================================================

export type CourseProgressStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface LearningResource {
  id: string;
  title: string;
  platform: string; // e.g. "NPTEL", "Coursera (DeepLearning.AI)", "Microsoft Learn", "AWS Skill Builder", "freeCodeCamp", "IBM", "Google Cloud", etc.
  category: string; // e.g. "AI / Machine Learning", "Data Science & Analytics", "Python & Programming", "Web Development & Full Stack", "Java & Backend", "DSA & Computer Science", "Cloud & DevOps", "Cybersecurity", "SQL & Databases", "Mobile Development", "UI/UX Design", "Business & Product Management", "Digital Marketing", "Communication & Soft Skills"
  skills: string[]; // specific skills taught
  career_roles: string[]; // relevant target career roles
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string; // e.g. "4 Weeks", "15 Hours", "8 Weeks"
  free_or_paid: 'Free' | 'Paid' | 'Free Audit Available' | 'Free with Certification' | string;
  certificate_available: boolean;
  description: string;
  course_url: string; // verified URL or empty string if not verifiable
  rating?: number;
  language?: string;
  prerequisites?: string[];
  enrolledCount?: string;
  badgeTag?: string;
}

export interface UserCourseEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  platform: string;
  status: CourseProgressStatus;
  enrolledAt: string;
  completedAt?: string;
  progressPercent: number; // 0 to 100
  notes?: string;
}


