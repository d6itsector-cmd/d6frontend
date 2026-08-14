import ContactHero from "../components/Contact/ContactHero";
import ContactSection from "../components/Contact/ContactSection";
import GoogleMap from "../components/Contact/GoogleMap";
import CTA from "../components/Home/CTA/CTA";
import Footer from "../components/Home/Footer/Footer";

const Contact = () => {
    return (
        <>
            <ContactHero />

            <ContactSection />
            <GoogleMap />
            <CTA
                badge="CONTACT US"
                title="Let's Grow Your Business Together"
                description="Whether you need SEO, Google Ads, Website Development, or a complete digital marketing strategy, our team is ready to help."
                primaryButton="Book Free Consultation"
                secondaryButton="Explore Services"
            />

            <Footer />
        </>
    );
};

export default Contact;