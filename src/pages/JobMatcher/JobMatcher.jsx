import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Cpu, CheckCircle2, AlertCircle, ArrowRight, FileText, Building, Sparkles } from 'lucide-react';

export const JobMatcher = () => {
  const { resumes, activeResume, runJobMatch, activeJob } = useApp();

  const [selectedResumeId, setSelectedResumeId] = useState(activeResume?.id || resumes[0]?.id || '');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(activeJob);

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescriptionText.trim()) return;

    setMatching(true);
    try {
      const targetResume = resumes.find(r => r.id === selectedResumeId) || activeResume || resumes[0];
      const result = await runJobMatch(targetResume, jobDescriptionText, companyName || 'Target Company');
      setMatchResult(result);
    } catch (err) {
      alert('Error calculating job match.');
    } finally {
      setMatching(false);
    }
  };

  const jobData = matchResult || activeJob;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Job Description Matcher
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Compare your resume against target job postings to calculate match scores and detect missing skills.
        </p>
      </div>

      {/* Input Form */}
      <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <form onSubmit={handleMatchSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Select Resume
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
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
                placeholder="Stripe, Vercel, etc."
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Job Description Text
            </label>
            <textarea
              rows={6}
              required
              value={jobDescriptionText}
              onChange={(e) => setJobDescriptionText(e.target.value)}
              placeholder="Paste the full job posting description here..."
              className="w-full p-3 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={matching}
            className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-all flex items-center gap-2"
          >
            <Cpu className="w-4 h-4" />
            <span>{matching ? 'Calculating Match Alignment...' : 'Calculate Job Match'}</span>
          </button>
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
                  <span key={idx} className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                    {skill} ✓
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Missing or Weak Skill Areas ({(jobData.missingSkills || []).length})</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {(jobData.missingSkills || []).map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-rose-50 text-rose-800 border border-rose-200 text-xs font-medium">
                    {skill} ✗
                  </span>
                ))}
              </div>
            </div>

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
