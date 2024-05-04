import { Logger } from '@dhruv-techapps/core-common';
import { GoogleSheetsService } from './google-sheets.service';
import { Sheets, ValueRange } from './google-sheets.types';

export class GoogleSheetsCS {
  transformSheets(sheets: Map<string, Set<string> | string>) {
    sheets.forEach((ranges, sheetName) => {
      let lowestColumn = 'ZZ';
      let highestColumn = 'A';
      let lowestRow = 999;
      let hightestRow = 1;
      if (ranges instanceof Set) {
        ranges.forEach((range) => {
          const regexResult = /(\D+)(\d+)/.exec(range);
          if (regexResult) {
            const [, column, row] = regexResult;
            const rowIndex = Number(row);
            // Highest Range
            if (highestColumn.length < column.length || highestColumn < column) {
              highestColumn = column;
            }
            if (hightestRow < rowIndex) {
              hightestRow = rowIndex;
            }
            // Lowest Range
            if (lowestColumn.length > column.length || lowestColumn > column) {
              lowestColumn = column;
            }
            if (lowestRow > rowIndex) {
              lowestRow = rowIndex;
            }
          }
        });
      }
      sheets.set(sheetName, `${lowestColumn}${lowestRow}:${highestColumn}${hightestRow}`);
    });
  }

  transformResult(result: Array<ValueRange>): Sheets {
    return result.reduce((a: Sheets, c: ValueRange) => {
      const { range, values } = c;
      const [sheetName, ranges] = range.split('!');
      const [startRange, endRange] = ranges.split(':');
      a[sheetName] = { startRange, endRange, values };
      return a;
    }, {});
  }

  async getValues(sheets: Map<string, Set<string> | string>, spreadsheetId?: string): Promise<Sheets | undefined> {
    if (spreadsheetId) {
      this.transformSheets(sheets);
      const result = await GoogleSheetsService.getSheets(
        chrome.runtime.id,
        spreadsheetId,
        Array.from(sheets, ([sheetName, range]) => `${sheetName}!${range}`)
      );
      if (result) {
        return this.transformResult(result);
      }
      Logger.colorDebug('Google Sheets', result);
      return result;
    }
    return undefined;
  }
}
