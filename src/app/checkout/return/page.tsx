"use client";
import {Suspense,useEffect,useState} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {useCart} from "@/store/useCart";
function Verify(){const params=useSearchParams();const [error,setError]=useState("");const clear=useCart(s=>s.clearCart);
 useEffect(()=>{let active=true;const orderId=params.get("orderId"),reference=params.get("reference")||params.get("trxref");if(!orderId||!reference){setError("Missing payment details. Please keep your receipt and contact the boutique.");return;}fetch("/api/checkout/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId,reference})}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error);if(active){clear();window.location.replace('/checkout/confirmation?orderNumber='+encodeURIComponent(d.orderNumber)+'&email='+encodeURIComponent(d.email));}}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[params,clear]);
 return <main className="container" style={{padding:"100px 20px",textAlign:"center"}}><h1>{error?"Payment needs attention":"Confirming your payment…"}</h1><p role="status">{error||"Please wait while we check your payment securely."}</p>{error&&<><button className="btn-primary" onClick={()=>window.location.reload()}>Try verification again</button><p><Link href="/tracking">Track your order</Link></p></>}</main>;}
export default function PaymentReturn(){return <Suspense fallback={<p>Checking payment…</p>}><Verify/></Suspense>;}
