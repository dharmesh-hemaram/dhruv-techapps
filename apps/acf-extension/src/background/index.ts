/* eslint-disable no-new */
import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { Runtime } from '@dhruv-techapps/core-extension';

import registerContextMenus from './context-menu';
import registerNotifications from './notifications';
import DiscordOauth2 from './discord-oauth2';
import GoogleSheets from './google-sheets';
import GoogleBackup from './google-backup';
import { TabsMessenger } from './tab';
import { ACTION_POPUP } from '../common/constant';
import { OPTIONS_PAGE_URL, UNINSTALL_URL } from '../common/environments';
import GoogleOauth2 from './google-oauth2';
import DiscordMessaging from './discord-messaging';
import { sentryInit } from '../common/sentry';

try {
  sentryInit('background');

  /**
   * Browser Action set to open option page / configuration page
   */
  chrome.action.onClicked.addListener((tab) => {
    tab.id && chrome.tabs.sendMessage(tab.id, { action: ACTION_POPUP });
  });

  /**
   *  On initial install setup basic configuration
   */
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'update') {
      TabsMessenger.optionsTab({ url: `${OPTIONS_PAGE_URL}?version=${chrome.runtime.getManifest().version}` });
    } else if (details.reason === 'install') {
      TabsMessenger.optionsTab({ url: OPTIONS_PAGE_URL });
    }
  });

  /**
   * Set Context Menu for right click
   */
  registerContextMenus(OPTIONS_PAGE_URL);

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

  /**
   * Setup on Message Listener
   */
  const onMessageListener = {
    [RUNTIME_MESSAGE_ACF.DISCORD_OAUTH2]: new DiscordOauth2(),
    [RUNTIME_MESSAGE_ACF.DISCORD_MESSAGING]: new DiscordMessaging(),
    [RUNTIME_MESSAGE_ACF.GOOGLE_OAUTH2]: new GoogleOauth2(),
    [RUNTIME_MESSAGE_ACF.GOOGLE_BACKUP]: new GoogleBackup(),
    [RUNTIME_MESSAGE_ACF.GOOGLE_SHEETS]: new GoogleSheets(),
    [RUNTIME_MESSAGE_ACF.TABS]: new TabsMessenger(),
  };
  Runtime.onMessageExternal(onMessageListener);
  Runtime.onMessage(onMessageListener);
} catch (error) {
  console.error(error);
}
