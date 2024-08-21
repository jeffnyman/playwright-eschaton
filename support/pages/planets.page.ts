import { type Locator, type Page } from "@playwright/test";

export class PlanetsPage {
  readonly page: Page;
  readonly personWeight: Locator;
  readonly mercuryWeight: Locator;
  readonly calculate: Locator;

  constructor(page: Page) {
    this.page = page;
    this.personWeight = page.locator("#wt");
    this.mercuryWeight = page.locator("#outputmrc");
    this.calculate = page.locator("#calculate");
  }

  async goto() {
    await this.page.goto("/xyzzy/planets.html");
  }

  async enterWeight(weight: string) {
    await this.personWeight.fill(weight);
    await this.calculate.click();
  }

  async getWeightOnMercury() {
    return await this.mercuryWeight.inputValue();
  }
}
