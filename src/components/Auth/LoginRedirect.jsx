import { Navigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { safeClientReturnPath } from "../../utils/postLoginRoute";

// /login has no page of its own: it opens the login modal on the home page.
// With ?next=/dashboard/... (the "Login to Pay" billing email links to
// /login?next=/dashboard/my-plan) the client lands on that page after
// logging in -- or straight away if they are already signed in, where
// ProtectedRoute still enforces the client role. Any other `next` is ignored.
const LoginRedirect = () => {
  const { currentUser, authLoading } = useAuth();
  const [params] = useSearchParams();
  const next = safeClientReturnPath(params.get("next"));

  if (authLoading) return null;
  if (currentUser && next) return <Navigate to={next} replace />;

  return <Navigate to="/" state={{ openLogin: true, next }} replace />;
};

export default LoginRedirect;
