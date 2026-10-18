export interface PowderColorMeta {
  hex: string;
  name: string;
  mesh: string;
  ingredient: string;
  bgClass?: string;
}

export const POWDER_COLORS: Record<string, PowderColorMeta> = {
  // --- 9 Core Dehydrated Powders ---
  "white-onion-powder": {
    hex: "#F5F2EB",
    name: "White Onion Powder",
    mesh: "Mesh 80–100",
    ingredient: "White Onion",
  },
  "pink-red-onion-powder": {
    hex: "#DDA6B9",
    name: "Pink/Red Onion Powder",
    mesh: "Mesh 80–100",
    ingredient: "Red Onion",
  },
  "garlic-powder": {
    hex: "#F7F3E6",
    name: "Garlic Powder",
    mesh: "Mesh 80–100",
    ingredient: "Garlic",
  },
  "ginger-powder-saunth": {
    hex: "#E8D096",
    name: "Ginger Powder (Saunth)",
    mesh: "Mesh 60–100",
    ingredient: "Fresh Ginger",
  },
  "moringa-leaf-powder": {
    hex: "#2D6B45",
    name: "Moringa Leaf Powder",
    mesh: "Mesh 80–100",
    ingredient: "Moringa Leaves",
  },
  "spinach-powder": {
    hex: "#1F543C",
    name: "Spinach Powder",
    mesh: "Mesh 80–100",
    ingredient: "Fresh Spinach",
  },
  "mint-leaf-powder": {
    hex: "#4D9E56",
    name: "Mint Leaf Powder",
    mesh: "Mesh 60–80",
    ingredient: "Fresh Mint",
  },
  "tomato-powder": {
    hex: "#C8432A",
    name: "Tomato Powder",
    mesh: "Mesh 80–100",
    ingredient: "Ripe Tomatoes",
  },
  "beetroot-powder": {
    hex: "#9E1B47",
    name: "Beetroot Powder",
    mesh: "Mesh 80–100",
    ingredient: "Fresh Beetroot",
  },
};
