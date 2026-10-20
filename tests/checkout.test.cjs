const {test}=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
function route(file,mocks){const filename=path.resolve(__dirname,'../src/',file);const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));const requireOriginal=m.require.bind(m);m.require=id=>{if(id in mocks)return mocks[id];if(id==='next/server')return {NextResponse:{json:(body,options)=>({body,status:options?.status||200})}};if(id==='@/utils/shipping')return {SHIPPING_METHODS:{STANDARD:{},EXPRESS:{},SAME_DAY:{}},shippingPrice:(subtotal,method)=>subtotal>=150000&&method==='EXPRESS'?0:method==='STANDARD'?5000:method==='EXPRESS'?10000:15000};if(id==='@/components/shop/types')return {safeJsonParse:(s,f)=>{try{return JSON.parse(s)}catch{return f}}};return requireOriginal(id);};m._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,filename);return m.exports;}
const item={productId:'p1',quantity:2,size:'M',color:'Black',price:1};
const product={id:'p1',title:'Real product',stock:5,basePrice:100000,salePrice:null,sizes:'["M"]',colors:'[{"name":"Black"}]',images:'["/real.webp"]'};
const body={email:'buyer@example.com',phone:'08012345678',shippingAddress:{fullName:'Test Buyer',streetAddress:'Test street',city:'Lagos',state:'Lagos',country:'Nigeria'},shippingMethod:'EXPRESS',paymentGateway:'PAYSTACK',subtotal:1,total:1,discount:999999,items:[item]};
test('checkout ignores browser prices and user IDs when creating payment',async()=>{
 let created,initialized;
 const db={product:{findMany:async()=>[product]},order:{create:async({data})=>{created=data;return {...data,id:'order1'};}}};
 const {POST}=route('app/api/orders/route.ts',{'@/utils/db':{db},'@/utils/auth':{getUserFromRequest:()=>null},'@/utils/paystack':{paymentSecret:()=>true,paystack:async(_path,data)=>{initialized=data;return {authorization_url:'https://checkout.paystack.com/test'};}}});
 const response=await POST({url:'http://localhost:3000/api/orders',json:async()=>({...body,userId:'someone-else'})});
 assert.equal(response.status,200);assert.equal(created.subtotal,200000);assert.equal(created.total,200000);assert.equal(created.discount,0);assert.equal(created.shippingCost,0);assert.equal(created.userId,null);assert.equal(created.items.create[0].price,100000);assert.equal(initialized.amount,20000000);
});
test('checkout rejects negative quantities and combined variants exceeding stock',async()=>{
 const mocks={'@/utils/db':{db:{product:{findMany:async()=>[product]}}},'@/utils/auth':{getUserFromRequest:()=>null},'@/utils/paystack':{}};
 const {POST}=route('app/api/orders/route.ts',mocks);
 assert.equal((await POST({json:async()=>({...body,items:[{...item,quantity:-1}]})})).status,400);
 assert.equal((await POST({json:async()=>({...body,items:[{...item,quantity:3},{...item,quantity:3}]})})).status,409);
});
test('payment verification rejects an unrelated reference and incorrect amounts',async()=>{
 const order={id:'o1',paymentGateway:'PAYSTACK',paymentRef:'trusted-ref',paymentStatus:'UNPAID',total:100,email:'buyer@example.com',items:[]};
 const {POST}=route('app/api/checkout/verify/route.ts',{'@/utils/db':{db:{order:{findUnique:async()=>order}}},'@/utils/paystack':{paystack:async()=>({status:'success',currency:'NGN',amount:1,reference:'trusted-ref',customer:{email:order.email}})}});
 assert.equal((await POST({json:async()=>({orderId:'o1',reference:'fake-ref'})})).status,400);
 assert.equal((await POST({json:async()=>({orderId:'o1',reference:'trusted-ref'})})).status,400);
});
test('repeated verified callbacks do not reduce inventory twice',async()=>{
 const order={id:'o1',orderNumber:'IN-TEST',paymentGateway:'PAYSTACK',paymentRef:'trusted-ref',paymentStatus:'PAID',total:100,email:'buyer@example.com',items:[]};
 let transactions=0;
 const {POST}=route('app/api/checkout/verify/route.ts',{'@/utils/db':{db:{order:{findUnique:async()=>order},$transaction:async()=>{transactions++;}}},'@/utils/paystack':{paystack:async()=>({status:'success',currency:'NGN',amount:10000,reference:'trusted-ref',customer:{email:order.email}})}});
 for(let i=0;i<2;i++)assert.equal((await POST({json:async()=>({orderId:'o1',reference:'trusted-ref'})})).status,200);
 assert.equal(transactions,0);
});
