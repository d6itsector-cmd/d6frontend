// FAQs and page metadata for the five marketing service pages
// (SEO, Google Ads, Social Media Marketing, Website Development and Email
// Marketing). Custom Products and AI Automation keep theirs in their own
// page files.

export const servicePageContent = {
  "website-development": {
    meta: {
      title: "Website Development UK | Responsive Business Websites | D6 Global Services",
      description:
        "Professional website development for UK businesses. Fast, responsive, secure and SEO-friendly websites, e-commerce stores and React web apps. Get a free consultation.",
    },
    related: ["seo", "google-ads", "ai-automation"],
    faqs: [
      {
        question: "How much does a business website cost?",
        answer:
          "It depends on the number of pages, features and integrations you need. A brochure website for a small business costs considerably less than an e-commerce store or custom web application. We provide a fixed, itemised quote after a free consultation so there are no surprises.",
      },
      {
        question: "How long does it take to build a website?",
        answer:
          "Most small business websites are completed in three to six weeks. Larger e-commerce sites and custom applications typically take eight to twelve weeks, depending on content, features and feedback rounds.",
      },
      {
        question: "Will my website work on mobiles and tablets?",
        answer:
          "Yes. Every website we build is fully responsive and tested on phones, tablets and desktops, which also matters for your Google rankings.",
      },
      {
        question: "Can I update the website myself?",
        answer:
          "Yes. We can build on a content management system so you can edit text, images and blog posts yourself, and we provide training and ongoing maintenance plans if you prefer us to handle updates.",
      },
      {
        question: "Do you handle hosting, domains and GDPR compliance?",
        answer:
          "We can arrange secure UK-friendly hosting, SSL certificates and domain set-up, and include essentials such as a cookie banner and privacy policy page to help you meet UK GDPR requirements.",
      },
    ],
  },
  "social-media-marketing": {
    meta: {
      title: "Social Media Marketing UK | Instagram, Facebook & LinkedIn | D6 Global Services",
      description:
        "Social media marketing for UK businesses. Strategy, content creation, community management and paid social on Instagram, Facebook, LinkedIn and TikTok. Book a free consultation.",
    },
    related: ["google-ads", "email-marketing", "custom-products"],
    faqs: [
      {
        question: "Which social media platforms should my business be on?",
        answer:
          "The right platforms depend on where your customers spend their time. LinkedIn suits B2B services, while Instagram, Facebook and TikTok often work best for consumer brands. We recommend a focused mix rather than trying to be everywhere.",
      },
      {
        question: "Do you create the content as well as post it?",
        answer:
          "Yes. We plan your content calendar and produce graphics, captions, short-form videos and stories in your brand voice, then schedule and publish them for you.",
      },
      {
        question: "How soon will I see results from social media marketing?",
        answer:
          "Paid social campaigns can bring traffic and enquiries within days. Organic growth in followers and engagement builds steadily over two to three months of consistent posting.",
      },
      {
        question: "How do you measure success?",
        answer:
          "We track reach, engagement, website visits, leads and sales from social, and send a clear monthly report showing what is working and what we will improve next.",
      },
    ],
  },
  "google-ads": {
    meta: {
      title: "Google Ads Management UK | PPC Agency | D6 Global Services",
      description:
        "Google Ads management for UK businesses. Search, Shopping, Display and YouTube campaigns built to generate qualified leads and maximise your return on ad spend.",
    },
    related: ["seo", "website-development", "social-media-marketing"],
    faqs: [
      {
        question: "How much should I spend on Google Ads?",
        answer:
          "Budgets vary by industry and competition. Many UK small businesses start with a few hundred pounds a month and scale up once campaigns are profitable. We help you set a realistic budget based on your goals and typical cost per click.",
      },
      {
        question: "How quickly will Google Ads bring results?",
        answer:
          "Ads can start appearing within a day of launch. The first few weeks are used to gather data and refine keywords, bids and ad copy, after which performance typically improves steadily.",
      },
      {
        question: "Do you charge a management fee on top of ad spend?",
        answer:
          "Yes. Your ad spend is paid directly to Google, and our management fee is agreed upfront and covers campaign set-up, ongoing optimisation and reporting. There are no hidden charges.",
      },
      {
        question: "Can you target customers in specific UK locations?",
        answer:
          "Yes. We can target the whole UK, specific cities or regions, or a radius around your premises, and schedule ads for the hours when your customers are most likely to buy.",
      },
    ],
  },
  seo: {
    meta: {
      title: "SEO Services UK | Search Engine Optimisation Agency | D6 Global Services",
      description:
        "Results-driven SEO services for UK businesses. Keyword research, technical SEO, local SEO and content optimisation to improve your Google rankings and organic traffic.",
    },
    related: ["website-development", "google-ads", "email-marketing"],
    faqs: [
      {
        question: "What is SEO?",
        answer:
          "Search engine optimisation (SEO) is the process of improving your website so it appears higher in Google and other search engines for the searches your customers make, bringing in more organic, unpaid traffic.",
      },
      {
        question: "How long does SEO take to show results?",
        answer:
          "SEO is a long-term investment. Most businesses start to see noticeable improvements within three to six months, depending on competition, the current state of the website and how much content is needed.",
      },
      {
        question: "Can SEO help my local business?",
        answer:
          "Yes. Local SEO, including optimising your Google Business Profile and location pages, helps you appear in map results and \"near me\" searches in your town or city.",
      },
      {
        question: "Do you provide monthly SEO reports?",
        answer:
          "Yes. You receive clear monthly reports covering keyword rankings, organic traffic, enquiries and the work completed, along with our priorities for the next month.",
      },
    ],
  },
  "email-marketing": {
    meta: {
      title: "Email Marketing Services UK | Newsletters & Automation | D6 Global Services",
      description:
        "Email marketing for UK businesses. Campaign strategy, newsletter design, automated email journeys and GDPR-compliant list building that drive engagement and sales.",
    },
    related: ["social-media-marketing", "ai-automation", "website-development"],
    faqs: [
      {
        question: "Is email marketing still effective?",
        answer:
          "Yes. Email remains one of the highest-return marketing channels because you are speaking directly to people who have already chosen to hear from you.",
      },
      {
        question: "Is your email marketing GDPR and PECR compliant?",
        answer:
          "Yes. We help you collect consent properly, manage unsubscribes and keep clear records, in line with UK GDPR and the Privacy and Electronic Communications Regulations (PECR).",
      },
      {
        question: "Which email platform do you use?",
        answer:
          "We work with leading platforms such as Mailchimp, Klaviyo, Brevo and HubSpot, and can use the one you already have or recommend the best fit for your business.",
      },
      {
        question: "What are automated email journeys?",
        answer:
          "They are emails sent automatically when someone takes an action, such as a welcome series for new subscribers, abandoned basket reminders or follow-ups after a purchase, so you stay in touch without manual effort.",
      },
    ],
  },
};

export default servicePageContent;
