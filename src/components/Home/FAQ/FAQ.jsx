import React from "react";
import "./FAQ.css";
import {
  FaChevronDown,
  FaCheckCircle,
} from "react-icons/fa";

const faqs = [
  {
    question: "What digital marketing services do you provide?",
    answer:
      "We offer SEO, Google Ads (PPC), Social Media Marketing, Website Design & Development, Content Marketing, Email Marketing, Branding, and complete digital growth solutions.",
  },
  {
    question: "Do you work with startups and small businesses?",
    answer:
      "Absolutely! We specialize in helping startups and small businesses establish a strong online presence and generate quality leads.",
  },
  {
    question: "How long does SEO take to show results?",
    answer:
      "SEO is a long-term strategy. Most businesses start seeing noticeable improvements within 3 to 6 months depending on competition and website health.",
  },
  {
    question: "Can you redesign my existing website?",
    answer:
      "Yes. We redesign outdated websites with modern UI/UX, responsive layouts, faster loading speeds, and SEO-friendly structures.",
  },
  {
    question: "How can I get started?",
    answer:
      "Simply contact us through our website or request a free consultation. We'll understand your business goals and suggest the right marketing strategy.",
  },
];

const FAQ = () => {
  return (
    <section className="faq">

      <div className="faq-container">

        {/* LEFT */}

        <div className="faq-left">

          <span className="faq-tag">
            FAQs
          </span>

          <h2>
            Have Questions?
            <span> We've Got Answers.</span>
          </h2>

          <p>
            Find answers to the most common questions about our digital
            marketing services. If you still have questions, our team is always
            ready to help.
          </p>

          <div className="faq-features">

            <div>
              <FaCheckCircle />
              <span>Free Consultation</span>
            </div>

            <div>
              <FaCheckCircle />
              <span>Expert Digital Marketing Team</span>
            </div>

            <div>
              <FaCheckCircle />
              <span>Customized Growth Strategy</span>
            </div>

            <div>
              <FaCheckCircle />
              <span>Quick Response & Support</span>
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="faq-right">

          {faqs.map((item, index) => (

            <div
              className="faq-card"
              key={index}
            >

              <div className="faq-question">

                <h3>{item.question}</h3>

                <div className="icon">

                  <FaChevronDown />

                </div>

              </div>

              <div className="faq-answer">

                <p>{item.answer}</p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default FAQ;