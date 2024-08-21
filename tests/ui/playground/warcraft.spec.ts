import { test, expect } from "@playwright/test";

test("classes can be determined for a given race", async ({ page }) => {
  await page.goto("/xyzzy/warcraft.html");

  const table = page.locator(".wowClassTable");

  const dwarfRow = table.locator("tr", {
    has: page.locator("td", { hasText: "Dwarf" }),
  });

  const classesCell = dwarfRow.locator("td:last-child");
  const classes = await classesCell.locator("td").allTextContents();

  expect(classes).toContain("Priest");
  expect(classes).toContain("Rogue");
  expect(classes).toContain("Warrior");
  expect(classes).toContain("Mage");
  expect(classes).toContain("Hunter");
  expect(classes).toContain("Warlock");
  expect(classes).toContain("Shaman");
  expect(classes).toContain("Paladin");
  expect(classes).toContain("Monk");
  expect(classes).toContain("Death Knight");
});
