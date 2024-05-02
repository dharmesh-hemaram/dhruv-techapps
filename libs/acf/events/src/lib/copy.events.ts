import { Logger } from '@dhruv-techapps/core-common';
import { RADIO_CHECKBOX_NODE_NAME } from '@dhruv-techapps/acf-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';

const LOCAL_STORAGE_COPY = 'auto-clicker-copy';
const LOGGER_LETTER = 'CopyEvents';

export const CopyEvents = (() => {
  const applyFilter = (text: string, value: string) => {
    Logger.colorDebug('applyFilter', { text, value });
    if (value) {
      const matches = text.match(new RegExp(value));
      if (matches) {
        [text] = matches;
      }
    }
    return text;
  };

  const getValue = (element: HTMLElement) => {
    if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement || (element instanceof HTMLInputElement && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      return element.value;
    }
    if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent(chrome.runtime.id, 'isContentEditable', { event: 'CopyEvents' });
      return element.textContent || element.innerText;
    }
    return element.innerText || element.innerHTML;
  };

  const start = (elements: Array<HTMLElement>, value: string) => {
    try {
      console.groupCollapsed(LOGGER_LETTER);
      Logger.colorDebug('Start', value);
      const text = getValue(elements[0]);
      Logger.colorDebug('Text', text);
      const result = applyFilter(text, value.replace(/copy::/gi, ''));
      Logger.colorDebug('Result', result);
      localStorage.setItem(LOCAL_STORAGE_COPY, result);
      console.groupEnd();
    } catch (error) {
      console.groupEnd();
      throw error;
    }
  };

  return { start };
})();
