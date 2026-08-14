import { createContext, useContext, useState } from "react";
import ContactModal from "../components/ContactModal/ContactModal";

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const openContact = () => {
    setIsContactOpen(true);
  };

  const closeContact = () => {
    setIsContactOpen(false);
  };

  return (
    <ContactContext.Provider
      value={{
        openContact,
        closeContact,
      }}
    >
      {children}

      <ContactModal
        isOpen={isContactOpen}
        onClose={closeContact}
      />
    </ContactContext.Provider>
  );
};

export const useContact = () => {
  return useContext(ContactContext);
};