import { AppendEvents } from './append.events';
import { AttributeEvents } from './attribute.events';
import { ClassEvents } from './class-list.events';
import { ClipboardEvents } from './clipboard.events';
import CommonEvents, { EVENTS } from './common.events';
import { CopyEvents } from './copy.events';
import { ElementEvents } from './element.events';
import { FormEvents } from './form.events';
import { FuncEvents } from './func.events';
import { KeyEvents } from './key.events';
import { KeyboardEvents } from './keyboard.events';
import { LocationCommandEvents } from './location-command.events';
import { MouseEvents } from './mouse.events';
import { PasteEvents } from './paste.events';
import { PlainEvents } from './plain.events';
import { PrependEvents } from './prepend.events';
import { ReplaceEvents } from './replace.events';
import { ScrollToEvents } from './scroll-to.events';
import { TabsEvents } from './tabs.events';
import { TouchEvents } from './touch.events';
import { WindowCommandEvents } from './window-command.events';

const DEFAULT_EVENT = ['mouseover', 'mousedown', 'mouseup', 'click'];

export const ACTION_I18N_TITLE = chrome.i18n.getMessage('@ACTION__TITLE');

export const Events = (() => {
  const check = async (elements: Array<HTMLElement>, value?: string) => {
    if (value) {
      const eventRegexArray = /^(\w+)::/.exec(value);
      let event;
      if (eventRegexArray) {
        event = eventRegexArray[1].toLowerCase();
      }
      switch (event) {
        case EVENTS.SCROLL_TO:
          ScrollToEvents.start(elements, value);
          break;
        case EVENTS.MOUSE_EVENTS:
        case EVENTS.CLICK_EVENTS:
          MouseEvents.start(elements, value);
          break;
        case EVENTS.TOUCH_EVENTS:
          TouchEvents.start(elements, value);
          break;
        case EVENTS.FORM_EVENTS:
          FormEvents.start(elements, value);
          break;
        case EVENTS.KEY_EVENTS:
          KeyEvents.start(elements, value);
          break;
        case EVENTS.TABS_EVENTS:
          TabsEvents.start(value);
          break;
        case EVENTS.ATTR:
          AttributeEvents.start(elements, value);
          break;
        case EVENTS.CLASS:
          ClassEvents.start(elements, value);
          break;
        case EVENTS.COPY:
          CopyEvents.start(elements, value);
          break;
        case EVENTS.PASTE:
          await PasteEvents.start(elements, value);
          break;
        case EVENTS.WINDOW_COMMAND:
          WindowCommandEvents.start(value);
          break;
        case EVENTS.LOCATION_COMMAND:
          LocationCommandEvents.start(value);
          break;
        case EVENTS.FUNC:
          await FuncEvents.start(elements, value);
          break;
        case EVENTS.REPLACE:
          ReplaceEvents.start(elements, value);
          break;
        case EVENTS.APPEND:
          AppendEvents.start(elements, value);
          break;
        case EVENTS.PREPEND:
          PrependEvents.start(elements, value);
          break;
        case EVENTS.KEYBOARD_EVENTS:
          KeyboardEvents.start(elements, value);
          break;
        case EVENTS.CLIPBOARD:
          await ClipboardEvents.start(elements, value);
          break;
        case EVENTS.ELEMENT:
          ElementEvents.start(elements, value);
          break;
        default:
          PlainEvents.start(elements, value);
      }
    } else {
      console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, elements, 'Default Click Events');
      elements.forEach((element) => {
        DEFAULT_EVENT.forEach((event) => {
          element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()));
        });
      });
    }
    return true;
  };

  return { check };
})();
