import { ConfigError, SystemError } from '@dhruv-techapps/core-common';
import { ACTION_I18N_TITLE } from '.';
import CommonEvents from './common.events';

export const TouchEvents = (() => {
  const dispatchEvent = (element: HTMLElement, events: Array<string | Event>) => {
    events.forEach((event) => {
      if (typeof event === 'string') {
        element.dispatchEvent(new TouchEvent(event, CommonEvents.getTouchEventProperties(element)));
      } else {
        element.dispatchEvent(new TouchEvent(event.type, { ...CommonEvents.getTouchEventProperties(element), ...event }));
      }
    });
  };

  const getVerifiedEvents = (events: string) => {
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
