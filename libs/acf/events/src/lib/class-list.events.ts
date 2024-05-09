import { Logger } from '@dhruv-techapps/core-common';
import CommonEvents from './common.events';

export const ClassEvents = (() => {
  const execCommand = (element: HTMLElement, value: string) => {
    const [, action, name, prop] = value.split('::');
    if (action === 'add') {
      element.classList.add(name);
    } else if (action === 'remove') {
      element.classList.remove(name);
    } else if (action === 'clear') {
      element.className = '';
    } else if (action === 'replace') {
      element.className.replace(new RegExp(`^${name}$`, 'gi'), prop);
    }
  };

  const start = (elements: Array<HTMLElement>, value: string) => {
    Logger.colorDebug(`ClassEvents`, value);
    CommonEvents.loopElements(elements, value, execCommand);
  };
  return { start };
})();
