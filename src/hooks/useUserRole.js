import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/firebaseConfig";
import api from "../services/api";

// The single source of truth for "what can this authenticated user do" is
// always GET /api/auth/me (backed by the verified Firebase token -> Mongo
// user lookup), never anything read from local/client state -- mirrors the
// same pattern AdminRoute already used before this hook existed. Shared here
// so Navbar/AdminRoute/LoginModal don't each duplicate the same fetch.
export const useUserRole = () => {
  const { currentUser, authLoading } = useAuth();
  const [role, setRole] = useState(null);
  // uid the current `role` was actually resolved for (null = resolved "no
  // user", undefined = nothing resolved yet). Comparing this against
  // currentUser?.uid on every render -- instead of trusting a separately
  // effect-set roleLoading boolean -- avoids a real race on refresh: Auth
  // Context flips authLoading/currentUser together in one render, but this
  // hook's own effect only reacts to that a render later, so a plain
  // roleLoading state would still read stale (false, role=null) on the
  // in-between render and AdminRoute would redirect an admin to /dashboard
  // before the /auth/me fetch ever ran.
  const [resolvedUid, setResolvedUid] = useState(undefined);

  useEffect(() => {
    if (authLoading) return;

    const uid = currentUser?.uid || null;
    if (uid === resolvedUid) return;

    if (!currentUser) {
      setRole(null);
      setResolvedUid(null);
      return;
    }

    let cancelled = false;

    api
      .get("/auth/me")
      .then((res) => {
        if (cancelled) return;
        setRole(res.data?.data?.role || null);
        setResolvedUid(uid);
      })
      .catch((err) => {
        if (cancelled) return;
        // A disabled account still holds a valid Firebase session (Firebase
        // has no concept of our app-level status), so a 403 here is the only
        // signal the account was blocked after the user already signed in.
        // Sign them back out rather than just resolving role=null, or a
        // disabled client sitting on a route that never re-checks /auth/me
        // could keep browsing indefinitely.
        if (err.response?.status === 403) {
          auth.signOut().catch(() => {});
        }
        setRole(null);
        setResolvedUid(uid);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, currentUser, resolvedUid]);

  const roleLoading =
    authLoading || (!!currentUser && resolvedUid !== currentUser.uid);

  return { role, roleLoading };
};
