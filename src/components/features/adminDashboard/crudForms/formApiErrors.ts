"use client";

import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import type { ApiErrorResponse } from "@/lib/data/types";

export type StructuredFormErrorResponse = ApiErrorResponse & {
  fieldErrors?: Partial<Record<string, string[] | undefined>>;
  formErrors?: string[];
};

const firstErrorMessage = (messages: unknown): string | null => {
  if (!Array.isArray(messages)) {
    return null;
  }

  return (
    messages.find(
      (message): message is string => typeof message === "string"
    ) ?? null
  );
};

export const applyApiFormErrors = <TFieldValues extends FieldValues>({
  form,
  response,
  visibleFields,
  fallbackMessage,
}: {
  form: UseFormReturn<TFieldValues>;
  response: StructuredFormErrorResponse;
  visibleFields: readonly Path<TFieldValues>[];
  fallbackMessage: string;
}) => {
  let appliedFieldError = false;
  const visibleFieldSet = new Set<string>(visibleFields);
  const formMessages =
    response.formErrors?.filter(
      (message): message is string => typeof message === "string"
    ) ?? [];

  Object.entries(response.fieldErrors ?? {}).forEach(([field, messages]) => {
    const message = firstErrorMessage(messages);
    if (!message) {
      return;
    }

    if (visibleFieldSet.has(field)) {
      form.setError(field as Path<TFieldValues>, {
        type: "server",
        message,
      });
      appliedFieldError = true;
      return;
    }

    formMessages.push(message);
  });

  if (formMessages.length > 0) {
    form.setError("root", {
      type: "server",
      message: formMessages.join(" "),
    });
    return;
  }

  if (!appliedFieldError) {
    form.setError("root", {
      type: "server",
      message: response.error || fallbackMessage,
    });
  }
};
