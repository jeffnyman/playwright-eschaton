import { Before, After } from "@cucumber/cucumber";
import { chromium, Browser, Page } from "@playwright/test";
import { pageFixture } from "./pageFixture";

let browser: Browser;
let page: Page;

Before(async function (scenario) {
  if (!scenario.pickle.tags.some((tag) => tag.name === "@canary")) {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();
    pageFixture.page = page;
  }
});

After(async function (scenario) {
  if (!scenario.pickle.tags.some((tag) => tag.name === "@canary")) {
    await page.close();
    await browser.close();
  }
});
