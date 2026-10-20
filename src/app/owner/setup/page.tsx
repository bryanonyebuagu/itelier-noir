import OwnerSetup from "./OwnerSetup";
export const dynamic="force-dynamic";
export const metadata={title:"Activate owner access",robots:{index:false,follow:false},referrer:"no-referrer" as const};
export default async function OwnerSetupPage({searchParams}:{searchParams:Promise<{token?:string}>}){
 const {token=""}=await searchParams;
 return <OwnerSetup email={process.env.OWNER_EMAIL||""} token={token}/>;
}
