import { useEffect, useState } from "react";
import VikiLayout from "../../components/viki/VikiLayout";
import { getSuperStats } from "../../services/vikiService";
import "./SuperAdmin.css";

export default function SuperAdminDashboard() {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    getSuperStats().then(setStats);
  }, []);

  return (
  <VikiLayout>

    <h2 className="title">Super Admin Overview</h2>

    {!stats ? (
      <p>Loading...</p>
    ) : (

    <div className="grid">

      <div className="card">
        <h3>Total Users</h3>
        <p className="big">{stats.totalUsers}</p>
      </div>

      <div className="card">
        <h3>AI Responses</h3>
        <p className="big">{stats.responses}</p>
      </div>

      <div className="card">
        <h3>Abuse Chats</h3>
        <p className="big warn">{stats.abuse}</p>
      </div>

      <div className="card">
        <h3>Revenue (₹)</h3>
        <p className="big">{stats.revenue}</p>
      </div>

    </div>

    )}

    <div className="grid">

      <div className="card action">
        <h3>CMS Pages</h3>
        <button
          onClick={() => window.location="/viki/cms"}
        >
          Open CMS
        </button>
      </div>

      <div className="card action">
        <h3>User Management</h3>
        <button
          onClick={() => window.location="/viki/users"}
        >
          Manage
        </button>
      </div>

    </div>

  </VikiLayout>
  );
}
