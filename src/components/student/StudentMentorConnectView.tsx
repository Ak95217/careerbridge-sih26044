import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { StudentProfile, MentorProfile, MentoringSession, MentorGoal } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Input, Textarea } from '../common/Input';
import { 
  Users, 
  Calendar, 
  Clock, 
  Target,
  MessageSquare, 
  Star, 
  CheckCircle2, 
  Briefcase, 
  ExternalLink,
  Linkedin,
  Sparkles
} from 'lucide-react';

interface StudentMentorConnectViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const StudentMentorConnectView: React.FC<StudentMentorConnectViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const student = user as StudentProfile;

  const [mentors] = useState<MentorProfile[]>(() => StorageService.getMentors());

  const [sessions, setSessions] = useState<MentoringSession[]>(() => StorageService.getMentoringSessions());
  const [goals, setGoals] = useState<MentorGoal[]>(() => StorageService.getMentorGoals());

  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [topic, setTopic] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-09-20');
  const [startTime, setStartTime] = useState('18:00');
  const [notes, setNotes] = useState('');

  const studentSessions = sessions.filter(s => s.studentId === student?.id || s.studentName === student?.fullName || !s.studentId);
  const studentGoals = goals.filter(g => g.studentId === student?.id || !g.studentId);

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !preferredDate) {
      addToast('error', 'Required Fields', 'Please provide a session topic and date.');
      return;
    }

    const newSession: MentoringSession = {
      id: `sess-${Date.now()}`,
      mentorId: selectedMentor?.id || 'usr-mentor-1',
      mentorName: selectedMentor?.fullName || 'Priya Nair',
      studentId: student?.id || '',
      studentName: student?.fullName || 'Not provided',
      sessionDate: preferredDate,
      sessionTime: startTime || '18:00',
      topic: topic.trim(),
      sessionType: 'Online',
      meetingLinkOrVenue: 'https://meet.google.com/sih-mentorship-demo',
      status: 'Scheduled',
      notes: notes.trim(),
      createdAt: new Date().toISOString()
    };

    StorageService.addMentoringSession(newSession);
    setSessions(StorageService.getMentoringSessions());

    setShowBookingModal(false);
    setTopic('');
    setNotes('');

    addToast('success', 'Session Scheduled! 🚀', `Mentorship session booked with ${newSession.mentorName}. Meeting link sent to ${student.email}.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Industry Mentorship & 1-on-1 Guidance</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Connect directly with verified staff architects, tech leads, and faculty mentors for system design reviews, mock interviews, and assigned career milestones.
          </p>
        </div>
      </div>

      {/* Assigned Mentorship Goals Section */}
      {studentGoals.length > 0 && (
        <Card className="border-indigo-100 bg-indigo-50/20">
          <CardHeader
            title="Assigned Mentorship Milestones & Goals"
            subtitle="Technical milestones assigned by your mentor"
          />
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studentGoals.map(goal => (
                <div key={goal.id} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {goal.targetSkill}
                    </span>
                    <Badge variant={goal.status === 'Completed' ? 'success' : 'primary'} size="sm">
                      {goal.status}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{goal.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{goal.description}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Deadline: <b className="text-slate-800">{goal.targetDate}</b></span>
                    <span className="text-rose-600 font-semibold">{goal.priority} Priority</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booked Sessions Banner */}
      {studentSessions.length > 0 && (
        <Card className="border-indigo-200 bg-indigo-50/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Upcoming 1-on-1 Mentorship Sessions ({studentSessions.length})</h3>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {studentSessions.map((sess) => (
              <div
                key={sess.id}
                className="bg-white p-4 rounded-xl border border-indigo-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">{sess.topic}</h4>
                    <Badge variant={sess.status === 'Completed' ? 'success' : 'primary'} size="sm">
                      {sess.status}
                    </Badge>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Mentor: <strong className="text-slate-800">{sess.mentorName}</strong> ({sess.sessionType})
                  </p>
                  <p className="text-indigo-700 font-semibold mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{sess.sessionDate} at {sess.sessionTime}</span>
                  </p>
                  {sess.notes && (
                    <p className="text-[11px] text-emerald-700 font-medium mt-1 bg-emerald-50 p-1.5 rounded">
                      <b>Mentor Notes:</b> {sess.notes}
                    </p>
                  )}
                </div>

                {sess.meetingLinkOrVenue && sess.status === 'Scheduled' && (
                  <a
                    href={sess.meetingLinkOrVenue}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors inline-flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Join Video Call</span>
                  </a>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Mentors Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mentors.map((mentor) => (
          <Card key={mentor.id} className="hover:border-indigo-200 transition-all flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={mentor.avatarUrl}
                  alt={mentor.fullName}
                  className="w-16 h-16 rounded-2xl border-2 border-slate-200 object-cover shadow-xs shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{mentor.fullName}</h3>
                    <Badge variant="primary" size="sm">Verified Mentor</Badge>
                  </div>
                  <p className="text-xs font-semibold text-indigo-700 mt-0.5">{mentor.title}</p>
                  <p className="text-[11px] text-slate-500">{mentor.organization} • {mentor.yearsOfExperience}+ Yrs Exp</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                {mentor.bio}
              </p>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Mentorship Focus Areas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {mentor.expertise.map((exp, idx) => (
                    <span key={idx} className="text-[11px] font-semibold bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded-md border border-indigo-100">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{mentor.maxMentees - mentor.currentMenteesCount} Slots Available</span>
                </span>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setSelectedMentor(mentor);
                    setShowBookingModal(true);
                  }}
                  leftIcon={<Calendar className="w-3.5 h-3.5" />}
                >
                  Book 1-on-1 Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedMentor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Book Mentorship Session</h3>
                <p className="text-xs text-slate-500">with {selectedMentor.fullName} ({selectedMentor.title})</p>
              </div>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSession} className="space-y-3">
              <Input
                label="Session Topic / Objective"
                placeholder="e.g. Mock System Design Interview (Scalable URL Shortener / Rate Limiter)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Preferred Date"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  required
                />
                <Input
                  label="Preferred Time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <Textarea
                label="Questions / Specific Preparation Goals"
                rows={3}
                placeholder="Share your current skill gap or resume areas you'd like guidance on..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Confirm Booking
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
