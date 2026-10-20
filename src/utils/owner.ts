import {NextRequest} from "next/server";
import {db} from "@/utils/db";
import {getUserFromRequest} from "@/utils/auth";
export async function getOwner(request:NextRequest){
 const session=getUserFromRequest(request);
 const email=process.env.OWNER_EMAIL?.trim().toLowerCase();
 if(!session || !email)return null;
 const user=await db.user.findUnique({where:{id:session.id}});
 return user?.role==="ADMIN" && user.email.toLowerCase()===email ? user : null;
}
