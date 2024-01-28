import { store } from './store';
import { WizardElementUtil } from './element-util';
import { updateWizardAction } from './store/slice';

const FORM_CONTROL_ELEMENTS = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'A'];

export const Action = (() => {
  let x: number, y: number;
  const check = (event: Event) => {
    if (event instanceof MouseEvent) {
      if (event.pageX === x && event.pageY === y) {
        return;
      }
      x = event.pageX;
      y = event.pageY;
    }

    const element = event.target;
    if (element && element instanceof HTMLElement) {
      WizardElementUtil.check(element, true).then((action) => {
        if (action) {
          store.dispatch(updateWizardAction(action));
        }
      });
    }
  };

  const clickTrack = (event: Event) => {
    check(event);
  };

  const keyupTrack = (event: Event) => {
    if (event instanceof KeyboardEvent && event.key === 'Tab') {
      check(event);
    }
  };

  const attachClickListenersToElements = (elements?: NodeList) => {
    elements?.forEach((element) => {
      if (FORM_CONTROL_ELEMENTS.includes(element.nodeName)) {
        element.addEventListener('click', clickTrack);
        element.addEventListener('keyup', keyupTrack);
      }
    });
  };

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        attachClickListenersToElements(mutation.addedNodes);
      }
    }
  });

  const setup = () => {
    const initialElements = document.querySelector('body')?.querySelectorAll(FORM_CONTROL_ELEMENTS.map((element) => element.toLowerCase()).join(', '));
    attachClickListenersToElements(initialElements);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('click', clickTrack);
    document.addEventListener('keyup', keyupTrack);
  };

  return { setup };
})();
