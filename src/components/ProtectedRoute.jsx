import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useUserRole } from "../hooks/useUserRole";

const ProtectedRoute = ({ children }) => {
  const { currentUser, authLoading } = useAuth();
  // Invoked for its side effect as much as its value: this triggers the
  // /auth/me check that signs a disabled account back out (see
  // useUserRole), so a disabled client can't sit on a dashboard route that
  // never otherwise re-validates their status.
  const { roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/" state={{ openLogin: true }} replace />;
  }

  return children;
};

export default ProtectedRoute;
