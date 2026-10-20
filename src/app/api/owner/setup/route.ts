import {timingSafeEqual} from "node:crypto";
import {NextResponse} from "next/server";
import {db} from "@/utils/db";
import {hashPassword,generateToken} from "@/utils/auth";
export async function POST(request:Request){
 try{
  const {token,password,name}=await request.json();
  const secret=process.env.OWNER_SETUP_TOKEN;
  const email=process.env.OWNER_EMAIL?.trim().toLowerCase();
  if(!secret || !email || typeof token!=="string" || Buffer.byteLength(token)!==Buffer.byteLength(secret) || !timingSafeEqual(Buffer.from(token),Buffer.from(secret)))return NextResponse.json({error:"This owner invitation is invalid."},{status:403});
  if(!process.env.OWNER_SETUP_EXPIRES || Date.now()>Number(process.env.OWNER_SETUP_EXPIRES))return NextResponse.json({error:"This owner invitation has expired."},{status:410});
  if(typeof password!=="string" || password.length<12 || password.length>256 || typeof name!=="string" || !name.trim() || name.length>100)return NextResponse.json({error:"Enter your name and a password of at least 12 characters."},{status:400});
  const user=await db.$transaction(async tx=>{
   const existing=await tx.user.findUnique({where:{email}});
   if(existing?.role==="ADMIN")return null;
   const data={name:name.trim(),passwordHash:hashPassword(password),role:"ADMIN"};
   if(existing){const changed=await tx.user.updateMany({where:{id:existing.id,role:{not:"ADMIN"}},data});if(!changed.count)return null;return tx.user.findUnique({where:{id:existing.id}});}
   return tx.user.create({data:{...data,email}});
  });
  if(!user)return NextResponse.json({error:"Owner access is already active. Please sign in."},{status:409});
  const response=NextResponse.json({success:true});
  response.cookies.set({name:"atelier_auth_token",value:generateToken({id:user.id,email:user.email,role:user.role,name:user.name}),httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:60*60*24*7});
  response.headers.set("Cache-Control","no-store");return response;
 }catch{return NextResponse.json({error:"Owner setup could not be completed. Please try again."},{status:500});}
}
