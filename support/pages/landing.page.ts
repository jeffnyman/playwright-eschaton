import { type Locator, type Page, expect } from "@playwright/test";

export class LandingPage {
  readonly page: Page;
  readonly nav: Locator;
  readonly navList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.locator(".nav");
    this.navList = page.locator("#navlist");
  }

  async navIsNotVisibleToUser() {
    await expect(this.nav).not.toBeInViewport();
  }

  async navIsVisibleInBrowser() {
    await this.page.waitForTimeout(1000);
    await expect(this.nav).toBeInViewport();
  }

  async openNavList() {
    await this.navList.click();
  }

  menuItemByText(itemText: string): Locator {
    return this.page.locator(`text=${itemText}`);
  }

  async checkNavigationMenuFor(itemText: string) {
    const listItem: Locator = this.menuItemByText(itemText);
    await expect(listItem).toBeVisible();
  }
}
