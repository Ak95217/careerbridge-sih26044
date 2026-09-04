import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { TrainingProgram, TrainingRegistration, SkillCategory, ProficiencyLevel, FacultyProfile } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Input, Textarea, Select } from '../common/Input';
import { 
  BookOpen, 
  Plus, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  X, 
  FileText, 
  Trash2,
  GraduationCap,
  Download
} from 'lucide-react';

interface FacultyTrainingViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const FacultyTrainingView: React.FC<FacultyTrainingViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const faculty = user as FacultyProfile;

  const [programs, setPrograms] = useState<TrainingProgram[]>(() => StorageService.getTrainingPrograms());
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>(() => StorageService.getTrainingRegistrations());
  const [taxonomy] = useState(() => StorageService.getSkills());

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProgramRoster, setSelectedProgramRoster] = useState<TrainingProgram | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [skillName, setSkillName] = useState('SQL & PostgreSQL');
  const [category, setCategory] = useState<SkillCategory>('Database');
  const [targetProficiency, setTargetProficiency] = useState<ProficiencyLevel>('Advanced');
  const [duration, setDuration] = useState('4 Weeks (24 Hours)');
  const [mode, setMode] = useState<'Online' | 'Offline' | 'Hybrid'>('Hybrid');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-10-15');
  const [regDeadline, setRegDeadline] = useState('2026-09-10');
  const [instructor, setInstructor] = useState(faculty?.fullName || 'Dr. Rameshwar V. Iyer');
  const [capacity, setCapacity] = useState(60);
  const [description, setDescription] = useState('');
  const [syllabusModules, setSyllabusModules] = useState<string[]>([
    'Module 1: Relational Architecture & Normalization',
    'Module 2: Query Optimization with EXPLAIN ANALYZE',
    'Module 3: Indexing Strategies (B-Tree, GIN, GiST)',
    'Module 4: Transaction Isolation & MVCC Concurrency'
  ]);

  const handleAddSyllabusItem = () => {
    setSyllabusModules(prev => [...prev, `Module ${prev.length + 1}: `]);
  };

  const handleUpdateSyllabusItem = (index: number, text: string) => {
    setSyllabusModules(prev => {
      const copy = [...prev];
      copy[index] = text;
      return copy;
    });
  };

  const handleRemoveSyllabusItem = (index: number) => {
    if (syllabusModules.length <= 1) return;
    setSyllabusModules(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('error', 'Validation Error', 'Program title is required.');
      return;
    }

    const newProgram: TrainingProgram = {
      id: `train-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || `Department upskilling program on ${skillName}.`,
      skillName,
      category,
      targetProficiency,
      duration,
      mode,
      startDate,
      endDate,
      registrationDeadline: regDeadline,
      instructorName: instructor,
      capacity,
      enrolledCount: 0,
      institutionId: faculty?.institutionId || 'inst-1',
      institutionName: faculty?.institutionName || 'National Institute of Technology, New Delhi',
      createdByFacultyId: faculty?.id || 'usr-faculty-1',
      syllabus: syllabusModules.filter(m => m.trim().length > 0),
      status: 'Upcoming',
      createdAt: new Date().toISOString()
    };

    StorageService.createTrainingProgram(newProgram);
    setPrograms(StorageService.getTrainingPrograms());
    addToast('success', 'Bootcamp Published! 🎓', `Upskilling program "${newProgram.title}" is now open for student enrollments.`);
    setShowCreateModal(false);
    setTitle('');
    setDescription('');
  };

  const handleDeleteProgram = (id: string, progTitle: string) => {
    if (confirm(`Are you sure you want to delete "${progTitle}"?`)) {
      StorageService.deleteTrainingProgram(id);
      setPrograms(StorageService.getTrainingPrograms());
      addToast('info', 'Program Deleted', `"${progTitle}" removed.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Upskilling & Training Programs</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Design targeted bootcamps addressing campus skill gaps identified in recruiter demand reports.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Upskilling Bootcamp
        </Button>
      </div>

      {/* Programs List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {programs.map(prog => {
          const progRegs = registrations.filter(r => r.programId === prog.id);

          return (
            <Card key={prog.id} className="hover:border-indigo-200 transition-all flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {prog.skillName} • {prog.category}
                    </span>
                    <Badge variant={prog.status === 'Active' ? 'success' : 'primary'} className="text-[10px]">
                      {prog.status}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2">{prog.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{prog.description}</p>
                </div>

                {/* Key Specs */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Duration & Mode</p>
                    <p className="font-bold text-slate-800 truncate">{prog.duration} ({prog.mode})</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Timeline</p>
                    <p className="font-bold text-slate-800">{prog.startDate} to {prog.endDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Enrolled</p>
                    <p className="font-bold text-indigo-600">{prog.enrolledCount} / {prog.capacity} Seats</p>
                  </div>
                </div>

                {/* Instructor & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    <span>Instructor: <b className="text-slate-800">{prog.instructorName}</b></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 px-2.5"
                      onClick={() => setSelectedProgramRoster(prog)}
                      leftIcon={<Users className="w-3.5 h-3.5" />}
                    >
                      Enrolled Roster ({progRegs.length})
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProgram(prog.id, prog.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Delete training program"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* MODAL 1: Create Program */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-base font-bold text-slate-900">Launch Upskilling Bootcamp</h3>
                <p className="text-xs text-slate-500">Curriculum-bridging program for college students</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProgram} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Program Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Enterprise PostgreSQL & High-Throughput Database Architecture"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Skill
                  </label>
                  <Select
                    value={skillName}
                    onChange={(e) => {
                      setSkillName(e.target.value);
                      const t = taxonomy.find(item => item.name === e.target.value);
                      if (t) setCategory(t.category);
                    }}
                    options={taxonomy.map(t => ({ value: t.name, label: t.name }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Proficiency
                  </label>
                  <Select
                    value={targetProficiency}
                    onChange={(e) => setTargetProficiency(e.target.value as any)}
                    options={[
                      { value: 'Intermediate', label: 'Intermediate' },
                      { value: 'Advanced', label: 'Advanced' },
                      { value: 'Expert', label: 'Expert' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Delivery Mode
                  </label>
                  <Select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    options={[
                      { value: 'Hybrid', label: 'Hybrid' },
                      { value: 'Online', label: 'Online' },
                      { value: 'Offline', label: 'In-Campus Lab' }
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration & Hours
                  </label>
                  <Input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="4 Weeks (24 Hours)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registration Deadline
                  </label>
                  <Input
                    type="date"
                    value={regDeadline}
                    onChange={(e) => setRegDeadline(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instructor / SME Name
                  </label>
                  <Input
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Capacity
                  </label>
                  <Input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 50)}
                    min={10}
                    max={300}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Program Overview & Industry Alignment
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Explain how this bridges current campus placement requirements..."
                />
              </div>

              {/* Dynamic Syllabus */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Syllabus Modules ({syllabusModules.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSyllabusItem}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Topic
                  </button>
                </div>
                <div className="space-y-1.5">
                  {syllabusModules.map((mod, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={mod}
                        onChange={(e) => handleUpdateSyllabusItem(idx, e.target.value)}
                        placeholder={`Topic #${idx + 1}`}
                        className="text-xs py-1.5"
                      />
                      {syllabusModules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSyllabusItem(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button size="sm" variant="outline" type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit" leftIcon={<BookOpen className="w-4 h-4" />}>
                  Publish Bootcamp
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Enrolled Roster */}
      {selectedProgramRoster && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedProgramRoster.title}</h3>
                <p className="text-xs text-slate-500">Student Enrollment Roster ({selectedProgramRoster.enrolledCount} Registered)</p>
              </div>
              <button onClick={() => setSelectedProgramRoster(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {(() => {
                const regs = registrations.filter(r => r.programId === selectedProgramRoster.id);
                if (regs.length === 0) {
                  return (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      No students enrolled in this program yet.
                    </div>
                  );
                }

                return (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                    {regs.map(reg => (
                      <div key={reg.id} className="p-3.5 bg-white flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{reg.studentName}</p>
                          <p className="text-[11px] text-slate-500">{reg.studentEmail} • {reg.studentBranch}</p>
                          <p className="text-[10px] text-slate-400">Enrolled: {new Date(reg.registeredAt).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="success" className="text-[10px]">
                          {reg.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
