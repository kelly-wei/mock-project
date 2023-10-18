import { test, expect } from "@playwright/test";

// confirms that playwright and tests functions using a numeric equation
test("is 1 + 1 = 2?", () => {
  expect(1 + 1).toBe(2);
});

// this tests confirms that an input bar is present upon page load. 
test("on page load, i see an input bar", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("Command input")).toBeVisible();
});

// this tests confirms that a submit button is present upon page load. 
test("on page load, i see a submit button", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(page.getByRole("button", {name: "Submitted 0 times"})).toBeVisible();
});

// this tests confirms that a command button to display a dialogue of valid commands is present upon page load. 
test("on page load, i see a button to show commands", async ({page}) => {
  await page.goto("http://localhost:8000/");
  await expect(page.getByRole("button", {name: "Show Commands"})).toBeVisible();
})

// this tests confirms that the label on the submit button increments by 1 on each click. 
test("after I click the input command, its label increments", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(
    page.getByRole("button", { name: "Submitted 0 times" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await page.getByRole("button", { name: "Submitted 3 times" }).click();
  await expect(
    page.getByRole("button", { name: "Submitted 4 times" })
  ).toBeVisible();
});

// this tests confirms that an invalid input appears if the user submits without entering commands
test("after I click the input command without any inputs, an invalid message appears",async ({page}) => {
  await page.goto("http://localhost:8000/");
  await expect(
    page.getByRole("button", { name: "Submitted 0 times" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(page.getByRole("cell", {name: 'Invalid Input. Please enter a valid command.'})).toBeVisible();
})

// this tests confirms that after entering 'load_file blueRoomCSV', the success message is displayed. 
test("valid load_file", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file blueRoomCSV");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(page.getByRole("cell", {name: 'File successfully loaded.'})).toBeVisible()
});

// this tests confirms an error message displayed after not loading a file properly. 
test("invalid load_file", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file nugget");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(page.getByRole("cell", {name: 'File unsuccessfully loaded.'})).toBeVisible()
});

// this tests confirms that an invalid input is displayed if the user tries to view data without previously loading data. 
test("view without load does not work", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page
    .getByPlaceholder("Enter command here!")
    .fill("view");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(page.getByRole("cell", {name: 'Invalid Input. Please load the file first.'})).toBeVisible()
});

// this tests confirms that an invalid input is displayed if the user tries to sesarch data without previously loading data. 
test("search without load does not work", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search 2 chicken nugget");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(page.getByRole("cell", {name: 'Invalid Input. Please load the file first.'})).toBeVisible()
});

// this tests confirms that data is properly loaded and viewed. 
test("load_file and view", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file fruitsCSV");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("view");
  await page.getByRole("button", { name: "Submitted 1 time" }).click();
  await expect(page.getByRole("cell", { name: "Name" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Vines" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Yellow" })).toBeVisible();
});

// this tests what happens when the csv is only one column.
test("one column", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file oneColCSV");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("view");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(page.getByRole("cell", { name: "Tim" })).toBeVisible();
  
  await page.getByPlaceholder("Enter command here!").fill("search 1 Tom");
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await expect(page.getByRole("cell", { name: "Tom" })).toHaveCount(2);

  await page.getByPlaceholder("Enter command here!").fill("search 23 Tom");
  await page.getByRole("button", { name: "Submitted 3 times" }).click();
  await expect(page.getByRole("cell", { name: "Value not found." })).toBeVisible();
});

// this tests what happens when searching by column name without being viewed.
test("load_file and search by column name", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file fruitsCSV");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search Color Yellow");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(page.getByRole("cell", { name: "Yellow" })).toBeVisible();
});

// this tests confirms that data is loaded and searched using the column index without being viewed. 
test("load_file and search by column index", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file fruitsCSV");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search 3 Yellow");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(page.getByRole("cell", { name: "Yellow" })).toBeVisible();
});

// this tests confirms that data is properly reloaded. 
test("load a new file after a file as already been loaded", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file fruitsCSV");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page.getByPlaceholder("Enter command here!").fill("view");
  await page.getByRole('button', { name: "Submitted 1 times" }).click();
  await expect(page.getByRole("cell", { name: "Name" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Yellow" })).toBeVisible();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file blueRoomCSV");
    await page.getByRole("button", { name: "Submitted 2 times" }).click();
    await page
      .getByPlaceholder("Enter command here!")
      .fill("view");
    await page.getByRole("button", { name: "Submitted 3 times" }).click();
  await expect(page.getByRole("cell", { name: "Name" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Croissant" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Item" })).toBeVisible();
});

// this tests confirms that the user can switch between modes. 
test("switch from brief to verbose to brief", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(
    page.getByText("You are currently in brief mode.")
  ).toBeVisible();
  await page.getByPlaceholder("Enter command here!").fill("mode verbose");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.getByText("You are currently in verbose mode.")
  ).toBeVisible();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file fruitsCSV");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(page.getByText("load_file fruitsCSV")).toBeVisible(); //checks that the new command is printed

  await page.getByPlaceholder("Enter command here!").fill("mode brief");
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await expect(
    page.getByText("You are currently in brief mode.")
  ).toBeVisible();
  await expect(page.getByText("load_file fruitsCSV")).toBeVisible(); //checks that verbose command is still there
});

// this tests confirms the show command will display the command box dialogue. 
test("after I click the show command button, the command box dialogue is open", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(page.getByRole("button", { name: "Show Commands" })).toBeVisible();
  await page.getByRole("button", { name: "Show Commands" }).click();
  await expect(page.getByRole("cell", { name: "Command" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Choose your style of mode - brief or verbose. Verbose will show your entire input." })).toBeVisible();
  await expect(page.getByRole("cell", { name: "view" })).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Hide Commands" })).toBeVisible();
});

// this tests confirms the show command will display the command box dialogue and can be closed . 
test("after I click the show command button, the command box dialogue is open, click it again and its gone", async ({ page }) => {
  await page.goto("http://localhost:8000/");
  await expect(page.getByRole("button", { name: "Show Commands" })).toBeVisible();
  await page.getByRole("button", { name: "Show Commands" }).click();
  await expect(page.getByRole("cell", { name: "Command" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Choose your style of mode - brief or verbose. Verbose will show your entire input." })).toBeVisible();
  await expect(page.getByRole("cell", { name: "view" })).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Hide Commands" })).toBeVisible();
  await page.getByRole("button",  { name: "Hide Commands" }).click(); 
  await expect(page.getByRole("button", { name: "Show Commands" })).toBeVisible();
});

// this tests displays a message if a value isn't found using the search command (after a file was properly loaded). 
test("search for an invalid input", async ({page}) => {
  await page.goto("http://localhost:8000/");
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file campusBuildingsCSV");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search 1 Andrews");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(page.getByRole("cell", { name: "Value not found." })).toBeVisible();
})