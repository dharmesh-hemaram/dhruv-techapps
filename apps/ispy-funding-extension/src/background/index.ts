/* eslint-disable no-new */
import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { Runtime } from '@dhruv-techapps/core-extension';
import { TabsMessenger } from './tab';
import { GOOGLE_SCOPES, GoogleOauth2Background } from '@dhruv-techapps/google-oauth';
import { Ispy } from './ispy';
import { GoogleAnalyticsBackground, RUNTIME_MESSAGE_GOOGLE_ANALYTICS } from '@dhruv-techapps/google-analytics';
import { API_SECRET, MEASUREMENT_ID } from '../common/environments';
let googleAnalytics: GoogleAnalyticsBackground | undefined;
try {
  const googleOauth2Background = new GoogleOauth2Background();
  /**
   * Browser Action set to open option page / configuration page
   */
  chrome.action.onClicked.addListener(() => {
    googleOauth2Background.login(GOOGLE_SCOPES.PROFILE).then(Ispy.test).catch(console.error);
  });

  /**
   *  On initial install setup basic configuration
   */
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      googleOauth2Background.login(GOOGLE_SCOPES.PROFILE).then(Ispy.loadConfiguration).catch(console.error);
    }
  });

  googleAnalytics = new GoogleAnalyticsBackground(MEASUREMENT_ID, API_SECRET, false);

  /**
   * Setup on Message Listener
   */
  const onMessageListener = {
    [RUNTIME_MESSAGE_ACF.TABS]: new TabsMessenger(),
    [RUNTIME_MESSAGE_GOOGLE_ANALYTICS]: googleAnalytics,
  };
  Runtime.onMessageExternal(onMessageListener);
  Runtime.onMessage(onMessageListener);
} catch (error) {
  console.error('Error in background script', error);
}
