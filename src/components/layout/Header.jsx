import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Menu, User, LogOut, Settings, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const { setIsCommandPaletteOpen, notifications } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      
      {/* Left: Mobile Menu Button & Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 hover:border-neutral-300 hover:bg-white transition-all text-xs md:text-sm w-48 md:w-72"
        >
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <span className="truncate">Search or type command...</span>
          <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-400">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-2">
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
                <span className="text-[10px] text-neutral-400">Clear all</span>
              </div>
              <div className="py-2 space-y-2">
                <div className="flex gap-2.5 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-800 dark:text-neutral-200">ATS Analysis Complete</p>
                    <p className="text-neutral-500 text-[11px]">Senior Frontend Developer resume achieved an ATS score of 84/100.</p>
                  </div>
                </div>
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
