import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { getProficiencyFromScore } from '../../services/assessmentData';
import { 
  StudentProfile, 
  SkillAssessment, 
  AssessmentAttempt, 
  AssessmentQuestion 
} from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Badge, ProficiencyBadge } from '../common/Badge';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  History, 
  Check, 
  Sparkles,
  BookOpen,
  AlertCircle
} from 'lucide-react';

interface SkillAssessmentViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const SkillAssessmentView: React.FC<SkillAssessmentViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const student = user as StudentProfile;

  const [activeTab, setActiveTab] = useState<'catalog' | 'active' | 'results' | 'history'>('catalog');
  const [assessments, setAssessments] = useState<SkillAssessment[]>(() => StorageService.getAssessments());
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>(() => StorageService.getAssessmentAttempts(student?.id));

  // Active Quiz State
  const [selectedAssessment, setSelectedAssessment] = useState<SkillAssessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(600);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedAttempt, setCompletedAttempt] = useState<AssessmentAttempt | null>(null);

  // Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTab === 'active' && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            handleSubmitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTab, timeLeftSeconds]);

  const handleStartAssessment = (assessment: SkillAssessment) => {
    setSelectedAssessment(assessment);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeLeftSeconds(assessment.durationMinutes * 60);
    setActiveTab('active');
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitAssessment = () => {
    if (!selectedAssessment || !student) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Deterministic scoring on backend/service logic
      let correctCount = 0;
      const questionAnswers = selectedAssessment.questions.map(q => {
        const selected = userAnswers[q.id] !== undefined ? userAnswers[q.id] : -1;
        const isCorrect = selected === q.correctOptionIndex;
        if (isCorrect) correctCount++;
        return {
          questionId: q.id,
          selectedOptionIndex: selected,
          isCorrect
        };
      });

      const totalQuestions = selectedAssessment.questions.length;
      const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
      const passed = scorePercentage >= selectedAssessment.passingScorePercentage;
      const evaluatedProficiency = getProficiencyFromScore(scorePercentage);

      const attempt: AssessmentAttempt = {
        id: `att-${Date.now()}`,
        studentId: student.id,
        assessmentId: selectedAssessment.id,
        skillName: selectedAssessment.skillName,
        scorePercentage,
        passed,
        evaluatedProficiency,
        completedAt: new Date().toISOString(),
        answers: questionAnswers
      };

      StorageService.saveAssessmentAttempt(attempt);
      setAttempts(StorageService.getAssessmentAttempts(student.id));
      setCompletedAttempt(attempt);
      setIsSubmitting(false);
      setActiveTab('results');

      if (passed) {
        addToast('success', 'Assessment Passed! 🎉', `You scored ${scorePercentage}% in ${selectedAssessment.skillName} and earned a verified ${evaluatedProficiency} credential.`);
      } else {
        addToast('info', 'Assessment Completed', `You scored ${scorePercentage}%. Review explanations and retake when ready.`);
      }
    }, 600);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Verified Skill Assessment Engine</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Demonstrate verified industry readiness with proctored technical evaluations. Top corporate recruiters prioritize candidates with verified assessment badges.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'catalog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Assessment Catalog
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Attempt History ({attempts.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ASSESSMENT CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {assessments.map((assessment) => {
              const latestAttempt = attempts.find(a => a.assessmentId === assessment.id || a.skillName === assessment.skillName);

              return (
                <Card key={assessment.id} className="flex flex-col justify-between hover:border-indigo-200 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div>
                        <Badge variant="purple" size="sm">{assessment.category}</Badge>
                        <h3 className="text-sm font-bold text-slate-900 mt-2">{assessment.title}</h3>
                        <p className="text-xs font-semibold text-indigo-600">{assessment.skillName}</p>
                      </div>

                      {latestAttempt?.passed && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{latestAttempt.scorePercentage}%</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {assessment.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{assessment.durationMinutes} Minutes</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>{assessment.totalQuestions} Questions</span>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => handleStartAssessment(assessment)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      {latestAttempt ? 'Retake Assessment' : 'Start Assessment'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE QUIZ RUNNER */}
      {activeTab === 'active' && selectedAssessment && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Quiz Header Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{selectedAssessment.title}</h3>
              <p className="text-xs text-slate-500">
                Question {currentQuestionIndex + 1} of {selectedAssessment.questions.length}
              </p>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold ${
              timeLeftSeconds < 120 ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-indigo-50 text-indigo-700'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all"
              style={{
                width: `${((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100}%`
              }}
            />
          </div>

          {/* Current Question Card */}
          {(() => {
            const currentQ = selectedAssessment.questions[currentQuestionIndex];
            const selectedOpt = userAnswers[currentQ.id];

            return (
              <Card>
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      Q{currentQuestionIndex + 1} • {currentQ.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 leading-relaxed">
                    {currentQ.questionText}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2.5 pt-2">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQ.id, optIdx)}
                          className={`w-full p-4 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center font-bold ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                      leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                    >
                      Previous
                    </Button>

                    {currentQuestionIndex < selectedAssessment.questions.length - 1 ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Next Question
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={isSubmitting}
                        onClick={handleSubmitAssessment}
                        rightIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Submit Assessment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </div>
      )}

      {/* VIEW 3: INSTANT RESULTS & EXPLANATIONS */}
      {activeTab === 'results' && completedAttempt && selectedAssessment && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Result Score Banner */}
          <div className={`p-6 rounded-2xl border shadow-xs text-center space-y-3 ${
            completedAttempt.passed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-amber-50/50 border-amber-200'
          }`}>
            <div className="inline-flex p-3 rounded-full bg-white shadow-xs">
              {completedAttempt.passed ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-amber-600" />
              )}
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              {completedAttempt.passed ? 'Assessment Passed! Verified Badge Awarded' : 'Assessment Completed'}
            </h3>

            <div className="flex items-center justify-center gap-4 text-xs">
              <span className="font-semibold text-slate-600">
                Score: <strong className="text-base text-slate-900">{completedAttempt.scorePercentage}%</strong>
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-600">
                Evaluated Level: <strong className="text-indigo-700">{completedAttempt.evaluatedProficiency}</strong>
              </span>
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your student profile and skill taxonomy have been automatically updated with this verified credential.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={() => setActiveTab('catalog')}>
                Return to Catalog
              </Button>
              <Button size="sm" variant="primary" onClick={() => onNavigateTab('gap-engine')}>
                Check Skill-Gap Fit
              </Button>
            </div>
          </div>

          {/* Detailed Question Review Breakdown */}
          <Card>
            <CardHeader>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Detailed Answers & Concept Explanations
              </h4>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {selectedAssessment.questions.map((q, idx) => {
                const answerRecord = completedAttempt.answers.find(a => a.questionId === q.id);
                const isCorrect = answerRecord?.isCorrect;

                return (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Question {idx + 1}</span>
                      {isCorrect ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Correct
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Incorrect
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-slate-900">{q.questionText}</p>

                    <div className="text-xs space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <p className="text-slate-600">
                        <strong>Correct Answer:</strong> {q.options[q.correctOptionIndex]}
                      </p>
                      {q.explanation && (
                        <p className="text-indigo-900 pt-1 text-[11px]">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* VIEW 4: ASSESSMENT ATTEMPT HISTORY */}
      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <h3 className="text-sm font-bold text-slate-900">Your Verified Assessment Attempts</h3>
              <span className="text-xs text-slate-400 font-medium">{attempts.length} attempts recorded</span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {attempts.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                No past assessment attempts. Take an evaluation from the catalog to build your verified transcript.
              </div>
            ) : (
              <div className="space-y-3">
                {attempts.map((att) => (
                  <div
                    key={att.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{att.skillName} Assessment</h4>
                        <Badge variant={att.passed ? 'success' : 'neutral'} size="sm">
                          {att.passed ? 'Passed' : 'Needs Practice'}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Completed on {new Date(att.completedAt).toLocaleDateString()} • Verified Level:{' '}
                        <strong className="text-indigo-700">{att.evaluatedProficiency}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-lg font-bold text-slate-900">{att.scorePercentage}%</span>
                        <span className="text-[10px] text-slate-400 block">Score</span>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const originalAssessment = assessments.find(a => a.id === att.assessmentId || a.skillName === att.skillName);
                          if (originalAssessment) {
                            handleStartAssessment(originalAssessment);
                          }
                        }}
                        leftIcon={<RotateCcw className="w-3 h-3" />}
                      >
                        Retake
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
