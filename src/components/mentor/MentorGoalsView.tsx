import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { MentorGoal, MentorProfile, StudentProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Input, Textarea, Select } from '../common/Input';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  X, 
  Trash2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface MentorGoalsViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const MentorGoalsView: React.FC<MentorGoalsViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const mentor = user as MentorProfile;

  const [goals, setGoals] = useState<MentorGoal[]>(() => StorageService.getMentorGoals());
  const [students] = useState<StudentProfile[]>(() => StorageService.getStudents());
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter
  const [statusFilter, setStatusFilter] = useState('All');

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [title, setTitle] = useState('');
  const [targetSkill, setTargetSkill] = useState('SQL & PostgreSQL');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [targetDate, setTargetDate] = useState('2026-09-25');
  const [description, setDescription] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !title.trim()) {
      addToast('error', 'Validation Error', 'Please choose a student and enter a goal title.');
      return;
    }

    const st = students.find(s => s.id === selectedStudentId);
    if (!st) return;

    const newGoal: MentorGoal = {
      id: `goal-${Date.now()}`,
      mentorId: mentor?.id || 'usr-mentor-1',
      studentId: st.id,
      title: title.trim(),
      description: description.trim() || 'Work through practice problems and deliver clean code with documentation.',
      targetSkill,
      targetDate,
      status: 'In Progress',
      priority,
      createdAt: new Date().toISOString()
    };

    StorageService.addMentorGoal(newGoal);
    setGoals(StorageService.getMentorGoals());

    StorageService.addNotification({
      id: `notif-goal-new-${Date.now()}`,
      userId: st.id,
      title: `New Mentorship Goal Assigned: ${newGoal.title} 🎯`,
      message: `Your industry mentor ${mentor?.fullName || 'Mentor'} assigned you a new technical milestone due by ${newGoal.targetDate}.`,
      type: 'recommendation',
      read: false,
      createdAt: new Date().toISOString()
    });

    addToast('success', 'Goal Created! 🚀', `Assigned "${newGoal.title}" to ${st.fullName}.`);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  const handleUpdateStatus = (goalId: string, newStatus: 'Not Started' | 'In Progress' | 'Completed') => {
    StorageService.updateMentorGoalStatus(goalId, newStatus);
    setGoals(StorageService.getMentorGoals());
    addToast('info', 'Goal Status Updated', `Milestone marked as ${newStatus}.`);
  };

  const filteredGoals = goals.filter(g => {
    if (statusFilter !== 'All' && g.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Mentorship Goals & Milestones</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Assign and monitor targeted technical competencies for your assigned mentees.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Assign Milestone Goal
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'In Progress', 'Completed', 'Not Started'].map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusFilter(tab)}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all ${
              statusFilter === tab
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab} ({tab === 'All' ? goals.length : goals.filter(g => g.status === tab).length})
          </button>
        ))}
      </div>

      {/* Goals Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGoals.map(goal => {
          const student = students.find(s => s.id === goal.studentId);

          return (
            <Card key={goal.id} className="hover:border-indigo-200 transition-all flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {goal.targetSkill}
                    </span>
                    <Badge variant={goal.priority === 'High' ? 'danger' : goal.priority === 'Medium' ? 'warning' : 'default'} className="text-[10px]">
                      {goal.priority} Priority
                    </Badge>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2">{goal.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{goal.description}</p>
                </div>

                {/* Mentee & Deadline info */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Mentee:</span>
                    <span className="font-bold text-slate-900">{student?.fullName || 'Assigned Student'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Target Deadline:</span>
                    <span className="font-semibold text-indigo-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {goal.targetDate}
                    </span>
                  </div>
                </div>

                {/* Status Switcher Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Badge variant={goal.status === 'Completed' ? 'success' : 'primary'} className="text-[10px]">
                    {goal.status}
                  </Badge>

                  <div className="flex items-center gap-1">
                    {goal.status !== 'Completed' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[11px] h-7 px-2 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                        onClick={() => handleUpdateStatus(goal.id, 'Completed')}
                        leftIcon={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      >
                        Mark Done
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[11px] h-7 px-2 text-slate-600"
                        onClick={() => handleUpdateStatus(goal.id, 'In Progress')}
                      >
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* MODAL: Assign Milestone Goal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Assign Milestone Goal</h3>
                <p className="text-xs text-slate-500">Track key technical deliverable</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Student Mentee <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  options={[
                    { value: '', label: '-- Choose Mentee --' },
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
                  Goal Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                    value={targetSkill}
                    onChange={(e) => setTargetSkill(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
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
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deliverables & Verification Criteria
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Explain what the student should build or demonstrate..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button size="sm" variant="outline" type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit" leftIcon={<Target className="w-4 h-4" />}>
                  Assign Goal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
