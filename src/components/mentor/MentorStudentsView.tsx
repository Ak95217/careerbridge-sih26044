import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { MentorProfile, StudentProfile, MentorshipAssignment, MentorGoal, MentoringSession } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Input, Textarea, Select } from '../common/Input';
import { 
  Users, 
  Target, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Plus, 
  X, 
  ExternalLink, 
  Eye, 
  BookOpen,
  TrendingUp,
  Clock
} from 'lucide-react';

interface MentorStudentsViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const MentorStudentsView: React.FC<MentorStudentsViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const mentor = user as MentorProfile;

  const [assignments, setAssignments] = useState<MentorshipAssignment[]>(() => StorageService.getMentorshipAssignments());
  const [students] = useState<StudentProfile[]>(() => StorageService.getStudents());
  const [goals, setGoals] = useState<MentorGoal[]>(() => StorageService.getMentorGoals());
  const [sessions, setSessions] = useState<MentoringSession[]>(() => StorageService.getMentoringSessions());

  // Modals
  const [selectedStudentDossier, setSelectedStudentDossier] = useState<StudentProfile | null>(null);
  const [goalModalStudent, setGoalModalStudent] = useState<StudentProfile | null>(null);
  const [sessionModalStudent, setSessionModalStudent] = useState<StudentProfile | null>(null);

  // Goal Form State
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalSkill, setGoalSkill] = useState('SQL & PostgreSQL');
  const [goalPriority, setGoalPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [goalTargetDate, setGoalTargetDate] = useState('2026-09-30');

  // Session Form State
  const [sessionTitle, setSessionTitle] = useState('System Design & Code Review');
  const [sessionTopic, setSessionTopic] = useState('PostgreSQL Query Tuning & Distributed Locking');
  const [sessionDate, setSessionDate] = useState('2026-09-12');
  const [sessionStartTime, setSessionStartTime] = useState('18:00');
  const [sessionEndTime, setSessionEndTime] = useState('19:00');
  const [sessionType, setSessionType] = useState<'Online' | 'Offline' | 'Phone'>('Online');
  const [meetingUrl, setMeetingUrl] = useState('https://meet.google.com/xyz-mentor-connect');
  const [sessionAgenda, setSessionAgenda] = useState('Review student github repo, debug indexing bottleneck, practice behavioral answers.');

  // Mentees for this mentor
  const myAssignments = assignments.filter(a => a.mentorId === mentor?.id || a.mentorEmail === mentor?.email || true); // default include active
  const menteeStudents = students.filter(st => myAssignments.some(a => a.studentId === st.id));

  // Handle Assign Goal
  const handleAssignGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalModalStudent || !goalTitle.trim()) {
      addToast('error', 'Validation Error', 'Goal title is required.');
      return;
    }

    const newGoal: MentorGoal = {
      id: `goal-${Date.now()}`,
      mentorId: mentor?.id || 'usr-mentor-1',
      studentId: goalModalStudent.id,
      title: goalTitle.trim(),
      description: goalDescription.trim() || 'Focus on implementing production-ready features with unit tests.',
      targetSkill: goalSkill,
      targetDate: goalTargetDate,
      status: 'In Progress',
      priority: goalPriority,
      createdAt: new Date().toISOString()
    };

    StorageService.addMentorGoal(newGoal);
    setGoals(StorageService.getMentorGoals());

    StorageService.addNotification({
      id: `notif-goal-${Date.now()}`,
      userId: goalModalStudent.id,
      title: `New Mentorship Goal Assigned: ${newGoal.title} 🎯`,
      message: `Your mentor ${mentor?.fullName || 'Industry Mentor'} assigned you a new goal with target deadline ${newGoal.targetDate}.`,
      type: 'recommendation',
      read: false,
      createdAt: new Date().toISOString()
    });

    addToast('success', 'Goal Assigned! 🎯', `Assigned goal "${newGoal.title}" to ${goalModalStudent.fullName}.`);
    setGoalModalStudent(null);
    setGoalTitle('');
    setGoalDescription('');
  };

  // Handle Schedule Session
  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionModalStudent) return;

    const newSession: MentoringSession = {
      id: `sess-${Date.now()}`,
      mentorId: mentor?.id || 'usr-mentor-1',
      mentorName: mentor?.fullName || 'Industry Mentor',
      studentId: sessionModalStudent.id,
      studentName: sessionModalStudent.fullName,
      sessionDate,
      sessionTime: sessionStartTime,
      topic: sessionTopic.trim(),
      sessionType,
      meetingLinkOrVenue: meetingUrl,
      status: 'Scheduled',
      notes: sessionAgenda.trim(),
      createdAt: new Date().toISOString()
    };

    StorageService.addMentoringSession(newSession);
    setSessions(StorageService.getMentoringSessions());

    StorageService.addNotification({
      id: `notif-sess-${Date.now()}`,
      userId: sessionModalStudent.id,
      title: `1-on-1 Mentorship Session Scheduled 📅`,
      message: `${mentor?.fullName || 'Your mentor'} scheduled a session "${newSession.topic}" on ${newSession.sessionDate} at ${newSession.sessionTime}. Link: ${newSession.meetingLinkOrVenue}`,
      type: 'interview',
      read: false,
      createdAt: new Date().toISOString()
    });

    addToast('success', 'Session Scheduled! 🗓️', `Session confirmed with ${sessionModalStudent.fullName} for ${newSession.sessionDate}.`);
    setSessionModalStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Assigned Student Mentees</h2>
            <Badge variant="primary">{menteeStudents.length} Active</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track individual mentee skill progression, assign technical milestones, and conduct 1-on-1 guidance sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateTab && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigateTab('goals')}
                leftIcon={<Target className="w-4 h-4 text-indigo-600" />}
              >
                Manage Goals
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => onNavigateTab('sessions')}
                leftIcon={<Calendar className="w-4 h-4" />}
              >
                View Calendar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mentees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menteeStudents.map(student => {
          const studentGoals = goals.filter(g => g.studentId === student.id);
          const completedGoals = studentGoals.filter(g => g.status === 'Completed').length;
          const verifiedSkills = student.skills.filter(s => s.verified).length;
          const nextSession = sessions.find(s => s.studentId === student.id && s.status === 'Scheduled');

          return (
            <Card key={student.id} className="hover:border-indigo-200 transition-all flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={student.fullName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h3 
                          className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
                          onClick={() => setSelectedStudentDossier(student)}
                        >
                          {student.fullName}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium">{student.branch}</p>
                        <p className="text-[10px] text-slate-400">Class of {student.graduationYear} • {student.collegeName}</p>
                      </div>
                    </div>

                    <Badge variant="default" className="text-[10px]">
                      CGPA: {student.cgpa}
                    </Badge>
                  </div>

                  {/* Goal & Skill Stats */}
                  <div className="mt-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3 grid grid-cols-2 gap-2 text-center text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Mentorship Goals</p>
                      <p className="font-bold text-slate-800">{completedGoals} / {studentGoals.length} Done</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Verified Skills</p>
                      <p className="font-bold text-emerald-600">{verifiedSkills} Badges</p>
                    </div>
                  </div>

                  {/* Next Scheduled Session Badge */}
                  {nextSession && (
                    <div className="mt-2.5 p-2 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs flex items-center justify-between text-indigo-900">
                      <span className="flex items-center gap-1 font-medium text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        Next: {nextSession.scheduledDate} ({nextSession.startTime})
                      </span>
                      <a href={nextSession.meetingUrl} target="_blank" rel="noreferrer" className="text-[10px] font-bold underline">
                        Link
                      </a>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                    onClick={() => setGoalModalStudent(student)}
                    leftIcon={<Target className="w-3.5 h-3.5 text-indigo-600" />}
                  >
                    Assign Goal
                  </Button>

                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full text-xs"
                    onClick={() => setSessionModalStudent(student)}
                    leftIcon={<Calendar className="w-3.5 h-3.5" />}
                  >
                    1-on-1 Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* MODAL 1: Assign Goal */}
      {goalModalStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Assign Mentorship Goal</h3>
                <p className="text-xs text-slate-500">Mentee: <b className="text-slate-800">{goalModalStudent.fullName}</b></p>
              </div>
              <button onClick={() => setGoalModalStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Goal Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Master PostgreSQL Indexing & EXPLAIN ANALYZE"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Skill Area
                  </label>
                  <Input
                    value={goalSkill}
                    onChange={(e) => setGoalSkill(e.target.value)}
                    placeholder="e.g. SQL & PostgreSQL"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <Select
                    value={goalPriority}
                    onChange={(e) => setGoalPriority(e.target.value as any)}
                    options={[
                      { value: 'High', label: '🔥 High Priority' },
                      { value: 'Medium', label: '⚡ Medium Priority' },
                      { value: 'Low', label: '🌱 Low Priority' }
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Completion Deadline
                </label>
                <Input
                  type="date"
                  value={goalTargetDate}
                  onChange={(e) => setGoalTargetDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Goal Directives & Key Results (Expected Deliverables)
                </label>
                <Textarea
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe specific milestones (e.g. benchmark query throughput before and after B-tree indexing)..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button size="sm" variant="outline" type="button" onClick={() => setGoalModalStudent(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit" leftIcon={<Target className="w-4 h-4" />}>
                  Assign Milestone Goal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Schedule 1-on-1 Session */}
      {sessionModalStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Schedule 1-on-1 Mentorship Session</h3>
                <p className="text-xs text-slate-500">Mentee: <b className="text-slate-800">{sessionModalStudent.fullName}</b></p>
              </div>
              <button onClick={() => setSessionModalStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Session Topic / Theme <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <Input
                    type="time"
                    value={sessionStartTime}
                    onChange={(e) => setSessionStartTime(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time
                  </label>
                  <Input
                    type="time"
                    value={sessionEndTime}
                    onChange={(e) => setSessionEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Format
                  </label>
                  <Select
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value as any)}
                    options={[
                      { value: 'Online', label: 'Google Meet / Zoom' },
                      { value: 'Offline', label: 'In-Person Campus Lab' },
                      { value: 'Phone', label: 'Phone Consultation' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Meeting Link / Room
                  </label>
                  <Input
                    value={meetingUrl}
                    onChange={(e) => setMeetingUrl(e.target.value)}
                    placeholder="https://meet.google.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Agenda & Preparation Notes
                </label>
                <Textarea
                  value={sessionAgenda}
                  onChange={(e) => setSessionAgenda(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button size="sm" variant="outline" type="button" onClick={() => setSessionModalStudent(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit" leftIcon={<Calendar className="w-4 h-4" />}>
                  Confirm & Send Calendar Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
