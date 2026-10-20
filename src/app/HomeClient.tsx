"use client";
import Link from "next/link";
import {ArrowUpRight,Scissors,PackageCheck,ShieldCheck} from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import type {ShopProduct} from "@/components/shop/types";
import grid from "@/components/shop/ShopCategory.module.css";
import "./home.css";
export default function HomeClient({newArrivals,bestSellers}:{newArrivals:ShopProduct[];bestSellers:ShopProduct[]}){
 return <main className="home">
 <section className="campaign"><img src="/images/editorial/campaign-home.webp" alt="Itelier Noir black tailoring and ivory silk campaign in a limestone courtyard" fetchPriority="high"/><div className="campaign-shade"/><div className="container campaign-copy"><p className="eyebrow">Lagos atelier · The new collection</p><h1>Made to<br/><em>be remembered.</em></h1><p>Considered silhouettes. Distinctive textures. A wardrobe with a point of view.</p><div className="campaign-actions"><Link href="/shop/women" className="btn-accent">Explore women <ArrowUpRight size={16}/></Link><Link href="/shop/men" className="campaign-secondary">Discover men <ArrowUpRight size={16}/></Link></div><span className="campaign-caption">ITELIER NOIR / THE ART OF DRESSING</span></div></section>
 <section className="benefit-strip container" aria-label="Shopping services"><span><Scissors size={18}/>Considered craftsmanship</span><span><PackageCheck size={18}/>Complimentary express over ₦150,000</span><span><ShieldCheck size={18}/>Secure hosted card checkout</span></section>
 <section className="container home-section"><div className="section-heading"><div><p className="eyebrow">A new perspective</p><h2>The collection, your way.</h2></div><Link href="/shop">Explore all pieces <ArrowUpRight size={16}/></Link></div><div className="collection-tiles">{[
 {name:"Menswear",note:"A study in structure",href:"/shop/men",image:"category-men"},
 {name:"Womenswear",note:"An instinct for expression",href:"/shop/women",image:"category-women"},
 {name:"The occasion edit",note:"For your next entrance",href:"/shop/collections",image:"category-runway"}
 ].map(c=><Link href={c.href} className="collection-tile" key={c.name}><img src={"/images/editorial/"+c.image+".webp"} alt={c.name+" by Itelier Noir"} loading="lazy"/><div><p>{c.note}</p><h3>{c.name}<ArrowUpRight size={24}/></h3></div></Link>)}</div></section>
 <section className="container home-section"><div className="section-heading"><div><p className="eyebrow">Just arrived</p><h2>Fresh from the atelier.</h2></div><Link href="/shop?sort=newest">Shop new arrivals <ArrowUpRight size={16}/></Link></div><div className={grid.productGrid}>{newArrivals.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div></section>
 <section className="archive-campaign home-section"><img src="/images/editorial/campaign-archive.webp" alt="Archive garments arranged in a warmly lit atelier" loading="lazy"/><div><p className="eyebrow">The archive edit</p><h2>Exceptional pieces.<br/><em>A new opportunity.</em></h2><p>Discover selected silhouettes with 20% off.</p><Link href="/shop/sale" className="btn-accent">Explore the archive <ArrowUpRight size={16}/></Link></div></section>
 <section className="container home-section"><div className="section-heading"><div><p className="eyebrow">The signature edit</p><h2>Quietly unforgettable.</h2></div><Link href="/shop/collections">View the edit <ArrowUpRight size={16}/></Link></div><div className={grid.productGrid}>{bestSellers.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div></section>
 <section className="container home-section atelier-story"><img src="/images/editorial/campaign-about.webp" alt="An artisan carefully cutting fabric at the atelier" loading="lazy"/><div><p className="eyebrow">Rooted in Lagos</p><h2>Clothing with<br/><em>character.</em></h2><p>From embroidered agbada to sculptural evening wear, explore a collection that brings Nigerian expression into a contemporary wardrobe.</p><Link href="/about" className="btn-primary">Inside Itelier Noir <ArrowUpRight size={16}/></Link></div></section>
 <section className="container fitting-note home-section"><p className="eyebrow">Find your silhouette</p><h2>A considered fit starts here.</h2><p>Choose your size and colour on each piece. Use our fitting guide to compare measurements before adding to your bag.</p><Link href="/help#sizing">Read the fitting guide <ArrowUpRight size={16}/></Link></section>
 </main>;
}
