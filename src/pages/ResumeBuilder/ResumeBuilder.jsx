import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import { exportResumeToPDF, printResume } from '../../services/pdfExport';
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
  Layers
} from 'lucide-react';
import { demoTemplates } from '../../data/demoData';

export const ResumeBuilder = () => {
  const { id } = useParams();
  const { resumes, activeResume, saveResume } = useApp();
  const navigate = useNavigate();

  // Mobile View Tab state ('editor' | 'preview')
  const [mobileTab, setMobileTab] = useState('editor');

  // Active Collapsible Section State
  const [openSections, setOpenSections] = useState({
    personal: true,
    summary: true,
    experience: true,
    education: false,
    skills: false,
    projects: false,
    certifications: false
  });

  // Current Resume Form State
  const [resumeData, setResumeData] = useState(() => {
    const found = resumes.find(r => r.id === id) || activeResume || resumes[0];
    return found ? JSON.parse(JSON.stringify(found)) : {
      name: 'Untitled_Resume.pdf',
      targetRole: 'Senior Software Engineer',
      templateId: 'template_01',
      personalInfo: { fullName: '', professionalTitle: '', email: '', phone: '', location: '', linkedin: '', github: '' },
      summary: '',
      experience: [],
      education: [],
      skills: { programming: [], frameworks: [], tools: [] },
      projects: [],
      certifications: [],
      languages: []
    };
  });

  const [saving, setSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState('Saved just now');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedbackMessage, setAiFeedbackMessage] = useState('');

  // Handle nested object changes
  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  // Add/Remove Work Experience
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

  // Add/Remove Education
  const addEducation = () => {
    const newEdu = {
      id: 'edu_' + Date.now(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...(prev.education || []), newEdu]
    }));
  };

  // Trigger Save
  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResume(resumeData);
      setLastSavedTime('Saved just now');
    } finally {
      setSaving(false);
    }
  };

  // Trigger AI Text Polish
  const handleAiAction = async (text, action, onResult) => {
    setAiLoading(true);
    setAiFeedbackMessage('');
    try {
      const res = await aiService.improveText({ text, action });
      if (res.userActionNeeded) {
        setAiFeedbackMessage(res.promptUserMessage);
      } else {
        onResult(res.improvedText);
        if (res.tip) setAiFeedbackMessage(res.tip);
      }
    } finally {
      setAiLoading(false);
    }
  };

  // Resume Health Readiness Checklist
  const readinessCheck = {
    hasContact: Boolean(resumeData.personalInfo?.email && resumeData.personalInfo?.phone),
    hasSummary: Boolean(resumeData.summary?.length > 30),
    hasExperience: (resumeData.experience || []).length > 0,
    hasSkills: Boolean(resumeData.skills),
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
              <span>{lastSavedTime}</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">Ready to Export</span>
            </div>
          </div>
        </div>

        {/* Template Selector & Export Buttons */}
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
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-50 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>

          <button
            onClick={() => exportResumeToPDF('resume-builder-preview-box', `${resumeData.name || 'Resume'}.pdf`)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
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
              <span>Resume Health Readiness</span>
              <span className="font-mono text-emerald-400">{readinessScore}% Ready</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full transition-all" style={{ width: `${readinessScore}%` }}></div>
            </div>
          </div>

          {aiFeedbackMessage && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{aiFeedbackMessage}</span>
            </div>
          )}

          {/* Section 1: Personal Information */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() => setOpenSections(prev => ({ ...prev, personal: !prev.personal }))}
              className="w-full p-4 flex items-center justify-between font-semibold text-sm text-neutral-900 dark:text-white bg-neutral-50/50 dark:bg-neutral-800/30"
            >
              <span>Personal Information</span>
              {openSections.personal ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </button>

            {openSections.personal && (
              <div className="p-4 space-y-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo?.fullName || ''}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Professional Title</label>
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
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo?.email || ''}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      placeholder="alex.morgan@example.com"
                      className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo?.phone || ''}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Location</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo?.location || ''}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo?.linkedin || ''}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/alexmorgan"
                      className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">GitHub / Website</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo?.github || ''}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      placeholder="github.com/alexmorgan"
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
              <span>Professional Summary</span>
              {openSections.summary ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </button>

            {openSections.summary && (
              <div className="p-4 space-y-3 border-t border-neutral-100 dark:border-neutral-800">
                <textarea
                  rows={4}
                  value={resumeData.summary || ''}
                  onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Write a concise overview of your technical experience and achievements..."
                  className="w-full p-3 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                />

                <div className="flex flex-wrap gap-2 pt-1">
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
                    <span>Improve Action Verb</span>
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
                        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => updateExperience(idx, 'jobTitle', e.target.value)}
                          placeholder="Senior Frontend Developer"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                          placeholder="Vanguard Digital"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                          placeholder="2022-03"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                          placeholder="Present"
                          className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Achievements Bullets */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-[11px] font-semibold text-neutral-600">Key Achievements / Bullets</label>
                        <button
                          onClick={() => addAchievementBullet(idx)}
                          className="text-[11px] text-blue-600 font-semibold hover:underline"
                        >
                          + Add Bullet
                        </button>
                      </div>
                      {(exp.achievements || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex gap-2">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => updateAchievementBullet(idx, bIdx, e.target.value)}
                            placeholder="e.g. Engineered micro-frontend architecture using React and Vite..."
                            className="w-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                          />
                          <button
                            onClick={() => handleAiAction(bullet, 'add_impact', (res) => updateAchievementBullet(idx, bIdx, res))}
                            className="p-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-amber-600 shrink-0"
                            title="Add Impact / Metric"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Live A4 Resume Preview */}
        <div className={`lg:col-span-6 sticky top-20 ${mobileTab === 'editor' ? 'hidden md:block' : 'block'}`}>
          <div className="p-3 bg-neutral-200 dark:bg-neutral-800 rounded-xl overflow-auto max-h-[82vh] flex justify-center shadow-inner">
            <div id="resume-builder-preview-box" className="transform scale-[0.85] origin-top">
              <ResumeRenderer resume={resumeData} templateId={resumeData.templateId || 'template_01'} />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
