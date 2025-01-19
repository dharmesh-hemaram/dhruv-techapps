import { ACTION_STATUS, Action } from '@dhruv-techapps/acf-common';
import { STATUS_BAR_TYPE } from '@dhruv-techapps/status-bar';
import Common from './common';
import { statusBar } from './status-bar';
import { ACFEvents } from './util/acf-events';
import { ACFValue } from './util/acf-value';

const ActionProcessor = (() => {
  const repeatFunc = async (action: Action, repeat?: number, repeatInterval?: number | string): Promise<ACTION_STATUS.DONE> => {
    if (repeat !== undefined) {
      if (repeat > 0 || repeat < -1) {
        await statusBar.wait(repeatInterval, STATUS_BAR_TYPE.ACTION_REPEAT, repeat);
        repeat -= 1;
        window.__actionRepeat = window.__actionRepeat + 1;
        await process(action);
        return await repeatFunc(action, repeat, repeatInterval);
      }
    }
    return ACTION_STATUS.DONE;
  };

  const process = async (action: Action) => {
    const elementFinder = await ACFValue.getValue(action.elementFinder);
    const elements = await Common.start(elementFinder, action.settings);
    if (elements === undefined) {
      throw ACTION_STATUS.SKIPPED;
    }
    const value = action.value ? await ACFValue.getValue(action.value, action.settings) : action.value;
    await ACFEvents.check(elementFinder, elements, value);
  };

  const start = async (action: Action) => {
    window.__actionRepeat = 1;
    await process(action);
    return await repeatFunc(action, action.repeat, action.repeatInterval);
  };

  return { start };
})();

export default ActionProcessor;
