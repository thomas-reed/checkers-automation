import { test as baseTest } from '@playwright/test';
import { Checkers } from '@pages/Checkers.page';

const test = baseTest.extend<{
  checkers: Checkers;
}>({
  checkers: async ({ baseURL, page }, use) => {
    if (!baseURL)
      throw new Error('baseURL must be defined in playwright config');
    await page.goto(baseURL);
    await use(new Checkers(page));
  },
});

export default test;
