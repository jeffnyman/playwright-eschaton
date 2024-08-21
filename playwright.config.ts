import path from "path";
import { defineConfig, devices } from "@playwright/test";
import conciseReport from "./support/reporter/concise";
import { config } from "dotenv";

config();

export const SAUCE_STORAGE_STATE = path.join(
  __dirname,
  ".auth/sauce_user.json",
);

/**
 * Configuration
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  outputDir: "./results",

  fullyParallel: true,

  /* CI Configurations */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /**
   * Test reporting
   * See See https://playwright.dev/docs/test-reporters
   */
  reporter: [
    ["list", { printSteps: true }],
    ["html", { open: "never", outputFolder: "results" }],
    ["json", { outputFile: "results/results.json" }],
    ["junit", { outputFile: "results/results.xml" }],
    [
      "./support/reporter/summary/reporter.ts",
      { outputFile: "results/summary.txt" },
    ],
    [
      "./support/reporter/summary/reporter.ts",
      { outputFile: "results/concise.txt", inputTemplate: conciseReport },
    ],
  ],

  /**
   * Shared project settings
   * See https://playwright.dev/docs/api/class-testoptions
   */
  use: {
    // baseURL: 'http://127.0.0.1:3000',

    /**
     * Trace viewing
     * See https://playwright.dev/docs/trace-viewer
     */
    trace: "on-first-retry",
  },

  /**
   * Projects
   * See https://playwright.dev/docs/test-projects
   */
  projects: [
    {
      name: "Tautology Tests",
      testDir: "./tests/tautology",
      testMatch: "**/*.spec.ts",
    },
    {
      name: "Sauce Setup",
      testDir: "./tests/_global",
      testMatch: "sauce.setup.ts",
      use: {
        baseURL: "https://www.saucedemo.com/",
        testIdAttribute: "data-test",
      },
    },
    {
      name: "Sauce Logged In Tests",
      testDir: "./tests/ui/sauce",
      testMatch: "**/*loggedin.spec.ts",
      dependencies: ["Sauce Setup"],
      use: {
        baseURL: "https://www.saucedemo.com/",
        testIdAttribute: "data-test",
        storageState: SAUCE_STORAGE_STATE,
      },
    },
    {
      name: "Sauce Logged Out Tests",
      testDir: "./tests/ui/sauce",
      testIgnore: ["**/*loggedin.spec.ts"],
      use: {
        baseURL: "https://www.saucedemo.com/",
        testIdAttribute: "data-test",
      },
    },
    {
      name: "Weather API Tests",
      testDir: "./tests/api/weather",
      testMatch: "**/*.spec.ts",
    },
    {
      name: "Booker API Tests",
      testDir: "./tests/api/booker",
      testMatch: "**/*.spec.ts",
      use: {
        baseURL: "https://restful-booker.herokuapp.com",
      },
    },
    {
      name: "Ludic UI Tests",
      testDir: "./tests/ui/ludic",
      testMatch: "**/*.spec.ts",
      use: {
        baseURL: "https://testerstories.com",
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "Playground UI Tests",
      testDir: "./tests/ui/playground",
      testMatch: "**/*.spec.ts",
      use: {
        baseURL: "https://testerstories.com",
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "Todo UI Tests",
      testDir: "./tests/ui/todomvc",
      testMatch: "**/*.spec.ts",
      use: {
        baseURL: "https://testerstories.com",
        ...devices["Desktop Chrome"],
      },
    },
    // {
    //   name: "chromium",
    //   use: { ...devices["Desktop Chrome"] },
    // },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
