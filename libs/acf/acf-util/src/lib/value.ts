import RandExp from 'randexp';
import { ConfigError } from '@dhruv-techapps/core-common';
import { Sandbox } from '@dhruv-techapps/sandbox';
import { Sheets } from '@dhruv-techapps/google-sheets';

declare global {
  interface Window {
    __batchRepeat: number;
    __actionRepeat: number;
    __sessionCount: number;
    __sheets?: Sheets;
    __api?: any;
  }
}

export const VALUE_MATCHER = {
  GOOGLE_SHEETS: /^GoogleSheets::/i,
  QUERY_PARAM: /^Query::/i,
  FUNC: /^Func::/i,
  API: /^Api::/i,
  RANDOM: /<random(.+)>/gi,
  BATCH_REPEAT: /<batchRepeat>/,
  ACTION_REPEAT: /<actionRepeat>/,
  SESSION_COUNT: /<sessionCount>/,
};

export const Value = (() => {
  const getRandomValue = (value: string) =>
    value.replace(VALUE_MATCHER.RANDOM, (_, regex) => {
      const randexp = new RandExp(regex, 'i');
      randexp.defaultRange.add(0, 65535);
      const result = randexp.gen();
      return result;
    });

  const getBatchRepeat = (value: string) => value.replaceAll('<batchRepeat>', String(window.__batchRepeat));

  const getActionRepeat = (value: string) => value.replaceAll('<actionRepeat>', String(window.__actionRepeat));

  const getSessionCount = (value: string) => value.replaceAll('<sessionCount>', String(window.__sessionCount));

  const getSheetValue = (value: string) => {
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

    let currentRange = getBatchRepeat(range);
    currentRange = getActionRepeat(currentRange);
    currentRange = getSessionCount(currentRange);

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
        if (!values[rowIndex]?.[colIndex]) {
          console.warn(`Sheet "${sheetName}" do not have value in ${column}${row}`, 'Sheet cell not found');
          return '::empty';
        }
        value = values[rowIndex][colIndex];
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
    return value;
  };

  const getFuncValue = async (value: string) => {
    const result = await Sandbox.sandboxEval(value.replace(/^Func::/gi, ''));
    return result;
  };

  const getApiValue = (value: string): string => {
    const [, key] = value.split('::');
    const apiValue = window.__api[key];
    if (apiValue) {
      return apiValue;
    }
    return value;
  };

  const getValue = async (value: string): Promise<string> => {
    /// For select box value is boolean true
    if (typeof value !== 'string') {
      return value;
    }

    if (VALUE_MATCHER.GOOGLE_SHEETS.test(value)) {
      value = getSheetValue(value);
    }
    if (VALUE_MATCHER.QUERY_PARAM.test(value)) {
      value = getQueryParam(value);
    }
    if (VALUE_MATCHER.BATCH_REPEAT.test(value)) {
      value = getBatchRepeat(value);
    }
    if (VALUE_MATCHER.ACTION_REPEAT.test(value)) {
      value = getActionRepeat(value);
    }
    if (VALUE_MATCHER.API.test(value)) {
      value = getApiValue(value);
    }
    if (VALUE_MATCHER.SESSION_COUNT.test(value)) {
      value = getSessionCount(value);
    }
    if (VALUE_MATCHER.RANDOM.test(value)) {
      value = getRandomValue(value);
    }
    if (VALUE_MATCHER.API.test(value)) {
      value = getApiValue(value);
    }
    if (VALUE_MATCHER.FUNC.test(value)) {
      value = await getFuncValue(value);
    }
    return value;
  };

  return { getValue };
})();