import { Page, expect } from "@playwright/test";
import { Todo } from "./todo";

type Todo = ReturnType<typeof Todo>;

export interface TodoOptions {
  index?: number;
}

export function TodoList(page: Page) {
  const self = page.getByRole("list");

  const todos = (options: TodoOptions = {}) => Todo(self, options);
  const todoAt = (index: number) => todos({ index });

  const forEach = async (f: (todo: Todo) => Promise<void>) => {
    const count = await todos().count();

    for (let i = 0; i < count; i++) {
      await f(todoAt(i));
    }
  };

  return {
    todoAt,
    todos,
    expect: () => ({
      ...expect(self),
      toHaveAllCompleted: () =>
        forEach((todo) => todo.expect().toBeCompleted()),
      toHaveNoneCompleted: () =>
        forEach((todo) => todo.expect().notToBeCompleted()),
    }),
  };
}
