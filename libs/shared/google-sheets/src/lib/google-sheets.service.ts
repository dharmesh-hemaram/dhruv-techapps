import { CoreService } from '@dhruv-techapps/core-service';
import { GoogleSheetsResponse, GoogleSheetsRequest } from './google-sheets-background';
import { RuntimeMessageRequest } from '@dhruv-techapps/core-common';
import { RUNTIME_MESSAGE_GOOGLE_SHEETS } from './google-sheets.constant';

export class GoogleSheetsService extends CoreService {
  static async getSheets(extensionId: string, spreadsheetId: string, ranges: Array<string>) {
    return await this.message<RuntimeMessageRequest<GoogleSheetsRequest>, GoogleSheetsResponse>(extensionId, {
      messenger: RUNTIME_MESSAGE_GOOGLE_SHEETS,
      methodName: 'getSheets',
      message: { spreadsheetId, ranges },
    });
  }
}
