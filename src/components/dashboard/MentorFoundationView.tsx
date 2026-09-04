import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { MentorProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Users, Target, Calendar, CheckCircle2, Plus, ArrowUpRight, UserCircle } from 'lucide-react';

interface MentorFoundationViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const MentorFoundationView: React.FC<MentorFoundationViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const mentor = user as MentorProfile;

  const assignments = useMemo(() => StorageService.getMentorshipAssignments(), []);
  const students = useMemo(() => StorageService.getStudents(), []);
  const goals = useMemo(() => StorageService.getMentorGoals(), []);
  const sessions = useMemo(() => StorageService.getMentoringSessions(), []);

  if (!mentor) return null;

  const menteeStudents = students.slice(0, 3);
  const completedGoalsCount = goals.filter(g => g.status === 'Completed').length;
  const goalRate = goals.length > 0 ? Math.round((completedGoalsCount / goals.length) * 100) : 85;
  const scheduledSessions = sessions.filter(s => s.status === 'Scheduled');

  return (
    <div className="space-y-6">
      {/* Mentor Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={mentor.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
            alt={mentor.fullName}
            className="w-16 h-16 rounded-xl border border-slate-200 object-cover shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{mentor.fullName}</h2>
              <Badge variant="warning">Industry Mentor</Badge>
              <Badge variant="success">{mentor.availability}</Badge>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {mentor.title} • {mentor.organization}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {mentor.yearsOfExperience}+ Years Experience • Mentees: {menteeStudents.length} / {mentor.maxMentees || 6}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            leftIcon={<UserCircle className="w-4 h-4" />}
            onClick={() => onNavigateTab('profile')}
          >
            Edit Profile
          </Button>
          <Button 
            size="sm" 
            variant="primary" 
            leftIcon={<Calendar className="w-4 h-4" />}
            onClick={() => onNavigateTab('sessions')}
          >
            Schedule Session
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => onNavigateTab('goals')}
          >
            Assign Goal
          </Button>
        </div>
      </div>

      {/* Mentor Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Active Mentees</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{menteeStudents.length}</h3>
                <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">{Math.max(0, (mentor.maxMentees || 6) - menteeStudents.length)} Slots Open</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Sessions Total</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{sessions.length}</h3>
                <p className="text-[11px] text-indigo-600 mt-0.5 font-medium">{scheduledSessions.length} Upcoming</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Goal Completion Rate</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{goalRate}%</h3>
                <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">{completedGoalsCount} of {goals.length} Goals Met</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Target className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Mentee Placement Rate</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">100%</h3>
                <p className="text-[11px] text-purple-600 mt-0.5 font-medium">All past mentees placed</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Mentees Overview */}
      <Card>
        <CardHeader
          title="Current Assigned Mentees"
          subtitle="Real-time learning progress and career tracking"
          action={
            <Button size="sm" variant="outline" onClick={() => onNavigateTab('students')}>
              View Mentees Directory
            </Button>
          }
        />
        <CardContent className="p-5">
          <div className="space-y-3">
            {menteeStudents.map(st => {
              const stGoals = goals.filter(g => g.studentId === st.id);
              const nextSession = sessions.find(s => s.studentId === st.id && s.status === 'Scheduled');

              return (
                <div key={st.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={st.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={st.fullName}
                      className="w-10 h-10 rounded-lg object-cover border"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{st.fullName}</h4>
                      <p className="text-[11px] text-slate-500">{st.collegeName} • {st.branch} (CGPA: {st.cgpa})</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-semibold text-slate-700">
                        {stGoals.length > 0 ? `Goal: ${stGoals[0].title}` : 'Roadmap Active'}
                      </span>
                      <p className="text-[10px] text-emerald-600 font-medium">
                        {nextSession ? `Session: ${nextSession.scheduledDate} ${nextSession.startTime}` : '1-on-1 Ready'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 px-2"
                      onClick={() => onNavigateTab('students')}
                    >
                      Inspect
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
