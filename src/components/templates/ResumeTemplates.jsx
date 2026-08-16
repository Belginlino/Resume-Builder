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

  // Helper to format skill lists by category or flat array
  const renderCategorizedSkills = (badgeStyle = false, accentClass = '') => {
    if (Array.isArray(skills)) {
      if (skills.length === 0) return null;
      return badgeStyle ? (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {skills.map((s, idx) => (
            <span key={idx} className={`px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 ${accentClass}`}>
              {s}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[11.5px] text-neutral-800 dark:text-neutral-200 leading-relaxed mt-1">
          {skills.join(' • ')}
        </p>
      );
    }

    if (typeof skills === 'object' && Object.keys(skills).length > 0) {
      const categories = [
        { key: 'programming', label: 'Languages' },
        { key: 'frameworks', label: 'Frameworks & Libraries' },
        { key: 'tools', label: 'Tools & Platforms' },
        { key: 'cloud', label: 'Cloud & DevOps' },
        { key: 'softSkills', label: 'Core Competencies' }
      ];

      const validEntries = categories
        .filter(c => skills[c.key] && (Array.isArray(skills[c.key]) ? skills[c.key].length > 0 : Boolean(skills[c.key])))
        .map(c => ({
          label: c.label,
          items: Array.isArray(skills[c.key]) ? skills[c.key] : [skills[c.key]]
        }));

      // Also pick up any custom keys
      Object.keys(skills).forEach(k => {
        if (!categories.some(c => c.key === k) && skills[k]) {
          const items = Array.isArray(skills[k]) ? skills[k] : [skills[k]];
          if (items.length > 0) {
            validEntries.push({ label: k.charAt(0).toUpperCase() + k.slice(1), items });
          }
        }
      });

      if (validEntries.length === 0) return null;

      return (
        <div className="space-y-1.5 mt-1">
          {validEntries.map((cat, idx) => (
            <div key={idx} className="text-[11.5px] text-neutral-800 dark:text-neutral-200 leading-relaxed">
              <span className="font-semibold text-neutral-900 dark:text-white">{cat.label}: </span>
              <span>{cat.items.join(', ')}</span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  // ==========================================
  // TEMPLATE 01: CLASSIC (Clean Single Column, Universal ATS Safe)
  // ==========================================
  if (templateId === 'template_01') {
    return (
      <div id={containerId} className="a4-page font-sans text-neutral-900 text-xs leading-relaxed space-y-4 bg-white">
        {/* Header */}
        <div className="text-center border-b border-neutral-300 pb-3">
          <h1 className="text-xl font-bold uppercase tracking-wider text-neutral-900">{info.fullName || 'YOUR NAME'}</h1>
          {info.professionalTitle && (
            <p className="text-xs font-semibold text-neutral-700 mt-0.5">{info.professionalTitle}</p>
          )}
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-neutral-600 mt-1.5">
            {info.email && <span>{info.email}</span>}
            {info.phone && <span>• {info.phone}</span>}
            {info.location && <span>• {info.location}</span>}
            {info.linkedin && <span>• {info.linkedin}</span>}
            {info.github && <span>• {info.github}</span>}
            {info.portfolio && <span>• {info.portfolio}</span>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-neutral-800 text-[11.5px] leading-relaxed text-justify">{summary}</p>
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
                  {exp.location && <p className="text-[10.5px] text-neutral-500 italic mb-1">{exp.location}</p>}
                  {exp.description && <p className="text-[11px] text-neutral-700 mb-1">{exp.description}</p>}
                  {exp.achievements && exp.achievements.filter(Boolean).length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-neutral-800">
                      {exp.achievements.filter(Boolean).map((ach, aIdx) => (
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
        {renderCategorizedSkills() && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1">
              Skills & Competencies
            </h2>
            {renderCategorizedSkills(false)}
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
                    {edu.coursework && <p className="text-[10.5px] text-neutral-600">Coursework: {edu.coursework}</p>}
                  </div>
                  <span className="text-[11px] text-neutral-600 font-mono shrink-0 ml-2">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
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
                    <span className="font-semibold text-neutral-900 text-xs">
                      {p.name} {p.projectUrl && <span className="font-normal text-neutral-500">({p.projectUrl})</span>}
                    </span>
                    {p.technologies && (
                      <span className="text-[10.5px] font-mono text-neutral-500 shrink-0 ml-2">
                        {Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-700">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Languages */}
        {(certifications.length > 0 || languages.length > 0) && (
          <div className="grid grid-cols-2 gap-4">
            {certifications.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1">
                  Certifications
                </h2>
                <div className="space-y-0.5 text-[11px]">
                  {certifications.map((c, idx) => (
                    <div key={idx} className="text-neutral-800">
                      <strong>{c.name}</strong> — {c.organization} {c.date && `(${c.date})`}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5 mb-1">
                  Languages
                </h2>
                <div className="flex flex-wrap gap-2 text-[11px] text-neutral-800">
                  {languages.map((l, idx) => (
                    <span key={idx}>
                      {l.name} <span className="text-neutral-500">({l.proficiency})</span>{idx < languages.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // TEMPLATE 02: EXECUTIVE (Leadership, Refined Header & Clean Structure)
  // ==========================================
  if (templateId === 'template_02') {
    return (
      <div id={containerId} className="a4-page font-serif text-neutral-900 text-xs leading-relaxed space-y-4 bg-white">
        {/* Executive Header Banner */}
        <div className="border-b-2 border-blue-900 pb-3 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">{info.fullName || 'YOUR NAME'}</h1>
            <p className="text-sm font-semibold text-neutral-700 mt-0.5 font-sans">{info.professionalTitle || 'Executive Professional'}</p>
          </div>
          <div className="text-right text-[11px] font-sans text-neutral-600 space-y-0.5">
            {info.email && <div>{info.email}</div>}
            {info.phone && <div>{info.phone}</div>}
            {info.location && <div>{info.location}</div>}
            {info.linkedin && <div>{info.linkedin}</div>}
          </div>
        </div>

        {/* Executive Summary */}
        {summary && (
          <div className="bg-neutral-50 p-3 rounded border-l-3 border-blue-900">
            <h2 className="text-[11px] font-sans font-bold uppercase tracking-wider text-blue-900 mb-1">Executive Profile</h2>
            <p className="text-neutral-800 font-sans text-[11.5px] leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-blue-950 mb-2 pb-0.5 border-b border-neutral-300">
              Professional Experience
            </h2>
            <div className="space-y-3 font-sans">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-neutral-900 text-xs">{exp.jobTitle}</span>
                    <span className="text-[10.5px] font-mono text-neutral-500">{exp.startDate} – {exp.currentPosition ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-[11px] font-medium text-blue-900 mb-1">{exp.company} • {exp.location}</div>
                  {exp.description && <p className="text-[11px] text-neutral-700 mb-1">{exp.description}</p>}
                  {exp.achievements && exp.achievements.filter(Boolean).length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-neutral-800 pl-1">
                      {exp.achievements.filter(Boolean).map((ach, aIdx) => (
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
        {renderCategorizedSkills() && (
          <div className="font-sans">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-950 mb-1.5 pb-0.5 border-b border-neutral-300">
              Core Competencies & Skills
            </h2>
            {renderCategorizedSkills(false)}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="font-sans">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-950 mb-1.5 pb-0.5 border-b border-neutral-300">
              Education & Credentials
            </h2>
            <div className="space-y-1">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-neutral-900">{edu.degree} — <span className="font-normal text-neutral-700">{edu.institution}</span></span>
                  <span className="text-[10.5px] font-mono text-neutral-500">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="font-sans">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-950 mb-1 pb-0.5 border-b border-neutral-300">
              Certifications & Leadership Accreditations
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-800">
              {certifications.map((c, idx) => (
                <span key={idx}><strong>{c.name}</strong> — {c.organization} ({c.date})</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // TEMPLATE 04: TECHNICAL (Engineered for Software Developers & DevOps)
  // ==========================================
  if (templateId === 'template_04') {
    return (
      <div id={containerId} className="a4-page font-sans text-neutral-900 text-xs leading-relaxed space-y-4 bg-white">
        {/* Technical Header */}
        <div className="border-b-2 border-emerald-700 pb-2.5 flex justify-between items-end">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 font-mono">{info.fullName || 'YOUR NAME'}</h1>
            <p className="text-xs font-semibold text-emerald-800 mt-0.5">{info.professionalTitle || 'Software Engineer'}</p>
          </div>
          <div className="text-right text-[10.5px] font-mono text-neutral-600 space-y-0.5">
            <div>{info.email} {info.phone && `| ${info.phone}`}</div>
            <div>{info.location} {info.github && `| ${info.github}`}</div>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <p className="text-[11.5px] text-neutral-800 leading-relaxed">{summary}</p>
        )}

        {/* Technical Skills Categorized Section First */}
        {renderCategorizedSkills() && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-neutral-300 pb-0.5 mb-1.5 flex items-center gap-1.5">
              <span>Technical Skills</span>
            </h2>
            {renderCategorizedSkills(false)}
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-neutral-300 pb-0.5 mb-2">
              Work Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-baseline font-semibold text-neutral-900 text-xs">
                    <span>{exp.jobTitle} <span className="font-normal text-emerald-800">@ {exp.company}</span></span>
                    <span className="text-[10.5px] font-mono text-neutral-500">{exp.startDate} – {exp.currentPosition ? 'Present' : exp.endDate}</span>
                  </div>
                  {exp.achievements && exp.achievements.filter(Boolean).length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-neutral-800 mt-1">
                      {exp.achievements.filter(Boolean).map((ach, aIdx) => (
                        <li key={aIdx}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-neutral-300 pb-0.5 mb-1.5">
              Technical Projects
            </h2>
            <div className="space-y-2">
              {projects.map((p, idx) => (
                <div key={p.id || idx}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-neutral-900 text-xs">
                      {p.name} {p.projectUrl && <span className="font-mono text-[10px] text-emerald-700 font-normal">[{p.projectUrl}]</span>}
                    </span>
                    {p.technologies && (
                      <span className="text-[10px] font-mono text-neutral-500">
                        {Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-700">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certs */}
        <div className="grid grid-cols-2 gap-4">
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-neutral-300 pb-0.5 mb-1">
                Education
              </h2>
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs">
                  <div className="font-semibold text-neutral-900">{edu.degree}</div>
                  <div className="text-[11px] text-neutral-600">{edu.institution} ({edu.startDate} – {edu.endDate})</div>
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-neutral-300 pb-0.5 mb-1">
                Certifications
              </h2>
              {certifications.map((c, idx) => (
                <div key={idx} className="text-[11px] text-neutral-800">
                  <strong>{c.name}</strong> — {c.organization}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // TEMPLATE 05: GRADUATE (Education & Academic Projects First)
  // ==========================================
  if (templateId === 'template_05') {
    return (
      <div id={containerId} className="a4-page font-sans text-neutral-900 text-xs leading-relaxed space-y-4 bg-white">
        {/* Header */}
        <div className="text-center border-b-2 border-amber-700 pb-3">
          <h1 className="text-xl font-bold uppercase tracking-wide text-neutral-900">{info.fullName || 'YOUR NAME'}</h1>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 text-[11px] text-neutral-600 mt-1 font-mono">
            {info.email && <span>{info.email}</span>}
            {info.phone && <span>• {info.phone}</span>}
            {info.location && <span>• {info.location}</span>}
            {info.linkedin && <span>• {info.linkedin}</span>}
            {info.github && <span>• {info.github}</span>}
          </div>
        </div>

        {/* Objective / Summary */}
        {summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-neutral-200 pb-0.5 mb-1">
              Career Objective
            </h2>
            <p className="text-[11.5px] text-neutral-800 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Education Prioritized */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-neutral-200 pb-0.5 mb-1.5">
              Education & Academic Background
            </h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline font-semibold text-xs text-neutral-900">
                    <span>{edu.degree} — <span className="font-normal">{edu.institution}</span></span>
                    <span className="text-[10.5px] font-mono text-neutral-500">{edu.startDate} – {edu.endDate}</span>
                  </div>
                  {edu.gpa && <p className="text-[11px] text-amber-800 font-medium">Cumulative GPA: {edu.gpa}</p>}
                  {edu.coursework && <p className="text-[10.5px] text-neutral-600">Relevant Coursework: {edu.coursework}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Prioritized */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-neutral-200 pb-0.5 mb-1.5">
              Academic & Personal Projects
            </h2>
            <div className="space-y-2">
              {projects.map((p, idx) => (
                <div key={idx}>
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

        {/* Skills */}
        {renderCategorizedSkills() && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-neutral-200 pb-0.5 mb-1">
              Technical & Core Skills
            </h2>
            {renderCategorizedSkills(false)}
          </div>
        )}

        {/* Experience if any */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-neutral-200 pb-0.5 mb-1.5">
              Work & Internship Experience
            </h2>
            <div className="space-y-2">
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline font-semibold text-xs">
                    <span>{exp.jobTitle} | {exp.company}</span>
                    <span className="text-[10.5px] font-mono text-neutral-500">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-[11px] text-neutral-800">
                      {exp.achievements.map((ach, aIdx) => <li key={aIdx}>{ach}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // TEMPLATE 03: MODERN (SaaS & Tech, Sky Blue Accents & Badges)
  // ==========================================
  if (templateId === 'template_03') {
    return (
      <div id={containerId} className="a4-page font-sans text-neutral-900 text-xs leading-relaxed space-y-4 bg-white">
        {/* Modern Header Banner */}
        <div className="border-b-2 border-sky-600 pb-3 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">{info.fullName || 'YOUR NAME'}</h1>
            <p className="text-xs font-semibold text-sky-700 mt-0.5">{info.professionalTitle || 'Software Engineer'}</p>
          </div>
          <div className="text-right text-[10.5px] text-neutral-600 space-y-0.5 font-mono">
            {info.email && <div>{info.email}</div>}
            {info.phone && <div>{info.phone}</div>}
            {info.location && <div>{info.location}</div>}
            {info.linkedin && <div>{info.linkedin}</div>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="bg-sky-50/60 p-3 rounded-lg border-l-3 border-sky-600">
            <p className="text-neutral-800 text-[11.5px] leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-950 mb-2 pb-0.5 border-b border-sky-200">
              Work Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-baseline font-semibold text-neutral-900 text-xs">
                    <span>{exp.jobTitle} <span className="font-medium text-sky-800">• {exp.company}</span></span>
                    <span className="text-[10.5px] font-mono text-neutral-500">{exp.startDate} – {exp.currentPosition ? 'Present' : exp.endDate}</span>
                  </div>
                  {exp.location && <p className="text-[10.5px] text-neutral-500 italic mb-1">{exp.location}</p>}
                  {exp.achievements && exp.achievements.filter(Boolean).length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-neutral-800 pl-1">
                      {exp.achievements.filter(Boolean).map((ach, aIdx) => (
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
        {renderCategorizedSkills() && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-950 mb-1 pb-0.5 border-b border-sky-200">
              Technical Stack & Competencies
            </h2>
            {renderCategorizedSkills(true, 'bg-sky-50 text-sky-900 border-sky-200')}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-950 mb-1.5 pb-0.5 border-b border-sky-200">
              Projects & Engineering Work
            </h2>
            <div className="space-y-2">
              {projects.map((p, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-neutral-900">{p.name}</span>
                    {p.technologies && <span className="text-[10.5px] font-mono text-neutral-500">{Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies}</span>}
                  </div>
                  <p className="text-[11px] text-neutral-700">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-950 mb-1.5 pb-0.5 border-b border-sky-200">
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

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-950 mb-1 pb-0.5 border-b border-sky-200">
              Certifications
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-800">
              {certifications.map((c, idx) => (
                <span key={idx}><strong>{c.name}</strong> — {c.organization} ({c.date})</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // TEMPLATE 06: PROFESSIONAL (Corporate Standard)
  // ==========================================
  return (
    <div id={containerId} className="a4-page font-sans text-neutral-900 text-xs leading-relaxed space-y-4 bg-white">
      {/* Corporate Header Banner */}
      <div className="bg-neutral-900 text-white p-4 rounded-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-wider uppercase text-white">{info.fullName || 'YOUR NAME'}</h1>
          <p className="text-xs font-medium text-neutral-300 mt-0.5">{info.professionalTitle || 'Software Engineer'}</p>
        </div>
        <div className="text-right text-[10.5px] text-neutral-300 space-y-0.5 font-mono">
          {info.email && <div>{info.email}</div>}
          {info.phone && <div>{info.phone}</div>}
          {info.location && <div>{info.location}</div>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-neutral-50 p-3 rounded border border-neutral-200">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 mb-1">Executive Summary</h2>
          <p className="text-neutral-800 text-[11.5px] leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-2 pb-0.5 border-b-2 border-neutral-900">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between items-baseline font-bold text-neutral-900 text-xs">
                  <span>{exp.jobTitle} <span className="font-normal text-neutral-600">| {exp.company}</span></span>
                  <span className="text-[10.5px] font-mono text-neutral-500">{exp.startDate} – {exp.currentPosition ? 'Present' : exp.endDate}</span>
                </div>
                {exp.location && <div className="text-[10.5px] font-medium text-neutral-500 mb-1">{exp.location}</div>}
                {exp.achievements && exp.achievements.filter(Boolean).length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-neutral-800 pl-1">
                    {exp.achievements.filter(Boolean).map((ach, aIdx) => (
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
      {renderCategorizedSkills() && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-1 pb-0.5 border-b-2 border-neutral-900">
            Core Competencies & Technical Skills
          </h2>
          {renderCategorizedSkills(false)}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-1.5 pb-0.5 border-b-2 border-neutral-900">
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

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-1 pb-0.5 border-b-2 border-neutral-900">
            Certifications & Training
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-800">
            {certifications.map((c, idx) => (
              <span key={idx}><strong>{c.name}</strong> — {c.organization} ({c.date})</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

