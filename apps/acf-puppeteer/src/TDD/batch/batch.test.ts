import { Page, WebWorker } from 'puppeteer-core';
import { TestPage, TestWorker, containsInvalidClass, getPageAndWorker } from '../../util';

let worker: WebWorker;
let page: Page;
let testPage: TestPage;

beforeAll(async () => {
  ({ page, worker, testPage } = await getPageAndWorker());
});

describe('Batch', () => {
  test('default', async () => {
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs).toBeUndefined();
  });
  test('expand', async () => {
    const beforeExpand = await page.$eval('[aria-label=batch] .accordion-collapse', (e) => e.classList.contains('show'));
    expect(beforeExpand).toBeFalsy();
    await page.click('[aria-label=batch] button');
    await page.waitForSelector('[aria-label=batch] .accordion-collapse.show');
  });
  describe('repeat', () => {
    const repeatSelector = 'input[name=repeat]';
    test('default', async () => {
      const configs = await worker.evaluate(TestWorker.getConfigs);
      if (configs?.[0].batch) {
        expect(configs?.[0].batch.repeat).toBeUndefined();
      }
    });
    test('-2', async () => {
      await testPage.fill(repeatSelector, '-2');
      const isInvalid = await page.$eval(repeatSelector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].batch.repeat).toEqual(-2);
    });
    test('0', async () => {
      await testPage.fill(repeatSelector, '0');
      const isInvalid = await page.$eval(repeatSelector, containsInvalidClass);
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(isInvalid).toBeFalsy();
      expect(configs[0].batch.repeat).toEqual(0);
    });
    test('0.25', async () => {
      await testPage.fill(repeatSelector, '0.25');
      const isInvalid = await page.$eval(repeatSelector, containsInvalidClass);
      expect(isInvalid).toBeTruthy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].batch.repeat).toEqual(0);
    });
    test('e', async () => {
      await testPage.fill(repeatSelector, 'e');
      const isInvalid = await page.$eval(repeatSelector, containsInvalidClass);
      expect(isInvalid).toBeTruthy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].batch.repeat).toEqual(0);
    });
    test('a', async () => {
      await testPage.fill(repeatSelector, 'a');
      const isInvalid = await page.$eval(repeatSelector, containsInvalidClass);
      expect(isInvalid).toBeTruthy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].batch.repeat).toEqual(0);
    });
    test('1', async () => {
      await testPage.fill(repeatSelector, '1');
      const isInvalid = await page.$eval(repeatSelector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].batch.repeat).toEqual(1);
    });
  });
  describe('repeatInterval', () => {
    const selector = 'input[name=repeatInterval]';
    test('default', async () => {
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].batch.repeatInterval).toBeUndefined();
    });
    test('-1', async () => {
      await testPage.fill(selector, '-1');
      const isInvalid = await page.$eval(selector, containsInvalidClass);
      expect(isInvalid).toBeTruthy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].batch.repeatInterval).toBeUndefined;
    });
    test('0', async () => {
      await testPage.fill(selector, '0');
      const isInvalid = await page.$eval(selector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].batch.repeatInterval).toEqual(0);
    });
    test('2', async () => {
      await testPage.fill(selector, '2');
      const isInvalid = await page.$eval(selector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].batch.repeatInterval).toEqual(2);
    });
    test('a', async () => {
      await testPage.fill(selector, 'a');
      const isInvalid = await page.$eval(selector, containsInvalidClass);
      expect(isInvalid).toBeTruthy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].batch.repeatInterval).toEqual(2);
    });

    test('0.25', async () => {
      await testPage.fill(selector, '0.25');
      const isInvalid = await page.$eval(selector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].batch.repeatInterval).toEqual(0.25);
      expect(typeof configs[0].batch.repeatInterval).toEqual('number');
    });
    test('0.25e1.25', async () => {
      await testPage.fill(selector, '0.25e1.25');
      const isInvalid = await page.$eval(selector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].batch.repeatInterval).toEqual('0.25e1.25');
      expect(typeof configs[0].batch.repeatInterval).toEqual('string');
    });
  });
  describe('Refresh', () => {
    const selector = 'input[name=refresh]';
    test('on', async () => {
      await page.click(selector);
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].batch.refresh).toBeTruthy();
    });
    test('off', async () => {
      await page.click(selector);
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].batch.refresh).toBeFalsy();
    });
  });
});
