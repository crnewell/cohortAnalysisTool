import React, { useState } from "react";
import { loginUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const res = loginUser(username, password);
    if (res.success) {
      navigate("/cohort");
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Don’t have an account? <a href="/register">Register</a>
      </p>
      <p>
        Forgot password? <a href="/reset">Reset Password</a>
      </p>
    </div>
  );
}