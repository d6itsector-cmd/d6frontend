import ContactSection from "../components/Contact/ContactSection";
import GoogleMap from "../components/Contact/GoogleMap";
import Footer from "../components/Home/Footer/Footer";
// Shared layout for the marketing pages, scoped under .site-page
import "../styles/sitePages.css";

const Contact = () => {
    return (
        <>
            <div className="site-page site-page--contact">
                <ContactSection />
                <GoogleMap />
            </div>

            <Footer />
        </>
    );
};

export default Contact;