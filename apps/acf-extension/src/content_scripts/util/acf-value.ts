import { ActionSettings } from '@dhruv-techapps/acf-common';
import { Value } from '@dhruv-techapps/acf-util';
import { GoogleSheetsValue } from '@dhruv-techapps/google-sheets';
import { SandboxValue } from '@dhruv-techapps/sandbox';
import { VisionService, VisionValue } from '@dhruv-techapps/vision';
import Common from '../common';

export const VALUE_MATCHER = {
  GOOGLE_SHEETS: /^GoogleSheets::/i,
  FUNC: /^Func::/i,
  IMAGE: /^Image::/i,
};

export class ACFValue {
  static async getValue(value: string, settings?: ActionSettings): Promise<string> {
    value = await Value.getValue(value);
    if (VALUE_MATCHER.GOOGLE_SHEETS.test(value)) {
      value = GoogleSheetsValue.getSheetValue(value);
    }
    if (VALUE_MATCHER.FUNC.test(value)) {
      value = await SandboxValue.getFuncValue(value);
    }
    if (VALUE_MATCHER.IMAGE.test(value)) {
      try {
        const elementFinder = value.replace(/image::/i, '');
        const elements = await Common.start(elementFinder, settings);
        if (elements === undefined || typeof elements === 'number' || elements.length === 0) {
          throw new Error('No element found with the given selector');
        }
        const data = VisionValue.getImageSrc(elements);
        value = await VisionService.imagesAnnotate(data);
        return value;
      } catch (error) {
        if (error instanceof Error) {
          return error.message;
        }
      }
      return value;
    }
    return value;
  }
}
