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

  async update(updateProperties: chrome.tabs.UpdateProperties, sender: chrome.runtime.MessageSender) {
    if (sender.tab?.id) {
      chrome.tabs.update(sender.tab.id, updateProperties);
    } else {
      NotificationHandler.notify(NOTIFICATIONS_ID, 'Tabs', `tab or tabId not found`);
    }
  }

  async reload(_: string, sender: chrome.runtime.MessageSender) {
    if (sender.tab?.id) {
      chrome.tabs.reload(sender.tab.id);
    } else {
      NotificationHandler.notify(NOTIFICATIONS_ID, 'Tabs', `tab or tabId not found`);
    }
  }
}
