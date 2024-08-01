/// <reference types="chrome"/>

import { Configuration, Settings } from '@dhruv-techapps/acf-common';
import { Browser, Page, WebWorker } from 'puppeteer-core';

type Util = {
  page: Page;
  testPage: TestPage;
  worker: WebWorker;
  browser: Browser;
};

export const getPageAndWorker = async (url?: string): Promise<Util> => {
  await delay(1000);
  const browser: Browser = globalThis.__BROWSER_GLOBAL__.browser;
  const pages: Array<Page> = await browser.pages();
  const page: Page = pages.find((page) => {
    return page.url() === (url || 'http://localhost:3000/');
  });
  page.setViewport({ width: 1920, height: 955 });
  await page.waitForNetworkIdle();
  const worker: WebWorker = globalThis.__BROWSER_GLOBAL__.worker;
  await worker.evaluate(async () => await chrome.storage.local.clear());
  const testPage = new TestPage(page);
  return { page, worker, testPage, browser };
};

export class TestPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  fill = async (querySelector, value) => {
    await this.page.click(querySelector, { clickCount: 3 });
    await this.page.type(querySelector, value);
    await this.page.$eval(querySelector, (e) => e.blur());
  };
}

export class TestWorker {
  static getSettings = async (): Promise<Settings> => {
    const result = await chrome.storage.local.get('settings');
    return result.settings;
  };
  static getConfigs = async (): Promise<Array<Configuration>> => {
    const result = await chrome.storage.local.get('configs');
    return result.configs;
  };
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const containsInvalidClass = (e) => e.classList.contains('is-invalid');
export const containsDisabledClass = (e) => e.classList.contains('disabled');
export const containsDisabledAttr = (e) => e.disabled;
