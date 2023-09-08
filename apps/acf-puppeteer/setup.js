const { mkdir, writeFile } = require('fs').promises;
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function () {
  const pathToExtension = path.join(process.cwd(), '/dist/apps/acf-extension');
  const browser = await puppeteer.launch({
    headless: false, //"new",
    //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    //userDataDir: 'C:\\Users\\dharm\\AppData\\Local\\Google\\Chrome\\User Data',
    args: [
      '--start-maximized',
      `--disable-extensions-except=${pathToExtension}`, // Path to the extension directory
      `--load-extension=${pathToExtension}`,
      '--profile-directory=Profile 2', //Select your profle here
    ],
  });
  globalThis.__BROWSER_GLOBAL__ = browser;

  // use the file system to expose the wsEndpoint for TestEnvironments
  await mkdir(DIR, { recursive: true });
  await writeFile(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
