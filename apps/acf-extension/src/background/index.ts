/* eslint-disable no-new */
import { DateUtil } from '@dhruv-techapps/core-common';
import { LOCAL_STORAGE_KEY, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { Runtime } from '@dhruv-techapps/core-extension';

import registerContextMenus from './context-menu';
import registerNotifications from './notifications';
import DiscordOauth2 from './discord-oauth2';
import GoogleSheets from './google-sheets';
import GoogleBackup from './google-backup';
import { TabsMessenger } from './tab';
import { Blog } from './check-blog';
import { ACTION_POPUP } from '../common/constant';
import { OPTIONS_PAGE_URL, UNINSTALL_URL } from '../common/environments';
import GoogleOauth2 from './google-oauth2';
import DiscordMessaging from './discord-messaging';
import { sentryInit } from '../common/sentry';

try {
  /**
   * Setup Google Analytics
   */
  // new GoogleAnalytics(trackingId, variant)
  // GoogleAnalytics.pageView([], Logger.log)

  sentryInit();

  /**
   * Browser Action set to open option page / configuration page
   */
  chrome.action.onClicked.addListener(async (tab) => {
    tab.id && chrome.tabs.sendMessage(tab.id, { action: ACTION_POPUP });
  });

  /**
   *  On initial install setup basic configuration
   */
  chrome.runtime.onInstalled.addListener(async () => {
    const result = await chrome.storage.local.get(LOCAL_STORAGE_KEY.INSTALL_DATE);
    if (!result[LOCAL_STORAGE_KEY.INSTALL_DATE]) {
      chrome.storage.local.set({ [LOCAL_STORAGE_KEY.INSTALL_DATE]: DateUtil.getDateWithoutTime().toJSON() });
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
   * On start up check for rate
   * TODO Need to implement rate us feature
   */
  chrome.runtime.onStartup.addListener(() => {
    // GoogleAnalytics.event({ event: ['version', version] }, Logger.log)
    Blog.check(OPTIONS_PAGE_URL);
  });

  /**
   * If an update is available it will auto update
   */
  chrome.runtime.onUpdateAvailable.addListener(async () => {
    const { configs } = await chrome.storage.local.get(LOCAL_STORAGE_KEY.CONFIGS);
    const key = `backup_${Date.now()}`;
    chrome.storage.local.set({ [key]: configs });
    chrome.runtime.reload();
  });

  /**
   * Setup on Message Listener
   */
  const onMessageListener = {
    [RUNTIME_MESSAGE_ACF.DISCORD_OAUTH2]: new DiscordOauth2(),
    [RUNTIME_MESSAGE_ACF.DISCORD_MESSAGING]: new DiscordMessaging(),
    [RUNTIME_MESSAGE_ACF.GOOGLE_OAUTH2]: new GoogleOauth2(),
    [RUNTIME_MESSAGE_ACF.GOOGLE_BACKUP]: new GoogleBackup(),
    [RUNTIME_MESSAGE_ACF.GOOGLE_SHEETS]: new GoogleSheets(),
  };
  Runtime.onMessageExternal(onMessageListener);
  Runtime.onMessage(onMessageListener);
} catch (error) {
  console.error(error);
  // GoogleAnalytics.error({ error }, () => {})
}
