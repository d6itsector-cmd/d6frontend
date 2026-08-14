import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import Navbar from "./components/Home/navbar/Navbar";
import ScrollToTop from "./components/Scroll/ScrollToTop";
import { useLoginModal } from "./context/LoginModalContext";

// ================= WEBSITE =================
import Home from "./pages/Home";
import About from "./pages/About";
import Industries from "./pages/Industries";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";

// ================= SERVICES =================
import SEO from "./pages/Services/SEO";
import SocialMedia from "./pages/Services/SocialMedia";
import EmailMarketing from "./pages/Services/EmailMarketing";
import GoogleAds from "./pages/Services/GoogleAds";
import WebsiteDevelopment from "./pages/Services/WebsiteDevelopment";

// ================= AUTH =================
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// ================= FALLBACK =================
import NotFound from "./pages/NotFound";

// ================= CLIENT DASHBOARD =================
import Dashboard from "./pages/Dashboard/Dashboard";

// ================= ADMIN =================
import AdminLayout from "./components/Admin/Layout/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard-admin";

// ================= ADMIN PAGES =================
import Clients from "./pages/Admin/Clients";
import Projects from "./pages/Admin/Projects";
import Leads from "./pages/Admin/Leads";
import ContactRequests from "./pages/Admin/ContactRequests";
import ConsultationRequests from "./pages/Admin/ConsultationRequests";
import DocumentsAdmin from "./pages/Admin/Documents-admin";
import Services from "./pages/Admin/Service-ad/Services-admin";
import PortfolioAdmin from "./pages/Admin/portfolio-ad/Portfolio-admin";
import BlogsAdmin from "./pages/Admin/Blogs-admin/Blogs-admin";
import ReportsAdmin from "./pages/Admin/reports-ad/Reports-admin";
import MessagesAdmin from "./pages/Admin/Messages-admin";
import SettingsAdmin from "./pages/Admin/settings-ad/Settings-admin";


function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openLogin } = useLoginModal();

  const authRoutes = ["/register", "/forgot-password", "/verify-email"];

  const hideNavbar =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin") ||
    authRoutes.includes(location.pathname);

  // Redirect-to-home-then-open-modal is the one predictable path every
  // "you need to log in" case funnels through (ProtectedRoute, AdminRoute,
  // the old /login bookmarks, Register/ForgotPassword's "Login" links) --
  // see navigate("/", { state: { openLogin: true } }) call sites. Clearing
  // the state via replace after reading it stops a page refresh from
  // reopening the modal.
  useEffect(() => {
    if (location.state?.openLogin) {
      openLogin();
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return (
    <>
      <ScrollToTop />

      {!hideNavbar && <Navbar />}

      <Routes>

        {/* ================= WEBSITE ================= */}

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Website Services */}

        <Route path="/services/seo" element={<SEO />} />
        <Route
          path="/services/social-media"
          element={<SocialMedia />}
        />
        <Route
          path="/services/email-marketing"
          element={<EmailMarketing />}
        />
        <Route
          path="/services/google-ads"
          element={<GoogleAds />}
        />
        <Route
          path="/services/web-development"
          element={<WebsiteDevelopment />}
        />

        <Route
          path="/industries"
          element={<Industries />}
        />

        <Route
          path="/portfolio"
          element={<Portfolio />}
        />

        <Route
          path="/blog"
          element={<Blog />}
        />

        <Route
          path="/blog/:slug"
          element={<BlogDetail />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* ================= AUTH ================= */}

        {/* No standalone login page -- redirect any old /login link/bookmark
            to the public home page with the login modal open. */}
        <Route
          path="/login"
          element={<Navigate to="/" state={{ openLogin: true }} replace />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* ================= CLIENT DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >

          {/* Dashboard */}

          <Route
            index
            element={<AdminDashboard />}
          />

          {/* Clients */}

          <Route
            path="clients"
            element={<Clients />}
          />

          {/* Projects */}

          <Route
            path="projects"
            element={<Projects />}
          />

          {/* Leads */}

          <Route
            path="leads"
            element={<Leads />}
          />

          {/* Contact Requests */}

          <Route
            path="contact-requests"
            element={<ContactRequests />}
          />

          {/* Consultation Requests */}

          <Route
            path="consultations"
            element={<ConsultationRequests />}
          />

          {/* Services */}

          <Route
            path="services"
            element={<Services />}
          />

          {/* Portfolio */}

          <Route
            path="portfolio"
            element={<PortfolioAdmin />}
          />

          <Route
            path="blogs"
            element={<BlogsAdmin />}
          />

          <Route
            path="reports"
            element={<ReportsAdmin />}
          />

          <Route
            path="documents"
            element={<DocumentsAdmin />}
          />

          <Route
            path="messages"
            element={<MessagesAdmin />}
          />

            <Route
            path="settings"
            element={<SettingsAdmin />}
          />

        </Route>

        {/* ================= FALLBACK ================= */}

        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;