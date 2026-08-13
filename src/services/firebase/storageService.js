import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, isFirebaseConfigured } from './config';

export const storageService = {
  uploadResumeFile: (userId, file, onProgress) => {
    return new Promise((resolve, reject) => {
      if (isFirebaseConfigured && storage && userId) {
        const fileRef = ref(storage, `users/${userId}/resumes/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(Math.round(progress));
          },
          (error) => {
            console.error("Storage upload error:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              url: downloadURL,
              path: uploadTask.snapshot.ref.fullPath,
              fileName: file.name,
              size: file.size,
              type: file.type
            });
          }
        );
      } else {
        // Local simulation with smooth progress feedback
        let progress = 0;
        const interval = setInterval(() => {
          progress += 25;
          if (onProgress) onProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            const blobUrl = URL.createObjectURL(file);
            resolve({
              url: blobUrl,
              path: `local/resumes/${file.name}`,
              fileName: file.name,
              size: file.size,
              type: file.type
            });
          }
        }, 150);
      }
    });
  },

  deleteFile: async (path) => {
    if (isFirebaseConfigured && storage && path && !path.startsWith('blob:') && !path.startsWith('local/')) {
      try {
        const fileRef = ref(storage, path);
        await deleteObject(fileRef);
      } catch (err) {
        console.error("Storage delete error:", err);
      }
    }
  }
};
