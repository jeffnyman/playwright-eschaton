import { Given, When } from "@cucumber/cucumber";
import { pageFixture } from "../../support/cucumber/pageFixture";

Given("the planet weight page", async function () {
  await pageFixture.page.goto("https://testerstories.com/xyzzy/planets.html");
});

When("the weight calculated is {int}", async function (int) {
  // Since the scenario step for this does not use quotes,
  // I have to convert the number passed in to a string.
  // This is necessary because Playwright will expect the
  // data it uses to fill the text field to be a string.
  const weight = int.toString();

  await pageFixture.page.locator("#wt").fill(weight);
  await pageFixture.page.locator("#calculate").click();
});
