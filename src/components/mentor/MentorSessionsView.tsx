import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { MentoringSession, MentorProfile, StudentProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Input, Textarea, Select } from '../common/Input';
import { 
  Calendar, 
  Clock, 
  Video, 
  Plus, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  X, 
  Users,
  MapPin,
  Sparkles
} from 'lucide-react';

interface MentorSessionsViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const MentorSessionsView: React.FC<MentorSessionsViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const mentor = user as MentorProfile;

  const [sessions, setSessions] = useState<MentoringSession[]>(() => StorageService.getMentoringSessions());
  const [students] = useState<StudentProfile[]>(() => StorageService.getStudents());

  // Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [loggingSession, setLoggingSession] = useState<MentoringSession | null>(null);
  const [postSessionNotes, setPostSessionNotes] = useState('');

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [topic, setTopic] = useState('System Design & Query Optimization');
  const [scheduledDate, setScheduledDate] = useState('2026-09-15');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('19:00');
  const [sessionType, setSessionType] = useState<'Online' | 'Offline' | 'Phone'>('Online');
  const [meetingUrl, setMeetingUrl] = useState('https://meet.google.com/xyz-mentor-connect');
  const [agenda, setAgenda] = useState('1. Review PostgreSQL indexes\n2. Mock behavioral interview questions\n3. Resume project bullet points review');

  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      addToast('error', 'Select Mentee', 'Please choose a student mentee.');
      return;
    }

    const st = students.find(s => s.id === selectedStudentId);
    if (!st) return;

    const newSession: MentoringSession = {
      id: `sess-${Date.now()}`,
      mentorId: mentor?.id || 'usr-mentor-1',
      mentorName: mentor?.fullName || 'Industry Mentor',
      studentId: st.id,
      studentName: st.fullName,
      sessionDate: scheduledDate,
      sessionTime: startTime,
      topic: topic.trim(),
      sessionType,
      meetingLinkOrVenue: meetingUrl,
      status: 'Scheduled',
      notes: agenda.trim(),
      createdAt: new Date().toISOString()
    };

    StorageService.addMentoringSession(newSession);
    setSessions(StorageService.getMentoringSessions());

    StorageService.addNotification({
      id: `notif-sess-${Date.now()}`,
      userId: st.id,
      title: `1-on-1 Mentorship Scheduled: ${newSession.topic} 📅`,
      message: `${mentor?.fullName || 'Industry Mentor'} scheduled a 1-on-1 meeting on ${newSession.sessionDate} at ${newSession.sessionTime}. Link: ${newSession.meetingLinkOrVenue}`,
      type: 'interview',
      read: false,
      createdAt: new Date().toISOString()
    });

    addToast('success', 'Session Scheduled! 🗓️', `Session created with ${st.fullName} on ${newSession.sessionDate}.`);
    setShowScheduleModal(false);
  };

  const handleCompleteSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggingSession) return;

    StorageService.updateMentoringSessionNotes(loggingSession.id, postSessionNotes.trim());
    setSessions(StorageService.getMentoringSessions());

    StorageService.addNotification({
      id: `notif-sess-notes-${Date.now()}`,
      userId: loggingSession.studentId,
      title: `Session Notes Logged by Mentor 📝`,
      message: `${mentor?.fullName || 'Your mentor'} added feedback notes for session "${loggingSession.topic}".`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    });

    addToast('success', 'Session Logged! ✅', 'Session marked as Completed and feedback recorded.');
    setLoggingSession(null);
    setPostSessionNotes('');
  };

  const upcomingSessions = sessions.filter(s => s.status === 'Scheduled');
  const pastSessions = sessions.filter(s => s.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">1-on-1 Mentorship Sessions & Video Calls</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Conduct scheduled code reviews, career guidance chats, and technical mock interviews.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setShowScheduleModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Schedule 1-on-1 Session
        </Button>
      </div>

      {/* Upcoming Sessions Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          Upcoming Scheduled Sessions ({upcomingSessions.length})
        </h3>

        {upcomingSessions.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl border border-slate-200 p-6 text-xs text-slate-500">
            No upcoming sessions scheduled. Click "Schedule 1-on-1 Session" to plan a meeting with a mentee.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.map(session => (
              <Card key={session.id} className="border-indigo-100 hover:border-indigo-300 transition-all">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {session.sessionType} Session
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1.5">{session.topic}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Mentee: <b className="text-slate-800">{session.studentName}</b>
                      </p>
                    </div>

                    <Badge variant="primary" className="text-[10px]">
                      {session.status}
                    </Badge>
                  </div>

                  {/* Timing & Link */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        {session.sessionDate} at {session.sessionTime}
                      </span>
                      {session.meetingLinkOrVenue && (
                        <a
                          href={session.meetingLinkOrVenue}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                        >
                          <Video className="w-3.5 h-3.5" /> Join Room
                        </a>
                      )}
                    </div>

                    {session.notes && (
                      <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        <b>Agenda / Notes:</b> {session.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                      onClick={() => {
                        setLoggingSession(session);
                        setPostSessionNotes(session.notes || '');
                      }}
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    >
                      Log Notes & Mark Completed
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Sessions Log */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Completed Session History ({pastSessions.length})
        </h3>

        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-y border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Topic & Mentee</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Post-Session Feedback / Notes</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {pastSessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No completed session logs yet.
                    </td>
                  </tr>
                ) : (
                  pastSessions.map(session => (
                    <tr key={session.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{session.topic}</p>
                        <p className="text-[11px] text-slate-500">Mentee: {session.studentName}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {session.sessionDate} ({session.sessionTime})
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="default" className="text-[10px]">{session.sessionType}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                        <p className="truncate">{session.notes || 'Reviewed student roadmap and system design basics.'}</p>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Badge variant="success" className="text-[10px]">Completed</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* MODAL 1: Schedule Session */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Schedule Mentorship Meeting</h3>
                <p className="text-xs text-slate-500">Set time and video call parameters</p>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Mentee <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  options={[
                    { value: '', label: '-- Choose Student --' },
                    ...students.map(s => ({
                      value: s.id,
                      label: `${s.fullName} (${s.branch})`
                    }))
                  ]}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Session Topic <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Distributed System Architecture & Query Profiling"
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
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time
                  </label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Meeting Format
                  </label>
                  <Select
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value as any)}
                    options={[
                      { value: 'Online', label: 'Google Meet / Zoom' },
                      { value: 'Offline', label: 'In-Campus Lab' },
                      { value: 'Phone', label: 'Phone Consultation' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Meeting Link
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
                  Discussion Agenda
                </label>
                <Textarea
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button size="sm" variant="outline" type="button" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit" leftIcon={<Calendar className="w-4 h-4" />}>
                  Confirm Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Log Notes & Complete */}
      {loggingSession && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Log Mentorship Feedback & Notes</h3>
                <p className="text-xs text-slate-500">Session: <b className="text-slate-800">{loggingSession.topic}</b></p>
              </div>
              <button onClick={() => setLoggingSession(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCompleteSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Feedback Notes & Recommended Next Steps <span className="text-rose-500">*</span>
                </label>
                <Textarea
                  value={postSessionNotes}
                  onChange={(e) => setPostSessionNotes(e.target.value)}
                  rows={4}
                  placeholder="Summarize student progress, strengths demonstrated, and homework exercises assigned..."
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button size="sm" variant="outline" type="button" onClick={() => setLoggingSession(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
                  Save Notes & Mark Completed
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
