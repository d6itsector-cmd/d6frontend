import "./SEOFAQ.css";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqData = [
  {
    question: "What is SEO?",
    answer:
      "SEO (Search Engine Optimization) is the process of improving your website's visibility on search engines like Google to attract more organic traffic.",
  },
  {
    question: "How long does SEO take to show results?",
    answer:
      "SEO is a long-term strategy. Most businesses start seeing noticeable improvements within 3 to 6 months, depending on competition and website condition.",
  },
  {
    question: "Do you provide monthly SEO reports?",
    answer:
      "Yes. We provide transparent monthly reports with keyword rankings, traffic insights, and performance updates.",
  },
  {
    question: "Can SEO help my local business?",
    answer:
      "Absolutely. Local SEO helps your business appear in nearby search results, making it easier for local customers to find you.",
  },
];

const SEOFAQ = () => {
  const [active, setActive] = useState(0);

  const toggleFAQ = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <section className="seo-faq">
      <div className="faq-container">

        <span className="section-tag">FAQ</span>

        <h2>
          Frequently Asked
          <span> Questions</span>
        </h2>

        <p className="section-description">
          Find answers to the most common questions about our SEO services.
        </p>

        <div className="faq-list">
          {faqData.map((faq, index) => (
            <div
              className={`faq-item ${active === index ? "active" : ""}`}
              key={index}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                {active === index ? <FaMinus /> : <FaPlus />}
              </button>

              {active === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SEOFAQ;