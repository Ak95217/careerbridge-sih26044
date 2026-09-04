import { 
  UserProfile, 
  StudentProfile, 
  CompanyProfile, 
  FacultyProfile, 
  MentorProfile, 
  AdminProfile, 
  TaxonomySkill, 
  Opportunity, 
  Application,
  AssessmentAttempt,
  AppNotification
} from '../types';
import { INDUSTRY_COMPANIES } from '../data/companiesData';
import { INDUSTRY_OPPORTUNITIES } from '../data/opportunitiesData';

export { INDUSTRY_COMPANIES, INDUSTRY_OPPORTUNITIES };

export const INITIAL_SKILLS: TaxonomySkill[] = [
  // Programming Languages
  { id: 'sk-1', name: 'TypeScript', category: 'Programming Languages', description: 'Typed JavaScript for robust enterprise applications', industryDemandWeight: 9 },
  { id: 'sk-2', name: 'Python', category: 'Programming Languages', description: 'General purpose, backend scripting, and AI/ML', industryDemandWeight: 10 },
  { id: 'sk-3', name: 'Java', category: 'Programming Languages', description: 'Enterprise backend & distributed systems', industryDemandWeight: 9 },
  { id: 'sk-4', name: 'C++', category: 'Programming Languages', description: 'High-performance computing and low-level systems', industryDemandWeight: 8 },
  { id: 'sk-5', name: 'Go (Golang)', category: 'Programming Languages', description: 'Concurrent cloud microservices & tooling', industryDemandWeight: 8 },

  // Frontend
  { id: 'sk-6', name: 'React.js', category: 'Frontend', description: 'Component-driven UI architecture and virtual DOM', industryDemandWeight: 10 },
  { id: 'sk-7', name: 'Next.js', category: 'Frontend', description: 'Full-stack React framework with SSR and server actions', industryDemandWeight: 9 },
  { id: 'sk-8', name: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first styling with high design velocity', industryDemandWeight: 8 },
  { id: 'sk-9', name: 'Vue.js', category: 'Frontend', description: 'Progressive JavaScript framework for SPAs', industryDemandWeight: 7 },

  // Backend
  { id: 'sk-10', name: 'Node.js', category: 'Backend', description: 'Asynchronous event-driven server runtime', industryDemandWeight: 9 },
  { id: 'sk-11', name: 'Express.js', category: 'Backend', description: 'Fast, minimalist web framework for Node', industryDemandWeight: 8 },
  { id: 'sk-12', name: 'FastAPI', category: 'Backend', description: 'High-performance Python async API framework', industryDemandWeight: 8 },
  { id: 'sk-13', name: 'Spring Boot', category: 'Backend', description: 'Production-ready enterprise Java microservices', industryDemandWeight: 8 },

  // Database
  { id: 'sk-14', name: 'SQL & PostgreSQL', category: 'Database', description: 'ACID relational database design & query optimization', industryDemandWeight: 9 },
  { id: 'sk-15', name: 'MongoDB', category: 'Database', description: 'Document-based NoSQL database for flexible schemas', industryDemandWeight: 7 },
  { id: 'sk-16', name: 'Redis', category: 'Database', description: 'In-memory cache and pub/sub message broker', industryDemandWeight: 8 },

  // Cloud & DevOps
  { id: 'sk-17', name: 'Cloud Computing (AWS/GCP)', category: 'Cloud', description: 'Serverless compute, S3, IAM, and VPC infrastructure', industryDemandWeight: 9 },
  { id: 'sk-18', name: 'Docker & Kubernetes', category: 'DevOps', description: 'Containerization, orchestration, and service meshes', industryDemandWeight: 9 },
  { id: 'sk-19', name: 'CI/CD Pipelines (GitHub Actions)', category: 'DevOps', description: 'Automated test, build, and deployment automation', industryDemandWeight: 8 },

  // AI/ML & Data Science
  { id: 'sk-20', name: 'Machine Learning & Deep Learning', category: 'AI/ML', description: 'Supervised/unsupervised models, PyTorch, scikit-learn', industryDemandWeight: 10 },
  { id: 'sk-21', name: 'Generative AI & LLM Engineering', category: 'AI/ML', description: 'RAG architectures, prompt engineering, vector databases', industryDemandWeight: 10 },
  { id: 'sk-22', name: 'Data Analysis & PowerBI', category: 'Data Science', description: 'Data wrangling, statistical modeling, and dashboards', industryDemandWeight: 7 },

  // Cybersecurity & Mobile
  { id: 'sk-23', name: 'Cybersecurity & OWASP Security', category: 'Cybersecurity', description: 'Application security, penetration testing, encryption', industryDemandWeight: 8 },
  { id: 'sk-24', name: 'React Native', category: 'Mobile Development', description: 'Cross-platform mobile apps for iOS and Android', industryDemandWeight: 7 },

  // Tools & Technical Foundation
  { id: 'sk-25', name: 'Problem Solving & DSA', category: 'Technical', description: 'Data structures, algorithms, and complexity analysis', industryDemandWeight: 10 },
  { id: 'sk-26', name: 'System Design & Scalability', category: 'Domain Skills', description: 'Distributed systems, load balancing, and caching', industryDemandWeight: 9 },
  { id: 'sk-27', name: 'Git & Version Control', category: 'Tools', description: 'Branching strategies, merge conflict resolution', industryDemandWeight: 8 },
  { id: 'sk-28', name: 'Technical Communication & Agile', category: 'Soft Skills', description: 'Sprint planning, documentation, and stakeholder syncs', industryDemandWeight: 8 }
];

export const DEMO_STUDENT: StudentProfile = {
  id: 'usr-student-1',
  email: 'student@college.edu',
  fullName: 'Not provided',
  phone: '',
  role: 'student',
  avatarUrl: '',
  bio: '',
  location: 'Not provided',
  collegeName: 'Not provided',
  degree: '',
  branch: '',
  graduationYear: 2026,
  cgpa: 0,
  educationHistory: [],
  resumeUrl: '',
  resumeFileName: '',
  resumeUploadedAt: '',
  githubUrl: '',
  linkedinUrl: '',
  portfolioUrl: '',
  profileCompletion: 0,
  skills: [],
  certifications: [],
  projects: [],
  createdAt: '2026-01-10T10:00:00Z',
  updatedAt: '2026-08-20T14:30:00Z'
};

export const DEMO_COMPANY: CompanyProfile = {
  id: 'usr-company-1',
  email: 'talent@tcs-innovations.com',
  fullName: 'Vikram Sengupta (Talent Acquisition Lead)',
  phone: '+91 22 6778 9000',
  role: 'company',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  bio: 'Leading digital transformation and campus engineering hiring across Tier 1 & 2 engineering institutes in India.',
  companyName: 'Tata Consultancy Digital & Cloud Labs',
  industry: 'Enterprise Software & Cloud AI Solutions',
  website: 'https://tcs.com',
  location: 'Bangalore / Hyderabad / Pune',
  size: '500+',
  description: 'Global leader in IT services, digital consulting, and enterprise software engineering powering premier Fortune 500 solutions.',
  logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
  verified: true,
  activeOpportunitiesCount: 4,
  createdAt: '2026-01-05T09:00:00Z',
  updatedAt: '2026-08-22T11:00:00Z'
};

export const DEMO_FACULTY: FacultyProfile = {
  id: 'usr-faculty-1',
  email: 'hod.cse@nitdelhi.ac.in',
  fullName: 'Dr. Rameshwar V. Iyer',
  phone: '+91 11 2778 7500',
  role: 'faculty',
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  bio: 'Professor and Head of Department, Computer Science & Engineering. Overseeing training, curriculum-industry alignment, and campus placement drives.',
  institutionId: 'inst-1',
  institutionName: 'National Institute of Technology, New Delhi',
  department: 'Computer Science and Engineering',
  designation: 'Professor & Head of Department (T&P Coordinator)',
  employeeId: 'NITD-FAC-2014-089',
  areasOfSpecialization: ['Distributed Systems', 'Applied Machine Learning', 'Curriculum Industry-Bridging'],
  createdAt: '2026-01-02T08:00:00Z',
  updatedAt: '2026-08-25T16:00:00Z'
};

export const DEMO_MENTOR: MentorProfile = {
  id: 'usr-mentor-1',
  email: 'priya.nair@techlead.io',
  fullName: 'Priya Nair',
  phone: '+91 98200 11223',
  role: 'mentor',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  bio: 'Staff Software Architect with 11+ years leading distributed systems at top tech companies. Passionate about mentoring aspiring engineers in system design & career roadmap.',
  organization: 'Google Cloud / Open Source Contributor',
  title: 'Staff Software Architect & Tech Mentor',
  expertise: ['Full-Stack Architecture', 'System Design', 'Cloud Scalability', 'Interview Prep'],
  skills: ['TypeScript', 'React.js', 'Node.js', 'SQL & PostgreSQL', 'System Design & Scalability', 'Cloud Computing (AWS/GCP)'],
  yearsOfExperience: 11,
  linkedInUrl: 'https://linkedin.com/in/priyanair-lead',
  maxMentees: 6,
  currentMenteesCount: 3,
  availability: 'Available',
  createdAt: '2026-01-08T12:00:00Z',
  updatedAt: '2026-08-24T18:00:00Z'
};

export const DEMO_ADMIN: AdminProfile = {
  id: 'usr-admin-1',
  email: 'director@sih-portal.gov.in',
  fullName: 'Admin Control Authority (SIH Center)',
  phone: '+91 11 2338 1000',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  bio: 'Central Administrative Officer for National Academia-Industry Skill Mapping & Placement Operations.',
  department: 'Ministry of Education & AICTE Hackathon Directorate',
  permissions: ['manage_users', 'verify_institutions', 'verify_companies', 'manage_taxonomy', 'audit_system'],
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-08-26T00:00:00Z'
};

export const ALL_DEMO_USERS: Record<string, UserProfile> = {
  student: DEMO_STUDENT,
  company: DEMO_COMPANY,
  faculty: DEMO_FACULTY,
  mentor: DEMO_MENTOR,
  admin: DEMO_ADMIN
};

export const INITIAL_OPPORTUNITIES: Opportunity[] = INDUSTRY_OPPORTUNITIES;

export const ALL_DEMO_STUDENTS: StudentProfile[] = [
  DEMO_STUDENT,
  {
    id: 'usr-student-2',
    email: 'sneha.reddy@iith.ac.in',
    fullName: 'Sneha Reddy',
    phone: '+91 98450 67890',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Machine Learning & Applied AI enthusiast with research experience in LLMs, RAG frameworks, and computer vision.',
    location: 'Hyderabad, India',
    collegeName: 'Indian Institute of Technology, Hyderabad',
    degree: 'B.Tech in Artificial Intelligence',
    branch: 'Computer Science & AI',
    graduationYear: 2026,
    cgpa: 9.20,
    educationHistory: [
      {
        id: 'edu-201',
        institution: 'IIT Hyderabad',
        degree: 'B.Tech in AI',
        fieldOfStudy: 'Artificial Intelligence & Machine Learning',
        startYear: 2022,
        endYear: 2026,
        grade: '9.20 CGPA',
        current: true
      }
    ],
    resumeFileName: 'Sneha_Reddy_AI_Resume.pdf',
    githubUrl: 'https://github.com/snehareddy-ai',
    linkedinUrl: 'https://linkedin.com/in/sneha-reddy-ai',
    portfolioUrl: 'https://snehareddy.ml',
    profileCompletion: 95,
    skills: [
      { id: 'ssk-201', skillId: 'sk-2', name: 'Python', category: 'Programming Languages', proficiency: 'Expert', yearsOfExperience: 3, verified: true, verifiedScore: 96, lastAssessedAt: '2026-08-05' },
      { id: 'ssk-202', skillId: 'sk-20', name: 'Machine Learning & Deep Learning', category: 'AI/ML', proficiency: 'Advanced', yearsOfExperience: 2, verified: true, verifiedScore: 90, lastAssessedAt: '2026-08-08' },
      { id: 'ssk-203', skillId: 'sk-21', name: 'Generative AI & LLM Engineering', category: 'AI/ML', proficiency: 'Advanced', yearsOfExperience: 1, verified: true, verifiedScore: 94, lastAssessedAt: '2026-08-12' },
      { id: 'ssk-204', skillId: 'sk-14', name: 'SQL & PostgreSQL', category: 'Database', proficiency: 'Intermediate', yearsOfExperience: 2, verified: false },
      { id: 'ssk-205', skillId: 'sk-12', name: 'FastAPI', category: 'Backend', proficiency: 'Intermediate', yearsOfExperience: 1, verified: false }
    ],
    certifications: [
      { id: 'cert-201', title: 'DeepLearning.AI Deep Learning Specialization', issuer: 'Coursera / DeepLearning.AI', issueDate: '2025-08-10', credentialUrl: '#' }
    ],
    projects: [
      {
        id: 'proj-201',
        title: 'MedRAG - Medical Document Q&A Agent',
        description: 'Multi-agent retrieval system for clinical trials using vector embeddings and chunked cross-encoders.',
        technologies: ['Python', 'FastAPI', 'PyTorch', 'ChromaDB', 'LangChain'],
        githubUrl: 'https://github.com/snehareddy-ai/medrag'
      }
    ],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z'
  },
  {
    id: 'usr-student-3',
    email: 'rohan.kulkarni@pilani.bits-pilani.ac.in',
    fullName: 'Rohan Kulkarni',
    phone: '+91 97654 32109',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'DevOps and Cloud Systems Engineer with deep interest in Kubernetes orchestration, Terraform automation, and Go microservices.',
    location: 'Pune / Goa, India',
    collegeName: 'BITS Pilani (Goa Campus)',
    degree: 'B.E. (Hons) in Computer Science',
    branch: 'Computer Science and Engineering',
    graduationYear: 2026,
    cgpa: 8.45,
    educationHistory: [
      {
        id: 'edu-301',
        institution: 'BITS Pilani, Goa Campus',
        degree: 'B.E. (Hons) CS',
        fieldOfStudy: 'Computer Science',
        startYear: 2022,
        endYear: 2026,
        grade: '8.45 CGPA',
        current: true
      }
    ],
    resumeFileName: 'Rohan_Kulkarni_DevOps.pdf',
    githubUrl: 'https://github.com/rohankulkarni-ops',
    profileCompletion: 90,
    skills: [
      { id: 'ssk-301', skillId: 'sk-18', name: 'Docker & Kubernetes', category: 'DevOps', proficiency: 'Advanced', yearsOfExperience: 2, verified: true, verifiedScore: 91, lastAssessedAt: '2026-07-28' },
      { id: 'ssk-302', skillId: 'sk-17', name: 'Cloud Computing (AWS/GCP)', category: 'Cloud', proficiency: 'Advanced', yearsOfExperience: 2, verified: true, verifiedScore: 89, lastAssessedAt: '2026-08-01' },
      { id: 'ssk-303', skillId: 'sk-19', name: 'CI/CD Pipelines (GitHub Actions)', category: 'DevOps', proficiency: 'Intermediate', yearsOfExperience: 2, verified: false },
      { id: 'ssk-304', skillId: 'sk-5', name: 'Go (Golang)', category: 'Programming Languages', proficiency: 'Intermediate', yearsOfExperience: 1, verified: false },
      { id: 'ssk-305', skillId: 'sk-27', name: 'Git & Version Control', category: 'Tools', proficiency: 'Advanced', yearsOfExperience: 3, verified: true, verifiedScore: 95 }
    ],
    certifications: [
      { id: 'cert-301', title: 'Certified Kubernetes Administrator (CKA)', issuer: 'Linux Foundation', issueDate: '2025-10-12', credentialUrl: '#' }
    ],
    projects: [
      {
        id: 'proj-301',
        title: 'KubeAutoScaler - Metrics driven HPA Controller',
        description: 'Custom Kubernetes CRD and Go operator for predictive pod scaling based on Prometheus query thresholds.',
        technologies: ['Go', 'Kubernetes', 'Prometheus', 'Docker'],
        githubUrl: 'https://github.com/rohankulkarni-ops/kube-autoscaler'
      }
    ],
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-08-18T10:00:00Z'
  },
  {
    id: 'usr-student-4',
    email: 'ananya.verma@dtu.ac.in',
    fullName: 'Ananya Verma',
    phone: '+91 99887 76655',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'High-throughput backend engineer. Focused on relational database query optimization, Redis caches, and distributed event architectures.',
    location: 'New Delhi, India',
    collegeName: 'Delhi Technological University (DTU)',
    degree: 'B.Tech in Information Technology',
    branch: 'Information Technology',
    graduationYear: 2026,
    cgpa: 8.92,
    educationHistory: [
      {
        id: 'edu-401',
        institution: 'Delhi Technological University',
        degree: 'B.Tech IT',
        fieldOfStudy: 'Information Technology',
        startYear: 2022,
        endYear: 2026,
        grade: '8.92 CGPA',
        current: true
      }
    ],
    resumeFileName: 'Ananya_Verma_Backend.pdf',
    githubUrl: 'https://github.com/ananyaverma-dev',
    profileCompletion: 92,
    skills: [
      { id: 'ssk-401', skillId: 'sk-10', name: 'Node.js', category: 'Backend', proficiency: 'Advanced', yearsOfExperience: 2, verified: true, verifiedScore: 90, lastAssessedAt: '2026-08-14' },
      { id: 'ssk-402', skillId: 'sk-14', name: 'SQL & PostgreSQL', category: 'Database', proficiency: 'Advanced', yearsOfExperience: 2, verified: true, verifiedScore: 94, lastAssessedAt: '2026-08-11' },
      { id: 'ssk-403', skillId: 'sk-25', name: 'Problem Solving & DSA', category: 'Technical', proficiency: 'Advanced', yearsOfExperience: 3, verified: true, verifiedScore: 93, lastAssessedAt: '2026-07-25' },
      { id: 'ssk-404', skillId: 'sk-26', name: 'System Design & Scalability', category: 'Domain Skills', proficiency: 'Intermediate', yearsOfExperience: 1, verified: false },
      { id: 'ssk-405', skillId: 'sk-16', name: 'Redis', category: 'Database', proficiency: 'Intermediate', yearsOfExperience: 1, verified: false }
    ],
    certifications: [
      { id: 'cert-401', title: 'PostgreSQL Advanced Query & Tuning', issuer: 'EnterpriseDB', issueDate: '2025-09-18', credentialUrl: '#' }
    ],
    projects: [
      {
        id: 'proj-401',
        title: 'FlashOrder - Low Latency Order Engine',
        description: 'Microservice handling concurrent seat reservations with distributed Redis locks and PostgreSQL idempotency.',
        technologies: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
        githubUrl: 'https://github.com/ananyaverma-dev/flashorder'
      }
    ],
    createdAt: '2026-01-22T10:00:00Z',
    updatedAt: '2026-08-21T10:00:00Z'
  },
  {
    id: 'usr-student-5',
    email: 'karthik.raman@vit.ac.in',
    fullName: 'Karthik Raman',
    phone: '+91 91234 56780',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Mobile and Frontend Specialist with 3+ published React Native apps on Google Play Store and iOS App Store.',
    location: 'Chennai / Vellore, India',
    collegeName: 'Vellore Institute of Technology (VIT)',
    degree: 'B.Tech in Computer Science',
    branch: 'Computer Science and Engineering',
    graduationYear: 2026,
    cgpa: 8.15,
    educationHistory: [
      {
        id: 'edu-501',
        institution: 'VIT Vellore',
        degree: 'B.Tech CSE',
        fieldOfStudy: 'Computer Science',
        startYear: 2022,
        endYear: 2026,
        grade: '8.15 CGPA',
        current: true
      }
    ],
    resumeFileName: 'Karthik_Raman_Mobile.pdf',
    githubUrl: 'https://github.com/karthikraman-app',
    profileCompletion: 86,
    skills: [
      { id: 'ssk-501', skillId: 'sk-24', name: 'React Native', category: 'Mobile Development', proficiency: 'Advanced', yearsOfExperience: 2, verified: true, verifiedScore: 88, lastAssessedAt: '2026-08-02' },
      { id: 'ssk-502', skillId: 'sk-6', name: 'React.js', category: 'Frontend', proficiency: 'Advanced', yearsOfExperience: 2, verified: true, verifiedScore: 86, lastAssessedAt: '2026-08-04' },
      { id: 'ssk-503', skillId: 'sk-1', name: 'TypeScript', category: 'Programming Languages', proficiency: 'Intermediate', yearsOfExperience: 2, verified: true, verifiedScore: 80 },
      { id: 'ssk-504', skillId: 'sk-8', name: 'Tailwind CSS', category: 'Frontend', proficiency: 'Advanced', yearsOfExperience: 2, verified: false }
    ],
    certifications: [
      { id: 'cert-501', title: 'React Native Cross-Platform Specialist', issuer: 'Meta', issueDate: '2025-05-15', credentialUrl: '#' }
    ],
    projects: [
      {
        id: 'proj-501',
        title: 'FitTrack Pro - Cross-Platform Fitness App',
        description: 'Offline-first health tracker using SQLite, Bluetooth heart rate sync, and React Native animations.',
        technologies: ['React Native', 'TypeScript', 'Redux Toolkit', 'SQLite'],
        githubUrl: 'https://github.com/karthikraman-app/fittrack'
      }
    ],
    createdAt: '2026-01-25T10:00:00Z',
    updatedAt: '2026-08-19T10:00:00Z'
  },
  {
    id: 'usr-student-6',
    email: 'meera.sundaram@iiitb.ac.in',
    fullName: 'Meera Sundaram',
    phone: '+91 93456 78901',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Data Science and Analytics student specializing in statistical modeling, business intelligence dashboards, and predictive feature engineering.',
    location: 'Bangalore, India',
    collegeName: 'International Institute of Information Technology, Bangalore (IIIT-B)',
    degree: 'Integrated M.Tech in Data Science',
    branch: 'Data Science & Analytics',
    graduationYear: 2026,
    cgpa: 9.08,
    educationHistory: [
      {
        id: 'edu-601',
        institution: 'IIIT Bangalore',
        degree: 'iMTech Data Science',
        fieldOfStudy: 'Data Science',
        startYear: 2021,
        endYear: 2026,
        grade: '9.08 CGPA',
        current: true
      }
    ],
    resumeFileName: 'Meera_Sundaram_Analytics.pdf',
    githubUrl: 'https://github.com/meerasundaram-ds',
    profileCompletion: 94,
    skills: [
      { id: 'ssk-601', skillId: 'sk-2', name: 'Python', category: 'Programming Languages', proficiency: 'Advanced', yearsOfExperience: 3, verified: true, verifiedScore: 92, lastAssessedAt: '2026-08-09' },
      { id: 'ssk-602', skillId: 'sk-22', name: 'Data Analysis & PowerBI', category: 'Data Science', proficiency: 'Advanced', yearsOfExperience: 2, verified: true, verifiedScore: 95, lastAssessedAt: '2026-08-15' },
      { id: 'ssk-603', skillId: 'sk-14', name: 'SQL & PostgreSQL', category: 'Database', proficiency: 'Advanced', yearsOfExperience: 2, verified: true, verifiedScore: 91, lastAssessedAt: '2026-08-16' },
      { id: 'ssk-604', skillId: 'sk-20', name: 'Machine Learning & Deep Learning', category: 'AI/ML', proficiency: 'Intermediate', yearsOfExperience: 2, verified: false }
    ],
    certifications: [
      { id: 'cert-601', title: 'Microsoft Certified: Power BI Data Analyst Associate', issuer: 'Microsoft', issueDate: '2025-07-22', credentialUrl: '#' }
    ],
    projects: [
      {
        id: 'proj-601',
        title: 'Retail Demand & Inventory Elasticity Visualizer',
        description: 'Interactive analytics dashboard forecasting supply constraints across 200+ retail SKUs.',
        technologies: ['Python', 'Streamlit', 'PostgreSQL', 'PowerBI', 'Pandas'],
        githubUrl: 'https://github.com/meerasundaram-ds/retail-elasticity'
      }
    ],
    createdAt: '2026-01-28T10:00:00Z',
    updatedAt: '2026-08-22T10:00:00Z'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-3',
    opportunityId: 'opp-1',
    companyId: 'usr-company-1',
    studentId: 'usr-student-4',
    studentName: 'Ananya Verma',
    studentEmail: 'ananya.verma@dtu.ac.in',
    studentCollege: 'Delhi Technological University (DTU)',
    studentBranch: 'Information Technology',
    studentGraduationYear: 2026,
    studentCgpa: 8.92,
    studentSkills: [
      { name: 'Node.js', proficiency: 'Advanced' },
      { name: 'SQL & PostgreSQL', proficiency: 'Advanced' },
      { name: 'Problem Solving & DSA', proficiency: 'Advanced' },
      { name: 'React.js', proficiency: 'Beginner' }
    ],
    opportunityTitle: 'Full Stack Cloud Engineering Intern',
    companyName: 'Tata Consultancy Digital & Cloud Labs',
    appliedAt: '2026-08-19T09:15:00Z',
    status: 'Shortlisted',
    skillMatchScore: 88,
    matchingSkills: ['Node.js (Advanced)', 'SQL & PostgreSQL (Advanced)', 'TypeScript (Intermediate)'],
    missingSkills: [],
    notes: 'Exceptional backend capabilities and 9.4 verification score in SQL. Recommended for shortlisting.'
  },
  {
    id: 'app-4',
    opportunityId: 'opp-5',
    companyId: 'usr-company-1',
    studentId: 'usr-student-4',
    studentName: 'Ananya Verma',
    studentEmail: 'ananya.verma@dtu.ac.in',
    studentCollege: 'Delhi Technological University (DTU)',
    studentBranch: 'Information Technology',
    studentGraduationYear: 2026,
    studentCgpa: 8.92,
    studentSkills: [
      { name: 'Node.js', proficiency: 'Advanced' },
      { name: 'SQL & PostgreSQL', proficiency: 'Advanced' },
      { name: 'Problem Solving & DSA', proficiency: 'Advanced' }
    ],
    opportunityTitle: 'Associate Software Engineer (Campus Placement)',
    companyName: 'Tata Consultancy Digital & Cloud Labs',
    appliedAt: '2026-08-20T16:30:00Z',
    status: 'Selected',
    skillMatchScore: 95,
    matchingSkills: ['Node.js (Advanced)', 'SQL & PostgreSQL (Advanced)', 'Problem Solving & DSA (Advanced)'],
    missingSkills: [],
    notes: 'Offer letter extended for Campus Batch 2026.'
  },
  {
    id: 'app-5',
    opportunityId: 'opp-5',
    companyId: 'usr-company-1',
    studentId: 'usr-student-3',
    studentName: 'Rohan Kulkarni',
    studentEmail: 'rohan.kulkarni@pilani.bits-pilani.ac.in',
    studentCollege: 'BITS Pilani (Goa Campus)',
    studentBranch: 'Computer Science and Engineering',
    studentGraduationYear: 2026,
    studentCgpa: 8.45,
    studentSkills: [
      { name: 'Docker & Kubernetes', proficiency: 'Advanced' },
      { name: 'Cloud Computing (AWS/GCP)', proficiency: 'Advanced' },
      { name: 'Git & Version Control', proficiency: 'Advanced' }
    ],
    opportunityTitle: 'Associate Software Engineer (Campus Placement)',
    companyName: 'Tata Consultancy Digital & Cloud Labs',
    appliedAt: '2026-08-22T10:00:00Z',
    status: 'Applied',
    skillMatchScore: 65,
    matchingSkills: ['Problem Solving & DSA (Intermediate)'],
    missingSkills: ['React.js (Advanced)', 'Node.js (Advanced)'],
    notes: 'Strong in cloud/DevOps, evaluating for infrastructure cloud team opening.'
  },
  {
    id: 'app-6',
    opportunityId: 'opp-1',
    companyId: 'usr-company-1',
    studentId: 'usr-student-5',
    studentName: 'Karthik Raman',
    studentEmail: 'karthik.raman@vit.ac.in',
    studentCollege: 'Vellore Institute of Technology (VIT)',
    studentBranch: 'Computer Science and Engineering',
    studentGraduationYear: 2026,
    studentCgpa: 8.15,
    studentSkills: [
      { name: 'React.js', proficiency: 'Advanced' },
      { name: 'TypeScript', proficiency: 'Intermediate' },
      { name: 'React Native', proficiency: 'Advanced' }
    ],
    opportunityTitle: 'Full Stack Cloud Engineering Intern',
    companyName: 'Tata Consultancy Digital & Cloud Labs',
    appliedAt: '2026-08-23T11:45:00Z',
    status: 'Under Review',
    skillMatchScore: 78,
    matchingSkills: ['React.js (Advanced)', 'TypeScript (Intermediate)'],
    missingSkills: ['Node.js (Intermediate)', 'SQL & PostgreSQL (Intermediate)'],
    notes: 'Solid frontend background, reviewing portfolio.'
  }
];

export const INITIAL_INTERVIEWS: any[] = [];

export const INITIAL_ASSESSMENT_ATTEMPTS: AssessmentAttempt[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-welcome',
    userId: 'usr-student-1',
    title: 'Welcome to the Portal 🎓',
    message: 'Welcome to the SIH Skill & Placement Portal. Complete your profile and verify your skills to get started.',
    type: 'system',
    read: false,
    createdAt: '2026-08-26T10:00:00Z'
  }
];

