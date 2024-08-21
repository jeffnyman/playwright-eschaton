import { Page, expect } from "@playwright/test";

export function Action(page: Page) {
  const self = page.locator("header");
  const input = self.getByPlaceholder("What needs to be done?");
  const toggleAll = page.getByLabel("Mark all as complete");

  const completeAll = () => toggleAll.check();
  const uncompleteAll = () => toggleAll.uncheck();

  const addTodo = async (text: string) => {
    await input.fill(text);
    await input.press("Enter");
  };

  return {
    addTodo,
    completeAll,
    uncompleteAll,
    expect: () => ({
      ...expect(self),
      toAllowUncompleteAll: (allow = true) =>
        expect(toggleAll).toBeChecked({ checked: allow }),
      toHaveEmptyInput: () => expect(input).toBeEmpty(),
    }),
  };
}
