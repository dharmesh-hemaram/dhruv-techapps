import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { ACTION_POPUP, CONTEXT_MENU_CONFIG_PAGE_ID, CONTEXT_MENU_ELEMENT_ID, PERMISSIONS, TABS, getOrigin } from '../common/constant';
import { NotificationHandler } from './notifications';

const CONTEXT_MENUS_ID = 'context-menu-id';
export default function registerContextMenus(optionsPageUrl?: string) {
  chrome.contextMenus.removeAll();
  chrome.contextMenus.create({ id: CONTEXT_MENU_ELEMENT_ID, title: '★ Configure for this Field', contexts: ['all'] });
  chrome.contextMenus.create({ id: ACTION_POPUP, title: '☉ Auto Clicker (Record)', contexts: ['all'] });
  chrome.contextMenus.create({ id: 'PERMISSION-SEPARATOR', type: 'separator', contexts: ['all'] });
  chrome.contextMenus.create({ id: PERMISSIONS, title: 'Permissions', contexts: ['all'] });
  chrome.contextMenus.create({ id: TABS, title: 'Tabs', contexts: ['all'], parentId: PERMISSIONS });
  chrome.contextMenus.create({ id: 'CONFIG-SEPARATOR', type: 'separator', contexts: ['all'] });
  chrome.contextMenus.create({ id: CONTEXT_MENU_CONFIG_PAGE_ID, title: '↗ Open Configuration Page', contexts: ['all'] });

  if (optionsPageUrl) {
    chrome.contextMenus.onClicked.addListener(async ({ menuItemId }, tab) => {
      switch (menuItemId) {
        case CONTEXT_MENU_CONFIG_PAGE_ID:
          chrome.tabs.create({ url: optionsPageUrl });
          break;
        case ACTION_POPUP:
          console.info(JSON.stringify(tab));
          tab?.id && chrome.tabs.sendMessage(tab.id, { action: ACTION_POPUP });
          break;
        case CONTEXT_MENU_ELEMENT_ID:
          {
            const url = new URL(optionsPageUrl);
            const { url: configURL, xpath } = await chrome.storage.local.get([LOCAL_STORAGE_KEY.URL, LOCAL_STORAGE_KEY.XPATH]);
            url.searchParams.append('url', configURL);
            url.searchParams.append('elementFinder', xpath);
            chrome.tabs.create({ url: url.href });
            chrome.storage.local.remove([LOCAL_STORAGE_KEY.URL, LOCAL_STORAGE_KEY.XPATH]);
          }
          break;
        case TABS:
          if (tab && tab.url) {
            const origin = getOrigin(tab.url);
            chrome.permissions.contains({ permissions: ['tabs'], origins: [origin] }, (requested) => {
              if (!requested) {
                chrome.permissions.request({ permissions: ['tabs'], origins: [origin] }, (requested) => {
                  if (requested) {
                    NotificationHandler.notify(CONTEXT_MENUS_ID, 'Permissions', `tabs permission granted for ${origin}`);
                  } else {
                    NotificationHandler.notify(CONTEXT_MENUS_ID, 'Permissions', `tabs permission denied for ${origin}`);
                  }
                });
              } else {
                NotificationHandler.notify(CONTEXT_MENUS_ID, 'Permissions', `tabs permission granted for ${origin}`);
              }
            });
          }
          break;
        default:
          break;
      }
    });
  }
}
