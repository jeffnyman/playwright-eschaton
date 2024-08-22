import { Given, When, Then } from "@cucumber/cucumber";
import { fixture } from "../../support/cucumber/pageFixture";
import { expect } from "@playwright/test";

function isApproximatelyEqual(
  actual: number,
  expected: number,
  tolerance: number,
) {
  return Math.abs(actual - expected) <= tolerance;
}

Given("the planet weight page", async function () {
  await fixture.page.goto(`${process.env.BASEURL}/xyzzy/planets.html`);
  fixture.logger.info("Navigated to the Planets page");
});

Given(
  "a {int} pound person will weigh exactly {float} pounds on Mercury",
  async function (int, float) {
    const weight = int.toString();
    await fixture.page.locator("#wt").fill(weight);
    await fixture.page.locator("#calculate").click();

    const expectedMercuryWeight = float.toString();
    const actualMercuryWeight = await fixture.page
      .locator("#outputmrc")
      .inputValue();

    expect(actualMercuryWeight).toBe(expectedMercuryWeight);
  },
);

Given(
  "a {int} pound person will weigh approximately {int} pounds on Mercury",
  async function (int, int2) {
    const weight = int.toString();
    await fixture.page.locator("#wt").fill(weight);
    await fixture.page.locator("#calculate").click();

    const tolerance = 0.9;
    const expectedMercuryWeight = int2.toString();

    const actualMercuryWeight = await fixture.page
      .locator("#outputmrc")
      .inputValue();

    expect(
      isApproximatelyEqual(
        parseFloat(actualMercuryWeight),
        parseFloat(expectedMercuryWeight),
        tolerance,
      ),
    ).toBe(true);
  },
);

When("the weight calculated is {int}", async function (int) {
  // Since the scenario step for this does not use quotes,
  // I have to convert the number passed in to a string.
  // This is necessary because Playwright will expect the
  // data it uses to fill the text field to be a string.
  const weight = int.toString();

  await fixture.page.locator("#wt").fill(weight);
  await fixture.page.locator("#calculate").click();
});

When("the weight calculated is {string}", async function (weight) {
  await fixture.page.locator("#wt").fill(weight);
  await fixture.page.locator("#calculate").click();
});

Then("the weight on Mercury will be exactly {float}", async function (float) {
  const expectedMercuryWeight = float.toString();
  const actualMercuryWeight = await fixture.page
    .locator("#outputmrc")
    .inputValue();

  expect(actualMercuryWeight).toBe(expectedMercuryWeight);

  fixture.logger.info(`Expected Mercury Weight: ${expectedMercuryWeight}`);
  fixture.logger.info(`Actual Mercury Weight: ${actualMercuryWeight}`);
});

Then("the weight on Mercury will be roughly {int}", async function (int) {
  const tolerance = 0.9;
  const expectedMercuryWeight = int.toString();
  const actualMercuryWeight = await fixture.page
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

Then(
  "the weight on Mercury will be exactly {string}",
  async function (expectedMercuryWeight) {
    const actualMercuryWeight = await fixture.page
      .locator("#outputmrc")
      .inputValue();

    expect(actualMercuryWeight).toBe(expectedMercuryWeight);
  },
);
