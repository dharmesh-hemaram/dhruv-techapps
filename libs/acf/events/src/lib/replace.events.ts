import { RADIO_CHECKBOX_NODE_NAME } from '@dhruv-techapps/acf-common';
import { ConfigError } from '@dhruv-techapps/core-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import { ACTION_I18N_TITLE } from '.';
import CommonEvents, { UNKNOWN_ELEMENT_TYPE_ERROR } from './common.events';

const CHANGE_EVENT = ['input', 'change'];

export const ReplaceEvents = (() => {
  const checkNode = (element: HTMLElement, value: string) => {
    const [target, string] = value.split('::');
    if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement || (element instanceof HTMLInputElement && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = element.value.replace(new RegExp(target, 'g'), string);
      element.dispatchEvent(CommonEvents.getFillEvent());
    } else if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent(chrome.runtime.id, 'isContentEditable', { event: 'ReplaceEvents' });
      element.textContent = element.textContent?.replace(new RegExp(target, 'g'), string) || null;
    } else {
      throw new ConfigError(UNKNOWN_ELEMENT_TYPE_ERROR, 'ReplaceEvents');
    }
    CHANGE_EVENT.forEach((event) => {
      element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()));
    });
    element.focus();
  };

  const start = (elements: Array<HTMLElement>, value: string) => {
    value = value.replace(/^replace::/i, '');
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction}`, elements, value);
    CommonEvents.loopElements(elements, value, checkNode);
  };

  return { start };
})();
