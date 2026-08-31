import { 
  LayoutDashboard, 
  UserCircle, 
  Award, 
  CheckSquare, 
  TrendingUp, 
  Briefcase, 
  FileText, 
  BookOpen, 
  Users, 
  Bell, 
  Building2, 
  UserCheck, 
  BarChart3, 
  Target, 
  Calendar, 
  Sliders, 
  ShieldCheck, 
  GraduationCap, 
  Sparkles,
  LucideIcon 
} from 'lucide-react';
import { UserRole } from '../../types';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export const ROLE_NAVIGATION: Record<UserRole, NavItem[]> = {
  student: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-career', label: 'AI Intelligence', icon: Sparkles, badge: 'AI' },
    { id: 'resume-builder', label: 'AI Resume Builder', icon: FileText, badge: 'AI' },
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'assessments', label: 'Skill Assessment', icon: CheckSquare },
    { id: 'skill-gap', label: 'Skill Gap', icon: TrendingUp },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'mentor', label: 'Mentor', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ],
  company: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Company Profile', icon: Building2 },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'candidates', label: 'Candidates', icon: UserCheck },
    { id: 'skill-demand', label: 'Skill Demand', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ],
  faculty: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'college-profile', label: 'College Profile', icon: Building2 },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'skill-analytics', label: 'Skill Analytics', icon: BarChart3 },
    { id: 'assessments', label: 'Assessments', icon: CheckSquare },
    { id: 'training', label: 'Training', icon: BookOpen },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'placements', label: 'Placements', icon: Target },
    { id: 'industry-collab', label: 'Industry Collaboration', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ],
  mentor: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Mentor Profile', icon: UserCircle },
    { id: 'students', label: 'Mentees', icon: Users },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'colleges', label: 'Colleges', icon: ShieldCheck },
    { id: 'mentors', label: 'Mentors', icon: UserCheck },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'certificates', label: 'Certificates', icon: ShieldCheck },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Sliders }
  ]
};
