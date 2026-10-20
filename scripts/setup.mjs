import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {randomBytes} from 'node:crypto';
if(!fs.existsSync('.env'))fs.writeFileSync('.env',`DATABASE_URL="file:./dev.db"\nJWT_SECRET="${randomBytes(48).toString('hex')}"\nNEXT_PUBLIC_APP_URL="http://localhost:3000"\nPAYSTACK_SECRET_KEY=""\n`);
const envText=fs.readFileSync('.env','utf8');
const match=envText.match(/^DATABASE_URL\s*=\s*"?(file:[^"\r\n]+)/m);
if(match){const local=match[1].slice(5);const target=new URL('../prisma/'+local,import.meta.url);if(!fs.existsSync(target))fs.closeSync(fs.openSync(target,'a'));}
for(const args of [['node_modules/prisma/build/index.js','generate','--schema','prisma/schema.local.prisma'],['node_modules/prisma/build/index.js','db','push','--schema','prisma/schema.local.prisma'],['--env-file=.env','prisma/seed.mjs']]) {
 const result=spawnSync(process.execPath,args,{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);
}
