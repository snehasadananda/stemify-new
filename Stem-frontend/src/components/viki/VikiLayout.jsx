import VikiSidebar from "./VikiSidebar";
import VikiHeader from "./VikiHeader";
import "./VikiLayout.css";

export default function VikiLayout({ children }) {
  const role = localStorage.getItem("role");

  return (
    <div className="viki-layout">
      <VikiSidebar role={role} />

      <main className="viki-main">
        <VikiHeader />
        <div className="viki-content">{children}</div>
      </main>
    </div>
  );
}
