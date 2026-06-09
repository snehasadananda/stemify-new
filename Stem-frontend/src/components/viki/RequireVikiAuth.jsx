import { Navigate } from "react-router-dom";

export default function RequireVikiAuth({ children, allowed }) {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/vikiusers" />;
  }

  if (allowed && !allowed.includes(role)) {
    return <Navigate to="/vikiusers" />;
  }

  return children;
}
