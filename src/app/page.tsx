import {getCatalog} from "@/utils/catalog";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeClient from "./HomeClient";
export const dynamic="force-dynamic";
export default async function HomePage(){
 const catalog=await getCatalog();
 const arrivals=catalog.filter(p=>p.badge==="NEW").slice(-4).reverse();
 const arrivalsIds=new Set(arrivals.map(p=>p.id));
 const signature=catalog.filter(p=>!arrivalsIds.has(p.id)&&["BEST_SELLER","LIMITED_EDITION","TRENDING"].includes(p.badge||"")).slice(0,4);
 return <><AnnouncementBar/><Navbar/><HomeClient newArrivals={arrivals} bestSellers={signature}/><Footer/></>;
}
