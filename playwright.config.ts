import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  globalSetup: process.env.CI ? undefined : "./global-setup.ts",

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "e2e",
      testDir: "./tests/e2e",
      use: {
        ...devices["Desktop Chrome"],
        storageState: process.env.CI ? undefined : "storageState.json",
      },
    },

    {
      name: "mocked",
      testDir: "./tests/mocked",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
