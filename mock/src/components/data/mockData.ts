/**
 * This class serves as a way to test the front end without backend logic
 * through modeling different kinds of csv files that are stored and accessed
 * from data structures
 */
export const usernamePassword = new Map<string, string>();
export const fileDictionary = new Map<string, string[][]>();
export const searchDictionary = new Map<string, string[][]>();
// Add username-password pairs to the map
usernamePassword.set("Alyssa", "A");
usernamePassword.set("Faizah", "F");

/**
 * Repesents a file with headers
 */
const dataHeader = [
  ["Food", "Type", "Cuisine", "Calories (per 100g)", "Price ($)"],
  ["Sushi", "Dish", "Japanese", "130", "10"],
  ["Tacos", "Dish", "Mexican", "218", "6"],
  ["Tandoori Chicken", "Dish", "Indian", "220", "8"],
  ["Mozerella Sticks", "Appetizer", "Italian", "131", "5"],
  ["Falafel", "Dish", "Middle Eastern", "333", "4"],
];

/**
 * Repesents a file with no headers
 */
const dataNoHeader = [
  ["Andrews", "Grinder", "North Campus"],
  ["Ratty", "Tomato Soup", "South Campus"],
  ["Blue Room", "Muffin", "Campus Center"],
];

//represents an empty csv
const emptyData = [[]];

//represents a file with an invalid file path
const invalidFilePath = [["invalid File path"]];

//represents a file with malformed data
const malformedData = [["Data is malformed"]];

//Creating file dictionary
fileDictionary.set("header", dataHeader);
fileDictionary.set("noHeader", dataNoHeader);
fileDictionary.set("emptyData", emptyData);
fileDictionary.set("invalidFilePath", invalidFilePath);
fileDictionary.set("malformedData", malformedData);

const useIndex = [["Tandoori Chicken", "Dish", "Indian", "220", "8"]];

const useHeader = [["Tandoori Chicken", "Dish", "Indian", "220", "8"]];

const invalidIndex = [["Invalid Index Number"]];

const noHeader = [[]];

const multOUtput = [
  ["Sushi", "Dish", "Japanese", "130", "10"],
  ["Tacos", "Dish", "Mexican", "218", "6"],
  ["Tandoori Chicken", "Dish", "Indian", "220", "8"],
  ["Falafel", "Dish", "Middle Eastern", "333", "4"],
];

/**
 * Adds mocked search input to the search mocked data structure
 */
searchDictionary.set("search2Indian", useIndex);
searchDictionary.set("searchCuisineIndian", useHeader);
searchDictionary.set("search20Indian", invalidIndex);
searchDictionary.set("searchFoodIndian", noHeader); // Data with no match/output
searchDictionary.set("searchTypeDish", multOUtput);
