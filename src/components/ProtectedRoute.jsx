import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useUserRole } from "../hooks/useUserRole";

// `clientOnly` sends admins to /admin: every client-portal endpoint
// (dashboard, my-plan, payments, billing portal...) is requireRole("client")
// on the backend, so an admin here would only ever see 403s. The backend
// stays the real authority; this just routes each role to its own area.
const ProtectedRoute = ({ children, clientOnly = false }) => {
  const { currentUser, authLoading } = useAuth();
  // Invoked for its side effect as much as its value: this triggers the
  // /auth/me check that signs a disabled account back out (see
  // useUserRole), so a disabled client can't sit on a dashboard route that
  // never otherwise re-validates their status.
  const { role, roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/" state={{ openLogin: true }} replace />;
  }

  if (clientOnly && role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
