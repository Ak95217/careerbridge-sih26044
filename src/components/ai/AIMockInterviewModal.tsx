import React, { useState, useEffect } from 'react';
import { 
  AIInterviewQuestion, 
  AIMockInterviewSession, 
  StudentProfile, 
  Opportunity 
} from '../../types';
import { AIService } from '../../services/aiService';
import { StorageService } from '../../services/storage';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Send, 
  Mic, 
  RefreshCw, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  TrendingUp,
  Brain,
  MessageSquareCode,
  ShieldAlert,
  Play
} from 'lucide-react';

interface AIMockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  targetRole?: string;
  opportunity?: Opportunity;
}

export const AIMockInterviewModal: React.FC<AIMockInterviewModalProps> = ({
  isOpen,
  onClose,
  student,
  targetRole = student.targetRole || student.careerGoal || 'Software Engineer',
  opportunity
}) => {
  const [mode, setMode] = useState<'bank' | 'interactive'>('bank');
  const [selectedRole, setSelectedRole] = useState(targetRole);
  const [difficulty, setDifficulty] = useState<'Junior' | 'Mid' | 'Senior'>('Junior');
  const [questions, setQuestions] = useState<AIInterviewQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  // Interactive Session State
  const [session, setSession] = useState<AIMockInterviewSession | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [showHintIndex, setShowHintIndex] = useState<number>(-1);

  useEffect(() => {
    if (isOpen) {
      handleGenerateQuestionBank();
    }
  }, [isOpen, selectedRole, difficulty]);

  const handleGenerateQuestionBank = async () => {
    setIsLoadingQuestions(true);
    try {
      const qList = await AIService.generateInterviewPrep({
        targetRole: selectedRole,
        opportunityTitle: opportunity?.title,
        difficulty,
        studentSkills: student.skills,
        studentProjects: student.projects,
        companyName: opportunity?.companyName || 'Tech Enterprise'
      });
      setQuestions(qList);
      if (qList.length > 0) {
        setExpandedQId(qList[0].id);
      }
    } catch (err) {
      console.error('Error generating interview questions:', err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const startInteractiveSession = () => {
    if (questions.length === 0) return;

    const newSession: AIMockInterviewSession = {
      id: `mock-sess-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      targetRole: selectedRole,
      opportunityTitle: opportunity?.title,
      difficulty,
      totalQuestions: Math.min(4, questions.length),
      currentQuestionIndex: 0,
      createdAt: new Date().toISOString(),
      turns: [],
      status: 'In Progress'
    };

    setSession(newSession);
    setCurrentQIndex(0);
    setStudentAnswer('');
    setShowHintIndex(-1);
    setMode('interactive');
  };

  const handleSendAnswer = async () => {
    if (!studentAnswer.trim() || !session || questions.length === 0) return;

    const activeQuestion = questions[currentQIndex]?.question || 'Explain your technical approach.';
    setIsSubmittingAnswer(true);

    try {
      const evalResult = await AIService.submitMockInterviewTurn({
        conversationHistory: session.turns,
        targetRole: selectedRole,
        currentQuestion: activeQuestion,
        studentAnswer: studentAnswer.trim(),
        questionIndex: currentQIndex + 1,
        totalQuestions: session.totalQuestions
      });

      const newTurn = {
        questionId: questions[currentQIndex]?.id || `q-${currentQIndex}`,
        question: activeQuestion,
        studentAnswer: studentAnswer.trim(),
        feedback: evalResult.feedback,
        followUpQuestion: evalResult.followUpQuestion
      };

      const updatedTurns = [...session.turns, newTurn];
      const isComplete = currentQIndex + 1 >= session.totalQuestions || evalResult.isCompleted;

      const updatedSession: AIMockInterviewSession = {
        ...session,
        turns: updatedTurns,
        completedQuestions: updatedTurns.length,
        status: isComplete ? 'Completed' : 'InProgress',
        overallScore: isComplete ? evalResult.overallScore || 85 : undefined,
        performanceSummary: isComplete ? evalResult.performanceSummary || 'Great demonstration of core computer science fundamentals.' : undefined,
        strengthsSummary: evalResult.strengthsSummary || ['Clear communication', 'Technical accuracy'],
        growthAreas: evalResult.growthAreas || ['Deepen trade-off analysis']
      };

      setSession(updatedSession);
      StorageService.saveMockInterviewSession(updatedSession);

      if (!isComplete) {
        setCurrentQIndex(prev => prev + 1);
        setStudentAnswer('');
        setShowHintIndex(-1);
      }
    } catch (err) {
      console.error('Error submitting answer turn:', err);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="mock-interview-modal"
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">AI Technical & Placement Mock Interview</h3>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Real-Time AI Evaluation
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Target Role: <span className="font-semibold text-slate-800">{selectedRole}</span> {opportunity ? `• ${opportunity.companyName}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Nav Bar */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-bold">
            <button
              onClick={() => setMode('bank')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                mode === 'bank' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageSquareCode className="w-4 h-4" />
              Question Bank & Model Answers ({questions.length})
            </button>

            <button
              onClick={startInteractiveSession}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                mode === 'interactive' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Play className="w-4 h-4" />
              Live Interactive Simulation {session?.status === 'InProgress' ? '• (In Progress)' : ''}
            </button>
          </div>

          {/* Difficulty selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">Difficulty:</span>
            {(['Junior', 'Mid', 'Senior'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`text-[11px] font-bold px-2 py-0.5 rounded transition-colors ${
                  difficulty === d 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/40">
          {/* MODE 1: QUESTION BANK */}
          {mode === 'bank' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Customized Placement Question Set</h4>
                  <p className="text-xs text-slate-500">
                    Questions generated based on your profile skills {student.skills.length > 0 ? `(${student.skills.slice(0, 3).map(s => s.name).join(', ')})` : ''} and projects {student.projects.length > 0 ? `(${student.projects[0]?.title})` : ''}.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateQuestionBank}
                    disabled={isLoadingQuestions}
                    className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingQuestions ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>

                  <button
                    onClick={startInteractiveSession}
                    className="text-xs font-bold px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Start Live Mock
                  </button>
                </div>
              </div>

              {isLoadingQuestions ? (
                <div className="py-16 text-center space-y-3 bg-white rounded-xl border border-slate-200">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">Synthesizing Technical & Project Scenarios</h4>
                  <p className="text-xs text-slate-500">Consulting industry hiring rubrics for {selectedRole}...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions.map((q, idx) => {
                    const isExpanded = expandedQId === q.id;

                    return (
                      <div
                        key={q.id}
                        id={`interview-q-${q.id}`}
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-all"
                      >
                        <div 
                          onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                          className="p-4 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50/50"
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  q.type === 'Technical' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : q.type === 'Project-Based' 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {q.type}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500">
                                  Context: {q.relatedSkillOrProject}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">
                                {q.question}
                              </h4>
                            </div>
                          </div>

                          <button className="text-slate-400 mt-1">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/40 space-y-3 text-xs animate-in fade-in">
                            {/* Progressive Hints */}
                            <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-100 space-y-1">
                              <span className="text-[10px] font-bold text-amber-900 uppercase flex items-center gap-1">
                                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                                Interviewer Progressive Hints
                              </span>
                              <ul className="space-y-1 pt-1">
                                {q.hints.map((h, hIdx) => (
                                  <li key={hIdx} className="text-xs text-amber-950 flex items-start gap-1.5">
                                    <span className="text-amber-600 font-bold">•</span>
                                    <span>{h}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Model Answer Guidance */}
                            <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-100 space-y-1">
                              <span className="text-[10px] font-bold text-emerald-900 uppercase flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                High-Scoring Answer Key Points
                              </span>
                              <ul className="space-y-1 pt-1">
                                {q.modelAnswerGuidance.map((m, mIdx) => (
                                  <li key={mIdx} className="text-xs text-emerald-950 flex items-start gap-1.5">
                                    <span className="text-emerald-600 font-bold">•</span>
                                    <span>{m}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Follow up probes */}
                            {q.followUpQuestions && q.followUpQuestions.length > 0 && (
                              <div className="text-[11px] text-slate-500 pt-1">
                                <span className="font-bold text-slate-700 block mb-1">Common Follow-up Probes:</span>
                                <div className="space-y-1">
                                  {q.followUpQuestions.map((f, fIdx) => (
                                    <p key={fIdx} className="italic text-slate-600 pl-2 border-l-2 border-slate-300">
                                      "{f}"
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* MODE 2: LIVE INTERACTIVE SIMULATION */}
          {mode === 'interactive' && session && (
            <div className="space-y-6">
              {/* Session Progress Header */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    {session.status === 'Completed' ? '✓' : `${currentQIndex + 1}/${session.totalQuestions}`}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {session.status === 'Completed' ? 'Interview Completed' : `Live Question #${currentQIndex + 1}`}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Evaluating: Technical Accuracy, Depth & Communication Clarity
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700">
                    {Math.round((session.completedQuestions / session.totalQuestions) * 100)}% Complete
                  </span>
                </div>
              </div>

              {/* Final Completed Summary Screen */}
              {session.status === 'Completed' ? (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-700 flex flex-col items-center justify-center shrink-0">
                        <span className="text-2xl font-black">{session.overallScore || 84}</span>
                        <span className="text-[9px] font-bold uppercase">Overall</span>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Mock Interview Scorecard & Debrief</h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-lg">
                          {session.performanceSummary}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={startInteractiveSession}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Retake Mock Interview
                    </button>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-2">
                      <span className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Key Candidate Strengths
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {(session.strengthsSummary || ['Solid grasp of core language paradigms', 'Clear, organized verbal delivery']).map((s, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 space-y-2">
                      <span className="text-xs font-bold text-amber-800 uppercase flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Targeted Growth Areas
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {(session.growthAreas || ['Deepen distributed database scaling arguments', 'Provide concrete latency metrics']).map((g, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Past turns review */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase">Question-by-Question Detailed Feedback</h4>
                    {session.turns.map((turn, tIdx) => (
                      <div key={tIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900">Q{tIdx + 1}: {turn.question}</span>
                          <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {turn.feedback.technicalScore}/10 Tech
                          </span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs text-slate-700 italic">
                          "{turn.studentAnswer}"
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          <span className="font-bold text-slate-800">Feedback: </span>
                          {turn.feedback.feedbackNotes}
                        </p>
                        {turn.feedback.suggestedRefinement && (
                          <div className="bg-indigo-50/50 p-2 rounded text-[11px] text-indigo-950 border border-indigo-100">
                            <span className="font-bold">Staff Engineer Model Answer: </span>
                            {turn.feedback.suggestedRefinement}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Active Question Answering Screen */
                <div className="space-y-4">
                  {/* Current Active Question Card */}
                  <div className="bg-white border-2 border-indigo-200 rounded-xl p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                        Question {currentQIndex + 1} of {session.totalQuestions} • {questions[currentQIndex]?.type || 'Technical'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {questions[currentQIndex]?.relatedSkillOrProject}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-relaxed">
                      {questions[currentQIndex]?.question || 'Explain how you would architect this system for high availability.'}
                    </h3>

                    {/* Hint reveal button */}
                    {questions[currentQIndex]?.hints && (
                      <div className="pt-1">
                        {showHintIndex === -1 ? (
                          <button
                            onClick={() => setShowHintIndex(0)}
                            className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 underline"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            Need a hint? (Reveal interviewer guidance)
                          </button>
                        ) : (
                          <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-xs text-amber-950 animate-in fade-in">
                            <span className="font-bold">Interviewer Hint: </span>
                            {questions[currentQIndex].hints[showHintIndex]}
                            {showHintIndex < questions[currentQIndex].hints.length - 1 && (
                              <button
                                onClick={() => setShowHintIndex(prev => prev + 1)}
                                className="block mt-1 font-bold text-[10px] text-amber-800 underline"
                              >
                                Show next hint →
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Student Answer Text Area */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Your Response</label>
                      <span className="text-[11px] text-slate-400">{studentAnswer.split(/\s+/).filter(Boolean).length} words</span>
                    </div>

                    <textarea
                      rows={6}
                      value={studentAnswer}
                      onChange={e => setStudentAnswer(e.target.value)}
                      placeholder="Structure your answer clearly: Define the core concept, explain trade-offs, and reference concrete project patterns..."
                      className="w-full text-xs p-3.5 border border-slate-300 rounded-xl focus:outline-indigo-600 text-slate-800 leading-relaxed"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-slate-400">
                        💡 Tip: Use the STAR method for behavioral or project-based questions.
                      </p>

                      <button
                        onClick={handleSendAnswer}
                        disabled={isSubmittingAnswer || !studentAnswer.trim()}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        {isSubmittingAnswer ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Evaluating Response...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            {currentQIndex + 1 >= session.totalQuestions ? 'Submit Final Answer' : 'Submit & Next Question'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Recent Turn Feedback (if any previous turn) */}
                  {session.turns.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Previous Question Feedback</span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {session.turns[session.turns.length - 1].feedback.feedbackNotes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Simulated under standard Tier-1 technology campus placement rubrics.
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
