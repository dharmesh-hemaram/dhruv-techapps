import { getParameterByName, getRandomValues } from '@dhruv-techapps/core-common';
import { NotificationHandler } from '@dhruv-techapps/notifications';
import { LOCAL_STORAGE_KEY_DISCORD, NOTIFICATIONS_ID, NOTIFICATIONS_TITLE } from './discord-oauth.constant';
import { Discord } from './discord-oauth.types';

export class DiscordOauth2Background {
  clientId;
  constructor(clientId = '') {
    this.clientId = clientId;
  }

  async remove(): Promise<void> {
    return await chrome.storage.local.remove(LOCAL_STORAGE_KEY_DISCORD);
  }

  async login(): Promise<Discord> {
    try {
      const regexResult = /\d+/.exec(this.clientId);
      if (!regexResult) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Discord Client ID Missing');
        throw new Error('Discord Client ID Missing');
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
          const error = chrome.runtime.lastError?.message || getParameterByName('error_description', responseUrl);
          NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, error);
          throw new Error(error);
        }
        const access_token = getParameterByName('access_token', responseUrl);
        if (access_token) {
          return await this.getCurrentUser(access_token);
        }
      }
      NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'No response from Discord');
      throw new Error('No response from Discord');
    } catch (error) {
      if (error instanceof Error) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, error.message);
      }
      throw error;
    }
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
