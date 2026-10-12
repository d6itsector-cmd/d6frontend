import { createContext, useContext } from "react";

// The provider component lives in ConsultationProvider.jsx so this module only exports
// non-components, which keeps React Fast Refresh working for both files.

// Create Context
export const ConsultationContext = createContext();

// Custom Hook
export const useConsultation = () => {
  return useContext(ConsultationContext);
};