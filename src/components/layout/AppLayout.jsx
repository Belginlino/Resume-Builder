import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CommandPalette } from '../common/CommandPalette';
import { ToastNotifications } from '../common/ToastNotifications';

export const AppLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8F8F6] text-neutral-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
          <span className="text-xs font-mono tracking-wider text-neutral-500 uppercase">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#F8F8F6] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        
        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Utilities */}
      <CommandPalette />
      <ToastNotifications />
    </div>
  );
};
