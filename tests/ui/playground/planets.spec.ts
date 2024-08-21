import { test, expect } from "@playwright/test";
import { PlanetsPage } from "./pages/planets.page";

let planetsPage: PlanetsPage;

test.beforeEach(async ({ page }) => {
  planetsPage = new PlanetsPage(page);
  await planetsPage.goto();
});

test("a 200 pound person is 75 pounds on Mercury", async () => {
  await planetsPage.enterWeight("200");
  expect(await planetsPage.getWeightOnMercury()).toEqual("75.6");
});

[
  { weight: "200", expected: "75.6" },
  { weight: "100", expected: "37.8" },
  { weight: "80", expected: "30.24" },
].forEach(({ weight, expected }) => {
  test(`a ${weight} person is ${expected} pounds on Mercury`, async () => {
    await planetsPage.enterWeight(weight);
    expect(await planetsPage.getWeightOnMercury()).toEqual(expected);
  });
});
