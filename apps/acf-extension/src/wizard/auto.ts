import { WizardElementUtil } from './element-util';
import { store } from './store';
import { updateWizardAction } from './store/slice';

export const Auto = (() => {
  const generate = async () => {
    document.querySelectorAll('input, select, textarea, [contenteditable="true"]').forEach(async (element) => {
      if (element instanceof HTMLElement) {
        const action = await WizardElementUtil.check(element);
        if (action) {
          store.dispatch(updateWizardAction(action));
        }
      }
    });
  };
  return { generate };
})();
