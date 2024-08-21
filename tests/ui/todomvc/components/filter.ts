import { Page, Locator, expect } from "@playwright/test";

export function Filter(page: Page) {
  const self = page.locator("footer");
  const countText = self.getByTestId("todo-count");
  const clearCompletedButton = self.getByRole("button", {
    name: "Clear completed",
  });

  const clearCompleted = () => clearCompletedButton.click();
  const link = (name: string) => FooterLink(self, { name });
  const selectLink = (name: string) => link(name).select();

  return {
    link,
    selectLink,
    clearCompleted,
    expect: () => ({
      ...expect(self),
      toHaveCountText: (text: string) => expect(countText).toHaveText(text),
      toHaveVisibleCount: () => expect(countText).toBeVisible(),
      toAllowClearCompleted: (visible = true) =>
        expect(clearCompletedButton).toBeVisible({ visible }),
    }),
  };
}

/* SOMWHERE ELSE? */

interface FooterLinkOptions {
  name: string;
}

export function FooterLink(parent: Locator, { name }: FooterLinkOptions) {
  const self = parent.getByRole("link", { name });

  const select = () => self.click();

  return {
    select,
    expect: () => ({
      ...expect(self),
      toBeSelected: () => expect(self).toHaveClass("selected"),
    }),
  };
}
