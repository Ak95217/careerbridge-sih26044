import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { FacultyProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  GraduationCap, 
  BarChart3, 
  BookOpen, 
  CheckSquare, 
  Target, 
  Building2, 
  Award, 
  Users, 
  AlertTriangle,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface FacultyFoundationViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const FacultyFoundationView: React.FC<FacultyFoundationViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const faculty = user as FacultyProfile;

  const students = useMemo(() => StorageService.getStudents(), []);
  const placements = useMemo(() => StorageService.getPlacements(), []);
  const trainingPrograms = useMemo(() => StorageService.getTrainingPrograms(), []);
  const opportunities = useMemo(() => StorageService.getOpportunities(), []);
  const analytics = useMemo(() => StorageService.getInstitutionalSkillAnalytics(faculty?.institutionName), [faculty?.institutionName]);
  const placementStats = useMemo(() => StorageService.calculatePlacementStats(faculty?.institutionName), [faculty?.institutionName]);

  if (!faculty) return null;

  return (
    <div className="space-y-6">
      {/* Faculty Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={faculty.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'}
            alt={faculty.fullName}
            className="w-16 h-16 rounded-xl border border-slate-200 object-cover shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{faculty.fullName}</h2>
              <Badge variant="success">Faculty / Coordinator</Badge>
              <Badge variant="default">{faculty.employeeId}</Badge>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {faculty.designation} • {faculty.department}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{faculty.institutionName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            leftIcon={<Building2 className="w-4 h-4" />}
            onClick={() => onNavigateTab('college-profile')}
          >
            College Profile
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            leftIcon={<BookOpen className="w-4 h-4" />}
            onClick={() => onNavigateTab('training')}
          >
            Upskilling Programs
          </Button>
          <Button 
            size="sm" 
            variant="primary" 
            leftIcon={<CheckSquare className="w-4 h-4" />}
            onClick={() => onNavigateTab('assessments')}
          >
            Create Assessment
          </Button>
        </div>
      </div>

      {/* Institutional Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Enrolled Students</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{students.length}</h3>
                <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">96% Profiles Verified</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Industry Partner Drives</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{opportunities.length}</h3>
                <p className="text-[11px] text-indigo-600 mt-0.5 font-medium">Live Recruiter Openings</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Campus Placement Rate</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{placementStats.placementRate}%</h3>
                <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">Avg: ₹{placementStats.averagePackage} LPA</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Target className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Active Bootcamps</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{trainingPrograms.length}</h3>
                <p className="text-[11px] text-amber-600 mt-0.5 font-medium">Bridging Skill Gaps</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Institutional Skill Gap Highlight */}
      <Card>
        <CardHeader
          title="Campus Skill Gap Matrix vs Recruiter Demand"
          subtitle={`Deterministic analysis for ${faculty.department} student cohort`}
          action={
            <Button size="sm" variant="outline" onClick={() => onNavigateTab('skill-analytics')}>
              Full Gap Breakdown
            </Button>
          }
        />
        <CardContent className="p-5 space-y-4">
          {analytics.topGaps.slice(0, 3).map(gap => (
            <div key={gap.skillId} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  {gap.skillName} ({gap.category})
                </span>
                <span className="text-amber-700 font-bold">
                  Recruiter Demand: {gap.demandScore}/100 • Student Supply: {gap.studentPercentage}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                <div className="bg-indigo-600 h-full rounded-l-full" style={{ width: `${gap.studentPercentage}%` }} />
                <div className="bg-amber-400 h-full opacity-60" style={{ width: `${gap.gapDeficit}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
