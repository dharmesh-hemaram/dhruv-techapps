import { BROWSER, RESPONSE_CODE } from '@dhruv-techapps/core-common';
import { NotificationHandler } from '@dhruv-techapps/notifications';
import { GOOGLE_SCOPES, GOOGLE_LOCAL_STORAGE_KEY, GoogleOauth2LoginResponse } from './google-oauth.types';

const NOTIFICATIONS_TITLE = 'Google OAuth';
const NOTIFICATIONS_ID = 'authentication';

export class GoogleOauth2Background {
  async removeCachedAuthToken() {
    const { token } = await chrome.identity.getAuthToken({ interactive: false });
    if (token) {
      await chrome.identity.removeCachedAuthToken({ token });
    }
    return true;
  }

  async login(scope: GOOGLE_SCOPES): Promise<GoogleOauth2LoginResponse | null> {
    if (!scope) {
      throw new Error('Scopes not defined');
    }
    try {
      const headers = await this.getHeaders([GOOGLE_SCOPES.PROFILE, scope]);
      const google = await this.getCurrentUser(headers);
      const googleScopes = await this.#getScopes();
      return { [GOOGLE_LOCAL_STORAGE_KEY.GOOGLE_SCOPES]: googleScopes, [GOOGLE_LOCAL_STORAGE_KEY.GOOGLE]: google };
    } catch (error) {
      if (error instanceof Error) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, error.message);
      }
      await this.removeCachedAuthToken();
      throw error;
    }
  }

  async getCurrentUser(headers: HeadersInit) {
    let response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, { headers });
    response = await response.json();
    chrome.storage.local.set({ [GOOGLE_LOCAL_STORAGE_KEY.GOOGLE]: response });
    return response;
  }

  async remove(scope: GOOGLE_SCOPES) {
    const scopes = await this.#removeScope(scope);
    if (scopes.length === 1) {
      await chrome.storage.local.remove(GOOGLE_LOCAL_STORAGE_KEY.GOOGLE);
      await this.removeCachedAuthToken();
    }
    return RESPONSE_CODE.REMOVED;
  }

  async getAuthTokenEdge(scopes: Array<GOOGLE_SCOPES>, clientId: string) {
    const redirectUrl = chrome.identity.getRedirectURL();
    const redirectUri = encodeURIComponent(redirectUrl);
    const scopesString = encodeURIComponent(scopes.join(' '));
    const result = await chrome.identity.launchWebAuthFlow({
      url: `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scopesString}`,
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

  async getAuthToken(scopes: Array<GOOGLE_SCOPES>, clientId?: string) {
    if (BROWSER === 'EDGE' && clientId) {
      const token = this.getAuthTokenEdge(scopes, clientId);
      for (const scope of scopes) {
        await this.#addScope(scope);
      }
      return token;
    } else {
      const { token } = await chrome.identity.getAuthToken({ interactive: true, scopes });
      for (const scope of scopes) {
        await this.#addScope(scope);
      }
      return token;
    }
  }

  async getHeaders(scopes: Array<GOOGLE_SCOPES>, clientId?: string) {
    const token = await this.getAuthToken(scopes, clientId);
    return new Headers({ Authorization: `Bearer ${token}` });
  }

  async #addScope(scope: GOOGLE_SCOPES) {
    const { [GOOGLE_LOCAL_STORAGE_KEY.GOOGLE_SCOPES]: scopes = [] } = await chrome.storage.local.get(GOOGLE_LOCAL_STORAGE_KEY.GOOGLE_SCOPES);
    if (!scopes.includes(scope)) {
      scopes.push(scope);
      await chrome.storage.local.set({ [GOOGLE_LOCAL_STORAGE_KEY.GOOGLE_SCOPES]: scopes });
    }
    return scopes;
  }

  async #getScopes() {
    const { [GOOGLE_LOCAL_STORAGE_KEY.GOOGLE_SCOPES]: scopes = [] } = await chrome.storage.local.get(GOOGLE_LOCAL_STORAGE_KEY.GOOGLE_SCOPES);
    return scopes;
  }

  async #removeScope(scope: GOOGLE_SCOPES) {
    const { [GOOGLE_LOCAL_STORAGE_KEY.GOOGLE_SCOPES]: scopes = [] } = await chrome.storage.local.get(GOOGLE_LOCAL_STORAGE_KEY.GOOGLE_SCOPES);
    const index = scopes.findIndex(scope);
    if (index !== -1) {
      scopes.splice(index, 1);
      await chrome.storage.local.set({ [GOOGLE_LOCAL_STORAGE_KEY.GOOGLE_SCOPES]: scopes });
    }
    return scopes;
  }
}
