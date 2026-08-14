import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { clearLocalData } from '../../services/firebase/firestoreService';
import { User, ShieldCheck, Moon, Sun, Trash2, LogOut, Save, RefreshCw } from 'lucide-react';
import { demoTemplates } from '../../data/demoData';

export const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { addNotification } = useApp();

  const [displayName, setDisplayName] = useState(user?.displayName || 'Alex Morgan');
  const [defaultRole, setDefaultRole] = useState('Senior Frontend Engineer');
  const [defaultTemplate, setDefaultTemplate] = useState('template_01');
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('careerforge_theme') || 'light';
  });

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('careerforge_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('careerforge_theme', 'light');
    }
    addNotification(`Theme switched to ${theme} mode`, 'info');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addNotification('Settings and preferences saved successfully', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all resumes, analyses, and saved jobs to default demo data?')) {
      clearLocalData();
      addNotification('Local database reset to defaults. Reloading...', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl pb-16">
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Account & Application Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-1">Manage your profile, theme mode, ATS preferences, and data privacy.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Profile Details */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-neutral-500" />
            <span>Profile Details</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || 'alex.morgan@example.com'}
                className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800/40 text-neutral-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Appearance & Theme */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-neutral-500" />
            <span>Appearance & Theme</span>
          </h2>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`flex-1 p-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${currentTheme === 'light' ? 'border-neutral-900 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white' : 'border-neutral-200 dark:border-neutral-800 text-neutral-500'}`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Mode</span>
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 p-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${currentTheme === 'dark' ? 'border-neutral-900 bg-neutral-800 text-white' : 'border-neutral-200 dark:border-neutral-800 text-neutral-500'}`}
            >
              <Moon className="w-4 h-4 text-blue-400" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        {/* ATS Preferences */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neutral-500" />
            <span>ATS Builder Preferences</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Default Target Role</label>
              <input
                type="text"
                value={defaultRole}
                onChange={(e) => setDefaultRole(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Default Resume Template</label>
              <select
                value={defaultTemplate}
                onChange={(e) => setDefaultTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              >
                {demoTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name} (ATS Safe)</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Privacy & Danger Zone */}
        <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-rose-200 dark:border-rose-950 space-y-4">
          <h2 className="text-sm font-bold text-rose-700 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            <span>Privacy & Data Controls</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Uploaded resumes and parsing history are private to your user account.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleResetData}
              className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Demo Data</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg text-xs font-semibold hover:bg-neutral-800 flex items-center gap-2 shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>

      </form>

    </div>
  );
};

