import {
  FaArrowRight,
  FaCheck,
  FaProjectDiagram,
  FaBrain,
  FaHeadset,
  FaRedoAlt,
  FaChartLine,
  FaFileInvoice,
  FaUserTie,
  FaClock,
  FaShieldAlt,
  FaPlug,
  FaHandshake,
  FaPoundSign,
  FaSearch,
} from "react-icons/fa";

import CTA from "../../components/Home/CTA/CTA";
import Footer from "../../components/Home/Footer/Footer";
import {
  ServiceHero,
  ServiceIntro,
  SvlSection,
  SvlButton,
  SectionHeader,
  CardGrid,
  ProcessSteps,
  ServiceFAQ,
  RelatedServices,
} from "../../components/ServiceLanding/ServiceSections";
import usePageMeta from "../../hooks/usePageMeta";
import { quotePath } from "../../data/servicesCatalog";
import heroImage from "../../assets/services/ai-automation.webp";

const solutions = [
  {
    Icon: FaProjectDiagram,
    title: "Workflow automation",
    text: "Connect the tools you already use, such as Microsoft 365, Google Workspace, Xero, HubSpot and Shopify, so data moves between them automatically without copying and pasting.",
  },
  {
    Icon: FaBrain,
    title: "AI-powered business processes",
    text: "Use AI to read, classify and summarise emails, forms and documents, then route them to the right person or system with the key details already extracted.",
  },
  {
    Icon: FaHeadset,
    title: "Customer support automation",
    text: "AI assistants on your website, WhatsApp or inbox that answer common questions 24/7, book appointments and hand complex queries to your team with full context.",
  },
  {
    Icon: FaRedoAlt,
    title: "Repetitive task automation",
    text: "Take care of the daily admin that eats into your week: data entry, invoice chasing, appointment reminders, report building and follow-up emails.",
  },
  {
    Icon: FaChartLine,
    title: "Productivity & reporting",
    text: "Automatic dashboards and weekly summaries that pull figures from across your business, so decisions are based on up-to-date information.",
  },
  {
    Icon: FaUserTie,
    title: "Lead capture & qualification",
    text: "Instantly respond to new enquiries, qualify them with smart questions, update your CRM and alert your sales team when a hot lead arrives.",
  },
];

const examples = [
  {
    title: "Accountancy practice",
    problem: "Staff spent hours each week downloading client receipts from email and keying them into bookkeeping software.",
    solution: "An AI workflow reads incoming receipts, extracts supplier, date, VAT and total, and posts them for review in Xero.",
    result: "Around 10 hours of manual data entry saved every week.",
  },
  {
    title: "Online retailer",
    problem: "The support inbox was flooded with \"where is my order?\" and returns questions, delaying replies to real issues.",
    solution: "An AI assistant checks order status in Shopify, answers tracking and returns questions and escalates anything unusual.",
    result: "Most routine enquiries answered instantly, day or night.",
  },
  {
    title: "Property lettings agency",
    problem: "Viewing requests arrived through several portals and the website, and were often missed or answered late.",
    solution: "Enquiries are collected in one place, qualified automatically and offered available viewing slots by email and SMS.",
    result: "Faster responses and fewer missed viewings.",
  },
];

const benefits = [
  { Icon: FaClock, title: "Save hours every week", text: "Hand repetitive admin to automations and give your team time back for higher-value work." },
  { Icon: FaCheck, title: "Fewer manual errors", text: "Automated processes follow the same steps every time, reducing typos, missed emails and duplicated records." },
  { Icon: FaHeadset, title: "Faster customer responses", text: "Reply to enquiries in seconds, outside office hours and during your busiest periods." },
  { Icon: FaPoundSign, title: "Grow without extra overheads", text: "Handle more orders, enquiries and clients without increasing headcount at the same rate." },
];

const steps = [
  { title: "Discovery & audit", text: "We map your current processes and identify the tasks where automation will save the most time and money." },
  { title: "Design & proposal", text: "You receive a clear plan showing what will be automated, which tools are involved, costs and expected savings." },
  { title: "Build & test", text: "We build your automations, connect your systems and test thoroughly with real scenarios before going live." },
  { title: "Launch & improve", text: "We train your team, monitor performance and fine-tune workflows as your business evolves." },
];

const reasons = [
  { Icon: FaSearch, title: "Practical, not hype", text: "We recommend AI only where it delivers a measurable return, and say so when a simpler automation will do." },
  { Icon: FaPlug, title: "Works with your tools", text: "We integrate with the software you already use rather than asking you to replace it." },
  { Icon: FaShieldAlt, title: "UK GDPR-conscious", text: "Data protection is designed in from the start, with clear data flows and human review where it matters." },
  { Icon: FaFileInvoice, title: "Clear, fixed proposals", text: "Transparent pricing and a defined scope, so you know exactly what you are getting." },
  { Icon: FaHandshake, title: "Ongoing support", text: "We monitor and maintain your automations, and are on hand when your processes change." },
  { Icon: FaUserTie, title: "Built for SMEs", text: "Solutions sized for small and medium-sized UK businesses, not enterprise budgets." },
];

