import { auth } from "../firebase/firebaseConfig";
import api from "../services/api";

// Role always comes from the verified backend record (GET /api/auth/me),
// never guessed on the frontend. Shared by LoginModal and Register's Google
// sign-in path so both routes a freshly-authenticated user the same way.
//
// A disabled account still authenticates fine with Firebase (Firebase has no
// concept of our app-level status), so /auth/me returning 403 here is the
// only signal that the account is blocked. Treating that the same as "no
// role yet" and falling back to /dashboard let disabled users straight in --
// instead we sign them back out and surface the block to the caller.
export const resolvePostLoginDestination = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data?.data?.role === "admin" ? "/admin" : "/dashboard";
  } catch (err) {
    if (err.response?.status === 403) {
      await auth.signOut().catch(() => {});
      throw new Error(
        err.response?.data?.message || "Your account has been disabled. Please contact support.",
        { cause: err }
      );
    }
    return "/dashboard";
  }
};
