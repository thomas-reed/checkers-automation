import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  snapshotDir: './snapshots',
  outputDir: './test-results/failure',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: './html-reports', open: 'on-failure' }],
  ],
  use: {
    baseURL: 'https://www.gamesforthebrain.com/game/checkers/',

    /* Collect artifacts on failures */
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
