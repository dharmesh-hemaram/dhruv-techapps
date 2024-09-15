import { Configuration, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { ConfigRequest, FirebaseFirestoreBackground, SYNC_ALL_CONFIG_ALARM, SYNC_CONFIG_ALARM } from '@dhruv-techapps/firebase-firestore';
import { Auth } from '@dhruv-techapps/firebase-oauth';
import { FirebaseStorageBackground } from '@dhruv-techapps/firebase-storage';
import { EDGE_OAUTH_CLIENT_ID } from '../common/environments';
import { auth } from './firebase';
import { googleAnalytics } from './google-analytics';

export const EVENTS_REGEX = new RegExp(
  'scrollto|clickevents|mouseevents|touchevents|formevents|keyevents|tabs|keyboardevents|attr|class|copy|paste|windowcommand|locationcommand|func|replace|append|prepend|clipboard|GoogleSheets',
  'i'
);

export const VALUE_MATCHER = new RegExp('<batchRepeat>|<actionRepeat>|<sessionCount>|<random\\(([^)]+)\\)>|<queryParam::([^>]+)>|<api::([^>]+)>', 'i');

export class SyncConfig {
  constructor(private auth: Auth) {}

  filterConfig(configs: Array<Configuration>, updated: boolean): Array<Configuration> {
    if (updated) {
      return configs.filter((config: Configuration) => config.url && config.updated && !config.download);
    } else {
      return configs.filter((config: Configuration) => config.url && !config.download);
    }
  }

  maskStringWithAsterisks(input: string) {
    return input
      .split(' ') // Split string into words
      .map((word) => '*'.repeat(word.length)) // Replace each word with asterisks of equal length
      .join(' '); // Join words back with spaces
  }

  maskString(input: string) {
    let result = '';
    let lastIndex = 0;

    // Use the value matcher to find matches
    let match;
    while ((match = VALUE_MATCHER.exec(input)) !== null) {
      // Add * for the non-matching part before the current match, but preserve non-alphanumeric characters
      result += input.slice(lastIndex, match.index).replace(/[a-zA-Z0-9]/g, '*');

      // Add the matching part as is
      result += match[0];

      // Move the index to after the current match
      lastIndex = match.index + match[0].length;
    }

    // Handle any part of the string after the last match
    result += input.slice(lastIndex).replace(/[a-zA-Z0-9]/g, '*');

    return result;
  }

  async reset() {
    const storageResult = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS);
    const configs: Array<Configuration> = storageResult[LOCAL_STORAGE_KEY.CONFIGS] || [];
    const updatedConfigs = configs.map((config: Configuration) => {
      delete config.updated;
      return config;
    });
    await chrome.storage.local.set({ [LOCAL_STORAGE_KEY.CONFIGS]: updatedConfigs });
  }

  getBlob(config: Configuration) {
    config.download = true;
    delete config.spreadsheetId;
    config.actions.forEach((action, index, actions) => {
      const { value } = action;

      if (value) {
        if (!EVENTS_REGEX.test(value)) {
          if (VALUE_MATCHER.test(value)) {
            action.value = this.maskString(value);
          } else {
            action.value = this.maskStringWithAsterisks(value);
          }
        }
      }
      if (action.addon) {
        const { value } = action.addon;
        if (value) {
          if (!EVENTS_REGEX.test(value)) {
            if (VALUE_MATCHER.test(value)) {
              action.addon.value = this.maskString(value);
            } else {
              action.addon.value = this.maskStringWithAsterisks(value);
            }
          }
        }
      }
      actions[index] = action;
    });
    return new Blob([JSON.stringify(config)], { type: 'application/json;charset=utf-8;' });
  }

  async syncConfig(updated: boolean) {
    if (!this.auth.currentUser) {
      return;
    }
    try {
      const { uid } = this.auth.currentUser;
      const storageResult = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS);
      const configs: Array<Configuration> = this.filterConfig(storageResult[LOCAL_STORAGE_KEY.CONFIGS] || [], updated);
      if (configs.length === 0) {
        return;
      }
      for (const config of configs) {
        try {
          // Update Database
          const data: ConfigRequest = { url: config.url, userId: uid };
          if (config.name) {
            data.name = config.name;
          }
          await new FirebaseFirestoreBackground(this.auth, EDGE_OAUTH_CLIENT_ID).setConfig(data, config.id);
          // Update Storage
          const blob = this.getBlob(config);
          await new FirebaseStorageBackground(this.auth).uploadFile(blob, `users/${uid}/${config.id}.json`);
        } catch (error) {
          if (error instanceof Error) {
            googleAnalytics?.fireErrorEvent({ error: error.message, additionalParams: { page: 'sync-config-upload' } });
          } else {
            googleAnalytics?.fireErrorEvent({ error: JSON.stringify(error), additionalParams: { page: 'sync-config-upload' } });
          }
        }
      }
      await this.reset();
    } catch (error) {
      if (error instanceof Error) {
        googleAnalytics?.fireErrorEvent({ error: error.message, additionalParams: { page: 'sync-config' } });
      } else {
        googleAnalytics?.fireErrorEvent({ error: JSON.stringify(error), additionalParams: { page: 'sync-config' } });
      }
    }
  }
}

auth.authStateReady().then(() => {
  chrome.alarms.onAlarm.addListener(({ name }) => {
    if (name === SYNC_CONFIG_ALARM) {
      new SyncConfig(auth).syncConfig(true);
    } else if (name === SYNC_ALL_CONFIG_ALARM) {
      new SyncConfig(auth).syncConfig(false);
    }
  });
});
