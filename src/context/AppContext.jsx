import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { firestoreService } from '../services/firebase/firestoreService';
import { analyzeResumeATS } from '../services/ats/atsEngine';
import { calculateJobMatch } from '../services/jobMatcher/matchingEngine';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [activeResume, setActiveResume] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch initial user data
  const loadUserData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userResumes = await firestoreService.getResumes(user.uid);
      const userAnalyses = await firestoreService.getAnalyses(user.uid);
      const userJobs = await firestoreService.getJobs(user.uid);

      setResumes(userResumes);
      if (userResumes.length > 0 && !activeResume) {
        setActiveResume(userResumes[0]);
      }

      setAnalyses(userAnalyses);
      if (userAnalyses.length > 0 && !activeAnalysis) {
        setActiveAnalysis(userAnalyses[0]);
      }

      setJobs(userJobs);
      if (userJobs.length > 0 && !activeJob) {
        setActiveJob(userJobs[0]);
      }
    } catch (err) {
      console.error("Error loading user data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Notifications Toast helper
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // Save/Update Resume
  const saveResume = async (resumeData) => {
    if (!user) return null;
    try {
      const saved = await firestoreService.saveResume(user.uid, resumeData);
      setResumes(prev => {
        const idx = prev.findIndex(r => r.id === saved.id);
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = saved;
          return copy;
        }
        return [saved, ...prev];
      });
      setActiveResume(saved);
      addNotification('Resume saved successfully', 'success');
      return saved;
    } catch (err) {
      addNotification('Failed to save resume', 'error');
      throw err;
    }
  };

  // Delete Resume
  const deleteResume = async (resumeId) => {
    if (!user) return;
    try {
      await firestoreService.deleteResume(user.uid, resumeId);
      setResumes(prev => prev.filter(r => r.id !== resumeId));
      if (activeResume?.id === resumeId) {
        setActiveResume(resumes.find(r => r.id !== resumeId) || null);
      }
      addNotification('Resume deleted', 'info');
    } catch (err) {
      addNotification('Could not delete resume', 'error');
    }
  };

  // Run ATS Analysis on a resume
  const runATSAnalysis = async (resumeObj, jobDescriptionText = '') => {
    if (!user) return null;
    try {
      const result = analyzeResumeATS(resumeObj, jobDescriptionText);
      const payload = {
        resumeId: resumeObj.id || 'uploaded_resume',
        resumeName: resumeObj.name || 'Resume',
        ...result
      };

      const saved = await firestoreService.saveAnalysis(user.uid, payload);
      setAnalyses(prev => [saved, ...prev]);
      setActiveAnalysis(saved);
      addNotification('ATS Analysis completed', 'success');
      return saved;
    } catch (err) {
      addNotification('ATS Analysis failed. Please try again.', 'error');
      throw err;
    }
  };

  // Run Job Matching
  const runJobMatch = async (resumeObj, jobDescriptionText, companyName = 'Target Company') => {
    if (!user) return null;
    try {
      const result = calculateJobMatch(resumeObj, jobDescriptionText, companyName);
      const saved = await firestoreService.saveJob(user.uid, result);
      setJobs(prev => [saved, ...prev]);
      setActiveJob(saved);
      addNotification(`Job Match calculation finished (${result.matchScore}% Match)`, 'success');
      return saved;
    } catch (err) {
      addNotification('Job match processing error', 'error');
      throw err;
    }
  };

  // Duplicate Resume
  const duplicateResume = async (resumeToDup) => {
    const duplicatedData = {
      ...resumeToDup,
      id: undefined,
      name: `${resumeToDup.name || 'Resume'} (Copy)`,
      updatedAt: new Date().toISOString()
    };
    return await saveResume(duplicatedData);
  };

  return (
    <AppContext.Provider value={{
      resumes,
      activeResume,
      setActiveResume,
      saveResume,
      deleteResume,
      duplicateResume,
      analyses,
      activeAnalysis,
      setActiveAnalysis,
      runATSAnalysis,
      jobs,
      activeJob,
      setActiveJob,
      runJobMatch,
      loading,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      notifications,
      addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
