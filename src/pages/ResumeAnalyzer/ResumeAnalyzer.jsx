import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { extractTextFromPDF } from '../../services/parsers/pdfParser';
import { extractTextFromDOCX } from '../../services/parsers/docxParser';
import { parseRawResumeText } from '../../services/parsers/sectionExtractor';
import { 
  Upload, 
  FileText, 
  Scan, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  ShieldCheck,
  Tag,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResumeAnalyzer = () => {
  const { runATSAnalysis, activeAnalysis, saveResume } = useApp();
  const navigate = useNavigate();

  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [jobDescriptionInput, setJobDescriptionInput] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState(activeAnalysis);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'issues' | 'keywords'
  const [keywordFilter, setKeywordFilter] = useState('all'); // 'all' | 'found' | 'missing'

  // Drag & drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setAnalyzing(true);
    setUploadProgress(20);

    try {
      let extractedData = { text: '', metadata: {} };
      const ext = file.name.split('.').pop().toLowerCase();

      if (ext === 'pdf') {
        extractedData = await extractTextFromPDF(file);
      } else if (ext === 'docx') {
        extractedData = await extractTextFromDOCX(file);
      } else {
        throw new Error('Unsupported file format. Please upload a valid PDF or DOCX resume file.');
      }

      setUploadProgress(60);

      // Parse structured sections
      const parsedResume = parseRawResumeText(extractedData.text);
      parsedResume.name = file.name;
      parsedResume.targetRole = 'Senior Frontend Engineer';

      setUploadProgress(85);

      // Run ATS Engine
      const analysisResult = await runATSAnalysis(parsedResume, jobDescriptionInput);
      
      // Save parsed resume to user list
      await saveResume({
        ...parsedResume,
        atsScore: analysisResult.atsScore
      });

      setCurrentAnalysis(analysisResult);
      setUploadProgress(100);
    } catch (err) {
      alert(err.message || 'Error processing resume file.');
    } finally {
      setAnalyzing(false);
    }
  };

  const analysis = currentAnalysis || activeAnalysis;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          ATS Resume Analyzer & Scanner
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Upload your resume file to test ATS compatibility, detect keyword gaps, and receive actionable fixes.
        </p>
      </div>

      {/* Upload Zone */}
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all bg-white dark:bg-neutral-900
          ${dragActive ? 'border-neutral-900 bg-neutral-50 dark:bg-neutral-800' : 'border-neutral-300 dark:border-neutral-800'}
        `}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-600 dark:text-neutral-300">
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">Upload your resume file</h3>
            <p className="text-xs text-neutral-500 mt-1">Drop your PDF or DOCX file here or browse from your device.</p>
          </div>

          <div className="flex justify-center">
            <label className="cursor-pointer px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-all shadow-xs inline-flex items-center gap-2">
              <span>Browse Files</span>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <p className="text-[11px] text-neutral-400">Supported formats: PDF, DOCX (Max 10MB)</p>
        </div>

        {analyzing && (
          <div className="mt-6 max-w-xs mx-auto space-y-2">
            <div className="flex justify-between text-xs text-neutral-600 font-mono">
              <span>Extracting & Evaluating...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div className="bg-neutral-900 dark:bg-white h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Target Job Description Optional Input */}
      <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          Target Job Description (Optional for Tailored Keyword Scan)
        </label>
        <textarea
          rows={2}
          value={jobDescriptionInput}
          onChange={(e) => setJobDescriptionInput(e.target.value)}
          placeholder="Paste targeted job description text here to compare required keywords against your resume..."
          className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
        />
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div className="space-y-6">
          
          {/* Top Score Banner */}
          <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-mono font-medium text-neutral-500">{analysis.resumeName || 'Software_Developer_Resume.pdf'}</span>
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Resume Analysis Report</h2>
              <p className="text-xs text-neutral-500">Evaluated on {new Date(analysis.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="text-center">
                <span className="text-4xl font-bold font-mono text-neutral-900 dark:text-white">
                  {analysis.atsScore}
                </span>
                <span className="text-xs text-neutral-400 font-mono">/ 100</span>
              </div>
              <div className="border-l border-neutral-200 dark:border-neutral-700 pl-4">
                <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {analysis.compatibilityLabel || 'Strong ATS Compatibility'}
                </span>
                <p className="text-[11px] text-neutral-500 mt-1">High text extraction reliability.</p>
              </div>
            </div>
          </div>

          {/* Sub-Score Breakdown Bars */}
          <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Score Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { label: 'ATS Compatibility', val: analysis.scores?.atsCompatibility || 92 },
                { label: 'Keyword Match', val: analysis.scores?.keywordMatch || 78 },
                { label: 'Content Quality', val: analysis.scores?.contentQuality || 85 },
                { label: 'Skills Coverage', val: analysis.scores?.skillsCoverage || 81 },
                { label: 'Formatting', val: analysis.scores?.formatting || 94 },
              ].map((s, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <span className="truncate">{s.label}</span>
                    <span className="font-mono text-neutral-900 dark:text-white font-semibold">{s.val}</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-neutral-900 dark:bg-white h-full" style={{ width: `${s.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs Control */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-6 text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 transition-colors border-b-2 ${activeTab === 'overview' ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white font-semibold' : 'border-transparent text-neutral-500'}`}
            >
              Issues & Fixes
            </button>
            <button
              onClick={() => setActiveTab('keywords')}
              className={`pb-2.5 transition-colors border-b-2 ${activeTab === 'keywords' ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white font-semibold' : 'border-transparent text-neutral-500'}`}
            >
              Keyword Analysis ({analysis.keywordDistribution?.length || 0})
            </button>
          </div>

          {/* Tab 1: Issues & Fixes */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Critical Issues */}
              {(analysis.criticalIssues || []).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Critical Issues ({(analysis.criticalIssues || []).length})</span>
                  </h3>
                  {analysis.criticalIssues.map((issue, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-rose-900 text-sm">{issue.title}</span>
                        <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-800 font-mono text-[10px] uppercase font-bold">
                          {issue.severity} Severity
                        </span>
                      </div>
                      <p className="text-neutral-700">{issue.explanation}</p>
                      {issue.whyItMatters && (
                        <p className="text-neutral-500 italic">Why it matters: {issue.whyItMatters}</p>
                      )}
                      <div className="pt-2 border-t border-rose-200 text-rose-900 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-rose-600" />
                        <span>Recommended Fix: {issue.recommendedFix}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Improvements */}
              {(analysis.improvements || []).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    <span>Recommended Improvements ({(analysis.improvements || []).length})</span>
                  </h3>
                  {analysis.improvements.map((imp, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-2">
                      <span className="font-semibold text-amber-950 text-sm">{imp.title}</span>
                      <p className="text-neutral-700">{imp.explanation}</p>
                      <div className="pt-2 border-t border-amber-200 text-amber-900 font-medium">
                        Fix: {imp.recommendedFix}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Strengths */}
              {(analysis.strengths || []).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resume Strengths</span>
                  </h3>
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2 text-xs text-emerald-950">
                    {analysis.strengths.map((str, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Tab 2: Keyword Analyzer */}
          {activeTab === 'keywords' && (
            <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Required Keywords</h3>
                <div className="flex gap-2 text-xs">
                  {['all', 'found', 'missing'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setKeywordFilter(f)}
                      className={`px-2.5 py-1 rounded capitalize font-medium ${keywordFilter === f ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(analysis.keywordDistribution || [])
                  .filter(k => keywordFilter === 'all' || k.status === keywordFilter)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs flex justify-between items-center ${item.status === 'found' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'}`}
                    >
                      <span className="font-medium">{item.keyword}</span>
                      <span className="font-mono text-[10px] font-bold uppercase">
                        {item.status === 'found' ? `Found (${item.count})` : 'Missing'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
