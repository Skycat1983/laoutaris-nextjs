import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import React from "react";
import { GlobalFeaturesProvider } from "@/contexts/GlobalFeaturesContext";
import { SessionContextProvider } from "@/contexts/SessionProvider";
import Modal from "@/components/ui/modal/Modal";
import Footer from "@/components/ui/footer/Footer";
import {
  archivo,
  archivoBlack,
  cinzelDecorative,
  crimson,
  cormorant,
} from "@/lib/client/styles/fonts";
import "./globals.css";
import { handler } from "./api/auth/[...nextauth]/route";
import { authOptions } from "@/lib/config/authOptions";
import Header from "@/components/ui/header/header";
import { Sidebar } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${archivo.variable} ${cinzelDecorative.variable} ${crimson.variable} ${cormorant.variable}`}
    >
      <body className="pt-[130px] sm:pt-[210px] md:pt-[200px] lg:pt-[140px] bg-whitish">
        <SessionContextProvider session={session}>
          <GlobalFeaturesProvider>
            <Modal />
            <Header />
            {children}
            <Footer />
          </GlobalFeaturesProvider>
        </SessionContextProvider>
      </body>
    </html>
  );
}

{
  /* <div className="mt-[130px] sm:mt-[210px] md:mt-[200px] lg:mt-[140px] h-[5px] w-full container"></div> */
}

// user: {
//   name: 'Heron',
//   email: 'hlaoutaris@gmail.com',
//   image: 'https://avatars.githubusercontent.com/u/106820512?v=4'
// }

// regular session {
//   user: { email: 'testing91@testing.com', password: 'testing91' },
//   expires: '2024-08-15T15:42:13.592Z',
//   iat: 1723736523,
//   exp: 1723736533
// }

// const archivoBlack = Archivo_Black({
//   weight: "400",
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-archivo-black",
// });

// const archivo = Archivo({
//   weight: ["400", "500", "600", "700", "800"],
//   subsets: ["latin"],
//   // display: "swap",

//   variable: "--font-archivo",
// });

// const cinzelDecorative = Cinzel_Decorative({
//   weight: "400",
//   subsets: ["latin"],
//   display: "swap",

//   variable: "--font-cinzel-decorative",
// });

// const crimson = Crimson_Text({
//   weight: ["400"],
//   subsets: ["latin"],
//   display: "swap",

//   variable: "--font-crimson",
// });
