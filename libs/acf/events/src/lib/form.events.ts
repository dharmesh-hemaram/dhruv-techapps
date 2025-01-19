import { ConfigError, SystemError } from '@dhruv-techapps/core-common';
import { ACTION_I18N_TITLE } from '.';
import CommonEvents from './common.events';

const FORM_EVENTS = ['blur', 'click', 'click-once', 'focus', 'select', 'submit', 'remove', 'clear'];

export const FormEvents = (() => {
  const dispatchEvent = (element: HTMLElement, events: Array<string | Event>) => {
    const eW = CommonEvents.getElementWindow(element);
    if (!(element instanceof eW.HTMLElement)) {
      throw new ConfigError(`elementFinder: ${element}`, 'Not HTMLElement');
    }
    events.forEach((event) => {
      switch (typeof event === 'string' ? event : event.type) {
        case 'blur':
          element.blur();
          break;
        case 'click':
          element.click();
          break;
        case 'click-once':
          if (element.getAttribute('acf-clicked') === 'true') return;
          element.click();
          element.setAttribute('acf-clicked', 'true');
          break;
        case 'focus':
          element.focus();
          break;
        case 'submit':
          if (element instanceof eW.HTMLFormElement) {
            element.submit();
          } else if (
            element instanceof eW.HTMLSelectElement ||
            element instanceof eW.HTMLTextAreaElement ||
            element instanceof eW.HTMLInputElement ||
            element instanceof eW.HTMLButtonElement ||
            element instanceof eW.HTMLLabelElement ||
            element instanceof eW.HTMLOptionElement ||
            element instanceof eW.HTMLFieldSetElement ||
            element instanceof eW.HTMLOutputElement
          ) {
            element.form?.submit();
          } else {
            console.error(element);
            throw new ConfigError(`invalid elementFinder`, 'Invalid Element for submit');
          }
          break;
        case 'select':
          if (element instanceof eW.HTMLTextAreaElement || element instanceof eW.HTMLInputElement) {
            element.select();
          }
          break;
        case 'remove':
          element.remove();
          break;
        case 'clear':
          if (element instanceof eW.HTMLSelectElement || element instanceof eW.HTMLTextAreaElement || element instanceof eW.HTMLInputElement) {
            element.value = '';
          } else {
            console.error(element);
            throw new ConfigError(`invalid elementFinder`, 'Invalid Element for clear');
          }
          break;
        default:
          throw new SystemError(`Unhandled Event  "${typeof event === 'string' ? event : event.type}"`, 'Form Events');
      }
    });
  };

  const start = (elements: Array<HTMLElement>, action: string) => {
    const events = CommonEvents.getVerifiedEvents(FORM_EVENTS, action);
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, elements, events);
    CommonEvents.loopElements(elements, events, dispatchEvent);
  };
  return { start };
})();
