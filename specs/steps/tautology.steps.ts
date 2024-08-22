import { Given } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const summation = (a: number, b: number) => a + b;

Given("truth is true", async function () {
  expect(true).toBe(true);
});

Given("truth is not untrue", async function () {
  expect(false).not.toBe(true);
});

Given("{int} plus {int} equals {int}", async function (addend1, addend2, sum) {
  expect(addend1 + addend2).toEqual(sum);
});

Given(
  "the sum of {int} and {int} is {int}",
  async function (addend1, addend2, sum) {
    expect(summation(addend1, addend2)).toEqual(sum);
  },
);
