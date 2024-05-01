import { Action, Batch } from '@dhruv-techapps/acf-common';
import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { NotificationsService } from '@dhruv-techapps/core-service';
import { wait } from '@dhruv-techapps/shared-util';
import { StatusBar } from '@dhruv-techapps/status-bar';
import Actions from './actions';
import Common from './common';

const LOGGER_LETTER = 'Batch';

const BatchProcessor = (() => {
  const refresh = () => {
    if (document.readyState === 'complete') {
      window.location.reload();
    } else {
      window.addEventListener('load', () => {
        window.location.reload();
      });
    }
  };

  const checkRepeat = async (actions: Array<Action>, batch: Batch) => {
    if (batch.repeat) {
      if (batch.repeat > 0) {
        for (let i = 0; i < batch.repeat; i += 1) {
          StatusBar.getInstance().batchUpdate(i + 2);
          console.groupCollapsed(`${LOGGER_LETTER} #${i + 2} [repeat]`);
          if (batch?.repeatInterval) {
            await wait(batch?.repeatInterval, `${LOGGER_LETTER} repeat`, i + 2, '<interval>');
          }
          await Actions.start(actions, i + 2);
          const { notifications } = await new SettingsStorage().getSettings();
          if (notifications?.onBatch) {
            NotificationsService.create(chrome.runtime.id, {
              type: 'basic',
              title: 'Batch Completed',
              message: `#${i + 1} Batch`,
              silent: !notifications.sound,
              iconUrl: Common.getNotificationIcon(),
            });
          }
          console.groupEnd();
        }
      } else if (batch.repeat < -1) {
        let i = 1;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          if (batch?.repeatInterval) {
            StatusBar.getInstance().batchUpdate('∞');
            await wait(batch?.repeatInterval, `${LOGGER_LETTER} repeat`, '∞', '<interval>');
          }
          await Actions.start(actions, i);
          i += 1;
        }
      }
    }
  };

  const start = async (actions: Array<Action>, batch?: Batch) => {
    try {
      StatusBar.getInstance().batchUpdate(1);
      console.groupCollapsed(`${LOGGER_LETTER} #1 (default)`);
      await Actions.start(actions, 1);
      console.groupEnd();
      if (batch) {
        if (batch.refresh) {
          refresh();
        } else {
          await checkRepeat(actions, batch);
        }
      }
    } catch (error) {
      console.groupEnd();
      throw error;
    }
  };

  return { start };
})();

export default BatchProcessor;
