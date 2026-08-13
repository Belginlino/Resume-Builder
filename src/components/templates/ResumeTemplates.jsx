import React from 'react';

export const ResumeRenderer = ({ resume, templateId = 'template_01', containerId = 'resume-a4-preview' }) => {
  if (!resume) return null;

  const info = resume.personalInfo || {};
  const summary = resume.summary || '';
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || {};
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];
  const languages = resume.languages || [];

  // Helper to format skill lists
  const formatSkillsList = () => {
    if (Array.isArray(skills)) return skills.join(' • ');
    if (typeof skills === 'object') {
      return Object.entries(skills)
        .map(([cat, list]) => `${cat}: ${Array.isArray(list) ? list.join(', ') : list}`)
        .filter(Boolean)
        .join(' | ');
    }
    return '';
  };

  // Render Template 01 - Classic (Single Column, Highest ATS Compatibility)
  if (templateId === 'template_01') {
    return (
      <div id={containerId} className="a4-page font-sans text-neutral-900 text-xs leading-relaxed space-y-4">
        {/* Contact Header */}
        <div className="text-center border-b border-neutral-300 pb-3">
          <h1 className="text-xl font-bold uppercase tracking-wide text-neutral-900">{info.fullName || 'YOUR NAME'}</h1>
          {info.professionalTitle && (
            <p className="text-sm font-medium text-neutral-700 mt-0.5">{info.professionalTitle}</p>
          )}
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-neutral-600 mt-1.5">
            {info.email && <span>{info.email}</span>}
            {info.phone && <span>• {info.phone}</span>}
            {info.location && <span>• {info.location}</span>}
            {info.linkedin && <span>• {info.linkedin}</span>}
            {info.github && <span>• {info.github}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-neutral-800 text-[11.5px] leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-2">
              Work Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-baseline font-semibold text-neutral-900 text-xs">
                    <span>{exp.jobTitle} <span className="font-normal text-neutral-700">| {exp.company}</span></span>
                    <span className="text-[11px] text-neutral-600 font-mono">
                      {exp.startDate} – {exp.currentPosition ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.location && <p className="text-[11px] text-neutral-500 italic mb-1">{exp.location}</p>}
                  {exp.description && <p className="text-[11px] text-neutral-700 mb-1">{exp.description}</p>}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-neutral-800">
                      {exp.achievements.map((ach, aIdx) => (
                        <li key={aIdx}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1.5">
              Education
            </h2>
            <div className="space-y-1.5">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-semibold text-neutral-900">{edu.degree}</span>
                    <span className="text-neutral-700"> — {edu.institution}</span>
                    {edu.gpa && <span className="text-neutral-500 text-[11px]"> (GPA: {edu.gpa})</span>}
                  </div>
                  <span className="text-[11px] text-neutral-600 font-mono">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical & Core Skills */}
        {formatSkillsList() && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1">
              Skills & Qualifications
            </h2>
            <p className="text-[11px] text-neutral-800 leading-relaxed">{formatSkillsList()}</p>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1.5">
              Key Projects
            </h2>
            <div className="space-y-2">
              {projects.map((p, idx) => (
                <div key={p.id || idx}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-neutral-900 text-xs">{p.name}</span>
                    {p.technologies && <span className="text-[10.5px] font-mono text-neutral-500">{Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies}</span>}
                  </div>
                  <p className="text-[11px] text-neutral-700">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1">
              Certifications
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              {certifications.map((c, idx) => (
                <span key={idx} className="text-neutral-800">
                  <strong>{c.name}</strong> — {c.organization} ({c.date})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Template 02 - Executive / Template 03 - Modern / Template 04 - Technical
  return (
    <div id={containerId} className="a4-page font-sans text-neutral-900 text-xs leading-relaxed space-y-4">
      {/* Top Header */}
      <div className="border-b-2 border-neutral-900 pb-3 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{info.fullName || 'YOUR NAME'}</h1>
          <p className="text-sm font-medium text-neutral-600 mt-0.5">{info.professionalTitle || 'Software Engineer'}</p>
        </div>
        <div className="text-right text-[11px] text-neutral-600 space-y-0.5">
          {info.email && <div>{info.email}</div>}
          {info.phone && <div>{info.phone}</div>}
          {info.location && <div>{info.location}</div>}
          {info.linkedin && <div>{info.linkedin}</div>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-neutral-50 p-2.5 rounded border-l-2 border-neutral-900">
          <p className="text-neutral-800 text-[11.5px] leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-2 pb-0.5 border-b border-neutral-200">
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-neutral-900">{exp.jobTitle}</span>
                  <span className="text-[10.5px] font-mono text-neutral-500">{exp.startDate} – {exp.currentPosition ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-[11px] font-medium text-neutral-700 mb-1">{exp.company} • {exp.location}</div>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-neutral-800 pl-1">
                    {exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx}>{ach}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {formatSkillsList() && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-1 pb-0.5 border-b border-neutral-200">
            Technical Stack & Skills
          </h2>
          <p className="text-[11px] text-neutral-800">{formatSkillsList()}</p>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-1.5 pb-0.5 border-b border-neutral-200">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline text-xs">
              <span className="font-bold text-neutral-900">{edu.degree} — <span className="font-normal">{edu.institution}</span></span>
              <span className="text-[10.5px] font-mono text-neutral-500">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
