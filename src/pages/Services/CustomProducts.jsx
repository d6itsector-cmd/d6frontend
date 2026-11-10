import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaPalette,
  FaPencilRuler,
  FaBoxOpen,
  FaTruck,
  FaBuilding,
  FaCalendarAlt,
  FaHandsHelping,
  FaGift,
  FaAward,
  FaUserCheck,
  FaPoundSign,
  FaShieldAlt,
} from "react-icons/fa";

import CTA from "../../components/Home/CTA/CTA";
import Footer from "../../components/Home/Footer/Footer";
import {
  ServiceHero,
  ServiceIntro,
  SvlSection,
  SvlButton,
  SectionHeader,
  CardGrid,
  ProcessSteps,
  ServiceFAQ,
  RelatedServices,
} from "../../components/ServiceLanding/ServiceSections";
import usePageMeta from "../../hooks/usePageMeta";
import { customProducts } from "../../data/customProducts";
import { quotePath } from "../../data/servicesCatalog";
import heroImage from "../../assets/services/custom-products-printing.webp";

const audiences = [
  { Icon: FaBuilding, title: "Businesses", text: "Branded uniforms, client gifts and promotional merchandise that keep your company front of mind." },
  { Icon: FaCalendarAlt, title: "Events", text: "Matching T-shirts, delegate packs and giveaways for conferences, festivals, trade shows and launches." },
  { Icon: FaHandsHelping, title: "Organisations", text: "Charities, schools, sports clubs and community groups raising funds and building team spirit." },
  { Icon: FaGift, title: "Individuals", text: "One-off personalised gifts for birthdays, weddings, stag and hen parties and special occasions." },
];

const steps = [
  { title: "Tell us what you need", text: "Choose your product, quantity and deadline, and share your logo, artwork or idea." },
  { title: "Approve your proof", text: "Our designers prepare a digital mock-up. We refine it until you are completely happy." },
  { title: "We produce your order", text: "Your products are printed, engraved or embroidered and quality-checked by hand." },
  { title: "UK-wide delivery", text: "Your order is packed securely and delivered to your door, office or event venue." },
];

const reasons = [
  { Icon: FaPencilRuler, title: "Free design support", text: "Not sure how your logo will look? Our team will help with layout, colours and artwork preparation at no extra cost." },
  { Icon: FaUserCheck, title: "Proof before production", text: "You approve a digital proof of every design, so there are no surprises when your order arrives." },
  { Icon: FaPoundSign, title: "Clear, upfront pricing", text: "Transparent quotes with volume discounts. No hidden set-up fees added at the end." },
  { Icon: FaAward, title: "Quality you can rely on", text: "Durable products and professional print methods chosen to suit your design and how it will be used." },
  { Icon: FaTruck, title: "Reliable UK delivery", text: "Realistic turnaround times and tracked delivery anywhere in the UK, with rush options for urgent events." },
  { Icon: FaShieldAlt, title: "One partner for your brand", text: "We also handle your website, social media and marketing, so your merchandise and campaigns stay consistent." },
];

const faqs = [
  {
    question: "Can I order a single personalised item?",
    answer:
      "Yes. T-shirts and coffee mugs can be ordered from a single item, which is ideal for personal gifts. Keychains and water bottles start from 10 items. Larger quantities benefit from lower prices per unit.",
  },
  {
    question: "Do you help with design?",
    answer:
      "Yes. Send us your logo, a sketch or simply an idea, and our design team will create a professional layout and send you a digital proof to approve before production.",
  },
  {
    question: "How long will my order take?",
    answer:
      "Most orders are produced within 5 to 14 working days after proof approval, depending on the product and quantity. If you have a fixed event date, tell us when you enquire and we will confirm whether we can meet it.",
  },
  {
    question: "Do you deliver across the UK?",
    answer:
      "Yes. We deliver to businesses, venues and homes throughout England, Scotland, Wales and Northern Ireland, and can split deliveries across multiple addresses.",
  },
  {
    question: "How do I order?",
    answer:
      "Request a quote with your product, quantity and design details. We will reply with pricing, a recommended print method and a timeline. Once you approve the quote and proof, we start production.",
  },
];

