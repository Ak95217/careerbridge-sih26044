import React from 'react';
import { ResumeContent } from '../../../../types';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, GraduationCap, Briefcase, Code, Award, FileBadge, User } from 'lucide-react';

interface TemplateProps {
  content: ResumeContent;
}

export const ModernProTemplate: React.FC<TemplateProps> = ({ content }) => {
  const { personalInfo, summary, skillGroups, experience, projects, education, certifications, achievements, sectionVisibility } = content;

  return (
    <div className="font-sans text-slate-800 bg-white leading-relaxed text-[13px] max-w-[800px] mx-auto shadow-sm print:shadow-none print:text-[12px]">
      {/* Header Banner */}
      <header className="bg-slate-900 text-white p-6 sm:p-8 print:p-4 print:bg-slate-900">
        <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-400" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedinUrl && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-indigo-400" />
              {personalInfo.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
          {personalInfo.githubUrl && (
            <span className="flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-indigo-400" />
              {personalInfo.githubUrl.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
          {personalInfo.portfolioUrl && (
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              {personalInfo.portfolioUrl.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
        </div>
      </header>

      <div className="p-6 sm:p-8 space-y-5 print:p-4 print:space-y-4">
        {/* Professional Summary */}
        {sectionVisibility?.summary && summary && (
          <section>
            <div className="flex items-center gap-2 border-b border-indigo-100 pb-1 mb-2">
              <User className="w-4 h-4 text-indigo-600 print:hidden" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Professional Profile
              </h2>
            </div>
            <p className="text-slate-700 leading-normal text-xs text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Technical Skills */}
        {sectionVisibility?.skills && skillGroups && skillGroups.length > 0 && (
          <section>
            <div className="flex items-center gap-2 border-b border-indigo-100 pb-1 mb-2.5">
              <Code className="w-4 h-4 text-indigo-600 print:hidden" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Skills & Technical Competencies
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {skillGroups.map((group) => (
                <div key={group.id} className="bg-slate-50 border border-slate-200/80 rounded-md p-2.5">
                  <div className="font-semibold text-slate-900 text-xs mb-1">
                    {group.category}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {group.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-block px-2 py-0.5 bg-white border border-slate-200 text-[11px] font-medium text-slate-700 rounded"
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

        {/* Experience */}
        {sectionVisibility?.experience && experience && experience.length > 0 && (
          <section>
            <div className="flex items-center gap-2 border-b border-indigo-100 pb-1 mb-2.5">
              <Briefcase className="w-4 h-4 text-indigo-600 print:hidden" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Experience & Internships
              </h2>
            </div>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-indigo-500 pl-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">{exp.role}</span>
                    <span className="text-xs font-medium text-indigo-700">{exp.duration}</span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {exp.organization} {exp.location ? `• ${exp.location}` : ''}
                  </div>
                  <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-700 text-xs">
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
          <section>
            <div className="flex items-center gap-2 border-b border-indigo-100 pb-1 mb-2.5">
              <Code className="w-4 h-4 text-indigo-600 print:hidden" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Key Projects
              </h2>
            </div>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="border-l-2 border-slate-300 pl-3">
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-slate-900 text-xs">
                      {proj.title}
                    </div>
                    {(proj.githubUrl || proj.liveUrl) && (
                      <div className="flex items-center gap-2 text-[11px] text-indigo-600 font-medium">
                        {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="hover:underline">Code</a>}
                        {proj.githubUrl && proj.liveUrl && <span>•</span>}
                        {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="hover:underline">Demo</a>}
                      </div>
                    )}
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                      Tech: {proj.technologies.join(' | ')}
                    </div>
                  )}
                  <ul className="list-disc list-inside mt-1 space-y-1 text-slate-700 text-xs">
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
          <section>
            <div className="flex items-center gap-2 border-b border-indigo-100 pb-1 mb-2">
              <GraduationCap className="w-4 h-4 text-indigo-600 print:hidden" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Education
              </h2>
            </div>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{edu.institution}</div>
                    <div className="text-xs text-slate-700">
                      {edu.degree} in {edu.fieldOfStudy}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-slate-600">{edu.startYear} – {edu.endYear}</div>
                    {edu.grade && (
                      <div className="text-xs font-bold text-indigo-800">{edu.grade}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionVisibility?.certifications && certifications && certifications.length > 0 && (
            <section>
              <div className="flex items-center gap-1.5 border-b border-indigo-100 pb-1 mb-2">
                <FileBadge className="w-3.5 h-3.5 text-indigo-600 print:hidden" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  Certifications
                </h2>
              </div>
              <div className="space-y-1.5">
                {certifications.map((c) => (
                  <div key={c.id} className="text-xs">
                    <div className="font-semibold text-slate-900">{c.title}</div>
                    <div className="text-[11px] text-slate-600">{c.issuer} ({c.issueDate})</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {sectionVisibility?.achievements && achievements && achievements.length > 0 && (
            <section>
              <div className="flex items-center gap-1.5 border-b border-indigo-100 pb-1 mb-2">
                <Award className="w-3.5 h-3.5 text-indigo-600 print:hidden" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  Achievements
                </h2>
              </div>
              <div className="space-y-1.5">
                {achievements.map((a) => (
                  <div key={a.id} className="text-xs">
                    <div className="font-semibold text-slate-900">{a.title}</div>
                    <div className="text-[11px] text-slate-600">{a.description}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
