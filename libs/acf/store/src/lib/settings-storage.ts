import { LOCAL_STORAGE_KEY, Settings, defaultSettings } from '@dhruv-techapps/acf-common';

export class SettingsStorage {
  async getSettings(): Promise<Settings> {
    try {
      const { settings = defaultSettings } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.SETTINGS);
      return settings;
    } catch (error) {
      console.warn(error);
    }
    return defaultSettings;
  }
}
