import { ServiceFAQ, RelatedServices } from "./ServiceSections";
import usePageMeta from "../../hooks/usePageMeta";
import { servicePageContent } from "../../data/serviceFaqs";
import { getService } from "../../data/servicesCatalog";

// Page title / meta description, FAQs and related-service links for the five
// older service pages (SEO, Google Ads, Social Media, Website Development,
// Email Marketing). Rendered after each page's .svc-detail sections.
const ServicePageExtras = ({ id }) => {
  const content = servicePageContent[id];
  const service = getService(id);

  usePageMeta(content.meta);

  return (
    <>
      <ServiceFAQ
        items={content.faqs}
        alt
        intro={`Answers to common questions about our ${service.title} services for UK businesses.`}
      />
      <RelatedServices currentId={id} ids={content.related} />
    </>
  );
};

export default ServicePageExtras;
