jest.mock("server-only", () => ({}), { virtual: true });

import {
  createAdminDeleteAuditEvent,
  summarizeAdminDeletePreview,
  updateAdminDeleteAuditEventOutcome,
} from "@/lib/api/admin/delete/audit";
import { AdminDeleteAuditEventModel } from "@/lib/data/models";
import type { AdminDeletePreview } from "@/lib/api/admin/delete/previewTypes";
import type { RequestContext } from "@/lib/observability/requestContext";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      headers: new Headers(init?.headers),
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/data/models", () => ({
  AdminDeleteAuditEventModel: {
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

const auditEventId = "507f1f77bcf86cd799439099";
const artworkId = "507f1f77bcf86cd799439014";

const requestContext: RequestContext = {
  requestId: "req-admin-delete-audit",
  method: "DELETE",
  route: "/api/v2/admin/artwork/delete/[id]",
  responseHeaders: new Headers(),
};

const validEvidence = {
  backupExportConfirmed: true,
  backupExportReference: "mongodump archive 2026-05-20",
  ownerReviewConfirmed: true,
  ownerReviewReference: "owner review ticket T-165",
};

const privatePreview: AdminDeletePreview = {
  resource: "artwork",
  target: {
    resource: "artwork",
    id: artworkId,
    label: "Private owner@example.com artwork title",
    metadata: {
      slug: "private-slug",
    },
  },
  blocked: true,
  blockingConditions: [
    {
      code: "artwork_referenced_by_article",
      message:
        "Artwork deletion is blocked by an article with private label data.",
      severity: "blocking",
      records: [
        {
          resource: "article",
          id: "507f1f77bcf86cd799439013",
          label: "Private article label",
          metadata: {
            slug: "private-article",
          },
        },
      ],
    },
  ],
  wouldDelete: [
    {
      action: "delete",
      resource: "artwork",
      count: 1,
      description: "Delete the private artwork record.",
      records: [
        {
          resource: "artwork",
          id: artworkId,
          label: "Private owner@example.com artwork title",
        },
      ],
    },
  ],
  wouldDetachOrUpdate: [
    {
      action: "detach",
      resource: "collection",
      count: 2,
      description: "Pull private artwork from collections.",
      records: [
        {
          resource: "collection",
          id: "507f1f77bcf86cd799439016",
          label: "Private collection",
        },
      ],
    },
  ],
  preserved: [
    {
      action: "preserve",
      resource: "cloudinaryAsset",
      count: 1,
      description: "Preserve Cloudinary URL.",
      records: [
        {
          resource: "cloudinaryAsset",
          id: "https://res.cloudinary.com/example/image/upload/private.jpg",
          label: "https://res.cloudinary.com/example/image/upload/private.jpg",
          metadata: {
            publicId: "private/cloudinary/id",
          },
        },
      ],
    },
  ],
  productionEvidenceReminders: [
    {
      code: "mongodb_backup",
      label: "MongoDB backup/export evidence",
      required: true,
      description: "Private reminder text should not be stored.",
    },
  ],
};

const mockAuditCreate = AdminDeleteAuditEventModel.create as jest.Mock;
const mockAuditFindByIdAndUpdate =
  AdminDeleteAuditEventModel.findByIdAndUpdate as jest.Mock;
const logger = {
  error: jest.fn(),
};

describe("admin delete audit events", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuditCreate.mockResolvedValue({ _id: auditEventId });
    mockAuditFindByIdAndUpdate.mockResolvedValue({ _id: auditEventId });
  });

  it("summarizes preview counts without retaining records, labels, or asset URLs", () => {
    const summary = summarizeAdminDeletePreview(privatePreview);
    const serializedSummary = JSON.stringify(summary);

    expect(summary).toEqual({
      targetFound: true,
      blocked: true,
      blockerCodes: ["artwork_referenced_by_article"],
      impacts: [
        {
          section: "wouldDelete",
          action: "delete",
          resource: "artwork",
          count: 1,
        },
        {
          section: "wouldDetachOrUpdate",
          action: "detach",
          resource: "collection",
          count: 2,
        },
        {
          section: "preserved",
          action: "preserve",
          resource: "cloudinaryAsset",
          count: 1,
        },
      ],
      totals: {
        wouldDelete: 1,
        wouldDetachOrUpdate: 2,
        preserved: 1,
      },
    });
    expect(serializedSummary).not.toContain("owner@example.com");
    expect(serializedSummary).not.toContain("Private collection");
    expect(serializedSummary).not.toContain("res.cloudinary.com");
    expect(serializedSummary).not.toContain("private/cloudinary/id");
  });

  it("persists a started audit event with safe route, actor, evidence, and summary fields", async () => {
    const result = await createAdminDeleteAuditEvent({
      requestContext,
      resource: "artwork",
      resourceId: artworkId,
      evidence: validEvidence,
      operation: "admin.artwork.delete",
      logger,
      getPreview: jest.fn().mockResolvedValue(privatePreview),
    });

    expect(result).toEqual({
      ok: true,
      auditEvent: {
        id: auditEventId,
        resource: "artwork",
      },
      preview: privatePreview,
    });
    expect(mockAuditCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "admin_destructive_delete",
        route: "/api/v2/admin/artwork/delete/[id]",
        method: "DELETE",
        requestId: "req-admin-delete-audit",
        resource: "artwork",
        resourceId: artworkId,
        actor: {
          class: "authenticated_admin",
          role: "admin",
        },
        evidence: {
          backupExportReference: "mongodump archive 2026-05-20",
          ownerReviewReference: "owner review ticket T-165",
        },
        previewSummary: summarizeAdminDeletePreview(privatePreview),
        outcome: {
          status: "started",
        },
      })
    );

    const storedPayload = JSON.stringify(mockAuditCreate.mock.calls[0][0]);
    expect(storedPayload).not.toContain("owner@example.com");
    expect(storedPayload).not.toContain("Private collection");
    expect(storedPayload).not.toContain("res.cloudinary.com");
    expect(storedPayload).not.toContain("private/cloudinary/id");
  });

  it("logs but does not throw when a post-mutation outcome update fails", async () => {
    mockAuditFindByIdAndUpdate.mockRejectedValue(
      new Error("private update failure")
    );

    await expect(
      updateAdminDeleteAuditEventOutcome({
        auditEvent: {
          id: auditEventId,
          resource: "artwork",
        },
        outcome: "succeeded",
        responseStatus: 200,
        operation: "admin.artwork.delete",
        logger,
      })
    ).resolves.toBeUndefined();

    expect(logger.error).toHaveBeenCalledWith(
      "api.admin.delete_audit.update_failed",
      expect.objectContaining({
        operation: "admin.artwork.delete",
        resource: "artwork",
        outcome: "succeeded",
        responseStatus: 200,
        errorLabel: "admin_delete_audit_update_failed",
      })
    );
  });
});
