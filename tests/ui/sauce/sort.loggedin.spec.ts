import { test, expect } from "@playwright/test";

const sortOptions = {
  az: "Sauce Labs Backpack",
  za: "Test.allTheThings() T-Shirt (Red)",
  lohi: "Sauce Labs Onesie",
  hilo: "Sauce Labs Fleece Jacket",
};

test.beforeEach(async ({ page }) => {
  await page.goto("/inventory.html");
});

test.describe("items can be sorted", () => {
  for (const option in sortOptions) {
    test(`successfully sort by ${option}`, async ({ page }) => {
      await page.getByTestId("product-sort-container").selectOption(option);
      await expect(page.locator("#inventory_container").first()).toContainText(
        sortOptions[option],
      );
    });
  }
});
