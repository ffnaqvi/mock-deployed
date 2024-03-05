import { expect, test } from "@playwright/test";

/**
 * A method to go to the page before each test
 */
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});

/**
 * A helper function to prevent repetitive valid login
 * @param page 
 */
async function login(page) {
  await page.getByLabel("username").fill("Alyssa");
  await page.getByLabel("password").fill("A");
  await page.getByLabel("Login").click();
}

/**
 * A test to ensure that all of the frontend elements have the correct
 * output when load_csv is entered in the command box in brief mode
 */
test("valid updates everything correctly", async ({ page }) => {
  //login
  login(page);

  //valid load input
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");

  //The text in command has changed
  await expect(page.getByLabel("Command input")).toHaveValue("load_csv header");

  //Values are properly stored in history after entered after successful load
  await page.getByRole("button", { name: "Submit" }).click();
  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("File successfully loaded"); // successful output
});

/**
 * A test to ensure that all of the frontend elements have the correct
 * output when load_csv is entered in the command box in verbose mode
 */
test("valid updates everything correctly using verbose", async ({ page }) => {
  //login
  login(page);

  //change to verbose mode
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submit" }).click();

  //valid load input
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");

  //The text in command has changed
  await expect(page.getByLabel("Command input")).toHaveValue("load_csv header");

  //Values are properly stored in history after entered after successful load
  await page.getByRole("button", { name: "Submit" }).click();
  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });

  expect(secondChild).toEqual("Command: load_csv" + "\n" + "Output: "); // successful output in verbose

  const thirdChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.textContent;
  });
  expect(thirdChild).toEqual("File successfully loaded"); // successful output in verbose
});

/**
 * A test to ensure that all of the frontend elements have the correct
 * output when load_csv is entered with the special cases of csv data in
 * the command box in brief mode
 */
test("loading failures", async ({ page }) => {
  // login
  login(page);
  // loading non existent file
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv notReal");

  // Values are properly stored in history after entered after failed load
  await page.getByRole("button", { name: "Submit" }).click();
  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });

  expect(firstChild).toEqual("Failed to load file"); // Failed load due to invalid file

  // loading invalid file path
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv invalidFilePath");

  // Values are properly stored in history after entered after failed load
  await page.getByRole("button", { name: "Submit" }).click();
  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });

  expect(secondChild).toEqual("invalid File path"); // Failed load due to invalid file

  //loading invalid input form after load
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv hello bye");

  //Values are properly stored in history after entered after failed load
  await page.getByRole("button", { name: "Submit" }).click();
  const third = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.textContent;
  });

  expect(third).toEqual(
    "Invalid input, please enter the name of a csv file to load."
  ); // Failed load due to invalid input after load

  //loading malformed file
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv malformedData");

  //Values are properly stored in history after entered after successful load
  await page.getByRole("button", { name: "Submit" }).click();
  const fourth = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[3]?.textContent;
  });

  expect(fourth).toEqual("Data is malformed"); // Failed due to malformed data
});
