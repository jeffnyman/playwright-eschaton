import { Given, When, Then } from "@cucumber/cucumber";
import { pageFixture } from "../../support/cucumber/pageFixture";
import { expect } from "@playwright/test";

function isApproximatelyEqual(
  actual: number,
  expected: number,
  tolerance: number,
) {
  return Math.abs(actual - expected) <= tolerance;
}

Given("the planet weight page", async function () {
  await pageFixture.page.goto(`${process.env.BASEURL}/xyzzy/planets.html`);
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

Then("the weight on Mercury will be exactly {float}", async function (float) {
  const expectedMercuryWeight = float.toString();
  const actualMercuryWeight = await pageFixture.page
    .locator("#outputmrc")
    .inputValue();

  expect(actualMercuryWeight).toBe(expectedMercuryWeight);
});

Then("the weight on Mercury will be roughly {int}", async function (int) {
  const tolerance = 0.9;
  const expectedMercuryWeight = int.toString();
  const actualMercuryWeight = await pageFixture.page
    .locator("#outputmrc")
    .inputValue();

  const actualValue = parseFloat(actualMercuryWeight);
  const expectedValue = parseFloat(expectedMercuryWeight);

  // I'm doing this part because the actual expectation is checking
  // if the value was true or false in terms of being within the
  // tolerance. But I also want failures to indicate what the actual
  // value was, even though that's not being tested for in the
  // expectation.
  if (!isApproximatelyEqual(actualValue, expectedValue, tolerance)) {
    throw new Error(
      `Expected weight to be approximately ${expectedValue}, but got ${actualValue}.`,
    );
  }

  expect(isApproximatelyEqual(actualValue, expectedValue, tolerance)).toBe(
    true,
  );
});
