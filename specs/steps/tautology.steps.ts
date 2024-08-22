import { Given, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const summation = (a: number, b: number) => a + b;

interface AdditionData {
  x: number;
  y: number;
  sum: number;
}

interface DataTableRow {
  x: string;
  y: string;
  sum: string;
}

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

Given("two numbers {int} and {int}", async function (addend1, addend2) {
  this.addend1 = addend1;
  this.addend2 = addend2;
});

Then("the sum is {int}", async function (expectedSum) {
  const actualSum = this.addend1 + this.addend2;
  expect(actualSum).toBe(expectedSum);
});

Given(
  "the following summation data",
  function (dataTable: { hashes: () => DataTableRow[] }) {
    this.data = dataTable.hashes().map((row: DataTableRow) => ({
      x: Number(row.x),
      y: Number(row.y),
      sum: Number(row.sum),
    })) as AdditionData[];
  },
);

Then("all sums should be correct", async function () {
  this.data.forEach(({ x, y, sum }: AdditionData) => {
    const actualSum = x + y;
    expect(actualSum).toBe(sum);
  });
});
