import { ActionSettings } from '@dhruv-techapps/acf-common';
import { Value } from '@dhruv-techapps/acf-util';
import { GoogleSheetsValue } from '@dhruv-techapps/google-sheets';
import { SandboxValue } from '@dhruv-techapps/sandbox';
import { VisionService, VisionValue } from '@dhruv-techapps/vision';
import { OpenAIService } from '@dhruv.techapps/openai';
import Common from '../common';
import { I18N_ERROR } from '../i18n';

export const VALUE_MATCHER = {
  GOOGLE_SHEETS: /^GoogleSheets::/i,
  FUNC: /^Func::/i,
  IMAGE: /^Image::/i,
  OPENAI: /^OpenAI::/i,
};

export class ACFValue {
  static async getValue(value: string, settings?: ActionSettings): Promise<string> {
    value = await Value.getValue(value);
    if (VALUE_MATCHER.GOOGLE_SHEETS.test(value)) {
      return this.getGoogleSheetsValue(value);
    }
    if (VALUE_MATCHER.FUNC.test(value)) {
      return this.getFuncValue(value);
    }
    if (VALUE_MATCHER.OPENAI.test(value)) {
      return this.getOpenAIValue(value);
    }
    if (VALUE_MATCHER.IMAGE.test(value)) {
      return this.getImageValue(value, settings);
    }
    return value;
  }

  private static getGoogleSheetsValue(value: string): string {
    return GoogleSheetsValue.getSheetValue(value);
  }

  private static async getFuncValue(value: string): Promise<string> {
    return await SandboxValue.getFuncValue(value);
  }

  private static async getOpenAIValue(value: string): Promise<string> {
    try {
      const prompt = value.replace(/openai::/i, '');
      const message = await OpenAIService.generateText({ content: prompt });
      return message;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
    }
    return value;
  }

  private static async getImageValue(value: string, settings?: ActionSettings): Promise<string> {
    try {
      const elementFinder = value.replace(/image::/i, '');
      const elements = await Common.start(elementFinder, settings);
      if (elements === undefined || typeof elements === 'number' || elements.length === 0) {
        throw new Error(I18N_ERROR.NO_ELEMENT_FOUND);
      }
      const data = VisionValue.getImageSrc(elements);
      return await VisionService.imagesAnnotate(data);
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
    }
    return value;
  }
}
