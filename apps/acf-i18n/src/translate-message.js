import { TranslateCommon } from './translate.common';

class TranslateMessage extends TranslateCommon {
  constructor() {
    super('messages.json');
  }

  // Function to recursively translate the values in an object
  translateObject = async (obj, targetLanguage, targetJson) => {
    const translatedObject = {};

    for (const key in obj) {
      const value = obj[key];
      const targetValue = targetJson?.[key];
      if (typeof value === 'string' && key === 'message') {
        translatedObject[key] = await this.translateStringValue(value, targetValue, targetLanguage);
      } else if (typeof value === 'object') {
        translatedObject[key] = await this.translateObject(value, targetLanguage, targetValue);
      }
    }

    return translatedObject;
  };
}

new TranslateMessage().start();
