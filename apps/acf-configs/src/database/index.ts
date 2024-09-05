import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export const myConfigs = async (uid: string) => {
  const querySnapshot = await getDocs(query(collection(db, 'configurations'), where('userId', '==', uid)));
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};
