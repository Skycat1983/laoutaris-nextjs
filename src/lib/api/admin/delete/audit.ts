import "server-only";

import type { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/apiResponse";
import { AdminDeleteAuditEventModel } from "@/lib/data/models";
import type { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import type { AdminDeleteEvidence } from "./evidenceTypes";
import type {
  AdminDeleteAuditOutcome,
  AdminDeleteAuditPreviewImpact,
  AdminDeleteAuditPreviewSection,
  AdminDeleteAuditPreviewSummary,
} from "@/lib/data/models/adminDeleteAuditEventModel";
import type { RequestContext } from "@/lib/observability/requestContext";
import type {
  AdminDeletePreview,
  AdminDeletePreviewImpact,
  AdminDeleteResource,
} from "./previewTypes";

type AdminDeleteAuditLogger = {
  error: (event: string, fields?: Record<string, unknown>) => void;
};

type CreateAdminDeleteAuditEventOptions = {
  requestContext: RequestContext;
  resource: AdminDeleteResource;
  resourceId: string;
  evidence: AdminDeleteEvidence;
  operation: string;
  logger: AdminDeleteAuditLogger;
  getPreview: () => Promise<AdminDeletePreview | null>;
};

type CreateAdminDeleteAuditEventResult =
  | {
      ok: true;
      auditEvent: AdminDeleteAuditEventHandle;
      preview: AdminDeletePreview | null;
    }
  | {
      ok: false;
      response: NextResponse<ApiErrorResponse>;
    };

export type AdminDeleteAuditEventHandle = {
  id: string;
  resource: AdminDeleteResource;
};

type UpdateAdminDeleteAuditOutcomeOptions = {
  auditEvent?: AdminDeleteAuditEventHandle | null;
  outcome: AdminDeleteAuditOutcome;
  responseStatus: number;
  reason?: string;
  operation: string;
  logger: AdminDeleteAuditLogger;
};

const emptyPreviewSummary = (): AdminDeleteAuditPreviewSummary => ({
  targetFound: false,
  blocked: false,
  blockerCodes: [],
  impacts: [],
  totals: {
    wouldDelete: 0,
    wouldDetachOrUpdate: 0,
    preserved: 0,
  },
});

const totalImpactCount = (impacts: AdminDeletePreviewImpact[]) =>
  impacts.reduce((total, impact) => total + impact.count, 0);

const summarizeImpactSection = (
  section: AdminDeleteAuditPreviewSection,
  impacts: AdminDeletePreviewImpact[]
): AdminDeleteAuditPreviewImpact[] =>
  impacts.map((impact) => ({
    section,
    action: impact.action,
    resource: impact.resource,
    count: impact.count,
  }));

export const summarizeAdminDeletePreview = (
  preview: AdminDeletePreview | null
): AdminDeleteAuditPreviewSummary => {
  if (!preview) {
    return emptyPreviewSummary();
  }

  return {
    targetFound: true,
    blocked: preview.blocked,
    blockerCodes: preview.blockingConditions.map((blocker) => blocker.code),
    impacts: [
      ...summarizeImpactSection("wouldDelete", preview.wouldDelete),
      ...summarizeImpactSection(
        "wouldDetachOrUpdate",
        preview.wouldDetachOrUpdate
      ),
      ...summarizeImpactSection("preserved", preview.preserved),
    ],
    totals: {
      wouldDelete: totalImpactCount(preview.wouldDelete),
      wouldDetachOrUpdate: totalImpactCount(preview.wouldDetachOrUpdate),
      preserved: totalImpactCount(preview.preserved),
    },
  };
};

const stringDocumentId = (document: unknown): string | null => {
  if (!document || typeof document !== "object") {
    return null;
  }

  const idValue =
    (document as { _id?: unknown })._id ?? (document as { id?: unknown }).id;

  if (typeof idValue === "string") {
    return idValue;
  }

  if (idValue && typeof idValue === "object") {
    const toString = (idValue as { toString?: () => string }).toString;
    if (typeof toString === "function") {
      const stringValue = toString.call(idValue);
      return stringValue === "[object Object]" ? null : stringValue;
    }
  }

  return null;
};

export const createAdminDeleteAuditEvent = async ({
  requestContext,
  resource,
  resourceId,
  evidence,
  operation,
  logger,
  getPreview,
}: CreateAdminDeleteAuditEventOptions): Promise<CreateAdminDeleteAuditEventResult> => {
  const preview = await getPreview();

  try {
    const auditEvent = await AdminDeleteAuditEventModel.create({
      eventType: "admin_destructive_delete",
      route: requestContext.route ?? "unknown",
      method: requestContext.method ?? "DELETE",
      requestId: requestContext.requestId,
      occurredAt: new Date(),
      resource,
      resourceId,
      actor: {
        class: "authenticated_admin",
        role: "admin",
      },
      evidence: {
        backupExportReference: evidence.backupExportReference,
        ownerReviewReference: evidence.ownerReviewReference,
      },
      previewSummary: summarizeAdminDeletePreview(preview),
      outcome: {
        status: "started",
      },
    });
    const auditEventId = stringDocumentId(auditEvent);

    if (!auditEventId) {
      throw new Error("Admin delete audit event was created without an ID.");
    }

    return {
      ok: true,
      auditEvent: {
        id: auditEventId,
        resource,
      },
      preview,
    };
  } catch (error) {
    logger.error("api.admin.delete_audit.create_failed", {
      operation,
      resource,
      error,
      errorLabel: "admin_delete_audit_create_failed",
    });

    return {
      ok: false,
      response: apiErrorResponse({
        message: "Unable to record delete audit event",
        status: 500,
        requestId: requestContext.requestId,
      }),
    };
  }
};

export const updateAdminDeleteAuditEventOutcome = async ({
  auditEvent,
  outcome,
  responseStatus,
  reason,
  operation,
  logger,
}: UpdateAdminDeleteAuditOutcomeOptions): Promise<void> => {
  if (!auditEvent) {
    return;
  }

  try {
    await AdminDeleteAuditEventModel.findByIdAndUpdate(auditEvent.id, {
      $set: {
        completedAt: new Date(),
        outcome: {
          status: outcome,
          responseStatus,
          ...(reason ? { reason } : {}),
        },
      },
    });
  } catch (error) {
    logger.error("api.admin.delete_audit.update_failed", {
      operation,
      resource: auditEvent.resource,
      outcome,
      responseStatus,
      reason,
      error,
      errorLabel: "admin_delete_audit_update_failed",
    });
  }
};
