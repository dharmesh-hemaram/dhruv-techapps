import { ConfigError } from '@dhruv-techapps/core-common';
import { Sheets } from './google-sheets.types';

declare global {
  interface Window {
    __sheets?: Sheets;
  }
}

export class GoogleSheetsValue {
  static getSheetValue(value: string) {
    const sheets = window.__sheets;
    if (!sheets) {
      return value;
    }
    const [sheetName, range] = value.split('::')[1].split('!');
    if (!sheets?.[sheetName]) {
      throw new ConfigError(`Sheet: "${sheetName}" not found!`, 'Sheet not found');
    }
    const { startRange, values } = sheets[sheetName];
    if (!values) {
      throw new ConfigError(`Sheet "${sheetName}" do not have value in ${startRange}`, 'Sheet values not found');
    }

    if (!/(\D+)(\d+)/.test(range)) {
      throw new ConfigError(`Sheet range is not valid${range}`, 'Sheet range invalid');
    }
    const currentRangeRegExp = /(\D+)(\d+)/.exec(range);
    if (currentRangeRegExp) {
      const [, column, row] = currentRangeRegExp;
      const startRangeRegExp = /(\D+)(\d+)/.exec(startRange);
      if (startRangeRegExp) {
        const [, columnStart, rowStart] = startRangeRegExp;
        const colIndex = column.split('').reduce((a, c, i) => a + c.charCodeAt(0) - columnStart.charCodeAt(0) + i * 26, 0);
        const rowIndex = Number(row) - Number(rowStart);
        if (!values[rowIndex]?.[colIndex]) {
          console.warn(`Sheet "${sheetName}" do not have value in ${column}${row}`, 'Sheet cell not found');
          return '::empty';
        }
        value = values[rowIndex][colIndex];
        return value;
      }
    }
    return value;
  }
}
