import { defineConfig, devices } from '@playwright/test';

import { API_BASE_URL, APP_ORIGIN } from './e2e/fixtures';

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'html',

  use: {
    baseURL: APP_ORIGIN,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: APP_ORIGIN,
    reuseExistingServer: !isCI,
    timeout: 120_000,
    env: { VITE_API_BASE_URL: API_BASE_URL },
  },
});