const faqs = [
  {
    question: "What business tasks can be automated?",
    answer:
      "Any task that is repetitive and follows clear rules is a good candidate: data entry, invoice processing, appointment booking, email follow-ups, lead routing, report building and answering common customer questions. AI also makes it possible to automate tasks involving unstructured information, such as reading emails or documents.",
  },
  {
    question: "Do I need to replace my existing software?",
    answer:
      "Usually not. We connect the systems you already use, such as Microsoft 365, Google Workspace, Xero, QuickBooks, HubSpot, Shopify and many others, through their official integrations and APIs.",
  },
  {
    question: "Is AI automation suitable for small businesses?",
    answer:
      "Yes. Many of our automations are designed for small and medium-sized businesses, where saving even a few hours a week makes a noticeable difference. We start with the quickest wins so you see a return early.",
  },
  {
    question: "How do you handle data protection and UK GDPR?",
    answer:
      "We map where your data goes, use reputable providers, limit access to what each automation needs and keep a human in the loop for sensitive decisions. We will also help you document the processing for your privacy records.",
  },
  {
    question: "How long does it take to set up?",
    answer:
      "A single workflow can often be live within one to two weeks. Larger projects involving several systems or an AI assistant typically take four to eight weeks, including testing and team training.",
  },
];

const AIAutomation = () => {
  usePageMeta({
    title: "AI Automation Services UK | Workflow & Business Process Automation | D6 Global Services",
    description:
      "AI automation for UK businesses. Automate workflows, customer support, data entry and repetitive tasks with practical AI solutions that save time and reduce costs. Book a free consultation.",
  });

  return (
    <>
      <ServiceHero
        badge="AI Automation for UK Businesses"
        title="Work Smarter with"
        highlight="AI Automation"
        lead="Automate repetitive tasks, customer enquiries and everyday workflows with practical AI solutions. We help UK businesses save hours every week, reduce errors and respond to customers faster, using the tools you already have."
        image={heroImage}
        imageAlt="Laptop running automation code on a modern office desk"
        actions={
          <>
            <SvlButton to={quotePath("AI Automation")}>
              Request a Quote <FaArrowRight aria-hidden="true" />
            </SvlButton>
            <SvlButton href="#solutions" variant="secondary">
              Explore Solutions
            </SvlButton>
          </>
        }
        points={["Workflow automation", "AI customer support", "Integrates with your tools", "UK GDPR-conscious"]}
      />

      <ServiceIntro
        tag="WHAT IS AI AUTOMATION?"
        title="Let Technology Handle"
        highlight="the Busywork"
        paragraphs={[
          "Most businesses lose hours every week to repetitive work: copying data between systems, answering the same customer questions, chasing invoices and pulling together reports. AI automation combines workflow tools with artificial intelligence so these tasks run on their own, accurately and around the clock.",
          "We start by understanding how your business works today, then design automations that fit your existing processes and software. The result is a team that spends less time on admin and more time with customers.",
        ]}
        glanceTitle="Typical results"
        glance={[
          { label: "Admin time saved", value: "5–20 hrs / week" },
          { label: "First workflow live", value: "1–2 weeks" },
          { label: "Customer replies", value: "24/7" },
          { label: "Integrations", value: "Your existing tools" },
        ]}
      />

      <SvlSection id="solutions" alt labelledBy="solutions-title">
        <SectionHeader
          tag="OUR SOLUTIONS"
          title="AI Automation"
          highlight="Solutions"
          intro="From a single time-saving workflow to an AI assistant that supports your customers, we build automations around your goals."
          id="solutions-title"
        />
        <CardGrid items={solutions} />
      </SvlSection>

      <SvlSection labelledBy="examples-title">
        <SectionHeader
          tag="REAL-WORLD EXAMPLES"
          title="How UK Businesses"
          highlight="Use Automation"
          intro="Illustrative examples of the kind of automations we build, based on common challenges for small and medium-sized businesses."
          id="examples-title"
        />
        <ul className="svl-cards svl-cards--3">
          {examples.map((example) => (
            <li className="svl-card" key={example.title}>
              <h3>{example.title}</h3>
              <p><strong>Challenge:</strong> {example.problem}</p>
              <p className="svl-example-gap"><strong>Automation:</strong> {example.solution}</p>
              <p className="svl-example-gap"><strong>Outcome:</strong> {example.result}</p>
            </li>
          ))}
        </ul>
      </SvlSection>

      <SvlSection alt labelledBy="benefits-title">
        <SectionHeader
          tag="BENEFITS"
          title="Why Automate"
          highlight="Your Business?"
          id="benefits-title"
        />
        <CardGrid items={benefits} columns={2} />
      </SvlSection>

      <SvlSection labelledBy="process-title">
        <SectionHeader
          tag="OUR PROCESS"
          title="How We Deliver"
          highlight="Your Automation"
          id="process-title"
        />
        <ProcessSteps steps={steps} />
      </SvlSection>

      <SvlSection alt labelledBy="why-title">
        <SectionHeader
          tag="WHY CHOOSE D6"
          title="Why Choose D6 Global for"
          highlight="AI Automation?"
          id="why-title"
        />
        <CardGrid items={reasons} />
      </SvlSection>

      <ServiceFAQ items={faqs} intro="Common questions from UK businesses considering AI and workflow automation." />

      <RelatedServices currentId="ai-automation" ids={["employee-management", "website-development", "email-marketing"]} alt />

      <CTA
        tag="LET'S AUTOMATE"
        title="Ready to Save Time with"
        highlight="AI Automation?"
        description="Book a free consultation and we will identify the tasks in your business that are best suited to automation, along with the time and cost you could save."
        primaryBtn="Get Free Consultation"
        secondaryBtn="Contact Us"
      />
      <Footer />
    </>
  );
};

export default AIAutomation;
