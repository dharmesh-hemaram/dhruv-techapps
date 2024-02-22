import { ACTION_STATUS, Action } from '@dhruv-techapps/acf-common';
import Common from './common';
import Value from './util/value';
import Events from './events';
import { wait } from './util';

const LOGGER_LETTER = 'Action';

const ActionProcessor = (() => {
  const repeatFunc = async (elements: Array<HTMLElement>, repeat?: number, repeatInterval?: number | string, value?: string): Promise<ACTION_STATUS> => {
    if (repeat !== undefined) {
      if (repeat > 0 || repeat < -1) {
        await wait(repeatInterval, `${LOGGER_LETTER} repeat`, repeat, '<interval>');
        repeat -= 1;
        await Events.check(elements, value);
        return await repeatFunc(elements, repeat, repeatInterval, value);
      }
    }
    return ACTION_STATUS.DONE;
  };

  const start = async (action: Action) => {
    const elementFinder = await Value.getValue(action.elementFinder);
    const elements = await Common.start(elementFinder, action.settings);
    if (typeof elements === 'number') {
      return elements;
    }
    if (elements === undefined) {
      return ACTION_STATUS.SKIPPED;
    }
    const value = action.value ? await Value.getValue(action.value) : action.value;
    await Events.check(elements, value);
    return await repeatFunc(elements, action.repeat, action.repeatInterval, value);
  };

  return { start };
})();

export default ActionProcessor;
