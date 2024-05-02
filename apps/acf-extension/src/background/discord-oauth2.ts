import { Discord, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common';
import { DISCORD_CLIENT_ID } from '../common/environments';
import { getRandomValues } from './util';
import { RESPONSE_CODE } from '@dhruv-techapps/core-common';
import { NotificationHandler } from '@dhruv-techapps/notifications';

export const NOTIFICATIONS_TITLE = 'Discord Authentication';
export const NOTIFICATIONS_ID = 'discord';

export default class DiscordOauth2 {
  async remove() {
    await chrome.storage.local.remove(LOCAL_STORAGE_KEY.DISCORD);
    return RESPONSE_CODE.REMOVED;
  }

  async login() {
    try {
      const regexResult = /\d+/.exec(DISCORD_CLIENT_ID || '');
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
          NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, chrome.runtime.lastError?.message || responseUrl);
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
  }

  async getCurrentUser(token: string): Promise<Discord> {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const discordResponse: Discord = await response.json();
    chrome.storage.local.set({ [LOCAL_STORAGE_KEY.DISCORD]: discordResponse });
    return discordResponse;
  }
}
