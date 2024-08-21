import { test, type Page } from "@playwright/test";
import { Action } from "./components/action";
import { Filter } from "./components/filter";
import { TodoList } from "./components/todo.list";

test.beforeEach(async ({ page }) => {
  // await page.goto("https://demo.playwright.dev/todomvc");
  await page.goto("https://testerstories.com/todomvc");
});

const TODO_ITEMS = [
  "buy some cheese",
  "feed the cat",
  "book a doctors appointment",
];

test.describe("User Creating Todos", () => {
  test("allows new todo items to be created", async ({ page }) => {
    const action = Action(page);
    await action.addTodo(TODO_ITEMS[0]);

    const todosList = TodoList(page);
    await todosList.todos().expect().toHaveText([TODO_ITEMS[0]]);

    await action.addTodo(TODO_ITEMS[1]);
    await todosList.todos().expect().toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);

    await check_local_storage_todo_count(page, 2);
  });

  test("clears previous todo to allow new one to be entered", async ({
    page,
  }) => {
    const action = Action(page);
    await action.addTodo(TODO_ITEMS[0]);

    await action.expect().toHaveEmptyInput();
    await check_local_storage_todo_count(page, 1);
  });

  test("new todos appear at the bottom of the list", async ({ page }) => {
    await create_default_todos(page);

    const filter = Filter(page);
    await filter.expect().toHaveVisibleCount();
    await filter.expect().toHaveCountText("3 items left");

    await TodoList(page).todos().expect().toHaveText(TODO_ITEMS);
    await check_local_storage_todo_count(page, 3);
  });
});

test.describe("User Completes All Todos", () => {
  test.beforeEach(async ({ page }) => {
    await create_default_todos(page);
    await check_local_storage_todo_count(page, 3);
  });

  test.afterEach(async ({ page }) => {
    await check_local_storage_todo_count(page, 3);
  });

  test("allows all todos to be marked as completed", async ({ page }) => {
    await Action(page).completeAll();
    await TodoList(page).expect().toHaveAllCompleted();
    await check_local_storage_todo_count(page, 3);
  });

  test("allows the completed state to be cleared for all todos", async ({
    page,
  }) => {
    const action = Action(page);

    await action.completeAll();
    await action.uncompleteAll();
    await TodoList(page).expect().toHaveNoneCompleted();
  });

  test("completing all state is updated based on todo states", async ({
    page,
  }) => {
    const action = Action(page);
    await action.completeAll();
    await action.expect().toAllowUncompleteAll();
    await check_local_storage_todo_count(page, 3);

    const firstTodo = TodoList(page).todoAt(0);
    await firstTodo.uncomplete();
    await action.expect().toAllowUncompleteAll(false);
    await firstTodo.complete();
    await check_local_storage_todo_count(page, 3);
    await action.expect().toAllowUncompleteAll();
  });
});

test.describe("User Interacts with Todo", async () => {
  test("allows for marking todos as complete", async ({ page }) => {
    const action = Action(page);

    for (const item of TODO_ITEMS.slice(0, 2)) {
      await action.addTodo(item);
    }

    const todosList = TodoList(page);
    const firstTodo = todosList.todoAt(0);
    await firstTodo.complete();
    await firstTodo.expect().toBeCompleted();

    const secondTodo = todosList.todoAt(1);
    await secondTodo.expect().notToBeCompleted();
    await secondTodo.complete();

    await firstTodo.expect().toBeCompleted();
    await secondTodo.expect().toBeCompleted();
  });

  test("allows for changing a completed todo to not completed", async ({
    page,
  }) => {
    const action = Action(page);
    const todosList = TodoList(page);

    for (const item of TODO_ITEMS.slice(0, 2)) {
      await action.addTodo(item);
    }

    const firstTodo = todosList.todoAt(0);
    const secondTodo = todosList.todoAt(1);

    await firstTodo.complete();
    await firstTodo.expect().toBeCompleted();
    await secondTodo.expect().notToBeCompleted();
    await check_local_storage_completed_todo_count(page, 1);

    await firstTodo.uncomplete();
    await firstTodo.expect().notToBeCompleted();
    await secondTodo.expect().notToBeCompleted();
    await check_local_storage_completed_todo_count(page, 0);
  });

  test("allows editing a todo item", async ({ page }) => {
    await create_default_todos(page);
    const todosList = TodoList(page);

    const secondTodo = todosList.todoAt(1);
    await secondTodo.edit();
    await secondTodo.expect().toHaveEditableValue(TODO_ITEMS[1]);
    await secondTodo.save("buy some sausages");

    await todosList
      .todos()
      .expect()
      .toHaveText([TODO_ITEMS[0], "buy some sausages", TODO_ITEMS[2]]);

    await check_local_storage_for_todos(page, "buy some sausages");
  });
});

