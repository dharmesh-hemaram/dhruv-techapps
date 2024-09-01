import { Auth, FirebaseOauth2Background } from '@dhruv-techapps/firebase-oauth';
import { Database, child, get, getDatabase, ref, remove, set } from 'firebase/database';
import XMLHttpRequest from 'xhr-shim';
import { DBConfigRequest, SYNC_ALL_CONFIG_ALARM, SYNC_CONFIG_ALARM } from './firebase-database.constant';
self['XMLHttpRequest'] = XMLHttpRequest;

export class FirebaseDatabaseBackground extends FirebaseOauth2Background {
  db: Database;

  constructor(auth: Auth, edgeClientId?: string) {
    super(auth, edgeClientId);
    this.db = getDatabase();
  }

  async setDiscord(discord: any) {
    await this.auth.authStateReady();
    const dbRef = ref(this.db, `users/${this.auth.currentUser?.uid}/discord`);
    return set(dbRef, discord);
  }

  async getDiscord() {
    await this.auth.authStateReady();
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
    await this.auth.authStateReady();
    const dbRef = ref(this.db, `users/${this.auth.currentUser?.uid}/discord`);
    return remove(dbRef);
  }

  async setProfile(profile: boolean) {
    await this.auth.authStateReady();
    const dbRef = ref(this.db, `users/${this.auth.currentUser?.uid}/publicProfile`);
    const result = set(dbRef, profile);
    if (profile) {
      const alarmInfo: chrome.alarms.AlarmCreateInfo = { when: Date.now() + 500 };
      await chrome.alarms.create(SYNC_ALL_CONFIG_ALARM, { delayInMinutes: 1 });
      await chrome.alarms.create(SYNC_CONFIG_ALARM, { ...alarmInfo, periodInMinutes: 1440 * 7 });
    } else {
      chrome.alarms.clear(SYNC_CONFIG_ALARM);
      chrome.alarms.clear(SYNC_ALL_CONFIG_ALARM);
    }
    return result;
  }

  async getProfile() {
    await this.auth.authStateReady();
    const dbRef = ref(this.db);
    return get(child(dbRef, `users/${this.auth.currentUser?.uid}/publicProfile`)).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return false;
      }
    });
  }

  async deleteProfile() {
    await this.auth.authStateReady();
    const dbRef = ref(this.db, `users/${this.auth.currentUser?.uid}/publicProfile`);
    return remove(dbRef);
  }

  async setConfig(config: DBConfigRequest, id: string) {
    await this.auth.authStateReady();
    const dbRef = ref(this.db, `configurations/${id}`);
    return set(dbRef, config);
  }
}
