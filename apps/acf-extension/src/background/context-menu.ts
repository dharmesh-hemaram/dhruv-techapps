import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { ACTION_POPUP, CONTEXT_MENU_CONFIG_PAGE_ID, CONTEXT_MENU_ELEMENT_ID } from '../common/constant';

export default function registerContextMenus(optionsPageUrl?: string) {
  chrome.contextMenus.removeAll();
  chrome.contextMenus.create({ id: CONTEXT_MENU_ELEMENT_ID, title: '★ Configure for this Field', contexts: ['all'] });
  chrome.contextMenus.create({ id: ACTION_POPUP, title: '☉ Auto Clicker (Record)', contexts: ['all'] });
  chrome.contextMenus.create({ id: 'SEPARATOR', type: 'separator', contexts: ['all'] });
  chrome.contextMenus.create({ id: CONTEXT_MENU_CONFIG_PAGE_ID, title: '↗ Open Configuration Page', contexts: ['all'] });

  if (optionsPageUrl) {
    chrome.contextMenus.onClicked.addListener(async ({ menuItemId }, tab) => {
      if (menuItemId === CONTEXT_MENU_CONFIG_PAGE_ID) {
        chrome.tabs.create({ url: optionsPageUrl });
      } else if (menuItemId === ACTION_POPUP) {
        console.info(tab);
        tab?.id && chrome.tabs.sendMessage(tab.id, { action: ACTION_POPUP });
      } else if (menuItemId === CONTEXT_MENU_ELEMENT_ID) {
        const url = new URL(optionsPageUrl);
        const { url: configURL, xpath } = await chrome.storage.local.get([LOCAL_STORAGE_KEY.URL, LOCAL_STORAGE_KEY.XPATH]);
        url.searchParams.append('url', configURL);
        url.searchParams.append('elementFinder', xpath);
        chrome.tabs.create({ url: url.href });
        chrome.storage.local.remove([LOCAL_STORAGE_KEY.URL, LOCAL_STORAGE_KEY.XPATH]);
      }
    });
  }
}
