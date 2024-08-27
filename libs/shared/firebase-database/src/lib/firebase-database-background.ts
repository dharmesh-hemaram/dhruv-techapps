import { Auth, FirebaseOauth2Background } from '@dhruv-techapps/firebase-oauth';
import { Database, child, get, getDatabase, ref, remove, set } from 'firebase/database';

export class FirebaseDatabaseBackground extends FirebaseOauth2Background {
  db: Database;

  constructor(auth: Auth, edgeClientId?: string) {
    super(auth, edgeClientId);
    this.db = getDatabase();
  }

  async setDiscord(discord: any) {
    const dbRef = ref(this.db, `users/${this.auth.currentUser?.uid}/discord`);
    return set(dbRef, discord);
  }

  async getDiscord() {
    const dbRef = ref(this.db);
    return get(child(dbRef, `users/${this.auth.currentUser?.uid}/discord`)).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return undefined;
      }
    });
  }

  async deleteDiscord() {
    const dbRef = ref(this.db, `users/${this.auth.currentUser?.uid}/discord`);
    return remove(dbRef);
  }
}
