import React from 'react';
import { ResumeContent } from '../../../../types';
import { Terminal, Github, ExternalLink, Mail, Phone, MapPin, Linkedin, Globe, Cpu } from 'lucide-react';

interface TemplateProps {
  content: ResumeContent;
}

export const DeveloperTemplate: React.FC<TemplateProps> = ({ content }) => {
  const { personalInfo, summary, skillGroups, experience, projects, education, certifications, achievements, sectionVisibility } = content;

  return (
    <div className="font-sans text-slate-900 bg-white leading-relaxed text-[13px] max-w-[800px] mx-auto p-8 shadow-sm print:shadow-none print:p-0 print:text-[12px]">
      {/* Dev Header */}
      <header className="border-b-2 border-slate-800 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 font-mono">
              &gt; {personalInfo.fullName || 'Candidate Name'}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
            {personalInfo.githubUrl && (
              <span className="flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-slate-800 print:hidden" />
                {personalInfo.githubUrl.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
            )}
            {personalInfo.portfolioUrl && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-800 print:hidden" />
                {personalInfo.portfolioUrl.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 font-mono">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-500 print:hidden" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-500 print:hidden" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500 print:hidden" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedinUrl && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3 text-slate-500 print:hidden" />
              {personalInfo.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {sectionVisibility?.summary && summary && (
        <section className="mt-4">
          <div className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-slate-700 print:hidden" />
            // ABOUT_ENGINEER
          </div>
          <p className="text-slate-800 leading-normal text-xs text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Categorized Tech Stack */}
      {sectionVisibility?.skills && skillGroups && skillGroups.length > 0 && (
        <section className="mt-4">
          <div className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-slate-700 print:hidden" />
            // TECHNICAL_COMPETENCIES
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {skillGroups.map((g) => (
              <div key={g.id} className="bg-slate-50 border border-slate-200 rounded p-2">
                <div className="font-mono font-bold text-[11px] text-slate-800 uppercase mb-1">
                  [{g.category}]
                </div>
                <div className="flex flex-wrap gap-1">
                  {g.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-mono text-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {sectionVisibility?.projects && projects && projects.length > 0 && (
        <section className="mt-4">
          <div className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-slate-700 print:hidden" />
            // FEATURED_PROJECTS & SYSTEM_BUILDS
          </div>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="border-l-2 border-slate-800 pl-3">
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-slate-900 text-xs font-mono">
                    {p.title}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600">
                    {p.githubUrl && (
                      <span className="flex items-center gap-0.5">
                        <Github className="w-3 h-3 text-slate-700 print:hidden" />
                        code
                      </span>
                    )}
                    {p.githubUrl && p.liveUrl && <span>|</span>}
                    {p.liveUrl && (
                      <span className="flex items-center gap-0.5">
                        <ExternalLink className="w-3 h-3 text-slate-700 print:hidden" />
                        live
                      </span>
                    )}
                  </div>
                </div>
                {p.technologies && p.technologies.length > 0 && (
                  <div className="text-[11px] font-mono text-indigo-700 font-semibold mt-0.5">
                    Stack: {p.technologies.join(' • ')}
                  </div>
                )}
                <ul className="list-disc list-inside mt-1 space-y-1 text-slate-800 text-xs">
                  {p.bullets.map((b, idx) => (
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

      {/* Work / Internships */}
      {sectionVisibility?.experience && experience && experience.length > 0 && (
        <section className="mt-4">
          <div className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-slate-700 print:hidden" />
            // WORK_HISTORY
          </div>
          <div className="space-y-3">
            {experience.map((e) => (
              <div key={e.id} className="border-l-2 border-slate-400 pl-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs font-mono">{e.role} @ {e.organization}</span>
                  <span className="text-xs font-mono text-slate-600">{e.duration}</span>
                </div>
                <ul className="list-disc list-inside mt-1 space-y-1 text-slate-800 text-xs">
                  {e.bullets.map((b, idx) => (
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
        <section className="mt-4">
          <div className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-slate-700 print:hidden" />
            // EDUCATION
          </div>
          <div className="space-y-1.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-slate-900">{edu.institution}</span>
                  <span className="text-slate-700"> — {edu.degree} in {edu.fieldOfStudy}</span>
                </div>
                <div className="font-mono text-slate-700 text-right">
                  <span>{edu.startYear} – {edu.endYear}</span>
                  {edu.grade && <span className="font-bold text-slate-900 ml-2">[{edu.grade}]</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {sectionVisibility?.certifications && certifications && certifications.length > 0 && (
          <section>
            <div className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              // CERTIFICATIONS
            </div>
            <div className="space-y-1 text-xs">
              {certifications.map((c) => (
                <div key={c.id}>
                  <span className="font-semibold text-slate-900">{c.title}</span>
                  <span className="text-slate-600"> ({c.issuer}, {c.issueDate})</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {sectionVisibility?.achievements && achievements && achievements.length > 0 && (
          <section>
            <div className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              // RECOGNITION
            </div>
            <div className="space-y-1 text-xs">
              {achievements.map((a) => (
                <div key={a.id}>
                  <span className="font-semibold text-slate-900">{a.title}:</span>
                  <span className="text-slate-700"> {a.description}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
