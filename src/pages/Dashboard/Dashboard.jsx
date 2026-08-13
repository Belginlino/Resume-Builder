import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  Scan, 
  PlusCircle, 
  Cpu, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  MoreHorizontal, 
  ExternalLink, 
  Copy, 
  Download, 
  Trash2,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { exportResumeToPDF } from '../../services/pdfExport';

export const Dashboard = () => {
  const { user } = useAuth();
  const { resumes, analyses, jobs, setActiveResume, duplicateResume, deleteResume } = useApp();
  const navigate = useNavigate();

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Alex';
  const latestAnalysis = analyses[0] || null;
  const latestJob = jobs[0] || null;

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Good morning, {userName}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Your career workspace and ATS resume health at a glance.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/analyzer')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-all shadow-xs flex items-center gap-1.5"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Scan Resume</span>
          </button>
          <button
            onClick={() => navigate('/resume-builder')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-50 transition-all shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>New Resume</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Actions Bar */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
          What would you like to do?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={() => navigate('/analyzer')}
            className="group p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-600 transition-all cursor-pointer shadow-xs space-y-2"
          >
            <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white group-hover:bg-neutral-900 group-hover:text-white transition-colors">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-white flex items-center justify-between">
                <span>Analyze Resume</span>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-neutral-500 mt-1">Upload an existing resume and run explainable ATS scanning.</p>
            </div>
          </div>

          <div 
            onClick={() => navigate('/resume-builder')}
            className="group p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-600 transition-all cursor-pointer shadow-xs space-y-2"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-white flex items-center justify-between">
                <span>Build Resume</span>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-neutral-500 mt-1">Create an ATS-friendly resume from scratch with live A4 preview.</p>
            </div>
          </div>

          <div 
            onClick={() => navigate('/job-matcher')}
            className="group p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-600 transition-all cursor-pointer shadow-xs space-y-2"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-white flex items-center justify-between">
                <span>Match a Job</span>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-neutral-500 mt-1">Compare your resume against a target role for keyword gaps.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">ATS Resume Score</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
              {latestAnalysis ? latestAnalysis.atsScore : 84}
            </span>
            <span className="text-xs text-neutral-400">/ 100</span>
          </div>
          <span className="inline-block mt-2 text-[10px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded">
            Strong Compatibility
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Target Job Match</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
              {latestJob ? `${latestJob.matchScore}%` : '87%'}
            </span>
          </div>
          <span className="inline-block mt-2 text-[10px] font-medium text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded">
            Senior Frontend Engineer
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Resumes Created</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
              {resumes.length}
            </span>
          </div>
          <span className="inline-block mt-2 text-[10px] font-medium text-neutral-500">
            Active versions
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Applications Optimized</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">12</span>
          </div>
          <span className="inline-block mt-2 text-[10px] font-medium text-emerald-600">
            +3 this week
          </span>
        </div>
      </div>

      {/* 4. Resume Health Widget */}
      <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        {/* Circular Gauge Score */}
        <div className="flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800 pb-6 lg:pb-0 lg:pr-8">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-neutral-100 dark:text-neutral-800 stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-neutral-900 dark:text-white stroke-current transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - (latestAnalysis?.atsScore || 84) / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
                {latestAnalysis?.atsScore || 84}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">/ 100</span>
            </div>
          </div>
          <p className="mt-3 text-sm font-bold text-neutral-900 dark:text-white">
            {latestAnalysis?.compatibilityLabel || 'Strong ATS Compatibility'}
          </p>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs">
            Standard single column format with clear headings.
          </p>
        </div>

        {/* Progress Breakdown bars */}
        <div className="lg:col-span-2 space-y-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Resume Health Breakdown
          </p>

          {[
            { label: 'ATS Compatibility', score: latestAnalysis?.scores?.atsCompatibility || 92 },
            { label: 'Content Quality', score: latestAnalysis?.scores?.contentQuality || 85 },
            { label: 'Keyword Coverage', score: latestAnalysis?.scores?.keywordMatch || 78 },
            { label: 'Formatting Hierarchy', score: latestAnalysis?.scores?.formatting || 94 },
            { label: 'Skills Coverage', score: latestAnalysis?.scores?.skillsCoverage || 81 },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300">
                <span>{item.label}</span>
                <span className="font-mono text-neutral-900 dark:text-white">{item.score}%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-neutral-900 dark:bg-white h-full transition-all duration-500"
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Recent Resumes Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-sm text-neutral-900 dark:text-white">Recent Resumes</h2>
            <p className="text-xs text-neutral-500">Manage and update saved resume versions.</p>
          </div>
          <button
            onClick={() => navigate('/resume-builder')}
            className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline flex items-center gap-1"
          >
            <span>+ Create New</span>
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">Your next opportunity starts here.</p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">Create your first resume or upload an existing file to run ATS analysis.</p>
            <button
              onClick={() => navigate('/resume-builder')}
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
            >
              Create Resume
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 pl-4">Resume</th>
                  <th className="p-3.5">Target Role</th>
                  <th className="p-3.5">ATS Score</th>
                  <th className="p-3.5">Updated</th>
                  <th className="p-3.5 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {resumes.map((res) => (
                  <tr key={res.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="p-3.5 pl-4 font-medium text-neutral-900 dark:text-white flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-neutral-500 shrink-0" />
                      <span className="truncate max-w-xs">{res.name}</span>
                    </td>
                    <td className="p-3.5 text-neutral-600 dark:text-neutral-400">
                      {res.targetRole || 'General'}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                        {res.atsScore || 84}
                      </span>
                    </td>
                    <td className="p-3.5 text-neutral-400 font-mono text-[11px]">
                      {new Date(res.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right pr-4 space-x-2">
                      <button
                        onClick={() => { setActiveResume(res); navigate(`/resume-builder/${res.id}`); }}
                        className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => duplicateResume(res)}
                        className="p-1 rounded text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteResume(res.id)}
                        className="p-1 rounded text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
