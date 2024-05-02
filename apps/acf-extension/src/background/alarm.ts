import { BACKUP_ALARM, GoogleDriveBackground } from '@dhruv-techapps/google-drive';

/**
 * Alarm which periodically backup configurations
 */
chrome.alarms.onAlarm.addListener(({ name }) => {
  if (name === BACKUP_ALARM) {
    new GoogleDriveBackground().backup();
  }
});
