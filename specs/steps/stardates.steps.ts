import { Given, When, Then } from "@cucumber/cucumber";

import { expect } from "@playwright/test";
import { fixture } from "../../support/cucumber/pageFixture";

Given("the stardate page", async function () {
  await fixture.page.goto(`${process.env.BASEURL}/xyzzy/stardates.html`);
});

When("the tng era {float} is converted", async function (float) {
  const stardateValue = float.toString();
  await fixture.page.locator("#enableForm").click();
  await fixture.page.locator("#tngEra").click();
  await fixture.page.locator("#stardateValue").fill(stardateValue);
  await fixture.page.locator("#convert").click();
});

Then(
  "the displayed and calculated calendar year should be {int}",
  async function (int) {
    const expectedStartate = int.toString();
    const earthYearvalue = await fixture.page
      .locator("#calendarValue")
      .inputValue();

    expect(earthYearvalue).toContain(expectedStartate);
  },
);
