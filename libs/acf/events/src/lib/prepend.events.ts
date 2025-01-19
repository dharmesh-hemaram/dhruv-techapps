import { RADIO_CHECKBOX_NODE_NAME } from '@dhruv-techapps/acf-common';
import { ConfigError } from '@dhruv-techapps/core-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import { ACTION_I18N_TITLE } from '.';
import CommonEvents, { UNKNOWN_ELEMENT_TYPE_ERROR } from './common.events';

const CHANGE_EVENT = ['input', 'change'];

export const PrependEvents = (() => {
  const checkNode = (element: HTMLElement, value: string) => {
    const eW = CommonEvents.getElementWindow(element);
    if (element instanceof eW.HTMLSelectElement || element instanceof eW.HTMLTextAreaElement || (element instanceof eW.HTMLInputElement && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value + element.value;
      element.dispatchEvent(CommonEvents.getFillEvent());
    } else if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent('isContentEditable', { event: 'PrependEvents' });
      element.textContent = value + element.textContent;
    } else {
      throw new ConfigError(UNKNOWN_ELEMENT_TYPE_ERROR, 'PrependEvents');
    }
    CHANGE_EVENT.forEach((event) => {
      element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()));
    });
    element.focus();
  };

  const start = (elements: Array<HTMLElement>, value: string) => {
    value = value.replace(/^prepend::/i, '');
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, elements, value);
    CommonEvents.loopElements(elements, value, checkNode);
  };

  return { start };
})();
