import { NotificationsService } from '@dhruv-techapps/core-service';
import { OPTIONS_PAGE_URL } from '../common/environments';
import { Auto } from './auto';
import { WizardElementUtil } from './element-util';
import { store } from './store';
import { removeWizardAction, updateAllWizardAction } from './store/slice';

export const Popup = (() => {
  let popupContainer: HTMLElement;

  const setHover = (xpath: string, operation: 'add' | 'remove') => {
    xpath = WizardElementUtil.clearXpath(xpath);
    try {
      if (xpath) {
        const nodes = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (nodes.snapshotLength !== 0) {
          let i = 0;
          while (i < nodes.snapshotLength) {
            (nodes.snapshotItem(i) as HTMLElement).classList[operation]('auto-clicker-hover');
            i += 1;
          }
        }
      }
    } catch {
      NotificationsService.create({ type: 'basic', title: 'Invalid Xpath', message: xpath, silent: false, iconUrl: chrome.runtime.getManifest().action.default_icon });
    }
  };

  const attachPopupListener = () => {
    popupContainer.addEventListener('close', () => {
      popupContainer.remove();
    });

    popupContainer.addEventListener('remove', ((e: CustomEvent) => {
      store.dispatch(removeWizardAction(e.detail.index));
    }) as EventListener);

    popupContainer.addEventListener('auto-generate-config', () => {
      Auto.generate();
    });

    popupContainer.addEventListener('enter', ((e: CustomEvent) => {
      setHover(e.detail.xpath, 'add');
    }) as EventListener);
    popupContainer.addEventListener('leave', ((e: CustomEvent) => {
      setHover(e.detail.xpath, 'remove');
    }) as EventListener);
    popupContainer.addEventListener('element-focus', ((e: CustomEvent) => {
      const xpath = WizardElementUtil.clearXpath(e.detail.xpath);
      try {
        if (xpath) {
          const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          if (result.singleNodeValue) {
            (<HTMLInputElement>result.singleNodeValue).focus();
          } else {
            NotificationsService.create({ type: 'basic', title: 'Element not found', message: xpath, silent: false, iconUrl: chrome.runtime.getManifest().action.default_icon });
          }
        }
      } catch {
        NotificationsService.create({ type: 'basic', title: 'Invalid Xpath', message: xpath, silent: false, iconUrl: chrome.runtime.getManifest().action.default_icon });
      }
    }) as EventListener);
  };

  const setSettingsUrl = () => OPTIONS_PAGE_URL && popupContainer.setAttribute('settings', OPTIONS_PAGE_URL);

  const storeSubscribe = () => {
    store.subscribe(() => {
      const { actions } = store.getState().wizard;
      popupContainer.setAttribute('actions', JSON.stringify(actions));
    });
  };

  const setup = () => {
    popupContainer = document.createElement('auto-clicker-autofill-popup');
    setSettingsUrl();
    const config = store.getState().wizard;
    if (config.name) {
      popupContainer.setAttribute('name', config.name);
    }
    document.body.appendChild(popupContainer);
    storeSubscribe();
    if (config.actions.length !== 0) {
      store.dispatch(updateAllWizardAction(config.actions));
    }
    attachPopupListener();
  };

  return { setup };
})();
