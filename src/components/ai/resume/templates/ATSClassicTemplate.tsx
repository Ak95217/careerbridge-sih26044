import React from 'react';
import { ResumeContent } from '../../../../types';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface TemplateProps {
  content: ResumeContent;
}

export const ATSClassicTemplate: React.FC<TemplateProps> = ({ content }) => {
  const { personalInfo, summary, skillGroups, experience, projects, education, certifications, achievements, sectionVisibility } = content;

  return (
    <div className="font-serif text-slate-900 bg-white leading-relaxed text-[13px] max-w-[800px] mx-auto p-8 shadow-sm print:shadow-none print:p-0 print:text-[12px]">
      {/* Header */}
      <header className="border-b-2 border-slate-900 pb-3 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
          {personalInfo.fullName || 'Full Name'}
        </h1>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-700">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-600 print:hidden" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-600 print:hidden" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-600 print:hidden" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedinUrl && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3 text-slate-600 print:hidden" />
              {personalInfo.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
          {personalInfo.githubUrl && (
            <span className="flex items-center gap-1">
              <Github className="w-3 h-3 text-slate-600 print:hidden" />
              {personalInfo.githubUrl.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
          {personalInfo.portfolioUrl && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-600 print:hidden" />
              {personalInfo.portfolioUrl.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {sectionVisibility?.summary && summary && (
        <section className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-slate-800 text-justify leading-normal">
            {summary}
          </p>
        </section>
      )}

      {/* Technical & Core Skills */}
      {sectionVisibility?.skills && skillGroups && skillGroups.length > 0 && (
        <section className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5">
            Technical Skills
          </h2>
          <div className="space-y-1">
            {skillGroups.map((group) => (
              <div key={group.id} className="text-xs">
                <span className="font-bold text-slate-900">{group.category}: </span>
                <span className="text-slate-800">{group.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {sectionVisibility?.education && education && education.length > 0 && (
        <section className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">
                    {edu.institution}
                  </span>
                  <span className="text-xs text-slate-700 italic">
                    {edu.startYear} – {edu.endYear}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-slate-800">
                  <span>
                    {edu.degree} in {edu.fieldOfStudy}
                  </span>
                  {edu.grade && (
                    <span className="font-semibold text-slate-900">
                      Score: {edu.grade}
                    </span>
                  )}
                </div>
                {edu.highlights && edu.highlights.length > 0 && (
                  <div className="text-[11px] text-slate-700 mt-0.5">
                    Coursework: {edu.highlights.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience / Internships */}
      {sectionVisibility?.experience && experience && experience.length > 0 && (
        <section className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5">
            Work & Internship Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">
                    {exp.role} — <span className="font-normal italic">{exp.organization}</span>
                  </span>
                  <span className="text-xs text-slate-700 italic">
                    {exp.duration}
                  </span>
                </div>
                {exp.location && (
                  <div className="text-[11px] text-slate-600">{exp.location}</div>
                )}
                <ul className="list-disc list-inside mt-1 space-y-1 text-slate-800 text-xs">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="leading-snug">
                      <span className="-ml-1">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {sectionVisibility?.projects && projects && projects.length > 0 && (
        <section className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5">
            Technical Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">
                    {proj.title}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="font-normal italic text-slate-700"> | {proj.technologies.join(', ')}</span>
                    )}
                  </span>
                  {(proj.githubUrl || proj.liveUrl) && (
                    <span className="text-[11px] text-slate-700">
                      {proj.githubUrl && <span>GitHub</span>}
                      {proj.githubUrl && proj.liveUrl && <span> • </span>}
                      {proj.liveUrl && <span>Live Demo</span>}
                    </span>
                  )}
                </div>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-800 text-xs">
                  {proj.bullets.map((b, idx) => (
                    <li key={idx} className="leading-snug">
                      <span className="-ml-1">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {sectionVisibility?.certifications && certifications && certifications.length > 0 && (
        <section className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5">
            Certifications & Credentials
          </h2>
          <div className="space-y-1">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline text-xs">
                <span className="text-slate-900">
                  <span className="font-bold">{cert.title}</span> – {cert.issuer}
                  {cert.credentialId && <span className="text-slate-600 italic"> (ID: {cert.credentialId})</span>}
                </span>
                <span className="text-slate-700 italic">{cert.issueDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {sectionVisibility?.achievements && achievements && achievements.length > 0 && (
        <section className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5">
            Honors & Achievements
          </h2>
          <div className="space-y-1">
            {achievements.map((ach) => (
              <div key={ach.id} className="text-xs">
                <span className="font-bold text-slate-900">{ach.title}: </span>
                <span className="text-slate-800">{ach.description}</span>
                {ach.year && <span className="text-slate-600 italic"> ({ach.year})</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
