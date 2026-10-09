import { createContext, useContext, useState } from "react";
import LoginModal from "../components/Auth/LoginModal";
import { safeClientReturnPath } from "../utils/postLoginRoute";

const LoginModalContext = createContext();

export const LoginModalProvider = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // Optional client-portal page to land on after login (e.g. My Plan from a
  // payment email). Non-strings (an onClick event) and unsafe paths are ignored.
  const [nextPath, setNextPath] = useState(null);

  const openLogin = (next) => {
    setNextPath(safeClientReturnPath(next));
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
    setNextPath(null);
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
        next={nextPath}
        onClose={closeLogin}
      />
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => {
  return useContext(LoginModalContext);
};
