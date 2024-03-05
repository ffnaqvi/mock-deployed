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
 * output when view is used with the index after load_csv is entered 
 * in the command box in brief mode
 */
test("valid view", async ({ page }) => {
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

  //input view command
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submit" }).click();

  const second = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(second).toEqual(
    "FoodTypeCuisineCalories (per 100g)Price ($)SushiDishJapanese13010TacosDishMexican2186Tandoori ChickenDishIndian2208Mozerella SticksAppetizerItalian1315FalafelDishMiddle Eastern3334"
  ); //header table view
});

/**
 * A test to ensure that all of the frontend elements have the correct
 * output when view is used without load_csv in brief mode
 */
test("view used without load", async ({ page }) => {
  //login
  login(page);

  //input view command
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submit" }).click();

  //check output
  await page.getByRole("button", { name: "Submit" }).click();
  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });

  expect(secondChild).toEqual("CSV file hasn't been loaded"); //failure response
});

/**
 * A test to ensure that all of the frontend elements have the correct
 * output when view is used with the index after load_csv is entered 
 * in the command box in verbose mode
 */
test("view verbose", async ({ page }) => {
  // login
  login(page);

  //input load function
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");
  await page.getByRole("button", { name: "Submit" }).click();

  //input mode function
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submit" }).click();

  //input view function
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submit" }).click();

  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.textContent;
  });

  expect(secondChild).toEqual("Command: view" + "\n" + "Output: "); // verbose mode

  const third = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[3]?.textContent;
  });

  expect(third).toEqual(
    "FoodTypeCuisineCalories (per 100g)Price ($)SushiDishJapanese13010TacosDishMexican2186Tandoori ChickenDishIndian2208Mozerella SticksAppetizerItalian1315FalafelDishMiddle Eastern3334"
  ); //valid view
});

/**
 * A test to ensure that all of the frontend elements have the correct
 * output when view is used with invalid commands after load_csv is entered 
 * in the command box in brief mode
 */
test("view invalid", async ({ page }) => {
  // login
  login(page);

  //load function
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");
  await page.getByRole("button", { name: "Submit" }).click();

  //test view with invalid command
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view hello");
  await page.getByRole("button", { name: "Submit" }).click();

  const secondChild = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });

  expect(secondChild).toEqual("Invalid Input"); // Failed load due to invalid file
});
