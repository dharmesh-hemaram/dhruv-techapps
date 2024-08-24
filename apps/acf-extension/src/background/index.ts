/* eslint-disable no-new */
import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { Runtime } from '@dhruv-techapps/core-extension';
import { DiscordMessagingBackground, RUNTIME_MESSAGE_DISCORD_MESSAGING } from '@dhruv-techapps/discord-messaging';
import { DiscordOauth2Background, RUNTIME_MESSAGE_DISCORD_OAUTH } from '@dhruv-techapps/discord-oauth';
import { FirebaseDatabaseBackground, RUNTIME_MESSAGE_FIREBASE_DATABASE } from '@dhruv-techapps/firebase-database';
import { FirebaseFirestoreBackground, RUNTIME_MESSAGE_FIREBASE_FIRESTORE } from '@dhruv-techapps/firebase-firestore';
import { FirebaseFunctionsBackground, RUNTIME_MESSAGE_FIREBASE_FUNCTIONS } from '@dhruv-techapps/firebase-functions';
import { FirebaseOauth2Background, RUNTIME_MESSAGE_FIREBASE_OAUTH } from '@dhruv-techapps/firebase-oauth';
import { GoogleAnalyticsBackground, RUNTIME_MESSAGE_GOOGLE_ANALYTICS } from '@dhruv-techapps/google-analytics';
import { GoogleDriveBackground, RUNTIME_MESSAGE_GOOGLE_DRIVE } from '@dhruv-techapps/google-drive';
import { GoogleOauth2Background, RUNTIME_MESSAGE_GOOGLE_OAUTH } from '@dhruv-techapps/google-oauth';
import { GoogleSheetsBackground, RUNTIME_MESSAGE_GOOGLE_SHEETS } from '@dhruv-techapps/google-sheets';
import { registerNotifications } from '@dhruv-techapps/notifications';
import { ACTION_POPUP } from '../common/constant';
import { API_SECRET, DISCORD_CLIENT_ID, EDGE_OAUTH_CLIENT_ID, MEASUREMENT_ID, OPTIONS_PAGE_URL, UNINSTALL_URL, VARIANT } from '../common/environments';
import AcfBackup from './acf-backup';
import registerContextMenus from './context-menu';
import { auth } from './firebase';
import { TabsMessenger } from './tab';
import { Update } from './update';

let googleAnalytics: GoogleAnalyticsBackground | undefined;
let firebaseDatabaseBackground: FirebaseDatabaseBackground;

try {
  googleAnalytics = new GoogleAnalyticsBackground(MEASUREMENT_ID, API_SECRET, VARIANT === 'LOCAL');
  firebaseDatabaseBackground = new FirebaseDatabaseBackground(auth, EDGE_OAUTH_CLIENT_ID);

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
  chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      TabsMessenger.optionsTab({ url: OPTIONS_PAGE_URL });
    }
  });

  auth.onAuthStateChanged((user) => {
    if (user) {
      Update.discord(firebaseDatabaseBackground);
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

  auth.authStateReady().then(() => {
    /**
     * Setup on Message Listener
     */
    const onMessageListener = {
      [RUNTIME_MESSAGE_ACF.TABS]: new TabsMessenger(),
      [RUNTIME_MESSAGE_DISCORD_OAUTH]: new DiscordOauth2Background(auth, EDGE_OAUTH_CLIENT_ID, DISCORD_CLIENT_ID),
      [RUNTIME_MESSAGE_DISCORD_MESSAGING]: new DiscordMessagingBackground(auth, EDGE_OAUTH_CLIENT_ID, VARIANT),
      [RUNTIME_MESSAGE_GOOGLE_ANALYTICS]: googleAnalytics,
      [RUNTIME_MESSAGE_GOOGLE_OAUTH]: new GoogleOauth2Background(EDGE_OAUTH_CLIENT_ID),
      [RUNTIME_MESSAGE_GOOGLE_DRIVE]: new GoogleDriveBackground(auth, EDGE_OAUTH_CLIENT_ID),
      [RUNTIME_MESSAGE_ACF.ACF_BACKUP]: new AcfBackup(auth, EDGE_OAUTH_CLIENT_ID),
      [RUNTIME_MESSAGE_GOOGLE_SHEETS]: new GoogleSheetsBackground(auth, EDGE_OAUTH_CLIENT_ID),
      [RUNTIME_MESSAGE_FIREBASE_DATABASE]: firebaseDatabaseBackground,
      [RUNTIME_MESSAGE_FIREBASE_OAUTH]: new FirebaseOauth2Background(auth, EDGE_OAUTH_CLIENT_ID),
      [RUNTIME_MESSAGE_FIREBASE_FIRESTORE]: new FirebaseFirestoreBackground(auth, EDGE_OAUTH_CLIENT_ID, OPTIONS_PAGE_URL),
      [RUNTIME_MESSAGE_FIREBASE_FUNCTIONS]: new FirebaseFunctionsBackground(auth, EDGE_OAUTH_CLIENT_ID),
    };
    Runtime.onMessageExternal(onMessageListener);
    Runtime.onMessage(onMessageListener);
  });
} catch (error) {
  if (error instanceof Error) {
    googleAnalytics?.fireErrorEvent({ name: error.name, error: error.message, additionalParams: { page: 'background' } });
  }
  console.error(error);
}

addEventListener('unhandledrejection', async (event) => {
  if (event.reason instanceof Error) {
    googleAnalytics?.fireErrorEvent({ error: event.reason.message, additionalParams: { page: 'background' } });
  } else {
    googleAnalytics?.fireErrorEvent({ error: JSON.stringify(event.reason), additionalParams: { page: 'background' } });
  }
  console.error(event);
});
