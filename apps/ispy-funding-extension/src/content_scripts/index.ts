import { LOAD_TYPES } from '@dhruv-techapps/acf-common';
import { ConfigStorage, GetConfigResult } from '@dhruv-techapps/acf-store';
import { Logger, LoggerColor } from '@dhruv-techapps/core-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import ConfigProcessor from './config';
import { statusBar } from './status-bar';

declare global {
  interface Window {
    __batchRepeat: number;
    __actionRepeat: number;
__api?: any;
  }
}

async function loadConfig(loadType: LOAD_TYPES) {
  try {
    new ConfigStorage().getConfig().then(async ({ autoConfig }: GetConfigResult) => {
      if (autoConfig) {
        if (autoConfig.loadType === loadType) {
          const { host } = document.location;
          Logger.color(chrome.runtime.getManifest().name, undefined, LoggerColor.PRIMARY, host, loadType);
          await ConfigProcessor.checkStartType(autoConfig);
          Logger.color(chrome.runtime.getManifest().name, undefined, LoggerColor.PRIMARY, host, 'END');
        }
      }
    });
  } catch (e) {
    if (e instanceof Error) {
      statusBar.error(e.message);
      GoogleAnalyticsService.fireErrorEvent(chrome.runtime.id, e.name, e.message, { page: 'content_scripts' });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadConfig(LOAD_TYPES.DOCUMENT);
});

window.addEventListener('load', () => {
  loadConfig(LOAD_TYPES.WINDOW);
});

addEventListener('unhandledrejection', (event) => {
  GoogleAnalyticsService.fireErrorEvent(chrome.runtime.id, 'unhandledrejection', event.reason, { page: 'content_scripts' });
});
