import { useState } from "react";
import "./SocialFAQ.css";
import { FaPlus, FaMinus } from "react-icons/fa";

const SocialFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Why is social media marketing important for my business?",
      answer:
        "Social media marketing helps increase brand awareness, engage your audience, generate quality leads, and build long-term customer relationships across popular platforms.",
    },
    {
      question: "Which social media platforms should my business use?",
      answer:
        "The best platform depends on your target audience and business goals. We help you choose the right platforms such as Facebook, Instagram, LinkedIn, X (Twitter), and YouTube.",
    },
    {
      question: "How often should I post on social media?",
      answer:
        "Consistency is key. We create a strategic content calendar with engaging posts to keep your audience active and connected with your brand.",
    },
    {
      question: "Do you manage paid social media campaigns?",
      answer:
        "Yes. We create and optimize paid advertising campaigns on Facebook, Instagram, LinkedIn, and other social platforms to maximize ROI.",
    },
    {
      question: "How do you measure campaign success?",
      answer:
        "We monitor engagement, reach, impressions, follower growth, website traffic, leads, and conversions through detailed monthly performance reports.",
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
            Find answers to the most common questions about our Social Media
            Marketing services.
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

export default SocialFAQ;