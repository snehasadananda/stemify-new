import { useState } from "react";
import DropdownMenu from "./DropdownMenu";
import stemifyLogo from "../assets/stemify-logo.png";
import "./Topbar.css";

export default function Topbar({ onMenuClick, showMenuButton }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="chat-topbar">
      {/* MOBILE HAMBURGER */}
      {showMenuButton && (
        <button className="chat-topbar-hamburger" onClick={onMenuClick}>
          ☰
        </button>
      )}

      <div className="chat-topbar-logo-wrap">
        <img
          src={stemifyLogo}
          alt="STEMIFY"
          className="chat-topbar-logo"
          onClick={() => (window.location.href = "/")}
        />
      </div>

      <div className="chat-topbar-right">
        <button className="chat-topbar-share">Share</button>
        <button
          className="chat-topbar-dots"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          ⋮
        </button>

        {showMenu && <DropdownMenu />}
      </div>
    </header>
  );
}
