import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms for using the Joseph Laoutaris Art Archive, including archive browsing, accounts, comments, artwork content, and Shopify-hosted purchase handoff boundaries.",
  alternates: {
    canonical: "/terms",
  },
};

const policyVersion = "2026-05-22 / owner approval v1";
const ownerName = "Heron Laoutaris";
const contactEmail = "hlaoutaris@gmail.com";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="space-y-3">
    <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
    <div className="space-y-3 leading-7 text-gray-700">{children}</div>
  </section>
);

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="space-y-4 border-b border-gray-200 pb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          {policyVersion}
        </p>
        <h1 className="text-4xl font-semibold text-gray-950">Terms</h1>
        <p className="max-w-3xl leading-7 text-gray-700">
          These terms describe expected use of the Joseph Laoutaris Art Archive.
          {" "}
          {ownerName} is the developer and owner of the artwork and gallery
          content. Legal contact should be sent to{" "}
          <a className="underline" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          .
        </p>
      </div>

      <div className="mt-10 space-y-10">
        <Section title="Archive Use">
          <p>
            The site is a public archive and browsing experience for Joseph
            Laoutaris artwork, collections, biography, project writing, blog
            content, search, and shop discovery. Visitors may use the site to
            browse the archive, contact the gallery, and follow hosted Shopify
            product links when those links are available.
          </p>
        </Section>

        <Section title="Accounts, Saved Artworks, And Comments">
          <p>
            Account features can support sign-in, saved artwork lists, user
            settings, and comments where implemented. Visitors are responsible
            for activity submitted through their accounts.
          </p>
          <p>
            Comments should stay relevant to the archive and should not include
            private information, credentials, payment details, abusive content,
            or material the commenter does not have permission to share. Admins
            can manage user and comment records through the existing admin
            tools.
          </p>
        </Section>

        <Section title="Artwork And Gallery Content">
          <p>
            Joseph Laoutaris artwork, artwork images, archive text, gallery
            records, and other site content are owned or managed by {ownerName}
            unless a page states otherwise. Do not copy, republish, or reuse
            artwork or gallery content outside this site without permission from
            the content owner.
          </p>
        </Section>

        <Section title="Shopify-Hosted Purchase Boundary">
          <p>
            Product pages can show Shopify product data and can link to a
            hosted Shopify product page when Shopify provides a valid public
            product URL. Purchases continue on Shopify-hosted pages. This app
            does not operate an owned cart, checkout, payment processing, order
            management, shipping, returns, refunds, fulfilment, taxes, or buyer
            support workflow.
          </p>
          <p>
            Shopify-hosted policy target URLs have not been supplied for this
            app. Product questions can be sent through the gallery contact and
            enquiry paths where available.
          </p>
        </Section>

        <Section title="Privacy And Contact">
          <p>
            The privacy page describes the app&apos;s current data surfaces,
            session behavior, and third-party services. Read{" "}
            <Link className="underline" href="/privacy">
              Privacy
            </Link>{" "}
            or contact {ownerName} at{" "}
            <a className="underline" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
            .
          </p>
        </Section>
      </div>
    </main>
  );
}
