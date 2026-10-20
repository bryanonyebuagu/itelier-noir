import {NextResponse} from "next/server";
import {db} from "@/utils/db";
import {paystack} from "@/utils/paystack";
export async function POST(request:Request){
 try{
 const {orderId,reference}=await request.json();if(typeof orderId!=="string"||typeof reference!=="string")return NextResponse.json({error:"Missing payment reference."},{status:400});
 const order=await db.order.findUnique({where:{id:orderId},include:{items:true}});
 if(!order || order.paymentGateway!=="PAYSTACK" || order.paymentRef!==reference)return NextResponse.json({error:"Payment reference does not match this order."},{status:400});
 const payment=await paystack("/transaction/verify/"+encodeURIComponent(reference));
 if(payment.status!=="success" || payment.currency!=="NGN" || payment.amount!==Math.round(order.total*100) || payment.reference!==reference || payment.customer?.email?.toLowerCase()!==order.email.toLowerCase())return NextResponse.json({error:"Payment has not been verified. Your bag is saved; please check with your provider before trying again."},{status:400});
 if(order.paymentStatus!=="PAID"){
  try{await db.$transaction(async tx=>{
    const claimed=await tx.order.updateMany({where:{id:order.id,paymentStatus:"UNPAID"},data:{paymentStatus:"PAID",status:"PROCESSING"}});if(!claimed.count)return;
    const quantities=new Map<string,number>();for(const i of order.items)quantities.set(i.productId,(quantities.get(i.productId)||0)+i.quantity);
    for(const [id,quantity] of quantities){const updated=await tx.product.updateMany({where:{id,stock:{gte:quantity}},data:{stock:{decrement:quantity}}});if(!updated.count)throw new Error("STOCK_CONFLICT");}
    if(order.couponCode)await tx.coupon.update({where:{code:order.couponCode},data:{usageCount:{increment:1}}});
  });}catch(e){if(e instanceof Error && e.message==="STOCK_CONFLICT")await db.order.updateMany({where:{id:order.id,paymentStatus:"UNPAID"},data:{paymentStatus:"PAID",status:"ON_HOLD"}});else throw e;}
 }
 return NextResponse.json({success:true,orderNumber:order.orderNumber,email:order.email});
 }catch{ return NextResponse.json({error:"Payment verification is unavailable. Please keep your payment reference and try again."},{status:503}); }
}
