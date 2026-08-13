import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Scan, 
  FileText, 
  Cpu, 
  Layers, 
  Zap, 
  Check,
  TrendingUp,
  Search,
  Lock
} from 'lucide-react';
import { demoTemplates } from '../../data/demoData';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#F8F8F6]/90 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              CF
            </div>
            <span className="font-semibold text-neutral-900 text-base tracking-tight">CareerForge</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-600">
            <a href="#analyzer" className="hover:text-neutral-900 transition-colors">Resume Analyzer</a>
            <a href="#builder" className="hover:text-neutral-900 transition-colors">Resume Builder</a>
            <a href="#job-matcher" className="hover:text-neutral-900 transition-colors">Job Matcher</a>
            <a href="#templates" className="hover:text-neutral-900 transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-neutral-900 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/60 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Analyze My Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-16 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200/70 border border-neutral-300 text-[11px] font-medium text-neutral-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>92% Parsing Reliability Verified Across Greenhouse, Workday & Taleo</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
            Build a resume that <br className="hidden sm:inline" />
            gets noticed.
          </h1>

          <p className="text-base md:text-lg text-neutral-600 leading-relaxed font-normal">
            Analyze your resume against ATS requirements, optimize keywords, match with targeted job descriptions, and create professionally formatted resumes engineered for modern hiring systems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/analyzer')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Scan className="w-4 h-4" />
              <span>Analyze Resume</span>
            </button>
            <button
              onClick={() => navigate('/resume-builder')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-50 transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Build Resume</span>
            </button>
          </div>
        </div>

        {/* Realistic Product Preview Mockup */}
        <div className="mt-14 max-w-5xl mx-auto rounded-xl border border-neutral-300 bg-white p-4 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <span className="ml-2 text-xs font-mono text-neutral-400">careerforge.app/analyzer/report</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[11px]">ATS Score: 84/100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Score Card */}
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-neutral-500">ATS Score</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-bold text-neutral-900 font-mono">84</span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Strong</span>
                </div>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  High text extraction fidelity. Standard headings detected.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-200 text-xs space-y-1.5">
                <div className="flex justify-between text-neutral-600">
                  <span>ATS Compatibility</span>
                  <span className="font-mono text-neutral-900">92%</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-neutral-900 h-full w-[92%]"></div>
                </div>
              </div>
            </div>

            {/* Keyword Card */}
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
              <p className="text-xs font-semibold uppercase text-neutral-500 mb-3">Job Description Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded text-xs bg-emerald-100 text-emerald-800 font-medium">React ✓</span>
                <span className="px-2 py-1 rounded text-xs bg-emerald-100 text-emerald-800 font-medium">TypeScript ✓</span>
                <span className="px-2 py-1 rounded text-xs bg-emerald-100 text-emerald-800 font-medium">REST APIs ✓</span>
                <span className="px-2 py-1 rounded text-xs bg-rose-100 text-rose-800 font-medium">Docker ✗</span>
                <span className="px-2 py-1 rounded text-xs bg-rose-100 text-rose-800 font-medium">GraphQL ✗</span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
              <p className="text-xs font-semibold uppercase text-neutral-500 mb-2">Recommended Fix</p>
              <p className="text-xs text-neutral-800 font-medium leading-normal">
                "Add measurable results to your experience bullet points under Vanguard Digital Solutions."
              </p>
              <span className="inline-block mt-3 text-[11px] text-blue-600 font-medium cursor-pointer hover:underline">
                Apply Fix in Resume Builder →
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Trusted Workflow */}
      <section className="py-16 bg-white border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Trusted Workflow</h2>
            <p className="text-2xl font-bold text-neutral-900 mt-1">Four simple steps to your target offer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Upload', desc: 'Drop your current PDF or DOCX resume for immediate parsing.' },
              { num: '02', title: 'Analyze', desc: 'Scan against 6 ATS parsing metrics and keyword coverage thresholds.' },
              { num: '03', title: 'Optimize', desc: 'Use non-hallucinating AI prompts to strengthen action verbs and impact.' },
              { num: '04', title: 'Apply', desc: 'Export ATS-safe A4 PDFs formatted for maximum screener accuracy.' },
            ].map((step, idx) => (
              <div key={idx} className="p-5 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2">
                <span className="font-mono text-xs font-bold text-neutral-400">{step.num}</span>
                <h3 className="text-base font-semibold text-neutral-900">{step.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why CareerForge */}
      <section id="analyzer" className="py-20 max-w-7xl mx-auto px-6 space-y-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Why CareerForge?</h2>
          <p className="text-neutral-600 text-sm mt-2">
            Designed by product engineers and recruiters to eliminate automated rejection loops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-white border border-neutral-200 space-y-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-neutral-900">Explainable ATS Scoring</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We provide explainable compatibility metrics rather than arbitrary percentage promises. Identify column traps, standard section gaps, and missing keywords before submitting.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-neutral-200 space-y-3">
            <Cpu className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-neutral-900">Weighted Job Matching</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Compare your resume against any target job description. Get precise breakdown scores for required skills, experience alignment, and missing keyword tags.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-neutral-200 space-y-3">
            <FileText className="w-6 h-6 text-neutral-900" />
            <h3 className="text-lg font-semibold text-neutral-900">ATS-Safe Templates</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              No photos, zero complex columns, and no hidden text frames. Designed strictly around standard section hierarchies for seamless text extraction.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Templates Preview */}
      <section id="templates" className="py-16 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Professional ATS-Safe Templates</h2>
              <p className="text-xs text-neutral-600 mt-1">Single column and clean layouts engineered for maximum parsing reliability.</p>
            </div>
            <button
              onClick={() => navigate('/templates')}
              className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
            >
              <span>View All Templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoTemplates.slice(0, 3).map((tpl) => (
              <div key={tpl.id} className="group rounded-xl border border-neutral-200 bg-neutral-50 p-5 hover:border-neutral-900 transition-all space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-neutral-900">{tpl.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-semibold">
                    ATS Safe
                  </span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">{tpl.tagline}</p>
                <div className="h-32 rounded bg-white border border-neutral-200 p-3 flex flex-col justify-between text-[8px] text-neutral-400 font-mono select-none pointer-events-none">
                  <div className="border-b border-neutral-200 pb-1">NAME | EMAIL | PHONE</div>
                  <div className="space-y-1">
                    <div className="h-1 bg-neutral-200 rounded w-full"></div>
                    <div className="h-1 bg-neutral-200 rounded w-3/4"></div>
                  </div>
                  <div className="border-t border-neutral-200 pt-1">EXPERIENCE & SKILLS</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer CTA */}
      <section className="py-20 bg-neutral-900 text-white text-center px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to optimize your next job application?</h2>
          <p className="text-neutral-400 text-sm">
            Analyze your existing resume in under 30 seconds or build a brand new ATS-ready resume from scratch.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-lg text-sm font-semibold bg-white text-neutral-900 hover:bg-neutral-100 transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 bg-neutral-950 border-t border-neutral-800 text-neutral-500 text-xs px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">CareerForge</span>
            <span>© {new Date().getFullYear()} CareerForge Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-neutral-300">Privacy Policy</a>
            <a href="#terms" className="hover:text-neutral-300">Terms of Service</a>
            <a href="#security" className="hover:text-neutral-300">ATS Security Standard</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
