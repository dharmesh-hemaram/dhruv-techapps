import { FirebaseFirestoreBackground } from '@dhruv-techapps/firebase-firestore';
export const NOTIFICATIONS_TITLE = 'Update';
export const NOTIFICATIONS_ID = 'update';

export class Update {
  static async discord(firebaseFirestoreBackground: FirebaseFirestoreBackground) {
    const { discord } = await chrome.storage.local.get('discord');
    if (discord) {
      firebaseFirestoreBackground.setDiscord(discord).then((response: any) => {
        if (!response?.error) chrome.storage.local.remove('discord');
      });
    }
  }
}
