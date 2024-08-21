import { test, expect } from "@playwright/test";

test("testerstories responds to status request", async ({ request }) => {
  const response = await request.get(
    "https://testerstories.com/files/api/testing",
  );

  expect(response.status()).toBe(200);

  const responseBody = (await response.json()) as { message: string };

  expect(responseBody).toEqual({ message: "Testing TesterStories" });
});
