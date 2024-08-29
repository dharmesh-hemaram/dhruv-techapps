import { Auth, FirebaseOauth2Background } from '@dhruv-techapps/firebase-oauth';
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

export class FirebaseStorageBackground extends FirebaseOauth2Background {
  storage: FirebaseStorage;

  constructor(auth: Auth, edgeClientId?: string) {
    super(auth, edgeClientId);
    this.storage = getStorage(auth.app);
  }

  async uploadFile(blob: Blob, path: string) {
    const storageRef = ref(this.storage, path);
    return uploadBytes(storageRef, blob);
  }

  async downloadFile(path: string) {
    const storageRef = ref(this.storage, path);
    const url = await getDownloadURL(storageRef);
    return fetch(url).then((response) => response.json());
  }
}
