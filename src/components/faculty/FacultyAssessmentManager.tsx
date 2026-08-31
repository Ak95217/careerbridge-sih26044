import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { SkillAssessment, AssessmentQuestion, SkillCategory, ProficiencyLevel } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Input, Textarea, Select } from '../common/Input';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Award, 
  FileText, 
  X, 
  Sparkles, 
  Users, 
  Eye,
  HelpCircle
} from 'lucide-react';

interface FacultyAssessmentManagerProps {
  onNavigateTab?: (tabId: string) => void;
}

export const FacultyAssessmentManager: React.FC<FacultyAssessmentManagerProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [assessments, setAssessments] = useState<SkillAssessment[]>(() => StorageService.getAssessments());
  const [taxonomy] = useState(() => StorageService.getSkills());
  const [attempts] = useState(() => StorageService.getAssessmentAttempts());

  // Modal State for New Assessment
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAssessmentToInspect, setSelectedAssessmentToInspect] = useState<SkillAssessment | null>(null);

  // New Assessment Form Fields
  const [newTitle, setNewTitle] = useState('');
  const [newSkillName, setNewSkillName] = useState('SQL & PostgreSQL');
  const [newCategory, setNewCategory] = useState<SkillCategory>('Database');
  const [newDescription, setNewDescription] = useState('');
  const [newProficiency, setNewProficiency] = useState<ProficiencyLevel>('Advanced');
  const [newDuration, setNewDuration] = useState(15);
  const [newPassingScore, setNewPassingScore] = useState(75);

  // Dynamic Questions Builder
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([
    {
      id: `q-${Date.now()}-1`,
      questionText: 'Which PostgreSQL isolation level prevents Non-Repeatable Reads and Dirty Reads while utilizing multi-version concurrency control (MVCC)?',
      options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable Snapshot'],
      correctOptionIndex: 2,
      explanation: 'Repeatable Read in PostgreSQL ensures a snapshot taken at the start of the first query is maintained for the entire transaction, preventing non-repeatable reads.',
      difficulty: 'Intermediate'
    },
    {
      id: `q-${Date.now()}-2`,
      questionText: 'When analyzing slow queries with EXPLAIN (ANALYZE, BUFFERS), which metric indicates that PostgreSQL had to perform slow disk reads instead of shared memory buffer hits?',
      options: ['Buffers: hit=450', 'Buffers: read=280', 'Planning Time: 0.12ms', 'Rows Removed by Filter: 0'],
      correctOptionIndex: 1,
      explanation: 'Buffers: read=280 indicates 280 blocks were read directly from disk or OS file cache rather than shared buffer pool.',
      difficulty: 'Advanced'
    }
  ]);

  // Add Question
  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: `q-${Date.now()}-${prev.length + 1}`,
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        explanation: '',
        difficulty: 'Intermediate'
      }
    ]);
  };

  // Update Question Field
  const handleUpdateQuestion = (qIndex: number, field: keyof AssessmentQuestion, value: any) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[qIndex] = { ...copy[qIndex], [field]: value };
      return copy;
    });
  };

  // Update Question Option
  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    setQuestions(prev => {
      const copy = [...prev];
      const newOpts = [...copy[qIndex].options];
      newOpts[optIndex] = text;
      copy[qIndex] = { ...copy[qIndex], options: newOpts };
      return copy;
    });
  };

  // Remove Question
  const handleRemoveQuestion = (qIndex: number) => {
    if (questions.length <= 1) {
      addToast('error', 'Minimum Questions', 'An assessment must have at least one question.');
      return;
    }
    setQuestions(prev => prev.filter((_, idx) => idx !== qIndex));
  };

  // Submit New Assessment
  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      addToast('error', 'Validation Error', 'Assessment title is required.');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        addToast('error', 'Incomplete Question', `Question #${i + 1} text is empty.`);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        addToast('error', 'Incomplete Options', `Question #${i + 1} must have all 4 options filled.`);
        return;
      }
    }

    const createdAssessment: SkillAssessment = {
      id: `assess-${Date.now()}`,
      skillId: `sk-${Date.now()}`,
      skillName: newSkillName,
      category: newCategory,
      title: newTitle.trim(),
      description: newDescription.trim() || `Department technical evaluation test for ${newSkillName}.`,
      durationMinutes: newDuration,
      passingScorePercentage: newPassingScore,
      totalQuestions: questions.length,
      questions
    };

    StorageService.createAssessment(createdAssessment);
    setAssessments(StorageService.getAssessments());

    // Broadcast notification to all students
    const students = StorageService.getStudents();
    students.forEach(st => {
      StorageService.addNotification({
        id: `notif-assess-${Date.now()}-${st.id}`,
        userId: st.id,
        title: `New Skill Assessment Published: ${createdAssessment.title} 📝`,
        message: `Faculty published a verified skill test for ${createdAssessment.skillName} (${createdAssessment.durationMinutes} mins, ${createdAssessment.totalQuestions} questions). Take it now to earn your verified badge.`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      });
    });

    addToast('success', 'Assessment Published! 🎯', `Assessment "${createdAssessment.title}" is now live for all students.`);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  // Delete Assessment
  const handleDeleteAssessment = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      StorageService.deleteAssessment(id);
      setAssessments(StorageService.getAssessments());
      addToast('info', 'Assessment Deleted', `"${title}" has been removed from the assessment repository.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Skill Assessment Builder & Verification Engine</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Author standardized multi-choice skill examinations with automated grading, instant verified badges, and proficiency scoring.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Author New Assessment
        </Button>
      </div>

      {/* Assessment Repository Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assessments.map(assessment => {
          const assessmentAttempts = attempts.filter(a => a.assessmentId === assessment.id || a.skillName.toLowerCase() === assessment.skillName.toLowerCase());
          const passedCount = assessmentAttempts.filter(a => a.passed).length;
          const avgScore = assessmentAttempts.length > 0 
            ? Math.round(assessmentAttempts.reduce((acc, a) => acc + a.scorePercentage, 0) / assessmentAttempts.length)
            : 85;

          return (
            <Card key={assessment.id} className="hover:border-indigo-200 transition-all flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {assessment.category}
                    </span>
                    <Badge variant={assessment.targetProficiency === 'Expert' ? 'success' : 'primary'} className="text-[10px]">
                      {assessment.targetProficiency}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">{assessment.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{assessment.description}</p>
                </div>

                {/* Specs */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Questions</p>
                    <p className="font-bold text-slate-800">{assessment.questionsCount || assessment.questions.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Duration</p>
                    <p className="font-bold text-slate-800">{assessment.durationMinutes}m</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Pass Score</p>
                    <p className="font-bold text-emerald-600">{assessment.passingScorePercentage}%</p>
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    <span>{assessmentAttempts.length} Attempts • <b>{passedCount} Passed</b></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 px-2"
                      onClick={() => setSelectedAssessmentToInspect(assessment)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Inspect
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAssessment(assessment.id, assessment.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete assessment"
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

      {/* MODAL 1: Author New Assessment with Dynamic Question Builder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Author Skill Assessment</h3>
                  <p className="text-xs text-slate-500">Create questions with instant deterministic verification</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="p-6 space-y-6">
              {/* Assessment Meta */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Assessment Configuration</h4>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assessment Title <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Enterprise PostgreSQL & Query Tuning Assessment"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Skill Taxonomy
                    </label>
                    <Select
                      value={newSkillName}
                      onChange={(e) => {
                        setNewSkillName(e.target.value);
                        const match = taxonomy.find(t => t.name === e.target.value);
                        if (match) setNewCategory(match.category);
                      }}
                      options={taxonomy.map(t => ({ value: t.name, label: `${t.name} (${t.category})` }))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Proficiency
                    </label>
                    <Select
                      value={newProficiency}
                      onChange={(e) => setNewProficiency(e.target.value as any)}
                      options={[
                        { value: 'Beginner', label: 'Beginner' },
                        { value: 'Intermediate', label: 'Intermediate' },
                        { value: 'Advanced', label: 'Advanced' },
                        { value: 'Expert', label: 'Expert' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Duration (Minutes)
                    </label>
                    <Input
                      type="number"
                      value={newDuration}
                      onChange={(e) => setNewDuration(parseInt(e.target.value) || 15)}
                      min={5}
                      max={60}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assessment Description
                  </label>
                  <Textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={2}
                    placeholder="Provide candidate syllabus context and prerequisites..."
                  />
                </div>
              </div>

              {/* Dynamic Questions Builder */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Question Bank ({questions.length} Questions)
                  </h4>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={handleAddQuestion}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Question
                  </Button>
                </div>

                <div className="space-y-4">
                  {questions.map((q, qIndex) => (
                    <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Question #{qIndex + 1}</span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIndex)}
                            className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>

                      <Textarea
                        value={q.questionText}
                        onChange={(e) => handleUpdateQuestion(qIndex, 'questionText', e.target.value)}
                        placeholder="Enter question prompt..."
                        rows={2}
                        required
                      />

                      {/* 4 Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-opt-${q.id}`}
                              checked={q.correctOptionIndex === optIdx}
                              onChange={() => handleUpdateQuestion(qIndex, 'correctOptionIndex', optIdx)}
                              className="text-indigo-600 focus:ring-indigo-500"
                              title="Mark as correct answer"
                            />
                            <Input
                              value={opt}
                              onChange={(e) => handleUpdateOption(qIndex, optIdx, e.target.value)}
                              placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                              className="text-xs py-1.5"
                              required
                            />
                          </div>
                        ))}
                      </div>

                      {/* Explanation */}
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          Post-Submission Answer Explanation (Visible after completion)
                        </label>
                        <Input
                          value={q.explanation || ''}
                          onChange={(e) => handleUpdateQuestion(qIndex, 'explanation', e.target.value)}
                          placeholder="Why this answer is correct..."
                          className="text-xs py-1.5"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 sticky bottom-0 bg-white">
                <Button size="sm" variant="outline" type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit" leftIcon={<CheckSquare className="w-4 h-4" />}>
                  Publish Assessment to Repository
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Inspect Questions */}
      {selectedAssessmentToInspect && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedAssessmentToInspect.title}</h3>
                <p className="text-xs text-slate-500">{selectedAssessmentToInspect.skillName} • {selectedAssessmentToInspect.targetProficiency}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssessmentToInspect(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedAssessmentToInspect.questions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Q{idx + 1}. {q.questionText}</span>
                    <Badge variant="default" className="text-[10px]">{q.difficulty}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 ${
                          optIdx === q.correctOptionIndex
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                        {optIdx === q.correctOptionIndex && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100 mt-2">
                      <b className="text-slate-700">Explanation:</b> {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
