import * as Sentry from "@sentry/nextjs";
import { redactSentryEvent } from "@/lib/observability/sentryRedaction";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  sendDefaultPii: false,
  tracesSampleRate: 0,
  beforeSend: redactSentryEvent,
});
