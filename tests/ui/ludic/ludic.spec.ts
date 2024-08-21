import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/xyzzy/ludic/article/precis.html");
});

test("page has expected title text", async ({ page }) => {
  const pageHeader = page.locator("h1");
  await expect(pageHeader).toBeVisible();
  await expect(pageHeader).toHaveText("A Ludic Historian Précis");
});

test("header conditionally displays", async ({ page }) => {
  const header = page.locator("header");

  // Initial state: header should have the 'nav-down' class.
  await expect(header).toHaveClass("nav-down");

  // Scroll down and verify the class change.
  await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
  await expect(header).toHaveClass("nav-up");

  // Note that above isn't actually making sure that the element
  // is not visible. So that has to be tested for. However, the
  // following will not work:
  //   await expect(header).toBeVisible();
  // This is because the opacity and positioning of the element
  // change but the display of the element does not. Playwright
  // does not check opacity of the element when determining the
  // visibility.
  // https://playwright.dev/docs/actionability#visible

  await expect(header).not.toHaveCSS("opacity", "1");

  // Scroll up and verify class changes back.
  await page.evaluate("window.scrollTo(0, 0)");
  await expect(header).toHaveClass("nav-down");

  // Now it's necessary to make sure the header is visible.
  // As per the above, the following would not work:
  //   await expect(header.isVisible).toBe(true);

  await expect(header).toHaveCSS("opacity", "1");
});

test("scroll-to-top widget has conditional visibility", async ({ page }) => {
  const progressScroll = page.locator("#progress-scroll");

  // Initially, the widget should be hidden because it
  // does not display when the user is scrolled to the top.
  await expect(progressScroll).toHaveCSS("visibility", "hidden");

  // Here we'll simulate scrolling to make the widget visible.
  await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
  await expect(progressScroll).toHaveCSS("visibility", "visible");

  // The widget normally has a three second timer that causes it
  // to disappear if there is no scrolling within that three
  // seconds. However, that does not apply if the widget is at
  // the bottom of the screen. So here the check is to wait for
  // three seconds but make sure that the widget is still visible.
  await page.waitForTimeout(3000);
  await expect(progressScroll).toHaveCSS("visibility", "visible");

  // Now we'll simulate scrolling back up a little.
  await page.evaluate("window.scrollTo(0, document.body.scrollHeight / 2)");

  // Wait for three seconds and check if the widget is hidden. It
  // should be because it's not at the top or bottom fo the viewport.
  await page.waitForTimeout(3000);
  await expect(progressScroll).toHaveCSS("visibility", "hidden");
});

test("dark/light mode changes background", async ({ page }) => {
  const lightModeLabel = page.locator('label[for="mode-light"]');
  const darkModeLabel = page.locator('label[for="mode-dark"]');
  const body = page.locator("body");

  await lightModeLabel.click();

  // Here the goal is to get the computed style from
  // the browser.
  const lightBgColor = await body.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );

  // While the CSS uses hsla, the computed style will
  // in the form of rgb. So the following, although it
  // exactly matches the CSS styling, would not work:
  //   expect(lightBgColor).toBe("hsla(0, 0%, 100%, 1)");
  expect(lightBgColor).toBe("rgb(255, 255, 255)");

  await darkModeLabel.click();

  const darkBgColor = await body.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );

  // As above, the following would not work:
  //   expect(darkBgColor).toBe("hsla(0, 0%, 0%, 1)");
  expect(darkBgColor).toBe("rgb(0, 0, 0)");
});

test("Scroll to top widget path drawing effect", async ({ page }) => {
  const progressPath = page.locator(".progress-wrap path");
  const initialStrokeDashoffset = await progressPath.evaluate(
    (node) => node.style.strokeDashoffset,
  );

  /*
  This is the starting value when the page is fully loaded and the user hasn't
  scrolled yet. The circle is fully "undrawn," so the strokeDashoffset is at
  its maximum value, which corresponds to the full length of the path.
  */
  // console.log(initialStrokeDashoffset); // 307.919

  // Simulate scroll down
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight / 2);
  });

  await page.waitForTimeout(100);

  const midScrollStrokeDashoffset = await progressPath.evaluate(
    (node) => node.style.strokeDashoffset,
  );

  /*
  This value is slightly less than the initial value, indicating that the user
  has scrolled down a bit (in this case, halfway down the page). The circle has
  begun to draw, reducing the strokeDashoffset as a result. Note that for some
  reason this returns with a px so that has to be removed.
  */
  // console.log(midScrollStrokeDashoffset); // 301.102px

  const initialOffset = Number(initialStrokeDashoffset);
  const midOffset = Number(midScrollStrokeDashoffset.replace("px", ""));

  expect(midOffset).toBeLessThan(initialOffset);

  // Simulate scroll to bottom
  await page.evaluate(() => {
    window.scrollBy(0, document.body.scrollHeight);
  });

  await page.waitForTimeout(100);

  const bottomScrollStrokeDashoffset = await progressPath.evaluate(
    (node) => node.style.strokeDashoffset,
  );

  /*
  This value being 0px makes perfect sense as it indicates the user has scrolled
  to the bottom of the page. At this point, the circle is fully drawn, so the
  strokeDashoffset should be 0, meaning there's no remaining portion of the path
  left to be drawn.
  */
  // console.log(bottomScrollStrokeDashoffset); // 0px

  const bottomOffset = Number(bottomScrollStrokeDashoffset.replace("px", ""));

  expect(bottomOffset).toBe(0);
});
