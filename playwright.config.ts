import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);
const port = Number(process.env.PORT ?? 5173);
const baseURL =
  process.env.BASE_URL ?? `http://localhost:${port}`;
const usesLocalServer = !process.env.BASE_URL;

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',

  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,

  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  reporter: isCI
    ? [
        ['list'],
        ['github'],
        ['html', { open: 'never' }],
      ]
    : [
        ['list'],
        ['html', { open: 'never' }],
      ],

  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 10_000,
    navigationTimeout: 15_000,

    locale: 'en-US',
    timezoneId: 'UTC',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],

  ...(usesLocalServer
    ? {
        webServer: {
          command:
            `npm run dev -- --port ${port} --strictPort --no-open`,
          url: baseURL,
          reuseExistingServer: !isCI,
          timeout: 120_000,
          stdout: 'pipe',
          stderr: 'pipe',
        },
      }
    : {}),
});