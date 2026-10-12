import { useState } from "react";
import ConsultationModal from "../components/Consultation/ConsultationModal";
import { ConsultationContext } from "./ConsultationContext";

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
