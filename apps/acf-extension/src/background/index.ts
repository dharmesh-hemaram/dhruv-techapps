/* eslint-disable no-new */
import { RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common';
import { MainWorldBackground, RUNTIME_MESSAGE_MAIN_WORLD_MESSAGING } from '@dhruv-techapps/acf-main-world';
import { Runtime } from '@dhruv-techapps/core-extension';
import { DiscordMessagingBackground, RUNTIME_MESSAGE_DISCORD_MESSAGING } from '@dhruv-techapps/discord-messaging';
import { DiscordOauth2Background, RUNTIME_MESSAGE_DISCORD_OAUTH } from '@dhruv-techapps/discord-oauth';
import { FirebaseFirestoreBackground, RUNTIME_MESSAGE_FIREBASE_FIRESTORE } from '@dhruv-techapps/firebase-firestore';
import { FirebaseFunctionsBackground, RUNTIME_MESSAGE_FIREBASE_FUNCTIONS } from '@dhruv-techapps/firebase-functions';
import { FirebaseOauth2Background, RUNTIME_MESSAGE_FIREBASE_OAUTH } from '@dhruv-techapps/firebase-oauth';
import { RUNTIME_MESSAGE_GOOGLE_ANALYTICS } from '@dhruv-techapps/google-analytics';
import { GoogleDriveBackground, RUNTIME_MESSAGE_GOOGLE_DRIVE } from '@dhruv-techapps/google-drive';
import { GoogleOauth2Background, RUNTIME_MESSAGE_GOOGLE_OAUTH } from '@dhruv-techapps/google-oauth';
import { GoogleSheetsBackground, RUNTIME_MESSAGE_GOOGLE_SHEETS } from '@dhruv-techapps/google-sheets';
import { registerNotifications } from '@dhruv-techapps/notifications';
import { RUNTIME_MESSAGE_VISION, VisionBackground } from '@dhruv-techapps/vision';
import { OpenAIBackground, RUNTIME_MESSAGE_OPENAI } from '@dhruv.techapps/openai';
import XMLHttpRequest from 'xhr-shim';
import { ACTION_POPUP } from '../common/constant';
import { DISCORD_CLIENT_ID, EDGE_OAUTH_CLIENT_ID, FIREBASE_FUNCTIONS_URL, OPTIONS_PAGE_URL, VARIANT } from '../common/environments';
import AcfBackup from './acf-backup';
import registerContextMenus from './context-menu';
import { auth } from './firebase';
import { googleAnalytics } from './google-analytics';
import { SyncConfig } from './sync-config';
import { TabsMessenger } from './tab';

self['XMLHttpRequest'] = XMLHttpRequest;

try {
  /**
   * Browser Action set to open option page / configuration page
   */
  chrome.action.onClicked.addListener((tab) => {
    googleAnalytics?.fireEvent({ name: 'Wizard', params: { location: 'action:onClicked' } });
    if (tab.id !== undefined) {
      chrome.tabs.sendMessage(tab.id, { action: ACTION_POPUP });
    }
  });

  /**
   *  On initial install setup basic configuration
   */
  chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      TabsMessenger.optionsTab({ url: OPTIONS_PAGE_URL });
    }
  });

  /**
   * On startup check if user is logged in and sync config
   * If user is not logged in then do nothing
   * If user is logged in then sync config
   * If user is logged in and last backup is more than 7 days then sync config
   * Set last backup time in local storage
   */
  chrome.runtime.onStartup.addListener(() => {
    auth.authStateReady().then(() => {
      new FirebaseFirestoreBackground(auth).getProfile().then((profile) => {
        if (profile) {
          chrome.storage.local.get('last-backup', (result) => {
            if (result['last-backup'] === undefined) {
              new SyncConfig(auth).syncConfig(false);
              chrome.storage.local.set({ 'last-backup': Date.now() });
            } else if (Date.now() - result['last-backup'] > 604800000) {
              new SyncConfig(auth).syncConfig(true);
              chrome.storage.local.set({ 'last-backup': Date.now() });
            }
          });
        }
      });
    });
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
   * Setup on Message Listener
   */
  const onMessageListener = {
    [RUNTIME_MESSAGE_ACF.TABS]: new TabsMessenger(),
    [RUNTIME_MESSAGE_MAIN_WORLD_MESSAGING]: new MainWorldBackground(),
    [RUNTIME_MESSAGE_DISCORD_OAUTH]: new DiscordOauth2Background(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID, DISCORD_CLIENT_ID),
    [RUNTIME_MESSAGE_DISCORD_MESSAGING]: new DiscordMessagingBackground(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID, VARIANT),
    [RUNTIME_MESSAGE_GOOGLE_ANALYTICS]: googleAnalytics,
    [RUNTIME_MESSAGE_GOOGLE_OAUTH]: new GoogleOauth2Background(EDGE_OAUTH_CLIENT_ID),
    [RUNTIME_MESSAGE_GOOGLE_DRIVE]: new GoogleDriveBackground(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID),
    [RUNTIME_MESSAGE_ACF.ACF_BACKUP]: new AcfBackup(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID),
    [RUNTIME_MESSAGE_GOOGLE_SHEETS]: new GoogleSheetsBackground(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID),
    [RUNTIME_MESSAGE_FIREBASE_OAUTH]: new FirebaseOauth2Background(auth, EDGE_OAUTH_CLIENT_ID),
    [RUNTIME_MESSAGE_FIREBASE_FIRESTORE]: new FirebaseFirestoreBackground(auth, EDGE_OAUTH_CLIENT_ID, OPTIONS_PAGE_URL),
    [RUNTIME_MESSAGE_FIREBASE_FUNCTIONS]: new FirebaseFunctionsBackground(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID),
    [RUNTIME_MESSAGE_VISION]: new VisionBackground(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID),
    [RUNTIME_MESSAGE_OPENAI]: new OpenAIBackground(auth, FIREBASE_FUNCTIONS_URL, EDGE_OAUTH_CLIENT_ID),
  };
  Runtime.onMessageExternal(onMessageListener);
  Runtime.onMessage(onMessageListener);

  auth.authStateReady().then(() => {
    const clientId = auth.currentUser?.uid;
    if (clientId) {
      chrome.storage.local.set({ clientId });
    }
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

auth.authStateReady().then(() => {
  new SyncConfig(auth).syncConfig(false);
});
