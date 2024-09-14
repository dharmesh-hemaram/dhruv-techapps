import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, indexedDBLocalPersistence, signInWithEmailAndPassword } from 'firebase/auth/web-extension';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { FIREBASE_API_KEY, FIREBASE_BUCKET, FIREBASE_DATABASE_URL, FIREBASE_PROJECT_ID } from '../common/environments';

const firebase = initializeApp({
  apiKey: FIREBASE_API_KEY,
  projectId: FIREBASE_PROJECT_ID,
  databaseURL: FIREBASE_DATABASE_URL,
  storageBucket: FIREBASE_BUCKET,
});
firebase.automaticDataCollectionEnabled = false;
const auth = getAuth(firebase);
auth.setPersistence(indexedDBLocalPersistence);
if (process.env.IS_LOCAL === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(getFirestore(auth.app), 'localhost', 8080);
  connectStorageEmulator(getStorage(auth.app), 'localhost', 9199);
  signInWithEmailAndPassword(auth, 'new@example.com', 'password123').then(console.log).catch(console.error);
}
export { auth };
