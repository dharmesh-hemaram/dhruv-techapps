import { getBlob, ref } from 'firebase/storage';
import { storage } from '../firebase';

export const downloadFile = async (path: string) => {
  const pathReference = ref(storage, path);
  const blob = await getBlob(pathReference);
  return JSON.parse(await blob.text());
};