// Phase 5: Institution Profile
export const DEMO_INSTITUTION: any = {
  id: 'inst-1',
  name: 'National Institute of Technology, New Delhi',
  type: 'NIT',
  affiliation: 'Autonomous Institute of National Importance (Ministry of Education, GoI)',
  accreditation: 'NAAC A++ Grade (CGPA 3.78) | NBA Tier-1 Accredited (All UG Programs) | NIRF Ranked #28 (Engineering)',
  website: 'https://nitdelhi.ac.in',
  email: 'director@nitdelhi.ac.in',
  phone: '+91 11 2778 7500',
  address: 'Plot No. FA7, Zone P1, GT Karnal Road',
  city: 'New Delhi',
  state: 'Delhi (NCR)',
  logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80',
  description: 'National Institute of Technology Delhi is an autonomous premier engineering institution established by the Ministry of Education, Government of India. The Department of Computer Science and Engineering fosters high-caliber industry research, collaborative skill development, and top-tier campus recruitment drives.',
  establishedYear: 2010,
  totalStudentsCount: 1450,
  totalFacultyCount: 94,
  updatedAt: '2026-08-20T10:00:00Z'
};

// Phase 5: Mentors Directory
export const ALL_DEMO_MENTORS: any[] = [
  DEMO_MENTOR,
  {
    id: 'usr-mentor-2',
    email: 'aditya.sharma@archlead.dev',
    fullName: 'Aditya Sharma',
    phone: '+91 98111 22334',
    role: 'mentor',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Principal Cloud Architect specializing in high-throughput PostgreSQL query tuning, Kubernetes microservices, and campus mock interviews.',
    organization: 'AWS Core Services / FinTech Advisor',
    title: 'Principal Distributed Systems Architect',
    expertise: ['PostgreSQL Optimization', 'Microservices', 'System Design', 'Mock Interviews'],
    skills: ['SQL & PostgreSQL', 'Docker & Kubernetes', 'Go (Golang)', 'System Design & Scalability', 'Redis'],
    yearsOfExperience: 14,
    linkedInUrl: 'https://linkedin.com/in/adityasharma-arch',
    maxMentees: 5,
    currentMenteesCount: 2,
    availability: 'Available',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z'
  },
  {
    id: 'usr-mentor-3',
    email: 'neha.deshmukh@aiml-labs.org',
    fullName: 'Dr. Neha Deshmukh',
    phone: '+91 97654 32109',
    role: 'mentor',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'AI Research Scientist & Ex-DeepMind Scholar. Mentoring students in Machine Learning pipelines, PyTorch architectures, and research publications.',
    organization: 'Microsoft Research India',
    title: 'Senior Staff AI Scientist',
    expertise: ['Machine Learning', 'Deep Learning', 'PyTorch', 'Data Science & Analytics'],
    skills: ['Python', 'Machine Learning & Deep Learning', 'Generative AI & LLM Engineering', 'Data Analysis & PowerBI'],
    yearsOfExperience: 9,
    linkedInUrl: 'https://linkedin.com/in/dr-neha-deshmukh',
    maxMentees: 4,
    currentMenteesCount: 3,
    availability: 'Busy',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-08-22T10:00:00Z'
  }
];

