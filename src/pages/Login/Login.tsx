// src/pages/Login/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setIsLoading(true);
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner fullPage message="Logging in..." />;

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <h2 className={styles.loginTitle}>
            Get these two right and I'll let you in:
          </h2>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              What is the meaning of life?
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Prove the Riemann Hypothesis:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Submit
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
