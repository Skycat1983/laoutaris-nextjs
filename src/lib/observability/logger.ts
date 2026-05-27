import "server-only";

import type { RequestContext } from "@/lib/observability/requestContext";
import { captureStructuredError } from "@/lib/observability/sentryCapture";
import {
  type RedactionOptions,
  type StructuredLogFields,
  redactFields,
} from "@/lib/observability/redaction";

type LogLevel = "debug" | "info" | "warn" | "error";

type ServerLoggerContext = {
  route?: string;
  component?: string;
  operation?: string;
  surface?: string;
};

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
  options?: RedactionOptions
) => {
  const log = (
    level: LogLevel,
    event: string,
    fields: StructuredLogFields = {}
  ) => {
    const payload = {
      level,
      event,
      requestId: context.requestId,
      method: context.method,
      route: context.route,
      timestamp: new Date().toISOString(),
      ...redactFields(fields, options),
    };

    writeLog(level, payload);

    if (level === "error") {
      captureStructuredError(event, payload);
    }
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

export const createServerLogger = (
  context: ServerLoggerContext = {},
  options?: RedactionOptions
) => {
  const log = (
    level: LogLevel,
    event: string,
    fields: StructuredLogFields = {}
  ) => {
    const payload = {
      level,
      event,
      timestamp: new Date().toISOString(),
      ...context,
      ...redactFields(fields, options),
    };

    writeLog(level, payload);

    if (level === "error") {
      captureStructuredError(event, payload);
    }
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
