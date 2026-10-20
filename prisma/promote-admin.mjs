import fs from 'node:fs';
import {PrismaClient} from '@prisma/client';
const email=process.argv[2]?.trim().toLowerCase();
if(!email){console.error('Usage: node prisma/promote-admin.mjs owner@example.com');process.exit(1);}
const db=new PrismaClient();
try{await db.user.update({where:{email},data:{role:'ADMIN'}});const envPath='.env';if(fs.existsSync(envPath)){let text=fs.readFileSync(envPath,'utf8');text=text.replace(/^OWNER_EMAIL=.*\r?\n?/m,'');fs.writeFileSync(envPath,text+'\nOWNER_EMAIL=\"'+email+'\"\n');}console.log('Owner account promoted. Configure the same OWNER_EMAIL in Vercel, restart the app, and sign in again.');}
finally{await db.$disconnect();}
