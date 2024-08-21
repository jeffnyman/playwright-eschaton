import { test, expect } from "@playwright/test";

test.describe("menu navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/xyzzy/");
  });

  test("menu is initially not visible", async ({ page }) => {
    const navElements = page.locator(".nav");

    await expect(navElements).not.toBeInViewport();
  });

  test("menu is visible when expanded", async ({ page }) => {
    await page.locator("#navlist").click();

    const navElements = page.locator(".nav");

    await page.waitForTimeout(1000);

    await expect(navElements).toBeInViewport();
  });

  const menuItems = [
    "Planets",
    "Stardates",
    "Warp Travel",
    "Warcraft",
    "Practice",
  ];

  menuItems.forEach((item) => {
    test(`menu contains ${item}`, async ({ page }) => {
      const listItem = page.locator(`text=${item}`);
      await expect(listItem).toBeVisible();
    });
  });
});
