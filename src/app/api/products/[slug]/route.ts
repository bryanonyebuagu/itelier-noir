import {NextResponse} from "next/server";
import {getCatalog} from "@/utils/catalog";
export async function GET(_request:Request,{params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const product=(await getCatalog()).find(p=>p.slug===slug);
 if(!product)return NextResponse.json({error:"Product not found"},{status:404});
 const totalReviews=product.reviews.length;
 const averageRating=totalReviews?product.reviews.reduce((sum,r)=>sum+r.rating,0)/totalReviews:0;
 return NextResponse.json({product,totalReviews,averageRating});
}
