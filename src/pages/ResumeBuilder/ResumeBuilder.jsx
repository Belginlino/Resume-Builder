import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { 
  exportResumeToPDF, 
  printResume, 
  exportResumeToPlainText, 
  exportResumeToJSON 
} from '../../services/pdfExport';
import { ResumeRenderer } from '../../components/templates/ResumeTemplates';
import { 
  FileText, 
  Save, 
  Download, 
  Printer, 
  Sparkles, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Edit3,
  Layers,
  FileCode,
  Copy,
  RefreshCw,
  X,
  BookOpen,
  Code,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Cloud,
  Loader2
} from 'lucide-react';
import { demoTemplates, demoResumes } from '../../data/demoData';

export const ResumeBuilder = () => {
  const { id } = useParams();
  const { resumes, activeResume, saveResume, setActiveResume, addNotification, createNewResume } = useApp();
  const navigate = useNavigate();

  // Mobile View Tab state ('editor' | 'preview')
  const [mobileTab, setMobileTab] = useState('editor');

  // Active Collapsible Section State
  const [openSections, setOpenSections] = useState({
    personal: true,
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: false,
    certifications: false,
    languages: false
  });

  // Current Resume Form State (hydrates from matching resume, active draft, or demo)
  const [resumeData, setResumeData] = useState(() => {
    if (id) {
      const found = resumes.find(r => r.id === id);
      if (found) return JSON.parse(JSON.stringify(found));
    }
    try {
      const draft = localStorage.getItem('careerforge_current_draft');
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        if (parsedDraft && parsedDraft.personalInfo && (!id || parsedDraft.id === id)) {
          return parsedDraft;
        }
      }
    } catch (e) {}

    const fallback = (id ? null : activeResume) || resumes[0] || demoResumes[0];
    return fallback ? JSON.parse(JSON.stringify(fallback)) : {
      name: 'Untitled_Resume.pdf',
      targetRole: 'Senior Software Engineer',
      templateId: 'template_01',
      personalInfo: { fullName: '', professionalTitle: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
      summary: '',
      experience: [],
      education: [],
      skills: { programming: [], frameworks: [], tools: [], softSkills: [] },
      projects: [],
      certifications: [],
      languages: []
    };
  });

  const resumeDataRef = useRef(resumeData);
  resumeDataRef.current = resumeData;
  const isMountedRef = useRef(false);
  const autoSaveTimerRef = useRef(null);

  // Track the ID of the resume that has been loaded into state
  const loadedIdRef = useRef(id || null);

  // React ONLY when the route parameter `id` changes
  useEffect(() => {
    if (id && id !== loadedIdRef.current) {
      loadedIdRef.current = id;
      const match = resumes.find(r => r.id === id);
      if (match) {
        setResumeData(JSON.parse(JSON.stringify(match)));
      }
    }
  }, [id, resumes]);

  const [saving, setSaving] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState('Saved to Cloud');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedbackMessage, setAiFeedbackMessage] = useState('');

  // Continuous real-time debounced auto-save to Cloud (Firebase) + Local Storage
  useEffect(() => {
    // 1. Immediately cache in localStorage synchronously (< 0.1ms) so instant reload/refresh loses 0 details
    try {
      localStorage.setItem('careerforge_current_draft', JSON.stringify(resumeData));
      if (resumeData.id) {
        localStorage.setItem('careerforge_active_resume_id', resumeData.id);
      }
    } catch (e) {}

    // Skip cloud network request on initial mount
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    // 2. Debounce save to Cloud / Firebase Firestore
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      setLastSavedTime('Saving...');
      try {
        await saveResume(resumeData, true);
        setLastSavedTime(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
      } catch (err) {
        setLastSavedTime(`Saved locally at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      }
    }, 1200);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [resumeData, saveResume]);

  // Flush save on page navigation / unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      if (resumeDataRef.current) {
        try {
          localStorage.setItem('careerforge_current_draft', JSON.stringify(resumeDataRef.current));
          saveResume(resumeDataRef.current, true).catch(() => {});
        } catch (e) {}
      }
    };
  }, [saveResume]);

  // Flush draft on window refresh/close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (resumeDataRef.current) {
        try {
          localStorage.setItem('careerforge_current_draft', JSON.stringify(resumeDataRef.current));
        } catch (e) {}
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
  
  // Skill tag input states
  const [newSkillInput, setNewSkillInput] = useState({ category: 'programming', tag: '' });

  const handleDownloadPDF = async () => {
    setExportingPdf(true);
    try {
      const rawName = resumeData.name || 'Resume';
      const baseName = rawName.replace(/\.pdf$/i, '');
      const success = await exportResumeToPDF('resume-builder-preview-box', `${baseName}.pdf`);
      if (success) {
        addNotification('PDF downloaded successfully!', 'success');
      }
    } catch (err) {
      console.error('PDF export error:', err);
      addNotification('Failed to generate PDF. Opening print dialog.', 'error');
    } finally {
      setExportingPdf(false);
    }
  };


  // Handle nested object changes
  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...(prev.personalInfo || {}), [field]: value }
    }));
  };

  // ----------------------------------------------------
  // Work Experience Handlers
  // ----------------------------------------------------
  const addExperience = () => {
    const newExp = {
      id: 'exp_' + Date.now(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      currentPosition: false,
      description: '',
      achievements: ['']
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), newExp]
    }));
    setOpenSections(prev => ({ ...prev, experience: true }));
  };

  const updateExperience = (index, field, value) => {
    setResumeData(prev => {
      const copy = [...(prev.experience || [])];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, experience: copy };
    });
  };

  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addAchievementBullet = (expIndex) => {
    setResumeData(prev => {
      const copy = [...(prev.experience || [])];
      copy[expIndex].achievements = [...(copy[expIndex].achievements || []), ''];
      return { ...prev, experience: copy };
    });
  };

  const updateAchievementBullet = (expIndex, bulletIndex, val) => {
    setResumeData(prev => {
      const copy = [...(prev.experience || [])];
      copy[expIndex].achievements[bulletIndex] = val;
      return { ...prev, experience: copy };
    });
  };

  const removeAchievementBullet = (expIndex, bulletIndex) => {
    setResumeData(prev => {
      const copy = [...(prev.experience || [])];
      copy[expIndex].achievements = copy[expIndex].achievements.filter((_, i) => i !== bulletIndex);
      return { ...prev, experience: copy };
    });
  };

  // ----------------------------------------------------
  // Education Handlers
  // ----------------------------------------------------
  const addEducation = () => {
    const newEdu = {
      id: 'edu_' + Date.now(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      coursework: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...(prev.education || []), newEdu]
    }));
    setOpenSections(prev => ({ ...prev, education: true }));
  };

  const updateEducation = (index, field, value) => {
    setResumeData(prev => {
      const copy = [...(prev.education || [])];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, education: copy };
    });
  };

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // ----------------------------------------------------
  // Skills Handlers
  // ----------------------------------------------------
  const addSkillTag = (category, tag) => {
    const trimmed = (tag || '').trim();
    if (!trimmed) return;

    setResumeData(prev => {
      const currentSkills = prev.skills || {};
      if (Array.isArray(currentSkills)) {
        if (!currentSkills.includes(trimmed)) {
          return { ...prev, skills: [...currentSkills, trimmed] };
        }
        return prev;
      }

      const list = currentSkills[category] || [];
      if (!list.includes(trimmed)) {
        return {
          ...prev,
          skills: {
            ...currentSkills,
            [category]: [...list, trimmed]
          }
        };
      }
      return prev;
    });

    setNewSkillInput(prev => ({ ...prev, tag: '' }));
  };

  const removeSkillTag = (category, tagToRemove) => {
    setResumeData(prev => {
      const currentSkills = prev.skills || {};
      if (Array.isArray(currentSkills)) {
        return { ...prev, skills: currentSkills.filter(s => s !== tagToRemove) };
      }
      return {
        ...prev,
        skills: {
          ...currentSkills,
          [category]: (currentSkills[category] || []).filter(s => s !== tagToRemove)
        }
      };
    });
  };

  // ----------------------------------------------------
  // Projects Handlers
  // ----------------------------------------------------
  const addProject = () => {
    const newProj = {
      id: 'proj_' + Date.now(),
      name: '',
      description: '',
      technologies: '',
      projectUrl: '',
      githubUrl: ''
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProj]
    }));
    setOpenSections(prev => ({ ...prev, projects: true }));
  };

  const updateProject = (index, field, value) => {
    setResumeData(prev => {
      const copy = [...(prev.projects || [])];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, projects: copy };
    });
  };

  const removeProject = (index) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // ----------------------------------------------------
  // Certifications Handlers
  // ----------------------------------------------------
  const addCertification = () => {
    const newCert = {
      id: 'cert_' + Date.now(),
      name: '',
      organization: '',
      date: '',
      credentialUrl: ''
    };
    setResumeData(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), newCert]
    }));
    setOpenSections(prev => ({ ...prev, certifications: true }));
  };

  const updateCertification = (index, field, value) => {
    setResumeData(prev => {
      const copy = [...(prev.certifications || [])];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, certifications: copy };
    });
  };

  const removeCertification = (index) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  // ----------------------------------------------------
  // Languages Handlers
  // ----------------------------------------------------
  const addLanguage = () => {
    const newLang = {
      id: 'lang_' + Date.now(),
      name: '',
      proficiency: 'Professional Working'
    };
    setResumeData(prev => ({
      ...prev,
      languages: [...(prev.languages || []), newLang]
    }));
    setOpenSections(prev => ({ ...prev, languages: true }));
  };

  const updateLanguage = (index, field, value) => {
    setResumeData(prev => {
      const copy = [...(prev.languages || [])];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, languages: copy };
    });
  };

  const removeLanguage = (index) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // ----------------------------------------------------
  // Trigger Save (manual save button)
  // ----------------------------------------------------
  const handleSave = async () => {
    setSaving(true);
    setLastSavedTime('Saving...');
    try {
      const saved = await saveResume(resumeData, false);
      if (saved) {
        setResumeData(saved);
      }
      setLastSavedTime(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
    } catch (err) {
      console.error('Save failed:', err);
      setLastSavedTime(`Saved locally at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } finally {
      setSaving(false);
    }
  };

  // Load Sample Resume Helper
  const handleLoadSample = () => {
    const sample = JSON.parse(JSON.stringify(demoResumes[0]));
    sample.id = resumeData.id || 'res_' + Date.now();
    sample.name = 'Sample_ATS_Resume.pdf';
    setResumeData(sample);
    addNotification('Loaded full ATS sample resume template', 'info');
  };

  // Trigger AI Text Polish or Generation
  const handleAiAction = async (text, action, onResult, context = {}) => {
    setAiLoading(true);
    setAiFeedbackMessage('');
    try {
      const res = await aiService.improveText({ 
        text, 
        action, 
        jobContext: resumeData.targetRole || context.jobTitle || 'Software Engineer',
        jobTitle: context.jobTitle || resumeData.targetRole || resumeData.personalInfo?.professionalTitle,
        company: context.company || '',
        skills: resumeData.skills
      });

      if (res.improvedText) {
        onResult(res.improvedText);
        if (res.tip) setAiFeedbackMessage(res.tip);
        addNotification(res.tip || 'AI generated / improved text successfully', 'success');
      } else if (res.suggestion) {
        setAiFeedbackMessage(res.suggestion);
        addNotification(res.suggestion, 'info');
      }
    } catch (err) {
      console.error('AI action failed:', err);
      addNotification('AI generation failed. Please try again.', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // AI Generate Summary
  const handleAiGenerateSummary = async () => {
    setAiLoading(true);
    setAiFeedbackMessage('');
    try {
      const topSkills = Array.isArray(resumeData.skills) 
        ? resumeData.skills 
        : Object.values(resumeData.skills || {}).flat();
      
      const generated = await aiService.generateSummary({
        title: resumeData.personalInfo?.professionalTitle || resumeData.targetRole || 'Software Engineer',
        experienceYears: '5+',
        topSkills: topSkills.slice(0, 5)
      });
      setResumeData(prev => ({ ...prev, summary: generated }));
      setAiFeedbackMessage('Generated tailored summary based on your target role and skills.');
    } finally {
      setAiLoading(false);
    }
  };

  // Resume Health Readiness Checklist
  const readinessCheck = {
    hasContact: Boolean(resumeData.personalInfo?.email && resumeData.personalInfo?.phone),
    hasSummary: Boolean(resumeData.summary?.length > 30),
    hasExperience: (resumeData.experience || []).length > 0,
    hasSkills: Boolean(
      Array.isArray(resumeData.skills) 
        ? resumeData.skills.length > 0 
        : Object.values(resumeData.skills || {}).some(arr => Array.isArray(arr) && arr.length > 0)
    ),
    hasEducation: (resumeData.education || []).length > 0
  };

  const passedCount = Object.values(readinessCheck).filter(Boolean).length;
  const readinessScore = Math.round((passedCount / 5) * 100);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <input
              type="text"
              value={resumeData.name}
              onChange={(e) => setResumeData(prev => ({ ...prev, name: e.target.value }))}
              className="font-bold text-sm text-neutral-900 dark:text-white bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-neutral-900 focus:outline-none"
            />
            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5 font-mono">
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                {lastSavedTime === 'Saving...' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                ) : (
                  <Cloud className="w-3.5 h-3.5 text-emerald-500" />
                )}
                <span>{lastSavedTime}</span>
              </span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">{readinessScore}% ATS Ready</span>
            </div>
          </div>
        </div>

        {/* Template Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Template dropdown */}
          <select
            value={resumeData.templateId || 'template_01'}
            onChange={(e) => setResumeData(prev => ({ ...prev, templateId: e.target.value }))}
            className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
          >
            {demoTemplates.map(t => (
              <option key={t.id} value={t.id}>{t.name} (ATS Safe)</option>
            ))}
          </select>

          <button
            onClick={handleLoadSample}
            title="Load sample full resume data"
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sample Data</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-50 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={exportingPdf}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 flex items-center gap-1.5 shadow-xs disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exportingPdf ? 'Exporting...' : 'PDF'}</span>
          </button>


          <button
            onClick={() => exportResumeToPlainText(resumeData, `${(resumeData.name || 'Resume').replace(/\.[^/.]+$/, '')}_ATS.txt`)}
            title="Export Plain Text (Safe for Workday / Taleo forms)"
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ATS Text</span>
          </button>

          <button
            onClick={printResume}
            className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 ${mobileTab === 'editor' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400'}`}
        >
          <Edit3 className="w-3.5 h-3.5 inline mr-1" />
          <span>Editor</span>
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 ${mobileTab === 'preview' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400'}`}
        >
          <Eye className="w-3.5 h-3.5 inline mr-1" />
          <span>Live A4 Preview</span>
        </button>
      </div>

      {/* Split Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Collapsible Section Forms */}
        <div className={`lg:col-span-6 space-y-4 ${mobileTab === 'preview' ? 'hidden md:block' : 'block'}`}>
          
          {/* Readiness Health Checklist Bar */}
          <div className="p-3.5 rounded-xl bg-neutral-900 text-white text-xs space-y-2">
            <div className="flex justify-between items-center font-semibold">
              <span>Resume ATS Readiness</span>
              <span className="font-mono text-emerald-400">{readinessScore}% Ready</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${readinessScore}%` }}></div>
            </div>
          </div>

          {aiFeedbackMessage && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{aiFeedbackMessage}</span>
              </div>
              <button onClick={() => setAiFeedbackMessage('')} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Section 1: Personal Information */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() => setOpenSections(prev => ({ ...prev, personal: !prev.personal }))}
              className="w-full p-4 flex items-center justify-between font-semibold text-sm text-neutral-900 dark:text-white bg-neutral-50/50 dark:bg-neutral-800/30"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-neutral-500" />
                <span>Personal & Contact Information</span>
              </div>
              {openSections.personal ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </button>

            {openSections.personal && (
              <div className="p-4 space-y-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo?.fullName || ''}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo?.professionalTitle || ''}
                      onChange={(e) => updatePersonalInfo('professionalTitle', e.target.value)}
                      placeholder="Senior Frontend Engineer"
                      className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo?.email || ''}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      placeholder="alex.morgan@example.com"
                      className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo?.phone || ''}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo?.location || ''}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">LinkedIn</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo?.linkedin || ''}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/alexmorgan"
                      className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">GitHub Profile</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo?.github || ''}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      placeholder="github.com/alexmorgan"
                      className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Portfolio / Website</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo?.portfolio || ''}
                      onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                      placeholder="alexmorgan.dev"
                      className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Professional Summary */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() => setOpenSections(prev => ({ ...prev, summary: !prev.summary }))}
              className="w-full p-4 flex items-center justify-between font-semibold text-sm text-neutral-900 dark:text-white bg-neutral-50/50 dark:bg-neutral-800/30"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-neutral-500" />
                <span>Professional Summary</span>
              </div>
              {openSections.summary ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </button>

            {openSections.summary && (
              <div className="p-4 space-y-3 border-t border-neutral-100 dark:border-neutral-800">
                <textarea
                  rows={4}
                  value={resumeData.summary || ''}
                  onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Results-driven professional with 5+ years of experience..."
                  className="w-full p-3 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={handleAiGenerateSummary}
                    disabled={aiLoading}
                    className="px-2.5 py-1 rounded bg-neutral-900 text-white hover:bg-neutral-800 text-[11px] font-medium flex items-center gap-1 shadow-xs"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Generate with AI</span>
                  </button>
                  <button
                    onClick={() => handleAiAction(resumeData.summary, 'make_concise', (res) => setResumeData(prev => ({ ...prev, summary: res })))}
                    disabled={aiLoading}
                    className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 text-[11px] font-medium flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Make Concise</span>
                  </button>
                  <button
                    onClick={() => handleAiAction(resumeData.summary, 'action_verb', (res) => setResumeData(prev => ({ ...prev, summary: res })))}
                    disabled={aiLoading}
                    className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 text-[11px] font-medium flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Action Verbs</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Work Experience */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 flex items-center justify-between font-semibold text-sm text-neutral-900 dark:text-white bg-neutral-50/50 dark:bg-neutral-800/30">
              <button
                onClick={() => setOpenSections(prev => ({ ...prev, experience: !prev.experience }))}
                className="flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-neutral-500" />
                <span>Work Experience ({(resumeData.experience || []).length})</span>
                {openSections.experience ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>
              <button
                onClick={addExperience}
                className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            {openSections.experience && (
              <div className="p-4 space-y-6 border-t border-neutral-100 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800">
                {(resumeData.experience || []).map((exp, idx) => (
                  <div key={exp.id || idx} className="pt-4 first:pt-0 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-xs text-neutral-900 dark:text-white">Position #{idx + 1}</span>
                      <button
                        onClick={() => removeExperience(idx)}
                        className="text-rose-600 hover:text-rose-700 text-[11px] flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => updateExperience(idx, 'jobTitle', e.target.value)}
                          placeholder="Senior Frontend Developer"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                          placeholder="Tech Corp"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                          placeholder="2022-03"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                          placeholder="Present"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                          placeholder="San Francisco, CA"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Role Description / Overview */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                          Role Overview / Description <span className="font-normal text-neutral-400">(Optional)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAiAction(exp.description, 'add_impact', (res) => updateExperience(idx, 'description', res), { jobTitle: exp.jobTitle, company: exp.company })}
                          disabled={aiLoading}
                          className="text-[11px] text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium disabled:opacity-50"
                          title="Generate or Polish Role Overview with AI"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{exp.description ? 'Polish with AI' : 'Generate with AI'}</span>
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={exp.description || ''}
                        onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                        placeholder="e.g. Architecting scalable web applications and leading a team across front-end infrastructure..."
                        className="w-full p-2 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    {/* Achievements Bullets */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Key Achievements / Bullets</label>
                        <button
                          onClick={() => addAchievementBullet(idx)}
                          className="text-[11px] text-blue-600 font-semibold hover:underline"
                        >
                          + Add Bullet
                        </button>
                      </div>
                      {(exp.achievements || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => updateAchievementBullet(idx, bIdx, e.target.value)}
                            placeholder="e.g. Engineered micro-frontend architecture using React and Vite..."
                            className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                          />
                          <button
                            onClick={() => handleAiAction(bullet, 'add_impact', (res) => updateAchievementBullet(idx, bIdx, res), { jobTitle: exp.jobTitle, company: exp.company })}
                            disabled={aiLoading}
                            className="p-1.5 rounded bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-600 dark:text-amber-400 shrink-0 border border-amber-200 dark:border-amber-800 transition-colors disabled:opacity-50"
                            title={bullet ? "Enhance with AI (Metrics & Action Verbs)" : "Auto-Generate ATS Achievement Bullet with AI"}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeAchievementBullet(idx, bIdx)}
                            className="p-1.5 rounded text-neutral-400 hover:text-rose-600 shrink-0"
                            title="Remove Bullet"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Skills & Competencies */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() => setOpenSections(prev => ({ ...prev, skills: !prev.skills }))}
              className="w-full p-4 flex items-center justify-between font-semibold text-sm text-neutral-900 dark:text-white bg-neutral-50/50 dark:bg-neutral-800/30"
            >
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-neutral-500" />
                <span>Technical Skills & Core Competencies</span>
              </div>
              {openSections.skills ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </button>

            {openSections.skills && (
              <div className="p-4 space-y-4 border-t border-neutral-100 dark:border-neutral-800">
                {[
                  { key: 'programming', label: 'Programming Languages' },
                  { key: 'frameworks', label: 'Frameworks & Libraries' },
                  { key: 'tools', label: 'Tools, DevOps & Cloud' },
                  { key: 'softSkills', label: 'Core Competencies / Soft Skills' }
                ].map((category) => {
                  const currentTags = Array.isArray(resumeData.skills)
                    ? (category.key === 'programming' ? resumeData.skills : [])
                    : (resumeData.skills?.[category.key] || []);

                  return (
                    <div key={category.key} className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">{category.label}</label>
                      <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
                        {currentTags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeSkillTag(category.key, tag)}
                              className="hover:text-rose-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <div className="flex items-center gap-1 flex-1 min-w-[160px]">
                          <input
                            type="text"
                            placeholder="+ Type skill"
                            value={newSkillInput.category === category.key ? newSkillInput.tag : ''}
                            onChange={(e) => setNewSkillInput({ category: category.key, tag: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addSkillTag(category.key, newSkillInput.tag);
                              }
                            }}
                            className="text-xs bg-transparent border-none focus:outline-none flex-1 text-neutral-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => addSkillTag(category.key, newSkillInput.tag)}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 5: Education */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 flex items-center justify-between font-semibold text-sm text-neutral-900 dark:text-white bg-neutral-50/50 dark:bg-neutral-800/30">
              <button
                onClick={() => setOpenSections(prev => ({ ...prev, education: !prev.education }))}
                className="flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-neutral-500" />
                <span>Education ({(resumeData.education || []).length})</span>
                {openSections.education ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>
              <button
                onClick={addEducation}
                className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Degree</span>
              </button>
            </div>

            {openSections.education && (
              <div className="p-4 space-y-4 border-t border-neutral-100 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800">
                {(resumeData.education || []).map((edu, idx) => (
                  <div key={edu.id || idx} className="pt-3 first:pt-0 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-xs text-neutral-900 dark:text-white">Degree #{idx + 1}</span>
                      <button
                        onClick={() => removeEducation(idx)}
                        className="text-rose-600 hover:text-rose-700 text-[11px] flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Degree / Major</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                          placeholder="B.S. in Computer Science"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Institution / University</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                          placeholder="UC Berkeley"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Start Date</label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(idx, 'startDate', e.target.value)}
                          placeholder="2015-08"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">End Date</label>
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                          placeholder="2019-05"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">GPA / Honors</label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(idx, 'gpa', e.target.value)}
                          placeholder="3.85 / 4.0"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Key Projects */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 flex items-center justify-between font-semibold text-sm text-neutral-900 dark:text-white bg-neutral-50/50 dark:bg-neutral-800/30">
              <button
                onClick={() => setOpenSections(prev => ({ ...prev, projects: !prev.projects }))}
                className="flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-neutral-500" />
                <span>Key Projects ({(resumeData.projects || []).length})</span>
                {openSections.projects ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
              </button>
              <button
                onClick={addProject}
                className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {openSections.projects && (
              <div className="p-4 space-y-4 border-t border-neutral-100 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800">
                {(resumeData.projects || []).map((proj, idx) => (
                  <div key={proj.id || idx} className="pt-3 first:pt-0 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-xs text-neutral-900 dark:text-white">Project #{idx + 1}</span>
                      <button
                        onClick={() => removeProject(idx)}
                        className="text-rose-600 hover:text-rose-700 text-[11px] flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(idx, 'name', e.target.value)}
                          placeholder="Nexus Analytics Dashboard"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Technologies Used</label>
                        <input
                          type="text"
                          value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || '')}
                          onChange={(e) => updateProject(idx, 'technologies', e.target.value)}
                          placeholder="React, TypeScript, Vite"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">Project Description & Impact</label>
                        <button
                          onClick={() => handleAiAction(proj.description, 'add_impact', (res) => updateProject(idx, 'description', res), { jobTitle: proj.name, company: proj.technologies })}
                          disabled={aiLoading}
                          className="text-[11px] text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium disabled:opacity-50"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{proj.description ? 'Polish with AI' : 'Generate with AI'}</span>
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={proj.description || ''}
                        onChange={(e) => updateProject(idx, 'description', e.target.value)}
                        placeholder="Built real-time telemetry visualizer handling over 100k data points..."
                        className="w-full p-2 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 7: Certifications & Section 8: Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Certifications */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
              <div className="p-3.5 flex items-center justify-between font-semibold text-xs text-neutral-900 dark:text-white bg-neutral-50/50 dark:bg-neutral-800/30">
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Certifications ({(resumeData.certifications || []).length})</span>
                </div>
                <button
                  onClick={addCertification}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  + Add
                </button>
              </div>
              <div className="p-3 space-y-2">
                {(resumeData.certifications || []).map((c, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateCertification(idx, 'name', e.target.value)}
                      placeholder="AWS Solutions Architect"
                      className="w-full px-2 py-1 border border-neutral-200 dark:border-neutral-700 rounded text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                    <button onClick={() => removeCertification(idx)} className="text-neutral-400 hover:text-rose-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
              <div className="p-3.5 flex items-center justify-between font-semibold text-xs text-neutral-900 dark:text-white bg-neutral-50/50 dark:bg-neutral-800/30">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Languages ({(resumeData.languages || []).length})</span>
                </div>
                <button
                  onClick={addLanguage}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  + Add
                </button>
              </div>
              <div className="p-3 space-y-2">
                {(resumeData.languages || []).map((l, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={l.name}
                      onChange={(e) => updateLanguage(idx, 'name', e.target.value)}
                      placeholder="English"
                      className="w-full px-2 py-1 border border-neutral-200 dark:border-neutral-700 rounded text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                    <button onClick={() => removeLanguage(idx)} className="text-neutral-400 hover:text-rose-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Live A4 Resume Preview */}
        <div className={`lg:col-span-6 sticky top-20 ${mobileTab === 'editor' ? 'hidden md:block' : 'block'}`}>
          <div className="p-3 bg-neutral-200 dark:bg-neutral-800/70 rounded-xl overflow-auto max-h-[84vh] flex justify-center shadow-inner">
            <div id="resume-builder-preview-box" className="transform scale-[0.85] origin-top">
              <ResumeRenderer resume={resumeData} templateId={resumeData.templateId || 'template_01'} />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

