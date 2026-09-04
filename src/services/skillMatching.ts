import { StudentSkill, ProficiencyLevel, SkillMatchResult } from '../types';

const PROFICIENCY_RANK: Record<ProficiencyLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4
};

const PROFICIENCY_SCORE: Record<ProficiencyLevel, number> = {
  Beginner: 25,
  Intermediate: 50,
  Advanced: 75,
  Expert: 100
};

export const CANDIDATE_MATCH_THRESHOLD = 80;

export interface RequiredSkillSpec {
  skillName: string;
  proficiency: ProficiencyLevel;
  mandatory: boolean;
}

const normalizeSkillName = (name: string): string => {
  const normalized = name.trim().toLowerCase().replace(/[./_&+-]+/g, ' ').replace(/\s+/g, ' ');
  const aliases: Record<string, string> = {
    react: 'react',
    'react js': 'react',
    'reactjs': 'react',
    node: 'node',
    'node js': 'node',
    'nodejs': 'node',
    ml: 'machine learning',
    'machine learning': 'machine learning',
    dl: 'deep learning',
    'deep learning': 'deep learning',
    sql: 'sql',
    postgresql: 'sql',
    'sql postgresql': 'sql',
    'sql postgres': 'sql',
    communication: 'communication',
    teamwork: 'teamwork',
    leadership: 'leadership',
    'problem solving': 'problem solving'
  };
  return aliases[normalized] || normalized;
};

export function calculateSkillMatch(
  studentSkills: (StudentSkill | { name: string; proficiency: ProficiencyLevel })[],
  requiredSkills: RequiredSkillSpec[]
): SkillMatchResult {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      scorePercentage: 100,
      matchedCount: 0,
      totalRequired: 0,
      matchedSkills: [],
      improvementSkills: [],
      missingSkills: [],
      explanation: 'No specific skill prerequisites are defined for this opportunity. All applicants with relevant background are welcome to apply.',
      recommendations: ['Highlight your past academic projects and relevant coursework.']
    };
  }

  // Normalize student skill lookup map (lowercase name for case-insensitive matching)
  const studentSkillMap = new Map<string, ProficiencyLevel>();
  for (const s of studentSkills) {
    studentSkillMap.set(normalizeSkillName(s.name), s.proficiency);
  }

  const matchedSkills: SkillMatchResult['matchedSkills'] = [];
  const improvementSkills: SkillMatchResult['improvementSkills'] = [];
  const missingSkills: SkillMatchResult['missingSkills'] = [];

  let totalWeight = 0;
  let earnedScore = 0;

  for (const req of requiredSkills) {
    const reqNameLower = normalizeSkillName(req.skillName);
    const weight = req.mandatory ? 1.5 : 1.0;
    totalWeight += weight;

    let studentProficiency: ProficiencyLevel | undefined = studentSkillMap.get(reqNameLower);
    
    if (!studentProficiency) {
      for (const [sName, sProf] of studentSkillMap.entries()) {
        if (sName.includes(reqNameLower) || reqNameLower.includes(sName)) {
          studentProficiency = sProf;
          break;
        }
      }
    }

    if (studentProficiency) {
      const studentScore = PROFICIENCY_SCORE[studentProficiency] || 25;
      const requiredScore = PROFICIENCY_SCORE[req.proficiency] || 25;
      const normalizedRatio = Math.max(0, Math.min(1, studentScore / requiredScore));

      if (studentScore >= requiredScore) {
        earnedScore += weight * 1.0;
        matchedSkills.push({
          name: req.skillName,
          studentProficiency,
          requiredProficiency: req.proficiency,
          mandatory: req.mandatory
        });
      } else {
        earnedScore += weight * Math.max(0.3, normalizedRatio);
        improvementSkills.push({
          name: req.skillName,
          studentProficiency,
          requiredProficiency: req.proficiency,
          mandatory: req.mandatory
        });
      }
    } else {
      missingSkills.push({
        name: req.skillName,
        requiredProficiency: req.proficiency,
        mandatory: req.mandatory
      });
    }
  }

  const scorePercentage = totalWeight > 0 ? Math.min(100, Math.max(0, Math.round((earnedScore / totalWeight) * 100))) : 0;
  const matchedCount = matchedSkills.length;
  const totalRequired = requiredSkills.length;

  // Generate deterministic explanation
  let explanation = '';
  if (scorePercentage >= 85) {
    explanation = `High Profile Match (${scorePercentage}%). You meet or exceed ${matchedCount} of ${totalRequired} core skill requirements. Your profile demonstrates strong qualification for direct shortlisting.`;
  } else if (scorePercentage >= 65) {
    explanation = `Moderate Profile Match (${scorePercentage}%). You have foundational competencies for this role, matching ${matchedCount} requirements. Addressing ${improvementSkills.length + missingSkills.length} skill gaps will solidify your application.`;
  } else {
    explanation = `Developing Profile Match (${scorePercentage}%). You currently meet ${matchedCount} of ${totalRequired} requirements. Upgrading missing prerequisites will significantly elevate your interview readiness.`;
  }

  // Generate actionable recommendations
  const recommendations: string[] = [];
  if (missingSkills.length > 0) {
    const missingNames = missingSkills.slice(0, 2).map(s => s.name).join(', ');
    recommendations.push(`Add & verify prerequisite knowledge in ${missingNames} via skill assessment.`);
  }
  if (improvementSkills.length > 0) {
    const improveNames = improvementSkills.slice(0, 2).map(s => `${s.name} (${s.studentProficiency} → ${s.requiredProficiency})`).join(', ');
    recommendations.push(`Level up your proficiency in ${improveNames} through hands-on projects.`);
  }
  if (scorePercentage >= 80) {
    recommendations.push('Submit your application directly and attach your verified skill assessment certificates.');
  }

  return {
    scorePercentage,
    matchedCount,
    totalRequired,
    matchedSkills,
    improvementSkills,
    missingSkills,
    explanation,
    recommendations
  };
}
