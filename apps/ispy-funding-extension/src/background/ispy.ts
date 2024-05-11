import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import test from './test.json';

export class Ispy {
  static async test() {
    chrome.storage.local.set({ [LOCAL_STORAGE_KEY.CONFIGS]: test });
  }

  static async loadConfiguration() {
    fetch('https://raw.githubusercontent.com/Dhruv-Techapps/acf-configs/master/ispy_configurations.json')
      .then((r) => r.json())
      .then((r) => chrome.storage.local.set({ [LOCAL_STORAGE_KEY.CONFIGS]: r }));
  }
}
