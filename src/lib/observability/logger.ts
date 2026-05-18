import "server-only";

import type { RequestContext } from "@/lib/observability/requestContext";

type LogLevel = "debug" | "info" | "warn" | "error";

type StructuredLogFields = Record<string, unknown>;

type LoggerOptions = {
  includeStack?: boolean;
  allowEmailFields?: string[];
};

const REDACTED = "[redacted]";
const SECRET_KEY_PATTERN =
  /(authorization|cookie|credential|password|secret|session|token|api[-_]?key)/i;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof Error);

const shouldAllowEmail = (path: string, options?: LoggerOptions): boolean =>
  options?.allowEmailFields?.includes(path) ?? false;

const redactValue = (
  value: unknown,
  path: string,
  options?: LoggerOptions
): unknown => {
  const key = path.split(".").at(-1) ?? path;

  if (SECRET_KEY_PATTERN.test(key)) {
    return REDACTED;
  }

  if (value instanceof Error) {
    return normalizeError(value, options);
  }

  if (typeof value === "string") {
    return shouldAllowEmail(path, options) ? value : value.replace(EMAIL_PATTERN, REDACTED);
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => redactValue(item, `${path}.${index}`, options));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([nestedKey, nestedValue]) => [
        nestedKey,
        redactValue(nestedValue, path ? `${path}.${nestedKey}` : nestedKey, options),
      ])
    );
  }

  return value;
};

const normalizeError = (
  error: Error,
  options?: LoggerOptions
): Record<string, unknown> => ({
  name: error.name,
  message: error.message.replace(EMAIL_PATTERN, REDACTED),
  ...(options?.includeStack ? { stack: error.stack } : {}),
});

const redactFields = (
  fields: StructuredLogFields,
  options?: LoggerOptions
): Record<string, unknown> =>
  redactValue(fields, "", options) as Record<string, unknown>;

const writeLog = (level: LogLevel, payload: Record<string, unknown>) => {
  const line = JSON.stringify(payload);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.info(line);
};

export const createApiLogger = (
  context: Pick<RequestContext, "requestId" | "method" | "route">,
  options?: LoggerOptions
) => {
  const log = (
    level: LogLevel,
    event: string,
    fields: StructuredLogFields = {}
  ) => {
    writeLog(level, {
      level,
      event,
      requestId: context.requestId,
      method: context.method,
      route: context.route,
      timestamp: new Date().toISOString(),
      ...redactFields(fields, options),
    });
  };

  return {
    debug: (event: string, fields?: StructuredLogFields) =>
      log("debug", event, fields),
    info: (event: string, fields?: StructuredLogFields) =>
      log("info", event, fields),
    warn: (event: string, fields?: StructuredLogFields) =>
      log("warn", event, fields),
    error: (event: string, fields?: StructuredLogFields) =>
      log("error", event, fields),
  };
};
