import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaArrowRight,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

import logo from "../../../assets/d6.png";
import { services } from "../../../data/servicesCatalog";

const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-container">

                {/* Company Info */}

                <div className="footer-about">

                    <div className="footer-logo">
                        <img src={logo} alt="D6 Global Services Logo" />

                        <h2>
                            D6<span> Global Services</span>
                        </h2>
                    </div>

                    <p>
                        Helping businesses grow with innovative digital marketing,
                        creative branding, SEO strategies, and high-performance
                        websites that deliver measurable results.
                    </p>

                </div>

                {/* Quick Links */}

                <div className="footer-links">

                    <h3>Quick Links</h3>

                    <ul>

                        <li>
                            <a href="/">
                                <FaArrowRight />
                                Home
                            </a>
                        </li>

                        <li>
                            <a href="/about">
                                <FaArrowRight />
                                About
                            </a>
                        </li>

                        <li>
                            <a href="/#services">
                                <FaArrowRight />
                                Services
                            </a>
                        </li>

                        <li>
                            <a href="/industries">
                                <FaArrowRight />
                                Industries
                            </a>
                        </li>

                        <li>
                            <a href="/contact">
                                <FaArrowRight />
                                Contact
                            </a>
                        </li>

                    </ul>

                </div>

                {/* Services */}

                <div className="footer-services">

                    <h3>Services</h3>

                    <ul>

                        {/* Same order as the /services page; AuraWork
                            (Employee Management) opens in a new tab */}
                        {services.map((service) => (
                            <li key={service.id}>
                                {service.external ? (
                                    <a href={service.path} target="_blank" rel="noopener noreferrer">
                                        {service.title}
                                    </a>
                                ) : (
                                    <a href={service.path}>{service.title}</a>
                                )}
                            </li>
                        ))}

                    </ul>

                </div>

                {/* Contact */}

                <div className="footer-contact">

                    <h3>Contact Us</h3>

                    <p>
                        <FaPhoneAlt />
                        <a href="tel:+447776635958">+44 7776 635958</a>
                    </p>

                    <p>
                        <FaMapMarkerAlt />
                        United Kingdom
                    </p>

                    <p>
                        <FaEnvelope />
                        <a href="mailto:notifications@d6globalmedia.com">
                            notifications@d6globalmedia.com
                        </a>
                    </p>

                    <div className="footer-social">

                        <a href="#">
                            <FaLinkedinIn />
                        </a>

                        <a href="#">
                            <FaInstagram />
                        </a>

                        <a href="#">
                            <FaFacebookF />
                        </a>

                        <a href="#">
                            <FaYoutube />
                        </a>

                    </div>

                </div>

            </div>

            {/* Bottom */}

            <div className="footer-bottom">

                <p>
                    © 2026 D6 Global Services. All Rights Reserved.
                </p>

                <div className="footer-policy">

                    <a href="/">Privacy Policy</a>

                    <span>|</span>

                    <a href="/">Terms & Conditions</a>

                    <span>|</span>

                    <a href="/">Sitemap</a>

                </div>

            </div>

        </footer>
    );
};

export default Footer;