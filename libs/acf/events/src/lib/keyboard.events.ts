import { SystemError } from '@dhruv-techapps/core-common';
import { ACTION_I18N_TITLE } from '.';
import CommonEvents from './common.events';
import keyCodes from './keyboard-keycode';

const KEYBOARD_EVENT_KEYDOWN = 'keydown';
const KEYBOARD_EVENT_KEYUP = 'keyup';
const KEYBOARD_EVENT_KEYPRESS = 'keypress';

export const KeyboardEvents = (() => {
  const getVerifiedEvents = (events: string): KeyboardEventInit => {
    if (!events) {
      throw new SystemError('Event is blank!', 'Event cant be blank | null | undefined');
    }

    // eslint-disable-next-line prefer-destructuring
    events = events.split('::')[1];
    let result;
    try {
      result = JSON.parse(events);
    } catch {
      result = events.split('+').reduce((a: KeyboardEventInit, c) => {
        switch (true) {
          case /shift/i.test(c):
            a.shiftKey = true;
            break;
          case /alt/i.test(c):
            a.altKey = true;
            break;
          case /ctrl/i.test(c):
            a.ctrlKey = true;
            break;
          case /meta/i.test(c):
            a.metaKey = true;
            break;
          default:
            a.key = c;
            a.code = c;
            c = c.toLowerCase();
            a.keyCode = keyCodes[c];
            a.which = keyCodes[c];
        }
        return a;
      }, {});
    }
    return result;
  };

  const dispatchEvent = async (element: HTMLElement, events: KeyboardEventInit) => {
    element.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENT_KEYDOWN, { ...CommonEvents.getKeyboardEventProperties(events), charCode: 0 }));
    element.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENT_KEYPRESS, { ...CommonEvents.getKeyboardEventProperties(events) }));
    element.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENT_KEYUP, { ...CommonEvents.getKeyboardEventProperties(events), charCode: 0 }));
  };

  const start = (elements: Array<HTMLElement>, event: string) => {
    const events = getVerifiedEvents(event);
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, elements, events);
    CommonEvents.loopElements(elements, events, dispatchEvent);
  };
  return { start };
})();
