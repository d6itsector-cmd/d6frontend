import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useUserRole } from "../hooks/useUserRole";

const AdminRoute = ({ children }) => {
  const { currentUser, authLoading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/" state={{ openLogin: true }} replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
