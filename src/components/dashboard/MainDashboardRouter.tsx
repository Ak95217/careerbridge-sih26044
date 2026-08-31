import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentFoundationView } from './StudentFoundationView';
import { CompanyFoundationView } from './CompanyFoundationView';
import { FacultyFoundationView } from './FacultyFoundationView';
import { MentorFoundationView } from './MentorFoundationView';
import { AdminFoundationView } from './AdminFoundationView';

// Student Sub-Views (Phase 3 & Phase 6 AI)
import { StudentProfileEditor } from '../student/StudentProfileEditor';
import { StudentCertificatesView } from '../student/StudentCertificatesView';
import { SkillMappingView } from '../student/SkillMappingView';
import { SkillGapEngineView } from '../student/SkillGapEngineView';
import { SkillAssessmentView } from '../student/SkillAssessmentView';
import { InternshipDiscoveryView } from '../student/InternshipDiscoveryView';
import { JobDiscoveryView } from '../student/JobDiscoveryView';
import { StudentApplicationsView } from '../student/StudentApplicationsView';
import { StudentLearningView } from '../student/StudentLearningView';
import { StudentMentorConnectView } from '../student/StudentMentorConnectView';
import { AICareerIntelligenceDashboard } from '../ai/AICareerIntelligenceDashboard';
import { AIResumeBuilderView } from '../ai/resume/AIResumeBuilderView';

// Company Sub-Views (Phase 4)
import { CompanyProfileEditor } from '../company/CompanyProfileEditor';
import { CompanyOpportunitiesView } from '../company/CompanyOpportunitiesView';
import { CompanyApplicationsView } from '../company/CompanyApplicationsView';
import { CompanyCandidatesView } from '../company/CompanyCandidatesView';
import { CompanySkillDemandView } from '../company/CompanySkillDemandView';

// Faculty Sub-Views (Phase 5)
import { CollegeProfileEditor } from '../faculty/CollegeProfileEditor';
import { FacultyStudentsView } from '../faculty/FacultyStudentsView';
import { FacultySkillAnalyticsView } from '../faculty/FacultySkillAnalyticsView';
import { FacultyAssessmentManager } from '../faculty/FacultyAssessmentManager';
import { FacultyTrainingView } from '../faculty/FacultyTrainingView';
import { FacultyPlacementsView } from '../faculty/FacultyPlacementsView';
import { FacultyIndustryCollabView } from '../faculty/FacultyIndustryCollabView';

// Mentor Sub-Views (Phase 5)
import { MentorProfileEditor } from '../mentor/MentorProfileEditor';
import { MentorStudentsView } from '../mentor/MentorStudentsView';
import { MentorGoalsView } from '../mentor/MentorGoalsView';
import { MentorSessionsView } from '../mentor/MentorSessionsView';
import { MentorProgressView } from '../mentor/MentorProgressView';

// Admin Sub-Views (Phase 7 Platform-Wide Intelligence)
import { AdminAnalyticsView } from '../admin/AdminAnalyticsView';
import { AdminUsersView } from '../admin/AdminUsersView';
import { AdminStudentsView } from '../admin/AdminStudentsView';
import { AdminCompaniesView } from '../admin/AdminCompaniesView';
import { AdminCollegesView } from '../admin/AdminCollegesView';
import { AdminMentorsView } from '../admin/AdminMentorsView';
import { AdminSkillsView } from '../admin/AdminSkillsView';
import { AdminCertificatesView } from '../admin/AdminCertificatesView';
import { AdminOpportunitiesView } from '../admin/AdminOpportunitiesView';
import { AdminSettingsView } from '../admin/AdminSettingsView';

// Common Views
import { NotificationsView } from '../common/NotificationsView';
import { Opportunity } from '../../types';

import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Construction } from 'lucide-react';

interface MainDashboardRouterProps {
  activeTab: string;
  onNavigateTab: (tabId: string) => void;
}

