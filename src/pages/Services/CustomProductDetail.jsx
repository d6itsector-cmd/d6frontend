import { Link, useParams } from "react-router-dom";
import { FaArrowRight, FaCheck } from "react-icons/fa";

import CTA from "../../components/Home/CTA/CTA";
import Footer from "../../components/Home/Footer/Footer";
import {
  ServiceHero,
  ServiceIntro,
  SvlSection,
  SvlButton,
  SectionHeader,
  ServiceFAQ,
} from "../../components/ServiceLanding/ServiceSections";
import usePageMeta from "../../hooks/usePageMeta";
import { customProducts, getCustomProduct } from "../../data/customProducts";
import { quotePath } from "../../data/servicesCatalog";
import NotFound from "../NotFound";

const CheckList = ({ items }) => (
  <ul>
    {items.map((item) => (
      <li key={item}>
        <FaCheck aria-hidden="true" />
        {item}
      </li>
    ))}
  </ul>
);

const ProductPage = ({ product }) => {
  usePageMeta({ title: product.seoTitle, description: product.seoDescription });

  const others = customProducts.filter((item) => item.slug !== product.slug);
  const quote = quotePath("Custom Products", product.name);

  return (
    <>
      <ServiceHero
        breadcrumbs={[
          { label: "Services", to: "/services" },
          { label: "Custom Products", to: "/services/custom-products" },
          { label: product.name },
        ]}
        badge="Custom Products"
        title={product.name}
        highlight="for UK Businesses & Gifts"
        lead={product.summary}
        image={product.gallery[0].src}
        imageAlt={product.gallery[0].alt}
        actions={
          <>
            <SvlButton to={quote}>
              Request a Quote <FaArrowRight aria-hidden="true" />
            </SvlButton>
            <SvlButton href="#options" variant="secondary">
              Customisation Options
            </SvlButton>
          </>
        }
        points={product.options.slice(0, 4)}
      />

      <ServiceIntro
        tag="OVERVIEW"
        title="Personalised"
        highlight={product.name}
        paragraphs={product.intro}
        glanceTitle={`${product.name} at a glance`}
        glance={product.glance}
      />

      <SvlSection alt labelledBy="gallery-title">
        <SectionHeader
          tag="GALLERY"
          title={product.name}
          highlight="in Real Life"
          intro="A selection of styles and finishes. Every order is produced to your own design, colours and branding."
          id="gallery-title"
        />
        <ul className={`svl-gallery svl-gallery--${product.gallery.length}`}>
          {product.gallery.map((photo) => (
            <li key={photo.caption}>
              <figure>
                <img src={photo.src} alt={photo.alt} width="1200" height="900" loading="lazy" decoding="async" />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </SvlSection>

      <SvlSection id="options" labelledBy="options-title">
        <SectionHeader
          tag="CUSTOMISATION"
          title="Your Customisation"
          highlight="Options"
          intro="Add your own branding, logos, designs and text. We will recommend the best finish for your artwork, quantity and budget."
          id="options-title"
        />

        <div className="svl-split">
          <div className="svl-panel">
            <h3>Ways to personalise</h3>
            <CheckList items={product.customisation} />
          </div>
          <div className="svl-panel">
            <h3>Print & finishing methods</h3>
            <CheckList items={product.methods} />
          </div>
        </div>
      </SvlSection>

      <SvlSection alt labelledBy="ideal-title">
        <SectionHeader
          tag="IDEAL FOR"
          title="Popular Uses for"
          highlight={product.name}
          id="ideal-title"
        />
        <ul className="svl-options svl-options--center">
          {product.idealFor.map((use) => (
            <li key={use}>{use}</li>
          ))}
        </ul>
      </SvlSection>

      <ServiceFAQ items={product.faqs} intro={`Common questions about ordering ${product.name.toLowerCase()}.`} />

      <SvlSection alt labelledBy="more-title">
        <SectionHeader
          tag="MORE CUSTOM PRODUCTS"
          title="Explore Our Other"
          highlight="Custom Products"
          id="more-title"
        />
        <ul className="svl-related">
          {others.map((item) => (
            <li className="svl-related-card" key={item.slug}>
              <div className="svl-product-media svl-related-media">
                <img src={item.gallery[0].src} alt={item.gallery[0].alt} width="1200" height="900" loading="lazy" decoding="async" />
              </div>
              <h3>{item.name}</h3>
              <p>{item.summary}</p>
              <Link to={`/services/custom-products/${item.slug}`} className="svl-text-link">
                Explore Product
                <span className="svl-visually-hidden">: {item.name}</span>
                <FaArrowRight aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </SvlSection>

      <CTA
        tag="REQUEST A QUOTE"
        title="Ready to Order Your"
        highlight={`${product.name}?`}
        description="Send us your design, quantity and delivery date. We will reply with a clear quote and a free digital proof."
        primaryBtn="Get Free Consultation"
        secondaryBtn="Contact Us"
      />
      <Footer />
    </>
  );
};

const CustomProductDetail = () => {
  const { productSlug } = useParams();
  const product = getCustomProduct(productSlug);

  if (!product) return <NotFound />;

  // key resets FAQ state when moving between products
  return <ProductPage key={product.slug} product={product} />;
};

export default CustomProductDetail;
