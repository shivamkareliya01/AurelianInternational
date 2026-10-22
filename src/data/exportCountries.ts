// src/data/exportCountries.ts
// SINGLE SOURCE OF TRUTH FOR EXPORT MARKETS & MARITIME HUBS
// Architecture: India (Origin) -> UAE (Central Re-Export Hub) -> 6 Destination Markets

export type RegionKey =
  | "gulf"
  | "europe"
  | "americas"
  | "africa"
  | "asia-pacific";

export interface LeaderLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface ExportCountry {
  iso2: string;
  name: string;
  displayName: string;
  region: RegionKey;
  regionLabel: string;
  flag: string;
  portName: string;
  portLat: number;
  portLng: number;
  // Canvas SVG coordinates (viewBox 0 0 1000 520)
  x: number;
  y: number;
  // Collision-free label positioning
  labelX: number;
  labelY: number;
  textAnchor: "start" | "middle" | "end";
  pillW: number;
  pillH: number;
  leaderLine?: LeaderLine;
  // Curved arc SVG path departing strictly from UAE Hub (628.1, 212.8)
  routeD: string;
  topCargo: string[];
  legTwoDays: [number, number]; // [minDays, maxDays] from UAE to destination
  isMajorAnchor?: boolean;
}

export interface HubNode {
  iso2: string;
  name: string;
  label: string;
  subtitle: string;
  flag: string;
  portName: string;
  portLat: number;
  portLng: number;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  textAnchor: "start" | "middle" | "end";
  pillW: number;
  pillH: number;
  leaderLine?: LeaderLine;
  role: string;
}

// ORIGIN GATEWAY: Gujarat Coast, India
export const originGateway: HubNode = {
  iso2: "IN",
  name: "India",
  label: "INDIA",
  subtitle: "Export Origin Gateway",
  flag: "🇮🇳",
  portName: "Gujarat Coast Gateway (Mundra / Kandla)",
  portLat: 22.84,
  portLng: 69.70,
  x: 681.6,
  y: 233.8,
  labelX: 681.6,
  labelY: 262,
  textAnchor: "middle",
  pillW: 64,
  pillH: 18,
  leaderLine: { x1: 681.6, y1: 237.8, x2: 681.6, y2: 252 },
  role: "Origin Dispatch Gateway",
};

// CENTRAL RE-EXPORT: United Arab Emirates (Jebel Ali, Dubai)
// The UAE is a connecting point, not a final destination.
export const uaeCentralHub: HubNode = {
  iso2: "AE",
  name: "United Arab Emirates",
  label: "UAE",
  subtitle: "Central Re-Export",
  flag: "🇦🇪",
  portName: "Jebel Ali Port (Dubai)",
  portLat: 25.01,
  portLng: 55.06,
  x: 628.1,
  y: 212.8,
  labelX: 660,
  labelY: 190,
  textAnchor: "start",
  pillW: 62,
  pillH: 20,
  leaderLine: { x1: 631.5, y1: 210, x2: 656, y2: 193 },
  role: "Central Redistribution",
};

// Leg 1 feeder arc: India (Gujarat) -> UAE (Jebel Ali)
export const legOneArc = "M 681.6 233.8 Q 652 208, 628.1 212.8";
export const legOneDays: [number, number] = [4, 6];

// Regions metadata (5 regions total: Gulf + 4 destination regions)
export interface RegionMetadata {
  id: RegionKey;
  label: string;
  flag: string;
  order: number;
  description: string;
}

export const regionsList: RegionMetadata[] = [
  {
    id: "gulf",
    label: "Gulf",
    flag: "🇦🇪",
    order: 1,
    description: "Central multimodal redistribution at Jebel Ali, Dubai connecting India to global lanes.",
  },
  {
    id: "europe",
    label: "Europe",
    flag: "🇪🇺",
    order: 2,
    description: "Continental European gateways via Rotterdam and Hamburg, connected via the Suez maritime corridor.",
  },
  {
    id: "americas",
    label: "Americas",
    flag: "🇺🇸",
    order: 3,
    description: "Deepwater transatlantic container routes servicing the United States via New York / New Jersey.",
  },
  {
    id: "africa",
    label: "Africa",
    flag: "🌍",
    order: 4,
    description: "East and South African gateway loops servicing Mombasa (Kenya) and Durban (South Africa).",
  },
  {
    id: "asia-pacific",
    label: "Asia-Pacific",
    flag: "🌏",
    order: 5,
    description: "Eastbound maritime artery connecting into Oceania and Australia via Sydney / Port Botany.",
  },
];

