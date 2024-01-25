import { getOrigin } from '../common/constant';
import { NotificationHandler } from './notifications';

let optionsTab: chrome.tabs.Tab | undefined;

chrome.tabs.onRemoved.addListener((tabId) => {
  if (optionsTab && optionsTab.id === tabId) {
    optionsTab = undefined;
  }
});

const NOTIFICATIONS_ID = 'Tabs Messenger';
export class TabsMessenger {
  static optionsTab(properties: chrome.tabs.UpdateProperties) {
    if (optionsTab && optionsTab.id) {
      chrome.tabs.update(optionsTab.id, { ...properties, active: true });
    } else {
      chrome.tabs.create(properties, (tab) => {
        optionsTab = tab;
      });
    }
  }

  async reload(url: string) {
    const origin = getOrigin(url);
    chrome.permissions.contains({ permissions: ['tabs'], origins: [origin] }, (requested) => {
      if (requested) {
        chrome.tabs.query({ url }, (tabs) => {
          tabs.forEach((tab) => {
            if (tab.id) {
              chrome.tabs.reload(tab.id);
            } else {
              NotificationHandler.notify(NOTIFICATIONS_ID, 'Tabs', `tab not found ${url}`);
            }
          });
        });
      } else {
        NotificationHandler.notify(NOTIFICATIONS_ID, 'Permissions', `tabs permission not granted for ${url}`);
      }
    });
  }
}
