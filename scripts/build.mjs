import {spawnSync} from 'node:child_process';
const schema=process.env.DATABASE_URL?.startsWith('file:')?'prisma/schema.local.prisma':'prisma/schema.prisma';
for(const args of [['node_modules/prisma/build/index.js','generate','--schema',schema],['node_modules/next/dist/bin/next','build']]){
 const result=spawnSync(process.execPath,args,{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);
}
