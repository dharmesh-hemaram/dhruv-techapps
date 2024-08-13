import { Page } from 'puppeteer-core';
import { getPageAndWorker } from '../util';

let page: Page;

beforeAll(async () => {
  ({ page } = await getPageAndWorker());
});

describe('Header', () => {
  test('clear', async () => {
    await page.evaluate(() => localStorage.removeItem('theme'));
    await page.reload();
  });
  test('Default Theme', async () => {
    const htmlTheme = await page.evaluate(() => document.documentElement.getAttribute('data-bs-theme'));
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(htmlTheme).toEqual('light');
    expect(theme).toBeNull();
  });
  test.each(['dark', 'light'])('Theme Switch %s', async (theme) => {
    await page.evaluate((theme) => localStorage.setItem('theme', theme), theme);
    await page.reload();
    const htmlTheme = await page.evaluate(() => document.documentElement.getAttribute('data-bs-theme'));
    const localTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(htmlTheme).toEqual(theme);
    expect(localTheme).toEqual(theme);
  });
});
