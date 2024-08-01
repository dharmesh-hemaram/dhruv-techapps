import { Page, WebWorker } from 'puppeteer-core';
import { TestPage, TestWorker, containsInvalidClass, delay, getPageAndWorker } from '../../../util';

let worker: WebWorker;
let page: Page;
let testPage: TestPage;

beforeAll(async () => {
  ({ page, worker, testPage } = await getPageAndWorker());
});

describe('Action Settings', () => {
  const actionSettings = '.show.dropdown [data-testid=action-settings]';
  const elementFinderSelector = '#actions input[name=elementFinder]';
  test('default', async () => {
    const actionSettingsButton = await page.$('#action-dropdown');
    expect(actionSettingsButton).toBeNull();
  });
  test('update elementFinder', async () => {
    await testPage.fill(elementFinderSelector, 'Test');
    await page.click('#action-dropdown');
    await page.waitForSelector(actionSettings);
    const actionSettingsButton = await page.$(actionSettings);
    expect(actionSettingsButton).not.toBeNull();
  });
  test('open', async () => {
    await page.click(actionSettings);
    await page.waitForSelector('[data-testid="action-settings-modal"]');
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs[0].actions[0].settings).toBeUndefined();
  });
  test('iFrameFirst', async () => {
    await page.click('#action-settings [name=iframeFirst]');
    await page.click('[data-testid=action-settings-save]');
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs[0].actions[0].settings).toBeDefined();
    expect(configs[0].actions[0].settings.iframeFirst).toBeTruthy();
  });

  describe('Retry', () => {
    const retrySelector = '#action-settings [name=retry]';
    const retryIntervalSelector = '#action-settings [name=retryInterval]';
    describe('retry', () => {
      test('-2', async () => {
        await testPage.fill(retrySelector, '-2');
        await page.click('[data-testid=action-settings-save]');
        const isInvalid = await page.$eval(retrySelector, containsInvalidClass);
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(isInvalid).toBeFalsy();
        expect(configs[0].actions[0].settings.retry).toEqual(-2);
      });
      test('0', async () => {
        await testPage.fill(retrySelector, '0');
        await page.click('[data-testid=action-settings-save]');
        const isInvalid = await page.$eval(retrySelector, containsInvalidClass);
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(isInvalid).toBeFalsy();
        expect(configs[0].actions[0].settings.retry).toEqual(0);
      });
      test('0.25', async () => {
        await testPage.fill(retrySelector, '0.25');
        await page.click('[data-testid=action-settings-save]');
        const isInvalid = await page.$eval(retrySelector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].settings.retry).toEqual(0);
      });
      test('e', async () => {
        await testPage.fill(retrySelector, 'e');
        await page.click('[data-testid=action-settings-save]');
        const isInvalid = await page.$eval(retrySelector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].settings.retry).toEqual(0);
      });
      test('a', async () => {
        await testPage.fill(retrySelector, 'a');
        await page.click('[data-testid=action-settings-save]');
        const isInvalid = await page.$eval(retrySelector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].settings.retry).toEqual(0);
      });
      test('1', async () => {
        await testPage.fill(retrySelector, '1');
        await page.click('[data-testid=action-settings-save]');
        const isInvalid = await page.$eval(retrySelector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].settings.retry).toEqual(1);
      });
    });
    describe('recheckInterval', () => {
      test('-1', async () => {
        await testPage.fill(retryIntervalSelector, '-1');
        await page.click('[data-testid=action-settings-save]');
        const isInvalid = await page.$eval(retryIntervalSelector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].settings.retryInterval).toBeUndefined;
      });
      test('0', async () => {
        await testPage.fill(retryIntervalSelector, '0');
        await page.click('[data-testid=action-settings-save]');
        const isInvalid = await page.$eval(retryIntervalSelector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].settings.retryInterval).toEqual(0);
      });
      test('2', async () => {
        await testPage.fill(retryIntervalSelector, '2');
        await page.click('[data-testid=action-settings-save]');
        const isInvalid = await page.$eval(retryIntervalSelector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].settings.retryInterval).toEqual(2);
      });
      test('a', async () => {
        await testPage.fill(retryIntervalSelector, 'a');
        await page.click('[data-testid=action-settings-save]');
        const isInvalid = await page.$eval(retryIntervalSelector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].settings.retryInterval).toEqual(2);
      });

      test('0.25', async () => {
        await testPage.fill(retryIntervalSelector, '0.25');
        await page.click('[data-testid=action-settings-save]');
        const isInvalid = await page.$eval(retryIntervalSelector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].settings.retryInterval).toEqual(0.25);
        expect(typeof configs[0].actions[0].settings.retryInterval).toEqual('number');
      });
      test('0.25e1.25', async () => {
        await testPage.fill(retryIntervalSelector, '0.25e1.25');
        await page.click('[data-testid=action-settings-save]');
        const isInvalid = await page.$eval(retryIntervalSelector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].settings.retryInterval).toEqual('0.25e1.25');
        expect(typeof configs[0].actions[0].settings.retryInterval).toEqual('string');
      });
    });
    describe('retryOption', () => {
      const retryOptions = ['stop', 'skip', 'reload'];
      test('default', async () => {
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].settings.retryOption).toBeUndefined();
      });
      test.each(retryOptions)('%s', async (retryOption) => {
        await page.click(`#action-settings [name=retryOption][value=${retryOption}]`);
        await page.click('[data-testid=action-settings-save]');
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].settings.retryOption).toEqual(retryOption);
      });
    });
  });
  test('clear', async () => {
    await page.click('[data-testid=action-settings-reset]');
    await delay(1000);
    const modal = await page.$('[data-testid="settings-modal"]');
    expect(modal).toBeNull();
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs[0].actions[0].settings).toBeUndefined();
  });
});
