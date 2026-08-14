import { createContext, useContext, useState } from "react";
import ConsultationModal from "../components/Consultation/ConsultationModal";

// Create Context
const ConsultationContext = createContext();

// Provider Component
export const ConsultationProvider = ({ children }) => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // Open Modal
  const openConsultation = () => {
    setIsConsultationOpen(true);
  };

  // Close Modal
  const closeConsultation = () => {
    setIsConsultationOpen(false);
  };

  return (
    <ConsultationContext.Provider
      value={{
        openConsultation,
        closeConsultation,
      }}
    >
      {children}

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={closeConsultation}
      />
    </ConsultationContext.Provider>
  );
};

// Custom Hook
export const useConsultation = () => {
  return useContext(ConsultationContext);
};