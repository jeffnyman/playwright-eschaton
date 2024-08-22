import { Before, BeforeAll, After, AfterAll, Status } from "@cucumber/cucumber";
import { Browser, BrowserContext } from "@playwright/test";
import { fixture } from "./pageFixture";
import { invokeBrowser } from "../browserManager";
import { getEnv } from "../env/env";
import { options } from "./logger";
import { createLogger } from "winston";

let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
  getEnv();
});

Before(async function (scenario) {
  if (!scenario.pickle.tags.some((tag) => tag.name === "@canary")) {
    // I'm putting this check here rather than using the BeforeAll
    // hook. I'm doing that because the BeforeAll does not accept
    // the `scenario` argument so I would not be able to check for
    // the tag.
    if (!browser) {
      //browser = await chromium.launch({ headless: false });
      browser = await invokeBrowser();
    }
    context = await browser.newContext();
    const page = await context.newPage();
    fixture.page = page;

    const scenarioName = scenario.pickle.name + scenario.pickle.id;

    fixture.logger = createLogger(options(scenarioName));
  }
});

After(async function (scenario) {
  if (!scenario.pickle.tags.some((tag) => tag.name === "@canary")) {
    if (scenario.result?.status == Status.FAILED) {
      const img = await fixture.page.screenshot({
        path: `./results/screenshots/${scenario.pickle.name}.png`,
        type: "png",
      });

      this.attach(img, "image/png");
    }

    await fixture.page.close();
    await context.close();
  }
});

AfterAll(async () => {
  if (browser) {
    await browser.close();
    fixture.logger.close();
  }
});
