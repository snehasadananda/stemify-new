import "./LoginPage.css";
import stemifyLogo from "../assets/stemify-logo.png";

import robotBody from "../assets/robot-body.png";
import robotHead from "../assets/robot-head.png"; // head + eyes open
import robotEyesClosed from "../assets/robot-eyes-closed.png";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function LoginPage() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [robotState, setRobotState] = useState("idle"); // "idle" | "error" | "passwordToggle"

  const triggerRobotError = () => {
    setRobotState("error");
    // reset back to idle after animation
    setTimeout(() => setRobotState("idle"), 800);
  };

  const triggerRobotPasswordReaction = () => {
    setRobotState("passwordToggle");
    // reset back to idle after animation
    setTimeout(() => setRobotState("idle"), 900);
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    if (!email || !pass) {
      setError("Please enter both email/phone and password.");
      triggerRobotError();
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email.trim(),
          password: pass.trim(),
        }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok || data.success === false) {
        setError(data.error || data.message || "Login failed.");
        triggerRobotError();
        setLoading(false);
        return;
      }
      const token = data.token ?? data.data?.token;
      const userObj= data.user ?? data.data;

      if (!token){
        setError("login failed:no token received. check console,");
        triggerRobotError();
        setLoading(false);
        return;
      }

      const normalizedUser = {
        ...userObj,
        role: (userObj?.role || "student").toLowerCase(),
      };

      localStorage.setItem("stemify_token", token);
      localStorage.setItem("stemify_user", JSON.stringify(normalizedUser));

          const role = normalizedUser.role;
    const redirect =
      data.redirectPath ||
      (role === "teacher" ? "/chat/teacher" :
       role === "parent"  ? "/chat/parent"  :
       "/chat/student");

    navigate(redirect);

  } catch (err) {
    console.error("Login error:", err);
    setError("Something went wrong. Please try again.");
    triggerRobotError();
  } finally {
    setLoading(false);
  }
};

  

  const handleTogglePassword = () => {
    setShowPass((prev) => !prev);
    triggerRobotPasswordReaction();
  };

  return (
    <div className="login-wrapper">
      <div className="login-overlay"></div>

      <div className="login-center login-animate">
        <Link to="/">
          <img
            src={stemifyLogo}
            alt="STEMIFY Logo"
            className="login-logo clickable-logo"
          />
        </Link>

        <div className="login-card">
          <div className="input-group">
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email / Phone Number</label>
          </div>

          <div className="input-group password-group">
            <input
              type={showPass ? "text" : "password"}
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <label>Password</label>

            <span className="eye-icon" onClick={handleTogglePassword}>
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="signup-text">
            Don’t have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>

        {/* ROBOT BLOCK */}
        <div className="login-robot">
          <div className="robot-float">
            <div className={`robot-core ${robotState}`}>
              <img
                src={robotBody}
                alt="Robot body"
                className="robot-body"
              />

              <div className="robot-head-wrapper">
                <img
                  src={robotHead}
                  alt="Robot head"
                  className="robot-head-base"
                />
                {/* Eyes closed overlay – visible when password is shown */}
                <img
                  src={robotEyesClosed}
                  alt=""
                  className={`robot-eyes-closed ${showPass ? "visible" : ""}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>
          © {year} STEMIFY. All rights reserved. | Powered by{" "}
          <a href="https://vikimediatec.com/" target="_blank" rel="noreferrer">
            Vikimediatec Pvt Ltd
          </a>
        </p>
      </footer>
    </div>
  );
}

export default LoginPage;
