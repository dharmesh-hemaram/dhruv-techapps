import { ACTION_I18N_TITLE } from '.';
import CommonEvents from './common.events';

export const ElementEvents = (() => {
  const execCommand = (element: HTMLElement, value: string) => {
    const [, action, prop] = value.split('::');
    if (action === 'scrollIntoView') {
      if (!prop) {
        element.scrollIntoView();
      } else if (typeof prop === 'boolean') {
        element.scrollIntoView(prop);
      } else {
        try {
          const options = JSON.parse(prop);
          element.scrollIntoView(options);
        } catch (e) {
          console.error(e);
        }
      }
    } else if (action === 'remove') {
      element.remove();
    }
  };

  const start = (elements: Array<HTMLElement>, value: string) => {
    console.debug(`${ACTION_I18N_TITLE} #${window.__currentAction} [${window.__currentActionName}]`, elements, value);
    CommonEvents.loopElements(elements, value, execCommand);
  };
  return { start };
})();
