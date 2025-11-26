import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";

export default function LoginPage() {
  const [username, setUsername] = useState("sv001");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/sso/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("Sai tài khoản hoặc mật khẩu");
        return;
      }

      const data = await res.json(); // { token, userId, fullName, role }
      const userData = {
        id: data.userId,
        fullName: data.fullName,
        role: data.role, // "STUDENT" | "TUTOR"
      };

      login(userData, data.token);

      if (data.role === "STUDENT") {
        navigate("/student/dashboard");
      } else if (data.role === "TUTOR") {
        navigate("/tutor/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Không kết nối được server");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Central Authentication Service</h2>
        <p className="login-subtitle">HCMUT Single Sign-On</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="primary-btn full-width">
            Log in
          </button>
        </form>

        <p className="demo-text">
          Demo: <b>sv001 / 123456</b> (Student) – <b>tt001 / 123456</b> (Tutor)
        </p>
      </div>
    </div>
  );
}
