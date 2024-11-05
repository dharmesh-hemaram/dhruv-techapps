import { Translate } from '@google-cloud/translate';
import fs from 'fs';
import { LANGUAGES } from './translate.constant';

class TranslateCommon {
  file = '${file}';
  translate = null;
  constructor(file) {
    // Creates a client
    // Creates a client
    this.translate = new Translate();
    this.file = file;
  }
  // Function to remove extra properties from obj2 that are not in obj1

  translateObject = async () => {
    return new Error();
  };

  translateStringValue = async (value, targetValue, targetLanguage) => {
    if (targetValue) {
      return targetValue;
    } else {
      value = value.replaceAll(/(\$\d+)/g, '{{$1}}');
      let [translatedValue] = await this.translate.translate(value, { from: 'en', to: targetLanguage });
      console.log(`Translating "${value}" to "${translatedValue}"`);
      return translatedValue.replaceAll(/{{(\$\d+)}}/g, '$1');
    }
  };

  removeExtraProperties = (obj1, obj2) => {
    Object.keys(obj2).forEach((key) => {
      if (!Object.hasOwn(obj1, key)) {
        delete obj2[key];
      } else if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
        this.removeExtraProperties(obj1[key], obj2[key]);
      }
    });
  };

  start = async () => {
    // Read the JSON file
    const filePath = `locales/en/${this.file}`;
    const englishJson = await fs.promises.readFile(filePath, 'utf8');

    for (const { lang, folder } of LANGUAGES) {
      console.error('------------- Processing :: ', folder, lang);
      const translatedFilePath = `locales/${folder}/${this.file}`;

      const targetJson = await fs.promises.readFile(translatedFilePath, 'utf8').catch(() => {
        fs.promises.mkdir(`locales/${folder}`, { recursive: true });
      });
      // Translate the JSON object and log the result
      const translatedJson = await this.translateObject(JSON.parse(englishJson), lang, JSON.parse(targetJson || '{}'));
      await fs.promises.writeFile(`locales/${folder}/${this.file}`, JSON.stringify(translatedJson, null, 2));
    }
  };
}

module.exports = {
  TranslateCommon,
};
