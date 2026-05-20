import { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/button";
import type { ApiErrorResponse } from "@/lib/data/types";
import type { DeletePreviewResult } from "@/lib/api/admin/delete/fetchers";
import type {
  AdminDeletePreview,
  AdminDeletePreviewImpact,
  AdminDeletePreviewRecord,
  AdminDeletePreviewRecordResource,
} from "@/lib/api/admin/delete/previewTypes";

interface DocumentInfo {
  _id: string;
  title: string;
  subtitle?: string;
}

type DeletePreviewFetcher = (
  documentId: string
) => Promise<DeletePreviewResult | ApiErrorResponse>;

interface DeleteConfirmationProps<T extends DocumentInfo> {
  document: T;
  documentType: string;
  fetchDeletePreview: DeletePreviewFetcher;
  onDelete: () => Promise<void>;
  isDeleting?: boolean;
  onCancel: () => void;
}

const resourceLabels: Record<AdminDeletePreviewRecordResource, string> = {
  article: "article",
  artwork: "artwork",
  blog: "blog",
  collection: "collection",
  comment: "comment",
  user: "user",
  cloudinaryAsset: "Cloudinary asset",
};

const metadataLabels: Record<string, string> = {
  field: "Field",
  format: "Format",
  publicId: "Public ID",
  relation: "Relation",
  role: "Role",
  slug: "Slug",
  sourceField: "Source field",
};

const formatResource = (resource: AdminDeletePreviewRecordResource) =>
  resourceLabels[resource] ?? resource;

const formatMetadataKey = (key: string) =>
  metadataLabels[key] ??
  key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase());

const recordTitle = (record: AdminDeletePreviewRecord) =>
  record.label ? `${record.label} (${record.id})` : record.id;

const PreviewRecordList = ({
  records,
}: {
  records: AdminDeletePreviewRecord[];
}) => {
  if (records.length === 0) {
    return null;
  }

  return (
    <ul className="mt-2 space-y-2">
      {records.map((record) => (
        <li
          key={`${record.resource}-${record.id}`}
          className="rounded border border-gray-200 bg-white p-3 text-sm"
        >
          <div className="font-medium text-gray-900">{recordTitle(record)}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">
            {formatResource(record.resource)}
          </div>
          {record.metadata && Object.keys(record.metadata).length > 0 && (
            <dl className="mt-2 grid gap-1 text-xs text-gray-600 sm:grid-cols-2">
              {Object.entries(record.metadata).map(([key, value]) => (
                <div key={key} className="flex gap-1">
                  <dt className="font-medium">{formatMetadataKey(key)}:</dt>
                  <dd>{String(value)}</dd>
                </div>
              ))}
            </dl>
          )}
        </li>
      ))}
    </ul>
  );
};

const PreviewImpactSection = ({
  title,
  emptyMessage,
  impacts,
}: {
  title: string;
  emptyMessage: string;
  impacts: AdminDeletePreviewImpact[];
}) => (
  <section className="space-y-3">
    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    {impacts.length === 0 ? (
      <p className="rounded border border-gray-200 bg-white p-3 text-sm text-gray-600">
        {emptyMessage}
      </p>
    ) : (
      <div className="space-y-3">
        {impacts.map((impact) => (
          <div
            key={`${impact.action}-${impact.resource}-${impact.description}`}
            className="rounded border border-gray-200 bg-white p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {impact.count} {formatResource(impact.resource)}
                {impact.count === 1 ? "" : "s"}
              </span>
              <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium uppercase tracking-wide text-gray-600">
                {impact.action}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{impact.description}</p>
            <PreviewRecordList records={impact.records} />
          </div>
        ))}
      </div>
    )}
  </section>
);

