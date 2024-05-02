import { Logger, ConfigError } from '@dhruv-techapps/core-common';
import { RADIO_CHECKBOX_NODE_NAME } from '@dhruv-techapps/acf-common';
import CommonEvents, { UNKNOWN_ELEMENT_TYPE_ERROR } from './common.events';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import { Sandbox } from '@dhruv-techapps/sandbox';

const LOCAL_STORAGE_COPY = 'auto-clicker-copy';
const CHANGE_EVENT = ['input', 'change'];

const LOGGER_LETTER = 'PasteEvents';

export const PasteEvents = (() => {
  const checkNode = (element: HTMLElement, value: string) => {
    if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement || (element instanceof HTMLInputElement && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value;
      element.dispatchEvent(CommonEvents.getFillEvent());
    } else if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent(chrome.runtime.id, 'isContentEditable', { event: 'PasteEvents' });
      element.textContent = value;
    } else {
      throw new ConfigError(UNKNOWN_ELEMENT_TYPE_ERROR, 'PasteEvents');
    }
    CHANGE_EVENT.forEach((event) => {
      element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()));
    });
    element.focus();
  };

  const start = async (elements: Array<HTMLElement>, value: string) => {
    try {
      console.groupCollapsed(LOGGER_LETTER);
      const copyContent = localStorage.getItem(LOCAL_STORAGE_COPY);
      Logger.colorDebug('Copy Content', copyContent);
      value = value.replace(/paste::/i, '');
      Logger.colorDebug('Value', value);
      value = await Sandbox.sandboxEval(value, copyContent);
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
