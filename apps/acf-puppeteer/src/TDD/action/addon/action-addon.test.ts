import { RECHECK_OPTIONS } from '@dhruv-techapps/acf-common';
import { Page, WebWorker } from 'puppeteer-core';
import { TestPage, TestWorker, containsInvalidClass, delay, getPageAndWorker } from '../../../util';

let worker: WebWorker;
let page: Page;
let testPage: TestPage;

beforeAll(async () => {
  ({ page, worker, testPage } = await getPageAndWorker());
});

describe('Action Addon', () => {
  const addonAction = '.show.dropdown [data-testid=action-addon]';
  const elementFinderSelector = '#actions input[name=elementFinder]';
  test('default', async () => {
    const addonButton = await page.$('#action-dropdown');
    expect(addonButton).toBeNull();
  });
  test('update elementFinder', async () => {
    await testPage.fill(elementFinderSelector, 'Test');
    await page.click('#action-dropdown');
    await page.waitForSelector(addonAction);
    const addonButton = await page.$(addonAction);
    expect(addonButton).not.toBeNull();
  });
  test('open', async () => {
    await page.click(addonAction);
    await page.waitForSelector('[data-testid="addon-modal"]');
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs[0].actions[0].addon).toBeUndefined();
    const recheck = await page.$eval('#addon [data-testid=addon-recheck]', (e) => e.getAttribute('hidden'));
    expect(recheck).toBeDefined();
  });
  test('Form Mandatory', async () => {
    await testPage.fill('#addon [name=elementFinder]', 'ElementFinder');
    await page.select('#addon [name=condition]', 'Equals');
    await testPage.fill('#addon [name=value]', 'Value');
    await page.click('[data-testid=action-addon-save]');
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs[0].actions[0].addon).toBeDefined();
    expect(configs[0].actions[0].addon.elementFinder).toEqual('ElementFinder');
    expect(configs[0].actions[0].addon.condition).toEqual('Equals');
    expect(configs[0].actions[0].addon.value).toEqual('Value');
  });
  test('Form Optional', async () => {
    const valueExtractorFlagsSElector = '[id="value-extractor-flags"]';
    const valueExtractorFlagsBefore = await page.$(valueExtractorFlagsSElector);
    expect(valueExtractorFlagsBefore).toBeNull();
    await testPage.fill('#addon [name=valueExtractor]', 'Value Extractor');
    await page.waitForSelector(valueExtractorFlagsSElector);
    await page.click(valueExtractorFlagsSElector);
    await page.click('[data-flag=g]');
    await page.click(valueExtractorFlagsSElector);
    await page.click('[data-flag=m]');
    await page.click('[data-testid=action-addon-save]');
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs[0].actions[0].addon).toBeDefined();
    expect(configs[0].actions[0].addon.valueExtractor).toEqual('Value Extractor');
    expect(configs[0].actions[0].addon.valueExtractorFlags).toEqual('gm');
  });
  describe('Form Recheck', () => {
    const recheckSelector = '#addon [name=recheck]';
    const recheckIntervalSelector = '#addon [name=recheckInterval]';
    const recheckOptionsSelector = '#addon [name=recheckOptions]';
    describe('recheck', () => {
      test('-2', async () => {
        await testPage.fill(recheckSelector, '-2');
        await page.click('[data-testid=action-addon-save]');
        const isInvalid = await page.$eval(recheckSelector, containsInvalidClass);
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(isInvalid).toBeFalsy();
        expect(configs[0].actions[0].addon.recheck).toEqual(-2);
      });
      test('0', async () => {
        await testPage.fill(recheckSelector, '0');
        await page.click('[data-testid=action-addon-save]');
        const isInvalid = await page.$eval(recheckSelector, containsInvalidClass);
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(isInvalid).toBeFalsy();
        expect(configs[0].actions[0].addon.recheck).toEqual(0);
      });
      test('0.25', async () => {
        await testPage.fill(recheckSelector, '0.25');
        await page.click('[data-testid=action-addon-save]');
        const isInvalid = await page.$eval(recheckSelector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].addon.recheck).toEqual(0);
      });
      test('e', async () => {
        await testPage.fill(recheckSelector, 'e');
        await page.click('[data-testid=action-addon-save]');
        const isInvalid = await page.$eval(recheckSelector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].addon.recheck).toEqual(0);
      });
      test('a', async () => {
        await testPage.fill(recheckSelector, 'a');
        await page.click('[data-testid=action-addon-save]');
        const isInvalid = await page.$eval(recheckSelector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].addon.recheck).toEqual(0);
      });
      test('1', async () => {
        await testPage.fill(recheckSelector, '1');
        await page.click('[data-testid=action-addon-save]');
        const isInvalid = await page.$eval(recheckSelector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].addon.recheck).toEqual(1);
      });
    });
    describe('recheckInterval', () => {
      test('-1', async () => {
        await testPage.fill(recheckIntervalSelector, '-1');
        await page.click('[data-testid=action-addon-save]');
        const isInvalid = await page.$eval(recheckIntervalSelector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].addon.recheckInterval).toBeUndefined;
      });
      test('0', async () => {
        await testPage.fill(recheckIntervalSelector, '0');
        await page.click('[data-testid=action-addon-save]');
        const isInvalid = await page.$eval(recheckIntervalSelector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].addon.recheckInterval).toEqual(0);
      });
      test('2', async () => {
        await testPage.fill(recheckIntervalSelector, '2');
        await page.click('[data-testid=action-addon-save]');
        const isInvalid = await page.$eval(recheckIntervalSelector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].addon.recheckInterval).toEqual(2);
      });
      test('a', async () => {
        await testPage.fill(recheckIntervalSelector, 'a');
        await page.click('[data-testid=action-addon-save]');
        const isInvalid = await page.$eval(recheckIntervalSelector, containsInvalidClass);
        expect(isInvalid).toBeTruthy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].addon.recheckInterval).toEqual(2);
      });

      test('0.25', async () => {
        await testPage.fill(recheckIntervalSelector, '0.25');
        await page.click('[data-testid=action-addon-save]');
        const isInvalid = await page.$eval(recheckIntervalSelector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].addon.recheckInterval).toEqual(0.25);
        expect(typeof configs[0].actions[0].addon.recheckInterval).toEqual('number');
      });
      test('0.25e1.25', async () => {
        await testPage.fill(recheckIntervalSelector, '0.25e1.25');
        await page.click('[data-testid=action-addon-save]');
        const isInvalid = await page.$eval(recheckIntervalSelector, containsInvalidClass);
        expect(isInvalid).toBeFalsy();
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].addon.recheckInterval).toEqual('0.25e1.25');
        expect(typeof configs[0].actions[0].addon.recheckInterval).toEqual('string');
      });
    });
    describe('retryOption', () => {
      const retryOptions = ['stop', 'skip', 'reload'];
      test('default', async () => {
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].addon.recheckOption).toEqual(RECHECK_OPTIONS.SKIP);
      });
      test.each(retryOptions)('%s', async (retryOption) => {
        await page.click(`#addon [name=recheckOption][value=${retryOption}]`);
        await page.click('[data-testid=action-addon-save]');
        const configs = await worker.evaluate(TestWorker.getConfigs);
        expect(configs[0].actions[0].addon.recheckOption).toEqual(retryOption);
      });
    });
  });
  test('clear', async () => {
    await page.click('[data-testid=action-addon-reset]');
    await delay(1000);
    const modal = await page.$('[data-testid="addon-modal"]');
    expect(modal).toBeNull();
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs[0].actions[0].addon).toBeUndefined();
  });
});
