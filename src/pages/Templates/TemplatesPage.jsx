import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { demoTemplates } from '../../data/demoData';
import { ShieldCheck, ArrowRight, CheckCircle2, FileText } from 'lucide-react';

export const TemplatesPage = () => {
  const navigate = useNavigate();
  const { activeResume, saveResume } = useApp();

  const handleSelectTemplate = async (templateId) => {
    if (activeResume) {
      await saveResume({ ...activeResume, templateId });
      navigate(`/resume-builder/${activeResume.id}`);
    } else {
      navigate('/resume-builder');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Parser Tested Standard Layouts</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          ATS-Safe Professional Templates
        </h1>
        <p className="text-xs text-neutral-500 mt-1 max-w-xl">
          Designed strictly with standard section headers, clean typography, and zero layout traps (tables, columns, headers) that cause text extraction errors in applicant tracking software.
        </p>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoTemplates.map((tpl) => (
          <div 
            key={tpl.id}
            className="group p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-500 transition-all shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-neutral-900 dark:text-white">{tpl.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  ATS Safe
                </span>
              </div>
              <p className="text-xs font-medium text-neutral-500">{tpl.tagline}</p>
              <p className="text-xs text-neutral-400 leading-relaxed">{tpl.description}</p>
            </div>

            {/* Template visual mockup representation */}
            <div className="h-44 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/50 p-4 space-y-2 select-none">
              <div className="border-b border-neutral-300 dark:border-neutral-700 pb-1 flex justify-between items-center text-[9px] font-mono text-neutral-600 dark:text-neutral-300 font-bold">
                <span>FULL NAME</span>
                <span>TITLE</span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded w-4/5"></div>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-1 space-y-1">
                <div className="text-[8px] font-bold text-neutral-400">WORK EXPERIENCE</div>
                <div className="h-1 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                <div className="h-1 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
              </div>
            </div>

            <button
              onClick={() => handleSelectTemplate(tpl.id)}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Use {tpl.name} Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
