import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, FileText, Scan, Layers, Settings, ArrowRight, X, Cpu } from 'lucide-react';

export const CommandPalette = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, resumes, jobs } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const quickLinks = [
    { label: 'Go to Dashboard', path: '/dashboard', icon: Layers },
    { label: 'Create New Resume', path: '/resume-builder', icon: FileText },
    { label: 'Scan Resume ATS', path: '/analyzer', icon: Scan },
    { label: 'Match Job Description', path: '/job-matcher', icon: Cpu },
    { label: 'Browse ATS Templates', path: '/templates', icon: Layers },
    { label: 'Account Settings', path: '/settings', icon: Settings },
  ];

  const filteredResumes = resumes.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase()) || 
    (r.targetRole || '').toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    setIsCommandPaletteOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search resumes, jobs, or commands (e.g. 'Build resume')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none"
            autoFocus
          />
          <button 
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-neutral-100 dark:divide-neutral-800">
          {/* Quick Actions */}
          <div className="py-2">
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Quick Navigation
            </div>
            {quickLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white" />
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>

          {/* Resumes Match */}
          {filteredResumes.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Your Resumes
              </div>
              {filteredResumes.map((res) => (
                <button
                  key={res.id}
                  onClick={() => handleSelect(`/resume-builder/${res.id}`)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{res.name}</span>
                    <span className="text-xs text-neutral-400">({res.targetRole || 'General'})</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono">
                    ATS {res.atsScore || 82}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>Use <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-mono text-[10px] whitespace-nowrap">Ctrl + K</kbd> anytime</span>
          <span>Press <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-mono text-[10px] whitespace-nowrap">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
