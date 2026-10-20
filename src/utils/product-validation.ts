export function validateProductInput(body:Record<string,unknown>):string|null {
 if(body.productType!==undefined && (typeof body.productType!=="string" || !body.productType.trim() || body.productType.length>60))return "Enter a product type.";
 if(body.ageGroup!==undefined && !["Adults","Children"].includes(String(body.ageGroup)))return "Choose Adults or Children.";
 const list=(value:unknown)=>{try{return typeof value==="string"?JSON.parse(value):value;}catch{return null;}};
 for(const field of ["basePrice","salePrice"]){const value=body[field];if(value!==undefined && value!==null && (!Number.isFinite(Number(value)) || Number(value)<0))return "Enter a valid price.";}
 if(body.stock!==undefined && (!Number.isInteger(Number(body.stock)) || Number(body.stock)<0))return "Stock must be a whole number of zero or more.";
 if(body.images!==undefined){const images=list(body.images);if(!Array.isArray(images) || !images.length || images.length>10 || JSON.stringify(images).length>3500000 || images.some(s=>typeof s!=="string" || !(s.startsWith("/images/") || /^data:image\/webp;base64,[A-Za-z0-9+/]+=*$/.test(s) || /^https:\/\/(images\.unsplash\.com|res\.cloudinary\.com|bmjuezkwusobtgommzmu\.supabase\.co)\//.test(s))))return "Add 1–10 valid product images.";}
 if(body.sizes!==undefined){const sizes=list(body.sizes);if(!Array.isArray(sizes)||!sizes.length||sizes.length>30||sizes.some(s=>typeof s!=="string"||!s.trim()||s.length>20)||new Set(sizes).size!==sizes.length)return "Select at least one available size. Sizes must be unique.";}
 if(body.colors!==undefined){const colors=list(body.colors);if(!Array.isArray(colors)||!colors.length||colors.length>30||colors.some(c=>!c||typeof c.name!=="string"||!c.name.trim()||c.name.length>60||!/^#[a-f\d]{6}$/i.test(c.hex))||new Set(colors.map(c=>c.name.trim().toLowerCase())).size!==colors.length)return "Give every colour a unique name and a valid swatch.";}
 return null;
}
