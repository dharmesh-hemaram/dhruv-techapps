/* eslint-disable no-new */
import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { Runtime } from '@dhruv-techapps/core-extension';
import { TabsMessenger } from './tab';

try {
  /**
   *  On initial install setup basic configuration
   */
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      chrome.runtime.openOptionsPage();
    }
  });

  /**
   * Setup on Message Listener
   */
  const onMessageListener = {
    [RUNTIME_MESSAGE_ACF.TABS]: new TabsMessenger(),
  };
  Runtime.onMessageExternal(onMessageListener);
  Runtime.onMessage(onMessageListener);
} catch (error) {
  console.error('Error in background script', error);
}
