import { ACTION_STATUS, Action } from '@dhruv-techapps/acf-common';
import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { ConfigError, Logger, LoggerColor } from '@dhruv-techapps/core-common';
import { NotificationsService } from '@dhruv-techapps/core-service';
import { STATUS_BAR_TYPE } from '@dhruv-techapps/status-bar';
import ActionProcessor from './action';
import AddonProcessor from './addon';
import Common from './common';
import { I18N_COMMON, I18N_ERROR } from './i18n';
import Statement from './statement';
import { statusBar } from './status-bar';

const ACTION_I18N = {
  TITLE: chrome.i18n.getMessage('@ACTION__TITLE'),
  NO_NAME: chrome.i18n.getMessage('@ACTION__NO_NAME'),
};

const Actions = (() => {
  const checkStatement = async (actions: Array<Action>, action: Action) => {
    const actionStatus = actions.map((action) => action.status ?? ACTION_STATUS['~~ Select STATUS ~~']);
    const result = await Statement.check(actionStatus, action.statement);
    return result;
  };

  const notify = async (action: Action) => {
    const settings = await new SettingsStorage().getSettings();
    if (settings.notifications?.onAction) {
      NotificationsService.create({
        type: 'basic',
        title: `${ACTION_I18N.TITLE} ${I18N_COMMON.COMPLETED}`,
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
        Logger.color(` ${I18N_COMMON.DISABLED} `, 'debug', LoggerColor.BLACK, `${ACTION_I18N.TITLE} #${i + 1} [${action.name || ACTION_I18N.NO_NAME}]`);
        continue;
      }
      statusBar.actionUpdate(i + 1, action.name);
      window.__currentAction = i + 1;
      if (!action.elementFinder) {
        throw new ConfigError(I18N_ERROR.ELEMENT_FINDER_BLANK, ACTION_I18N.TITLE);
      }
      const statementResult = await checkStatement(actions, action);
      if (statementResult === true) {
        await statusBar.wait(action.initWait, STATUS_BAR_TYPE.ACTION_WAIT);
        const addonResult = await AddonProcessor.check(action.addon, action.settings);
        if (typeof addonResult === 'number') {
          i = Number(addonResult) - 1;
          Logger.colorInfo(I18N_COMMON.GOTO, Number(addonResult) + 1);
        } else if (addonResult) {
          const status = await ActionProcessor.start(action);
          if (typeof status === 'number') {
            i = Number(status) - 1;
            Logger.colorInfo(I18N_COMMON.GOTO, Number(status) + 1);
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
          Logger.colorInfo(I18N_COMMON.GOTO, Number(statementResult) + 1);
        }
      }
      // Increment
      i += 1;
    }
  };
  return { start };
})();

export default Actions;
