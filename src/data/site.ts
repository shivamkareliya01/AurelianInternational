import { totalDestinationCount } from "./exportCountries";
import { totalCatalogCount } from "./products";
import { company } from "@/config/company";

// Edit company details here — used across the whole site.
export const site = {
  name: company.name,
  short: company.shortName,
  city: company.city,
  state: company.state,
  country: company.country,
  locationDisplay: company.locationDisplay,
  tagline: company.tagline,
  established: company.established,
  phone: company.phone,
  whatsapp: company.whatsapp,
  email: company.email,
  address: company.addressOneLine,
  addressLines: company.addressLines,
  url: company.url,
  socials: company.socials,
};

export const stats = [
  { value: totalDestinationCount, suffix: "", label: "Destination Markets" },
  { value: 5, suffix: "", label: "Product Categories" },
  { value: totalCatalogCount, suffix: "", label: "Export Products" },
  { value: 500, suffix: "+", label: "Shipments Completed" },
];

