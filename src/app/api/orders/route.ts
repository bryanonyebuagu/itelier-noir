import {NextRequest,NextResponse} from "next/server";
import {randomUUID} from "node:crypto";
import {db} from "@/utils/db";
import {getUserFromRequest} from "@/utils/auth";
import {shippingPrice,SHIPPING_METHODS,type ShippingMethod} from "@/utils/shipping";
import {safeJsonParse,type ShopColor} from "@/components/shop/types";
import {paystack,paymentSecret} from "@/utils/paystack";
export async function POST(request:NextRequest){
 try{
 const body=await request.json();const {email,phone,shippingAddress,shippingMethod,couponCode,items}=body;
 if(typeof email!=="string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof phone!=="string" || phone.length<8 || !shippingAddress || !["fullName","streetAddress","city","state","country"].every(k=>typeof shippingAddress[k]==="string" && shippingAddress[k].trim()) || !Array.isArray(items) || !items.length || items.length>50 || !Object.hasOwn(SHIPPING_METHODS,shippingMethod)) return NextResponse.json({error:"Check your contact details, delivery address and bag."},{status:400});
 if(shippingMethod==="SAME_DAY" && shippingAddress.state.toLowerCase()!=="lagos")return NextResponse.json({error:"Same-day delivery is available in Lagos only."},{status:400});
 if(body.paymentGateway && body.paymentGateway!=="PAYSTACK")return NextResponse.json({error:"Choose secure card checkout."},{status:400});
 const quantities=new Map<string,number>();
 for(const item of items){if(typeof item.productId!=="string" || !Number.isSafeInteger(item.quantity) || item.quantity<1 || item.quantity>100)return NextResponse.json({error:"Invalid item quantity."},{status:400});quantities.set(item.productId,(quantities.get(item.productId)||0)+item.quantity);}
 const products=await db.product.findMany({where:{id:{in:[...quantities.keys()]},isVisible:true}});
 const lines=[];
 for(const item of items){const p=products.find(p=>p.id===item.productId);if(!p || p.stock<(quantities.get(item.productId)||0))return NextResponse.json({error:"A piece is unavailable or your quantity exceeds its stock. Please update your bag."},{status:409});
 if(!safeJsonParse<string[]>(p.sizes,[]).includes(item.size) || !safeJsonParse<ShopColor[]>(p.colors,[]).some(c=>c.name===item.color))return NextResponse.json({error:"Choose an available size and colour."},{status:400});
 lines.push({productId:p.id,title:p.title,price:p.salePrice ?? p.basePrice,quantity:item.quantity,size:item.size,color:item.color,image:safeJsonParse<string[]>(p.images,[])[0]||""});}
 const subtotal=lines.reduce((sum,i)=>sum+i.price*i.quantity,0);let discount=0;let code:string|null=null;
 if(couponCode){if(typeof couponCode!=="string")return NextResponse.json({error:"Invalid coupon."},{status:400});const coupon=await db.coupon.findUnique({where:{code:couponCode.trim().toUpperCase()}});if(!coupon || !coupon.isActive || coupon.expiryDate<new Date() || coupon.usageCount>=coupon.maxUses)return NextResponse.json({error:"This coupon is no longer available."},{status:400});discount=Math.min(subtotal,Math.max(0,coupon.type==="PERCENTAGE"?subtotal*coupon.value/100:coupon.value));code=coupon.code;}
 const shippingCost=shippingPrice(subtotal,shippingMethod as ShippingMethod);const total=Math.round((subtotal-discount+shippingCost)*100)/100;
 try{paymentSecret();}catch(e){return NextResponse.json({error:(e as Error).message},{status:503});}
 const reference="IN-"+randomUUID();const orderNumber="IN-"+new Date().toISOString().slice(0,10).replaceAll("-","")+"-"+randomUUID().slice(0,8).toUpperCase();
 const user=getUserFromRequest(request);
 const order=await db.order.create({data:{orderNumber,userId:user?.id||null,email:email.trim().toLowerCase(),phone,shippingAddress:JSON.stringify(shippingAddress),shippingMethod,shippingCost,subtotal,discount,total,couponCode:code,paymentGateway:"PAYSTACK",paymentRef:reference,items:{create:lines}}});
 const origin=process.env.NEXT_PUBLIC_APP_URL||new URL(request.url).origin;
 try{const payment=await paystack("/transaction/initialize",{email:order.email,amount:Math.round(total*100),currency:"NGN",reference,callback_url:origin+"/checkout/return?orderId="+order.id,metadata:{orderId:order.id}});return NextResponse.json({authorizationUrl:payment.authorization_url,order:{id:order.id,orderNumber,total}});}
 catch(e){await db.order.update({where:{id:order.id},data:{status:"PAYMENT_INITIALIZATION_FAILED"}});throw e;}
 }catch(error){console.error("Checkout error",error instanceof Error?error.message:"Unknown error");return NextResponse.json({error:"Checkout could not start. Please try again."},{status:500});}
}
export async function GET(request:NextRequest){const user=getUserFromRequest(request);if(!user)return NextResponse.json({error:"Please sign in."},{status:401});const orders=await db.order.findMany({where:{userId:user.id},include:{items:true},orderBy:{createdAt:"desc"}});return NextResponse.json({orders});}
