import { useState } from "react";
import "./DropdownMenu.css";
import ProfileModal from "./modals/ProfileModal";

export default function DropdownMenu() {
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/"; // redirect to homepage
  };

  return (
    <>
      <div className="dropdown-menu">
        <button
          className="dropdown-item"
          onClick={() => setShowProfile(true)}
        >
          Profile
        </button>

        <button
          className="dropdown-item"
          onClick={() => alert("Subscription module coming soon!")}
        >
          My Subscription
        </button>

        <button className="dropdown-item logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}
