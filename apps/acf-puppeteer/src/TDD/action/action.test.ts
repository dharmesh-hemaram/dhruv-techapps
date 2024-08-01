import { Page, WebWorker } from 'puppeteer-core';
import { TestPage, TestWorker, containsInvalidClass, getPageAndWorker } from '../../util';

let worker: WebWorker;
let page: Page;
let testPage: TestPage;

beforeAll(async () => {
  ({ page, worker, testPage } = await getPageAndWorker());
});

describe('Action', () => {
  const actions = [
    ['initWait', 1, 'input[name=initWait]'],
    ['name', 'name', 'input[name=name]'],
    ['elementFinder', 'elementFinder', 'input[name=elementFinder]'],
    ['value', 'value', 'textarea[name=value]'],
    ['repeat', 1, 'input[name=repeat]'],
    ['repeatInterval', 1, 'input[name=repeatInterval]'],
  ];

  const elementFinderSelector = '#actions input[name=elementFinder]';
  const valueSelector = '#actions textarea[name=value]';
  const initWaitSelector = '#actions input[name=initWait]';
  const nameSelector = '#actions input[name=name]';
  const repeatSelector = '#actions input[name=repeat]';

  const repeatIntervalSelector = '#actions input[name=repeatInterval]';

  test('clear', async () => {
    await page.evaluate(() => localStorage.removeItem('columnVisibility'));
    await page.reload();
  });
  test('default', async () => {
    const configs = await worker.evaluate(TestWorker.getConfigs);
    const columnVisibility = await page.evaluate(() => localStorage.getItem('columnVisibility'));
    expect(columnVisibility).toBeNull();
    expect(configs).toBeUndefined();
  });
  test.each(['name', 'initWait', 'repeat', 'repeatInterval'])('%s Invisible', async (column) => {
    const element = await page.$(`#actions input[name=${column}]`);
    expect(element).toBeNull();
  });
  describe('columnVisibility', () => {
    test.each(['name', 'initWait', 'repeat', 'repeatInterval'])('%s Visible', async (column) => {
      await page.click('#acton-column-filter');
      await page.waitForSelector(`.show.dropdown [aria-labelledBy="acton-column-filter"] [data-column=${column}]`);
      await page.click(`.show.dropdown [aria-labelledBy="acton-column-filter"] [data-column=${column}]`);
      const columnVisibility = await page.evaluate(() => localStorage.getItem('columnVisibility'));
      expect(columnVisibility).not.toBeNull();
      const columnVisibilityJson = JSON.parse(columnVisibility);
      const element = await page.$(`#actions input[name=${column}]`);
      expect(columnVisibilityJson[column]).toBeTruthy();
      expect(element).not.toBeNull();
    });
    test.each(['name', 'initWait', 'repeat', 'repeatInterval'])('%s Invisible', async (column) => {
      await page.click('#acton-column-filter');
      await page.waitForSelector(`.show.dropdown [aria-labelledBy="acton-column-filter"] [data-column=${column}]`);
      await page.click(`.show.dropdown [aria-labelledBy="acton-column-filter"] [data-column=${column}]`);
      const columnVisibility = await page.evaluate(() => localStorage.getItem('columnVisibility'));
      expect(columnVisibility).not.toBeNull();
      const element = await page.$(`#actions input[name=${column}]`);
      const columnVisibilityJson = JSON.parse(columnVisibility);
      expect(columnVisibilityJson[column]).toBeFalsy();
      expect(element).toBeNull();
    });
  });
  test('Element Finder', async () => {
    const isInvalidBefore = await page.$eval(elementFinderSelector, containsInvalidClass);
    expect(isInvalidBefore).toBeTruthy();
    await testPage.fill(elementFinderSelector, 'TEST');
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs[0].actions[0].elementFinder).toEqual('TEST');
    const isInvalidAfter = await page.$eval(elementFinderSelector, containsInvalidClass);
    expect(isInvalidAfter).toBeFalsy();
  });
  test('Value', async () => {
    await testPage.fill(valueSelector, 'TEST');
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs[0].actions[0].value).toEqual('TEST');
  });
  describe('initWait', () => {
    test('switch initWait', async () => {
      await page.click('#acton-column-filter');
      await page.click(`.show.dropdown [aria-labelledBy="acton-column-filter"] [data-column=initWait]`);
    });
    test('-1', async () => {
      await testPage.fill(initWaitSelector, '-1');
      const isInvalid = await page.$eval(initWaitSelector, containsInvalidClass);
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(isInvalid).toBeTruthy();
      expect(configs[0].actions[0].initWait).toBeUndefined();
    });
    test('0', async () => {
      await testPage.fill(initWaitSelector, '0');
      const isInvalid = await page.$eval(initWaitSelector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].initWait).toEqual(0);
    });
    test('2', async () => {
      await testPage.fill(initWaitSelector, '2');
      const isInvalid = await page.$eval(initWaitSelector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].initWait).toEqual(2);
    });
    test('a', async () => {
      await testPage.fill(initWaitSelector, 'a');
      const isInvalid = await page.$eval(initWaitSelector, containsInvalidClass);
      expect(isInvalid).toBeTruthy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].initWait).toEqual(2);
    });
    test('0.25', async () => {
      await testPage.fill(initWaitSelector, '0.25');
      const isInvalid = await page.$eval(initWaitSelector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].initWait).toEqual(0.25);
      expect(typeof configs[0].actions[0].initWait).toEqual('number');
    });
    test('0.25e1.25', async () => {
      await testPage.fill(initWaitSelector, '0.25e1.25');
      const isInvalid = await page.$eval(initWaitSelector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].initWait).toEqual('0.25e1.25');
      expect(typeof configs[0].actions[0].initWait).toEqual('string');
    });
  });
  test('name', async () => {
    await page.click('#acton-column-filter');
    await page.click(`.show.dropdown [aria-labelledBy="acton-column-filter"] [data-column=name]`);
    await testPage.fill(nameSelector, 'TEST');
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs?.[0].actions[0].name).toEqual('TEST');
  });
  describe('repeat', () => {
    test('default', async () => {
      const configs = await worker.evaluate(TestWorker.getConfigs);
      if (configs[0].actions[0]) {
        expect(configs[0].actions[0].repeat).toBeUndefined();
      }
    });
    test('switch repeat', async () => {
      await page.click('#acton-column-filter');
      await page.click(`.show.dropdown [aria-labelledBy="acton-column-filter"] [data-column=repeat]`);
    });
    test('-2', async () => {
      await testPage.fill(repeatSelector, '-2');
      const isInvalid = await page.$eval(repeatSelector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].repeat).toEqual(-2);
    });
    test('0', async () => {
      await testPage.fill(repeatSelector, '0');
      const isInvalid = await page.$eval(repeatSelector, containsInvalidClass);
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(isInvalid).toBeFalsy();
      expect(configs[0].actions[0].repeat).toEqual(0);
    });
    test('0.25', async () => {
      await testPage.fill(repeatSelector, '0.25');
      const isInvalid = await page.$eval(repeatSelector, containsInvalidClass);
      expect(isInvalid).toBeTruthy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].repeat).toEqual(0);
    });
    test('e', async () => {
      await testPage.fill(repeatSelector, 'e');
      const isInvalid = await page.$eval(repeatSelector, containsInvalidClass);
      expect(isInvalid).toBeTruthy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].repeat).toEqual(0);
    });
    test('a', async () => {
      await testPage.fill(repeatSelector, 'a');
      const isInvalid = await page.$eval(repeatSelector, containsInvalidClass);
      expect(isInvalid).toBeTruthy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].repeat).toEqual(0);
    });
    test('1', async () => {
      await testPage.fill(repeatSelector, '1');
      const isInvalid = await page.$eval(repeatSelector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].repeat).toEqual(1);
    });
  });
  describe('repeatInterval', () => {
    test('default', async () => {
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].repeatInterval).toBeUndefined();
    });
    test('switch repeatInterval', async () => {
      await page.click('#acton-column-filter');
      await page.click(`.show.dropdown [aria-labelledBy="acton-column-filter"] [data-column=repeatInterval]`);
    });
    test('-1', async () => {
      await testPage.fill(repeatIntervalSelector, '-1');
      const isInvalid = await page.$eval(repeatIntervalSelector, containsInvalidClass);
      expect(isInvalid).toBeTruthy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].repeatInterval).toBeUndefined;
    });
    test('0', async () => {
      await testPage.fill(repeatIntervalSelector, '0');
      const isInvalid = await page.$eval(repeatIntervalSelector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].repeatInterval).toEqual(0);
    });
    test('2', async () => {
      await testPage.fill(repeatIntervalSelector, '2');
      const isInvalid = await page.$eval(repeatIntervalSelector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].repeatInterval).toEqual(2);
    });
    test('a', async () => {
      await testPage.fill(repeatIntervalSelector, 'a');
      const isInvalid = await page.$eval(repeatIntervalSelector, containsInvalidClass);
      expect(isInvalid).toBeTruthy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].repeatInterval).toEqual(2);
    });

    test('0.25', async () => {
      await testPage.fill(repeatIntervalSelector, '0.25');
      const isInvalid = await page.$eval(repeatIntervalSelector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].repeatInterval).toEqual(0.25);
      expect(typeof configs[0].actions[0].repeatInterval).toEqual('number');
    });
    test('0.25e1.25', async () => {
      await testPage.fill(repeatIntervalSelector, '0.25e1.25');
      const isInvalid = await page.$eval(repeatIntervalSelector, containsInvalidClass);
      expect(isInvalid).toBeFalsy();
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions[0].repeatInterval).toEqual('0.25e1.25');
      expect(typeof configs[0].actions[0].repeatInterval).toEqual('string');
    });
  });
  describe('Add Action', () => {
    test('trigger', async () => {
      await page.click('#add-action');
    });
    test.each(actions)('%# %p %p second', async (action, value, selector) => {
      const selectorAll = `#actions ${selector}`;
      const element = `#actions tr:nth-child(2) ${selector}`;
      const elements = await page.$$(selectorAll);
      await testPage.fill(element, String(value));
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(elements.length).toEqual(2);
      expect(configs[0].actions[1][action]).toEqual(value);
    });
  });
});
