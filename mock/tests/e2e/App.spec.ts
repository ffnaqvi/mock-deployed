import { expect, test } from "@playwright/test";

/**
 * A function to navigate to the page before each test
 */
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});

/**
 * A helper function to ensure valid login
 * @param page
 */
async function login(page) {
  await page.getByLabel("username").fill("Alyssa");
  await page.getByLabel("password").fill("A");
  await page.getByLabel("Login").click();
}

/**
 * A test that ensures the visibility of frontend login page elements
 */
test("on page load, i see a login button", async ({ page }) => {
  await expect(page.getByLabel("Login")).toBeVisible();
  await expect(page.getByLabel("Command input")).not.toBeVisible();
  await expect(page.getByLabel("Sign Out")).not.toBeVisible();
});

/**
 * A test that ensures all of the elements of the page are as expected
 * during and after the login process
 */
test("on page load, i dont see the input box until login", async ({ page }) => {
  //Pre login state is valid
  await expect(page.getByLabel("Sign Out")).not.toBeVisible();
  await expect(page.getByLabel("Command input")).not.toBeVisible();

  //Valid login (correct username and password)
  login(page);

  //Post login state is valid
  await expect(page.getByLabel("Sign Out")).toBeVisible();
  await expect(page.getByLabel("Command input")).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
});

/**
 * A test to ensure that incorrect login information does not
 * display the private page
 */
test("on page load, incorrect login does not show input box", async ({
  page,
}) => {
  await expect(page.getByLabel("Sign Out")).not.toBeVisible();
  await expect(page.getByLabel("Command input")).not.toBeVisible();

  //click the login button and login properly
  await page.getByLabel("username").fill("Invalid");
  await page.getByLabel("password").fill("Input");
  await page.getByLabel("Login").click();

  //post login state should be unchaged
  await expect(page.getByLabel("Sign Out")).not.toBeVisible(); // Command input compontents does not appear
  await expect(page.getByLabel("Command input")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Submit" })).not.toBeVisible();
});

/**
 * A test to ensure that the login and sign out button work when used
 * sequentially
 */
test("on page load, login then signout will bring me back to front page", async ({
  page,
}) => {
  await expect(page.getByLabel("Sign Out")).not.toBeVisible();
  await expect(page.getByLabel("Command input")).not.toBeVisible();

  //click the login button and login properly
  login(page);

  //Post login state is valid
  await expect(page.getByLabel("Sign Out")).toBeVisible();
  await expect(page.getByLabel("Command input")).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();

  //Signout state back to front page
  await page.getByLabel("Sign Out").click();
  await expect(page.getByLabel("Sign Out")).not.toBeVisible();
  await expect(page.getByLabel("Command input")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Submit" })).not.toBeVisible();
});

/**
 * A test to ensure that a user clicking and typing into the input box
 * causes the text in the box to change
 */
test("after I type into the input box, its text changes", async ({ page }) => {
  //login
  login(page);

  //input text
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");

  //The text in command has changed
  await expect(page.getByLabel("Command input")).toHaveValue("Awesome command");
});

/**
 * A test to ensure that an invalid command does not simply display the invalid command,
 * but displays the invalid command message
 */
test("after I type and enter random invalid command into the input box, the history box is updated", async ({
  page,
}) => {
  //login
  login(page);

  //input text
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");

  //Values are properly stored in history after entered
  await page.getByRole("button", { name: "Submit" }).click();
  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("Invalid command");
});
