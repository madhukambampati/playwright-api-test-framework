import { defineConfig } from '@playwright/test';
import { env } from './src/config/env';

/**
 * API-first configuration.
 *
 * Retries are enabled only on CI: a locally failing test should fail loudly,
 * while CI gets one retry to absorb transient network flakiness against the
 * public demo API. Workers are capped on CI to stay polite to a shared service.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'results/junit.xml' }],
  ],
  use: {
    baseURL: env.BASE_URL,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },
});
