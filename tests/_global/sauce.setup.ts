import { test as setup, expect } from "@playwright/test";
import { SAUCE_STORAGE_STATE } from "../../playwright.config";

setup("login to sauce site", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("Username").fill(process.env.SAUCE_USERNAME!);
  await page.getByTestId("password").fill(process.env.SAUCE_PASSWORD!);
  await page.getByText("Login", { exact: true }).click();

  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page).toHaveTitle(/Swag Labs/);

  await page.context().storageState({ path: SAUCE_STORAGE_STATE });
});
