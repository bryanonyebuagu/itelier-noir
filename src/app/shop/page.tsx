import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShopClient from "./ShopClient";
import {getCatalog,filterCatalog} from "@/utils/catalog";
export const dynamic="force-dynamic";
export default async function ShopPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const values=await searchParams;const params=new URLSearchParams();
 Object.entries(values).forEach(([k,v])=>{if(typeof v==="string")params.set(k,v);});
 const catalog=await getCatalog();
 const products=filterCatalog(catalog,params);
 const filters={category:params.get("category")||"ALL",size:params.get("size")||"",color:params.get("color")||"",priceMin:params.get("priceMin")||"",priceMax:params.get("priceMax")||"",search:params.get("search")||"",sort:params.get("sort")||"newest"};
 return <><AnnouncementBar/><Navbar/><main style={{minHeight:"100vh",padding:"var(--space-xl) 0"}}><ShopClient key={params.toString()} initialProducts={products} allProducts={catalog} searchParams={filters}/></main><Footer/></>;
}
