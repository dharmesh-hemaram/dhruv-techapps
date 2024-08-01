import { Page } from 'puppeteer-core';
import { TestPage, getPageAndWorker } from '../util';

let page: Page;
let testPage: TestPage;

beforeAll(async () => {
  ({ page, testPage } = await getPageAndWorker());
});

describe('Simple', () => {
  test('basic', async () => {
    await testPage.fill('input[name=url]', 'https://test.getautoclicker.com/');
    await testPage.fill('input[name=elementFinder]', '//input[@name="username"]');
    await testPage.fill('textarea[name=value]', 'Dharmesh');
    await page.goto('https://test.getautoclicker.com/');
    const text = await page.$eval('input[name=username]', (el) => el.value);
    expect(text).toEqual('Dharmesh');
  }, 10000);

  test('init wait', async () => {
    await page.goto('http://localhost:3000/');
    await testPage.fill('input[name=initWait]', '5');
    await page.goto('https://test.getautoclicker.com/');
    let text = await page.$eval('input[name=username]', (el) => el.value);
    expect(text).toEqual('');
    await new Promise((r) => setTimeout(r, 5000));
    text = await page.$eval('input[name=username]', (el) => el.value);
    expect(text).toEqual('Dharmesh');
  }, 10000);

  test('enable/disable', async () => {
    await page.goto('http://localhost:3000/');
    await testPage.fill('input[name=initWait]', '0');
    await page.click('input[name=enable]');
    await page.goto('https://test.getautoclicker.com/');
    const text = await page.$eval('input[name=username]', (el) => el.value);
    expect(text).not.toEqual('Dharmesh');
  }, 10000);

  describe('url match', () => {
    test('regex', async () => {
      await page.goto('http://localhost:3000/');
      await page.click('input[name=enable]');
      await page.goto('https://test.getautoclicker.com/');
      const text = await page.$eval('input[name=username]', (el) => el.value);
      expect(text).toEqual('Dharmesh');
    });

    test('exact', async () => {
      await page.goto('http://localhost:3000/');
      await page.click('[data-testid=configuration-settings]');
      await page.waitForSelector('[role=dialog');
      await testPage.fill('select[name=url_match]', 'exact');
      await page.goto('https://test.getautoclicker.com/');
      let text = await page.$eval('input[name=username]', (el) => el.value);
      expect(text).toEqual('Dharmesh');
      await page.goto('https://test.getautoclicker.com/?acf-session-count=3');
      text = await page.$eval('input[name=username]', (el) => el.value);
      expect(text).not.toEqual('Dharmesh');
    });
  });
});
