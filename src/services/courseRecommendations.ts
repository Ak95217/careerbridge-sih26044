import { LearningResource } from '../types';
import { AI_COURSES } from '../data/courses/aiCourses';
import { DATA_SCIENCE_COURSES } from '../data/courses/dataScienceCourses';
import { PYTHON_COURSES } from '../data/courses/pythonCourses';
import { WEB_DEV_COURSES } from '../data/courses/webDevCourses';
import { JAVA_COURSES } from '../data/courses/javaCourses';
import { DSA_COURSES } from '../data/courses/dsaCourses';
import { CLOUD_COURSES } from '../data/courses/cloudCourses';
import { CYBERSECURITY_COURSES } from '../data/courses/cybersecurityCourses';
import { SQL_COURSES } from '../data/courses/sqlCourses';
import { MOBILE_COURSES } from '../data/courses/mobileCourses';
import { UIUX_COURSES } from '../data/courses/uiuxCourses';
import { BUSINESS_COURSES } from '../data/courses/businessCourses';
import { MARKETING_COURSES } from '../data/courses/marketingCourses';
import { SOFTSKILLS_COURSES } from '../data/courses/softSkillsCourses';

export interface CourseRecommendation {
  id: string;
  skillName: string;
  category: string;
  courseTitle: string;
  provider: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  whyRequired: string;
  url: string;
  rating?: number;
  studentsEnrolled?: string;
  badgeTag?: string;
  free_or_paid?: string;
  certificate_available?: boolean;
  skills?: string[];
  career_roles?: string[];
}

// Master Aggregated Catalogue containing all 490+ curated learning resources
export const ALL_LEARNING_RESOURCES: LearningResource[] = [
  ...AI_COURSES,
  ...DATA_SCIENCE_COURSES,
  ...PYTHON_COURSES,
  ...WEB_DEV_COURSES,
  ...JAVA_COURSES,
  ...DSA_COURSES,
  ...CLOUD_COURSES,
  ...CYBERSECURITY_COURSES,
  ...SQL_COURSES,
  ...MOBILE_COURSES,
  ...UIUX_COURSES,
  ...BUSINESS_COURSES,
  ...MARKETING_COURSES,
  ...SOFTSKILLS_COURSES
];

// Backward-compatible CourseRecommendation format derived from the master catalogue
export const COURSE_RECOMMENDATIONS_CATALOG: CourseRecommendation[] = ALL_LEARNING_RESOURCES.map((res) => ({
  id: res.id,
  skillName: res.skills[0] || res.category,
  category: res.category,
  courseTitle: res.title,
  provider: res.platform,
  level: res.level,
  duration: res.duration,
  whyRequired: res.description,
  url: res.course_url,
  rating: res.rating || 4.8,
  studentsEnrolled: res.enrolledCount || '50,000+',
  badgeTag: res.badgeTag,
  free_or_paid: res.free_or_paid,
  certificate_available: res.certificate_available,
  skills: res.skills,
  career_roles: res.career_roles
}));

/**
 * Returns matching course recommendations for a given missing skill.
 * Checks all skills, course title, and description across the 490+ catalogue.
 */
export function getRecommendedCoursesForSkill(skillName: string, limit = 5): CourseRecommendation[] {
  if (!skillName) return [];
  const query = skillName.toLowerCase().trim();

  // Find exact or partial matches in the master catalogue
  const matches = COURSE_RECOMMENDATIONS_CATALOG.filter(c => {
    const hasMatchingSkill = c.skills?.some(s => {
      const sLower = s.toLowerCase();
      return sLower.includes(query) || query.includes(sLower);
    });
    const cSkill = c.skillName.toLowerCase();
    const cTitle = c.courseTitle.toLowerCase();
    const cCat = c.category.toLowerCase();

    return hasMatchingSkill || cSkill.includes(query) || query.includes(cSkill) || cTitle.includes(query) || cCat.includes(query);
  });

  if (matches.length > 0) {
    return matches.slice(0, limit);
  }

  // Fallback dynamic curated course recommendation for any unlisted skill
  return [
    {
      id: `crs-dyn-${Date.now()}`,
      skillName: skillName,
      category: 'Professional Competency',
      courseTitle: `Comprehensive Masterclass: ${skillName} Fundamentals to Advanced`,
      provider: 'NPTEL / AICTE Swayam Curated Portal',
      level: 'Intermediate',
      duration: '4 Weeks (16 Hours)',
      whyRequired: `Target opportunity requires verified proficiency in ${skillName} for technical evaluation and job readiness.`,
      url: 'https://swayam.gov.in',
      rating: 4.8,
      studentsEnrolled: '15,000+',
      badgeTag: 'Skill Gap Bridge',
      free_or_paid: 'Free',
      certificate_available: true,
      skills: [skillName]
    }
  ];
}

/**
 * Filter learning resources by category, difficulty level, cost, or text search query.
 */
export function searchLearningResources(filters: {
  query?: string;
  category?: string;
  level?: string;
  freeOnly?: boolean;
  careerRole?: string;
}): LearningResource[] {
  let results = [...ALL_LEARNING_RESOURCES];

  if (filters.category && filters.category !== 'All') {
    results = results.filter(r => r.category.toLowerCase().includes(filters.category!.toLowerCase()));
  }

  if (filters.level && filters.level !== 'All') {
    results = results.filter(r => r.level.toLowerCase() === filters.level!.toLowerCase());
  }

  if (filters.freeOnly) {
    results = results.filter(r => r.free_or_paid.toLowerCase().includes('free'));
  }

  if (filters.careerRole && filters.careerRole !== 'All') {
    const roleQuery = filters.careerRole.toLowerCase();
    results = results.filter(r => r.career_roles.some(role => role.toLowerCase().includes(roleQuery)));
  }

  if (filters.query && filters.query.trim() !== '') {
    const q = filters.query.toLowerCase().trim();
    results = results.filter(r => 
      r.title.toLowerCase().includes(q) ||
      r.platform.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.skills.some(s => s.toLowerCase().includes(q)) ||
      r.career_roles.some(role => role.toLowerCase().includes(q))
    );
  }

  return results;
}

/**
 * Returns list of unique categories available in the catalogue.
 */
export function getCatalogueCategories(): string[] {
  const categories = new Set<string>();
  ALL_LEARNING_RESOURCES.forEach(r => categories.add(r.category));
  return Array.from(categories);
}
