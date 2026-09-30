/**
 * The backend (GET /schemes, POST /eligibility) is the source of truth for
 * scheme name, category, ministry and source_pdf — see
 * backend/app/schemes/scheme_data.py. It does not return marketing copy
 * (summary, benefit, who it's for, a sample question), so this file adds
 * that presentation-only metadata, keyed by the exact scheme `name` the
 * backend returns. Nothing here overrides or renames backend fields.
 */
export const SCHEME_META = {
  "PM-KISAN": {
    summary:
      "Income support for farmer families, paid in instalments directly into bank accounts.",
    benefit: "₹6,000 per year in three instalments",
    audience: "Farmer families with cultivable land",
    sampleQuestion: "Who is eligible for PM-KISAN and how do I apply?",
  },
  "Ayushman Bharat PM-JAY": {
    summary:
      "Cashless hospital treatment for eligible families at empanelled public and private hospitals.",
    benefit: "Health cover up to ₹5 lakh per family per year",
    audience: "Eligible low-income and vulnerable families",
    sampleQuestion: "What treatments does PM-JAY cover and who can apply?",
  },
  "National Scholarship": {
    summary:
      "One-stop portal to apply for central and state scholarships for school and college students.",
    benefit: "Varies by scholarship",
    audience: "School, college and higher-education students",
    sampleQuestion: "How do I apply for a scholarship on the National Scholarship Portal?",
  },
  "Pradhan Mantri MUDRA Yojana": {
    summary:
      "Collateral-free loans for micro and small enterprises across Shishu, Kishore and Tarun categories.",
    benefit: "Collateral-free loans up to ₹10 lakh",
    audience: "Non-corporate small and micro business owners",
    sampleQuestion: "What are the Mudra loan categories and how do I get a loan?",
  },
};

/** Categories as returned by the backend (scheme_data.py / eligibility.py). */
export const CATEGORIES = ["Farmer", "Healthcare", "Education", "Business/MSME"];

export const OCCUPATIONS = [
  "Farmer",
  "Student",
  "Salaried",
  "Self-employed / Business owner",
  "Unemployed",
  "Other",
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Merge a backend scheme object with local presentation metadata. */
export function enrichScheme(scheme) {
  const meta = SCHEME_META[scheme.name] || {};
  return {
    id: slugify(scheme.name),
    name: scheme.name,
    category: scheme.category,
    ministry: scheme.ministry,
    sourcePdf: scheme.source_pdf,
    summary: meta.summary || `A government scheme under the ${scheme.category} category.`,
    benefit: meta.benefit || "See official guidelines for details.",
    audience: meta.audience || "See official guidelines for details.",
    sampleQuestion: meta.sampleQuestion || `Tell me about ${scheme.name}.`,
  };
}
