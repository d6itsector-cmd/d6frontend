import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useUserRole } from "../hooks/useUserRole";
import AccessCheckError from "./AccessCheckError";

const AdminRoute = ({ children }) => {
  const { currentUser, authLoading } = useAuth();
  const { role, roleLoading, roleError } = useUserRole();

  if (authLoading || roleLoading) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/" state={{ openLogin: true }} replace />;
  }

  // Role unknown (backend unreachable / error) -- don't treat it as "client".
  if (roleError) {
    return <AccessCheckError />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
