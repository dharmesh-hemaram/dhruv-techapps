import { Configuration } from '@dhruv-techapps/acf-common';
const GOOGLE_SHEETS_REGEX = /^googlesheets::/i;

export default class GoogleSheets {
  static getSheets(config: Configuration) {
    const sheets = new Map<string, Set<string>>();
    const batchHighestRepeat: number = config.batch?.repeat || 0;
    config.actions
      .map(({ elementFinder, value, addon }) => {
        const result = [];
        if (value && GOOGLE_SHEETS_REGEX.test(value)) {
          result.push(value.replace(GOOGLE_SHEETS_REGEX, ''));
        }
        if (GOOGLE_SHEETS_REGEX.test(elementFinder)) {
          result.push(elementFinder.replace(GOOGLE_SHEETS_REGEX, ''));
        }
        if (addon) {
          if (GOOGLE_SHEETS_REGEX.test(addon.value)) {
            result.push(addon.value.replace(GOOGLE_SHEETS_REGEX, ''));
          }
          if (GOOGLE_SHEETS_REGEX.test(addon.elementFinder)) {
            result.push(addon.elementFinder.replace(GOOGLE_SHEETS_REGEX, ''));
          }
        }
        return result;
      })
      .filter((googleSheets) => googleSheets.length)
      .forEach((googleSheets) => {
        googleSheets.forEach((value) => {
          const [sheetName, range] = value.split('!');
          const ranges = sheets.get(sheetName) || new Set<string>();
          if (value.includes('<batchRepeat>')) {
            ranges.add(range.replace('<batchRepeat>', '1'));
            ranges.add(range.replace('<batchRepeat>', String(batchHighestRepeat + 1)));
          } else if (value.includes('<sessionCount>')) {
            ranges.add(range.replace('<sessionCount>', String(window.__sessionCount)));
          } else {
            ranges.add(range);
          }
          sheets.set(sheetName, ranges);
        });
      });
    return sheets;
  }
}
