import { Configuration, LOAD_TYPES } from '@dhruv-techapps/acf-common';
import { Logger, LoggerColor } from '@dhruv-techapps/core-common';
import * as Sentry from '@sentry/browser';
import ConfigProcessor from './config';
import Session from './util/session';
import ConfigStorage from './store/config-storage';
import { Sheets } from './util/google-sheets';
import { sentryInit } from '../common/sentry';

declare global {
  interface Window {
    __batchRepeat: number;
    __sheets?: Sheets;
  }
}

async function loadConfig(loadType: LOAD_TYPES) {
  try {
    new ConfigStorage().getConfig().then(async (config?: Configuration) => {
      if (config) {
        if (config.loadType === loadType) {
          sentryInit('content_scripts');
          const { host } = document.location;
          Logger.color(chrome.runtime.getManifest().name, undefined, LoggerColor.PRIMARY, host, loadType);
          await ConfigProcessor.checkStartType(config);
          Logger.color(chrome.runtime.getManifest().name, undefined, LoggerColor.PRIMARY, host, 'END');
        }
      } else {
        console.info(chrome.runtime.getManifest().name, 'No config found', window.location.href);
      }
    });
  } catch (e) {
    Sentry.captureException(e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Session.check();
  loadConfig(LOAD_TYPES.DOCUMENT);
});

window.addEventListener('load', () => {
  loadConfig(LOAD_TYPES.WINDOW);
});
