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
 * output when search is used with the index after load_csv is entered 
 * in the command box in brief mode
 */
test("valid search with index", async ({ page }) => {
  //login
  login(page);

  //valid load input
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");
  await page.getByRole("button", { name: "Submit" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("File successfully loaded"); // successful output

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 2 Indian");
  await page.getByRole("button", { name: "Submit" }).click();

  const second = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(second).toEqual("Tandoori ChickenDishIndian2208"); //search table results
});

/**
 * A test to ensure that all of the frontend elements have the correct
 * output when search is used with the indentifier after load_csv is entered 
 * in the command box in brief mode
 */
test("valid search with identifier", async ({ page }) => {
  //login
  login(page);

  //valid load input
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");
  await page.getByRole("button", { name: "Submit" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("File successfully loaded"); // successful output

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search Cuisine Indian");
  await page.getByRole("button", { name: "Submit" }).click();

  const second = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(second).toEqual("Tandoori ChickenDishIndian2208"); //search table results
});

/**
 * A test to ensure that all of the frontend elements have the correct
 * output when search is used with the index after load_csv is entered 
 * in the command box in verbose mode
 */
test("search verbose", async ({ page }) => {
  // login
  login(page);

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");

  // Values are properly stored in history after entered after failed load
  await page.getByRole("button", { name: "Submit" }).click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");

  // Values are properly stored in history after entered after failed load
  await page.getByRole("button", { name: "Submit" }).click();

  // loading invalid file path
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 2 Indian");

  // Values are properly stored in history after entered after failed load
  await page.getByRole("button", { name: "Submit" }).click();
  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.textContent;
  });

  expect(secondChild).toEqual("Command: search" + "\n" + "Output: "); // Failed load due to invalid file

  const third = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[3]?.textContent;
  });

  expect(third).toEqual("Tandoori ChickenDishIndian2208");
});

/**
 * A test to ensure that all of the frontend elements have the correct
 * output when search is used with the index without load_csv in the 
 * command box in brief mode
 */
test("search used without load", async ({ page }) => {
  // login
  login(page);

  // change to verbose mode
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 2 Indian");
  await page.getByRole("button", { name: "Submit" }).click();

  // Values are properly stored in history after entered after successful load
  await page.getByRole("button", { name: "Submit" }).click();
  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });

  expect(secondChild).toEqual("CSV file hasn't been loaded");
});

/**
 * A test to ensure that all of the frontend elements have the correct
 * output when search is used with invalid commans after after load_csv 
 * is entered in the command box in brief mode
 */
test("search invalid", async ({ page }) => {
  //login
  login(page);

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");

  //Values are properly stored in history after entered after failed load
  await page.getByRole("button", { name: "Submit" }).click();

  //loading invalid file path
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 1");

  //Values are properly stored in history after entered after failed load
  await page.getByRole("button", { name: "Submit" }).click();
  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });

  expect(secondChild).toEqual(
    "Invalid input, please enter the column identifier and search value separated by a space"
  ); // Failed load due to invalid file
});

/**
 * A test to ensure that all of the frontend elements have the correct
 * output when search is used with an invalid index after load_csv is entered 
 * in the command box in brief mode
 */
test("search invalid index", async ({ page }) => {
  // login
  login(page);

  // valid load input
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");
  await page.getByRole("button", { name: "Submit" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("File successfully loaded"); // successful output

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 20 Indian");
  await page.getByRole("button", { name: "Submit" }).click();

  const second = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(second).toEqual("Invalid Index Number");
});

/**
 * A test to ensure that all of the frontend elements have the correct
 * output when search is used with the index and has mltiple data rows
 * as output after load_csv is entered in the command box in brief mode
 */
test("valid search with multiple output", async ({ page }) => {
  // login
  login(page);

  // valid load input
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");
  await page.getByRole("button", { name: "Submit" }).click();

  const firstChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(firstChild).toEqual("File successfully loaded"); // successful output

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search Type Dish");
  await page.getByRole("button", { name: "Submit" }).click();

  const second = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(second).toEqual(
    "SushiDishJapanese13010TacosDishMexican2186Tandoori ChickenDishIndian2208FalafelDishMiddle Eastern3334"
  ); //search table results
});
