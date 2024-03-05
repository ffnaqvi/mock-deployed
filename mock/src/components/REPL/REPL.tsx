import { useState } from "react";
import "../../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput, commandStr } from "./REPLInput";
import React from "react";
import { CommandFunctions } from "../commands/commandFunctions";

/**
 * A function to share select variables between different classes using
 * state hooks
 * 
 * The information that is being shared is:
 * history, which represents past frontend interaction with the command box
 * setHistory, which represents the state hook for history
 * mode, which represents the mode of the program
 * setMode, which represents the state hook for mode 
 * 
 * @returns 
 */
export default function REPL() {
  const [history, setHistory] = useState<string[]>([]);
  const [mode, setMode] = useState<string>("brief");

  return (
    <div className="repl">
      <REPLHistory history={history} mode={mode} command={commandStr} />
      <hr></hr>
      <REPLInput
        history={history}
        setHistory={setHistory}
        mode={mode}
        setMode={setMode}
      />

      <CommandFunctions
        history={history}
        setHistory={setHistory}
        mode={mode}
        setMode={setMode}
      />
    </div>
  );
}
