import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import { Logger, ConfigError } from '@dhruv-techapps/core-common';
import { RADIO_CHECKBOX_NODE_NAME } from '@dhruv-techapps/acf-common';
import CommonEvents, { UNKNOWN_ELEMENT_TYPE_ERROR } from './common.events';
import { Sandbox } from '@dhruv-techapps/sandbox';

const LOGGER_LETTER = 'ClipboardEvents';
const CHANGE_EVENT = ['input', 'change'];

export const ClipboardEvents = (() => {
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
      GoogleAnalyticsService.fireEvent(chrome.runtime.id, 'isContentEditable', { event: LOGGER_LETTER });
      return element.textContent || element.innerText;
    }
    return element.innerText || element.innerHTML;
  };

  const checkNode = (element: HTMLElement, value: string) => {
    if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement || (element instanceof HTMLInputElement && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value;
      element.dispatchEvent(CommonEvents.getFillEvent());
    } else if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent(chrome.runtime.id, 'isContentEditable', { event: LOGGER_LETTER });
      element.textContent = value;
    } else {
      throw new ConfigError(UNKNOWN_ELEMENT_TYPE_ERROR, LOGGER_LETTER);
    }
    CHANGE_EVENT.forEach((event) => {
      element.dispatchEvent(new MouseEvent(event, CommonEvents.getMouseEventProperties()));
    });
    element.focus();
  };

  const copy = async (elements: Array<HTMLElement>, value: string) => {
    Logger.colorDebug('Value', value);
    const text = getValue(elements[0]);
    Logger.colorDebug('Text', text);
    const result = applyFilter(text, value.replace(/copy::/gi, ''));
    Logger.colorDebug('Result', result);
    await navigator.clipboard.writeText(result);
  };

  const paste = async (elements: Array<HTMLElement>, value: string) => {
    await navigator.clipboard.readText().then(async (clipText = '') => {
      Logger.colorDebug('clipText', clipText);
      value = value.replace(/paste::/i, '');
      Logger.colorDebug('Value', value);
      value = await Sandbox.sandboxEval(value, clipText);
      CommonEvents.loopElements(elements, value, checkNode);
    });
  };

  const start = async (elements: Array<HTMLElement>, value: string) => {
    try {
      console.groupCollapsed(LOGGER_LETTER);
      value = value.replace(/clipboard::/gi, '');
      if (/^copy::/gi.test(value)) {
        await copy(elements, value);
      } else if (/^paste::/gi.test(value)) {
        await paste(elements, value);
      } else {
        throw new ConfigError('Invalid Clipboard Command', 'ClipboardEvents');
      }
      console.groupEnd();
    } catch (error) {
      console.groupEnd();
      throw error;
    }
  };

  return { start };
})();
