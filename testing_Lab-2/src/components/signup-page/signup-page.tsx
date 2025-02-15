import React, { useState } from "react";
import "./signup-page.css";
import { Link } from "react-router-dom";
import LoginPage from "./login-page"

const CreateAccount: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("User Created:", { name, email, password });
  };

  return (
    <div className="createAccountCont">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <br />

        <label>
          Email:
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <br />

        <label>
          Password:
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <br />

        <button type="submit">Sign Up</button>

        {/* <p>Already have an account? <Link to="/loginpage">Log in</Link></p> */}

      </form>
    </div>
  );
};

export default CreateAccount;