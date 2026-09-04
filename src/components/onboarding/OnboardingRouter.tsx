import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentOnboardingView } from './StudentOnboardingView';
import { CompanyOnboardingView } from './CompanyOnboardingView';
import { FacultyOnboardingView } from './FacultyOnboardingView';
import { MentorOnboardingView } from './MentorOnboardingView';
import { AdminOnboardingView } from './AdminOnboardingView';

interface OnboardingRouterProps {
  onComplete: () => void;
}

export const OnboardingRouter: React.FC<OnboardingRouterProps> = ({ onComplete }) => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'student':
      return <StudentOnboardingView onComplete={onComplete} />;
    case 'company':
      return <CompanyOnboardingView onComplete={onComplete} />;
    case 'faculty':
      return <FacultyOnboardingView onComplete={onComplete} />;
    case 'mentor':
      return <MentorOnboardingView onComplete={onComplete} />;
    case 'admin':
      return <AdminOnboardingView onComplete={onComplete} />;
    default:
      return <StudentOnboardingView onComplete={onComplete} />;
  }
};
