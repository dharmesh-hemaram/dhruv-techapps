import { Action, ACTION_RUNNING, ACTION_STATUS } from '@dhruv-techapps/acf-common';
import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { ConfigError, isValidUUID } from '@dhruv-techapps/core-common';
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
    Statement.check(actionStatus, action.statement);
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
      window.__currentActionName = action.name ?? ACTION_I18N.NO_NAME;
      if (action.disabled) {
        console.debug(`${ACTION_I18N.TITLE} #${i + 1}`, `[${window.__currentActionName}]`, `🚫 ${I18N_COMMON.DISABLED} `);
        i += 1;
        continue;
      }
      statusBar.actionUpdate(i + 1, action.name);
      window.__currentAction = i + 1;
      if (!action.elementFinder) {
        throw new ConfigError(I18N_ERROR.ELEMENT_FINDER_BLANK, ACTION_I18N.TITLE);
      }
      try {
        await checkStatement(actions, action);
        await statusBar.wait(action.initWait, STATUS_BAR_TYPE.ACTION_WAIT);
        await AddonProcessor.check(action.addon, action.settings);
        action.status = await ActionProcessor.start(action);
        notify(action);
      } catch (error) {
        if (error === ACTION_STATUS.SKIPPED || error === ACTION_RUNNING.SKIP) {
          console.debug(`${ACTION_I18N.TITLE} #${window.__currentAction}`, `[${window.__currentActionName}]`, window.__actionError, `⏭️ ${ACTION_STATUS.SKIPPED}`);
          action.status = ACTION_STATUS.SKIPPED;
        } else if (typeof error === 'number' || (typeof error === 'string' && isValidUUID(error))) {
          const index = typeof error === 'number' ? error : actions.findIndex((a) => a.id === error);
          if (index === -1) {
            throw new ConfigError(I18N_ERROR.ACTION_NOT_FOUND_FOR_GOTO, ACTION_I18N.TITLE);
          }
          console.debug(`${ACTION_I18N.TITLE} #${window.__currentAction}`, `[${window.__currentActionName}]`, window.__actionError, `${I18N_COMMON.GOTO} Action ➡️ ${index + 1}`);
          i = index - 1;
        } else {
          throw error;
        }
      }
      // Increment
      i += 1;
    }
  };
  return { start };
})();

export default Actions;
