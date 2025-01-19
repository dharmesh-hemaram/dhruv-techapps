import { ConfigError, SystemError } from '@dhruv-techapps/core-common';
import { Timer } from '@dhruv-techapps/shared-util';
import { ACTION_I18N_TITLE } from '.';
import CommonEvents, { UNKNOWN_ELEMENT_TYPE_ERROR } from './common.events';

const KEYBOARD_EVENT_KEYDOWN = 'keydown';
const KEYBOARD_EVENT_KEYUP = 'keyup';

type KeyEvent = KeyboardEventInit & {
  value?: string;
  delay?: number;
};

export const KeyEvents = (() => {
  const getVerifiedEvents = (events: string): Array<KeyEvent> => {
    if (!events) {
      throw new SystemError('Event is blank!', 'Event cant be blank | null | undefined');
    }
    // eslint-disable-next-line prefer-destructuring
    events = events.split('::')[1];
    let result: Array<KeyEvent>;
    try {
      const { value, delay = 0, shiftKey, ctrlKey, metaKey, altKey }: KeyEvent = JSON.parse(events);
      if (value) {
        result = value.split('').map<KeyEvent>((event: string) => ({ ...CommonEvents.getKeyboardEventProperties({ key: event, shiftKey, ctrlKey, metaKey, altKey }), delay }));
      } else {
        throw new ConfigError(events, 'Invalid Events');
      }
    } catch {
      result = events.split('').map((event) => ({ ...CommonEvents.getKeyboardEventProperties({ key: event }) }));
    }
    if (result) {
      return result;
    }
    throw new ConfigError(events, 'Invalid Events');
  };

  const dispatchEvent = async (element: HTMLElement, events: Array<KeyEvent>) => {
    const eW = CommonEvents.getElementWindow(element); // Get eW
    if (element instanceof eW.HTMLInputElement || element instanceof eW.HTMLTextAreaElement) {
      // eslint-disable-next-line no-restricted-syntax
      for (const event of events) {
        element.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENT_KEYDOWN, event));
        element.value += event.key;
        element.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENT_KEYUP, event));

        if (event.delay) {
          await Timer.getTimeAndSleep(event.delay);
        }
      }
    } else {
      throw new ConfigError(UNKNOWN_ELEMENT_TYPE_ERROR, 'Key Events');
    }
  };

  const start = (elements: Array<HTMLElement>, event: string) => {
    const events = getVerifiedEvents(event);
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, elements, events);
    CommonEvents.loopElements<HTMLElement, Array<KeyEvent>>(elements, events, dispatchEvent);
  };
  return { start };
})();
