import { 
  AIResumeAnalysis, 
  AICareerRoadmap, 
  AILearningRecommendation, 
  AISkillGapIntelligence, 
  AIInterviewQuestion, 
  AIMockInterviewSession,
  StudentProfile,
  Opportunity,
  SkillMatchResult,
  ResumeContent,
  ResumeATSAnalysis,
  ResumeTemplateId
} from '../types';
import { StorageService } from './storage';

export const AIService = {
  // 1. Analyze Resume with Server-Side Gemini API
  async analyzeResume(params: { resumeText: string; fileName?: string; studentId: string }): Promise<AIResumeAnalysis> {
    const response = await fetch('/api/ai/resume-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to analyze resume with AI');
    }

    const data: AIResumeAnalysis = await response.json();
    // Persist to local storage database
    StorageService.saveResumeAnalysis(data);
    return data;
  },

  // 1b. Generate Structured Polished Resume Content from Verified Student Profile
  async generateResumeContent(params: {
    studentProfile: StudentProfile;
    targetRole: string;
    jobDescription?: string;
    template?: ResumeTemplateId;
  }): Promise<ResumeContent> {
    const response = await fetch('/api/ai/resume-builder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate resume with AI');
    }

    return await response.json();
  },

  // 1c. Polish / Improve a single project or experience bullet point
  async improveBulletPoint(params: {
    originalBullet: string;
    role?: string;
    context?: string;
  }): Promise<{ improvedBullets: string[]; reasoning: string }> {
    const response = await fetch('/api/ai/resume-builder/bullet-improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to improve bullet point');
    }

    return await response.json();
  },

  // 1d. Optimize Resume against Job Description and calculate ATS Score
  async optimizeResumeForJob(params: {
    resumeContent: ResumeContent;
    jobDescription: string;
    targetRole?: string;
  }): Promise<{
    atsScore: number;
    breakdown: any;
    matchingKeywords: string[];
    missingKeywords: string[];
    strengths: string[];
    actionableImprovements: string[];
  }> {
    const response = await fetch('/api/ai/resume-builder/job-optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to optimize resume against job description');
    }

    return await response.json();
  },

  // 2. Generate AI Career Roadmap
  async generateCareerRoadmap(params: {
    studentProfile: StudentProfile;
    targetRole: string;
    careerGoal?: string;
    skillGaps?: any[];
  }): Promise<AICareerRoadmap> {
    const response = await fetch('/api/ai/career-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate career roadmap');
    }

    const data: AICareerRoadmap = await response.json();
    StorageService.saveCareerRoadmap(data);
    return data;
  },

  // 3. Explain Deterministic Skill Gap Results with AI Reasoning
  async explainSkillGap(params: {
    targetRoleOrOpportunity: string;
    matchScore: number;
    requiredSkills: any[];
    matchedSkills: any[];
    improvementSkills: any[];
    missingSkills: any[];
    studentProfile?: StudentProfile;
  }): Promise<AISkillGapIntelligence> {
    const response = await fetch('/api/ai/skill-gap-explanation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to explain skill gap');
    }

    return await response.json();
  },

  // 4. Generate Targeted Learning Recommendations directly connected to skill gaps
  async generateLearningRecommendations(params: {
    missingSkills: any[];
    improvementSkills: any[];
    careerGoal: string;
    studentId: string;
  }): Promise<AILearningRecommendation[]> {
    const response = await fetch('/api/ai/learning-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate learning recommendations');
    }

    const data: AILearningRecommendation[] = await response.json();
    StorageService.saveLearningRecommendations(params.studentId, data);
    return data;
  },

  // 5. Explain Opportunity Recommendation
  async explainOpportunityRecommendation(params: {
    opportunity: Opportunity;
    studentSkills: any[];
    studentProjects: any[];
    matchResult?: SkillMatchResult;
  }): Promise<{
    opportunityId: string;
    opportunityTitle: string;
    companyName: string;
    explanationText: string;
    matchingStrengths: string[];
    missingRequirements: string[];
    recommendedAction: string;
  }> {
    const response = await fetch('/api/ai/recommendation-explanation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to explain opportunity recommendation');
    }

    return await response.json();
  },

  // 6. Generate AI Interview Preparation Questions
  async generateInterviewPrep(params: {
    targetRole: string;
    opportunityTitle?: string;
    difficulty?: string;
    studentSkills?: any[];
    studentProjects?: any[];
    companyName?: string;
  }): Promise<AIInterviewQuestion[]> {
    const response = await fetch('/api/ai/interview-prep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate interview questions');
    }

    return await response.json();
  },

  // 7. Submit Mock Interview Turn & Evaluate Answer
  async submitMockInterviewTurn(params: {
    conversationHistory: any[];
    targetRole: string;
    currentQuestion: string;
    studentAnswer: string;
    questionIndex: number;
    totalQuestions: number;
  }): Promise<{
    feedback: {
      relevanceScore: number;
      clarityScore: number;
      technicalScore: number;
      completenessScore: number;
      communicationScore: number;
      feedbackNotes: string;
      strengths: string[];
      missedKeyPoints: string[];
      suggestedRefinement: string;
    };
    followUpQuestion?: string;
    isCompleted: boolean;
    overallScore?: number;
    performanceSummary?: string;
    strengthsSummary?: string[];
    growthAreas?: string[];
  }> {
    const response = await fetch('/api/ai/mock-interview-turn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to evaluate interview response');
    }

    return await response.json();
  }
};
