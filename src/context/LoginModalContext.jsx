import { createContext, useContext } from "react";

// The provider component lives in LoginModalProvider.jsx so this module only exports
// non-components, which keeps React Fast Refresh working for both files.
export const LoginModalContext = createContext();

export const useLoginModal = () => {
  return useContext(LoginModalContext);
};
