import {NextRequest,NextResponse} from "next/server";
import sharp from "sharp";
import {getOwner} from "@/utils/owner";
export const runtime="nodejs";
export async function POST(request:NextRequest){
 if(!await getOwner(request))return NextResponse.json({error:"Only the website owner can upload product images."},{status:403});
 try{
  const form=await request.formData();const file=form.get("image");
  if(!(file instanceof File) || !file.size || file.size>3*1024*1024)return NextResponse.json({error:"Choose an image smaller than 3 MB."},{status:400});
  const buffer=Buffer.from(await file.arrayBuffer());
  const input=sharp(buffer,{limitInputPixels:20000000,failOn:"warning"});const metadata=await input.metadata();
  if(!metadata.format || !["jpeg","png","webp","avif"].includes(metadata.format))return NextResponse.json({error:"Choose a JPG, PNG, WebP or AVIF image."},{status:400});
  let optimized=await input.rotate().resize({width:1200,height:1600,fit:"inside",withoutEnlargement:true}).webp({quality:80}).toBuffer();
  if(optimized.length>250000)optimized=await sharp(buffer,{limitInputPixels:20000000}).rotate().resize({width:1000,height:1400,fit:"inside",withoutEnlargement:true}).webp({quality:70}).toBuffer();
  if(optimized.length>250000)return NextResponse.json({error:"This image is too large. Choose a smaller photo."},{status:400});
  // Embedded image bytes persist with the product in PostgreSQL, including on Vercel.
  return NextResponse.json({image:"data:image/webp;base64,"+optimized.toString("base64")});
 }catch{return NextResponse.json({error:"This image could not be read. Choose a different photo."},{status:400});}
}
