import { FirebaseFunctionsBackground } from '@dhruv-techapps/firebase-functions';
import { GOOGLE_SCOPES } from '@dhruv-techapps/google-oauth';
import { NotificationHandler } from '@dhruv-techapps/notifications';
import { GoogleSheetsRequest, GoogleSheetsResponse } from './google-sheets.types';

const NOTIFICATIONS_TITLE = 'Google Sheets';
const NOTIFICATIONS_ID = 'google-sheets';

export class GoogleSheetsBackground extends FirebaseFunctionsBackground {
  scopes = [GOOGLE_SCOPES.SHEETS];
  async getSheets({ spreadsheetId, ranges }: GoogleSheetsRequest): Promise<GoogleSheetsResponse> {
    if (!spreadsheetId || !ranges) {
      throw new Error('spreadsheetId or ranges is not defined');
    }

    const response = await this.getValues<GoogleSheetsRequest, GoogleSheetsResponse>({ spreadsheetId, ranges });
    return response.filter((result) => {
      if (result.error) {
        NotificationHandler.notify(NOTIFICATIONS_ID, NOTIFICATIONS_TITLE, result.error.message);
        return false;
      }
      return true;
    });
  }
}
