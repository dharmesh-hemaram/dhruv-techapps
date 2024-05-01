import { LOAD_TYPES } from '@dhruv-techapps/acf-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/acf-service';
import { ConfigStorage, GetConfigResult } from '@dhruv-techapps/acf-store';
import { Logger, LoggerColor } from '@dhruv-techapps/core-common';
import { StatusBar } from '@dhruv-techapps/status-bar';
import ConfigProcessor from './config';
import { Sheets } from './util/google-sheets';
import { Session } from '@dhruv-techapps/acf-util';

declare global {
  interface Window {
    __batchRepeat: number;
    __actionRepeat: number;
    __sheets?: Sheets;
  }
}

async function loadConfig(loadType: LOAD_TYPES) {
  try {
    new ConfigStorage().getConfig().then(async ({ autoConfig, manualConfigs }: GetConfigResult) => {
      if (autoConfig) {
        if (autoConfig.loadType === loadType) {
          const { host } = document.location;
          Logger.color(chrome.runtime.getManifest().name, undefined, LoggerColor.PRIMARY, host, loadType);
          await ConfigProcessor.checkStartType(manualConfigs, autoConfig);
          Logger.color(chrome.runtime.getManifest().name, undefined, LoggerColor.PRIMARY, host, 'END');
        }
      } else if (manualConfigs.length > 0 && loadType === LOAD_TYPES.DOCUMENT) {
        await ConfigProcessor.checkStartType(manualConfigs);
      } else {
        console.info(chrome.runtime.getManifest().name, 'No config found', window.location.href);
      }
    });
  } catch (e) {
    if (e instanceof Error) {
      StatusBar.getInstance().error(e.message);
      GoogleAnalyticsService.fireErrorEvent(chrome.runtime.id, e.name, e.message, { page: 'content_scripts' });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Session.check();
  loadConfig(LOAD_TYPES.DOCUMENT);
});

window.addEventListener('load', () => {
  loadConfig(LOAD_TYPES.WINDOW);
});

addEventListener('unhandledrejection', (event) => {
  GoogleAnalyticsService.fireErrorEvent(chrome.runtime.id, 'unhandledrejection', event.reason, { page: 'content_scripts' });
});
