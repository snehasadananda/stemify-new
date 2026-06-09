import { useState } from "react";
import "./ProfileModal.css";

export default function ProfileModal({ onClose }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [name] = useState(user?.name || "");
  const [password, setPassword] = useState("");

  const handlePasswordUpdate = () => {
    alert("Password update API coming soon!");
  };

  return (
    <div className="modalOverlay">
      <div className="profileModal">
        <button className="closeBtn" onClick={onClose}>✖</button>

        <div className="profile-header">
          <div className="avatar">{name?.charAt(0)}</div>
          <h2>{name}</h2>
        </div>

        <div className="form-section">
          <label>Change Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="saveBtn" onClick={handlePasswordUpdate}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
