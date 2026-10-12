import { createContext, useContext } from "react";

// The provider component lives in ContactProvider.jsx so this module only exports
// non-components, which keeps React Fast Refresh working for both files.
export const ContactContext = createContext();

export const useContact = () => {
  return useContext(ContactContext);
};