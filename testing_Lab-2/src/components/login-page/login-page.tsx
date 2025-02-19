import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./login-page.module.css";

interface LoginProps {
  initialEmail?: string;
  initialPassword?: string;
}

const Login: React.FC<LoginProps> = ({
  initialEmail = "",
  initialPassword = "",
}) => {
  const [email, setEmail] = useState<string>(initialEmail);
  const [password, setPassword] = useState<string>(initialPassword);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successfullMessage, setSuccessfullMessage] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessfullMessage(null);

    const checkUser = localStorage.getItem("user");

    if (checkUser) {
      const {
        email: storedEmail,
        password: storedPassword,
        name: storedName,
      } = JSON.parse(checkUser);

      if (email === storedEmail && password === storedPassword) {
        localStorage.setItem("loggedEmail", email);
        setSuccessfullMessage(`Welcome back ${storedName}!`);
        navigate("/add-notes");
      } else {
        setErrorMessage("Incorrect email or password!");
      }
    } else {
      setErrorMessage("No account found!");
    }
  };

  return (
    <div className={styles.login}>
      <h2>Log in</h2>

      {(errorMessage || successfullMessage) && (
        <p className={errorMessage ? styles.error : styles.success}>
          {errorMessage || successfullMessage}
        </p>
      )}
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
