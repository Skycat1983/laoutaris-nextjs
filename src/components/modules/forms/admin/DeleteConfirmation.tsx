import { Button } from "@/components/shadcn/button";

interface DocumentInfo {
  _id: string;
  title: string;
  subtitle?: string;
}

interface DeleteConfirmationProps<T extends DocumentInfo> {
  document: T;
  documentType: string;
  onDelete: () => Promise<void>;
  isDeleting?: boolean;
  onCancel: () => void;
}

export function DeleteConfirmation<T extends DocumentInfo>({
  document,
  documentType,
  onDelete,
  isDeleting = false,
  onCancel,
}: DeleteConfirmationProps<T>) {
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
      <div className="flex gap-4">
        <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Confirm Delete"}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
