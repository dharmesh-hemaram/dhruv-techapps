import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { GoogleAnalyticsBackground } from '@dhruv-techapps/google-analytics';
import { ACTION_POPUP } from '../common/constant';

const CONTEXT_MENU_ELEMENT_ID = 'element-mode';
const CONTEXT_MENU_SEPARATOR_ID = 'config-separator';
const CONTEXT_MENU_CONFIG_PAGE_ID = 'config-page-mode';

const CONTEXT_MENU_I18N = {
  FIELD: chrome.i18n.getMessage('@CONTEXT_MENU__FIELD'),
  RECORD: chrome.i18n.getMessage('@CONTEXT_MENU__RECORD'),
  CONFIG_PAGE: chrome.i18n.getMessage('@CONTEXT_MENU__CONFIG_PAGE'),
};

export default function registerContextMenus(optionsPageUrl?: string, googleAnalytics?: GoogleAnalyticsBackground) {
  chrome.contextMenus.removeAll();
  chrome.contextMenus.create({ id: CONTEXT_MENU_ELEMENT_ID, title: CONTEXT_MENU_I18N.FIELD, contexts: ['page', 'frame', 'selection', 'link', 'editable', 'image', 'video', 'audio', 'video'] });
  chrome.contextMenus.create({ id: ACTION_POPUP, title: CONTEXT_MENU_I18N.RECORD, contexts: ['page', 'frame', 'selection', 'link', 'editable', 'image', 'video', 'audio', 'video'] });
  chrome.contextMenus.create({ id: CONTEXT_MENU_SEPARATOR_ID, type: 'separator', contexts: ['page', 'frame', 'selection', 'link', 'editable', 'image', 'video', 'audio', 'video'] });
  chrome.contextMenus.create({ id: CONTEXT_MENU_CONFIG_PAGE_ID, title: CONTEXT_MENU_I18N.CONFIG_PAGE, contexts: ['all'] });

  if (optionsPageUrl) {
    chrome.contextMenus.onClicked.addListener(async ({ menuItemId }, tab) => {
      switch (menuItemId) {
        case CONTEXT_MENU_CONFIG_PAGE_ID:
          chrome.tabs.create({ url: optionsPageUrl });
          googleAnalytics?.fireEvent({ name: 'Web', params: { location: 'contextMenus.onClicked' } });
          break;
        case ACTION_POPUP:
          if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, { action: ACTION_POPUP });
          }
          googleAnalytics?.fireEvent({ name: 'Wizard', params: { location: 'contextMenus.onClicked' } });
          break;
        case CONTEXT_MENU_ELEMENT_ID:
          {
            const url = new URL(optionsPageUrl);
            const { url: configURL, xpath } = await chrome.storage.local.get([LOCAL_STORAGE_KEY.URL, LOCAL_STORAGE_KEY.XPATH]);
            url.searchParams.append('url', configURL);
            url.searchParams.append('elementFinder', xpath);
            chrome.tabs.create({ url: url.href });
            googleAnalytics?.fireEvent({ name: 'Wizard', params: { location: 'contextMenus.onClicked', data: true } });
            chrome.storage.local.remove([LOCAL_STORAGE_KEY.URL, LOCAL_STORAGE_KEY.XPATH]);
          }
          break;

        default:
          break;
      }
    });
  }
}
