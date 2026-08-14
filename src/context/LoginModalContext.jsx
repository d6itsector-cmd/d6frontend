import { createContext, useContext, useState } from "react";
import LoginModal from "../components/Auth/LoginModal";

const LoginModalContext = createContext();

export const LoginModalProvider = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  return (
    <LoginModalContext.Provider
      value={{
        openLogin,
        closeLogin,
      }}
    >
      {children}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeLogin}
      />
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => {
  return useContext(LoginModalContext);
};
