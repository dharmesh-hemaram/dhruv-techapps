import { Configuration } from '@dhruv-techapps/acf-common';
import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { ConfigError, Logger } from '@dhruv-techapps/core-common';
import { NotificationsService } from '@dhruv-techapps/core-service';
import { DiscordMessagingService } from '@dhruv-techapps/discord-messaging';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import { GoogleSheetsCS } from '@dhruv-techapps/google-sheets';
import BatchProcessor from './batch';
import Common from './common';
import { Hotkey } from './hotkey';
import { statusBar } from './status-bar';
import GoogleSheets from './util/google-sheets';

const LOGGER_LETTER = 'Config';
const ConfigProcessor = (() => {
  const getFields = (config: Configuration) => {
    Logger.colorDebug('GetFields', { url: config.url, name: config.name });
    const fields = [{ name: 'URL', value: config.url }];

    if (config.name) {
      fields.unshift({ name: 'name', value: config.name });
    }
    return fields;
  };

  const getEvents = (config: Configuration) => {
    const events: { [key: string]: string | number | boolean | undefined } = { url: config.url, loadType: config.loadType, actions: config.actions.length };
    if (config.batch) {
      events['batch'] = config.batch.refresh || config.batch.repeat;
    }
    if (config.spreadsheetId) {
      events.sheets = true;
    }
    if (config.actions.some((a) => a.addon)) {
      events.addon = true;
    }
    if (config.actions.some((a) => a.statement)) {
      events.statement = true;
    }
    return events;
  };

  const start = async (config: Configuration) => {
    const sheets = GoogleSheets.getSheets(config);
    window.__sheets = await new GoogleSheetsCS().getValues(sheets, config.spreadsheetId);
    try {
      await BatchProcessor.start(config.actions, config.batch);
      const { notifications } = await new SettingsStorage().getSettings();
      if (notifications) {
        const { onConfig, sound, discord } = notifications;
        if (onConfig) {
          NotificationsService.create(chrome.runtime.id, { type: 'basic', title: 'Config Completed', message: config.name || config.url, silent: !sound, iconUrl: Common.getNotificationIcon() });
          if (discord) {
            DiscordMessagingService.success(chrome.runtime.id, 'Configuration Finished', getFields(config));
          }
        }
      }
      statusBar.done();
      GoogleAnalyticsService.fireEvent(chrome.runtime.id, 'configuration_completed', getEvents(config));
    } catch (e) {
      if (e instanceof ConfigError) {
        statusBar.error(e.message);
        const error = { title: e.title, message: `url : ${config.url}\n${e.message}` };
        const { notifications } = await new SettingsStorage().getSettings();
        if (notifications?.onError) {
          const { sound, discord } = notifications;
          NotificationsService.create(chrome.runtime.id, { type: 'basic', ...error, silent: !sound, iconUrl: Common.getNotificationIcon() }, 'error');
          if (discord) {
            DiscordMessagingService.error(chrome.runtime.id, e.title || 'Configuration Error', [
              ...getFields(config),
              ...e.message.split('\n').map((info) => {
                const [name, value] = info.split(':');
                return { name, value: value.replace(/'/g, '`') };
              }),
            ]);
          }
        } else {
          console.error(error.title, '\n', error.message);
        }
        GoogleAnalyticsService.fireErrorEvent(chrome.runtime.id, e.name, e.message, { page: 'content_scripts' });
      } else {
        throw e;
      }
    }
  };

  const schedule = async (startTime: string) => {
    Logger.colorDebug('Schedule', { startTime: startTime });
    const rDate = new Date();
    rDate.setHours(Number(startTime.split(':')[0]));
    rDate.setMinutes(Number(startTime.split(':')[1]));
    rDate.setSeconds(Number(startTime.split(':')[2]));
    rDate.setMilliseconds(Number(startTime.split(':')[3]));
    Logger.colorDebug('Schedule', { date: rDate });
    await new Promise((resolve) => {
      setTimeout(resolve, rDate.getTime() - new Date().getTime());
    });
  };

  const checkStartTime = async (config: Configuration) => {
    if (config.startTime?.match(/^\d{2}:\d{2}:\d{2}:\d{3}$/)) {
      await schedule(config.startTime);
    } else {
      await statusBar.wait(config.initWait, `${LOGGER_LETTER} wait`);
    }
  };

  const setupStatusBar = async () => {
    const { statusBar: statusBarLocation } = await new SettingsStorage().getSettings();
    statusBar.setLocation(statusBarLocation);
  };

  const checkStartType = async (configs: Array<Configuration>, config?: Configuration) => {
    setupStatusBar();
    configs.forEach((c) => {
      Hotkey.setup(start.bind(this, c), c.hotkey);
    });
    if (config) {
      await checkStartTime(config);
      await start(config);
    }
  };

  return { checkStartType };
})();

export default ConfigProcessor;
