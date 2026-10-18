// Aurelian International - Centralized Company & Location Configuration
// Single source of truth for corporate identity, address, contact, and mapping coordinates.

export const company = {
  name: "Aurelian International",
  shortName: "Aurelian",
  city: "Morbi",
  state: "Gujarat",
  country: "India",
  locationDisplay: "Morbi, Gujarat, India",
  tagline: "From India's Finest Farms & Quarries to the World.",
  established: "2012",
  phone: "+91 98200 00000",
  whatsapp: "919820000000",
  email: "trade@aurelianinternational.com",
  url: "https://aurelianinternational.com",

  // New Registered Office Address (Exact Display Text)
  addressLines: [
    "Survey No. 45P, Plot No. 2, Second Floor, Office No. S65",
    "8-A National Highway, Shakti Chamber-1, Village Trajpar",
    "Morbi - 363642, Gujarat, India",
  ],
  addressOneLine:
    "Survey No. 45P, Plot No. 2, Second Floor, Office No. S65, 8-A National Highway, Shakti Chamber-1, Village Trajpar, Morbi - 363642, Gujarat, India",

  // Schema.org Structured Data
  schemaAddress: {
    "@type": "PostalAddress",
    streetAddress:
      "Survey No. 45P, Plot No. 2, Second Floor, Office No. S65, 8-A National Highway, Shakti Chamber-1, Village Trajpar",
    addressLocality: "Morbi",
    addressRegion: "Gujarat",
    postalCode: "363642",
    addressCountry: "IN",
  },

  // Map Queries & Direct Action URLs (Pin lands in Trajpar, Morbi near Shakti Chamber on 8-A National Highway)
  mapQuery: "Shakti Chamber-1, 8-A National Highway, Trajpar, Morbi, Gujarat 363642, India",
  get mapEmbedUrl(): string {
    return `https://www.google.com/maps?q=${encodeURIComponent(this.mapQuery)}&output=embed&z=16`;
  },
  get googleMapsUrl(): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.mapQuery)}`;
  },
  get directionsUrl(): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(this.mapQuery)}`;
  },

  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    x: "https://x.com",
  },
} as const;

export default company;
