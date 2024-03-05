import { Dispatch, SetStateAction } from "react";
import "../../styles/main.css";
import React from "react";
import { fileDictionary, searchDictionary } from "../data/mockData";

/**
 * Interface to return either a string or string[][] as
 * the strategy pattern interface
 */
export interface REPLFunction {
  (command: Array<string>): String | String[][];
}

/**
 * Interface to hold the history of commands/outputs, a state hook for history,
 * a string to represent the mode, and a statehook for mode
 */
interface REPLInputProps {
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>; //would cutomize the type
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
}

let modesProps: string;
let setModesProps: Dispatch<SetStateAction<string>>;
let historyProps: string[];
let setHistoryProps: Dispatch<SetStateAction<string[]>>;
let csvData: string[][];
let load_status = -1;

/**
 * Function to initialize REPLInputProps variables
 * @param props
 * @returns
 */
export function CommandFunctions(props: REPLInputProps) {
  // Assign props values to constants
  modesProps = props.mode;
  setModesProps = props.setMode;
  historyProps = props.history;
  setHistoryProps = props.setHistory;

  return <div></div>;
}

/**
 * A function to handle the front end switching between modes
 * by accessing and altering the REPLInputProps
 *
 * @param modeArray List of string of commands from the input
 * @returns a message to be printed to the frontend
 */
export const mode: REPLFunction = (modeArray: Array<string>): String => {
  if (modeArray.length != 1) {
    return "Invalid Input";
  }
  setModesProps(modesProps === "brief" ? "verbose" : "brief");
  return "Mode Switched";
};

/**
 * A function to handle the frontend interaction with a load csv command
 *
 * If the input is valid, the function will return a success message and
 * alter the load_status of the program. Otherwise, failure message will
 * be returned.
 *
 * @param modeArray List of string of commands from the input
 * @returns a message to be printed to the frontend
 */
export const load: REPLFunction = (loadFile: Array<string>): string => {
  if (loadFile.length !== 2) {
    return "Invalid input, please enter the name of a csv file to load.";
  }
  const fileName = loadFile[1];

  const loadedData = fileDictionary.get(fileName);
  if (
    loadedData &&
    loadedData[0][0] != "invalid File path" &&
    loadedData[0][0] != "Data is malformed"
  ) {
    load_status = 200;
    csvData = loadedData;
    return "File successfully loaded";
  } else {
    // Return backend specific error response
    if (loadedData) {
      return loadedData[0][0];
    }
    return "Failed to load file";
  }
};

/**
 * A function to handle the frontend viewing of csv
 *
 * If the command is valid and a csv has been loaded, the content of
 * the currently loaded csv will be displayed. Othwerwise, an
 * error message will be displayed
 *
 * @param modeArray List of string of commands from the input
 * @returns a message to be printed to the frontend
 */
export const view: REPLFunction = (
  viewFile: Array<string>
): string[][] | string => {
  if (viewFile.length != 1) {
    return "Invalid Input";
  }
  if (load_status == 200) {
    return csvData;
  } else {
    return "CSV file hasn't been loaded";
  }
};

/**
 * A function to handle the front end searching of csvs
 * by accessing mocked search data
 *
 * If a csv has been loaded and the command input is valid, the requested
 * information will be displayed. Otherwise, an instructional error message
 * will be displayed to the user.
 *
 * @param modeArray List of string of commands from the input
 * @returns a message to be printed to the frontend
 */
export const search: REPLFunction = (
  searchCommands: Array<string>
): string[][] | string => {
  console.log("load status is: " + load_status);
  if (load_status !== 200) {
    return "CSV file hasn't been loaded";
  }
  if (searchCommands.length !== 3) {
    return "Invalid input, please enter the column identifier and search value separated by a space";
  }
  const commandString =
    searchCommands[0] + searchCommands[1] + searchCommands[2];
  const output = searchDictionary.get(commandString);

  if (load_status === 200 && output && output[0][0] != "Invalid Index Number") {
    return output;
  } else {
    if (output) {
      return output[0][0];
    }
    return "File failed to search";
  }
};
