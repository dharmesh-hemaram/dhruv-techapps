import { ACTION_STATUS, Action } from '@dhruv-techapps/acf-common';
import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { ConfigError, Logger, LoggerColor } from '@dhruv-techapps/core-common';
import { NotificationsService } from '@dhruv-techapps/core-service';
import ActionProcessor from './action';
import AddonProcessor from './addon';
import Common from './common';
import Statement from './statement';
import { statusBar } from './status-bar';

const LOGGER_LETTER = 'Action';

const Actions = (() => {
  const checkStatement = async (actions: Array<Action>, action: Action) => {
    const actionStatus = actions.map((action) => action.status ?? ACTION_STATUS['~~ Select STATUS ~~']);
    const result = await Statement.check(actionStatus, action.statement);
    return result;
  };

  const notify = async (action: Action) => {
    const settings = await new SettingsStorage().getSettings();
    if (settings.notifications?.onAction) {
      NotificationsService.create(chrome.runtime.id, {
        type: 'basic',
        title: 'Action Completed',
        message: action.elementFinder,
        silent: !settings.notifications.sound,
        iconUrl: Common.getNotificationIcon(),
      });
    }
  };
  const start = async (actions: Array<Action>, batchRepeat: number) => {
    window.__batchRepeat = batchRepeat;
    let i = 0;
    while (i < actions.length) {
      const action = actions[i];
      if (action.disabled) {
        i += 1;
        Logger.color(' Disabled ', 'debug', LoggerColor.BLACK, `${LOGGER_LETTER} #${i + 1} [${action.name || 'no-name'}]`);
        continue;
      }
      statusBar.actionUpdate(i + 1, action.name);
      console.group(`${LOGGER_LETTER} #${i + 1} [${action.name || 'no-name'}]`);
      if (!action.elementFinder) {
        throw new ConfigError('Element Finder is blank', 'Configuration Action');
      }
      const statementResult = await checkStatement(actions, action);
      if (statementResult === true) {
        await statusBar.wait(action.initWait, `${LOGGER_LETTER} wait`);
        const addonResult = await AddonProcessor.check(action.addon, action.settings);
        if (typeof addonResult === 'number') {
          i = Number(addonResult) - 1;
          Logger.colorInfo('Goto', Number(addonResult) + 1);
        } else if (addonResult) {
          const status = await ActionProcessor.start(action);
          if (typeof status === 'number') {
            i = Number(status) - 1;
            Logger.colorInfo('Goto', Number(status) + 1);
          } else {
            action.status = status;
            notify(action);
          }
        } else {
          action.status = ACTION_STATUS.SKIPPED;
        }
      } else {
        action.status = ACTION_STATUS.SKIPPED;
        if (typeof statementResult !== 'boolean') {
          i = Number(statementResult) - 1;
          Logger.colorInfo('Goto', Number(statementResult) + 1);
        }
      }
      console.groupEnd();
      // Increment
      i += 1;
    }
  };
  return { start };
})();

export default Actions;
