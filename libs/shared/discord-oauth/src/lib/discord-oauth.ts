import { RESPONSE_CODE, getRandomValues } from '@dhruv-techapps/core-common';
import { NotificationHandler } from '@dhruv-techapps/notifications';
import { LOCAL_STORAGE_KEY_DISCORD, NOTIFICATIONS_ID, NOTIFICATIONS_TITLE } from './discord-oauth.constant';
import { Discord } from './discord-oauth.types';

export class DiscordOauth2 {
  clientId;
  constructor(clientId = '') {
    this.clientId = clientId;
  }

  async remove() {
    await chrome.storage.local.remove(LOCAL_STORAGE_KEY_DISCORD);
    return RESPONSE_CODE.REMOVED;
  }

  async login() {
    try {
      const regexResult = /\d+/.exec(this.clientId);
      if (!regexResult) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Discord Client ID Missing');
        return;
      }

      const redirectURL = chrome.identity.getRedirectURL();
      const clientID = regexResult[0];
      const scopes = ['identify'];

      let url = 'https://discord.com/api/oauth2/authorize';
      url += `?client_id=${clientID}`;
      url += `&response_type=token`;
      url += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
      url += `&scope=${encodeURIComponent(scopes.join(' '))}`;
      url += `&nonce=${encodeURIComponent(getRandomValues())}`;
      const responseUrl = await chrome.identity.launchWebAuthFlow({ url, interactive: true });
      if (responseUrl) {
        if (chrome.runtime.lastError || responseUrl.includes('access_denied')) {
          NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, chrome.runtime.lastError?.message ?? responseUrl);
          return RESPONSE_CODE.ERROR;
        }
        const responseUrlRegExpMatchArray = responseUrl.match(/token=(.+?)&/);
        if (responseUrlRegExpMatchArray) {
          return await this.getCurrentUser(responseUrlRegExpMatchArray[1]);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, error.message);
      }
      return RESPONSE_CODE.ERROR;
    }
    return undefined;
  }

  async getCurrentUser(token: string): Promise<Discord> {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const discordResponse: Discord = await response.json();
    chrome.storage.local.set({ [LOCAL_STORAGE_KEY_DISCORD]: discordResponse });
    return discordResponse;
  }
}
