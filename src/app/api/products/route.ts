import {NextResponse} from "next/server";
import {filterCatalog,getCatalog} from "@/utils/catalog";
export async function GET(request:Request){return NextResponse.json({products:filterCatalog(await getCatalog(),new URL(request.url).searchParams)});}
