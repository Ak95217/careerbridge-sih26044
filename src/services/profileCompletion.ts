import { StudentProfile } from '../types';

export function getMissingStudentProfileFields(student: Partial<StudentProfile>): string[] {
  const missing: string[] = [];
  const hasText = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

  if (!hasText(student.fullName) || student.fullName === 'Not provided') missing.push('Full Name');
  if (!hasText(student.email)) missing.push('Email');
  if (!hasText(student.phone)) missing.push('Phone Number');
  if (!hasText(student.collegeName) || student.collegeName === 'Not provided') missing.push('College / Institute');
  if (!hasText(student.degree)) missing.push('Degree');
  if (!hasText(student.branch)) missing.push('Branch / Specialization');
  if (!student.graduationYear || student.graduationYear <= 0 || student.graduationYear > 2030) missing.push('Graduation Year');
  if (!hasText(student.currentSemester) || !/^Semester [1-8]$/.test(student.currentSemester)) missing.push('Current Semester');
  if (typeof student.cgpa !== 'number' || student.cgpa <= 0 || student.cgpa > 10) missing.push('CGPA');
  if (!hasText(student.targetRole)) missing.push('Target Role');
  if (!hasText(student.careerDomain)) missing.push('Career Domain');
  if (!hasText(student.preferredWorkMode)) missing.push('Preferred Work Mode');
  if (!hasText(student.location)) missing.push('Location');
  if (!student.skills || student.skills.length === 0) missing.push('At least one Skill');

  return missing;
}

export function isStudentProfileComplete(student: Partial<StudentProfile>): boolean {
  return getMissingStudentProfileFields(student).length === 0;
}