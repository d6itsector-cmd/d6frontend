import { useState } from "react";
import "./WebsiteFAQ.css";
import { FaPlus, FaMinus } from "react-icons/fa";

const WebsiteFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Why does my business need a professional website?",
      answer:
        "A professional website builds credibility, showcases your services, attracts potential customers, and helps your business grow online 24/7.",
    },
    {
      question: "How long does it take to develop a website?",
      answer:
        "The timeline depends on the project scope. A standard business website usually takes 2–4 weeks, while complex websites may require more time.",
    },
    {
      question: "Will my website be mobile-friendly?",
      answer:
        "Yes. Every website we develop is fully responsive and optimized for desktops, tablets, and smartphones.",
    },
    {
      question: "Can you redesign my existing website?",
      answer:
        "Absolutely. We can modernize your current website with improved design, performance, and user experience while preserving your brand identity.",
    },
    {
      question: "Do you provide maintenance after launch?",
      answer:
        "Yes. We offer ongoing maintenance, security updates, backups, performance optimization, and technical support after your website goes live.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="website-faq">
      <div className="website-faq-container">

        <div className="faq-left">

          <span className="section-tag">
            FAQ
          </span>

          <h2>
            Frequently Asked
            <span> Questions</span>
          </h2>

          <p>
            Find answers to the most common questions about our website
            development services and process.
          </p>

        </div>

        <div className="faq-right">

          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${
                activeIndex === index ? "active" : ""
              }`}
              key={index}
            >
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <h3>{faq.question}</h3>

                <span className="faq-icon">
                  {activeIndex === index ? (
                    <FaMinus />
                  ) : (
                    <FaPlus />
                  )}
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

export default WebsiteFAQ;