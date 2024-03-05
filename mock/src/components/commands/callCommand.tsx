import { REPLFunction } from "./commandFunctions";
import { load } from "./commandFunctions.tsx";
import { mode } from "./commandFunctions.tsx";
import { view } from "./commandFunctions.tsx";
import { search } from "./commandFunctions.tsx";

/**
 * Data structure of string keys mapped to REPLFunctions that holds
 * valid commands. If you are a developer, edit this data structure
 * so that it holds the name and function of the command
 */
const commandDictionary: { [key: string]: REPLFunction } = {
  load_csv: load,
  view: view,
  mode: mode,
  search: search,
};
/**
 * Constant to hold the valud of the string input to the input box
 */
export let commandString: string = "";
/**
 * Class to call a REPL Function based on the first argument
 * of the passed in command string
 */
export class InputHandler {
  static handleCommand(command: Array<string>): String | String[][] {
    commandString = command[0];

    const func = commandDictionary[command[0]];

    if (func) {
      return func(command);
    }
    return "Invalid command";
  }
}
