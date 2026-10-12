import port from "@/assets/port.jpg";
import spices from "@/assets/spices.jpg";
import warehouse from "@/assets/warehouse.jpg";
import marble from "@/assets/marble.jpg";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "export-documentation-guide",
    title: "The Importer's Guide to Indian Export Documentation",
    excerpt: "Every certificate your cargo needs — and why each one matters at your port.",
    category: "Trade Guides",
    date: "2026-09-18",
    readTime: "7 min read",
    image: port,
    body: [
      "Importing from India is straightforward once you understand the paperwork that travels with your cargo. A complete document set protects you at customs and speeds up clearance.",
      "The core set includes the commercial invoice, packing list and bill of lading. Agricultural goods also need a phytosanitary certificate issued by India's Plant Protection authority, and most destinations require a certificate of origin.",
      "For food products, ask for lab analysis reports covering moisture, aflatoxin and pesticide residues. Our team prepares these for every batch and shares drafts before shipment so there are no surprises.",
    ],
  },
  {
    slug: "spice-quality-markers",
    title: "Five Quality Markers of Export-Grade Spices",
    excerpt: "Curcumin, ASTA colour, volatile oil — what the numbers on a spec sheet really mean.",
    category: "Products",
    date: "2026-08-30",
    readTime: "5 min read",
    image: spices,
    body: [
      "Spice quality is measurable. Buyers who know the right markers negotiate better and receive more consistent product.",
      "For turmeric, curcumin percentage drives colour and value. For chilli, ASTA colour units and pungency (SHU) define the grade. Black pepper is judged by bulk density in grams per litre, while cumin is measured by purity and volatile oil.",
      "Always request a pre-shipment sample and a certificate of analysis tied to the actual lot number.",
    ],
  },
  {
    slug: "container-loading-best-practice",
    title: "Inside a Container Loading: How We Protect Your Cargo",
    excerpt: "From fumigation to desiccants, the small details that keep goods perfect at sea.",
    category: "Logistics",
    date: "2026-08-12",
    readTime: "6 min read",
    image: warehouse,
    body: [
      "A container crossing the equator can see huge swings in temperature and humidity. Without preparation, condensation can damage even the best grain.",
      "We line containers with kraft paper, use desiccant strips, fumigate where required and photograph every stage of loading so you can see your cargo before it sails.",
    ],
  },
  {
    slug: "choosing-indian-marble",
    title: "Choosing Indian Marble for International Projects",
    excerpt: "A buyer's primer on Rajasthan's finest stones and how to specify them.",
    category: "Natural Stone",
    date: "2026-07-22",
    readTime: "4 min read",
    image: marble,
    body: [
      "Rajasthan has been quarrying marble for centuries. Today its stones line hotels and residences across the Gulf, Europe and North America.",
      "Specify finish, thickness tolerance and edge profile up front, and always approve a dry-lay of slabs before crating for consistent veining across a project.",
    ],
  },
];

export const getPost = (slug: string) => posts.find((x) => x.slug === slug);
