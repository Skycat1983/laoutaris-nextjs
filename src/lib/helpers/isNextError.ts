import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";
import { isStaticGenBailoutError } from "next/dist/client/components/static-generation-bailout";
import { isNotFoundError } from "next/dist/client/components/not-found";
import { isRedirectError } from "next/dist/client/components/redirect";

export const isNextError = (error: unknown) => {
  if (
    isStaticGenBailoutError(error) ||
    isNotFoundError(error) ||
    isRedirectError(error) ||
    isDynamicServerError(error)
  ) {
    return true;
  }
  return false;
};
