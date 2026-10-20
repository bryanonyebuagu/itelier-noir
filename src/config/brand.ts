export interface BrandConfig {
  name: string;
  brandName: string;
  tagline: string;
  logo: string;
  theme: {
    colors: {
      primary: string;       // Deep Black
      secondary: string;     // Warm Charcoal
      background: string;    // Off-White
      accent: string;        // Muted Gold
      text: string;          // Charcoal
      border: string;        // Muted Silver
    };
    fonts: {
      heading: string;       // Cormorant Garamond
      body: string;          // Inter
    };
  };
  announcement: {
    text: string;
    link?: string;
    isActive: boolean;
  };
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaLeftText: string;
    ctaLeftLink: string;
    ctaRightText: string;
    ctaRightLink: string;
  };
  about: {
    heroTitle: string;
    heroSubtitle: string;
    mission: string;
    founderName: string;
    founderTitle: string;
    founderBio: string;
    sustainability: string;
    timeline: Array<{ year: string; title: string; description: string }>;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    whatsapp: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export const brandConfig: BrandConfig = {
  name: "Itelier Noir",
  brandName: "Itelier Noir",
  tagline: "High-End Editorial Luxury Fashion",
  logo: "/logo.png",
  theme: {
    colors: {
      primary: "#080808",      // Rich Deep Black
      secondary: "#151515",    // Warm Charcoal
      background: "#FAF9F6",   // Warm Alabaster Off-White
      accent: "#C5A880",       // Muted Editorial Gold
      text: "#1C1C1C",         // Sophisticated Dark Charcoal
      border: "#E2E2E0",       // Subtle Soft Gray
    },
    fonts: {
      heading: "'Cormorant Garamond', 'Playfair Display', serif",
      body: "'Inter', 'DM Sans', sans-serif"
    }
  },
  announcement: {
    text: "COMPLIMENTARY EXPRESS SHIPPING ON ALL ORDERS OVER ₦150,000",
    link: "/shop",
    isActive: true
  },
  hero: {
    title: "ITELIER NOIR",
    subtitle: "THE HAUTE COUTURE EDITION",
    backgroundImage: "/images/editorial/campaign-home.webp",
    ctaLeftText: "SHOP MEN",
    ctaLeftLink: "/shop/men",
    ctaRightText: "SHOP WOMEN",
    ctaRightLink: "/shop/women"
  },
  about: {
    heroTitle: "ITELIER NOIR STORY",
    heroSubtitle: "A Legacy of Minimalist Elegance and Tailored Craftsmanship",
    mission: "To define the modern wardrobe through an uncompromising commitment to premium quality, architectural silhouettes, and ethical craftsmanship.",
    founderName: "Marc & Clara Valois",
    founderTitle: "Creative Directors & Founders",
    founderBio: "Founded in 2021, Itelier Noir began as an intimate design house focused on custom tailoring. Today, it stands as a contemporary luxury fashion label, balancing structural severity with fluid grace. Every piece is designed in-house, marrying standard sartorial heritage with avant-garde perspectives.",
    sustainability: "We believe luxury is a lifetime investment. That's why we source 100% of our wool and cotton from certified organic farms, partner with family-owned Italian and Nigerian weaving mills, and produce in limited quantities to eliminate deadstock waste.",
    timeline: [
      { year: "2021", title: "The Inception", description: "Itelier Noir launches as a bespoke studio catering to a select editorial clientele." },
      { year: "2023", title: "Prêt-à-Porter Debut", description: "Our first ready-to-wear runway collection is presented during Lagos Fashion Week, receiving critical acclaim." },
      { year: "2025", title: "Global E-Boutique", description: "Launching our state-of-the-art e-boutique to ship luxury custom tailoring worldwide directly from West Africa." },
      { year: "2026", title: "Sustainable Footprint", description: "Achieved 100% supply chain transparency, sourcing zero-impact organic fibres globally." }
    ]
  },
  socialLinks: {
    instagram: "https://instagram.com/iteliernoir",
    facebook: "https://facebook.com/iteliernoir",
    twitter: "https://twitter.com/iteliernoir",
    whatsapp: "https://wa.me/2348000000000"
  },
  contactInfo: {
    email: "concierge@iteliernoir.com",
    phone: "+234 800 ITELIER",
    address: "Editorial House, Victoria Island, Lagos, Nigeria",
  },
  seo: {
    title: "Itelier Noir | High-End Editorial Luxury Fashion",
    description: "Discover curated minimalist apparel, structured tailoring, and exclusive garments from Itelier Noir. Designed for low bandwidth and premium fashion UX.",
    keywords: "luxury, fashion, Nigeria, editorial, minimalist, tailoring, Itelier Noir",
  }
};
