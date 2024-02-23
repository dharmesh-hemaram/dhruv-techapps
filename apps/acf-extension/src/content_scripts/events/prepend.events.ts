import { Logger } from '@dhruv-techapps/core-common';
import { RADIO_CHECKBOX_NODE_NAME } from '../../common/constant';
import CommonEvents, { UNKNOWN_ELEMENT_TYPE_ERROR } from './common.events';
import { ConfigError } from '../error';
import { GoogleAnalyticsService } from '@dhruv-techapps/acf-service';

const CHANGE_EVENT = ['input', 'change'];

export const PrependEvents = (() => {
  const checkNode = (element: HTMLElement, value: string) => {
    if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement || (element instanceof HTMLInputElement && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value + element.value;
      element.dispatchEvent(CommonEvents.getFillEvent());
    } else if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent(chrome.runtime.id, 'isContentEditable', { event: 'PrependEvents' });
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
    Logger.colorDebug(`PrependEvents`, { value });
    CommonEvents.loopElements(elements, value, checkNode);
  };

  return { start };
})();