// Single source of truth: Exactly 6 sovereign export destination markets
export const exportCountries: ExportCountry[] = [
  // 1. United States (Americas)
  {
    iso2: "US",
    name: "United States",
    displayName: "United States",
    region: "americas",
    regionLabel: "Americas",
    flag: "🇺🇸",
    portName: "Port of New York / New Jersey",
    portLat: 40.67,
    portLng: -74.04,
    x: 265.6,
    y: 158.5,
    labelX: 236,
    labelY: 144,
    textAnchor: "end",
    pillW: 104,
    pillH: 18,
    leaderLine: { x1: 262, y1: 156, x2: 242, y2: 146 },
    // Curves SOUTH of Europe over North Africa (y ~ 250) and mid-Atlantic (y ~ 220)
    routeD: "M 628.1 212.8 C 490 250, 360 220, 265.6 158.5",
    topCargo: [
      "Grains and Pulses",
      "Fresh Fruits and Vegetables",
      "Spices",
      "Dehydrated Powders",
    ],
    legTwoDays: [20, 24],
    isMajorAnchor: true,
  },

  // 2. Europe - Rotterdam (Netherlands highlighted)
  {
    iso2: "NL",
    name: "Europe - Rotterdam",
    displayName: "Europe - Rotterdam",
    region: "europe",
    regionLabel: "Europe",
    flag: "🇪🇺",
    portName: "Port of Rotterdam",
    portLat: 51.95,
    portLng: 4.14,
    x: 484.6,
    y: 119.6,
    labelX: 410,
    labelY: 96,
    textAnchor: "end",
    pillW: 130,
    pillH: 18,
    leaderLine: { x1: 482, y1: 118, x2: 430, y2: 100 },
    // Lower Mediterranean curve that fans distinctly apart from Germany
    routeD: "M 628.1 212.8 C 555 175, 498 152, 484.6 119.6",
    topCargo: [
      "Spices",
      "Dehydrated Powders",
      "Grains and Pulses",
    ],
    legTwoDays: [16, 20],
    isMajorAnchor: true,
  },

  // 3. Germany (Hamburg)
  {
    iso2: "DE",
    name: "Germany",
    displayName: "Germany",
    region: "europe",
    regionLabel: "Europe",
    flag: "🇩🇪",
    portName: "Port of Hamburg",
    portLat: 53.54,
    portLng: 9.97,
    x: 498.3,
    y: 123.1,
    labelX: 560,
    labelY: 106,
    textAnchor: "start",
    pillW: 78,
    pillH: 18,
    leaderLine: { x1: 502, y1: 121, x2: 554, y2: 108 },
    // Higher Eastern arch that fans visibly upward from the Rotterdam corridor
    routeD: "M 628.1 212.8 C 595 145, 545 110, 498.3 123.1",
    topCargo: [
      "Spices",
      "Dehydrated Powders",
      "Grains and Pulses",
    ],
    legTwoDays: [17, 21],
    isMajorAnchor: true,
  },

  // 4. South Africa (Durban)
  {
    iso2: "ZA",
    name: "South Africa",
    displayName: "South Africa",
    region: "africa",
    regionLabel: "Africa",
    flag: "🇿🇦",
    portName: "Port of Durban",
    portLat: -29.87,
    portLng: 31.03,
    x: 538.8,
    y: 398.8,
    labelX: 538.8,
    labelY: 426,
    textAnchor: "middle",
    pillW: 96,
    pillH: 18,
    leaderLine: { x1: 538.8, y1: 402, x2: 538.8, y2: 416 },
    routeD: "M 628.1 212.8 C 595 270, 560 340, 538.8 398.8",
    topCargo: [
      "Grains and Pulses",
      "Spices",
      "Dehydrated Powders",
    ],
    legTwoDays: [12, 16],
    isMajorAnchor: true,
  },

  // 5. Kenya (Mombasa)
  {
    iso2: "KE",
    name: "Kenya",
    displayName: "Kenya",
    region: "africa",
    regionLabel: "Africa",
    flag: "🇰🇪",
    portName: "Port of Mombasa",
    portLat: -4.05,
    portLng: 39.67,
    x: 580.0,
    y: 298.5,
    labelX: 624,
    labelY: 298.5,
    textAnchor: "start",
    pillW: 60,
    pillH: 18,
    leaderLine: { x1: 584, y1: 298.5, x2: 618, y2: 298.5 },
    routeD: "M 628.1 212.8 Q 598 255, 580.0 298.5",
    topCargo: [
      "Grains and Pulses",
      "Fresh Fruits and Vegetables",
      "Spices",
      "Dehydrated Powders",
    ],
    legTwoDays: [7, 10],
    isMajorAnchor: true,
  },

  // 6. Australia (Sydney / Port Botany)
  {
    iso2: "AU",
    name: "Australia",
    displayName: "Australia",
    region: "asia-pacific",
    regionLabel: "Asia-Pacific",
    flag: "🇦🇺",
    portName: "Port of Sydney / Port Botany",
    portLat: -33.97,
    portLng: 151.22,
    x: 852.5,
    y: 394.2,
    labelX: 852.5,
    labelY: 426,
    textAnchor: "middle",
    pillW: 78,
    pillH: 18,
    leaderLine: { x1: 852.5, y1: 398, x2: 852.5, y2: 416 },
    routeD: "M 628.1 212.8 C 715 285, 785 365, 852.5 394.2",
    topCargo: [
      "Grains and Pulses",
      "Spices",
      "Dehydrated Powders",
    ],
    legTwoDays: [16, 22],
    isMajorAnchor: true,
  },
];

// Helper constants
export const totalDestinationCount = exportCountries.length; // 6
export const totalRegionsCount = regionsList.length; // 5
