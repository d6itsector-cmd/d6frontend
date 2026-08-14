import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/tokens.css";
import "./index.css";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { LoginModalProvider } from "./context/LoginModalContext";
import { ConsultationProvider } from "./context/ConsultationContext";
import { ContactProvider } from "./context/ContactContext";

// BrowserRouter has to be the outermost piece here (not inside App, as it
// used to be) -- LoginModalProvider renders <LoginModal> as a sibling of
// <App>, and LoginModal calls useNavigate()/<Link>, which throw outside a
// Router. Moving BrowserRouter up means every provider's modal is inside
// Router context, not just the ones that happen not to need it.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LoginModalProvider>
          <ConsultationProvider>
            <ContactProvider>
              <App />
            </ContactProvider>
          </ConsultationProvider>
        </LoginModalProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);