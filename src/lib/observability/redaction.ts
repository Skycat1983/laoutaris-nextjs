export type RedactionOptions = {
  includeStack?: boolean;
  allowEmailFields?: string[];
};

export type StructuredLogFields = Record<string, unknown>;

export const REDACTED = "[redacted]";

const SECRET_KEY_PATTERN =
  /(authorization|cookie|credential|password|secret|session|token|api[-_]?key)/i;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof Error);

export const redactEmailText = (value: string): string =>
  value.replace(EMAIL_PATTERN, REDACTED);

const shouldAllowEmail = (
  path: string,
  options?: RedactionOptions
): boolean => options?.allowEmailFields?.includes(path) ?? false;

export const normalizeError = (
  error: Error,
  options?: RedactionOptions
): Record<string, unknown> => ({
  name: error.name,
  message: redactEmailText(error.message),
  ...(options?.includeStack ? { stack: error.stack } : {}),
});

export const redactValue = (
  value: unknown,
  path: string,
  options?: RedactionOptions
): unknown => {
  const key = path.split(".").at(-1) ?? path;

  if (SECRET_KEY_PATTERN.test(key)) {
    return REDACTED;
  }

  if (value instanceof Error) {
    return normalizeError(value, options);
  }

  if (typeof value === "string") {
    return shouldAllowEmail(path, options) ? value : redactEmailText(value);
  }

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      redactValue(item, `${path}.${index}`, options)
    );
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([nestedKey, nestedValue]) => [
        nestedKey,
        redactValue(
          nestedValue,
          path ? `${path}.${nestedKey}` : nestedKey,
          options
        ),
      ])
    );
  }

  return value;
};

export const redactFields = (
  fields: StructuredLogFields,
  options?: RedactionOptions
): Record<string, unknown> =>
  redactValue(fields, "", options) as Record<string, unknown>;
