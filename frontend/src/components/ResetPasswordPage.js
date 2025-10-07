import React, { useState } from "react";
import { resetPassword } from "../utils/auth";

export default function ResetPasswordPage() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    const res = resetPassword(username, newPassword);
    setMessage(res.message);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br/>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        /><br/>
        <button type="submit">Reset</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
