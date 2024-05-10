import { Action, Batch } from '@dhruv-techapps/acf-common';
import { SettingsStorage } from '@dhruv-techapps/acf-store';
import { NotificationsService } from '@dhruv-techapps/core-service';
import Actions from './actions';
import Common from './common';
import { statusBar } from './status-bar';

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
          statusBar.batchUpdate(i + 2);
          console.groupCollapsed(`${LOGGER_LETTER} #${i + 2} [repeat]`);
          if (batch?.repeatInterval) {
            await statusBar.wait(batch?.repeatInterval, `${LOGGER_LETTER} repeat`, i + 2);
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
            statusBar.batchUpdate('∞');
            await statusBar.wait(batch?.repeatInterval, `${LOGGER_LETTER} repeat`, '∞');
          }
          await Actions.start(actions, i);
          i += 1;
        }
      }
    }
  };

  const start = async (actions: Array<Action>, batch?: Batch) => {
    try {
      statusBar.batchUpdate(1);
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
