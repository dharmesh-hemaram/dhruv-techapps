import { ConfigError, SystemError } from '@dhruv-techapps/core-common';
import { ACTION_I18N_TITLE } from '.';
import CommonEvents from './common.events';

type CustomMouseEvent = {
  type: string;
} & MouseEventInit;

export const MouseEvents = (() => {
  const dispatchEvent = (element: HTMLElement, events: Array<string | CustomMouseEvent>) => {
    events.forEach((event) => {
      if (typeof event === 'string') {
        element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()));
      } else {
        element.dispatchEvent(new MouseEvent(event.type, { ...CommonEvents.getMouseEventProperties(), ...event }));
      }
    });
  };

  const getVerifiedEvents = (events: string): Array<string | CustomMouseEvent> => {
    if (!events) {
      throw new SystemError('Event is blank!', 'Event cant be blank | null | undefined');
    }
    // eslint-disable-next-line prefer-destructuring
    events = events.split('::')[1];
    let result;
    try {
      const eventObject = JSON.parse(events);
      if (Array.isArray(eventObject)) {
        result = eventObject;
      } else {
        result = [eventObject];
      }
    } catch {
      const event = events.replace(/\W/g, '');
      if (event) {
        result = [event];
      }
    }

    if (result) {
      return result;
    }
    throw new ConfigError(`value: ${events}`, 'Invalid Events');
  };

  const start = (elements: Array<HTMLElement>, event: string) => {
    const events = getVerifiedEvents(event);
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, elements, events);
    CommonEvents.loopElements(elements, events, dispatchEvent);
  };
  return { start };
})();
