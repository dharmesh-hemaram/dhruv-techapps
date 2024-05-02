import { Logger, ConfigError } from '@dhruv-techapps/core-common';
import CommonEvents, { UNKNOWN_ELEMENT_TYPE_ERROR } from './common.events';

import { RADIO_CHECKBOX_NODE_NAME } from '@dhruv-techapps/acf-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import { Sandbox } from '@dhruv-techapps/sandbox';

const LOGGER_LETTER = 'FuncEvents';
const CHANGE_EVENT = ['input', 'change'];

export const FuncEvents = (() => {
  const checkNode = (element: HTMLElement, value: string) => {
    if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement || (element instanceof HTMLInputElement && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value;
      element.dispatchEvent(CommonEvents.getFillEvent());
    } else if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent(chrome.runtime.id, 'isContentEditable', { event: 'FuncEvents' });
      element.textContent = value;
    } else {
      throw new ConfigError(UNKNOWN_ELEMENT_TYPE_ERROR, 'Append Events');
    }
    CHANGE_EVENT.forEach((event) => {
      element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()));
    });
    element.focus();
  };

  const start = async (elements: Array<HTMLElement>, value: string) => {
    try {
      console.groupCollapsed(LOGGER_LETTER);
      value = value.replace(/func::/i, '');
      Logger.colorDebug('Start', value);
      value = await Sandbox.sandboxEval(value);
      CommonEvents.loopElements(elements, value, checkNode);
      console.groupEnd();
      return true;
    } catch (error) {
      console.groupEnd();
      throw error;
    }
  };
  return { start };
})();
