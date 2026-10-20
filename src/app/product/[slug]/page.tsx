import {notFound} from "next/navigation";
import {getCatalog} from "@/utils/catalog";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductClient from "./ProductClient";
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){
 const {slug}=await params;const product=(await getCatalog()).find(p=>p.slug===slug);
 return {title:product?.title||"Product not found",description:product?.description};
}
export default async function ProductPage({params}:Props){
 const {slug}=await params;const catalog=await getCatalog();const product=catalog.find(p=>p.slug===slug);
 if(!product)notFound();
 const related=catalog.filter(p=>p.slug!==slug).sort((a,b)=>Number(b.category===product.category)-Number(a.category===product.category)).slice(0,4);
 const totalReviews=product.reviews.length;const averageRating=totalReviews?product.reviews.reduce((s,r)=>s+r.rating,0)/totalReviews:0;
 return <><AnnouncementBar/><Navbar/><main><ProductClient product={product} relatedProducts={related} averageRating={averageRating} totalReviews={totalReviews}/></main><Footer/></>;
}
