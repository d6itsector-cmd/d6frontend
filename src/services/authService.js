import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, googleProvider } from "../firebase/firebaseConfig";

export const registerWithEmail = async (email, password, displayName) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(user, { displayName });
  }

  await sendEmailVerification(user);

  return user;
};

export const loginWithEmail = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const loginWithGoogle = async () => {
  const { user } = await signInWithPopup(auth, googleProvider);
  return user;
};

export const logout = () => signOut(auth);

export const sendPasswordReset = (email) => sendPasswordResetEmail(auth, email);

export const resendVerificationEmail = (user) => sendEmailVerification(user);

export const subscribeToAuthChanges = (callback) => onAuthStateChanged(auth, callback);

const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  "auth/network-request-failed": "Network error. Please check your connection.",
};

export const getAuthErrorMessage = (code) =>
  AUTH_ERROR_MESSAGES[code] || "Something went wrong. Please try again.";
