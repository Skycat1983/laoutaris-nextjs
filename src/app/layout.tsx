import type { Metadata } from "next";
import { getSession } from "@/lib/server/user/session/session";
import { getServerSession } from "next-auth";

import React from "react";
import { GlobalFeaturesProvider } from "@/lib/client/contexts/GlobalFeaturesContext";
import SessionProvider, {
  SessionContextProvider,
} from "@/lib/client/contexts/SessionProvider";

import Header from "@/components/ui/header/Header";
import Modal from "@/components/ui/modal/Modal";
import Footer from "@/components/ui/footer/Footer";
import {
  archivo,
  archivoBlack,
  cinzelDecorative,
  crimson,
} from "@/lib/client/styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const githubSession = await getServerSession();
  console.log("githubSession", githubSession);

  const session = await getSession();

  console.log("regular session", session);
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${archivo.variable} ${cinzelDecorative.variable} ${crimson.variable}`}
    >
      <body>
        <SessionContextProvider session={githubSession}>
          <GlobalFeaturesProvider>
            <Modal />
            <Header />
            <div className="mt-[120px] sm:mt-[180px] md:mt-[230px] lg:mt-[150px] h-[5px] w-full container"></div>
            {children}
            <Footer />
          </GlobalFeaturesProvider>
        </SessionContextProvider>
      </body>
    </html>
  );
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
