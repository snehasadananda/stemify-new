import { Link, useLocation } from "react-router-dom";
import { vikiMenu } from "./vikiMenu";
import "./VikiSidebar.css";

export default function VikiSidebar({ role }) {
  const location = useLocation();
  const menu = vikiMenu[role] || [];

  return (
    <aside className="viki-sidebar">
      <h3 className="viki-sidebar-title">VIKI PORTAL</h3>

      {menu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={
            location.pathname === item.path
              ? "viki-link active"
              : "viki-link"
          }
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
