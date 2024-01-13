import { Logger } from '@dhruv-techapps/core-common';
import RandExp from 'randexp';
import { ConfigError } from '../error';
import Common from '../common';

export const VALUE_MATCHER = {
  GOOGLE_SHEETS: /^GoogleSheets::/i,
  QUERY_PARAM: /^Query::/i,
  FUNC: /^Func::/i,
  RANDOM: /<random(.+)>/gi,
  BATCH_REPEAT: /<batchRepeat>/,
};

const Value = (() => {
  const getRandomValue = (value: string) =>
    value.replace(VALUE_MATCHER.RANDOM, (_, regex) => {
      Logger.colorDebug('RandExp', regex);
      const result = new RandExp(regex).gen();
      Logger.colorDebug('GetRandomValue', result);
      return result;
    });

  const getBatchRepeat = (value: string) => {
    value = value.replaceAll('<batchRepeat>', String(window.__batchRepeat));
    Logger.colorDebug('GetBatchRepeat', value);
    return value;
  };

  const getSheetValue = (value: string) => {
    const sheets = window.__sheets;
    if (!sheets) {
      return value;
    }
    const [sheetName, range] = value.split('::')[1].split('!');
    if (!sheets || !sheets[sheetName]) {
      throw new ConfigError(`Sheet: "${sheetName}" not found!`, 'Sheet not found');
    }
    const { startRange, values, sessionCount } = sheets[sheetName];
    if (!values) {
      throw new ConfigError(`Sheet "${sheetName}" do not have value in ${startRange}`, 'Sheet values not found');
    }
    const currentRange = range.replaceAll('<batchRepeat>', String(window.__batchRepeat + 1)).replaceAll('<sessionCount>', String(sessionCount));
    if (!/(\D+)(\d+)/.test(currentRange)) {
      throw new ConfigError(`Sheet range is not valid${range}`, 'Sheet range invalid');
    }
    const currentRangeRegExp = /(\D+)(\d+)/.exec(currentRange);
    if (currentRangeRegExp) {
      const [, column, row] = currentRangeRegExp;
      const startRangeRegExp = /(\D+)(\d+)/.exec(startRange);
      if (startRangeRegExp) {
        const [, columnStart, rowStart] = startRangeRegExp;
        const colIndex = column.split('').reduce((a, c, i) => a + c.charCodeAt(0) - columnStart.charCodeAt(0) + i * 26, 0);
        const rowIndex = Number(row) - Number(rowStart);
        if (!values[rowIndex] || !values[rowIndex][colIndex]) {
          console.warn(`Sheet "${sheetName}" do not have value in ${column}${row}`, 'Sheet cell not found');
          return '::empty';
        }
        value = values[rowIndex][colIndex];
        Logger.colorDebug('Google Sheet Value', value);
        return value;
      }
    }
    return value;
  };

  const getQueryParam = (value: string) => {
    const [, key] = value.split('::');
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has(key)) {
      value = searchParams.get(key) || key;
    }
    Logger.colorDebug('GetQueryParam', value);
    return value;
  };

  const getFuncValue = async (value: string) => {
    const result = await Common.sandboxEval(value.replace(/^Func::/gi, ''));
    return result;
  };

  const getValue = async (value: string): Promise<string> => {
    /// For select box value is boolean true
    if (typeof value !== 'string') {
      Logger.colorDebug('Value', value);
      return value;
    }

    switch (true) {
      case VALUE_MATCHER.GOOGLE_SHEETS.test(value):
        return getSheetValue(value);
      case VALUE_MATCHER.QUERY_PARAM.test(value):
        return getQueryParam(value);
      case VALUE_MATCHER.BATCH_REPEAT.test(value):
        return getBatchRepeat(value);
      case VALUE_MATCHER.RANDOM.test(value):
        return getRandomValue(value);
      case VALUE_MATCHER.FUNC.test(value):
        return await getFuncValue(value);
      default:
        return value;
    }
  };

  return { getValue };
})();

export default Value;