export const MainDashboardRouter: React.FC<MainDashboardRouterProps> = ({
  activeTab,
  onNavigateTab
}) => {
  const { role } = useAuth();
  const [selectedOpportunityForMatching, setSelectedOpportunityForMatching] = useState<Opportunity | null>(null);

  if (!role) return null;

  // Student Workspace Routing
  if (role === 'student') {
    switch (activeTab) {
      case 'dashboard':
        return <StudentFoundationView onNavigateTab={onNavigateTab} />;
      case 'ai-career':
      case 'ai-intelligence':
      case 'ai':
      case 'career-intelligence':
        return <AICareerIntelligenceDashboard onNavigateTab={onNavigateTab} />;
      case 'resume-builder':
      case 'ai-resume-builder':
      case 'resume':
        return <AIResumeBuilderView onNavigateTab={onNavigateTab} />;
      case 'profile':
      case 'edit-profile':
      case 'my-profile':
        return <StudentProfileEditor onNavigateTab={onNavigateTab} />;
      case 'certificates':
      case 'certificate':
      case 'certification':
      case 'credentials':
        return <StudentCertificatesView onNavigateTab={onNavigateTab} />;
      case 'skills':
        return <SkillMappingView onNavigateTab={onNavigateTab} />;
      case 'assessments':
      case 'assessment':
        return <SkillAssessmentView onNavigateTab={onNavigateTab} />;
      case 'skill-gap':
      case 'gap-engine':
      case 'skills-gap':
        return <SkillGapEngineView onNavigateTab={onNavigateTab} />;
      case 'internships':
        return <InternshipDiscoveryView onNavigateTab={onNavigateTab} />;
      case 'jobs':
        return <JobDiscoveryView onNavigateTab={onNavigateTab} />;
      case 'applications':
        return <StudentApplicationsView onNavigateTab={onNavigateTab} />;
      case 'learning':
        return <StudentLearningView onNavigateTab={onNavigateTab} />;
      case 'mentor':
        return <StudentMentorConnectView onNavigateTab={onNavigateTab} />;
      case 'settings':
        return <StudentProfileEditor onNavigateTab={onNavigateTab} />;
      case 'notifications':
        return <NotificationsView onNavigateTab={onNavigateTab} />;
      default:
        return <StudentFoundationView onNavigateTab={onNavigateTab} />;
    }
  }

  // Company Workspace Routing (Phase 4)
  if (role === 'company') {
    switch (activeTab) {
      case 'dashboard':
        return (
          <CompanyFoundationView 
            onNavigateTab={onNavigateTab} 
            onSelectOpportunityForMatching={(opp) => {
              setSelectedOpportunityForMatching(opp);
              onNavigateTab('candidates');
            }}
          />
        );
      case 'profile':
        return <CompanyProfileEditor onNavigateTab={onNavigateTab} />;
      case 'internships':
        return (
          <CompanyOpportunitiesView 
            initialType="Internship" 
            onNavigateTab={onNavigateTab}
            onSelectOpportunityForMatching={(opp) => {
              setSelectedOpportunityForMatching(opp);
              onNavigateTab('candidates');
            }}
          />
        );
      case 'jobs':
        return (
          <CompanyOpportunitiesView 
            initialType="Job" 
            onNavigateTab={onNavigateTab}
            onSelectOpportunityForMatching={(opp) => {
              setSelectedOpportunityForMatching(opp);
              onNavigateTab('candidates');
            }}
          />
        );
      case 'applications':
        return <CompanyApplicationsView onNavigateTab={onNavigateTab} />;
      case 'candidates':
        return (
          <CompanyCandidatesView 
            selectedOpportunityForMatching={selectedOpportunityForMatching} 
            onNavigateTab={onNavigateTab} 
          />
        );
      case 'skill-demand':
        return <CompanySkillDemandView onNavigateTab={onNavigateTab} />;
      case 'notifications':
        return <NotificationsView onNavigateTab={onNavigateTab} />;
      default:
        return (
          <CompanyFoundationView 
            onNavigateTab={onNavigateTab} 
            onSelectOpportunityForMatching={(opp) => {
              setSelectedOpportunityForMatching(opp);
              onNavigateTab('candidates');
            }}
          />
        );
    }
  }

  // Faculty Workspace Routing (Phase 5)
  if (role === 'faculty') {
    switch (activeTab) {
      case 'dashboard':
        return <FacultyFoundationView onNavigateTab={onNavigateTab} />;
      case 'college-profile':
      case 'profile':
        return <CollegeProfileEditor onNavigateTab={onNavigateTab} />;
      case 'students':
        return <FacultyStudentsView onNavigateTab={onNavigateTab} />;
      case 'skill-analytics':
        return <FacultySkillAnalyticsView onNavigateTab={onNavigateTab} />;
      case 'assessments':
        return <FacultyAssessmentManager onNavigateTab={onNavigateTab} />;
      case 'training':
        return <FacultyTrainingView onNavigateTab={onNavigateTab} />;
      case 'placements':
        return <FacultyPlacementsView onNavigateTab={onNavigateTab} />;
      case 'industry-collab':
        return <FacultyIndustryCollabView onNavigateTab={onNavigateTab} />;
      case 'notifications':
        return <NotificationsView onNavigateTab={onNavigateTab} />;
      default:
        return <FacultyFoundationView onNavigateTab={onNavigateTab} />;
    }
  }

  // Mentor Workspace Routing (Phase 5)
  if (role === 'mentor') {
    switch (activeTab) {
      case 'dashboard':
        return <MentorFoundationView onNavigateTab={onNavigateTab} />;
      case 'profile':
        return <MentorProfileEditor onNavigateTab={onNavigateTab} />;
      case 'students':
        return <MentorStudentsView onNavigateTab={onNavigateTab} />;
      case 'goals':
        return <MentorGoalsView onNavigateTab={onNavigateTab} />;
      case 'sessions':
        return <MentorSessionsView onNavigateTab={onNavigateTab} />;
      case 'progress':
        return <MentorProgressView onNavigateTab={onNavigateTab} />;
      case 'notifications':
        return <NotificationsView onNavigateTab={onNavigateTab} />;
      default:
        return <MentorFoundationView onNavigateTab={onNavigateTab} />;
    }
  }

  // Admin Workspace Routing (Phase 7 Platform-Wide Intelligence)
  if (role === 'admin') {
    switch (activeTab) {
      case 'dashboard':
        return <AdminFoundationView onNavigateTab={onNavigateTab} />;
      case 'analytics':
        return <AdminAnalyticsView onNavigateTab={onNavigateTab} />;
      case 'users':
        return <AdminUsersView onNavigateTab={onNavigateTab} />;
      case 'students':
        return <AdminStudentsView />;
      case 'companies':
        return <AdminCompaniesView />;
      case 'colleges':
        return <AdminCollegesView />;
      case 'mentors':
        return <AdminMentorsView />;
      case 'skills':
        return <AdminSkillsView />;
      case 'certificates':
      case 'verification':
      case 'credential-verification':
        return <AdminCertificatesView onNavigateTab={onNavigateTab} />;
      case 'internships':
      case 'jobs':
        return <AdminOpportunitiesView />;
      case 'settings':
        return <AdminSettingsView />;
      case 'notifications':
        return <NotificationsView onNavigateTab={onNavigateTab} />;
      default:
        return <AdminFoundationView onNavigateTab={onNavigateTab} />;
    }
  }

  // Common notifications route for any role
  if (activeTab === 'notifications') {
    return <NotificationsView onNavigateTab={onNavigateTab} />;
  }

  // Fallback for Phase 5, 6 module stubs
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <p className="text-xs text-slate-500">
            {role.toUpperCase()} Workspace • SIH26044 Module
          </p>
        </div>
        <Badge variant="primary" size="md">
          {role} Workspace
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Construction className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 capitalize">
              {activeTab.replace('-', ' ')} Module Foundation Ready
            </h3>
          </div>
          <Badge variant="success">Phase 2 Verified</Badge>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Authentication, user profile schemas, navigation bindings, and RLS policies for <strong className="text-slate-900 capitalize">{activeTab}</strong> are registered and ready for Phase implementation.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
              >
                ← Return to {role.toUpperCase()} Dashboard
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
