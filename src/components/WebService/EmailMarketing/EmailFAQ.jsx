import { useState } from "react";
import "./EmailFAQ.css";
import { FaPlus, FaMinus } from "react-icons/fa";

const EmailFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is email marketing?",
      answer:
        "Email marketing is a powerful digital marketing strategy that helps businesses communicate directly with customers through personalized email campaigns.",
    },
    {
      question: "How can email marketing help my business?",
      answer:
        "It increases customer engagement, builds trust, improves customer retention, generates more leads, and drives higher conversions with excellent ROI.",
    },
    {
      question: "Can you create custom email campaigns?",
      answer:
        "Yes. We design attractive, responsive, and personalized email campaigns tailored to your audience and business objectives.",
    },
    {
      question: "Do you offer email automation?",
      answer:
        "Absolutely. We set up automated workflows including welcome emails, abandoned cart reminders, promotional sequences, newsletters, and follow-up campaigns.",
    },
    {
      question: "How do you measure email campaign performance?",
      answer:
        "We track key metrics such as open rate, click-through rate (CTR), conversions, bounce rate, unsubscribe rate, and overall campaign performance.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">

        <div className="faq-left">
          <span className="section-tag">FAQ</span>

          <h2>
            Frequently Asked <span>Questions</span>
          </h2>

          <p>
            Find answers to the most common questions about our Email Marketing
            services.
          </p>
        </div>

        <div className="faq-right">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
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

export default EmailFAQ;