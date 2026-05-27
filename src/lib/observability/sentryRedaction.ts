import type { ErrorEvent, EventHint } from "@sentry/core";
import { redactEmailText, redactValue } from "@/lib/observability/redaction";

type SentryRequest = NonNullable<ErrorEvent["request"]>;
type SentryBreadcrumb = NonNullable<ErrorEvent["breadcrumbs"]>[number];
type SentryExceptionValue = NonNullable<
  NonNullable<ErrorEvent["exception"]>["values"]
>[number];

const removeQueryString = (value: string): string => {
  try {
    const url = new URL(value);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return value.split("?")[0] ?? value;
  }
};

const redactString = (value: string | undefined): string | undefined =>
  value === undefined ? undefined : redactEmailText(value);

const redactRecord = <T extends Record<string, unknown> | undefined>(
  value: T,
  path: string
): T =>
  (value === undefined ? undefined : redactValue(value, path)) as T;

const redactRequest = (
  request: SentryRequest | undefined
): SentryRequest | undefined => {
  if (!request) {
    return undefined;
  }

  return {
    method: request.method,
    url: request.url ? removeQueryString(request.url) : undefined,
    headers: undefined,
    cookies: undefined,
    data: undefined,
    query_string: undefined,
  };
};

const redactBreadcrumb = (breadcrumb: SentryBreadcrumb): SentryBreadcrumb => ({
  ...breadcrumb,
  message: redactString(breadcrumb.message),
  data: redactRecord(breadcrumb.data, "breadcrumb.data"),
});

const redactExceptionValue = (
  value: SentryExceptionValue
): SentryExceptionValue => ({
  ...value,
  value: redactString(value.value),
});

export const redactSentryEvent = (
  event: ErrorEvent,
  _hint?: EventHint
): ErrorEvent | null => ({
  ...event,
  user: undefined,
  request: redactRequest(event.request),
  extra: redactRecord(event.extra, "extra"),
  tags: redactRecord(event.tags, "tags"),
  contexts: redactRecord(event.contexts, "contexts"),
  breadcrumbs: event.breadcrumbs?.map(redactBreadcrumb),
  message: redactString(event.message),
  exception: event.exception
    ? {
        ...event.exception,
        values: event.exception.values?.map(redactExceptionValue),
      }
    : undefined,
});
