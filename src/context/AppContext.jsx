import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { firestoreService } from '../services/firebase/firestoreService';
import { analyzeResumeATS } from '../services/ats/atsEngine';
import { calculateJobMatch } from '../services/jobMatcher/matchingEngine';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Hydrate resumes immediately from local storage to prevent reload flicker or resets
  const [resumes, setResumes] = useState(() => {
    try {
      const raw = localStorage.getItem('careerforge_db_resumes');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Hydrate activeResume immediately
  const [activeResume, setActiveResumeState] = useState(() => {
    try {
      const draft = localStorage.getItem('careerforge_current_draft');
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        if (parsedDraft && parsedDraft.personalInfo) return parsedDraft;
      }
      const activeId = localStorage.getItem('careerforge_active_resume_id');
      const raw = localStorage.getItem('careerforge_db_resumes');
      if (raw) {
        const list = JSON.parse(raw);
        if (activeId) {
          const found = list.find(r => r.id === activeId);
          if (found) return found;
        }
        if (list.length > 0) return list[0];
      }
    } catch (e) {}
    return null;
  });

  const setActiveResume = useCallback((res) => {
    setActiveResumeState(res);
    if (res) {
      try {
        localStorage.setItem('careerforge_active_resume_id', res.id || '');
        localStorage.setItem('careerforge_current_draft', JSON.stringify(res));
      } catch (e) {}
    }
  }, []);

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

      if (userResumes && userResumes.length > 0) {
        setResumes(userResumes);
        setActiveResumeState(prev => {
          if (prev) {
            const updatedMatch = userResumes.find(r => r.id === prev.id);
            return updatedMatch || prev;
          }
          return userResumes[0];
        });
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

  // Save/Update Resume (supports silent auto-save)
  const saveResume = async (resumeData, silent = false) => {
    const fallbackId = resumeData.id || 'resume_' + Date.now();
    const updatedResume = {
      ...resumeData,
      id: fallbackId,
      updatedAt: new Date().toISOString()
    };

    // Keep draft cached in storage immediately
    try {
      localStorage.setItem('careerforge_current_draft', JSON.stringify(updatedResume));
      localStorage.setItem('careerforge_active_resume_id', fallbackId);
    } catch (e) {}

    setActiveResumeState(updatedResume);

    if (!user) {
      setResumes(prev => {
        const idx = prev.findIndex(r => r.id === fallbackId);
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = updatedResume;
          return copy;
        }
        return [updatedResume, ...prev];
      });
      return updatedResume;
    }

    try {
      const saved = await firestoreService.saveResume(user.uid, updatedResume);
      setResumes(prev => {
        const idx = prev.findIndex(r => r.id === saved.id);
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = saved;
          return copy;
        }
        return [saved, ...prev];
      });
      setActiveResumeState(saved);
      if (!silent) {
        addNotification('Resume saved successfully', 'success');
      }
      return saved;
    } catch (err) {
      console.warn('saveResume cloud fallback:', err);
      if (!silent) {
        addNotification('Saved locally (offline mode)', 'info');
      }
      return updatedResume;
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

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('careerforge_theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('careerforge_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const createNewResume = (templateId = 'template_01') => {
    const newBlank = {
      name: 'Untitled_Resume.pdf',
      targetRole: 'Software Engineer',
      templateId,
      personalInfo: { fullName: user?.displayName || 'Alex Morgan', professionalTitle: 'Software Engineer', email: user?.email || 'alex.morgan@example.com', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
      summary: '',
      experience: [],
      education: [],
      skills: { programming: [], frameworks: [], tools: [], softSkills: [] },
      projects: [],
      certifications: [],
      languages: []
    };
    setActiveResume(null);
    return newBlank;
  };

  return (
    <AppContext.Provider value={{
      resumes,
      activeResume,
      setActiveResume,
      createNewResume,
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
      addNotification,
      clearNotifications,
      theme,
      setTheme,
      toggleTheme
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
