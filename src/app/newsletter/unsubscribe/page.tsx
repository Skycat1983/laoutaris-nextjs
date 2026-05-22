import type { Metadata } from "next";
import UnsubscribeForm from "@/components/modules/forms/user/UnsubscribeForm";
import { unsubscribeTokenSchema } from "@/lib/data/schemas/subscriberSchema";

export const metadata: Metadata = {
  title: "Newsletter Unsubscribe",
  description: "Unsubscribe from Joseph Laoutaris Art Archive newsletter emails.",
  alternates: {
    canonical: "/newsletter/unsubscribe",
  },
};

type UnsubscribePageProps = {
  searchParams?: {
    token?: string | string[];
  };
};

const getToken = (searchParams?: UnsubscribePageProps["searchParams"]) => {
  const rawToken = Array.isArray(searchParams?.token)
    ? searchParams?.token[0]
    : searchParams?.token;
  const parsedToken = unsubscribeTokenSchema.safeParse(rawToken);

  return parsedToken.success ? parsedToken.data : null;
};

export default function NewsletterUnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  const token = getToken(searchParams);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold text-gray-950">
          Newsletter Unsubscribe
        </h1>
        <p className="leading-7 text-gray-700">
          Use this page to stop receiving newsletter emails from the Joseph
          Laoutaris Art Archive.
        </p>
        {token ? (
          <UnsubscribeForm token={token} />
        ) : (
          <p className="text-red-700">
            This unsubscribe link is invalid or has expired.
          </p>
        )}
      </div>
    </main>
  );
}
