import { Auth, FirebaseOauth2Background } from '@dhruv-techapps/firebase-oauth';
import { Database, getDatabase } from 'firebase/database';
// import XMLHttpRequest from 'xhr-shim';
// self['XMLHttpRequest'] = XMLHttpRequest;

export class FirebaseDatabaseBackground extends FirebaseOauth2Background {
  db: Database;

  constructor(auth: Auth, edgeClientId?: string) {
    super(auth, edgeClientId);
    this.db = getDatabase();
  }
}
