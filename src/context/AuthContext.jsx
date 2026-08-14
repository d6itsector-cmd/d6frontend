import { createContext, useContext, useEffect, useState } from "react";

import { auth } from "../firebase/firebaseConfig";
import * as authService from "../services/authService";

const AuthContext = createContext();

const withAuthError = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (err) {
    throw new Error(authService.getAuthErrorMessage(err.code));
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setEmailVerified(user?.emailVerified ?? false);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const reloadUser = async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    setEmailVerified(auth.currentUser.emailVerified);
  };

  const value = {
    currentUser,
    authLoading,
    emailVerified,
    register: withAuthError(authService.registerWithEmail),
    login: withAuthError(authService.loginWithEmail),
    loginWithGoogle: withAuthError(authService.loginWithGoogle),
    logout: withAuthError(authService.logout),
    resetPassword: withAuthError(authService.sendPasswordReset),
    resendVerification: withAuthError(() =>
      authService.resendVerificationEmail(auth.currentUser)
    ),
    reloadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
