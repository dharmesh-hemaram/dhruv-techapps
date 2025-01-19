import { RADIO_CHECKBOX_NODE_NAME } from '@dhruv-techapps/acf-common';
import { GoogleAnalyticsService } from '@dhruv-techapps/google-analytics';
import { ACTION_I18N_TITLE } from '.';
import CommonEvents from './common.events';

const LOCAL_STORAGE_COPY = 'auto-clicker-copy';

export const CopyEvents = (() => {
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
      GoogleAnalyticsService.fireEvent('isContentEditable', { event: 'CopyEvents' });
      return element.textContent || element.innerText;
    }
    return element.innerText || element.innerHTML;
  };

  const start = (elements: Array<HTMLElement>, value: string) => {
    const text = getValue(elements[0]);
    const result = applyFilter(text, value.replace(/copy::/gi, ''));
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, elements[0], text, result);
    localStorage.setItem(LOCAL_STORAGE_COPY, result);
  };

  return { start };
})();
