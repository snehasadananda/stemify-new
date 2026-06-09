import VikiLayout from "../../components/viki/VikiLayout";

export default function AccountsDashboard() {
  return (
    <VikiLayout>
      <h2>Accounts Dashboard</h2>

      <p>Revenue Reports & Invoices</p>

      <ul>
        <li>Total Revenue</li>
        <li>Pending Payments</li>
        <li>Refunds</li>
        <li>Export CSV / PDF</li>
      </ul>
    </VikiLayout>
  );
}
