import { useNavigate } from "react-router-dom";
import "./VikiHeader.css";

export default function VikiHeader() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/vikiusers");
  };

  return (
    <header className="viki-header">
      <span className="viki-role">Role: {role}</span>
      <button onClick={logout} className="logout-btn">
        Logout
      </button>
    </header>
  );
}
