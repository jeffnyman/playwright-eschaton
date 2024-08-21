import { test, expect } from "@playwright/test";

test("check credentials", async ({ page }) => {
  await page.goto("/");

  const credentialsDiv = page.locator("#login_credentials");

  /*
  The logic below extracts the HTML content and replaces any <br> tags
  with newlines. Then an <h4> tag is removed. Specifically, the inner
  HTML is checked to replace the <br> tags with a newline. All of this
  is due to how the actual data is being returned.
  */
  const credentialsText = await credentialsDiv.evaluate((el) => {
    let html = el.innerHTML.replace(/<br\s*\/?>/gi, "\n");
    html = html.replace(/<h4>.*<\/h4>/, "");
    return html;
  });

  /*
  This logic is taking the credentials information that was found
  above and splitting the text by the newlines (which were put in
  place of the <br> tags). This is what gets the usernames.
  */
  const usernames = credentialsText
    .split("\n")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  const expectedUsernames = [
    "standard_user",
    "locked_out_user",
    "problem_user",
    "performance_glitch_user",
    "error_user",
    "visual_user",
  ];

  for (const username of expectedUsernames) {
    expect(usernames).toContain(username);
  }
});
