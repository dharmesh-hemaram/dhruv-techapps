import { Page, WebWorker } from 'puppeteer-core';
import { TestPage, TestWorker, delay, getPageAndWorker } from '../../util';

const config1 = {
  url: 'https://developer.mozilla.org/',
  name: 'mozilla.org',
};

const config2 = {
  url: 'https://test.getautoclicker.com/',
  name: 'getautoclicker.com',
};

let worker: WebWorker;
let page: Page;
let testPage: TestPage;

beforeAll(async () => {
  ({ page, worker, testPage } = await getPageAndWorker());
});

const CONFIGURATION_LIST = 'ul[data-testid=configuration-list]';

describe('Configurations', () => {
  test('No Configs', async () => {
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs).toBeUndefined();
  });
  test('updated Config 1', async () => {
    const selector = 'input[name=url]';
    await testPage.fill(selector, config1.url);
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs.length).toEqual(1);
    expect(configs[0].url).toEqual(config1.url);
    expect(configs[0].name).toEqual(config1.name);
  });

  test('Add Configuration', async () => {
    const beforeOptionsLength = await page.$eval(CONFIGURATION_LIST, (e) => (e as HTMLUListElement).querySelectorAll('li').length);
    await page.click('[data-testid=add-configuration]');
    //Frontend
    const optionsLength = await page.$eval(CONFIGURATION_LIST, (e) => (e as HTMLUListElement).querySelectorAll('li').length);
    const selected = await page.$eval(CONFIGURATION_LIST, (e) => (e as HTMLUListElement).querySelector('li.selected').getAttribute('data-index'));
    expect(optionsLength).toEqual(beforeOptionsLength + 1);
    expect(selected).toEqual('0');
    //Backend
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs.length).toEqual(1);
  });

  const URL_SELECTOR = 'input[name=url]';
  const NAME_SELECTOR = 'input[name=name]';
  const CONFIGS_MORE_OPTIONS = '[data-testid="configurations-more-option"]';

  test('updated Config 2', async () => {
    await testPage.fill(URL_SELECTOR, config2.url);
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs.length).toEqual(2);
    expect(configs[0].url).toEqual(config2.url);
    expect(configs[0].name).toEqual(config2.name);
  });

  test('beforeSwitch', async () => {
    const url = await page.$eval(URL_SELECTOR, (el) => el.value);
    const name = await page.$eval(NAME_SELECTOR, (el) => el.value);
    expect(url).toEqual(config2.url);
    expect(name).toEqual(config2.name);
  });

  test('switch Config', async () => {
    await page.click(CONFIGURATION_LIST + ' li:nth-child(2)');
    const afterSelected = await page.$eval(CONFIGURATION_LIST, (e) => (e as HTMLUListElement).querySelector('li.selected').getAttribute('data-index'));
    expect(afterSelected).toEqual('1');
  });

  test('afterSwitch', async () => {
    const url = await page.$eval(URL_SELECTOR, (el) => el.value);
    const name = await page.$eval(NAME_SELECTOR, (el) => el.value);
    expect(url).toEqual(config1.url);
    expect(name).toEqual(config1.name);
  });

  describe('Bulk Reorder Configuration', () => {
    const REORDER_CONFIGS = '#reorder-configs';
    test('open', async () => {
      await page.click(CONFIGS_MORE_OPTIONS);
      await page.click('[data-testid="configurations-reorder-config"]');
      const modal = await page.$(REORDER_CONFIGS);
      expect(modal).not.toBeNull();
    });
    test('check No of configs', async () => {
      const configs = await page.$eval(REORDER_CONFIGS, (e) => e.querySelectorAll('.list-group-item').length);
      expect(configs).toBeDefined();
      expect(configs).toEqual(2);
    });
    test('close', async () => {
      await page.click('[data-testid="configurations-reorder-close"]');
      await delay(1000);
      const modal = await page.$(REORDER_CONFIGS);
      expect(modal).toBeNull();
    });
  });

  describe('Bulk Remove Configuration', () => {
    const REMOVE_CONFIGS = '#remove-configs';
    test('open', async () => {
      await page.click(CONFIGS_MORE_OPTIONS);
      await page.click('[data-testid="configurations-remove-config"]');
      const modal = await page.$(REMOVE_CONFIGS);
      expect(modal).not.toBeNull();
    });
    describe('select', () => {
      test('check No of configs', async () => {
        const configs = await page.$eval(REMOVE_CONFIGS, (e) => e.querySelectorAll('.list-group-item').length);
        expect(configs).toBeDefined();
        expect(configs).toEqual(2);
      });
      test('remove config', async () => {
        await page.click('.list-group-item input');
        await page.click('[data-testid="configurations-remove-save"]');
        await delay(1000);
        const modal = await page.$(REMOVE_CONFIGS);
        const configs = await worker.evaluate(TestWorker.getConfigs);
        const optionsLength = await page.$eval(CONFIGURATION_LIST, (e) => (e as HTMLUListElement).querySelectorAll('li').length);
        expect(modal).toBeNull();
        expect(configs.length).toEqual(1);
        expect(optionsLength).toEqual(1);
      });
    });
  });
});
