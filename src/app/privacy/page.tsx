import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Privacy information for the Joseph Laoutaris Art Archive, including account, contact, comment, newsletter, saved artwork, session, Cloudinary, Shopify, and YouTube data surfaces.",
  alternates: {
    canonical: "/privacy",
  },
};

const policyVersion = "2026-05-22 / owner approval v1";
const ownerName = "Heron Laoutaris";
const contactEmail = "hlaoutaris@gmail.com";

const Section = ({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) => (
  <section id={id} className="space-y-3">
    <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
    <div className="space-y-3 leading-7 text-gray-700">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="space-y-4 border-b border-gray-200 pb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          {policyVersion}
        </p>
        <h1 className="text-4xl font-semibold text-gray-950">Privacy</h1>
        <p className="max-w-3xl leading-7 text-gray-700">
          This page describes the data surfaces currently implemented in the
          Joseph Laoutaris Art Archive. {ownerName} is the developer and owner
          of the artwork and gallery content. Privacy and legal contact should
          be sent to{" "}
          <a className="underline" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          .
        </p>
      </div>

      <div className="mt-10 space-y-10">
        <Section title="Data Visitors Provide">
          <p>
            The site can receive information through account registration,
            OAuth sign-in, newsletter subscription, contact and artwork enquiry
            forms, public comments, and saved artwork lists. Depending on the
            action, that information can include account details, an OAuth
            profile identifier supplied by the provider, an email address,
            enquiry text, a normalized Shopify product handle for product
            enquiries, comment text, usernames, and saved artwork references.
          </p>
          <p>
            Admin tools can display and manage implemented records such as
            users, comments, enquiries, subscribers, and archive content. Do
            not submit payment details, credentials, or other sensitive private
            information through public forms or comments.
          </p>
        </Section>

        <Section title="How The Site Uses Data">
          <p>
            The app uses submitted information to operate accounts, support
            sign-in, save artwork lists, publish or manage comments, respond to
            contact and product enquiries, maintain newsletter records, and
            administer the public archive.
          </p>
          <p>
            Account, comment, subscriber, enquiry, and saved-artwork behavior is
            limited to what is implemented in this app. Separate consent,
            unsubscribe, account privacy request, moderation, and retention
            workflows remain separate implementation work unless they are later
            added.
          </p>
        </Section>

        <Section id="cookies-and-third-parties" title="Cookies And Third Parties">
          <p>
            The site uses NextAuth session behavior for account sign-in and can
            use OAuth providers when visitors choose provider sign-in. Those
            flows can set or read session-related cookies and can exchange
            sign-in information with the selected provider.
          </p>
          <p>
            Cloudinary is used for artwork and media delivery, and admin upload
            tooling can use Cloudinary upload features. Shopify product data can
            appear in the public shop, search, artwork, and product-detail
            views. When a valid hosted Shopify product link is available,
            purchase activity continues on Shopify-hosted pages; this app does
            not process payment details or store order records.
          </p>
          <p>
            Some pages can include YouTube embeds. Viewing embedded media can
            cause the browser to contact YouTube or Google services.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            For privacy or legal questions about this app and the gallery
            archive content, contact {ownerName} at{" "}
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
