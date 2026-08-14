import { useState } from "react";
import "./GoogleAdsFAQ.css";
import { FaPlus, FaMinus } from "react-icons/fa";

const GoogleAdsFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is Google Ads?",
      answer:
        "Google Ads is Google's online advertising platform that helps businesses appear on Google Search, YouTube, Google Maps, and millions of partner websites to attract potential customers.",
    },
    {
      question: "How quickly can I see results from Google Ads?",
      answer:
        "Google Ads can start generating traffic within hours after your campaign is approved. However, optimizing campaigns for the best results usually takes a few weeks.",
    },
    {
      question: "How much should I spend on Google Ads?",
      answer:
        "Your budget depends on your business goals, industry, and competition. We create campaigns that maximize results within your preferred monthly budget.",
    },
    {
      question: "Do you optimize campaigns regularly?",
      answer:
        "Yes. We continuously monitor keywords, bidding strategies, ad performance, and audience targeting to improve conversions and reduce advertising costs.",
    },
    {
      question: "Will I receive performance reports?",
      answer:
        "Absolutely. You'll receive detailed reports including impressions, clicks, CTR, conversions, CPC, and ROI insights.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="googleads-faq">
      <div className="googleads-faq-container">
        {/* Left Side */}
        <div className="faq-left">
          <span className="section-tag">FAQ</span>

          <h2>
            Frequently Asked <span>Questions</span>
          </h2>

          <p>
            Here are some common questions about our Google Ads services.
          </p>
        </div>

        {/* Right Side */}
        <div className="faq-right">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${
                activeIndex === index ? "active" : ""
              }`}
            >
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <h3>{faq.question}</h3>

                <span className="faq-icon">
                  {activeIndex === index ? <FaMinus /> : <FaPlus />}
                </span>
              </div>

              {activeIndex === index && (
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

export default GoogleAdsFAQ;