import { RADIO_CHECKBOX_NODE_NAME } from '@dhruv-techapps/acf-common';
import { Logger } from '@dhruv-techapps/core-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import CommonEvents from './common.events';

const DEFAULT_EVENT = ['mouseover', 'mousedown', 'mouseup', 'click'];
const CHANGE_EVENT = ['input', 'change'];

const LOGGER_LETTER = 'Plain Events';
export const PlainEvents = (() => {
  const checkEmptyValue = (value: string) => (value === '::empty' ? '' : value);

  const dispatchEvent = (element: HTMLElement, value: string) => {
    if (element instanceof HTMLSelectElement) {
      const nodes = document.evaluate(`.//option[text()="${value}" or @value="${value}" or @id="${value}"]`, element, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (nodes.snapshotLength !== 0) {
        (nodes.snapshotItem(0) as HTMLOptionElement).selected = true;
      }
    } else if (element instanceof HTMLTextAreaElement || (element instanceof HTMLInputElement && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value;
      element.dispatchEvent(CommonEvents.getFillEvent());
    } else if (element instanceof HTMLOptionElement) {
      element.selected = true;
    } else if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent(chrome.runtime.id, 'isContentEditable', { event: 'PlainEvents' });
      element.textContent = value;
    } else {
      DEFAULT_EVENT.forEach((event) => {
        element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()));
      });
    }
    CHANGE_EVENT.forEach((event) => {
      element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()));
    });
    element.focus();
  };

  const start = (elements: Array<HTMLElement>, value: string) => {
    Logger.colorDebug(LOGGER_LETTER, value);
    value = checkEmptyValue(value);
    CommonEvents.loopElements(elements, value, dispatchEvent);
  };

  return { start };
})();
