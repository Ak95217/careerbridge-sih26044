import { StudentSkill, ProficiencyLevel, SkillMatchResult } from '../types';

const PROFICIENCY_RANK: Record<ProficiencyLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4
};

export interface RequiredSkillSpec {
  skillName: string;
  proficiency: ProficiencyLevel;
  mandatory: boolean;
}

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
    studentSkillMap.set(s.name.trim().toLowerCase(), s.proficiency);
  }

  const matchedSkills: SkillMatchResult['matchedSkills'] = [];
  const improvementSkills: SkillMatchResult['improvementSkills'] = [];
  const missingSkills: SkillMatchResult['missingSkills'] = [];

  let totalWeight = 0;
  let earnedScore = 0;

  for (const req of requiredSkills) {
    const reqNameLower = req.skillName.trim().toLowerCase();
    const weight = req.mandatory ? 1.5 : 1.0;
    totalWeight += weight;

    // Check if student possesses the skill (exact or partial name substring e.g. "React" matches "React.js")
    let studentProficiency: ProficiencyLevel | undefined = studentSkillMap.get(reqNameLower);
    
    if (!studentProficiency) {
      // Check for fuzzy / token inclusion e.g. "SQL" inside "SQL & PostgreSQL"
      for (const [sName, sProf] of studentSkillMap.entries()) {
        if (sName.includes(reqNameLower) || reqNameLower.includes(sName)) {
          studentProficiency = sProf;
          break;
        }
      }
    }

    if (studentProficiency) {
      const studentRank = PROFICIENCY_RANK[studentProficiency] || 1;
      const reqRank = PROFICIENCY_RANK[req.proficiency] || 1;

      if (studentRank >= reqRank) {
        // Full match
        earnedScore += weight * 1.0;
        matchedSkills.push({
          name: req.skillName,
          studentProficiency,
          requiredProficiency: req.proficiency,
          mandatory: req.mandatory
        });
      } else {
        // Needs improvement - partial credit based on rank ratio
        const partialRatio = Math.max(0.3, studentRank / reqRank);
        earnedScore += weight * partialRatio;
        improvementSkills.push({
          name: req.skillName,
          studentProficiency,
          requiredProficiency: req.proficiency,
          mandatory: req.mandatory
        });
      }
    } else {
      // Completely missing
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
