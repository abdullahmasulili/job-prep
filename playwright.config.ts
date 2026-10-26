import { defineConfig } from '@playwright/test';
const port = Number(process.env.JOBPREP_TEST_PORT || 3100);
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: 2,
  retries: 0,
  use: {
    baseURL: `http://localhost:${port}`,
    browserName: 'chromium',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
    timeout: 30000,
  },
});
