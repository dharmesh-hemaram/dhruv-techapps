import { FirebaseDatabaseBackground } from '@dhruv-techapps/firebase-database';
export const NOTIFICATIONS_TITLE = 'Update';
export const NOTIFICATIONS_ID = 'update';

export class Update {
  static async discord(firebaseDatabaseBackground: FirebaseDatabaseBackground) {
    const { discord } = await chrome.storage.local.get('discord');
    if (discord) {
      firebaseDatabaseBackground.setDiscord(discord).then((response: any) => {
        if (!response?.error) chrome.storage.local.remove('discord');
      });
    }
  }
}
