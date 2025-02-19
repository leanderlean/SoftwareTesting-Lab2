import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./login-page.module.css";

interface LoginProps {
  initialEmail?: string;
  initialPassword?: string;
  onLoginSuccess?: (email: string) => void;
  onLoginError?: (error: string) => void;
}

const Login: React.FC<LoginProps> = ({
  initialEmail = "",
  initialPassword = "",
  onLoginSuccess,
  onLoginError,
}) => {
  const [email, setEmail] = useState<string>(initialEmail);
  const [password, setPassword] = useState<string>(initialPassword);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const checkUser = localStorage.getItem("user");

    if (checkUser) {
      const {
        email: storedEmail,
        password: storedPassword,
        name: storedName,
      } = JSON.parse(checkUser);

      if (email === storedEmail && password === storedPassword) {
        localStorage.setItem("loggedEmail", email);
        onLoginSuccess?.(email); // Call the success callback if provided
        alert(`Welcome back ${storedName}!`);
        navigate("/add-notes");
      } else {
        onLoginError?.("Incorrect email or password!");
        alert("Incorrect email or password!");
      }
    } else {
      onLoginError?.("No account found!");
      alert("No account found!");
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
