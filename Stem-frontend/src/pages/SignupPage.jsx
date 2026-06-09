import "./SignupPage.css";
import stemifyLogo from "../assets/stemify-logo.png";
import robotImg from "../assets/robot.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function SignupPage() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [role, setRole] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [terms, setTerms] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const handleSignup = async () => {
    setError("");

    if (!email || !pass || !confirmPass || !role) {
      setError("Please fill all required fields.");
      return;
    }

    if (pass !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    if (!terms) {
      setError("Please agree to the Terms of Use.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username: email,
          password: pass,
          confirmPassword: confirmPass,
          role,
          schoolCode,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      let data = {};

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const responseText = await res.text();
        data = { message: responseText };
      }

      if (!res.ok) {
        if (res.status === 404) {
          setError("Signup endpoint is missing on the backend. /api/auth/register is not implemented.");
        } else {
          setError(data.error || data.message || `Signup failed (${res.status})`);
        }
        setLoading(false);
        return;
      }

      const responseData = data.data ?? data;

      if (responseData.debugOtp) {
        setOtp(responseData.debugOtp);
        setError("SMTP is not configured on the backend. Using the OTP generated in development mode.");
      }

      setOtpModal(true);
    } catch (err) {
      console.error("Signup error:", err);
      setError("Could not reach the signup API. Check the backend and try again.");
    }

    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp) {
      setError("Enter OTP");
      return;
    }

    setOtpLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username: email, otp }),
      });

      const data = await res.json();
      const payload = data.data ?? data;

      if (!res.ok) {
        setError(data.message || data.error || "OTP verification failed");
        setOtpLoading(false);
        return;
      }

      localStorage.setItem("stemify_token", payload.token);
      localStorage.setItem("stemify_user", JSON.stringify(payload.user));

      navigate(payload.redirectPath || "/chat");
    } catch (err) {
      console.error("OTP error:", err);
      setError("Something went wrong. Try again.");
    }

    setOtpLoading(false);
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-overlay"></div>

      <div className="signup-center signup-animate">
        <Link to="/">
          <img src={stemifyLogo} className="signup-logo clickable-logo" />
        </Link>

        <div className="signup-card">
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
            <span className="eye-icon" onClick={() => setShowPass(!showPass)}>
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="input-group password-group">
            <input
              type={showConfirmPass ? "text" : "password"}
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <label>Confirm Password</label>
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
            >
              {showConfirmPass ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="input-group">
            <input
              type="text"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value)}
            />
            <label>School Code</label>
          </div>

          <div className="user-type-row">
            <div
              className={`user-type-box ${role === "parent" ? "active" : ""}`}
              onClick={() => setRole("parent")}
            >
              👨‍👩‍👧 Parent
            </div>
            <div
              className={`user-type-box ${role === "teacher" ? "active" : ""}`}
              onClick={() => setRole("teacher")}
            >
              👩‍🏫 Teacher
            </div>
            <div
              className={`user-type-box ${role === "student" ? "active" : ""}`}
              onClick={() => setRole("student")}
            >
              👦 Student
            </div>
          </div>

          <div className="terms-row">
            <input
              type="checkbox"
              checked={terms}
              onChange={() => setTerms(!terms)}
            />{" "}
            <span>Terms of Use</span>
          </div>

          {error && <p className="signup-error">{error}</p>}

          <button
            className="signup-btn"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="login-text">
            Already have an account? <Link to="/login">Login Here</Link>
          </p>
        </div>

        <img src={robotImg} className="signup-robot" />
      </div>

      <footer className="footer">
        © {year} STEMIFY. All rights reserved. | Powered by{" "}
        <a href="https://vikimediatec.com/" target="_blank">
          Vikimediatec Pvt Ltd
        </a>
      </footer>

      {otpModal && (
        <div className="otp-modal">
          <div className="otp-box">
            <h2>Verify OTP</h2>
            <p>We have sent a 6-digit OTP to your email.</p>

            <input
              className="otp-input"
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              className="otp-btn"
              onClick={verifyOtp}
              disabled={otpLoading}
            >
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              className="otp-cancel-btn"
              onClick={() => setOtpModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignupPage;
