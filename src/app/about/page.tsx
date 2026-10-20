import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { brandConfig } from "@/config/brand";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Atelier Story | ITELIER NOIR",
    description:
        "Explore the legacy, sustainable vision, and tailored craftsmanship behind Itelier Noir.",
};

export default function AboutPage() {
    const { about } = brandConfig;

    return (
        <>
            <AnnouncementBar />
            <Navbar />

            <main
                style={{
                    minHeight: "100vh",
                    backgroundColor: "var(--color-background)",
                    color: "var(--color-text)",
                }}
            >
                {/* 1. Cinematic Hero Banners */}
                <section
                    style={{
                        height: "60vh",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    <Image
                        src="/images/editorial/campaign-about.webp"
                        alt="Atelier Campaign Studio"
                        fill
                        style={{
                            objectFit: "cover",
                            filter: "brightness(0.4)",
                        }}
                    />

                    <div
                        className="container"
                        style={{
                            position: "relative",
                            zIndex: 10,
                            color: "var(--color-background)",
                            textAlign: "center",
                        }}
                    >
                        <h5
                            style={{
                                fontSize: "var(--font-size-xs)",
                                letterSpacing: "0.3em",
                                textTransform: "uppercase",
                                color: "var(--color-accent)",
                                marginBottom: "var(--space-sm)",
                            }}
                        >
                            The Legacy
                        </h5>

                        <h1
                            style={{
                                fontSize: "var(--font-size-hero)",
                                fontFamily: "var(--font-heading)",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                            }}
                        >
                            {about.heroTitle}
                        </h1>

                        <p
                            style={{
                                fontSize: "var(--font-size-lg)",
                                opacity: 0.8,
                                maxWidth: "600px",
                                margin: "var(--space-md) auto 0",
                                fontWeight: "var(--weight-light)",
                            }}
                        >
                            {about.heroSubtitle}
                        </p>
                    </div>
                </section>

                {/* 2. Mission & Philosophy */}
                <section
                    className="container"
                    style={{
                        marginTop: "var(--space-cinema)",
                        textAlign: "center",
                        padding: "0 var(--space-xl)",
                    }}
                >
                    <h5
                        style={{
                            fontSize: "var(--font-size-xs)",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "var(--color-accent)",
                            marginBottom: "var(--space-sm)",
                        }}
                    >
                        Our Manifesto
                    </h5>

                    <h2
                        style={{
                            fontSize: "var(--font-size-h1)",
                            fontFamily: "var(--font-heading)",
                            letterSpacing: "0.02em",
                            maxWidth: "800px",
                            margin: "0 auto var(--space-md)",
                            textTransform: "uppercase",
                            lineHeight: "1.2",
                        }}
                    >
                        {about.mission}
                    </h2>

                    <div
                        style={{
                            width: "80px",
                            height: "1px",
                            backgroundColor: "var(--color-accent)",
                            margin: "var(--space-xl) auto",
                        }}
                    />
                </section>

                {/* 3. Founder Story */}
                <section
                    style={{
                        backgroundColor: "#FFFFFF",
                        padding: "var(--space-xxxl) 0",
                        marginTop: "var(--space-cinema)",
                    }}
                >
                    <div
                        className="container"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "var(--space-xxl)",
                            alignItems: "center",
                        }}
                    >
                        <div style={{ height: "600px", position: "relative" }}>
                            <Image
                                src="/images/editorial/category-men.webp"
                                alt="Marc & Clara Valois Creative Directors"
                                fill
                                style={{ objectFit: "cover" }}
                            />
                        </div>

                        <div>
                            <h5
                                style={{
                                    fontSize: "var(--font-size-xs)",
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    color: "var(--color-accent)",
                                    marginBottom: "var(--space-sm)",
                                }}
                            >
                                The Visionaries
                            </h5>

                            <h2
                                style={{
                                    fontSize: "var(--font-size-h1)",
                                    fontFamily: "var(--font-heading)",
                                    textTransform: "uppercase",
                                    marginBottom: "var(--space-sm)",
                                }}
                            >
                                {about.founderName}
                            </h2>

                            <h4
                                style={{
                                    fontSize: "var(--font-size-sm)",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: "var(--color-text-muted)",
                                    marginBottom: "var(--space-md)",
                                    fontWeight: "var(--weight-semibold)",
                                }}
                            >
                                {about.founderTitle}
                            </h4>

                            <p
                                style={{
                                    fontSize: "var(--font-size-sm)",
                                    color: "var(--color-text-muted)",
                                    lineHeight: "1.8",
                                    marginBottom: "var(--space-md)",
                                }}
                            >
                                {about.founderBio}
                            </p>

                            <p
                                style={{
                                    fontSize: "var(--font-size-sm)",
                                    color: "var(--color-text-muted)",
                                    lineHeight: "1.8",
                                }}
                            >
                                Under their dual stewardship, Itelier Noir operates
                                at the intersection of European tailoring standards
                                and vibrant African aesthetic rhythms, producing
                                limited items that speak volumes in quality.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 4. Sustainability & Ethics */}
                <section
                    className="container"
                    style={{ marginTop: "var(--space-cinema)" }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1.2fr",
                            gap: "var(--space-xxl)",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <h5
                                style={{
                                    fontSize: "var(--font-size-xs)",
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    color: "var(--color-accent)",
                                    marginBottom: "var(--space-sm)",
                                }}
                            >
                                Conscious Elegance
                            </h5>

                            <h2
                                style={{
                                    fontSize: "var(--font-size-h1)",
                                    fontFamily: "var(--font-heading)",
                                    textTransform: "uppercase",
                                    marginBottom: "var(--space-md)",
                                }}
                            >
                                Crafting for Lifetimes
                            </h2>

                            <p
                                style={{
                                    fontSize: "var(--font-size-sm)",
                                    color: "var(--color-text-muted)",
                                    lineHeight: "1.8",
                                }}
                            >
                                {about.sustainability}
                            </p>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "var(--space-md)",
                            }}
                        >
                            <div style={{ position: "relative", height: "280px" }}>
                                <Image
                                    src="/images/editorial/category-women.webp"
                                    alt="Organic fibers"
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>

                            <div style={{ position: "relative", height: "280px" }}>
                                <Image
                                    src="/images/editorial/category-runway.webp"
                                    alt="Limited manufacturing run"
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Timeline */}
                <section
                    style={{
                        backgroundColor: "#FFFFFF",
                        padding: "var(--space-xxxl) 0",
                        marginTop: "var(--space-cinema)",
                    }}
                >
                    <div className="container">
                        <div
                            style={{
                                textAlign: "center",
                                marginBottom: "var(--space-xxl)",
                            }}
                        >
                            <h5
                                style={{
                                    fontSize: "var(--font-size-xs)",
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    color: "var(--color-accent)",
                                    marginBottom: "var(--space-xs)",
                                }}
                            >
                                Historical Milestones
                            </h5>

                            <h2
                                style={{
                                    fontSize: "var(--font-size-h2)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                }}
                            >
                                Our Journey Timeline
                            </h2>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-xl)",
                                maxWidth: "800px",
                                margin: "0 auto",
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    left: "20px",
                                    top: 0,
                                    bottom: 0,
                                    width: "1px",
                                    backgroundColor: "var(--color-border)",
                                }}
                            />

                            {about.timeline.map((step, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        gap: "var(--space-lg)",
                                        position: "relative",
                                        paddingLeft: "40px",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "absolute",
                                            left: "17px",
                                            top: "8px",
                                            width: "7px",
                                            height: "7px",
                                            borderRadius: "50%",
                                            backgroundColor: "var(--color-accent)",
                                            border: "4px solid #FFFFFF",
                                            boxShadow:
                                                "0 0 0 1px var(--color-accent)",
                                        }}
                                    />

                                    <div>
                                        <span
                                            style={{
                                                fontSize: "var(--font-size-sm)",
                                                fontWeight: "var(--weight-semibold)",
                                                color: "var(--color-accent)",
                                                fontFamily: "var(--font-heading)",
                                            }}
                                        >
                                            {step.year}
                                        </span>

                                        <h3
                                            style={{
                                                fontSize: "var(--font-size-h3)",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.05em",
                                                margin: "2px 0 6px",
                                            }}
                                        >
                                            {step.title}
                                        </h3>

                                        <p
                                            style={{
                                                fontSize: "var(--font-size-sm)",
                                                color: "var(--color-text-muted)",
                                                lineHeight: "1.7",
                                            }}
                                        >
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. CTA */}
                <section
                    style={{ textAlign: "center", padding: "var(--space-xxxl) 0" }}
                >
                    <div
                        className="container"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "var(--space-md)",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "var(--font-size-h2)",
                                fontFamily: "var(--font-heading)",
                                textTransform: "uppercase",
                            }}
                        >
                            Experience the Craftsmanship Firsthand
                        </h2>

                        <p
                            style={{
                                fontSize: "var(--font-size-sm)",
                                color: "var(--color-text-muted)",
                                maxWidth: "500px",
                                lineHeight: "1.6",
                            }}
                        >
                            Browse our latest silhouettes, woven from sustainable
                            organic fibers, tailored specifically for the modern
                            stylist.
                        </p>

                        <Link
                            href="/shop/all"
                            className="btn-primary"
                            style={{ marginTop: "var(--space-md)" }}
                        >
                            Shop the Collection
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
