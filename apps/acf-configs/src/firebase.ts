import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebase = initializeApp({
  apiKey: process.env.NX_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NX_PUBLIC_FIREBASE_PROJECT_ID,
  authDomain: process.env.NX_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NX_PUBLIC_FIREBASE_DATABASE_URL,
  storageBucket: process.env.NX_PUBLIC_FIREBASE_BUCKET,
});

export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
export const storage = getStorage(firebase);
export default firebase;
