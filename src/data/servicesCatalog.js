// The eight main D6 Global services, in display order. This is the single
// source for every place that lists them: the /services page, the home
// page cards, the footer and the "related services" links on each service
// page. Change the order here and it changes everywhere.
//
// `external: true` entries (Employee Management -> AuraWork) open the live
// product in a new tab instead of an internal route.

import {
  FaTshirt,
  FaRobot,
  FaUsers,
  FaLaptopCode,
  FaShareAlt,
  FaBullhorn,
  FaSearch,
  FaEnvelope,
} from "react-icons/fa";

// Service photography: Unsplash (Unsplash Licence), stored locally as
// 1200x900 WebP. Sources: src/assets/services/CREDITS.md
import customProductsImage from "../assets/services/tshirt-staff.webp";
import aiAutomationImage from "../assets/services/ai-automation.webp";
import employeeManagementImage from "../assets/services/employee-management.webp";
import websiteImage from "../assets/services/website-development.webp";
import socialImage from "../assets/services/social-media-marketing.webp";
import googleAdsImage from "../assets/services/google-ads.webp";
import seoImage from "../assets/services/seo-analytics.webp";
import emailImage from "../assets/services/email-marketing.webp";

export const AURAWORK_URL = "https://aurawork.d6globalmedia.com/";

export const services = [
  {
    id: "custom-products",
    title: "Custom Products",
    eyebrow: "Personalised Merchandise",
    summary:
      "Branded T-shirts, keychains, water bottles and coffee mugs, personalised with your logo, artwork or message.",
    description:
      "Put your brand in people's hands. We produce custom T-shirts, keychains, water bottles and coffee mugs for UK businesses, events, clubs and individuals, printed or engraved with your logo, design or text and delivered across the UK.",
    Icon: FaTshirt,
    image: customProductsImage,
    imageAlt: "Team members wearing black custom T-shirts printed with STAFF on the back",
    path: "/services/custom-products",
    features: ["Custom T-Shirts", "Custom Keychains", "Custom Water Bottles", "Custom Coffee Mugs", "Logo & Artwork Printing", "Bulk & Single Orders"],
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    eyebrow: "Smarter Business Workflows",
    summary:
      "Automate repetitive tasks, customer enquiries and everyday workflows with practical AI that saves your team hours each week.",
    description:
      "Free your team from repetitive admin. We design and build AI-powered automations that handle enquiries, process documents, move data between your systems and keep work flowing, so your people can focus on customers and growth.",
    Icon: FaRobot,
    image: aiAutomationImage,
    imageAlt: "Laptop showing automation code on a tidy office desk with a plant and coffee mug",
    path: "/services/ai-automation",
    features: ["Workflow Automation", "AI Customer Support", "Document Processing", "CRM & Data Sync", "Lead Qualification", "Reporting Automation"],
  },
  {
    id: "employee-management",
    title: "Employee Management",
    eyebrow: "Powered by AuraWork",
    summary:
      "AuraWork brings attendance, leave, employee records and documents into one simple HR platform.",
    description:
      "AuraWork is our employee management platform for growing teams. Track attendance and working hours, manage leave requests and approvals, keep employee records organised and store documents securely, all from one dashboard.",
    Icon: FaUsers,
    image: employeeManagementImage,
    imageAlt: "Diverse team of colleagues in a meeting in a bright modern office",
    path: AURAWORK_URL,
    external: true,
    features: ["Attendance Tracking", "Leave Management", "Employee Records", "Document Storage", "Biometric Ready", "Team Dashboards"],
  },
  {
    id: "website-development",
    title: "Website Development",
    eyebrow: "Modern Business Websites",
    summary:
      "Fast, responsive and search-friendly websites that turn visitors into enquiries and sales.",
    description:
      "We create responsive, fast, secure and SEO-friendly websites that help your business establish a strong online presence, attract more visitors and turn them into customers.",
    Icon: FaLaptopCode,
    image: websiteImage,
    imageAlt: "Web developers writing code on large monitors in a bright office",
    path: "/services/website-development",
    features: ["Responsive Website Development", "E-Commerce Development", "React Web Applications", "UI/UX Design", "Performance Optimisation", "Website Maintenance"],
  },
  {
    id: "social-media-marketing",
    title: "Social Media Marketing",
    eyebrow: "Brand Awareness & Engagement",
    summary:
      "Build your brand and engage your audience across the social platforms your customers use every day.",
    description:
      "Connect with your audience, increase brand awareness and drive meaningful business growth through strategic social media marketing across the platforms your customers use every day.",
    Icon: FaShareAlt,
    image: socialImage,
    imageAlt: "Content creator filming a video on a smartphone mounted on a tripod",
    path: "/services/social-media-marketing",
    features: ["Instagram Marketing", "Facebook Marketing", "LinkedIn Marketing", "Paid Advertising", "Content Creation", "Analytics & Reporting"],
  },
  {
    id: "google-ads",
    title: "Google Ads",
    eyebrow: "Pay-Per-Click Advertising",
    summary:
      "Reach the right audience at the right moment with targeted campaigns that generate quality leads.",
    description:
      "Reach customers at the perfect moment with high-performing Google Ads campaigns. We create data-driven PPC strategies that increase website traffic, generate quality leads and maximise your return on investment.",
    Icon: FaBullhorn,
    image: googleAdsImage,
    imageAlt: "Laptop screen showing advertising performance charts and conversion metrics",
    path: "/services/google-ads",
    features: ["Search Ads", "Shopping Ads", "Display Ads", "YouTube Ads", "App Promotion Ads", "Campaign Optimisation"],
  },
  {
    id: "seo",
    title: "SEO",
    eyebrow: "Search Engine Optimisation",
    summary:
      "Improve your search rankings and attract organic traffic with ethical, data-driven SEO.",
    description:
      "Improve your search rankings, attract high-quality traffic and generate more qualified leads with our results-driven SEO services. We help UK businesses build a strong online presence through ethical, data-driven optimisation that delivers measurable results.",
    Icon: FaSearch,
    image: seoImage,
    imageAlt: "Close-up of a website analytics dashboard showing user retention data",
    path: "/services/seo",
    features: ["Keyword Research", "On-Page SEO", "Technical SEO", "Local SEO", "Content Optimisation", "Link Building"],
  },
  {
    id: "email-marketing",
    title: "Email Marketing",
    eyebrow: "Campaigns That Convert",
    summary:
      "Targeted email campaigns that build relationships, nurture leads and drive repeat sales.",
    description:
      "Build meaningful customer relationships with personalised email campaigns. Increase engagement, generate quality leads and drive more sales through data-driven email marketing.",
    Icon: FaEnvelope,
    image: emailImage,
    imageAlt: "Marketer drawing an automated email workflow for abandoned baskets on a whiteboard",
    path: "/services/email-marketing",
    features: ["Email Campaign Strategy", "Newsletter Design", "Email Automation", "Lead Nurturing", "Promotional Campaigns", "Analytics & Reporting"],
  },
];

// Link to the contact form with the service (and item) preselected.
export const quotePath = (service, item) => {
  const params = new URLSearchParams({ service });
  if (item) params.set("item", item);
  return `/contact?${params.toString()}`;
};

export const getService = (id) => services.find((service) => service.id === id);

// Props for an "Explore" link: internal pages use the router, AuraWork
// opens in a new tab.
export const exploreLinkProps = (service) =>
  service.external
    ? { href: service.path, target: "_blank", rel: "noopener noreferrer" }
    : { to: service.path };

export default services;
