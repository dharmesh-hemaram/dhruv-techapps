import { initializeApp } from 'firebase/app';
import { getAuth, indexedDBLocalPersistence } from 'firebase/auth/web-extension';
import { FIREBASE_API_KEY, FIREBASE_DATABASE_URL, FIREBASE_PROJECT_ID } from '../common/environments';

const firebase = initializeApp({
  apiKey: FIREBASE_API_KEY,
  projectId: FIREBASE_PROJECT_ID,
  databaseURL: FIREBASE_DATABASE_URL,
});
firebase.automaticDataCollectionEnabled = false;
const auth = getAuth(firebase);
auth.setPersistence(indexedDBLocalPersistence);
export { auth };
