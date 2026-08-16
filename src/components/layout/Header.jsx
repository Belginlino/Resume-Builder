import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Menu, User, LogOut, Settings, HelpCircle, CheckCircle2, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const { setIsCommandPaletteOpen, notifications, clearNotifications, theme, toggleTheme, analyses } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const latestAnalysis = analyses?.[0];

  return (
    <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      
      {/* Left: Mobile Menu Button & Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-800/40 hover:bg-white dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all text-xs text-neutral-500 w-48 sm:w-64 md:w-80 shrink-0 text-left select-none shadow-2xs"
        >
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <span className="truncate flex-1 text-neutral-400">Search or type command...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 ml-auto px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-400 shrink-0 whitespace-nowrap leading-none select-none">
            <span>Ctrl</span>
            <span>K</span>
          </kbd>
        </button>
      </div>

      {/* Right: Theme Toggle, Notifications & Profile */}
      <div className="flex items-center gap-2">
        {/* Dark / Light Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800 font-medium text-neutral-900 dark:text-white">
                <span>Notifications</span>
                <button
                  onClick={clearNotifications}
                  className="text-[10px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 font-medium"
                >
                  Clear all
                </button>
              </div>
              <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="flex gap-2.5 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">{n.message}</p>
                        <p className="text-neutral-400 text-[10px]">{n.type.toUpperCase()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-2.5 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-800 dark:text-neutral-200">
                        {latestAnalysis ? `Latest ATS Analysis: ${latestAnalysis.atsScore}/100` : 'ATS System Operational'}
                      </p>
                      <p className="text-neutral-500 text-[11px]">
                        {latestAnalysis ? (latestAnalysis.compatibilityLabel || 'ATS Analysis Completed') : 'Resume parser and scanner active.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1"></div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-semibold text-xs overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                (user?.displayName || user?.email || 'A').slice(0, 2).toUpperCase()
              )}
            </div>
            <span className="hidden md:inline-block text-xs font-medium text-neutral-800 dark:text-neutral-200">
              {user?.displayName || user?.email?.split('@')[0] || 'Alex Morgan'}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                <p className="font-medium text-neutral-900 dark:text-white">{user?.displayName || 'User'}</p>
                <p className="text-neutral-400 truncate">{user?.email || 'user@example.com'}</p>
              </div>
              <button
                onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Account Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

