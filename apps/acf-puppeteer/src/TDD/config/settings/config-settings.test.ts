import { LOAD_TYPES, START_TYPES, getDefaultConfig } from '@dhruv-techapps/acf-common';
import { Page, WebWorker } from 'puppeteer-core';
import { TestPage, TestWorker, delay, getPageAndWorker } from '../../../util';

let worker: WebWorker;
let page: Page;
let testPage: TestPage;

beforeAll(async () => {
  ({ page, worker, testPage } = await getPageAndWorker());
});

const defaultConfig = getDefaultConfig();
describe('Config:Settings', () => {
  test('open', async () => {
    await page.click('[data-testid=configuration-settings]');
    await page.waitForSelector('[data-testid="config-settings-modal"]');
    const startType = await page.$eval('input[name=startType]:checked', (e) => e.value);
    const loadType = await page.$eval('input[name=loadType]:checked', (e) => e.value);
    const spreadsheetId = await page.$eval('input[name=spreadsheetId]', (e) => e.value);
    expect(defaultConfig.startType).toEqual(startType);
    expect(defaultConfig.loadType).toEqual(loadType);
    expect(spreadsheetId).toEqual('');
  });
  test('Extension Load', async () => {
    await page.click('input[id=loadTypeDocument]');
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs[0].loadType).toEqual(LOAD_TYPES.DOCUMENT);
  });
  test('Start', async () => {
    await page.click('input[id=startManual]');
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs[0].startType).toEqual(START_TYPES.MANUAL);
    //expect(configs[0].hotkey).toEqual(defaultHotkey);
  });
  test('Hotkey', async () => {
    await page.focus('input[name=hotkey]');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyB');
    await page.keyboard.up('Control');
    await page.$eval('input[name=hotkey]', (e) => e.blur());
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs[0].hotkey).toEqual('Ctrl + B');
  });
  test('Google Sheets ID', async () => {
    await testPage.fill('input[name=spreadsheetId]', 'Testing');
    const configs = await worker.evaluate(TestWorker.getConfigs);
    expect(configs[0].spreadsheetId).toEqual('Testing');
  });
  test('close', async () => {
    await page.click('[role=dialog] .btn-close');
    await delay(1000);
    const modal = await page.evaluate(() => document.querySelector('[data-testid=config-settings-modal]') !== null);
    expect(modal).toBeFalsy();
  });
});
