import ServicesList from "../../components/Services/ServicesList";
import CTA from "../../components/Home/CTA/CTA";
import Footer from "../../components/Home/Footer/Footer";

const ServicesPage = () => {
    return (
        <>
            <ServicesList />
            <CTA
                tag="LET'S GROW TOGETHER"
                title="Not Sure Which Service"
                highlight="You Need?"
                description="Talk to our team and we'll recommend the right mix of SEO, Google Ads, social media, web development, and email marketing for your goals."
            />
            <Footer />
        </>
    );
};

export default ServicesPage;
