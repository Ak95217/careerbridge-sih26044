import React from 'react';
import { ResumeContent } from '../../../../types';

interface TemplateProps {
  content: ResumeContent;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ content }) => {
  const { personalInfo, summary, skillGroups, experience, projects, education, certifications, achievements, sectionVisibility } = content;

  return (
    <div className="font-sans text-stone-900 bg-white leading-relaxed text-[13px] max-w-[800px] mx-auto p-8 shadow-sm print:shadow-none print:p-0 print:text-[12px]">
      {/* Header */}
      <header className="pb-4 border-b border-stone-300">
        <h1 className="text-3xl font-light tracking-tight text-stone-900">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600 font-light">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedinUrl && <span>• {personalInfo.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}</span>}
          {personalInfo.githubUrl && <span>• {personalInfo.githubUrl.replace(/^https?:\/\/(www\.)?/, '')}</span>}
          {personalInfo.portfolioUrl && <span>• {personalInfo.portfolioUrl.replace(/^https?:\/\/(www\.)?/, '')}</span>}
        </div>
      </header>

      {/* Professional Summary */}
      {sectionVisibility?.summary && summary && (
        <section className="mt-5">
          <div className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase mb-1">
            About
          </div>
          <p className="text-stone-700 leading-normal text-xs">
            {summary}
          </p>
        </section>
      )}

      {/* Skills */}
      {sectionVisibility?.skills && skillGroups && skillGroups.length > 0 && (
        <section className="mt-5">
          <div className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase mb-2">
            Expertise
          </div>
          <div className="space-y-1 text-xs">
            {skillGroups.map((g) => (
              <div key={g.id} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                <span className="font-medium text-stone-900 w-44 shrink-0">{g.category}</span>
                <span className="text-stone-600">{g.skills.join(' · ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {sectionVisibility?.experience && experience && experience.length > 0 && (
        <section className="mt-5">
          <div className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase mb-2">
            Experience
          </div>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-stone-900 text-xs">
                    {exp.role}, <span className="font-normal text-stone-700">{exp.organization}</span>
                  </span>
                  <span className="text-xs text-stone-500 font-light">{exp.duration}</span>
                </div>
                <ul className="mt-1 space-y-1 text-stone-600 text-xs list-disc list-inside">
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
        <section className="mt-5">
          <div className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase mb-2">
            Selected Work
          </div>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-stone-900 text-xs">
                    {proj.title}
                  </span>
                  {(proj.githubUrl || proj.liveUrl) && (
                    <span className="text-[11px] text-stone-500 font-light">
                      {proj.githubUrl && <span>Code</span>}
                      {proj.githubUrl && proj.liveUrl && <span> / </span>}
                      {proj.liveUrl && <span>Demo</span>}
                    </span>
                  )}
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="text-[11px] text-stone-500 italic">
                    {proj.technologies.join(' · ')}
                  </div>
                )}
                <ul className="mt-1 space-y-0.5 text-stone-600 text-xs list-disc list-inside">
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

      {/* Education */}
      {sectionVisibility?.education && education && education.length > 0 && (
        <section className="mt-5">
          <div className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase mb-2">
            Education
          </div>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <div className="font-semibold text-stone-900">{edu.institution}</div>
                  <div className="text-stone-600">{edu.degree} in {edu.fieldOfStudy}</div>
                </div>
                <div className="text-right">
                  <div className="text-stone-500 font-light">{edu.startYear} – {edu.endYear}</div>
                  {edu.grade && <div className="font-medium text-stone-800">{edu.grade}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {sectionVisibility?.certifications && certifications && certifications.length > 0 && (
          <section>
            <div className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase mb-1.5">
              Certifications
            </div>
            <div className="space-y-1 text-xs text-stone-700">
              {certifications.map((c) => (
                <div key={c.id}>
                  <span className="font-medium text-stone-900">{c.title}</span> – {c.issuer} ({c.issueDate})
                </div>
              ))}
            </div>
          </section>
        )}

        {sectionVisibility?.achievements && achievements && achievements.length > 0 && (
          <section>
            <div className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase mb-1.5">
              Honors
            </div>
            <div className="space-y-1 text-xs text-stone-700">
              {achievements.map((a) => (
                <div key={a.id}>
                  <span className="font-medium text-stone-900">{a.title}:</span> {a.description}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
