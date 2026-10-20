import { PrismaClient } from '@prisma/client';
import { readFile } from 'node:fs/promises';
const db=new PrismaClient();
try {
  const products=JSON.parse(await readFile(new URL('../src/data/products.json',import.meta.url),'utf8'));
  for(const item of products) {
    const {id,slug,title,description,basePrice,salePrice,stock,category,badge,images,sizes,colors,material,care,productType,ageGroup}=item;
    const data={title,description,basePrice,salePrice,stock,category,badge,images,sizes,colors,material,care,productType,ageGroup:ageGroup||"Adults"};
    const existing=await db.product.findUnique({where:{slug}});
    await db.product.upsert({where:{slug},create:{id,slug,...data},update:process.argv.includes('--refresh-catalog')?{...data,stock:existing?.stock ?? stock}:{...(!existing?.productType?{productType}:{}),...(!existing?.ageGroup?{ageGroup:ageGroup||"Adults"}:{})}});
  }
  console.log(`Synced ${products.length} products; customer and order records preserved.`);
} finally {await db.$disconnect();}
