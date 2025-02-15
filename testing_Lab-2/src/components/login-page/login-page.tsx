import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./login-page.module.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const checkUser = localStorage.getItem('user');
    if (checkUser) {
      const {email: storedEmail, password: storedPassword, name: storedName} = JSON.parse(checkUser)
      
      if (email === storedEmail && password === storedPassword) {
        alert(`Welcome back ${storedName}!`)
      } else {
        alert("Incorrect email or password!")
      }
    } else {
      alert("No account Found!")
    }

  };

  return (
    <div className={styles.login}>
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Log in</button>

        <div className={styles.nav}>
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
