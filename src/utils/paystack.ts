export function paymentSecret() {
  const key=process.env.PAYSTACK_SECRET_KEY;
  if(!key || !/^sk_(test|live)_/.test(key) || key.includes("mock")) throw new Error("Card checkout is being configured. Please contact the boutique before placing an order.");
  return key;
}
export async function paystack(path:string,body?:object) {
  const response=await fetch(`https://api.paystack.co${path}`,{method:body?"POST":"GET",headers:{Authorization:`Bearer ${paymentSecret()}`,"Content-Type":"application/json"},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000),cache:"no-store"});
  const result=await response.json();
  if(!response.ok || !result.status) throw new Error("The payment provider could not complete this request. Please try again.");
  return result.data;
}
