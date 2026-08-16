import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  FileText, 
  Building, 
  Sparkles, 
  Plus, 
  RefreshCw,
  Edit3,
  Copy,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { demoJobs, demoResumes } from '../../data/demoData';

export const JobMatcher = () => {
  const { resumes, activeResume, saveResume, runJobMatch, activeJob, addNotification } = useApp();
  const navigate = useNavigate();

  const [selectedResumeId, setSelectedResumeId] = useState(activeResume?.id || resumes[0]?.id || demoResumes[0]?.id || '');
  const [jobTitle, setJobTitle] = useState(demoJobs[0]?.title || '');
  const [companyName, setCompanyName] = useState(demoJobs[0]?.company || '');
  const [jobDescriptionText, setJobDescriptionText] = useState(demoJobs[0]?.description || '');
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(activeJob || demoJobs[0]);
  const [tailoredText, setTailoredText] = useState('');
  const [generatingTailored, setGeneratingTailored] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescriptionText.trim()) return;

    setMatching(true);
    try {
      const targetResume = resumes.find(r => r.id === selectedResumeId) || activeResume || demoResumes[0];
      const result = await runJobMatch(targetResume, jobDescriptionText, companyName || 'Target Company');
      setMatchResult(result);
    } catch (err) {
      addNotification('Error calculating job match.', 'error');
    } finally {
      setMatching(false);
    }
  };

  // Load sample job posting
  const handleLoadSampleJob = () => {
    const sample = demoJobs[0];
    setJobTitle(sample.title);
    setCompanyName(sample.company);
    setJobDescriptionText(sample.description);
    setMatchResult(sample);
    addNotification('Loaded sample job posting', 'info');
  };

  const jobData = matchResult || activeJob;

  // Add missing skills to active resume and recalculate match
  const handleAddMissingSkills = async (skillsToAdd) => {
    const targetResume = resumes.find(r => r.id === selectedResumeId) || activeResume || demoResumes[0];
    if (!targetResume) return;

    const currentSkills = targetResume.skills || {};
    let updatedSkills;

    if (Array.isArray(currentSkills)) {
      updatedSkills = [...new Set([...currentSkills, ...skillsToAdd])];
    } else {
      const currentProg = currentSkills.programming || [];
      updatedSkills = {
        ...currentSkills,
        programming: [...new Set([...currentProg, ...skillsToAdd])]
      };
    }

    try {
      const updatedResume = {
        ...targetResume,
        skills: updatedSkills
      };
      await saveResume(updatedResume);

      // Re-run job match calculation to update UI state in real-time
      if (jobDescriptionText.trim()) {
        const newResult = await runJobMatch(updatedResume, jobDescriptionText, companyName || 'Target Company');
        setMatchResult(newResult);
      }

      addNotification(`Added ${skillsToAdd.length} skills to resume and updated match score!`, 'success');
    } catch (e) {
      addNotification('Failed to update skills on resume', 'error');
    }
  };

  // Generate tailored cover letter / application pitch
  const handleGenerateTailoredPitch = async () => {
    setGeneratingTailored(true);
    try {
      const targetResume = resumes.find(r => r.id === selectedResumeId) || activeResume || demoResumes[0];
      const title = jobTitle || 'Target Role';
      const company = companyName || 'Target Company';
      
      await new Promise(r => setTimeout(r, 800));
      const pitch = `Dear Hiring Team at ${company},\n\nI am writing to express my enthusiastic interest in the ${title} position. With a strong track record of engineering high-impact web applications, optimizing performance, and working with modern full-stack architectures (${(jobData?.matchingSkills || ['React', 'TypeScript', 'Node.js']).slice(0, 4).join(', ')}), I am confident in my ability to immediately contribute to your team's engineering goals.\n\nIn my previous roles, I have spearheaded design system refactoring, reduced bundle latency by over 40%, and collaborated in agile cross-functional teams to deliver scalable customer-facing platforms. I look forward to discussing how my experience aligns with ${company}'s roadmap.\n\nSincerely,\n${targetResume.personalInfo?.fullName || 'Candidate'}`;
      
      setTailoredText(pitch);
      addNotification('Generated tailored application letter!', 'success');
    } finally {
      setGeneratingTailored(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Job Description Matcher & Keyword Gap Analysis
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Compare your resume against target job postings to calculate match scores, detect missing skills, and tailor your profile.
        </p>
      </div>

      {/* Input Form */}
      <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Target Role Parameters</span>
          <button
            type="button"
            onClick={handleLoadSampleJob}
            className="text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white font-medium flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Load Sample Job (Stripe)</span>
          </button>
        </div>

        <form onSubmit={handleMatchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Select Resume to Match
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium"
              >
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.targetRole || 'General'})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Target Role Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Frontend Engineer"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Stripe, Vercel, Google, etc."
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Job Description Text
            </label>
            <textarea
              rows={5}
              required
              value={jobDescriptionText}
              onChange={(e) => setJobDescriptionText(e.target.value)}
              placeholder="Paste the full job posting description here..."
              className="w-full p-3 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={matching}
              className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-xs"
            >
              <Cpu className="w-4 h-4" />
              <span>{matching ? 'Calculating Match Alignment...' : 'Calculate Job Match'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(`/resume-builder/${selectedResumeId}`)}
              className="px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-semibold hover:bg-neutral-200 flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Open Selected Resume in Builder</span>
            </button>
          </div>
        </form>
      </div>

      {/* Match Result Display */}
      {jobData && (
        <div className="space-y-6">
          
          {/* Main Score Banner */}
          <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-semibold text-neutral-500">{jobData.company || 'Stripe'}</span>
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {jobData.jobTitle || 'Senior Frontend Engineer'} Match Report
              </h2>
            </div>

            <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="text-center">
                <span className="text-4xl font-bold font-mono text-neutral-900 dark:text-white">
                  {jobData.matchScore}%
                </span>
                <span className="block text-[10px] text-neutral-400 font-mono">Weighted Match</span>
              </div>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Match Category Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { label: 'Required Skills (35%)', val: jobData.scoreBreakdown?.skills || 91 },
                { label: 'Experience (20%)', val: jobData.scoreBreakdown?.experience || 82 },
                { label: 'Keywords (20%)', val: jobData.scoreBreakdown?.keywords || 88 },
                { label: 'Responsibilities (15%)', val: jobData.scoreBreakdown?.responsibilities || 84 },
                { label: 'Education (5%)', val: jobData.scoreBreakdown?.education || 100 },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
                    <span className="truncate">{item.label}</span>
                    <span className="font-mono text-neutral-900 dark:text-white font-semibold">{item.val}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-neutral-900 dark:bg-white h-full" style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Match Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Matching Skills */}
            <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>You Match Well On ({(jobData.matchingSkills || []).length})</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {(jobData.matchingSkills || []).map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300 text-xs font-medium">
                    {skill} ✓
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Missing or Weak Skill Areas ({(jobData.missingSkills || []).length})</span>
                </h3>
                {(jobData.missingSkills || []).length > 0 && (
                  <button
                    onClick={() => handleAddMissingSkills(jobData.missingSkills)}
                    className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add All to Resume</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(jobData.missingSkills || []).map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300 text-xs font-medium flex items-center gap-1">
                    <span>{skill}</span>
                    <button
                      onClick={() => handleAddMissingSkills([skill])}
                      title="Add to resume"
                      className="text-rose-400 hover:text-rose-900 font-bold ml-1"
                    >
                      +
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Tailored Cover Letter / Pitch Generator */}
          <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Application Letter & Pitch Generator</span>
                </h3>
                <p className="text-xs text-neutral-500">Generate a concise, professional application letter tailored to this role.</p>
              </div>
              <button
                onClick={handleGenerateTailoredPitch}
                disabled={generatingTailored}
                className="px-3.5 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg text-xs font-semibold hover:bg-neutral-800 flex items-center gap-1.5 self-start shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{generatingTailored ? 'Generating...' : 'Generate Tailored Letter'}</span>
              </button>
            </div>

            {tailoredText && (
              <div className="space-y-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-700 text-xs font-semibold">
                  <span>Tailored Cover Letter Pitch</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(tailoredText);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>
                <pre className="text-xs font-sans text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
                  {tailoredText}
                </pre>
              </div>
            )}
          </div>

          {/* Recommended Improvements */}
          <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Recommended Resume Adjustments
            </h3>
            <div className="space-y-2 text-xs text-neutral-800 dark:text-neutral-200">
              {(jobData.recommendations || []).map((rec, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

