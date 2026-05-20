export type AdminDeleteResource =
  | "article"
  | "artwork"
  | "blog"
  | "collection"
  | "comment"
  | "user";

export type AdminDeletePreviewRecordResource =
  | AdminDeleteResource
  | "cloudinaryAsset";

export type AdminDeletePreviewAction =
  | "delete"
  | "detach"
  | "update"
  | "preserve";

export type AdminDeletePreviewMetadataValue =
  | string
  | number
  | boolean
  | null;

export type AdminDeletePreviewRecord = {
  resource: AdminDeletePreviewRecordResource;
  id: string;
  label: string | null;
  metadata?: Record<string, AdminDeletePreviewMetadataValue>;
};

export type AdminDeletePreviewImpact = {
  action: AdminDeletePreviewAction;
  resource: AdminDeletePreviewRecordResource;
  count: number;
  records: AdminDeletePreviewRecord[];
  description: string;
};

export type AdminDeletePreviewBlocker = {
  code:
    | "artwork_referenced_by_article"
    | "current_admin_account"
    | "last_admin_account";
  message: string;
  severity: "blocking";
  records: AdminDeletePreviewRecord[];
};

export type AdminDeleteProductionEvidenceReminder = {
  code: "mongodb_backup" | "owner_review" | "redacted_audit_event";
  label: string;
  required: true;
  description: string;
};

export type AdminDeletePreview = {
  resource: AdminDeleteResource;
  target: AdminDeletePreviewRecord;
  blocked: boolean;
  blockingConditions: AdminDeletePreviewBlocker[];
  wouldDelete: AdminDeletePreviewImpact[];
  wouldDetachOrUpdate: AdminDeletePreviewImpact[];
  preserved: AdminDeletePreviewImpact[];
  productionEvidenceReminders: AdminDeleteProductionEvidenceReminder[];
};
