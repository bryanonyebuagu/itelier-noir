import type {Metadata} from "next";
import "./globals.css";
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"),title:{default:"Itelier Noir | Contemporary Fashion & Custom Wear",template:"%s | Itelier Noir"},description:"Explore contemporary tailoring, Nigerian custom wear and expressive occasion pieces by Itelier Noir.",openGraph:{siteName:"Itelier Noir",type:"website",locale:"en_NG"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><a href="#page-content" className="skip-link">Skip to content</a><div id="page-content">{children}</div></body></html>;}
