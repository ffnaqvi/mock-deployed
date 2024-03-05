import "../../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "../ControlledInput";
import { InputHandler } from "../commands/callCommand";
import React from "react";

/**
 * An interface to store the command history of the REPL, 
 * a state hook to alter the history of the program's REPL commands,
 * a string mode to indicate the mode of the program,
 * and a state hook to change the mode of the program
 */
interface REPLInputProps {
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
}

//A constant to represent the first argument of a user's command
export let commandStr: string = "";

/**
 * A function to handle the frontend interaction with the
 * command line box
 */
export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");

  /**
   * A function to handle the functionality of frontend interaction
   * with the submit button
   * 
   * Will add frontend interaction with the command box to be displayed
   * to the front end, where the format depends on the mode of the 
   * prorgam
   * 
   * @param commandString 
   */
  function handleClick(commandString: string) {
    let output;
    let commandLine;

    const commandArray: string[] = commandString.split(" ");
    commandStr = commandArray[0];
    output = InputHandler.handleCommand(commandArray);

    //sets the history depending on the mode of the program
    if (props.mode === "verbose") {
      commandLine = "Command: " + commandStr + "\nOutput: ";
      props.setHistory([...props.history, commandLine, output]);
    } else {
      props.setHistory([...props.history, output]);
    }

    setCommandString("");
  }

  //Content to be displayed to the frontend
  return (
    <div className="repl-input">
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button aria-label="Submit" onClick={() => handleClick(commandString)}>
        Submit{" "}
      </button>
      <text aria-label="mode status">Current mode is: {props.mode}</text>
    </div>
  );
}
