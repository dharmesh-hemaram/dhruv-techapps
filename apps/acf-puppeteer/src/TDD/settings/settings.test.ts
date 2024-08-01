import { defaultSettings } from '@dhruv-techapps/acf-common';
import { Page, WebWorker } from 'puppeteer-core';
import { TestPage, TestWorker, containsInvalidClass, getPageAndWorker } from '../../util';

let worker: WebWorker;
let page: Page;
let testPage: TestPage;

beforeAll(async () => {
  ({ page, worker, testPage } = await getPageAndWorker());
});

describe('Settings', () => {
  const OPEN_SETTINGS = '[data-testid="open-global-settings"]';
  const SETTINGS_MODAL = '[data-testid="settings-modal"]';
  const SETTINGS_BACK_BUTTON = '[data-testid="settings-back-button"]';
  test('open', async () => {
    await page.click(OPEN_SETTINGS);
    await page.waitForSelector(SETTINGS_MODAL);
  });
  describe('checkiFrames', () => {
    const CHECK_IFRAMES = '[name=checkiFrames]';
    test('click', async () => {
      await page.click(CHECK_IFRAMES);
      const settings = await worker.evaluate(TestWorker.getSettings);
      expect(settings.checkiFrames).toBeTruthy();
    });
  });
  describe('notification', () => {
    const OPEN_NOTIFICATION = '[data-testid="settings-notification"]';
    const NOTIFICATION_CHECKBOX = ['onError', 'onAction', 'onBatch', 'onConfig', 'sound'];
    test('toggle', async () => {
      await page.click(OPEN_NOTIFICATION);
      for (const element of NOTIFICATION_CHECKBOX) {
        const checked = await page.$eval(`[name="${element}"]`, (el) => (el as HTMLInputElement).checked);
        expect(checked).toBeFalsy();
      }
    });
    test.each(NOTIFICATION_CHECKBOX)('%s', async (notification) => {
      await page.click(`[name="${notification}"]`);
      const settings = await worker.evaluate(TestWorker.getSettings);
      expect(settings.notifications).toBeDefined();
      expect(settings.notifications[notification]).toBeTruthy();
    });
    test('back', async () => {
      for (const element of NOTIFICATION_CHECKBOX) {
        const checked = await page.$eval(`[name="${element}"]`, (el) => (el as HTMLInputElement).checked);
        expect(checked).toBeTruthy();
      }
      await page.click(SETTINGS_BACK_BUTTON);
    });
  });
  describe('retry', () => {
    const OPEN_RETRY = '[data-testid="settings-retry"]';
    const selector = 'input[name=retry]';
    test('toggle', async () => {
      await page.click(OPEN_RETRY);
      const settings = await worker.evaluate(TestWorker.getSettings);
      expect(settings.retry).toEqual(defaultSettings.retry);
      expect(settings.retryInterval).toEqual(defaultSettings.retryInterval);
      expect(settings.retryOption).toEqual(defaultSettings.retryOption);
    });
    describe('retry', () => {
      test('default', async () => {
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retry).toEqual(defaultSettings.retry);
      });
      test('-2', async () => {
        await testPage.fill(selector, '-2');
        const isInvalid = await page.$eval(selector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retry).toEqual(-2);
      });
      test('0', async () => {
        await testPage.fill(selector, '0');
        const isInvalid = await page.$eval(selector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retry).toEqual(0);
      });
      test('0.25', async () => {
        await testPage.fill(selector, '0.25');
        const isInvalid = await page.$eval(selector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retry).toEqual(0);
      });
      test('e', async () => {
        await testPage.fill(selector, 'e');
        const isInvalid = await page.$eval(selector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retry).toEqual(0);
      });
      test('a', async () => {
        await testPage.fill(selector, 'a');
        const isInvalid = await page.$eval(selector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retry).toEqual(0);
      });
      test('1', async () => {
        await testPage.fill(selector, '1');
        const isInvalid = await page.$eval(selector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retry).toEqual(1);
      });
    });
    describe('retryInterval', () => {
      const selector = 'input[id=retryInterval]';
      test('default', async () => {
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retryInterval).toEqual(defaultSettings.retryInterval);
      });
      test('-1', async () => {
        await testPage.fill(selector, '-1');
        const isInvalid = await page.$eval(selector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retryInterval).toEqual(defaultSettings.retryInterval);
      });
      test('0', async () => {
        await testPage.fill(selector, '0');
        const isInvalid = await page.$eval(selector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retryInterval).toEqual(0);
      });
      test('2', async () => {
        await testPage.fill(selector, '2');
        const isInvalid = await page.$eval(selector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retryInterval).toEqual(2);
      });
      test('a', async () => {
        await testPage.fill(selector, 'a');
        const isInvalid = await page.$eval(selector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retryInterval).toEqual(2);
      });

      test('0.25', async () => {
        await testPage.fill(selector, '0.25');
        const isInvalid = await page.$eval(selector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retryInterval).toEqual(0.25);
        expect(typeof settings.retryInterval).toEqual('number');
      });
      test('0.25e1.25', async () => {
        await testPage.fill(selector, '0.25e1.25');
        const isInvalid = await page.$eval(selector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retryInterval).toEqual('0.25e1.25');
        expect(typeof settings.retryInterval).toEqual('string');
      });
    });
    describe('retryOption', () => {
      const retryOptions = ['stop', 'skip', 'reload'];
      test('default', async () => {
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retryOption).toEqual(defaultSettings.retryOption);
      });
      test.each(retryOptions)('%s', async (retryOption) => {
        await page.click(`input[name=retryOption][value=${retryOption}]`);
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.retryOption).toEqual(retryOption);
      });
    });
    test('back', async () => {
      await page.click(SETTINGS_BACK_BUTTON);
    });
  });
  describe('backup', () => {
    const OPEN_BACKUP = '[data-testid="settings-backup"]';
    test('toggle', async () => {
      await page.click(OPEN_BACKUP);
    });
    /*test.each(Object.values(AUTO_BACKUP))('%s', async (autoBackup) => {
        await page.click(`a[href="#backup-${autoBackup}"]`);
        const settings = await worker.evaluate(TestWorker.getSettings);
        expect(settings.backup.autoBackup).toEqual(autoBackup);
      });*/
    test('toggle', async () => {
      await page.click(SETTINGS_BACK_BUTTON);
    });
  });
  test('close', async () => {
    await page.click('[role=dialog] .btn-close');
  });
});
