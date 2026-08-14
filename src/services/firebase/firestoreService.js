import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './config';
import { demoResumes, demoAnalyses, demoJobs } from '../../data/demoData';

// Local storage key prefix
const STORAGE_PREFIX = 'careerforge_db_';

// Helper to determine if we should execute remote Firestore operations
const shouldCallRemoteFirestore = (userId) => {
  if (!isFirebaseConfigured || !db || !userId) return false;
  if (typeof userId === 'string' && userId.startsWith('demo_user_')) return false;
  if (!auth?.currentUser) return false;
  return true;
};

// Timeout wrapper for Firestore promises (prevents hanging indefinitely)
const withTimeout = (promise, ms = 3500) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Firestore operation timed out')), ms);
  });
  return Promise.race([
    promise.then(res => { clearTimeout(timeoutId); return res; }),
    timeoutPromise
  ]);
};

const getLocalCollection = (colName) => {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + colName);
    if (!raw) {
      if (colName === 'resumes') return [...demoResumes];
      if (colName === 'analyses') return [...demoAnalyses];
      if (colName === 'jobs') return [...demoJobs];
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

const setLocalCollection = (colName, data) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + colName, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save to localStorage [${colName}]:`, e);
  }
};

export const firestoreService = {
  // Resumes
  getResumes: async (userId) => {
    if (shouldCallRemoteFirestore(userId)) {
      try {
        const q = query(
          collection(db, `users/${userId}/resumes`),
          orderBy('updatedAt', 'desc')
        );
        const snapshot = await withTimeout(getDocs(q));
        if (snapshot && !snapshot.empty) {
          const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setLocalCollection('resumes', list);
          return list;
        }
      } catch (err) {
        console.warn("Firestore getResumes fallback to local:", err.message);
      }
    }
    return getLocalCollection('resumes');
  },

  getResumeById: async (userId, resumeId) => {
    if (shouldCallRemoteFirestore(userId)) {
      try {
        const ref = doc(db, `users/${userId}/resumes/${resumeId}`);
        const snapshot = await withTimeout(getDoc(ref));
        if (snapshot && snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() };
        }
      } catch (err) {
        console.warn("Firestore getResumeById fallback to local:", err.message);
      }
    }
    const list = getLocalCollection('resumes');
    return list.find(r => r.id === resumeId) || list[0] || null;
  },

  saveResume: async (userId, resumeData) => {
    const now = new Date().toISOString();
    const payload = {
      ...resumeData,
      updatedAt: now
    };

    let savedId = resumeData.id;

    if (shouldCallRemoteFirestore(userId)) {
      try {
        if (savedId) {
          const ref = doc(db, `users/${userId}/resumes/${savedId}`);
          await withTimeout(updateDoc(ref, { ...payload, updatedAt: serverTimestamp() }));
        } else {
          const colRef = collection(db, `users/${userId}/resumes`);
          const docRef = await withTimeout(addDoc(colRef, { 
            ...payload, 
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp() 
          }));
          savedId = docRef.id;
        }
      } catch (err) {
        console.warn("Firestore saveResume fallback to local:", err.message);
      }
    }

    // Always ensure it is saved locally
    const list = getLocalCollection('resumes');
    if (!savedId) {
      savedId = 'resume_' + Date.now();
    }

    const savedResume = { 
      ...payload, 
      id: savedId, 
      createdAt: resumeData.createdAt || now 
    };

    const idx = list.findIndex(r => r.id === savedId);
    if (idx !== -1) {
      list[idx] = savedResume;
    } else {
      list.unshift(savedResume);
    }
    setLocalCollection('resumes', list);
    return savedResume;
  },

  deleteResume: async (userId, resumeId) => {
    if (shouldCallRemoteFirestore(userId)) {
      try {
        await withTimeout(deleteDoc(doc(db, `users/${userId}/resumes/${resumeId}`)));
      } catch (err) {
        console.warn("Firestore deleteResume fallback to local:", err.message);
      }
    }
    const list = getLocalCollection('resumes').filter(r => r.id !== resumeId);
    setLocalCollection('resumes', list);
    return true;
  },

  // Analyses
  saveAnalysis: async (userId, analysisData) => {
    const now = new Date().toISOString();
    const payload = { ...analysisData, createdAt: now };
    let savedId = analysisData.id;

    if (shouldCallRemoteFirestore(userId)) {
      try {
        const colRef = collection(db, `users/${userId}/analyses`);
        const docRef = await withTimeout(addDoc(colRef, { ...payload, createdAt: serverTimestamp() }));
        savedId = docRef.id;
      } catch (err) {
        console.warn("Firestore saveAnalysis fallback to local:", err.message);
      }
    }

    if (!savedId) {
      savedId = 'analysis_' + Date.now();
    }

    const newItem = { id: savedId, ...payload };
    const list = getLocalCollection('analyses');
    list.unshift(newItem);
    setLocalCollection('analyses', list);
    return newItem;
  },

  getAnalyses: async (userId) => {
    if (shouldCallRemoteFirestore(userId)) {
      try {
        const q = query(collection(db, `users/${userId}/analyses`), orderBy('createdAt', 'desc'));
        const snapshot = await withTimeout(getDocs(q));
        if (snapshot && !snapshot.empty) {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setLocalCollection('analyses', list);
          return list;
        }
      } catch (err) {
        console.warn("Firestore getAnalyses fallback to local:", err.message);
      }
    }
    return getLocalCollection('analyses');
  },

  // Job Postings / Matches
  saveJob: async (userId, jobData) => {
    const now = new Date().toISOString();
    const payload = { ...jobData, createdAt: now };
    let savedId = jobData.id;

    if (shouldCallRemoteFirestore(userId)) {
      try {
        const colRef = collection(db, `users/${userId}/jobs`);
        const docRef = await withTimeout(addDoc(colRef, { ...payload, createdAt: serverTimestamp() }));
        savedId = docRef.id;
      } catch (err) {
        console.warn("Firestore saveJob fallback to local:", err.message);
      }
    }

    if (!savedId) {
      savedId = 'job_' + Date.now();
    }

    const newItem = { id: savedId, ...payload };
    const list = getLocalCollection('jobs');
    list.unshift(newItem);
    setLocalCollection('jobs', list);
    return newItem;
  },

  getJobs: async (userId) => {
    if (shouldCallRemoteFirestore(userId)) {
      try {
        const q = query(collection(db, `users/${userId}/jobs`), orderBy('createdAt', 'desc'));
        const snapshot = await withTimeout(getDocs(q));
        if (snapshot && !snapshot.empty) {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setLocalCollection('jobs', list);
          return list;
        }
      } catch (err) {
        console.warn("Firestore getJobs fallback to local:", err.message);
      }
    }
    return getLocalCollection('jobs');
  },

  // Clear all local data
  clearLocalData: () => {
    localStorage.removeItem(STORAGE_PREFIX + 'resumes');
    localStorage.removeItem(STORAGE_PREFIX + 'analyses');
    localStorage.removeItem(STORAGE_PREFIX + 'jobs');
  }
};

export const clearLocalData = firestoreService.clearLocalData;

