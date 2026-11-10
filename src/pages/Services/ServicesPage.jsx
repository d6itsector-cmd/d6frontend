import ServicesList from "../../components/Services/ServicesList";
import usePageMeta from "../../hooks/usePageMeta";
import CTA from "../../components/Home/CTA/CTA";
import Footer from "../../components/Home/Footer/Footer";

const ServicesPage = () => {
    usePageMeta({
        title: "Our Services | Custom Products, AI Automation & Digital Marketing UK | D6 Global Services",
        description:
            "Explore D6 Global Services: custom products, AI automation, employee management with AuraWork, website development, social media marketing, Google Ads, SEO and email marketing for UK businesses.",
    });

    return (
        <>
            <ServicesList />
            <CTA
                tag="LET'S GROW TOGETHER"
                title="Not Sure Which Service"
                highlight="You Need?"
                description="Talk to our team and we'll recommend the right mix of custom products, automation, websites and digital marketing for your goals."
            />
            <Footer />
        </>
    );
};

export default ServicesPage;
