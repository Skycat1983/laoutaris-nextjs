"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: {
        boundary: "global-error",
      },
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <h1 className="text-3xl font-bold">Something Went Wrong</h1>
          <p className="mt-4">{error.message}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={reset}
          >
            Try Again
          </button>
        </main>
      </body>
    </html>
  );
}
