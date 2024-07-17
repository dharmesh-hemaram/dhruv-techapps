import { expect, test } from '@playwright/test';

test.describe('Extension Service Worker Test', () => {
  test('should access the service worker', async ({ baseURL, page, context }) => {
    // Navigate to a page within the service worker's scope if possible
    // await page.goto('chrome-extension://your-extension-id/some-page.html');
    console.log(baseURL);

    await page.goto(baseURL || 'chrome://extensions');

    console.log(context.serviceWorkers());
    expect(context.serviceWorkers().length).toBe(1);
  });
});
