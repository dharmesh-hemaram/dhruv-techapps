/* eslint-disable no-new */
import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { Runtime } from '@dhruv-techapps/core-extension';

import registerContextMenus from './context-menu';
import DiscordOauth2 from './discord-oauth2';
import { TabsMessenger } from './tab';
import { ACTION_POPUP } from '../common/constant';
import { OPTIONS_PAGE_URL, UNINSTALL_URL, VARIANT } from '../common/environments';

import DiscordMessaging from './discord-messaging';
import { GoogleAnalytics } from './google-analytics';
import { registerNotifications } from '@dhruv-techapps/notifications';
import { GoogleOauth2Background, RUNTIME_MESSAGE_GOOGLE_OAUTH2 } from '@dhruv-techapps/google-oauth';
import { GoogleSheetsBackground, RUNTIME_MESSAGE_GOOGLE_SHEETS } from '@dhruv-techapps/google-sheets';
import { GoogleDriveBackground, RUNTIME_MESSAGE_GOOGLE_DRIVE } from '@dhruv-techapps/google-drive';
import AcfBackup from './acf-backup';

let googleAnalytics: GoogleAnalytics | undefined;
try {
  /**
   * Browser Action set to open option page / configuration page
   */
  chrome.action.onClicked.addListener((tab) => {
    googleAnalytics?.fireEvent({ name: 'Wizard', params: { location: 'action:onClicked' } });
    tab.id && chrome.tabs.sendMessage(tab.id, { action: ACTION_POPUP });
  });

  /**
   *  On initial install setup basic configuration
   */
  chrome.runtime.onInstalled.addListener((details) => {
    if (VARIANT !== 'LOCAL') {
      if (details.reason === 'update') {
        TabsMessenger.optionsTab({ url: `${OPTIONS_PAGE_URL}?version=${chrome.runtime.getManifest().version}` });
      } else if (details.reason === 'install') {
        TabsMessenger.optionsTab({ url: OPTIONS_PAGE_URL });
      }
    }
  });

  /**
   * Set Context Menu for right click
   */
  registerContextMenus(OPTIONS_PAGE_URL, googleAnalytics);

  /**
   * Set Notifications
   */
  registerNotifications(OPTIONS_PAGE_URL);

  /**
   * Setup Uninstall action
   */
  if (UNINSTALL_URL) {
    chrome.runtime.setUninstallURL(UNINSTALL_URL);
  }

  googleAnalytics = new GoogleAnalytics(VARIANT === 'LOCAL');
  /**
   * Setup on Message Listener
   */
  const onMessageListener = {
    [RUNTIME_MESSAGE_ACF.DISCORD_OAUTH2]: new DiscordOauth2(),
    [RUNTIME_MESSAGE_ACF.DISCORD_MESSAGING]: new DiscordMessaging(),
    [RUNTIME_MESSAGE_GOOGLE_OAUTH2]: new GoogleOauth2Background(),
    [RUNTIME_MESSAGE_GOOGLE_DRIVE]: new GoogleDriveBackground(),
    [RUNTIME_MESSAGE_GOOGLE_SHEETS]: new GoogleSheetsBackground(),
    [RUNTIME_MESSAGE_ACF.ACF_BACKUP]: new AcfBackup(),
    [RUNTIME_MESSAGE_ACF.TABS]: new TabsMessenger(),
    [RUNTIME_MESSAGE_ACF.GOOGLE_ANALYTICS]: googleAnalytics,
  };
  Runtime.onMessageExternal(onMessageListener);
  Runtime.onMessage(onMessageListener);
} catch (error) {
  if (error instanceof Error) {
    googleAnalytics?.fireErrorEvent({ name: error.name, error: error.message, additionalParams: { page: 'background' } });
  }
}

addEventListener('unhandledrejection', async (event) => {
  if (event.reason instanceof Error) {
    googleAnalytics?.fireErrorEvent({ error: event.reason.message, additionalParams: { page: 'background' } });
  } else {
    googleAnalytics?.fireErrorEvent({ error: JSON.stringify(event.reason), additionalParams: { page: 'background' } });
  }
});
