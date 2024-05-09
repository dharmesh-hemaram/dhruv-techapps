/*global chrome*/

import { GOOGLE_SCOPES, GoogleOauth2Background } from '@dhruv-techapps/google-oauth';
import { NotificationHandler } from '@dhruv-techapps/notifications';
import { BACKUP_ALARM, MINUTES_IN_DAY, NOTIFICATIONS_ID, NOTIFICATIONS_TITLE } from './google-drive.constant';
import { DriveFile, AUTO_BACKUP, GoogleDriveFile } from './google-drive.types';

export class GoogleDriveBackground extends GoogleOauth2Background {
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
