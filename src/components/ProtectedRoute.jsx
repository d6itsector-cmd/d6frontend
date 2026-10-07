import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useUserRole } from "../hooks/useUserRole";
import AccessCheckError from "./AccessCheckError";

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
  const { role, roleLoading, roleError } = useUserRole();

  if (authLoading || roleLoading) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/" state={{ openLogin: true }} replace />;
  }

  // Role unknown (backend unreachable / error): an admin must not be dropped
  // into the client portal just because /auth/me failed.
  if (clientOnly && roleError) {
    return <AccessCheckError />;
  }

  if (clientOnly && role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