const DeletePreviewDetails = ({
  preview,
}: {
  preview: AdminDeletePreview;
}) => (
  <div className="space-y-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
    <section className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-900">Preview target</h3>
      <div className="rounded border border-gray-200 bg-white p-3">
        <div className="text-sm font-medium text-gray-900">
          {recordTitle(preview.target)}
        </div>
        <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">
          {formatResource(preview.target.resource)}
        </div>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Blocking conditions</h3>
      {preview.blockingConditions.length === 0 ? (
        <p className="rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          No blocking conditions reported by the delete preview.
        </p>
      ) : (
        <div className="space-y-3">
          {preview.blockingConditions.map((blocker) => (
            <div
              key={blocker.code}
              className="rounded border border-red-200 bg-red-50 p-3"
            >
              <p className="text-sm font-medium text-red-800">
                {blocker.message}
              </p>
              <PreviewRecordList records={blocker.records} />
            </div>
          ))}
        </div>
      )}
    </section>

    <PreviewImpactSection
      title="Records that would be deleted"
      emptyMessage="No delete impact records were reported."
      impacts={preview.wouldDelete}
    />
    <PreviewImpactSection
      title="Records that would be detached or updated"
      emptyMessage="No detach or update impact records were reported."
      impacts={preview.wouldDetachOrUpdate}
    />
    <PreviewImpactSection
      title="Preserved records and assets"
      emptyMessage="No preserved records or assets were reported."
      impacts={preview.preserved}
    />

    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">
        Production evidence reminders
      </h3>
      <ul className="space-y-2">
        {preview.productionEvidenceReminders.map((reminder) => (
          <li
            key={reminder.code}
            className="rounded border border-amber-200 bg-amber-50 p-3"
          >
            <div className="text-sm font-medium text-amber-900">
              {reminder.label}
            </div>
            <p className="mt-1 text-sm text-amber-800">
              {reminder.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  </div>
);

export function DeleteConfirmation<T extends DocumentInfo>({
  document,
  documentType,
  fetchDeletePreview,
  onDelete,
  isDeleting = false,
  onCancel,
}: DeleteConfirmationProps<T>) {
  const [preview, setPreview] = useState<AdminDeletePreview | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadPreview = async () => {
      setPreview(null);
      setPreviewError(null);
      setIsPreviewLoading(true);

      try {
        const response = await fetchDeletePreview(document._id);
        if (!isActive) {
          return;
        }

        if (response.success) {
          setPreview(response.data);
        } else {
          setPreviewError(response.error || "Failed to load delete preview.");
        }
      } catch (error) {
        if (!isActive) {
          return;
        }
        setPreviewError(
          error instanceof Error ? error.message : "Failed to load delete preview."
        );
      } finally {
        if (isActive) {
          setIsPreviewLoading(false);
        }
      }
    };

    void loadPreview();

    return () => {
      isActive = false;
    };
  }, [document._id, fetchDeletePreview]);

  const confirmDisabled =
    isDeleting || isPreviewLoading || Boolean(previewError) || Boolean(preview?.blocked);

  const handleConfirmDelete = () => {
    if (confirmDisabled) {
      return;
    }

    void onDelete();
  };

  return (
    <div className="flex flex-col gap-6 p-8 border-2 border-dashed border-gray-300 rounded-lg">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-red-600">
          Delete {documentType}
        </h2>
        <p className="text-gray-600">
          Are you sure you want to delete this {documentType.toLowerCase()}?
        </p>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">{document.title}</h3>
          {document.subtitle && (
            <p className="text-sm text-gray-500 mt-1">{document.subtitle}</p>
          )}
        </div>
      </div>
      {isPreviewLoading && (
        <div
          className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"
          role="status"
        >
          Loading delete preview...
        </div>
      )}
      {previewError && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          role="alert"
        >
          Delete preview failed: {previewError}
        </div>
      )}
      {preview && <DeletePreviewDetails preview={preview} />}
      <div className="flex gap-4">
        <Button
          variant="destructive"
          onClick={handleConfirmDelete}
          disabled={confirmDisabled}
        >
          {isDeleting ? "Deleting..." : "Confirm Delete"}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
