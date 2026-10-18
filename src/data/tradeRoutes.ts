// src/data/tradeRoutes.ts
// Configuration for Aurelian Global Trade Route Map
// Origin and 6 primary destination corridors

export interface TradeMarket {
  id: string;
  label: string;
  lon: number;
  lat: number;
  bend: number; // Bowing factor perpendicular to direct line
  title: string;
  ports: string;
  cargo: string;
  transit: string;
  speed: number; // Relative particle traversal speed
  labelOffset?: { x: number; y: number };
}

export interface OriginGateway {
  id: string;
  label: string;
  name: string;
  lon: number;
  lat: number;
  ports: string;
}

export const originGateway: OriginGateway = {
  id: "india",
  label: "I N D I A",
  name: "India (Origin Gateways)",
  lon: 72.9,
  lat: 19.0,
  ports: "Nhava Sheva (JNPT), Mundra Port",
};

export const tradeMarkets: TradeMarket[] = [
  {
    id: "usa",
    label: "USA",
    lon: -74.0,
    lat: 40.7,
    bend: 0.28,
    title: "United States",
    ports: "Port of New York & New Jersey, Savannah",
    cargo: "Onion powder, Moringa powder, Dehydrated vegetables",
    transit: "28-34 Days",
    speed: 0.00019,
    labelOffset: { x: -6, y: -22 },
  },
  {
    id: "uk",
    label: "UK",
    lon: -0.12,
    lat: 51.5,
    bend: 0.24,
    title: "United Kingdom",
    ports: "London Gateway, Felixstowe",
    cargo: "Fruit powders, Spice blends, Dehydrated onion",
    transit: "18-22 Days",
    speed: 0.00024,
    labelOffset: { x: -22, y: -24 },
  },
  {
    id: "europe",
    label: "EUROPE",
    lon: 4.48,
    lat: 51.9,
    bend: 0.17,
    title: "Europe",
    ports: "Rotterdam, Hamburg, Antwerp",
    cargo: "Vegetable powders, Moringa, Dehydrated garlic",
    transit: "18-24 Days",
    speed: 0.00023,
    labelOffset: { x: 28, y: -24 },
  },
  {
    id: "uae",
    label: "UAE",
    lon: 55.3,
    lat: 25.3,
    bend: 0.22,
    title: "Middle East (UAE)",
    ports: "Jebel Ali Port (Dubai), Khalifa Port (Abu Dhabi)",
    cargo: "Fresh Fruits & Vegetables, Red Onions, Rice",
    transit: "4-6 Days (Express Gulf Sea Corridor)",
    speed: 0.00030,
    labelOffset: { x: -24, y: -20 },
  },
  {
    id: "africa",
    label: "AFRICA",
    lon: 39.7,
    lat: -4.0,
    bend: -0.22,
    title: "East Africa",
    ports: "Mombasa, Dar es Salaam",
    cargo: "Dehydrated vegetables, Rice, Spices",
    transit: "9-12 Days",
    speed: 0.00026,
    labelOffset: { x: -26, y: 18 },
  },
  {
    id: "se-asia",
    label: "SE ASIA",
    lon: 103.8,
    lat: 1.35,
    bend: 0.22,
    title: "South-East Asia",
    ports: "Singapore, Port Klang",
    cargo: "Onion powder, Moringa, Fruit powders",
    transit: "8-11 Days",
    speed: 0.00028,
    labelOffset: { x: 26, y: 16 },
  },
];

// ISO 3166-1 numeric IDs for accredited trading territories tinted gold/bronze
// USA (840), UK (826), Germany (276), France (250), Netherlands (528), Italy (380),
// Spain (724), UAE (784), Saudi Arabia (682), Kenya (404), Tanzania (834),
// Nigeria (566), South Africa (710), Indonesia (360), Malaysia (458),
// Thailand (764), Vietnam (704)
export const ACCREDITED_COUNTRY_IDS = new Set<string>([
  "840", // United States of America (including Alaska)
  "826", // United Kingdom
  "276", // Germany
  "250", // France
  "528", // Netherlands
  "380", // Italy
  "724", // Spain
  "784", // United Arab Emirates
  "682", // Saudi Arabia
  "404", // Kenya
  "834", // Tanzania
  "566", // Nigeria
  "710", // South Africa
  "360", // Indonesia
  "458", // Malaysia
  "764", // Thailand
  "704", // Vietnam
]);

// India ISO numeric ID
export const INDIA_COUNTRY_ID = "356";
