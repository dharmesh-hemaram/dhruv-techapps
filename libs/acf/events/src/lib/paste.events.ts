import { RADIO_CHECKBOX_NODE_NAME } from '@dhruv-techapps/acf-common';
import { ConfigError } from '@dhruv-techapps/core-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import { Sandbox } from '@dhruv-techapps/sandbox';
import { ACTION_I18N_TITLE } from '.';
import CommonEvents, { UNKNOWN_ELEMENT_TYPE_ERROR } from './common.events';

const LOCAL_STORAGE_COPY = 'auto-clicker-copy';
const CHANGE_EVENT = ['input', 'change'];

export const PasteEvents = (() => {
  const checkNode = (element: HTMLElement, value: string) => {
    const eW = CommonEvents.getElementWindow(element);
    if (element instanceof eW.HTMLSelectElement || element instanceof eW.HTMLTextAreaElement || (element instanceof eW.HTMLInputElement && !RADIO_CHECKBOX_NODE_NAME.test(element.type))) {
      element.value = value;
      element.dispatchEvent(CommonEvents.getFillEvent());
    } else if (element.isContentEditable) {
      GoogleAnalyticsService.fireEvent('isContentEditable', { event: 'PasteEvents' });
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
    const copyContent = localStorage.getItem(LOCAL_STORAGE_COPY);
    value = value.replace(/paste::/i, '');
    value = await Sandbox.sandboxEval(value, copyContent);
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, elements, copyContent, value);
    CommonEvents.loopElements(elements, value, checkNode);
    return true;
  };

  return { start };
})();
