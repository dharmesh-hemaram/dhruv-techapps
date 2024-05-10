/* eslint-disable no-new */
import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { Runtime } from '@dhruv-techapps/core-extension';
import { TabsMessenger } from './tab';
import { IspyOauth2Background } from '@dhruv-techapps/ispy-oauth';

try {
  const ispyOauth2Background = new IspyOauth2Background();
  /**
   * Browser Action set to open option page / configuration page
   */
  chrome.action.onClicked.addListener(() => {
    ispyOauth2Background.login();
  });

  /**
   *  On initial install setup basic configuration
   */
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      ispyOauth2Background.login();
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
