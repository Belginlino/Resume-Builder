import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Scan, 
  PlusCircle, 
  Cpu, 
  Layers, 
  Settings, 
  HelpCircle, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Tag
} from 'lucide-react';

export const Sidebar = ({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) => {
  
  const workspaceNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Resumes', path: '/resumes', icon: FileText },
    { label: 'Resume Analyzer', path: '/analyzer', icon: Scan },
    { label: 'Resume Builder', path: '/resume-builder', icon: PlusCircle },
    { label: 'Job Matcher', path: '/job-matcher', icon: Cpu },
    { label: 'Templates', path: '/templates', icon: Layers },
  ];

  const toolsNav = [
    { label: 'ATS Scanner', path: '/analyzer', icon: ShieldCheck },
    { label: 'Keyword Analyzer', path: '/analyzer', icon: Tag },
  ];

  const accountNav = [
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const navClass = ({ isActive }) => `
    flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150
    ${isActive 
      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs' 
      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between transition-all duration-300
        ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        ${collapsed ? 'md:w-16' : 'md:w-60'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shrink-0 shadow-xs">
                CF
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="flex flex-col">
                  <span className="font-semibold text-neutral-900 dark:text-white text-sm tracking-tight">CareerForge</span>
                  <span className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase">ATS Intelligence</span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-6">
            
            {/* Workspace Section */}
            <div>
              {(!collapsed || mobileOpen) && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Workspace
                </p>
              )}
              <nav className="space-y-1">
                {workspaceNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onCloseMobile}
                      className={navClass}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Tools Section */}
            <div>
              {(!collapsed || mobileOpen) && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Tools
                </p>
              )}
              <nav className="space-y-1">
                {toolsNav.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={idx}
                      to={item.path}
                      onClick={onCloseMobile}
                      className={navClass}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Account Section */}
            <div>
              {(!collapsed || mobileOpen) && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Account
                </p>
              )}
              <nav className="space-y-1">
                {accountNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onCloseMobile}
                      className={navClass}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

          </div>
        </div>

        {/* Footer upgrade / info pill */}
        {(!collapsed || mobileOpen) && (
          <div className="p-3 border-t border-neutral-100 dark:border-neutral-800">
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/50 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>ATS Optimization</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-tight">
                92% parsing accuracy verified across major hiring systems.
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
