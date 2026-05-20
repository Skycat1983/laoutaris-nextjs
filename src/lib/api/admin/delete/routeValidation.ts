import { NextResponse } from "next/server";
import { z } from "zod";
import type { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import type { AdminDeleteResource } from "./previewTypes";
import {
  ADMIN_DELETE_EVIDENCE_REFERENCE_MAX_LENGTH,
  ADMIN_DELETE_EVIDENCE_REFERENCE_MIN_LENGTH,
} from "./evidenceTypes";

export type { AdminDeleteResource } from "./previewTypes";

type AdminDeleteFieldErrors = {
  id?: string[];
  backupExportConfirmed?: string[];
  backupExportReference?: string[];
  ownerReviewConfirmed?: string[];
  ownerReviewReference?: string[];
};

type AdminDeleteValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: AdminDeleteFieldErrors;
  formErrors: string[];
};

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const isValidObjectIdParam = (id: string) => objectIdPattern.test(id);

const adminDeleteEvidenceSchema = z
  .object({
    backupExportConfirmed: z
      .boolean({
        required_error: "Confirm backup/export evidence before deleting.",
        invalid_type_error: "Confirm backup/export evidence before deleting.",
      })
      .refine((value) => value === true, {
        message: "Confirm backup/export evidence before deleting.",
      }),
    backupExportReference: z
      .string({
        required_error: "Enter backup/export evidence reference.",
        invalid_type_error: "Enter backup/export evidence reference.",
      })
      .trim()
      .min(
        ADMIN_DELETE_EVIDENCE_REFERENCE_MIN_LENGTH,
        "Enter backup/export evidence reference."
      )
      .max(
        ADMIN_DELETE_EVIDENCE_REFERENCE_MAX_LENGTH,
        `Backup/export evidence reference must be ${ADMIN_DELETE_EVIDENCE_REFERENCE_MAX_LENGTH} characters or fewer.`
      ),
    ownerReviewConfirmed: z
      .boolean({
        required_error: "Confirm owner/delegated review before deleting.",
        invalid_type_error: "Confirm owner/delegated review before deleting.",
      })
      .refine((value) => value === true, {
        message: "Confirm owner/delegated review before deleting.",
      }),
    ownerReviewReference: z
      .string({
        required_error: "Enter owner/delegated review evidence reference.",
        invalid_type_error: "Enter owner/delegated review evidence reference.",
      })
      .trim()
      .min(
        ADMIN_DELETE_EVIDENCE_REFERENCE_MIN_LENGTH,
        "Enter owner/delegated review evidence reference."
      )
      .max(
        ADMIN_DELETE_EVIDENCE_REFERENCE_MAX_LENGTH,
        `Owner/delegated review evidence reference must be ${ADMIN_DELETE_EVIDENCE_REFERENCE_MAX_LENGTH} characters or fewer.`
      ),
  })
  .strict();

const adminDeleteEvidenceErrorResponse = (
  resource: AdminDeleteResource,
  fieldErrors: AdminDeleteFieldErrors,
  formErrors: string[] = []
) =>
  NextResponse.json<AdminDeleteValidationErrorResponse>(
    {
      success: false,
      error: `Invalid ${resource} delete evidence`,
      fieldErrors,
      formErrors,
    },
    { status: 400 }
  );

export const adminDeleteInvalidIdResponse = (
  resource: AdminDeleteResource,
  message: string
) =>
  NextResponse.json<AdminDeleteValidationErrorResponse>(
    {
      success: false,
      error: `Invalid ${resource} input`,
      fieldErrors: {
        id: [message],
      },
      formErrors: [],
    },
    { status: 400 }
  );

export const validateAdminDeleteEvidenceRequest = async (
  request: Request,
  resource: AdminDeleteResource
): Promise<NextResponse<AdminDeleteValidationErrorResponse> | null> => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return adminDeleteEvidenceErrorResponse(resource, {}, [
      "Request body must be valid JSON.",
    ]);
  }

  const parsedEvidence = adminDeleteEvidenceSchema.safeParse(body);

  if (!parsedEvidence.success) {
    const { fieldErrors, formErrors } = parsedEvidence.error.flatten();

    return adminDeleteEvidenceErrorResponse(
      resource,
      fieldErrors,
      formErrors
    );
  }

  return null;
};
