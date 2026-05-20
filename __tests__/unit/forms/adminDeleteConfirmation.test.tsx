import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DeleteConfirmation } from "@/components/features/adminDashboard/crudForms/delete/DeleteConfirmation";
import type { AdminDeletePreview } from "@/lib/api/admin/delete/previewTypes";

const documentId = "507f1f77bcf86cd799439013";

const document = {
  _id: documentId,
  title: "Archive Blog",
  subtitle: "A post from the archive",
};

const previewTarget = {
  resource: "blog" as const,
  id: documentId,
  label: "Archive Blog",
  metadata: {
    slug: "archive-blog",
  },
};

const unblockedPreview: AdminDeletePreview = {
  resource: "blog",
  target: previewTarget,
  blocked: false,
  blockingConditions: [],
  wouldDelete: [
    {
      action: "delete",
      resource: "blog",
      count: 1,
      records: [previewTarget],
      description: "Delete the target blog record.",
    },
  ],
  wouldDetachOrUpdate: [
    {
      action: "update",
      resource: "user",
      count: 1,
      records: [
        {
          resource: "user",
          id: "507f1f77bcf86cd799439014",
          label: "archive-admin",
          metadata: {
            field: "comments",
          },
        },
      ],
      description:
        "Pull deleted blog comment IDs from affected user comments arrays.",
    },
  ],
  preserved: [
    {
      action: "preserve",
      resource: "cloudinaryAsset",
      count: 1,
      records: [
        {
          resource: "cloudinaryAsset",
          id: "archive/blog-image",
          label:
            "https://res.cloudinary.com/dzncmfirr/image/upload/archive/blog-image.jpg",
          metadata: {
            sourceField: "imageUrl",
          },
        },
      ],
      description: "Current blog deletion preserves referenced Cloudinary assets.",
    },
  ],
  productionEvidenceReminders: [
    {
      code: "mongodb_backup",
      label: "MongoDB backup/export evidence",
      required: true,
      description:
        "Confirm a current MongoDB backup or export exists before running destructive production deletes.",
    },
    {
      code: "owner_review",
      label: "Owner or delegated review evidence",
      required: true,
      description:
        "Confirm owner-approved or delegated review evidence before running destructive production deletes.",
    },
    {
      code: "redacted_audit_event",
      label: "Redacted audit-event evidence",
      required: true,
      description:
        "Record a redacted audit event with actor, resource, cascade summary, and request evidence for production deletes.",
    },
  ],
};

const renderDeleteConfirmation = ({
  fetchDeletePreview = jest.fn().mockResolvedValue({
    success: true,
    data: unblockedPreview,
  }),
  onDelete = jest.fn().mockResolvedValue(undefined),
  onCancel = jest.fn(),
}: {
  fetchDeletePreview?: jest.Mock;
  onDelete?: jest.Mock;
  onCancel?: jest.Mock;
} = {}) => {
  render(
    <DeleteConfirmation
      document={document}
      documentType="Blog"
      fetchDeletePreview={fetchDeletePreview}
      onDelete={onDelete}
      onCancel={onCancel}
    />
  );

  return {
    fetchDeletePreview,
    onDelete,
    onCancel,
  };
};

describe("DeleteConfirmation delete preview", () => {
  it("loads the preview and disables confirmation while loading", async () => {
    let resolvePreview!: (value: { success: true; data: AdminDeletePreview }) => void;
    const fetchDeletePreview = jest.fn(
      () =>
        new Promise<{ success: true; data: AdminDeletePreview }>((resolve) => {
          resolvePreview = resolve;
        })
    );
    const onDelete = jest.fn().mockResolvedValue(undefined);

    renderDeleteConfirmation({ fetchDeletePreview, onDelete });

    expect(fetchDeletePreview).toHaveBeenCalledWith(documentId);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading delete preview..."
    );
    expect(screen.getByRole("button", { name: "Confirm Delete" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Confirm Delete" }));
    expect(onDelete).not.toHaveBeenCalled();

    resolvePreview({ success: true, data: unblockedPreview });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Confirm Delete" })
      ).not.toBeDisabled();
    });
  });

  it("shows preview failures and keeps destructive confirmation disabled", async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);
    renderDeleteConfirmation({
      fetchDeletePreview: jest.fn().mockResolvedValue({
        success: false,
        error: "Failed to preview blog deletion",
      }),
      onDelete,
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Delete preview failed: Failed to preview blog deletion"
    );

    const confirmButton = screen.getByRole("button", { name: "Confirm Delete" });
    expect(confirmButton).toBeDisabled();
    fireEvent.click(confirmButton);
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("renders blockers and disables confirmation for blocked previews", async () => {
    const blockedPreview: AdminDeletePreview = {
      ...unblockedPreview,
      resource: "artwork",
      target: {
        resource: "artwork",
        id: documentId,
        label: "Blocked Artwork",
      },
      blocked: true,
      blockingConditions: [
        {
          code: "artwork_referenced_by_article",
          message:
            "Artwork deletion is blocked because one or more articles reference this artwork.",
          severity: "blocking",
          records: [
            {
              resource: "article",
              id: "507f1f77bcf86cd799439015",
              label: "Linked Article",
              metadata: {
                relation: "artwork",
              },
            },
          ],
        },
      ],
    };

    renderDeleteConfirmation({
      fetchDeletePreview: jest.fn().mockResolvedValue({
        success: true,
        data: blockedPreview,
      }),
    });

    expect(
      await screen.findByText(
        "Artwork deletion is blocked because one or more articles reference this artwork."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Linked Article (507f1f77bcf86cd799439015)"))
      .toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm Delete" })).toBeDisabled();
  });

  it("renders unblocked delete impact and allows confirm and cancel actions", async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);
    const onCancel = jest.fn();

    renderDeleteConfirmation({ onDelete, onCancel });

    expect(await screen.findByText("Preview target")).toBeInTheDocument();
    expect(screen.getByText("Records that would be deleted")).toBeInTheDocument();
    expect(screen.getByText("Delete the target blog record.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Pull deleted blog comment IDs from affected user comments arrays."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Current blog deletion preserves referenced Cloudinary assets.")
    ).toBeInTheDocument();
    expect(screen.getByText("MongoDB backup/export evidence")).toBeInTheDocument();
    expect(screen.getByText("Owner or delegated review evidence")).toBeInTheDocument();
    expect(screen.getByText("Redacted audit-event evidence")).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: "Confirm Delete" });
    expect(confirmButton).not.toBeDisabled();
    fireEvent.click(confirmButton);
    expect(onDelete).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
