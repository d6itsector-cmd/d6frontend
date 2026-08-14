import { useEffect, useState } from "react";
import "./Testimonials.css";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

import api from "../../services/api";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    let cancelled = false;

    api
      .get("/testimonials", { params: { limit: 6 } })
      .then((res) => {
        if (cancelled) return;
        setTestimonials(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="testimonials">

      <div className="testimonial-header">

        <span>CLIENT TESTIMONIALS</span>

        <h2>
          What Our Clients
          <br />
          Say About Us
        </h2>

        <p>
          We believe our clients' success is the true measure of our work.
          Here's what they have to say about partnering with D6 Global Media.
        </p>

      </div>

      {status === "loading" && <p className="testimonials-status">Loading testimonials...</p>}

      {status === "error" && (
        <p className="testimonials-status">
          We couldn't load testimonials right now. Please try again shortly.
        </p>
      )}

      {status === "success" && testimonials.length === 0 && (
        <p className="testimonials-status">Testimonials coming soon.</p>
      )}

      {status === "success" && testimonials.length > 0 && (
        <div className="testimonial-grid">

          {testimonials.map((item) => (
            <div className="testimonial-card" key={item._id}>

              <FaQuoteLeft className="quote-icon" />

              <p className="feedback">
                "{item.quote}"
              </p>

              <div className="stars">
                {Array.from({ length: item.rating || 5 }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>

              <h3>{item.name}</h3>

              <span>{item.company}</span>

            </div>
          ))}

        </div>
      )}

    </section>
  );
};

export default Testimonials;
