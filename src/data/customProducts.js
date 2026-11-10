// The four products in the Custom Products category. Each one renders as a
// card on /services/custom-products and as its own page at
// /services/custom-products/<slug>.
//
// Photography: Unsplash (Unsplash Licence), stored locally as 1200x900 WebP.
// Sources are listed in src/assets/services/CREDITS.md. `gallery[0]` is the
// product's main image (card and page hero); the rest appear in the
// gallery on its product page.

import tshirtVolunteers from "../assets/services/tshirt-volunteers.webp";
import tshirtStaff from "../assets/services/tshirt-staff.webp";
import tshirtColours from "../assets/services/tshirt-colours.webp";
import keychainMetal from "../assets/services/keychain-metal.webp";
import keychainHouse from "../assets/services/keychain-house.webp";
import keychainLeather from "../assets/services/keychain-leather.webp";
import bottleLifestyle from "../assets/services/bottle-lifestyle.webp";
import bottleInHand from "../assets/services/bottle-in-hand.webp";
import mugGift from "../assets/services/mug-gift.webp";
import mugDesk from "../assets/services/mug-desk.webp";
import mugGoldPrint from "../assets/services/mug-gold-print.webp";

export const customProducts = [
  {
    slug: "custom-t-shirts",
    name: "Custom T-Shirts",
    gallery: [
      { src: tshirtVolunteers, alt: "Event volunteers wearing matching yellow T-shirts with custom printed lettering on the back", caption: "Matching event T-shirts" },
      { src: tshirtStaff, alt: "Staff members wearing black T-shirts printed with STAFF in white across the back", caption: "Printed staff uniforms" },
      { src: tshirtColours, alt: "Folded crew-neck T-shirts in red, black and white ready for printing", caption: "Choice of garment colours" },
    ],
    summary:
      "Soft, durable T-shirts printed with your logo, artwork or slogan, ideal for staff uniforms, events, charity runs and merchandise.",
    seoTitle: "Custom T-Shirt Printing UK | Branded & Personalised T-Shirts | D6 Global Services",
    seoDescription:
      "Custom printed T-shirts for UK businesses, events, clubs and individuals. Add your logo, design or text with screen printing, DTF or embroidery. Request a free quote.",
    intro: [
      "A well-made branded T-shirt turns your team, volunteers or supporters into a walking advertisement. We print custom T-shirts for UK businesses, schools, sports clubs, charities, events and individuals, from a single personalised gift to several hundred matching staff uniforms.",
      "Choose your garment, colour and sizes, send us your logo or idea, and we will prepare a digital proof for you to approve before anything is printed.",
    ],
    options: ["Logo printing", "Full-colour artwork", "Names & numbers", "Front, back & sleeve", "Embroidery", "Adult & kids' sizes"],
    customisation: [
      "Print your logo, artwork, slogan or photo on the front, back or sleeves",
      "Add individual names or numbers for teams, staff and events",
      "Choose from a wide range of garment colours, fits and sizes (XS to 5XL)",
      "Select organic cotton and recycled fabric options where available",
      "Embroidered logos for a premium, long-lasting finish on workwear",
    ],
    methods: [
      "Screen printing: the most cost-effective option for larger runs with bold colours",
      "DTF (direct-to-film) printing: full-colour detail with no minimum order",
      "Embroidery: hard-wearing and professional for uniforms and polo shirts",
      "Heat-applied vinyl: crisp names and numbers for sports kits",
    ],
    idealFor: ["Staff uniforms & workwear", "Corporate events & conferences", "Charity runs & fundraisers", "Sports clubs & teams", "Stag, hen & birthday parties", "Band & brand merchandise"],
    glance: [
      { label: "Minimum order", value: "From 1 item" },
      { label: "Print methods", value: "Screen, DTF, embroidery" },
      { label: "Typical turnaround", value: "7–10 working days" },
      { label: "Delivery", value: "UK-wide" },
    ],
    faqs: [
      {
        question: "Is there a minimum order for custom T-shirts?",
        answer:
          "No. We can print a single personalised T-shirt using DTF printing. For larger quantities, screen printing usually gives the best price per item, and we will recommend the most cost-effective method when we quote.",
      },
      {
        question: "What file format should I send my logo in?",
        answer:
          "Vector files (AI, EPS, SVG or PDF) give the sharpest results, but a high-resolution PNG is fine for most designs. If you only have a low-quality image, our design team can redraw it for you.",
      },
      {
        question: "Can I order a mix of sizes and colours?",
        answer:
          "Yes. Most orders include a range of sizes, and you can mix garment colours within the same design. Just let us know the breakdown when you request a quote.",
      },
    ],
  },
  {
    slug: "custom-keychains",
    name: "Custom Keychains",
    gallery: [
      { src: keychainMetal, alt: "Close-up of a polished metal dice keychain on a split ring", caption: "Metal keychains" },
      { src: keychainHouse, alt: "Hand holding a set of house keys on a house-shaped keychain", caption: "Custom-shaped keyrings" },
      { src: keychainLeather, alt: "Leather loop keyring with keys beside a matching leather card holder", caption: "Leather keyrings" },
    ],
    summary:
      "Durable branded keychains in metal, acrylic, leather or PVC, an affordable keepsake that keeps your brand in sight every day.",
    seoTitle: "Custom Keychains UK | Personalised & Logo Keyrings | D6 Global Services",
    seoDescription:
      "Personalised keychains and branded keyrings for UK businesses, estate agents, events and gifts. Engraved, printed or shaped to your design. Request a quote today.",
    intro: [
      "Keychains are one of the most practical promotional products you can give away: they are used every day, travel everywhere and cost very little per unit. We produce custom keychains for estate agents, car dealerships, hotels, schools, events and personal gifts across the UK.",
      "Choose your material and shape, add your logo or message, and we will send a proof before production starts.",
    ],
    options: ["Laser engraving", "Full-colour print", "Custom shapes", "Metal & acrylic", "Leather & PVC", "Bottle openers"],
    customisation: [
      "Laser-engrave your logo, name or message on metal and leather",
      "Full-colour UV printing on acrylic and PVC for detailed artwork",
      "Custom-cut shapes that match your logo or product",
      "Double-sided designs with different artwork on each side",
      "Individual names or numbering for staff, members and guests",
    ],
    methods: [
      "Laser engraving: permanent, premium finish on metal, wood and leather",
      "UV printing: vibrant full-colour artwork on acrylic",
      "Soft PVC moulding: flexible, colourful keychains in any shape",
      "Doming: a clear resin coating that protects printed designs",
    ],
    idealFor: ["Estate & letting agents", "Car dealerships & garages", "Hotels & holiday lets", "Trade show giveaways", "School leavers & clubs", "Wedding & personal gifts"],
    glance: [
      { label: "Minimum order", value: "From 10 items" },
      { label: "Materials", value: "Metal, acrylic, leather, PVC" },
      { label: "Typical turnaround", value: "7–14 working days" },
      { label: "Delivery", value: "UK-wide" },
    ],
    faqs: [
      {
        question: "Which keychain material should I choose?",
        answer:
          "Metal and leather feel premium and suit corporate gifts, acrylic is ideal for full-colour designs at a lower cost, and PVC works well for playful custom shapes. We are happy to recommend the best option for your budget.",
      },
      {
        question: "Can you make a keychain in the shape of my logo?",
        answer:
          "Yes. Acrylic and PVC keychains can be cut or moulded to almost any shape. Send us your logo and we will advise on the size and level of detail that works best.",
      },
      {
        question: "Do you offer individually personalised keychains?",
        answer:
          "Yes. We can engrave or print a different name, number or message on each keychain, which is popular for staff gifts, wedding favours and club members.",
      },
    ],
  },
  {
    slug: "custom-water-bottles",
    name: "Custom Water Bottles",
    gallery: [
      { src: bottleLifestyle, alt: "Person refilling a navy stainless steel water bottle with a printed logo at a kitchen tap", caption: "Branded stainless steel bottles" },
      { src: bottleInHand, alt: "Hand holding a matte grey reusable water bottle outdoors", caption: "Reusable everyday bottles" },
    ],
    summary:
      "Reusable branded water bottles in stainless steel, aluminium or BPA-free plastic, a sustainable product people use every day.",
    seoTitle: "Custom Water Bottles UK | Branded Reusable Bottles | D6 Global Services",
    seoDescription:
      "Branded reusable water bottles for UK businesses, gyms, schools and events. Stainless steel, aluminium and BPA-free options printed or engraved with your logo.",
    intro: [
      "A reusable water bottle is a promotional product people genuinely value, and it supports your sustainability message every time it is refilled. We supply custom water bottles for offices, gyms, schools, sports clubs, charities and events throughout the UK.",
      "Choose from insulated stainless steel, lightweight aluminium or BPA-free plastic, then add your logo, design or personalised names.",
    ],
    options: ["Laser engraving", "Full-wrap print", "Insulated steel", "BPA-free plastic", "Personalised names", "Choice of lids"],
    customisation: [
      "Laser-engrave your logo for a premium, permanent finish on steel",
      "Full-colour or 360° wrap printing for bold, eye-catching designs",
      "Add individual names for staff, students or team members",
      "Choose bottle colour, capacity (350ml to 1 litre) and lid style",
      "Gift boxes and branded packaging for corporate gifting",
    ],
    methods: [
      "Laser engraving: elegant and scratch-resistant on stainless steel",
      "Pad printing: precise one or two-colour logos",
      "UV and wrap printing: full-colour designs around the bottle",
      "Screen printing: durable, cost-effective for larger runs",
    ],
    idealFor: ["Corporate wellbeing gifts", "Gyms & fitness studios", "Schools & universities", "Sports clubs & events", "Sustainability campaigns", "Conference delegate packs"],
    glance: [
      { label: "Minimum order", value: "From 10 items" },
      { label: "Materials", value: "Steel, aluminium, BPA-free" },
      { label: "Typical turnaround", value: "7–14 working days" },
      { label: "Delivery", value: "UK-wide" },
    ],
    faqs: [
      {
        question: "Are your water bottles food-safe and BPA-free?",
        answer:
          "Yes. All of our water bottles are food-safe, and our plastic options are BPA-free. Stainless steel bottles are also available with double-wall insulation to keep drinks hot or cold.",
      },
      {
        question: "Will the print wash off?",
        answer:
          "Laser engraving is permanent. Printed designs are durable for everyday use; we recommend hand washing printed bottles to keep the design looking its best for longer.",
      },
      {
        question: "Can each bottle have a different name?",
        answer:
          "Yes. We can personalise each bottle with an individual name alongside your logo, which works well for staff welcome packs and sports teams.",
      },
    ],
  },
  {
    slug: "custom-coffee-mugs",
    name: "Custom Coffee Mugs",
    gallery: [
      { src: mugGift, alt: "White ceramic mug printed with the words World's Best Boss on an office desk", caption: "Personalised gift mugs" },
      { src: mugDesk, alt: "Dark grey mug printed with Hustle in white lettering on a wooden desk", caption: "Bold text and slogans" },
      { src: mugGoldPrint, alt: "White ceramic mug with gold metallic BOSS lettering on a wooden tray", caption: "Metallic print finishes" },
    ],
    summary:
      "Printed ceramic, enamel and travel mugs with your logo, photo or message, perfect for offices, gifts and promotional giveaways.",
    seoTitle: "Custom Coffee Mugs UK | Personalised & Branded Mugs | D6 Global Services",
    seoDescription:
      "Personalised and branded coffee mugs for UK offices, cafés, events and gifts. Dishwasher-safe printing on ceramic, enamel and travel mugs. Get a free quote.",
    intro: [
      "Few promotional products are used as often as a mug. A branded mug sits on desks, in staff rooms and in customers' kitchens, keeping your name in view with every cup of tea. We print custom coffee mugs for businesses, cafés, schools, events and personal gifts across the UK.",
      "Upload your logo, photo or message and choose your mug style. We will send a proof for approval before printing.",
    ],
    options: ["Full-colour print", "Photo mugs", "Wrap-around designs", "Colour-change mugs", "Travel mugs", "Gift boxes"],
    customisation: [
      "Print your logo, photo or artwork in full colour",
      "Wrap-around designs that cover the whole mug",
      "Coloured handles and interiors to match your brand",
      "Personalised names or messages on each mug",
      "Branded gift boxes for corporate and seasonal gifting",
    ],
    methods: [
      "Sublimation printing: vibrant, full-colour designs on ceramic",
      "Ceramic transfer printing: dishwasher-durable for everyday use",
      "Laser engraving: a premium finish on stainless steel travel mugs",
      "Pad printing: crisp one or two-colour logos at volume",
    ],
    idealFor: ["Office & staff gifts", "Cafés & coffee shops", "Client thank-you gifts", "Christmas & seasonal gifting", "School & club fundraising", "Personal & photo gifts"],
    glance: [
      { label: "Minimum order", value: "From 1 item" },
      { label: "Styles", value: "Ceramic, enamel, travel" },
      { label: "Typical turnaround", value: "5–10 working days" },
      { label: "Delivery", value: "UK-wide" },
    ],
    faqs: [
      {
        question: "Are printed mugs dishwasher and microwave safe?",
        answer:
          "Our standard ceramic mugs are dishwasher and microwave safe. Metallic, enamel and stainless steel travel mugs are not suitable for the microwave, and we will confirm care instructions with your quote.",
      },
      {
        question: "Can I order a single personalised mug?",
        answer:
          "Yes. Single photo and personalised mugs are available, as well as bulk orders for offices, events and promotional campaigns.",
      },
      {
        question: "Can you print a photo on a mug?",
        answer:
          "Yes. Send us a good-quality photo and we will check the resolution and prepare a proof so you can see exactly how it will look.",
      },
    ],
  },
];

export const getCustomProduct = (slug) =>
  customProducts.find((product) => product.slug === slug);

export default customProducts;
