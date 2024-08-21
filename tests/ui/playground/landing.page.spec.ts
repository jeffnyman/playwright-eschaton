import { test, expect } from "@playwright/test";
import { LandingPage } from "./pages/landing.page";

let landingPage: LandingPage;

test.describe("menu navigation", () => {
  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await page.goto("/xyzzy/");
  });

  test("(Variant 1) menu is initially not visible", async () => {
    await expect(landingPage.nav).not.toBeInViewport();
  });

  test("(Variant 2) menu is initially not visible", async () => {
    await landingPage.navIsNotVisibleToUser();
  });

  test("menu is visible when expanded", async () => {
    await landingPage.openNavList();
    await landingPage.navIsVisibleInBrowser();
  });

  const menuItems = [
    "Planets",
    "Stardates",
    "Warp Travel",
    "Warcraft",
    "Practice",
  ];

  menuItems.forEach((item) => {
    test(`(Variant 1) menu contains ${item}`, async () => {
      const listItem = landingPage.menuItemByText(item);
      await expect(listItem).toBeVisible();
    });
  });

  menuItems.forEach((item) => {
    test(`(Variant 2) menu contains ${item}`, async () => {
      await landingPage.checkNavigationMenuFor(item);
    });
  });
});
