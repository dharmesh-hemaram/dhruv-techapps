const { readFile } = require('fs').promises;
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer-core');
const NodeEnvironment = require('jest-environment-node').default;

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

class PuppeteerEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    // get the wsEndpoint
    const wsEndpoint = await readFile(path.join(DIR, 'wsEndpoint'), 'utf8');
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    }

    const browser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint });
    const backgroundPageTarget = await browser.waitForTarget((target) => target.type() === 'service_worker' && target.url().endsWith('background.js'));
    const worker = await backgroundPageTarget.worker();
    await worker.evaluate(async () => {
      await chrome.storage.local.clear();
    });

    // connect to puppeteer
    this.global.__BROWSER_GLOBAL__ = { browser, worker };
  }

  async teardown() {
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

module.exports = PuppeteerEnvironment;
