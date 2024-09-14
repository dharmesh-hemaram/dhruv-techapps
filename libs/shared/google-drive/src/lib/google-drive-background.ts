/*global chrome*/

import { FirebaseFunctionsBackground } from '@dhruv-techapps/firebase-functions';
import { GOOGLE_SCOPES } from '@dhruv-techapps/google-oauth';
import { NotificationHandler } from '@dhruv-techapps/notifications';
import { BACKUP_ALARM, MINUTES_IN_DAY, NOTIFICATIONS_ID, NOTIFICATIONS_TITLE } from './google-drive.constant';
import { AUTO_BACKUP, DriveFile, GoogleDriveFile } from './google-drive.types';

export class GoogleDriveBackground extends FirebaseFunctionsBackground {
  scopes = [GOOGLE_SCOPES.DRIVE];

  async autoBackup(autoBackup: AUTO_BACKUP) {
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

  async _createOrUpdate(name: string, data: string, fileId?: string) {
    const result = await this.driveCreateOrUpdate({ name, data, fileId });
    return result;
  }

  async delete(request: { id: string; name: string }) {
    const response = await this.driveDelete<{ id: string; name: string }, { error: string }>(request);
    if (response.error) {
      throw new Error(response.error);
    }
  }

  async listWithContent(): Promise<Array<DriveFile>> {
    const { files } = await this.driveList<GoogleDriveFile>();
    if (!files) return [];
    for (const file of files) {
      file.content = await this.driveGet(file);
    }
    return files;
  }
}
