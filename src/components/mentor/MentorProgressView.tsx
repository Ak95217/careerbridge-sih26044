import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { MentorProfile, StudentProfile, MentorGoal, MentoringSession, Application } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { 
  TrendingUp, 
  Target, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Briefcase, 
  Users, 
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface MentorProgressViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const MentorProgressView: React.FC<MentorProgressViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const mentor = user as MentorProfile;

  const [students] = useState<StudentProfile[]>(() => StorageService.getStudents());
  const [goals] = useState<MentorGoal[]>(() => StorageService.getMentorGoals());
  const [sessions] = useState<MentoringSession[]>(() => StorageService.getMentoringSessions());
  const [applications] = useState<Application[]>(() => StorageService.getApplications());
  const [attempts] = useState(() => StorageService.getAssessmentAttempts());

  const actionableInsights = useMemo(() => StorageService.getMentorActionableInsights(mentor?.id), [mentor?.id]);

  // Mentees
  const mentees = students.slice(0, 4); // active mentee cohort

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const goalRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 80;

  return (
    <div id="mentor-progress-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Mentee Technical Growth & Readiness Analytics</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time competency progression, verified assessment scores, and career placement pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateTab && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigateTab('goals')}
              leftIcon={<Target className="w-4 h-4 text-indigo-600" />}
            >
              Goal Management
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Active Mentees</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-900">{mentees.length}</h3>
              <span className="text-xs text-emerald-600 font-semibold">100% Engaged</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">All with assigned roadmaps</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Goal Completion Rate</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-900">{goalRate}%</h3>
              <span className="text-xs text-indigo-600 font-semibold">{completedGoals}/{totalGoals} Achieved</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${goalRate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Verified Badges Earned</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-900">{attempts.filter(a => a.passed).length}</h3>
              <span className="text-xs text-emerald-600 font-semibold">Tests Cleared</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">PostgreSQL, Docker, React, Node</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Recruitment Shortlists</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-900">
                {applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected').length}
              </h3>
              <span className="text-xs text-indigo-600 font-semibold">In Hiring Pipeline</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Tier-1 Corporate Openings</p>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Mentor Insights (Derived directly from student skill supply vs goals) */}
      <Card className="border-indigo-200 bg-indigo-50/20">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Actionable Mentor Advisory Signals</h3>
            </div>
            <Badge variant="primary">AI & Heuristic Driven</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-3">
          {actionableInsights.map((ins) => (
            <div
              key={ins.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{ins.title}</span>
                  <Badge variant={ins.priority === 'high' ? 'warning' : 'neutral'} size="sm">
                    {ins.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {ins.description}
                </p>
              </div>

              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab(ins.type === 'interview_prep' ? 'sessions' : 'goals')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>{ins.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Individual Mentee Progress Deep Dives */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Mentee Cohort Readiness Roster</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mentees.map(student => {
            const studentGoals = goals.filter(g => g.studentId === student.id);
            const studentDoneGoals = studentGoals.filter(g => g.status === 'Completed').length;
            const studentAttempts = attempts.filter(a => a.studentId === student.id);
            const studentApps = applications.filter(a => a.studentId === student.id);
            const goalPct = studentGoals.length > 0 ? Math.round((studentDoneGoals / studentGoals.length) * 100) : 75;

            return (
              <Card key={student.id} className="hover:border-indigo-200 transition-all">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={student.fullName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{student.fullName}</h4>
                        <p className="text-xs text-slate-500 font-medium">{student.branch}</p>
                        <p className="text-[10px] text-slate-400">{student.collegeName} • CGPA {student.cgpa}</p>
                      </div>
                    </div>

                    <Badge variant={goalPct >= 80 ? 'success' : 'primary'} className="text-[10px]">
                      {goalPct}% Goal Readiness
                    </Badge>
                  </div>

                  {/* Goal Milestones Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Milestones Completed</span>
                      <span className="font-bold text-slate-900">{studentDoneGoals} of {studentGoals.length}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${goalPct}%` }} />
                    </div>
                  </div>

                  {/* Verified Skills Pill Grid */}
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Verified Technical Badges
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {student.skills.map(sk => (
                        <span
                          key={sk.id}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
                            sk.verified
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {sk.verified && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                          {sk.name} ({sk.proficiency})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Application Pipeline */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      <b>{studentApps.length}</b> Active Applications • <b className="text-indigo-600">{studentAttempts.length}</b> Assessments Taken
                    </span>
                    {onNavigateTab && (
                      <button
                        type="button"
                        onClick={() => onNavigateTab('sessions')}
                        className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5"
                      >
                        Schedule 1-on-1 <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
