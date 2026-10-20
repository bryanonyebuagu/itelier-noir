const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const ts=require('typescript');
const cache=new Map();
function load(file){
 const filename=path.resolve(__dirname,'../',file);
 if(cache.has(filename))return cache.get(filename).exports;
 const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(filename,m);
 const original=m.require.bind(m);
 m.require=(id)=>{
  if(id==='@/utils/db')return {db:{product:{findMany:async()=>{throw new Error('test offline')}}}};
  if(id.startsWith('@/')){const base='src/'+id.slice(2);return id.endsWith('.json')?JSON.parse(fs.readFileSync(path.resolve(__dirname,'../',base),'utf8')):load(base+'.ts');}
  return original(id);
 };
 m._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,filename);
 return m.exports;
}
const {shippingPrice}=load('src/utils/shipping.ts');
const {filterCatalog,getCatalog}=load('src/utils/catalog.ts');
const products=require('../src/data/products.json');
test('every product has a distinct existing garment image and valid selections',()=>{
 assert.equal(products.length,200);assert.equal(new Set(products.map(p=>p.slug)).size,200);
 const images=products.map(p=>JSON.parse(p.images)[0]);assert.equal(new Set(images).size,200);
 for(const p of products){assert.ok(fs.existsSync(path.resolve(__dirname,'../public'+JSON.parse(p.images)[0])));assert.ok(JSON.parse(p.sizes).length);assert.ok(JSON.parse(p.colors).length);assert.ok(p.basePrice>0);if(p.salePrice!==null)assert.ok(p.salePrice<p.basePrice);}
});
test('shipping uses the advertised express threshold without changing same-day rates',()=>{
 assert.equal(shippingPrice(149999,'EXPRESS'),10000);assert.equal(shippingPrice(150000,'EXPRESS'),0);assert.equal(shippingPrice(150000,'SAME_DAY'),15000);assert.equal(shippingPrice(10000,'STANDARD'),5000);
});
test('catalog combines search terms and filters with sale-aware sorting',()=>{
 const sale=filterCatalog(products,new URLSearchParams('category=SALE&sort=price-asc'));
 assert.equal(sale.length,3);assert.ok(sale.every(p=>p.salePrice!==null));assert.ok(sale.every((p,i)=>!i||p.salePrice>=sale[i-1].salePrice));
 assert.ok(filterCatalog(products,new URLSearchParams('search=ivory+kaftan')).some(p=>p.slug==='ivory-kaftan-set'));
 assert.equal(filterCatalog(products,new URLSearchParams('category=WOMEN&productType=Custom+Wear')).length,1);
 assert.equal(filterCatalog(products,new URLSearchParams('availability=sold-out')).length,3);
 assert.equal(filterCatalog(products,new URLSearchParams('color=Noir+Wine&size=XS')).length,1);
 assert.ok(filterCatalog(products,new URLSearchParams('priceMax=100000')).length>50);
});
test('catalog remains browsable while a database is unavailable',async()=>assert.equal((await getCatalog()).length,200));
test('passwords have independent salts and legacy credentials remain compatible',()=>{
 const {hashPassword,verifyPassword}=load('src/utils/auth.ts');const a=hashPassword('a-strong-test-password'),b=hashPassword('a-strong-test-password');assert.notEqual(a,b);assert.ok(verifyPassword('a-strong-test-password',a));assert.equal(verifyPassword('wrong',a),false);
 const legacy=require('node:crypto').createHash('sha256').update('legacy').digest('hex');assert.ok(verifyPassword('legacy',legacy));assert.equal(verifyPassword('legacy','invalid'),false);
});
test('cart rejects invalid quantities and enforces stock across sizes',()=>{
 const memory=new Map();global.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
 const {useCart}=load('src/store/useCart.ts');const cart=()=>useCart.getState();cart().clearCart();
 const p={productId:'test',title:'Test',price:100000,quantity:2,size:'M',color:'Black',image:'/test.webp',maxStock:3};
 cart().addItem(p);cart().addItem({...p,size:'L'});assert.equal(cart().items.reduce((s,i)=>s+i.quantity,0),3);
 cart().addItem({...p,productId:'zero',maxStock:0});cart().addItem({...p,quantity:-2});assert.equal(cart().items.length,2);
 cart().updateQuantity(cart().items[0].id,99);assert.equal(cart().items.reduce((s,i)=>s+i.quantity,0),3);
 cart().applyCoupon({code:'oversized',type:'PERCENTAGE',value:200});assert.equal(cart().getCartDiscount(),300000);
 cart().clearCart();assert.equal(cart().getCartTotal(),0);
});
test('owner product edits validate gallery, sizes and named colour swatches',()=>{
 const {validateProductInput}=load('src/utils/product-validation.ts');
 assert.equal(validateProductInput({images:['/images/products/test.webp'],sizes:['M','L'],colors:[{name:'Navy',hex:'#172642'}]}),null);
 assert.ok(validateProductInput({sizes:[]}));assert.ok(validateProductInput({sizes:['M','M']}));
 assert.ok(validateProductInput({images:['javascript:alert(1)']}));assert.ok(validateProductInput({colors:[{name:'',hex:'#172642'}]}));
 assert.ok(validateProductInput({colors:[{name:'Navy',hex:'#xyzxyz'}]}));assert.ok(validateProductInput({stock:-1}));
});

test('collections have 100 distinct items each and relevant product types',()=>{for(const category of ['MEN','WOMEN'])assert.equal(products.filter(p=>p.category===category).length,100);assert.equal(products.some(p=>p.category==='MEN'&&p.productType==='Dresses'),false);assert.ok(filterCatalog(products,new URLSearchParams('category=WOMEN&productType=Dresses')).length>10);assert.equal(filterCatalog(products,new URLSearchParams('category=MEN&productType=Watches')).length,6);assert.ok(filterCatalog(products,new URLSearchParams('category=MEN&ageGroup=Children')).every(p=>p.ageGroup==='Children'));assert.ok(products.some(p=>JSON.parse(p.sizes).includes('EU 20')));assert.ok(products.some(p=>JSON.parse(p.sizes).includes('EU 47')));});
test('favorites start empty and contain only explicitly saved products',()=>{const memory=new Map();global.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};const {useWishlist}=load('src/store/useWishlist.ts');const store=()=>useWishlist.getState();assert.deepEqual(store().items,[]);const item={productId:'favorite-test',title:'Selected piece',price:100,image:'/images/test.webp',slug:'selected-piece'};store().toggleWishlist(item);assert.deepEqual(store().items,[item]);assert.ok(memory.get('atelier-noir-wishlist').includes('favorite-test'));store().toggleWishlist(item);assert.deepEqual(store().items,[]);});
