import { Before, After, AfterAll } from "@cucumber/cucumber";
import { chromium, Browser, BrowserContext } from "@playwright/test";
import { pageFixture } from "./pageFixture";

let browser: Browser;
let context: BrowserContext;

Before(async function (scenario) {
  if (!scenario.pickle.tags.some((tag) => tag.name === "@canary")) {
    // I'm putting this check here rather than using the BeforeAll
    // hook. I'm doing that because the BeforeAll does not accept
    // the `scenario` argument so I would not be able to check for
    // the tag.
    if (!browser) {
      browser = await chromium.launch({ headless: false });
    }
    context = await browser.newContext();
    const page = await context.newPage();
    pageFixture.page = page;
  }
});

After(async function (scenario) {
  if (!scenario.pickle.tags.some((tag) => tag.name === "@canary")) {
    const img = await pageFixture.page.screenshot({
      path: `./results/screenshots/${scenario.pickle.name}.png`,
      type: "png",
    });

    this.attach(img, "image/png");

    await pageFixture.page.close();
    await context.close();
  }
});

AfterAll(async () => {
  if (browser) {
    await browser.close();
  }
});
