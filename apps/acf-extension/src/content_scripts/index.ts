import { LOAD_TYPES, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { ConfigStorage, GetConfigResult, SettingsStorage } from '@dhruv-techapps/acf-store';
import { Session } from '@dhruv-techapps/acf-util';
import { Logger, LoggerColor } from '@dhruv-techapps/core-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import { Sheets } from '@dhruv-techapps/google-sheets';
import ConfigProcessor from './config';
import { statusBar } from './status-bar';

declare global {
  interface Window {
    __currentAction: number;
    __actionRepeat: number;
    __batchRepeat: number;
    __sessionCount: number;
    __sheets?: Sheets;
  }
}

let reloadOnError = false;
new SettingsStorage().getSettings().then((settings) => {
  if (settings.reloadOnError !== undefined) {
    reloadOnError = settings.reloadOnError;
  }
});

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
      }
    });
  } catch (e) {
    if (e instanceof Error) {
      statusBar.error(e.message);
      GoogleAnalyticsService.fireErrorEvent(e.name, e.message, { page: 'content_scripts' });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.__sessionCount = Session.getCount();
  loadConfig(LOAD_TYPES.DOCUMENT);
});

window.addEventListener('load', () => {
  loadConfig(LOAD_TYPES.WINDOW);
});

addEventListener('unhandledrejection', (event) => {
  if (reloadOnError && event.reason.message === 'Extension context invalidated.') {
    window.location.reload();
    return;
  }
  GoogleAnalyticsService.fireErrorEvent('unhandledrejection', event.reason, { page: 'content_scripts' });
});

chrome.runtime.onMessage.addListener(async (message) => {
  const { action, configId } = message;
  if (action === RUNTIME_MESSAGE_ACF.RUN_CONFIG) {
    try {
      new ConfigStorage().getConfigById(configId).then(async (config) => {
        Logger.color(chrome.runtime.getManifest().name, undefined, LoggerColor.PRIMARY, config?.url, 'START');
        await ConfigProcessor.checkStartType([], config);
        Logger.color(chrome.runtime.getManifest().name, undefined, LoggerColor.PRIMARY, config?.url, 'END');
      });
    } catch (e) {
      if (e instanceof Error) {
        statusBar.error(e.message);
        GoogleAnalyticsService.fireErrorEvent(e.name, e.message, { page: 'content_scripts' });
      }
    }
  }
});
