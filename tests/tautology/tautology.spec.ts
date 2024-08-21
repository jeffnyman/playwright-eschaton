import { test, expect } from "@playwright/test";

const sum = (a: number, b: number) => a + b;

/*
Shows how you can configure all tests in the module to run in a
given mode. In this case, this is done because the test results
can look odd based on how they are structured. Try running this
grouping of tests with and without the configuration.
*/
test.describe.configure({ mode: "serial" });

/*
This initial block shows a tagged grouping of tests. There is also
the breakdown of test.describe, test, and test.step.
*/
test.describe("logical tautologies", { tag: "@canary" }, () => {
  test("the basis of truth", () => {
    test.step("truth is true", () => {
      expect(true).toBe(true);
    });

    test.step("truth not to be false", () => {
      expect(false).not.toBe(true);
    });
  });
});

/*
This block shows another tag, related to the above, while also
showing a test calling a distinct function. There are also two
tests based on iterators.
*/
test.describe("mathematical tautologies", { tag: "@canary" }, () => {
  test("the basis of math", () => {
    test.step("simple addition of primitives", () => {
      expect(1 + 1).toEqual(2);
    });

    test.step("simple addition from function", () => {
      expect(sum(1, 2)).toBe(3);
    });
  });

  [
    { x: 1, y: 2, sum: 3 },
    { x: 1, y: -1, sum: 0 },
    { x: 0, y: 0, sum: 0 },
  ].forEach(({ x, y, sum }) => {
    test(`sum of ${x} and ${y} should be ${sum}`, () => {
      expect(x + y).toBe(sum);
    });
  });

  test("simple addition set", () => {
    [
      [1, 2, 3],
      [1, -1, 0],
      [0, 0, 0],
    ].forEach((data) => {
      expect(data[0] + data[1]).toBe(data[2]);
    });
  });
});
