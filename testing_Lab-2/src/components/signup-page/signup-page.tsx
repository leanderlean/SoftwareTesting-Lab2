import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./signup-page.module.css";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (email && password.length >= 8) {
      const userCreds = { name, email, password };
      localStorage.setItem("user", JSON.stringify(userCreds));
      localStorage.setItem("loggedEmail", email);
      alert(`Welcome ${name}. Your Credentials has been Saved!`);
      navigate("/add-notes");
    } else {
      alert("Input all fields first!");
      return;
    }
  };

  return (
    <div className={styles.createAccountCont}>
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
        <div className={styles.nav}>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
