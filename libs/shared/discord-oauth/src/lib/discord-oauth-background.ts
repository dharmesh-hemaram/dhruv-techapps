import { getParameterByName, getRandomValues } from '@dhruv-techapps/core-common';
import { FirebaseFunctionsBackground } from '@dhruv-techapps/firebase-functions';
import { Auth } from '@dhruv-techapps/firebase-oauth';
import { NotificationHandler } from '@dhruv-techapps/notifications';
import { NOTIFICATIONS_ID, NOTIFICATIONS_TITLE } from './discord-oauth.constant';
import { Discord } from './discord-oauth.types';

export class DiscordOauth2Background extends FirebaseFunctionsBackground {
  constructor(
    auth: Auth,
    cloudFunctionUrl: string,
    edgeClientId?: string,
    private clientId?: string
  ) {
    super(auth, cloudFunctionUrl, edgeClientId);
    this.clientId = clientId;
  }

  async discordLogin(): Promise<Discord> {
    try {
      if (!this.clientId) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Discord Client ID Missing');
        throw new Error('Discord Client ID Missing');
      }

      const redirectURL = chrome.identity.getRedirectURL();
      const scopes = ['identify'];

      const url = new URL('https://discord.com/api/oauth2/authorize');
      url.searchParams.append('client_id', this.clientId);
      url.searchParams.append('response_type', 'token');
      url.searchParams.append('redirect_uri', redirectURL);
      url.searchParams.append('scope', scopes.join(' '));
      url.searchParams.append('nonce', getRandomValues());

      const responseUrl = await chrome.identity.launchWebAuthFlow({ url: url.href, interactive: true });
      if (responseUrl) {
        if (chrome.runtime.lastError || responseUrl.includes('access_denied')) {
          const error = chrome.runtime.lastError?.message || getParameterByName('error_description', responseUrl);
          NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, error);
          throw new Error(error);
        }
        const access_token = getParameterByName('access_token', responseUrl);
        if (access_token) {
          return await this.discordUser(access_token);
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
}
