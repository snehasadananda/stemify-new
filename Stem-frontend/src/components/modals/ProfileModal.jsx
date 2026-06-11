import { useState } from "react";
import { API_BASE_URL } from "../../config";
import "./ProfileModal.css";

export default function ProfileModal({ onClose }) {
  const user = JSON.parse(
    localStorage.getItem("stemify_user") || localStorage.getItem("user") || "{}"
  );
  const token = localStorage.getItem("stemify_token") || localStorage.getItem("token");

  const [name] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePasswordUpdate = async () => {
    setMessage("");

    if (!currentPassword || !newPassword) {
      setMessage("Current password and new password are required.");
      return;
    }

    setLoading(true);

    if (!token) {
      setMessage("You are not logged in. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.message || "Unable to update password.");
        return;
      }

      setMessage(data?.message || "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage("Unable to update password.");
    } finally {
      setLoading(false);
    }
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
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {message && <div className="password-message">{message}</div>}
          <button className="saveBtn" onClick={handlePasswordUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
