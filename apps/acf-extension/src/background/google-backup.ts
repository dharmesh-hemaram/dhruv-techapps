/*global chrome*/

import { AUTO_BACKUP, DriveFile, GOOGLE_SCOPES, LOCAL_STORAGE_KEY, defaultConfig, defaultSettings } from '@dhruv-techapps/acf-common';
import GoogleOauth2 from './google-oauth2';
import { NotificationHandler } from './notifications';

const BACKUP_ALARM = 'backupAlarm';
const BACKUP_FILE_NAMES = {
  CONFIGS: `${LOCAL_STORAGE_KEY.CONFIGS}.txt`,
  SETTINGS: `${LOCAL_STORAGE_KEY.SETTINGS}.txt`,
};
const MINUTES_IN_DAY = 1440;

const NOTIFICATIONS_TITLE = 'Google Drive Backup';
const NOTIFICATIONS_ID = 'sheets';

type GoogleDriveFile = {
  nextPageToken: string;
  kind: string;
  incompleteSearch: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files: Array<DriveFile>;
};

export default class GoogleBackup extends GoogleOauth2 {
  scopes = [GOOGLE_SCOPES.DRIVE, GOOGLE_SCOPES.PROFILE];
  async setAlarm(autoBackup: AUTO_BACKUP) {
    const alarmInfo: chrome.alarms.AlarmCreateInfo = { when: Date.now() + 500 };
    await chrome.alarms.clear(BACKUP_ALARM);
    switch (autoBackup) {
      case AUTO_BACKUP.DAILY:
        alarmInfo.periodInMinutes = MINUTES_IN_DAY;
        break;
      case AUTO_BACKUP.WEEKLY:
        alarmInfo.periodInMinutes = MINUTES_IN_DAY * 7;
        break;
      case AUTO_BACKUP.MONTHLY:
        alarmInfo.periodInMinutes = MINUTES_IN_DAY * 30;
        break;
      case AUTO_BACKUP.OFF:
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Auto backup off', false);
        return;
      default:
        break;
    }
    NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, `Auto backup set ${autoBackup}`, false);
    chrome.alarms.create(BACKUP_ALARM, alarmInfo);
  }

  async checkInvalidCredentials(message: string) {
    if (message === 'Invalid Credentials' || message.includes('invalid authentication credentials')) {
      await this.removeCachedAuthToken();
      NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Token expired reauthenticate!');
      return true;
    }
    NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, message);
    return false;
  }

  async backup(now?: boolean) {
    try {
      const { configs = [{ ...defaultConfig }] } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS);
      if (configs) {
        const { settings = { ...defaultSettings } } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.SETTINGS);
        const { files } = await this.list();
        await this.createOrUpdate(BACKUP_FILE_NAMES.CONFIGS, configs, files.find((file) => file.name === BACKUP_FILE_NAMES.CONFIGS)?.id);
        await this.createOrUpdate(BACKUP_FILE_NAMES.SETTINGS, settings, files.find((file) => file.name === BACKUP_FILE_NAMES.SETTINGS)?.id);
        if (!settings.backup) {
          settings.backup = {};
        }
        const lastBackup = new Date().toLocaleString();
        settings.backup.lastBackup = lastBackup;
        chrome.storage.local.set({ [LOCAL_STORAGE_KEY.SETTINGS]: settings });
        if (now) {
          NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, `Configurations are backup on Google Drive at ${settings.backup.lastBackup}`);
        }
        return lastBackup;
      }
    } catch (error) {
      if (error instanceof Error) {
        const retry = await this.checkInvalidCredentials(error.message);
        if (retry) {
          this.backup(now);
        }
      }
    }
  }

  async restore(file: DriveFile) {
    try {
      const fileContent = await this.get(file);
      if (fileContent) {
        if (file.name === BACKUP_FILE_NAMES.SETTINGS) {
          chrome.storage.local.set({ [LOCAL_STORAGE_KEY.SETTINGS]: fileContent });
        }
        if (file.name === BACKUP_FILE_NAMES.CONFIGS) {
          chrome.storage.local.set({ [LOCAL_STORAGE_KEY.CONFIGS]: fileContent });
        }
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Configurations are restored from Google Drive. Refresh configurations page to load content.');
      }
    } catch (error) {
      if (error instanceof Error) {
        const retry = await this.checkInvalidCredentials(error.message);
        if (retry) {
          this.restore(file);
        }
      }
    }
  }

  async createOrUpdate(name: string, data: string, fileId?: string) {
    const metadata = {
      name,
      mimeType: 'plain/text',
      ...(!fileId && { parents: ['appDataFolder'] }),
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([JSON.stringify(data)], { type: 'plain/text' }));

    const headers = await this.getHeaders(this.scopes);
    const options = {
      headers,
      method: fileId ? 'PATCH' : 'POST',
      body: form,
    };

    const baseUrl = 'https://www.googleapis.com';
    let url = new URL('upload/drive/v3/files', baseUrl);
    if (fileId) {
      url = new URL(`upload/drive/v3/files/${fileId}`, baseUrl);
    }
    url.searchParams.append('uploadType', 'multipart');
    const result = await fetch(url.href, options);
    const config = await result.json();
    return config;
  }

  async list(): Promise<GoogleDriveFile> {
    const headers = await this.getHeaders(this.scopes);
    const response = await fetch('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id%2C%20name%2C%20modifiedTime)&pageSize=10', { headers });
    if (response.status === 401) {
      const { error } = await response.json();
      throw new Error(error.message);
    }
    const result = await response.json();
    return result;
  }

  async listWithContent(): Promise<Array<DriveFile>> {
    const { files } = await this.list();
    for (const file of files) {
      file.content = await this.get(file);
    }
    return files;
  }

  async get({ id }: DriveFile) {
    const headers = await this.getHeaders(this.scopes);
    const result = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, { headers });
    const file = await result.json();
    return file;
  }

  async delete({ id }: DriveFile) {
    const headers = await this.getHeaders(this.scopes);
    const result = await fetch(`https://www.googleapis.com/drive/v3/files/${id}`, { headers, method: 'DELETE' });
    return result;
  }
}

/**
 * Alarm which periodically backup configurations
 */
chrome.alarms.onAlarm.addListener(({ name }) => {
  if (name === BACKUP_ALARM) {
    new GoogleBackup().backup();
  }
});