// Phase 5: Mentorship Assignments
export const INITIAL_MENTORSHIPS: any[] = [
  {
    id: 'ment-2',
    mentorId: 'usr-mentor-1',
    mentorName: 'Priya Nair',
    mentorEmail: 'priya.nair@techlead.io',
    mentorOrganization: 'Google Cloud / Open Source Contributor',
    studentId: 'usr-student-2',
    studentName: 'Sneha Patel',
    studentEmail: 'sneha.patel@iitd.ac.in',
    studentCollege: 'Indian Institute of Technology, Delhi',
    studentBranch: 'Information Technology',
    assignedBy: 'IIT Delhi Placement Cell',
    assignedAt: '2026-08-05T10:00:00Z',
    status: 'Active',
    notes: 'Advanced PyTorch model deployment and cloud inference scaling.'
  }
];

// Phase 5: Mentor Goals
export const INITIAL_MENTOR_GOALS: any[] = [];

// Phase 5: Mentoring Sessions
export const INITIAL_MENTOR_SESSIONS: any[] = [];

// Phase 5: Faculty Training Programs (Upskilling based on Skill Gaps)
export const INITIAL_TRAINING_PROGRAMS: any[] = [
  {
    id: 'train-1',
    title: 'Enterprise PostgreSQL & Scalable Relational Database Architecture',
    description: 'Hands-on intensive bootcamp addressing the top #1 campus skill gap identified by our industry demand matrix. Covers ACID guarantees, query planning, indexing strategies, and connection pooling.',
    skillId: 'sk-14',
    skillName: 'SQL & PostgreSQL',
    category: 'Database',
    targetProficiency: 'Advanced',
    duration: '4 Weeks (24 Hours)',
    mode: 'Hybrid',
    startDate: '2026-09-10',
    endDate: '2026-10-08',
    registrationDeadline: '2026-09-05',
    instructorName: 'Dr. Rameshwar V. Iyer & Invited DBA Leads',
    capacity: 60,
    enrolledCount: 42,
    institutionId: 'inst-1',
    institutionName: 'National Institute of Technology, New Delhi',
    createdByFacultyId: 'usr-faculty-1',
    syllabus: [
      'Relational Normalization vs Denormalization for OLTP',
      'Advanced Joins, CTEs, and Window Functions',
      'PostgreSQL Index Internals: B-Tree, GIN, GiST, BRIN',
      'Query Plan Optimization with EXPLAIN (ANALYZE, BUFFERS)',
      'Transaction Isolation Levels, MVCC, and Row-level Locking',
      'Database Replication, Connection Pooling with PgBouncer'
    ],
    status: 'Upcoming',
    createdAt: '2026-08-18T10:00:00Z'
  },
  {
    id: 'train-2',
    title: 'Cloud-Native Containerization with Docker & Kubernetes',
    description: 'Practical training on containerizing microservices, building multi-stage Dockerfiles, managing Helm charts, and setting up automated CI/CD pipelines.',
    skillId: 'sk-18',
    skillName: 'Docker & Kubernetes',
    category: 'DevOps',
    targetProficiency: 'Intermediate',
    duration: '3 Weeks (18 Hours)',
    mode: 'Online',
    startDate: '2026-09-15',
    endDate: '2026-10-05',
    registrationDeadline: '2026-09-12',
    instructorName: 'Prof. Anupama Sethi (DevOps Lead)',
    capacity: 50,
    enrolledCount: 38,
    institutionId: 'inst-1',
    institutionName: 'National Institute of Technology, New Delhi',
    createdByFacultyId: 'usr-faculty-1',
    syllabus: [
      'Container primitives: cgroups, namespaces, and union FS',
      'Optimizing Node/Python Docker images with Alpine and Multi-stage builds',
      'Kubernetes Pods, Services, Deployments, and ConfigMaps',
      'Ingress Controllers, Persistent Volumes, and Horizontal Pod Autoscaling',
      'Automated GitHub Actions CI/CD to AWS EKS'
    ],
    status: 'Upcoming',
    createdAt: '2026-08-19T11:00:00Z'
  }
];

