import { db } from "@/utils/db";
import { curatedCatalog } from "@/components/shop/catalog";
import { safeJsonParse, getProductPrice, type ShopColor, type ShopProduct } from "@/components/shop/types";
export type CatalogProduct = ShopProduct & { reviews: { id:string; rating:number; text:string; userName:string; verified:boolean; createdAt:string }[] };
export async function getCatalog(): Promise<CatalogProduct[]> {
  try {
    const records = await db.product.findMany({include:{reviews:{where:{approved:true},orderBy:{createdAt:"desc"}}}});
    const known = new Set(records.map(p=>p.slug));
    const products = records.filter(p=>p.isVisible).map(p=>{
      const curated = curatedCatalog.find(item=>item.slug===p.slug);
      return {...curated,...p,images:p.images,createdAt:p.createdAt.toISOString(),updatedAt:p.updatedAt.toISOString(),reviews:p.reviews.map(r=>({...r,createdAt:r.createdAt.toISOString()}))};
    });
    return [...products,...curatedCatalog.filter(p=>!known.has(p.slug)).map(p=>({...p,reviews:[]}))];
  } catch { return curatedCatalog.map(p=>({...p,reviews:[]})); }
}
export function filterCatalog<T extends ShopProduct>(products:T[],params:URLSearchParams):T[] {
  const category=params.get("category")?.toUpperCase();
  const query=(params.get("search") || params.get("q") || "").trim().toLowerCase();
  return products.filter(p=>{
    if(category && !["ALL","COLLECTIONS"].includes(category) && (category==="SALE"?p.salePrice===null:p.category!==category)) return false;
    const badge=params.get("badge")?.toUpperCase();
    if(badge && (badge==="SALE"?p.salePrice===null:p.badge!==badge)) return false;
    const sizes=safeJsonParse<string[]>(p.sizes,[]),colors=safeJsonParse<ShopColor[]>(p.colors,[]);
    if(params.get("size") && !sizes.includes(params.get("size")!)) return false;
    if(params.get("color") && !colors.some(c=>c.name.toLowerCase()===params.get("color")!.toLowerCase())) return false;
    if(params.get("material") && !p.material?.toLowerCase().includes(params.get("material")!.toLowerCase())) return false;
    if(params.get("productType") && p.productType!==params.get("productType")) return false;
    if(params.get("availability")==="in-stock" && p.stock<=0) return false;
    if(params.get("availability")==="sold-out" && p.stock>0) return false;
    const price=getProductPrice(p);
    for(const [key,below] of [["priceMin",true],["priceMax",false]] as const) {
      const raw=params.get(key);
      if(raw!==null && raw!=="" && Number.isFinite(Number(raw)) && (below?price<Number(raw):price>Number(raw))) return false;
    }
    return !query || query.split(/\s+/).every(word=>[p.title,p.description,p.category,p.productType,p.material,...colors.map(c=>c.name),...(p.tags||[])].join(" ").toLowerCase().includes(word));
  }).sort((a,b)=>{
    switch(params.get("sort")) {
      case "price-asc": return getProductPrice(a)-getProductPrice(b);
      case "price-desc": return getProductPrice(b)-getProductPrice(a);
      case "bestseller": return Number(b.badge==="BEST_SELLER")-Number(a.badge==="BEST_SELLER");
      default: return new Date(b.createdAt||0).getTime()-new Date(a.createdAt||0).getTime();
    }
  });
}
