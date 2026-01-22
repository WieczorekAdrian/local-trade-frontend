import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "html",
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },

    {
      name: "e2e",
      testDir: "./tests/e2e",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "storageState.json",
      },
    },

    {
      name: "mocked-chrome",
      testDir: "./tests/mocked",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mocked-safari",
      testDir: "./tests/mocked",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mocked-mobile",
      testDir: "./tests/mocked",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