// Phase 5: Training Registrations
export const INITIAL_TRAINING_REGISTRATIONS: any[] = [];

// Phase 5: Placement Records
export const INITIAL_PLACEMENTS: any[] = [
  {
    id: 'plc-1',
    studentId: 'usr-student-2',
    studentName: 'Sneha Patel',
    studentEmail: 'sneha.patel@iitd.ac.in',
    studentCollege: 'National Institute of Technology, New Delhi',
    studentBranch: 'Computer Science and Engineering',
    studentGraduationYear: 2026,
    companyId: 'usr-company-1',
    companyName: 'Tata Consultancy Digital & Cloud Labs',
    jobTitle: 'Associate Software Engineer (Cloud AI)',
    packageLpa: 14.5,
    workMode: 'Hybrid',
    placementDate: '2026-08-22',
    status: 'Offer Accepted',
    verifiedByFacultyId: 'usr-faculty-1',
    createdAt: '2026-08-22T15:00:00Z'
  },
  {
    id: 'plc-2',
    studentId: 'usr-student-4',
    studentName: 'Ananya Verma',
    studentEmail: 'ananya.verma@dtu.ac.in',
    studentCollege: 'National Institute of Technology, New Delhi',
    studentBranch: 'Information Technology',
    studentGraduationYear: 2026,
    companyId: 'usr-company-1',
    companyName: 'Tata Consultancy Digital & Cloud Labs',
    jobTitle: 'Backend Platform Engineer',
    packageLpa: 16.0,
    workMode: 'Hybrid',
    placementDate: '2026-08-24',
    status: 'Selected',
    verifiedByFacultyId: 'usr-faculty-1',
    createdAt: '2026-08-24T16:00:00Z'
  }
];
