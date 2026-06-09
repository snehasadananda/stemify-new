import { useState } from "react";
import { useNavigate } from "react-router-dom";
import stemifyLogo from "../assets/stemify-logo.png";
import "./VikiLogin.css";

export default function VikiLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("role", data.data.role);

      // ROLE BASED REDIRECT
      switch (data.data.role) {
        case "SUPER_ADMIN":
          navigate("/viki/dashboard/superadmin");
          break;

        case "SUB_ADMIN":
          navigate("/viki/dashboard/subadmin");
          break;

        case "MARKETING":
          navigate("/viki/dashboard/marketing");
          break;

        case "ACCOUNTS":
          navigate("/viki/dashboard/accounts");
          break;

        case "SUPPORT":
          navigate("/viki/dashboard/support");
          break;

        default:
          setError("Unauthorized portal access");
      }

    } catch (err) {
      setError("Server not reachable");
    }
  };

  return (
    <div className="viki-container">

      <div className="viki-card">

        <img src={stemifyLogo} className="viki-logo" />

        <h2 className="viki-title">Viki Users Portal</h2>

        <form onSubmit={handleSubmit} className="viki-form">

          <input
            name="username"
            placeholder="Username"
            className="viki-input"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="viki-input"
            onChange={handleChange}
          />

          {error && <p className="viki-error">{error}</p>}

          <button className="viki-btn">
            Login
          </button>

        </form>

        <p className="viki-note">
          This portal is only for internal Viki users
        </p>

      </div>
    </div>
  );
}
