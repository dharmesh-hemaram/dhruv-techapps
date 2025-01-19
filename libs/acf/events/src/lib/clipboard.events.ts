import { RADIO_CHECKBOX_NODE_NAME } from '@dhruv-techapps/acf-common';
import { ConfigError } from '@dhruv-techapps/core-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import { Sandbox } from '@dhruv-techapps/sandbox';
import { ACTION_I18N_TITLE } from '.';
import CommonEvents, { UNKNOWN_ELEMENT_TYPE_ERROR } from './common.events';

const LOGGER_LETTER = 'ClipboardEvents';
const CHANGE_EVENT = ['input', 'change'];

export const ClipboardEvents = (() => {
  const applyFilter = (text: string, value: string) => {
    if (value) {
      const matches = text.match(new RegExp(value));
      if (matches) {
        [text] = matches;
      }
    }
    return text;
  };

  const getValue = (element: HTMLElement) => {
    const eW = CommonEvents.getElementWindow(element);
    if (element instanceof eW.HTMLSelectElement || element instanceof eW.HTMLTextAreaElement || (element instanceof eW.HTMLInputElement && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      return element.value;
    }
    if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent('isContentEditable', { event: LOGGER_LETTER });
      return element.textContent || element.innerText;
    }
    return element.innerText || element.innerHTML;
  };

  const checkNode = (element: HTMLElement, value: string) => {
    const eW = CommonEvents.getElementWindow(element);
    if (element instanceof eW.HTMLSelectElement || element instanceof eW.HTMLTextAreaElement || (element instanceof eW.HTMLInputElement && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value;
      element.dispatchEvent(CommonEvents.getFillEvent());
    } else if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent('isContentEditable', { event: LOGGER_LETTER });
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
    const text = getValue(elements[0]);
    const result = applyFilter(text, value.replace(/copy::/gi, ''));
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, elements[0], text, result);
    await navigator.clipboard.writeText(result);
  };

  const paste = async (elements: Array<HTMLElement>, value: string) => {
    await navigator.clipboard.readText().then(async (clipText = '') => {
      value = value.replace(/paste::/i, '');
      value = await Sandbox.sandboxEval(value, clipText);
      console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, elements, clipText, value);
      CommonEvents.loopElements(elements, value, checkNode);
    });
  };

  const start = async (elements: Array<HTMLElement>, value: string) => {
    value = value.replace(/clipboard::/gi, '');
    if (/^copy::/gi.test(value)) {
      await copy(elements, value);
    } else if (/^paste::/gi.test(value)) {
      await paste(elements, value);
    } else {
      throw new ConfigError('Invalid Clipboard Command', 'ClipboardEvents');
    }
  };

  return { start };
})();
