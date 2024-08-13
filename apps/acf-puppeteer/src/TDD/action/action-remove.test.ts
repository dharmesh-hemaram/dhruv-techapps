import { Page, WebWorker } from 'puppeteer-core';
import { TestPage, TestWorker, containsDisabledAttr, delay, getPageAndWorker } from '../../util';

let worker: WebWorker;
let page: Page;
let testPage: TestPage;

beforeAll(async () => {
  ({ page, worker, testPage } = await getPageAndWorker());
});

describe('Action Remove', () => {
  const removeAction = '[data-testid=action-remove]';
  test('default', async () => {
    const disabled = await page.$eval(removeAction, containsDisabledAttr);
    expect(disabled).toEqual(true);
  });
  test('Add Action', async () => {
    await page.click('#add-action');
    await testPage.fill('#actions tr:nth-child(1) [name=elementFinder]', 'Test1');
    await testPage.fill('#actions tr:nth-child(2) [name=elementFinder]', 'Test2');
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs[0].actions.length).toEqual(2);
    expect(configs[0].actions[0].elementFinder).toEqual('Test1');
    expect(configs[0].actions[1].elementFinder).toEqual('Test2');
  });
  describe('remove', () => {
    test('no', async () => {
      await page.click('#action-dropdown');
      await page.waitForSelector(removeAction);
      await page.click(removeAction);
      await page.waitForSelector('[data-testid=confirm-modal]');
      await page.click('[data-testid=confirm-modal-no]');
      const actions = await page.$$('#actions tbody tr');
      expect(actions.length).toEqual(2);
    });
    test('yes', async () => {
      await delay(1000);
      await page.click('#action-dropdown');
      await page.waitForSelector(removeAction);
      await page.click(removeAction);
      await page.waitForSelector('[data-testid=confirm-modal]');
      await page.click('[data-testid=confirm-modal-yes]');
      const actions = await page.$$('#actions tbody tr');
      expect(actions.length).toEqual(1);
      const configs = await worker.evaluate(TestWorker.getConfigs);
      expect(configs[0].actions.length).toEqual(1);
      expect(configs[0].actions[0].elementFinder).toEqual('Test2');
    });
  });
});
