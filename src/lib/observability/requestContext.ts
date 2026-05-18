import "server-only";

import { randomUUID } from "crypto";
import type { NextRequest } from "next/server";

export const REQUEST_ID_HEADER = "X-Request-Id";

type HeaderGetter = {
  get(name: string): string | null;
};

type RequestLike = {
  headers?: HeaderGetter | Headers | Record<string, string | string[] | undefined>;
  method?: string;
  nextUrl?: {
    pathname?: string;
  };
  url?: string;
};

export type RequestContext = {
  requestId: string;
  method?: string;
  route?: string;
  responseHeaders: Headers;
};

const REQUEST_ID_PATTERN = /^[A-Za-z0-9._:-]+$/;
const MIN_REQUEST_ID_LENGTH = 8;
const MAX_REQUEST_ID_LENGTH = 128;

const getHeaderValue = (
  headers: RequestLike["headers"],
  name: string
): string | null => {
  if (!headers) {
    return null;
  }

  if (typeof (headers as HeaderGetter).get === "function") {
    return (headers as HeaderGetter).get(name);
  }

  const record = headers as Record<string, string | string[] | undefined>;
  const value = record[name] ?? record[name.toLowerCase()];

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
};

export const isSafeRequestId = (value: string | null | undefined): boolean => {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();

  return (
    trimmed === value &&
    trimmed.length >= MIN_REQUEST_ID_LENGTH &&
    trimmed.length <= MAX_REQUEST_ID_LENGTH &&
    REQUEST_ID_PATTERN.test(trimmed)
  );
};

const getSafeRequestId = (value: string | null | undefined): string | null =>
  isSafeRequestId(value) ? value ?? null : null;

export const createRequestId = (): string => randomUUID();

export const createRequestContext = (
  request: NextRequest | RequestLike,
  route?: string
): RequestContext => {
  const headerRequestId = getHeaderValue(request.headers, REQUEST_ID_HEADER);
  const requestId = getSafeRequestId(headerRequestId) ?? createRequestId();
  const pathname =
    route ??
    request.nextUrl?.pathname ??
    (request.url ? new URL(request.url).pathname : undefined);
  const responseHeaders = new Headers();
  responseHeaders.set(REQUEST_ID_HEADER, requestId);

  return {
    requestId,
    method: request.method,
    route: pathname,
    responseHeaders,
  };
};
