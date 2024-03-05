import React from "react";
import "../../styles/main.css";

/**
 * An interface to store the history of frontend interaction with the input box,
 * a string that represents the mode of the program,
 * and a string that represent the frontend input that corresponds to a command
 */
interface REPLHistoryProps {
  history: (string | string[])[];
  mode: string;
  command: string;
}

/**
 * A function to format and store user interaction with the frontend command box
 * depending on the entered command
 * 
 * Returns either a string or table format
 * 
 * @param props the interface REPLHistoryProps
 * @returns information to be displayed to the frontend
 */
export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div aria-label="repl-history" className="repl-history">
      {props.history.map((historyItem, index) => {
        if (typeof historyItem === "string") {
          return <pre key={index}>{historyItem}</pre>;
        } else {
          return (
            <div key={index}>
              <table>
                <tbody>
                  {historyItem[0].length === 0 ? (
                    <tr>
                      <td>&nbsp;</td>
                    </tr>
                  ) : (
                    historyItem.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Array.isArray(row) ? (
                          row.map((item, itemIndex) => (
                            <td key={itemIndex}>{item}</td>
                          ))
                        ) : (
                          <td key={rowIndex}>{row}</td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          );
        }
      })}
    </div>
  );
}
