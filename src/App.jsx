import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { LandingPage } from './pages/Landing/LandingPage';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer/ResumeAnalyzer';
import { ResumeBuilder } from './pages/ResumeBuilder/ResumeBuilder';
import { JobMatcher } from './pages/JobMatcher/JobMatcher';
import { TemplatesPage } from './pages/Templates/TemplatesPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Authenticated Application Workspace */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resumes" element={<Dashboard />} />
              <Route path="/resumes/:id" element={<ResumeBuilder />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/resume-builder/:id" element={<ResumeBuilder />} />
              <Route path="/analyzer" element={<ResumeAnalyzer />} />
              <Route path="/analyzer/:id" element={<ResumeAnalyzer />} />
              <Route path="/job-matcher" element={<JobMatcher />} />
              <Route path="/jobs" element={<JobMatcher />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}
export default App;
