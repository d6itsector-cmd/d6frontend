// Values the consultation form can send as `service`. They must match the
// backend's CONSULTATION_SERVICES (validators/consultation.validator.js)
// exactly -- any other value is rejected with a 400.

// The original seven marketing services.
export const MARKETING_SERVICES = [
  "SEO",
  "Google Ads",
  "Social Media Marketing",
  "Website Development",
  "Email Marketing",
  "Branding",
  "Complete Digital Marketing",
];

// D6 Global divisions and products (used by the QR landing page).
export const DIVISIONS = [
  "Digital Marketing",
  "Event Management",
  "Business & Technology Solutions",
  "AuraWork",
];

export const CONSULTATION_SERVICES = [...MARKETING_SERVICES, ...DIVISIONS];
