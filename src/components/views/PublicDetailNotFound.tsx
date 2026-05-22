import Link from "next/link";

type PublicDetailNotFoundProps = {
  title: string;
  message: string;
  returnHref: string;
  returnLabel: string;
};

export function PublicDetailNotFound({
  title,
  message,
  returnHref,
  returnLabel,
}: PublicDetailNotFoundProps) {
  return (
    <main className="grid min-h-[60vh] place-items-center px-6 py-24">
      <section className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase text-neutral-500">
          Not found
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-neutral-950 md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">{message}</p>
        <Link
          className="mt-8 inline-flex min-h-10 items-center justify-center border-2 border-black bg-whitish px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          href={returnHref}
        >
          {returnLabel}
        </Link>
      </section>
    </main>
  );
}
