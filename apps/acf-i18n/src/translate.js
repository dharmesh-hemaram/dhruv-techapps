const translate = require('translate-google');
const fs = require('fs');

async function translateJson() {
  // Read the JSON file
  const data = await fs.promises.readFile('locales/en/web-new.json', 'utf8');
  const en = JSON.parse(data);

  ['fr'].forEach(async (lang) => {
    translate(en, { to: lang })
      .then(async (res) => {
        // Write the translated JSON back to the file
        const translatedData = JSON.stringify(res, null, 2);
        await fs.promises.writeFile(`locales/${lang}/web-new.json`, translatedData);
        //F:\code\auto-clicker-auto-fill\apps\acf-i18n\src\locales\en\web-new.json
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

translateJson().catch(console.error);
