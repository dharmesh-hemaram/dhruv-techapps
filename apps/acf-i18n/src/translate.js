const fs = require('fs');
const translate = require('translate-google');

// Function to recursively translate the values in an object
async function translateObject(obj, targetLanguage, targetJson) {
  const translatedObject = {};

  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const targetValue = targetJson[key];

      if (typeof value === 'string') {
        if (targetValue !== undefined && targetValue !== null && targetValue !== '') {
          translatedObject[key] = targetValue;
        } else {
          const translatedValue = await translate(value, { to: targetLanguage });
          console.log(`Translating "${value}" to "${translatedValue}"`);
          translatedObject[key] = translatedValue;
        }
      } else if (typeof value === 'object') {
        translatedObject[key] = await translateObject(value, targetLanguage, targetValue);
      } else {
        translatedObject[key] = value;
      }
    }
  }

  return translatedObject;
}

// Read the JSON file
const filePath = 'locales/en/web-new.json';

fs.readFile(filePath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON data
  const englishJson = JSON.parse(data);
  for (const targetLanguage of ['zh-cn', 'fr', 'ko']) {
    const translatedFilePath = `locales/${targetLanguage}/web-new.json`;

    const data = await fs.promises.readFile(translatedFilePath, 'utf8');
    console.error('Processing', targetLanguage);
    // Parse the JSON data
    const targetJson = JSON.parse(data);

    // Translate the JSON object and log the result
    const translatedJson = await translateObject(englishJson, targetLanguage, targetJson);
    await fs.promises.writeFile(`locales/${targetLanguage}/web-new.json`, JSON.stringify(translatedJson, null, 2));
  }
});
