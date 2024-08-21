import { Locator, expect } from "@playwright/test";

import { TodoOptions } from "./todo.list";

export function Todo(parent: Locator, options: TodoOptions = {}) {
  let self = parent.getByTestId("todo-item");

  if (options.index !== undefined) {
    self = self.nth(options.index);
  }

  const textbox = self.getByRole("textbox", { name: "Edit" });
  const checkbox = self.getByRole("checkbox");
  const label = self.locator("label");

  const edit = () => self.dblclick();
  const cancelEdit = () => textbox.press("Enter");
  const fill = (text: string) => textbox.fill(text);
  const complete = () => checkbox.check();
  const uncomplete = () => checkbox.uncheck();
  const blur = () => textbox.dispatchEvent("blur");
  const count = () => self.count();

  const save = async (text: string) => {
    await fill(text);
    await textbox.press("Enter");
  };

  return {
    fill,
    edit,
    blur,
    save,
    count,
    cancelEdit,
    complete,
    uncomplete,
    expect: () => ({
      ...expect(self),
      toBeCompleted: () => expect(self).toHaveClass("completed"),
      notToBeCompleted: () => expect(self).not.toHaveClass("completed"),
      toHaveEditableValue: (value: string) =>
        expect(textbox).toHaveValue(value),
      toBeEditable: async () => {
        await expect(label).toBeHidden();
        await expect(checkbox).toBeHidden();
      },
    }),
  };
}
