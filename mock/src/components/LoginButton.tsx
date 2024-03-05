import React, { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { usernamePassword } from "./data/mockData";

/**
 * Interface to keep track of the boolean of whether or not a user 
 * is logged in and the state hook for the loggedIn boolean
 */
interface loginProps {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

/**
 * A function that represents a front end login button and authenticates correct
 * user login information
 * 
 * If logged in, a sign out button appears
 * 
 * If not logged in, a log in button and instructions for logging in appear
 * 
 * @param props 
 * @returns 
 */
export function LoginButton(props: loginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const authenticate = () => {
    if (usernamePassword.has(username)) {
      // If the username exists, check if the password matches
      if (usernamePassword.get(username) === password) {
        const newValue = !props.isLoggedIn;
        props.setIsLoggedIn(newValue);
      } else {
        setError("Incorrect password");
      }
    } else {
      setError("Username not found");
    }
  };

  if (props.isLoggedIn) {
    return (
      <button aria-label="Sign Out" onClick={authenticate}>
        Sign out
      </button>
    );
  } else {
    return (
      <div>
        <input
          aria-label="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Username"
        />
        <input
          aria-label="password"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
        />
        <button aria-label="Login" onClick={authenticate}>
          Login
        </button>
        <p>
          Hello! Welcome to our Mock. The usename and password to sign in is
          "Alyssa", "A" (respectively) OR "Faizah", "F" (respectively). Once you are signed in, 
          you can call commands such as load_csv file, mode, search header file, and view! If an invalid 
          command is entered, you will receive an error message!
        </p>
        {error && <p>{error}</p>}
      </div>
    );
  }
}
