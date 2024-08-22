import { Given } from "@cucumber/cucumber";
import { expect, request } from "@playwright/test";

Given("testerstories responds to status request", async function () {
  const apiRequestContext = await request.newContext();

  const response = await apiRequestContext.get(
    "https://testerstories.com/files/api/testing",
  );

  expect(response.status()).toBe(200);

  const responseBody = (await response.json()) as { message: string };

  expect(responseBody).toEqual({ message: "Testing TesterStories" });
});
