import type { Metadata } from "next";
import React from "react";
import Modal from "@/components/modules/modal/Modal";
import Footer from "@/components/modules/footer/Footer";
import {
  archivo,
  archivoBlack,
  cinzelDecorative,
  crimson,
  cormorant,
} from "@/lib/styles/fonts";
import "./globals.css";
import { Header } from "@/components/modules/navigation/header/Header";
import ClientContextBoundary from "@/contexts/ClientContextBoundary";
import { getPublicSiteUrl } from "@/lib/config/publicSiteUrl";

const archiveTitle = "Joseph Laoutaris Art Archive";
const archiveDescription =
  "Browse the public Joseph Laoutaris art archive, including artwork, collections, biography, project writing, and enquiry-led shop listings.";

export const metadata: Metadata = {
  metadataBase: getPublicSiteUrl(),
  applicationName: archiveTitle,
  title: {
    default: archiveTitle,
    template: `%s | ${archiveTitle}`,
  },
  description: archiveDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: archiveTitle,
    title: archiveTitle,
    description: archiveDescription,
  },
  twitter: {
    card: "summary",
    title: archiveTitle,
    description: archiveDescription,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${archivo.variable} ${cinzelDecorative.variable} ${crimson.variable} ${cormorant.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-whitish">
        <ClientContextBoundary>
          <Modal />
          <Header className="fixed top-0 left-0 right-0 z-50" />
          <main className="mt-[140px] sm:mt-[210px] md:mt-[220px] lg:mt-[160px] min-h-[calc(100vh-130px)] flex flex-col">
            {children}
          </main>
          <Footer />
        </ClientContextBoundary>
      </body>
    </html>
  );
}
