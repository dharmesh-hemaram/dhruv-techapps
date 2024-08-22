import { initializeApp } from 'firebase/app';

export const firebase = initializeApp({
  apiKey: process.env.NX_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NX_PUBLIC_FIREBASE_PROJECT_ID,
});
