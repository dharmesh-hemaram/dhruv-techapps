import { RESPONSE_CODE } from '@dhruv-techapps/core-common';
import { NotificationHandler } from '@dhruv-techapps/notifications';
import { IspyOauth2LoginResponse } from './ispy-oauth.types';
import { ISPY_LOCAL_STORAGE_KEY } from './ispy-oauth.constant';

const NOTIFICATIONS_TITLE = 'Ispy OAuth';
const NOTIFICATIONS_ID = 'authentication';

export class IspyOauth2Background {
  clientId;
  constructor(clientId = '') {
    this.clientId = clientId;
  }

  async login(): Promise<IspyOauth2LoginResponse> {
    try {
      let { [ISPY_LOCAL_STORAGE_KEY]: user } = await chrome.storage.local.get(ISPY_LOCAL_STORAGE_KEY);
      if (user) {
        return { [ISPY_LOCAL_STORAGE_KEY]: user };
      }
      const headers = await this.#getHeaders();
      user = await this.#getCurrentUser(headers);
      return { [ISPY_LOCAL_STORAGE_KEY]: user };
    } catch (error) {
      if (error instanceof Error) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, error.message);
      }
      await this.#removeCachedAuthToken();
      throw error;
    }
  }

  async logout() {
    await chrome.storage.local.remove(ISPY_LOCAL_STORAGE_KEY);
    await this.#removeCachedAuthToken();
    return RESPONSE_CODE.REMOVED;
  }

  async #removeCachedAuthToken() {
    const { token } = await chrome.identity.getAuthToken({ interactive: false });
    if (token) {
      await chrome.identity.removeCachedAuthToken({ token });
    }
    return true;
  }

  async #getCurrentUser(headers: HeadersInit) {
    let response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, { headers });
    response = await response.json();
    chrome.storage.local.set({ [ISPY_LOCAL_STORAGE_KEY]: response });
    return response;
  }

  async #getAuthToken() {
    if (!this.clientId) {
      NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Client ID Missing');
      throw new Error('Client ID Missing');
    }
    const redirectUrl = chrome.identity.getRedirectURL();
    const redirectUri = encodeURIComponent(redirectUrl);
    const result = await chrome.identity.launchWebAuthFlow({
      url: `https://stagingapi.appcity.dev/api/v1/users/authenticate/firebase/oauth?client_id=${this.clientId}&redirect_uri=${redirectUri}&response_type=token`,
      interactive: true,
    });
    if (result) {
      const url = new URL(result);
      const token = url?.hash
        ?.split('&')
        .find((param) => param.startsWith('#access_token='))
        ?.split('=')[1];
      if (token) {
        return token;
      } else {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Token not found');
      }
    } else {
      NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Error while retrieving token');
    }
    return null;
  }

  async #getHeaders() {
    const token = await this.#getAuthToken();
    return new Headers({ Authorization: `Bearer ${token}` });
  }
}
