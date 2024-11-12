import { ConfigError, SystemError } from '@dhruv-techapps/core-common';

export const UNKNOWN_ELEMENT_TYPE_ERROR = 'Unknown element type';

const CommonEvents = (() => {
  const getVerifiedEvents = (verifiedEvents: Array<string>, events: string): Array<string | Event> => {
    if (!events) {
      throw new SystemError('Event is blank!', 'Event cant be blank | null | undefined');
    }
    // eslint-disable-next-line prefer-destructuring
    events = events.split('::')[1];
    let result;
    try {
      const eventObject: Event | Array<Event> = JSON.parse(events);
      if (Array.isArray(eventObject)) {
        result = eventObject.filter((event) => verifiedEvents.indexOf(typeof event === 'string' ? event : event.type) !== -1);
      } else if (verifiedEvents.indexOf(eventObject.type) !== -1) {
        result = [eventObject];
      }
    } catch {
      const event = events.replace(/\W/g, '');
      if (verifiedEvents.indexOf(event) !== -1) {
        result = [event];
      }
    }

    if (result) {
      return result;
    }
    throw new ConfigError(`value: ${events}`, 'Invalid Events');
  };

  const loopElements = <E = Element, T = string | Event>(elements: Array<E>, events: T, trigger: (element: E, events: T) => void): void => {
    elements.forEach((element) => {
      trigger(element, events);
    });
  };

  const getFillEvent = () => {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('change', false, true);
    return event;
  };
  const getMouseEventProperties = (): MouseEventInit => ({ screenX: 10, screenY: 10, clientX: 10, clientY: 10, bubbles: true, cancelable: true, view: window });

  const getPosition = (el: HTMLElement) => {
    let left = 0;
    let top = 0;
    while (el && !Number.isNaN(el.offsetLeft) && !Number.isNaN(el.offsetTop)) {
      left += el.offsetLeft - el.scrollLeft;
      top += el.offsetTop - el.scrollTop;
      el = el.offsetParent as HTMLElement;
    }
    return { top, left };
  };

  const getTouch = (element: HTMLElement) => {
    const offset = getPosition(element);
    return new Touch({
      identifier: Date.now(),
      target: element,
      clientX: offset.left,
      clientY: offset.top,
      radiusX: 10.5,
      radiusY: 10.5,
      rotationAngle: 10,
      force: 0.5,
    });
  };

  const getTouchEventProperties = (element: HTMLElement): TouchEventInit => {
    const touch = getTouch(element);
    return {
      touches: [touch],
      targetTouches: [],
      changedTouches: [touch],
      shiftKey: true,
      cancelable: true,
      bubbles: true,
    };
  };

  const getMouseEvent = () => new MouseEvent('click', getMouseEventProperties());

  const getTouchEvent = (element: HTMLElement) => new TouchEvent('touchstart', getTouchEventProperties(element));

  const getKeyboardEventProperties = ({
    key = '',
    code = '',
    location = 0,
    ctrlKey = false,
    bubbles = true,
    shiftKey = false,
    altKey = false,
    metaKey = false,
    repeat = false,
    isComposing = false,
    charCode = 0,
    keyCode = 0,
    which = 0,
  }): KeyboardEventInit => ({ key, code, location, ctrlKey, shiftKey, altKey, metaKey, bubbles, repeat, isComposing, charCode, keyCode, which });

  const getElementWindow = (element: HTMLElement): Window & typeof globalThis => {
    return element.ownerDocument.defaultView || window;
  };

  return { getFillEvent, getElementWindow, getMouseEvent, getMouseEventProperties, getKeyboardEventProperties, loopElements, getVerifiedEvents, getTouchEvent, getTouchEventProperties, getTouch };
})();

export const EVENTS = {
  SCROLL_TO: 'scrollto',
  CLICK_EVENTS: 'clickevents',
  MOUSE_EVENTS: 'mouseevents',
  TOUCH_EVENTS: 'touchevents',
  FORM_EVENTS: 'formevents',
  KEY_EVENTS: 'keyevents',
  TABS_EVENTS: 'tabs',
  KEYBOARD_EVENTS: 'keyboardevents',
  ATTR: 'attr',
  CLASS: 'class',
  COPY: 'copy',
  PASTE: 'paste',
  WINDOW_COMMAND: 'windowcommand',
  LOCATION_COMMAND: 'locationcommand',
  FUNC: 'func',
  REPLACE: 'replace',
  APPEND: 'append',
  PREPEND: 'prepend',
  CLIPBOARD: 'clipboard',
  ELEMENT: 'element',
};

export default CommonEvents;
