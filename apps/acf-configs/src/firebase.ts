import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import { getAuth } from 'firebase/auth';

export const firebase = initializeApp({
  apiKey: process.env.NX_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NX_PUBLIC_FIREBASE_PROJECT_ID,
  authDomain: process.env.NX_PUBLIC_FIREBASE_AUTH_DOMAIN,
});

export const auth = getAuth(firebase);
export default firebase;