test.describe("User Editing a Todo", () => {
  test.beforeEach(async ({ page }) => {
    await create_default_todos(page);
    await check_local_storage_todo_count(page, 3);
  });

  test("will hide other controls while editing", async ({ page }) => {
    const secondTodo = TodoList(page).todoAt(1);

    await secondTodo.edit();
    await secondTodo.expect().toBeEditable();
    await check_local_storage_todo_count(page, 3);
  });

  test("will save edits on blur", async ({ page }) => {
    const todosList = TodoList(page);
    const secondTodo = todosList.todoAt(1);

    await secondTodo.edit();
    await secondTodo.fill("buy some sausages");
    await secondTodo.blur();

    await todosList
      .todos()
      .expect()
      .toHaveText([TODO_ITEMS[0], "buy some sausages", TODO_ITEMS[2]]);

    await check_local_storage_for_todos(page, "buy some sausages");
  });

  test("entered text will be trimmed", async ({ page }) => {
    const todosList = TodoList(page);
    const secondTodo = todosList.todoAt(1);

    await secondTodo.edit();
    await secondTodo.save("    buy some sausages    ");

    await todosList
      .todos()
      .expect()
      .toHaveText([TODO_ITEMS[0], "buy some sausages", TODO_ITEMS[2]]);

    await check_local_storage_for_todos(page, "buy some sausages");
  });

  test("removes the todo item if no description is provided", async ({
    page,
  }) => {
    const todosList = TodoList(page);
    const secondTodo = todosList.todoAt(1);

    await secondTodo.edit();
    await secondTodo.save("");

    await todosList.todos().expect().toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test("cancels editing if the user escapes", async ({ page }) => {
    const todosList = TodoList(page);
    const secondTodo = todosList.todoAt(1);

    await secondTodo.edit();
    await secondTodo.cancelEdit();

    await todosList.todos().expect().toHaveText(TODO_ITEMS);
  });
});

test.describe("Todo Item Counter", () => {
  test("displays the current number of todo items", async ({ page }) => {
    const action = Action(page);
    const filter = Filter(page);

    await action.addTodo(TODO_ITEMS[0]);
    await filter.expect().toHaveCountText("1 item left");

    await action.addTodo(TODO_ITEMS[1]);
    await filter.expect().toHaveCountText("2 items left");

    await check_local_storage_todo_count(page, 2);
  });
});

test.describe("User Clears Completed Todos", () => {
  test.beforeEach(async ({ page }) => {
    await create_default_todos(page);
  });

  test("will display the correct text", async ({ page }) => {
    await TodoList(page).todoAt(0).complete();
    await Filter(page).expect().toAllowClearCompleted();
  });

  test("will remove completed todo items when clicked", async ({ page }) => {
    const todosList = TodoList(page);
    await todosList.todoAt(1).complete();
    await Filter(page).clearCompleted();

    await todosList.todos().expect().toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test("cannot clear completed if no todos are completed", async ({ page }) => {
    await TodoList(page).todoAt(1).complete();

    const filter = Filter(page);
    await filter.clearCompleted();
    await filter.expect().toAllowClearCompleted(false);
  });
});

test.describe("Persistence", () => {
  test("data for a todo will be persisted", async ({ page }) => {
    const action = Action(page);

    for (const item of TODO_ITEMS.slice(0, 2)) {
      await action.addTodo(item);
    }

    const todosList = TodoList(page);
    const firstTodo = todosList.todoAt(0);
    await firstTodo.complete();
    await firstTodo.expect().toBeCompleted();

    await todosList.todos().expect().toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await todosList.todoAt(1).expect().notToBeCompleted();

    await check_local_storage_completed_todo_count(page, 1);

    await page.reload();

    await todosList.todos().expect().toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await firstTodo.expect().toBeCompleted();
    await todosList.todoAt(1).expect().notToBeCompleted();
  });
});

test.describe("Routing", () => {
  test.beforeEach(async ({ page }) => {
    await create_default_todos(page);
    await check_local_storage_for_todos(page, TODO_ITEMS[0]);
  });

  test("allows active todo items to be displayed", async ({ page }) => {
    const todosList = TodoList(page);
    await todosList.todoAt(1).complete();

    await check_local_storage_completed_todo_count(page, 1);
    await Filter(page).selectLink("Active");

    await todosList.todos().expect().toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test("todo display respects the back button", async ({ page }) => {
    const todosList = TodoList(page);
    const filter = Filter(page);
    await todosList.todoAt(1).complete();

    await check_local_storage_completed_todo_count(page, 1);

    await test.step("Showing all items", async () => {
      await filter.selectLink("All");
      await todosList.todos().expect().toHaveCount(3);
    });

    await test.step("Showing active items", async () => {
      await filter.selectLink("Active");
    });

    await test.step("Showing completed items", async () => {
      await filter.selectLink("Completed");
    });

    await todosList.todos().expect().toHaveCount(1);
    await page.goBack();
    await todosList.todos().expect().toHaveCount(2);
    await page.goBack();
    await todosList.todos().expect().toHaveCount(3);
  });

  test("will display completed todo items", async ({ page }) => {
    const todosList = TodoList(page);
    await todosList.todoAt(1).complete();
    await check_local_storage_completed_todo_count(page, 1);

    await Filter(page).selectLink("completed");
    await todosList.todos().expect().toHaveCount(1);
  });

  test("will display all todo items", async ({ page }) => {
    const todosList = TodoList(page);
    await todosList.todoAt(1).complete();

    const filter = Filter(page);
    await filter.selectLink("Active");
    await filter.selectLink("Completed");
    await filter.selectLink("All");

    await todosList.todos().expect().toHaveCount(3);
  });

  test("should highlight the currently applied filter", async ({ page }) => {
    const filter = Filter(page);

    await filter.link("All").expect().toBeSelected();
    await filter.selectLink("Active");
    await filter.link("Active").expect().toBeSelected();
    await filter.selectLink("Completed");
    await filter.link("Completed").expect().toBeSelected();
  });
});

async function create_default_todos(page: Page) {
  const action = Action(page);

  for (const item of TODO_ITEMS) {
    await action.addTodo(item);
  }
}

async function check_local_storage_todo_count(page: Page, expected: number) {
  return await page.waitForFunction((e) => {
    return JSON.parse(localStorage["react-todos"]).length === e;
  }, expected);
}

async function check_local_storage_completed_todo_count(
  page: Page,
  expected: number,
) {
  return await page.waitForFunction((e) => {
    return (
      JSON.parse(localStorage["react-todos"]).filter((todo) => todo.completed)
        .length === e
    );
  }, expected);
}

async function check_local_storage_for_todos(page: Page, title: string) {
  return await page.waitForFunction((t) => {
    return JSON.parse(localStorage["react-todos"])
      .map((todo) => todo.title)
      .includes(t);
  }, title);
}
