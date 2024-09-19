import { Auth, FirebaseOauth2Background } from '@dhruv-techapps/firebase-oauth';
import { GOOGLE_SCOPES } from '@dhruv-techapps/google-oauth';
import { NotificationHandler } from '@dhruv-techapps/notifications';
import { NOTIFICATIONS_ID } from './firebase-functions.constant';

export class FirebaseFunctionsBackground extends FirebaseOauth2Background {
  cloudFunctionUrl: string;

  constructor(auth: Auth, cloudFunctionUrl: string, edgeClientId?: string | undefined) {
    super(auth, edgeClientId);
    this.cloudFunctionUrl = cloudFunctionUrl;
  }

  async visionImagesAnnotate<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders();
    const url = new URL(this.cloudFunctionUrl + '/visionImagesAnnotate');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async getValues<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.SHEETS]);
    const url = new URL(this.cloudFunctionUrl + '/sheetsValuesV2');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async discordNotify<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders();
    const url = new URL(this.cloudFunctionUrl + '/discordNotifyV2');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async discordUser<Res>(token?: string): Promise<Res> {
    const url = new URL(this.cloudFunctionUrl + '/discordUserV2');
    const headers = await this._getFirebaseHeaders(undefined, token); // Cast the token argument to string
    const response = await this.#fetch(url, headers);
    return response;
  }

  async driveList<Res>(): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.DRIVE]);
    const url = new URL(this.cloudFunctionUrl + '/driveListV2');
    const response = await this.#fetch(url, headers);
    return response;
  }

  async driveGet<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.DRIVE]);
    const url = new URL(this.cloudFunctionUrl + '/driveGetV2');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async driveDelete<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.DRIVE]);
    const url = new URL(this.cloudFunctionUrl + '/driveDeleteV2');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async driveCreateOrUpdate<Req, Res>(data: Req): Promise<Res> {
    const headers = await this._getFirebaseHeaders([GOOGLE_SCOPES.DRIVE]);
    const url = new URL(this.cloudFunctionUrl + '/driveCreateOrUpdateV2');
    const response = await this.#fetch(url, headers, data);
    return response;
  }

  async #fetch(url: URL, headers: Headers, data?: unknown) {
    try {
      const init: RequestInit = { method: 'POST', headers };
      if (data) {
        init.body = JSON.stringify(data);
      }

      const response = await fetch(url.href, init);
      const result = await response.json();
      if (result.error) {
        throw new CustomError(result.error, result.message);
      }
      return result;
    } catch (error) {
      if (error instanceof CustomError || error instanceof Error) {
        NotificationHandler.notify(NOTIFICATIONS_ID, error.name, error.message, true);
      }
      throw error;
    }
  }
}

class CustomError extends Error {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}
