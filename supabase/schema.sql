-- ==============================================================================
-- SIH26044 Portal for Academia-Industry Collaboration
-- Supabase / PostgreSQL Schema Definition with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Common base user identity linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'company', 'faculty', 'mentor', 'admin')),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. STUDENT PROFILES
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  college_name TEXT NOT NULL,
  degree TEXT NOT NULL,
  branch TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  current_semester TEXT,
  cgpa NUMERIC(4, 2) NOT NULL DEFAULT 0.0,
  resume_url TEXT,
  resume_file_name TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  profile_completion INTEGER NOT NULL DEFAULT 40,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. COMPANY PROFILES
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  website TEXT,
  location TEXT NOT NULL,
  company_size TEXT NOT NULL DEFAULT '11-50',
  description TEXT,
  logo_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. FACULTY / COLLEGE PROFILES
CREATE TABLE IF NOT EXISTS public.faculty (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  department TEXT NOT NULL,
  designation TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  specialization TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. MENTOR PROFILES
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization TEXT NOT NULL,
  title TEXT NOT NULL,
  expertise TEXT[] DEFAULT '{}',
  years_of_experience INTEGER NOT NULL DEFAULT 1,
  linkedin_url TEXT,
  max_mentees INTEGER NOT NULL DEFAULT 5,
  current_mentees_count INTEGER NOT NULL DEFAULT 0,
  availability TEXT NOT NULL DEFAULT 'Available' CHECK (availability IN ('Available', 'Busy', 'Unavailable')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. GLOBAL SKILL TAXONOMY
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Technical', 'Programming Languages', 'Frameworks', 'Tools', 'Domain Skills', 'Soft Skills', 'Certifications')),
  description TEXT,
  industry_demand_weight INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. STUDENT SKILLS (M:N with proficiency and assessment verification)
CREATE TABLE IF NOT EXISTS public.student_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  proficiency TEXT NOT NULL CHECK (proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_score NUMERIC(5, 2),
  last_assessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, skill_id)
);

-- 8. STUDENT CERTIFICATIONS & PROJECTS
CREATE TABLE IF NOT EXISTS public.student_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_url TEXT,
  credential_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. OPPORTUNITIES (Internships & Placements posted by verified Companies)
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Internship', 'Job')),
  description TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  eligibility TEXT NOT NULL,
  location TEXT NOT NULL,
  work_mode TEXT NOT NULL CHECK (work_mode IN ('Remote', 'On-site', 'Hybrid')),
  duration TEXT,
  stipend_or_salary TEXT NOT NULL,
  min_cgpa NUMERIC(4, 2) DEFAULT 0.0,
  target_branches TEXT[] DEFAULT '{}',
  graduation_years INTEGER[] DEFAULT '{}',
  application_deadline TIMESTAMPTZ NOT NULL,
  openings INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed', 'Draft')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. OPPORTUNITY SKILLS REQUIRED
CREATE TABLE IF NOT EXISTS public.opportunity_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  proficiency TEXT NOT NULL CHECK (proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  mandatory BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(opportunity_id, skill_id)
);

-- 11. APPLICATIONS (Student applies for Opportunity)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected')),
  skill_match_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
  matching_skills TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  resume_url TEXT,
  notes TEXT,
  interview_date TIMESTAMPTZ,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(opportunity_id, student_id)
);

-- 12. SKILL ASSESSMENTS & QUESTIONS
CREATE TABLE IF NOT EXISTS public.skill_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 15,
  passing_score_percentage INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES public.skill_assessments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_index INTEGER NOT NULL,
  explanation TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced'))
);

CREATE TABLE IF NOT EXISTS public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES public.skill_assessments(id) ON DELETE CASCADE,
  score_percentage NUMERIC(5, 2) NOT NULL,
  passed BOOLEAN NOT NULL,
  evaluated_proficiency TEXT NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. MENTORSHIPS & SESSIONS
CREATE TABLE IF NOT EXISTS public.mentorships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Pending', 'Completed')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(mentor_id, student_id)
);

-- 14. IN-APP NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('application', 'recommendation', 'interview', 'mentor', 'announcement', 'system')),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_students_college ON public.students(college_name);
CREATE INDEX IF NOT EXISTS idx_student_skills_student ON public.student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_company ON public.opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity ON public.applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_student ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read public profile summaries, but only update their own
CREATE POLICY "Profiles viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Student data: Read-write by student owner; Read by authorized faculty and matching company
CREATE POLICY "Students manage own record" ON public.students
  FOR ALL TO authenticated USING (auth.uid() = id);

CREATE POLICY "Faculty can view students from same institution" ON public.students
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.faculty f 
      WHERE f.id = auth.uid() AND f.institution_name = public.students.college_name
    ) OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Company: Managed by company account; Opportunities publicly readable by authenticated students/faculty
CREATE POLICY "Companies manage own profile" ON public.companies
  FOR ALL TO authenticated USING (auth.uid() = id);

CREATE POLICY "Opportunities viewable by all authenticated users" ON public.opportunities
  FOR SELECT TO authenticated USING (status = 'Open' OR auth.uid() = company_id);

CREATE POLICY "Companies manage own opportunities" ON public.opportunities
  FOR ALL TO authenticated USING (auth.uid() = company_id);

-- Applications: Student sees own; Company sees applications for its opportunities; Faculty sees student apps
CREATE POLICY "Students manage own applications" ON public.applications
  FOR ALL TO authenticated USING (auth.uid() = student_id);

CREATE POLICY "Companies view applications to their opportunities" ON public.applications
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      WHERE o.id = public.applications.opportunity_id AND o.company_id = auth.uid()
    )
  );

CREATE POLICY "Companies update applications to their opportunities" ON public.applications
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      WHERE o.id = public.applications.opportunity_id AND o.company_id = auth.uid()
    )
  );

-- Notifications: Only receiver can read/update
CREATE POLICY "Users see own notifications" ON public.notifications
  FOR ALL TO authenticated USING (auth.uid() = user_id);
