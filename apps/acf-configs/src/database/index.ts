import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export type ConfigType = {
  id: string;
  name: string;
  url: string;
  userId: string;
};

export const getConfig = async (id: string) => {
  const docRef = doc(db, 'configurations', id);
  console.log(docRef);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...(docSnap.data() as ConfigType), id: docSnap.id };
  }
  return undefined;
};