const CustomProducts = () => {
  usePageMeta({
    title: "Custom Products UK | Personalised T-Shirts, Mugs, Bottles & Keychains | D6 Global Services",
    description:
      "Personalised and branded custom products for UK businesses, events, organisations and individuals. Custom T-shirts, keychains, water bottles and coffee mugs with your logo, design or text.",
  });

  return (
    <>
      <ServiceHero
        badge="Custom Products for UK Businesses & Individuals"
        title="Personalised"
        highlight="Custom Products"
        titleAfter="Made for Your Brand"
        lead="Custom T-shirts, keychains, water bottles and coffee mugs, personalised with your logo, artwork, design or text. From a single gift to large branded orders for businesses, events and organisations, delivered across the UK."
        image={heroImage}
        imageAlt="Screen printing press used to print custom T-shirts and merchandise"
        actions={
          <>
            <SvlButton to={quotePath("Custom Products")}>
              Request a Quote <FaArrowRight aria-hidden="true" />
            </SvlButton>
            <SvlButton href="#products" variant="secondary">
              Browse Products
            </SvlButton>
          </>
        }
        points={["Your logo, design or text", "Free design support", "Single items to bulk orders", "UK-wide delivery"]}
      />

      <ServiceIntro
        tag="PERSONALISED MERCHANDISE"
        title="Branded Products People"
        highlight="Actually Use"
        paragraphs={[
          "Custom products are one of the simplest ways to make your brand memorable. A well-designed T-shirt, mug, water bottle or keychain is used every day, seen by colleagues, customers and passers-by, and keeps your name in view long after an event has finished.",
          "Whether you need staff uniforms for a new shop, giveaways for a trade show, matching T-shirts for a charity run or a one-off personalised gift, we handle everything from design to delivery. You can personalise every product with your own branding, logos, designs and text.",
        ]}
        glanceTitle="At a glance"
        glance={[
          { label: "Products", value: "4 core ranges" },
          { label: "Minimum order", value: "From 1 item" },
          { label: "Design help", value: "Included" },
          { label: "Delivery", value: "UK-wide" },
        ]}
      />

      {/* ---------- Products ---------- */}

      <SvlSection id="products" alt labelledBy="products-title">
        <SectionHeader
          tag="OUR PRODUCTS"
          title="Choose Your"
          highlight="Custom Product"
          intro="Four product ranges, each available in a variety of styles, colours and finishes. Explore a product to see every customisation option, or request a quote straight away."
          id="products-title"
        />

        <ul className="svl-products">
          {customProducts.map((product) => (
            <li className="svl-product" key={product.slug}>
              <div className="svl-product-media">
                <img src={product.gallery[0].src} alt={product.gallery[0].alt} width="1200" height="900" loading="lazy" decoding="async" />
              </div>

              <div className="svl-product-body">
                <h3>{product.name}</h3>
                <p>{product.summary}</p>

                <ul className="svl-options" aria-label={`${product.name} customisation options`}>
                  {product.options.slice(0, 4).map((option) => (
                    <li key={option}>{option}</li>
                  ))}
                </ul>

                <div className="svl-product-actions">
                  <SvlButton to={`/services/custom-products/${product.slug}`}>
                    Explore Product
                    <span className="svl-visually-hidden">: {product.name}</span>
                  </SvlButton>
                  <Link to={quotePath("Custom Products", product.name)} className="svl-text-link">
                    Request a Quote
                    <span className="svl-visually-hidden"> for {product.name}</span>
                    <FaArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </SvlSection>

      {/* ---------- How personalisation works ---------- */}

      <SvlSection labelledBy="personalise-title">
        <SectionHeader
          tag="PERSONALISATION"
          title="Make It"
          highlight="Unmistakably Yours"
          intro="Every product can be tailored to your brand or occasion. These are the most popular ways our customers personalise their orders."
          id="personalise-title"
        />
        <CardGrid
          items={[
            { Icon: FaPalette, title: "Logos & branding", text: "Your company logo reproduced accurately in your brand colours, ready for uniforms, gifts and promotional merchandise." },
            { Icon: FaPencilRuler, title: "Custom designs & artwork", text: "Illustrations, photos, event artwork or a design created from scratch by our in-house team." },
            { Icon: FaUserCheck, title: "Names, text & messages", text: "Individual names, team numbers, slogans, dates or a personal message on every item." },
            { Icon: FaBoxOpen, title: "Packaging & gifting", text: "Branded gift boxes and individual packing for client gifts, welcome packs and seasonal hampers." },
          ]}
          columns={2}
        />
      </SvlSection>

      {/* ---------- Who it's for ---------- */}

      <SvlSection alt labelledBy="audience-title">
        <SectionHeader
          tag="WHO WE WORK WITH"
          title="Custom Products for"
          highlight="Every Occasion"
          intro="We supply personalised products to customers right across the UK, from sole traders and start-ups to national organisations."
          id="audience-title"
        />
        <CardGrid items={audiences} columns={2} />
      </SvlSection>

      {/* ---------- Process ---------- */}

      <SvlSection labelledBy="process-title">
        <SectionHeader
          tag="HOW IT WORKS"
          title="From Idea to"
          highlight="Delivery in Four Steps"
          id="process-title"
        />
        <ProcessSteps steps={steps} />
      </SvlSection>

      {/* ---------- Why choose us ---------- */}

      <SvlSection alt labelledBy="why-title">
        <SectionHeader
          tag="WHY CHOOSE D6"
          title="Why Choose D6 Global for"
          highlight="Custom Products?"
          id="why-title"
        />
        <CardGrid items={reasons} />
      </SvlSection>

      <ServiceFAQ items={faqs} intro="Answers to the questions we are asked most often about custom and personalised products." />

      <RelatedServices currentId="custom-products" ids={["social-media-marketing", "website-development", "email-marketing"]} alt />

      <CTA
        tag="REQUEST A QUOTE"
        title="Ready to Create Your"
        highlight="Custom Products?"
        description="Tell us what you would like to personalise, how many you need and when you need them. We will come back with a clear quote and a free design proof."
        primaryBtn="Get Free Consultation"
        secondaryBtn="Contact Us"
      />
      <Footer />
    </>
  );
};

export default CustomProducts;
