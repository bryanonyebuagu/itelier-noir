import Image from "next/image";
import styles from "./ShopCategory.module.css";
import type { ShopCategory } from "./types";

const heroCopy: Record<ShopCategory, {
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  imageAlt: string;
  meta: string[];
}> = {
  men: {
    title: "Men",
    eyebrow: "Itelier Noir Menswear",
    description:
      "Sharp tailoring, tactile knitwear, and after-dark essentials composed for movement through the city.",
    image: "/images/editorial/campaign-men.webp",
    imageAlt: "Editorial menswear tailoring in a dark Itelier Noir mood",
    meta: ["Tailored silhouettes", "Limited runs", "Considered details"],
  },
  women: {
    title: "Women",
    eyebrow: "Itelier Noir Womenswear",
    description:
      "Fluid silk, sculptural knits, and refined occasion pieces cut with quiet drama and modern ease.",
    image: "/images/editorial/campaign-women.webp",
    imageAlt: "Editorial womenswear fashion portrait with cinematic styling",
    meta: ["Fluid textures", "Editorial cuts", "Private atelier finish"],
  },
  sale: {
    title: "Sale",
    eyebrow: "Itelier Noir Archive",
    description:
      "Limited archive pieces with a quiet 20% reduction, selected from menswear and womenswear runway edits.",
    image: "/images/editorial/campaign-archive.webp",
    imageAlt: "Itelier Noir editorial sale archive fashion scene",
    meta: ["20% archive edit", "Men and Women", "Limited availability"],
  },
};

interface ShopHeroProps {
  category: ShopCategory;
}

export default function ShopHero({ category }: ShopHeroProps) {
  const copy = heroCopy[category];

  return (
    <section className={styles.hero} aria-label={`${copy.title} collection`}>
      <Image
        src={copy.image}
        alt={copy.imageAlt}
        fill
        priority
        sizes="100vw"
        className={styles.heroImage}
      />
      <div className={styles.heroOverlay} />
      <div className={`container ${styles.heroContent}`}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <h1 className={styles.heroTitle}>{copy.title}</h1>
          <p className={styles.heroDescription}>{copy.description}</p>
          <div className={styles.heroMeta} aria-label="Collection highlights">
            {copy.meta.map((item) => (
              <span className={styles.heroPill} key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
