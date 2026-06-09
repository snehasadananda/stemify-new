import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";

import VikiLogin from "./pages/VikiLogin";
import RequireVikiAuth from "./components/viki/RequireVikiAuth";

import SuperAdminDashboard from "./pages/viki/SuperAdminDashboard";
import SubAdminDashboard from "./pages/viki/SubAdminDashboard";
import MarketingDashboard from "./pages/viki/MarketingDashboard";
import AccountsDashboard from "./pages/viki/AccountsDashboard";
import SupportDashboard from "./pages/viki/SupportDashboard";
import CmsEditor from "./pages/viki/CmsEditor";
import UserManagement from "./pages/viki/UserManagement";



function ProtectedRoute({ children }) {
  const token = localStorage.getItem("stemify_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RoleRedirect() {
  const token = localStorage.getItem("stemify_token");

  const rawUser = localStorage.getItem("stemify_user");

  let user = null;

  try {
    user =
      rawUser && rawUser !== "undefined" && rawUser !== "null"
        ? JSON.parse(rawUser)
        : null;
  } catch (e) {
    user = null;
  }

  if (!token) return <Navigate to="/login" replace />;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "teacher") return <Navigate to="/chat/teacher" replace />;
  if (user.role === "parent") return <Navigate to="/chat/parent" replace />;

  return <Navigate to="/chat/student" replace />;
}

function App() {
  return (
    <Router>

      <Routes>

        {/* ---------- PUBLIC ---------- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/vikiusers" element={<VikiLogin />} />


        {/* ---------- STUDENT / TEACHER / PARENT ---------- */}
        <Route
          path="/chat/student"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/teacher"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/parent"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route path="/chat" element={<RoleRedirect />} />


        {/* ---------- VIKI PORTAL (INTERNAL USERS) ---------- */}

        <Route
          path="/viki/dashboard/superadmin"
          element={
            <RequireVikiAuth allowed={["SUPER_ADMIN"]}>
              <SuperAdminDashboard />
            </RequireVikiAuth>
          }
        />

        <Route
          path="/viki/dashboard/subadmin"
          element={
            <RequireVikiAuth allowed={["SUB_ADMIN"]}>
              <SubAdminDashboard />
            </RequireVikiAuth>
          }
        />

        <Route
          path="/viki/dashboard/marketing"
          element={
            <RequireVikiAuth allowed={["MARKETING"]}>
              <MarketingDashboard />
            </RequireVikiAuth>
          }
        />

        <Route
          path="/viki/dashboard/accounts"
          element={
            <RequireVikiAuth allowed={["ACCOUNTS"]}>
              <AccountsDashboard />
            </RequireVikiAuth>
          }
        />

        <Route
          path="/viki/dashboard/support"
          element={
            <RequireVikiAuth allowed={["SUPPORT"]}>
              <SupportDashboard />
            </RequireVikiAuth>
          }
        />

        <Route
           path="/viki/cms"
           element={
            <RequireVikiAuth allowed={["SUPER_ADMIN"]}>
              <CmsEditor />
            </RequireVikiAuth>
          }
        />

         <Route
           path="/viki/users"
           element={
            <RequireVikiAuth allowed={["SUPER_ADMIN","SUB_ADMIN"]}>
               <UserManagement />
            </RequireVikiAuth>
          }
        />

      </Routes>

    </Router>
  );
}

export default App;
