import { test, expect, Page } from "@playwright/test";

async function checkTextContent(
  page: Page,
  selector: string,
  expectedText: string,
) {
  const element = page.locator(selector);

  const textContent = await element.textContent();
  const trimmedText = textContent ? textContent.trim() : "";

  expect(trimmedText).toEqual(expectedText);
}

test("warp values can be calculated", async ({ page }) => {
  await page.goto("/xyzzy/warp.html");

  const distanceValue = page.locator("#distInput");
  await distanceValue.fill("");
  await distanceValue.pressSequentially("4.3");

  const warpFactor = page.locator("#warpInput");
  await warpFactor.fill("");
  await warpFactor.pressSequentially("1");

  const velocity = page.locator("#velocityInput");
  await velocity.fill("");
  await velocity.pressSequentially("1");

  await checkTextContent(page, "#travelAU", "8.32 minutes");
  await checkTextContent(page, "#travelLY", "1 years");
  await checkTextContent(page, "#travelSector", "20 years");
  await checkTextContent(page, "#travelGalaxy", "100000 years");
  await checkTextContent(page, "#travelUser", "4.3 years");
});
