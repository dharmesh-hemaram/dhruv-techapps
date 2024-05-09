import { GOOGLE_LOCAL_STORAGE_KEY, GOOGLE_SCOPES, GoogleOauth2Background } from '@dhruv-techapps/google-oauth';
import { NotificationHandler } from '@dhruv-techapps/notifications';
import { ValueRange } from './google-sheets.types';

const NOTIFICATIONS_TITLE = 'Google Sheets';
const NOTIFICATIONS_ID = 'sheets';

export type GoogleSheetsRequest = {
  spreadsheetId: string;
  ranges: Array<string>;
};

export type GoogleSheetsResponse = ValueRange[] | undefined;

export class GoogleSheetsBackground extends GoogleOauth2Background {
  scopes = [GOOGLE_SCOPES.SHEETS, GOOGLE_SCOPES.PROFILE];
  async getSheets({ spreadsheetId, ranges }: GoogleSheetsRequest): Promise<GoogleSheetsResponse> {
    let response;
    if (!spreadsheetId || !ranges) {
      NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'spreadsheetId or ranges is not defined');
      return;
    } else {
      response = await this.getValues({ spreadsheetId, ranges });
    }
    return response;
  }

  async checkUser() {
    const { [GOOGLE_LOCAL_STORAGE_KEY.GOOGLE]: user } = await chrome.storage.local.get(GOOGLE_LOCAL_STORAGE_KEY.GOOGLE);
    return user;
  }

  async getValues({ spreadsheetId, ranges }: GoogleSheetsRequest) {
    const user = await this.checkUser();
    if (!user) {
      NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, 'Login into Google Sheets from Global Settings');
      return;
    }
    try {
      const headers = await this.getHeaders(this.scopes);
      const response = await Promise.all(ranges.map((range) => fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, { headers }).then((r) => r.json())));
      return response.filter((result) => {
        if (result.error) {
          NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, result.error.message);
          return false;
        }
        return true;
      });
    } catch (error) {
      if (error instanceof Error) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, error.message);
      }
      await this.removeCachedAuthToken();
    }
    return;
  }
}
