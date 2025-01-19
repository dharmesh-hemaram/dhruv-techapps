import { RADIO_CHECKBOX_NODE_NAME } from '@dhruv-techapps/acf-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import { ACTION_I18N_TITLE } from '.';

import CommonEvents from './common.events';

const DEFAULT_EVENT = ['mouseover', 'mousedown', 'mouseup', 'click'];
const CHANGE_EVENT = ['input', 'change'];

export const PlainEvents = (() => {
  const checkEmptyValue = (value: string) => (value === '::empty' ? '' : value);

  const dispatchEvent = (element: HTMLElement, value: string) => {
    const eW = CommonEvents.getElementWindow(element);
    if (element instanceof eW.HTMLSelectElement) {
      const nodes = document.evaluate(
        `.//option[text()="${value}" or contains(text(),"${value}") or @value="${value}" or @id="${value}"]`,
        element,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      if (nodes.snapshotLength !== 0) {
        (nodes.snapshotItem(0) as HTMLOptionElement).selected = true;
      }
    } else if (element instanceof eW.HTMLTextAreaElement || (element instanceof eW.HTMLInputElement && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value;
      element.dispatchEvent(CommonEvents.getFillEvent());
    } else if (element instanceof eW.HTMLOptionElement) {
      element.selected = true;
    } else if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent('isContentEditable', { event: 'PlainEvents' });
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
    value = checkEmptyValue(value);
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, elements, value);
    CommonEvents.loopElements(elements, value, dispatchEvent);
  };

  return { start };
})();
