import React, { useState } from 'react';
import { Application, InterviewSchedule, CompanyProfile } from '../../types';
import { Modal } from '../common/Modal';
import { Input, Textarea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { StorageService } from '../../services/storage';
import { useToast } from '../../context/ToastContext';
import { Calendar, Clock, Video, MapPin, User, FileText, Sparkles } from 'lucide-react';

interface CompanyInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  company: CompanyProfile;
  onInterviewScheduled: () => void;
}

export const CompanyInterviewModal: React.FC<CompanyInterviewModalProps> = ({
  isOpen,
  onClose,
  application,
  company,
  onInterviewScheduled
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [roundName, setRoundName] = useState('Technical Architecture & Live Coding');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('14:30');
  const [interviewType, setInterviewType] = useState<'Online' | 'In-Person' | 'Telephonic'>('Online');
  const [meetingLinkOrVenue, setMeetingLinkOrVenue] = useState('https://meet.google.com/tcs-eval-sih-2026');
  const [interviewerName, setInterviewerName] = useState(company.contactPerson || company.fullName || 'Technical Interview Panel');
  const [instructions, setInstructions] = useState(
    'Please join 5 minutes prior with a working webcam, microphone, and your preferred coding IDE installed.'
  );

  if (!application) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledDate || !scheduledTime || !meetingLinkOrVenue.trim()) {
      showToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please provide interview date, time, and meeting link / venue.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const interviewRecord: InterviewSchedule = {
        id: `int-${Date.now()}`,
        applicationId: application.id,
        opportunityId: application.opportunityId,
        opportunityTitle: application.opportunityTitle,
        companyId: company.id,
        companyName: company.companyName,
        studentId: application.studentId,
        studentName: application.studentName,
        studentEmail: application.studentEmail,
        scheduledDate,
        scheduledTime,
        interviewType,
        meetingLinkOrVenue,
        interviewerName,
        roundName,
        instructions,
        status: 'Scheduled',
        createdAt: new Date().toISOString()
      };

      StorageService.scheduleInterview(interviewRecord);

      showToast({
        type: 'success',
        title: 'Interview Scheduled Successfully',
        message: `Notification and calendar invite dispatched to ${application.studentName}.`
      });

      onInterviewScheduled();
      onClose();
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        title: 'Scheduling Failed',
        message: 'Could not record interview schedule. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Candidate Interview"
      description={`Setting up interview round for ${application.studentName}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Candidate & Opportunity Summary Banner */}
        <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">Candidate</span>
            <p className="text-xs font-bold text-slate-900">{application.studentName} ({application.studentCollege})</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Role: <span className="font-semibold">{application.opportunityTitle}</span></p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-purple-600 font-medium">Skill Match</span>
            <p className="text-sm font-black text-purple-900">{application.skillMatchScore}%</p>
          </div>
        </div>

        {/* Round Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Round Title *</label>
          <Select
            value={roundName}
            onChange={(e) => setRoundName(e.target.value)}
          >
            <option value="Technical Architecture & Live Coding">Technical Architecture & Live Coding Round</option>
            <option value="Data Structures & Algorithms Screening">Data Structures & Algorithms Screening</option>
            <option value="System Design & Domain Assessment">System Design & Domain Assessment</option>
            <option value="Hiring Manager & Culture Fit">Hiring Manager & Culture Fit</option>
            <option value="Final Selection & Placement Discussion">Final Selection & Placement Discussion</option>
          </Select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Scheduled Date *"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4" />}
            required
          />
          <Input
            label="Scheduled Time (IST) *"
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            leftIcon={<Clock className="w-4 h-4" />}
            required
          />
        </div>

        {/* Interview Mode and Link/Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Mode *</label>
            <Select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value as any)}
            >
              <option value="Online">Online Video (Google Meet / Teams)</option>
              <option value="In-Person">In-Person (Campus / Corporate Office)</option>
              <option value="Telephonic">Telephonic Screening</option>
            </Select>
          </div>

          <Input
            label={interviewType === 'Online' ? 'Meeting URL *' : 'Venue / Room Details *'}
            placeholder={interviewType === 'Online' ? 'https://meet.google.com/...' : 'Hall 4, Campus Placement Center'}
            value={meetingLinkOrVenue}
            onChange={(e) => setMeetingLinkOrVenue(e.target.value)}
            leftIcon={interviewType === 'Online' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
            required
          />
        </div>

        {/* Interviewer Name */}
        <Input
          label="Interviewer / Panel Name"
          placeholder="e.g. Panel Lead / Technical Interviewer"
          value={interviewerName}
          onChange={(e) => setInterviewerName(e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
        />

        {/* Instructions / Agenda */}
        <Textarea
          label="Candidate Instructions & Preparation Checklist"
          rows={3}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Enter instructions, IDE requirements, or topics for the candidate..."
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Confirm & Dispatch Invite
          </Button>
        </div>
      </form>
    </Modal>
  );
};
