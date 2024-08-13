import { Value } from '@dhruv-techapps/acf-util';
import { GoogleSheetsValue } from '@dhruv-techapps/google-sheets';
import { SandboxValue } from '@dhruv-techapps/sandbox';

export const VALUE_MATCHER = {
  GOOGLE_SHEETS: /^GoogleSheets::/i,
  FUNC: /^Func::/i,
};

export class ACFValue {
  static async getValue(value: string) {
    value = await Value.getValue(value);
    if (VALUE_MATCHER.GOOGLE_SHEETS.test(value)) {
      value = GoogleSheetsValue.getSheetValue(value);
    }
    if (VALUE_MATCHER.FUNC.test(value)) {
      value = await SandboxValue.getFuncValue(value);
    }
    return value;
  }
}
