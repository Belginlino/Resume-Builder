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
import { db, isFirebaseConfigured } from './config';
import { demoResumes, demoAnalyses, demoJobs } from '../../data/demoData';

// Local storage key prefix
const STORAGE_PREFIX = 'careerforge_db_';

const getLocalCollection = (colName) => {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + colName);
    if (!raw) {
      if (colName === 'resumes') return demoResumes;
      if (colName === 'analyses') return demoAnalyses;
      if (colName === 'jobs') return demoJobs;
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

const setLocalCollection = (colName, data) => {
  localStorage.setItem(STORAGE_PREFIX + colName, JSON.stringify(data));
};

export const firestoreService = {
  // Resumes
  getResumes: async (userId) => {
    if (isFirebaseConfigured && db && userId) {
      try {
        const q = query(
          collection(db, `users/${userId}/resumes`),
          orderBy('updatedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (err) {
        console.error("Firestore getResumes error:", err);
      }
    }
    return getLocalCollection('resumes');
  },

  getResumeById: async (userId, resumeId) => {
    if (isFirebaseConfigured && db && userId) {
      try {
        const ref = doc(db, `users/${userId}/resumes/${resumeId}`);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() };
        }
      } catch (err) {
        console.error("Firestore getResumeById error:", err);
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

    if (isFirebaseConfigured && db && userId) {
      try {
        if (resumeData.id) {
          const ref = doc(db, `users/${userId}/resumes/${resumeData.id}`);
          await updateDoc(ref, { ...payload, updatedAt: serverTimestamp() });
          return { id: resumeData.id, ...payload };
        } else {
          const colRef = collection(db, `users/${userId}/resumes`);
          const docRef = await addDoc(colRef, { 
            ...payload, 
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp() 
          });
          return { id: docRef.id, ...payload, createdAt: now };
        }
      } catch (err) {
        console.error("Firestore saveResume error:", err);
      }
    }

    const list = getLocalCollection('resumes');
    let id = resumeData.id;
    if (id) {
      const idx = list.findIndex(r => r.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...payload };
      } else {
        list.push({ id, createdAt: now, ...payload });
      }
    } else {
      id = 'resume_' + Date.now();
      list.unshift({ id, createdAt: now, ...payload });
    }
    setLocalCollection('resumes', list);
    return { id, createdAt: now, ...payload };
  },

  deleteResume: async (userId, resumeId) => {
    if (isFirebaseConfigured && db && userId) {
      try {
        await deleteDoc(doc(db, `users/${userId}/resumes/${resumeId}`));
      } catch (err) {
        console.error("Firestore deleteResume error:", err);
      }
    }
    const list = getLocalCollection('resumes').filter(r => r.id !== resumeId);
    setLocalCollection('resumes', list);
  },

  // Analyses
  saveAnalysis: async (userId, analysisData) => {
    const now = new Date().toISOString();
    const payload = { ...analysisData, createdAt: now };

    if (isFirebaseConfigured && db && userId) {
      try {
        const colRef = collection(db, `users/${userId}/analyses`);
        const docRef = await addDoc(colRef, { ...payload, createdAt: serverTimestamp() });
        return { id: docRef.id, ...payload };
      } catch (err) {
        console.error("Firestore saveAnalysis error:", err);
      }
    }

    const list = getLocalCollection('analyses');
    const id = 'analysis_' + Date.now();
    const newItem = { id, ...payload };
    list.unshift(newItem);
    setLocalCollection('analyses', list);
    return newItem;
  },

  getAnalyses: async (userId) => {
    if (isFirebaseConfigured && db && userId) {
      try {
        const q = query(collection(db, `users/${userId}/analyses`), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error("Firestore getAnalyses error:", err);
      }
    }
    return getLocalCollection('analyses');
  },

  // Job Postings / Matches
  saveJob: async (userId, jobData) => {
    const now = new Date().toISOString();
    const payload = { ...jobData, createdAt: now };

    if (isFirebaseConfigured && db && userId) {
      try {
        const colRef = collection(db, `users/${userId}/jobs`);
        const docRef = await addDoc(colRef, { ...payload, createdAt: serverTimestamp() });
        return { id: docRef.id, ...payload };
      } catch (err) {
        console.error("Firestore saveJob error:", err);
      }
    }

    const list = getLocalCollection('jobs');
    const id = 'job_' + Date.now();
    const newItem = { id, ...payload };
    list.unshift(newItem);
    setLocalCollection('jobs', list);
    return newItem;
  },

  getJobs: async (userId) => {
    if (isFirebaseConfigured && db && userId) {
      try {
        const q = query(collection(db, `users/${userId}/jobs`), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error("Firestore getJobs error:", err);
      }
    }
    return getLocalCollection('jobs');
  }
};
