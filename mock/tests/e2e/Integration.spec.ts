import { expect, test } from "@playwright/test";

/**
 * A function to go to the page before each test
 */
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});

/**
 * A helper function to prevent repeititive VALID login
 * @param page
 */
async function login(page) {
  await page.getByLabel("username").fill("Alyssa");
  await page.getByLabel("password").fill("A");
  await page.getByLabel("Login").click();
}

/**
 * A test to ensure that the output of the load_csv changes to display the
 * comamnd and output properly when the mode is switched to verbose
 */
test("mode and load", async ({ page }) => {
  //login
  await login(page);

  //Set mode to verbose
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submit" }).click();

  //Retrieve the mode status text
  const modeStatusText = await page.evaluate(() => {
    const modeStatusElement = document.querySelector(
      'text[aria-label="mode status"]'
    );
    return modeStatusElement?.textContent;
  });
  expect(modeStatusText).toEqual(`Current mode is: verbose`);

  //Execute command to load data
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv emptyData");
  await page.getByRole("button", { name: "Submit" }).click();

  //Check if the load output is correct
  const outputText = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(outputText).toEqual("Command: load_csv\nOutput: ");

  //Check if the data was successfully loaded
  const loadStatusText = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.textContent;
  });
  expect(loadStatusText).toEqual("File successfully loaded");
});

/**
 * A test to ensure that the interaction between the load_csv, view, and 
 * search commands is as expected when used as instructed in brief mode
 */
test("brief load, view, search", async ({ page }) => {
  // login
  await login(page);

  //load file
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");
  await page.getByRole("button", { name: "Submit" }).click();

  //Retrieve the mode status text
  const modeStatusText = await page.evaluate(() => {
    const modeStatusElement = document.querySelector(
      'text[aria-label="mode status"]'
    );
    return modeStatusElement?.textContent;
  });
  expect(modeStatusText).toEqual(`Current mode is: brief`);

  //Execute command to view data
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submit" }).click();

  //Check if the view output is correct
  const outputText = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(outputText).toEqual(
    "FoodTypeCuisineCalories (per 100g)Price ($)SushiDishJapanese13010TacosDishMexican2186Tandoori ChickenDishIndian2208Mozerella SticksAppetizerItalian1315FalafelDishMiddle Eastern3334"
  );

  //checks the searching
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 2 Indian");
  await page.getByRole("button", { name: "Submit" }).click();

  // Check if the data was successfully searched
  const loadStatusText = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.textContent;
  });
  expect(loadStatusText).toEqual("Tandoori ChickenDishIndian2208");
});

/**
 * A test to ensure that the interaction between the load_csv, view, and 
 * search commands is as expected when used as instructed in verbose mode
 */
test("verbose load, view, search", async ({ page }) => {
  //login
  await login(page);

  //Set mode to verbose
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submit" }).click();

  //Retrieve the mode status text
  const modeStatusText = await page.evaluate(() => {
    const modeStatusElement = document.querySelector(
      'text[aria-label="mode status"]'
    );
    return modeStatusElement?.textContent;
  });
  expect(modeStatusText).toEqual(`Current mode is: verbose`);

  //Check if the mode output is correct
  const modeSwitched = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(modeSwitched).toEqual("Mode Switched");

  //load
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");
  await page.getByRole("button", { name: "Submit" }).click();

  const loadText = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(loadText).toEqual("Command: load_csv\nOutput: ");

  const loadText2 = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.textContent;
  });
  expect(loadText2).toEqual("File successfully loaded");

  //view data
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submit" }).click();

  const viewText = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[3]?.textContent;
  });
  expect(viewText).toEqual("Command: view\nOutput: ");

  const viewText2 = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[4]?.textContent;
  });
  expect(viewText2).toEqual(
    "FoodTypeCuisineCalories (per 100g)Price ($)SushiDishJapanese13010TacosDishMexican2186Tandoori ChickenDishIndian2208Mozerella SticksAppetizerItalian1315FalafelDishMiddle Eastern3334"
  );

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 2 Indian");
  await page.getByRole("button", { name: "Submit" }).click();

  //check if search successful
  const searchText = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[5]?.textContent;
  });
  expect(searchText).toEqual("Command: search\nOutput: ");

  const searchText2 = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[6]?.textContent;
  });
  expect(searchText2).toEqual("Tandoori ChickenDishIndian2208");
});

/**
 * A test to ensure that the interaction between the load_csv, view, and 
 * search commands is as expected when load_csv has incorrect input
 * in brief mode
 */
test("invalid load, view, search", async ({ page }) => {
  //login
  await login(page);

  //load file
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv malformedData");
  await page.getByRole("button", { name: "Submit" }).click();

  //view
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submit" }).click();

  //search
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 2 Indian");
  await page.getByRole("button", { name: "Submit" }).click();

  // Check if the output is correct
  const outputText = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(outputText).toEqual("Data is malformed");

  // Check if the data was successfully loaded
  const viewText = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(viewText).toEqual("CSV file hasn't been loaded");

  // Check if the data was successfully loaded
  const searchText = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[2]?.textContent;
  });
  expect(searchText).toEqual("CSV file hasn't been loaded");
});

/**
 * A test to ensure that the interaction between the load_csv and 
 * search commands is as expected when used as instructed in brief mode
 * and used without load
 */
test("load and search", async ({ page }) => {
  //login
  await login(page);

  //Set mode to verbose
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");
  await page.getByRole("button", { name: "Submit" }).click();

  //Execute command to load data
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 2 Indian");
  await page.getByRole("button", { name: "Submit" }).click();

  //Check if the data was successfully loaded
  const loadStatusText = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(loadStatusText).toEqual("File successfully loaded");

  //Check if the output is correct
  const outputText = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(outputText).toEqual("Tandoori ChickenDishIndian2208");
});

/**
 * A test to ensure that the interaction between the load_csv and 
 * frontend interaction with the log out button is as expected
 */
test("load and then log out", async ({ page }) => {
  // login
  await login(page);

  // Set mode to verbose
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");
  await page.getByRole("button", { name: "Submit" }).click();

  // Check if the data was successfully loaded
  const loadStatusText = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(loadStatusText).toEqual("File successfully loaded");

  // Signout state back to front page
  await page.getByLabel("Sign Out").click();
  await expect(page.getByLabel("Sign Out")).not.toBeVisible(); // Command input compontents does not appear
  await expect(page.getByLabel("Command input")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Submit" })).not.toBeVisible();
});

/**
 * A test to ensure that the interaction between the load_csv and another
 * load_csv command is successful and the frontend messages displayed are
 * as expected
 */
test("load and load", async ({ page }) => {
  // login
  await login(page);

  // Set mode to verbose
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");
  await page.getByRole("button", { name: "Submit" }).click();

  // Check if the data was successfully loaded
  const loadStatusText = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[0]?.textContent;
  });
  expect(loadStatusText).toEqual("File successfully loaded");

  // Set mode to verbose
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_csv header");
  await page.getByRole("button", { name: "Submit" }).click();

  // Check if the data was successfully loaded
  const second = await page.evaluate(() => {
    const history = document.querySelector(".repl-history");
    return history?.children[1]?.textContent;
  });
  expect(second).toEqual("File successfully loaded");
});
