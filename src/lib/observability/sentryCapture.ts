import "server-only";

import * as Sentry from "@sentry/nextjs";
import { redactFields } from "@/lib/observability/redaction";

type ErrorPayload = {
  name?: unknown;
  message?: unknown;
};

const SENTRY_TAG_MAX_LENGTH = 200;

const asErrorPayload = (value: unknown): ErrorPayload | null =>
  typeof value === "object" && value !== null ? (value as ErrorPayload) : null;

const getSafeError = (payload: Record<string, unknown>): Error => {
  const errorPayload = asErrorPayload(payload.error);
  const message =
    typeof errorPayload?.message === "string"
      ? errorPayload.message
      : "Structured server error";
  const error = new Error(message);

  if (typeof errorPayload?.name === "string") {
    error.name = errorPayload.name;
  }

  return error;
};

const toTagValue = (value: unknown): string | undefined => {
  if (typeof value !== "string" || value.length === 0) {
    return undefined;
  }

  return value.slice(0, SENTRY_TAG_MAX_LENGTH);
};

export const captureStructuredError = (
  event: string,
  payload: Record<string, unknown>
): void => {
  const sentryPayload = redactFields(payload);

  Sentry.withScope((scope) => {
    scope.setLevel("error");
    scope.setTag("observability.event", event.slice(0, SENTRY_TAG_MAX_LENGTH));

    const requestId = toTagValue(sentryPayload.requestId);
    const route = toTagValue(sentryPayload.route);
    const method = toTagValue(sentryPayload.method);

    if (requestId) {
      scope.setTag("request_id", requestId);
    }

    if (route) {
      scope.setTag("route", route);
    }

    if (method) {
      scope.setTag("method", method);
    }

    scope.setContext("observability", sentryPayload);
    Sentry.captureException(getSafeError(sentryPayload));
  });
};
