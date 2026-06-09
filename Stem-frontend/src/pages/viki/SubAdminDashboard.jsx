import VikiLayout from "../../components/viki/VikiLayout";

export default function SubAdminDashboard() {
  return (
    <VikiLayout>
      <h2>Sub Admin Dashboard</h2>

      <ul>
        <li>User Control</li>
        <li>Server Health</li>
        <li>Error Logs</li>
      </ul>
    </VikiLayout>
  );
}
