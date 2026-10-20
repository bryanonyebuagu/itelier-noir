import { NextRequest,NextResponse } from "next/server";
import { db } from "@/utils/db";
import { getUserFromRequest } from "@/utils/auth";
export async function GET(request:NextRequest) {
  const user=getUserFromRequest(request);if(!user)return NextResponse.json({error:"Please sign in."},{status:401});
  const addresses=await db.address.findMany({where:{userId:user.id},orderBy:{createdAt:"desc"}});
  return NextResponse.json({addresses});
}
export async function POST(request:NextRequest) {
  const user=getUserFromRequest(request);if(!user)return NextResponse.json({error:"Please sign in."},{status:401});
  try {
    const body=await request.json();
    const required=["fullName","phone","streetAddress","city","state","postalCode"];
    if(!required.every(k=>typeof body[k]==="string" && body[k].trim().length>0 && body[k].length<250))return NextResponse.json({error:"Complete all delivery address fields."},{status:400});
    const count=await db.address.count({where:{userId:user.id}});
    if(count>=20)return NextResponse.json({error:"You can save up to 20 addresses."},{status:400});
    const address=await db.address.create({data:{userId:user.id,email:user.email,name:typeof body.name==="string"?body.name.slice(0,80):"Home",fullName:body.fullName,phone:body.phone,streetAddress:body.streetAddress,apartment:typeof body.apartment==="string"?body.apartment.slice(0,250):null,city:body.city,state:body.state,postalCode:body.postalCode,country:"Nigeria",isDefault:count===0}});
    return NextResponse.json({address},{status:201});
  }catch{return NextResponse.json({error:"Could not save this address."},{status:500});}
}
