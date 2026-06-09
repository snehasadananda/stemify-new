export const vikiMenu = {
  SUPER_ADMIN: [
    { label: "Dashboard", path: "/viki/dashboard/superadmin" },
    { label: "Users Management", path: "/viki/users" },
    { label: "Plans & Pricing", path: "/viki/plans" },
    { label: "CMS Pages", path: "/viki/cms" },
    { label: "System Monitoring", path: "/viki/monitoring" },
    { label: "Audit Logs", path: "/viki/audit" }
  ],

  SUB_ADMIN: [
    { label: "Dashboard", path: "/viki/dashboard/subadmin" },
    { label: "User Control", path: "/viki/users" },
    { label: "Server Health", path: "/viki/monitoring" },
    { label: "Login History", path: "/viki/login-logs" },
    { label: "Error Reports", path: "/viki/errors" }
  ],

  MARKETING: [
    { label: "Dashboard", path: "/viki/dashboard/marketing" },
    { label: "Schools", path: "/viki/schools" },
    { label: "Discount Reports", path: "/viki/discounts" }
  ],

  ACCOUNTS: [
    { label: "Dashboard", path: "/viki/dashboard/accounts" },
    { label: "Revenue Reports", path: "/viki/reports" },
    { label: "Invoices", path: "/viki/invoices" }
  ],

  SUPPORT: [
    { label: "Dashboard", path: "/viki/dashboard/support" },
    { label: "Users", path: "/viki/users" },
    { label: "Password Resets", path: "/viki/password-resets" }
  ]
};
