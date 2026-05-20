import mongoose, { Document } from "mongoose";

export type AdminDeleteAuditResource =
  | "article"
  | "artwork"
  | "blog"
  | "collection"
  | "comment"
  | "user";

export type AdminDeleteAuditPreviewRecordResource =
  | AdminDeleteAuditResource
  | "cloudinaryAsset";

export type AdminDeleteAuditPreviewAction =
  | "delete"
  | "detach"
  | "update"
  | "preserve";

export type AdminDeleteAuditOutcome =
  | "started"
  | "succeeded"
  | "blocked"
  | "not_found"
  | "failed";

export type AdminDeleteAuditPreviewSection =
  | "wouldDelete"
  | "wouldDetachOrUpdate"
  | "preserved";

export type AdminDeleteAuditPreviewImpact = {
  section: AdminDeleteAuditPreviewSection;
  action: AdminDeleteAuditPreviewAction;
  resource: AdminDeleteAuditPreviewRecordResource;
  count: number;
};

export type AdminDeleteAuditPreviewSummary = {
  targetFound: boolean;
  blocked: boolean;
  blockerCodes: string[];
  impacts: AdminDeleteAuditPreviewImpact[];
  totals: {
    wouldDelete: number;
    wouldDetachOrUpdate: number;
    preserved: number;
  };
};

export interface AdminDeleteAuditEventDB extends Document {
  eventType: "admin_destructive_delete";
  route: string;
  method: string;
  requestId?: string;
  occurredAt: Date;
  completedAt?: Date;
  resource: AdminDeleteAuditResource;
  resourceId: string;
  actor: {
    class: "authenticated_admin";
    role: "admin";
  };
  evidence: {
    backupExportReference: string;
    ownerReviewReference: string;
  };
  previewSummary: AdminDeleteAuditPreviewSummary;
  outcome: {
    status: AdminDeleteAuditOutcome;
    responseStatus?: number;
    reason?: string;
  };
}

const auditPreviewImpactSchema =
  new mongoose.Schema<AdminDeleteAuditPreviewImpact>(
    {
      section: {
        type: String,
        enum: ["wouldDelete", "wouldDetachOrUpdate", "preserved"],
        required: true,
      },
      action: {
        type: String,
        enum: ["delete", "detach", "update", "preserve"],
        required: true,
      },
      resource: {
        type: String,
        enum: [
          "article",
          "artwork",
          "blog",
          "collection",
          "comment",
          "user",
          "cloudinaryAsset",
        ],
        required: true,
      },
      count: { type: Number, required: true, min: 0 },
    },
    { _id: false }
  );

const adminDeleteAuditEventSchema =
  new mongoose.Schema<AdminDeleteAuditEventDB>(
    {
      eventType: {
        type: String,
        enum: ["admin_destructive_delete"],
        required: true,
        default: "admin_destructive_delete",
      },
      route: { type: String, required: true },
      method: { type: String, required: true },
      requestId: { type: String, required: false },
      occurredAt: { type: Date, required: true, default: Date.now },
      completedAt: { type: Date, required: false },
      resource: {
        type: String,
        enum: ["article", "artwork", "blog", "collection", "comment", "user"],
        required: true,
      },
      resourceId: { type: String, required: true },
      actor: {
        class: {
          type: String,
          enum: ["authenticated_admin"],
          required: true,
        },
        role: { type: String, enum: ["admin"], required: true },
      },
      evidence: {
        backupExportReference: { type: String, required: true },
        ownerReviewReference: { type: String, required: true },
      },
      previewSummary: {
        targetFound: { type: Boolean, required: true },
        blocked: { type: Boolean, required: true },
        blockerCodes: [{ type: String, required: true }],
        impacts: [auditPreviewImpactSchema],
        totals: {
          wouldDelete: { type: Number, required: true, min: 0 },
          wouldDetachOrUpdate: { type: Number, required: true, min: 0 },
          preserved: { type: Number, required: true, min: 0 },
        },
      },
      outcome: {
        status: {
          type: String,
          enum: ["started", "succeeded", "blocked", "not_found", "failed"],
          required: true,
          default: "started",
        },
        responseStatus: { type: Number, required: false },
        reason: { type: String, required: false },
      },
    },
    {
      collection: "admin_delete_audit_events",
      timestamps: false,
    }
  );

adminDeleteAuditEventSchema.index({ occurredAt: -1 });
adminDeleteAuditEventSchema.index({ resource: 1, resourceId: 1, occurredAt: -1 });
adminDeleteAuditEventSchema.index(
  { requestId: 1 },
  { sparse: true }
);

export const AdminDeleteAuditEventModel =
  mongoose.models.AdminDeleteAuditEvent ||
  mongoose.model<AdminDeleteAuditEventDB>(
    "AdminDeleteAuditEvent",
    adminDeleteAuditEventSchema
  );
