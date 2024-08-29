import { Configuration, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { FirebaseDatabaseBackground } from '@dhruv-techapps/firebase-database';
import { Auth } from '@dhruv-techapps/firebase-oauth';
import { FirebaseStorageBackground } from '@dhruv-techapps/firebase-storage';
import { EDGE_OAUTH_CLIENT_ID } from '../common/environments';
import { auth } from './firebase';
import { googleAnalytics } from './google-analytics';

const SYNC_CONFIG_ALARM = 'sync-config';

export class SyncConfig {
  constructor(private auth: Auth) {}

  filterConfig(configs: Array<Configuration>): Array<Configuration> {
    return configs.filter((config: Configuration) => config.url && config.updated && !config.download);
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

  async syncConfig() {
    if (!this.auth.currentUser) {
      return;
    }
    try {
      console.log('Starting Sync');
      const { uid } = this.auth.currentUser;
      const storageResult = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS);
      const configs: Array<Configuration> = this.filterConfig(storageResult[LOCAL_STORAGE_KEY.CONFIGS] || []);
      if (configs.length === 0) {
        console.log('No config to sync');
        return;
      }
      console.log(configs);
      for (const config of configs) {
        console.log(config);
        try {
          const db = { url: config.url, name: config.name, userId: uid };
          await new FirebaseDatabaseBackground(this.auth, EDGE_OAUTH_CLIENT_ID).setConfig(db, config.id);

          config.download = true;
          const blob = new Blob([JSON.stringify(config)], { type: 'application/json;charset=utf-8;' });
          await new FirebaseStorageBackground(this.auth).uploadFile(blob, `users/${uid}/${config.id}.json`);
        } catch (error) {
          console.error(error);
          if (error instanceof Error) {
            googleAnalytics?.fireErrorEvent({ error: error.message, additionalParams: { page: 'sync-config-upload' } });
          } else {
            googleAnalytics?.fireErrorEvent({ error: JSON.stringify(error), additionalParams: { page: 'sync-config-upload' } });
          }
        }
      }
      await this.reset();
    } catch (error) {
      console.error(error);
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
      new SyncConfig(auth).syncConfig();
    }
  });
});
