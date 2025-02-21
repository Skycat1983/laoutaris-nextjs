import { Button } from "@/components/shadcn/button";
import type { FrontendArticleWithArtworkAndAuthor } from "@/lib/data/types/articleTypes";

interface DeleteConfirmationProps {
  article: FrontendArticleWithArtworkAndAuthor;
  onDelete: () => Promise<void>;
  isDeleting?: boolean;
}

export function DeleteConfirmation({
  article,
  onDelete,
  isDeleting = false,
}: DeleteConfirmationProps) {
  return (
    <div className="flex flex-col gap-6 p-8 border-2 border-dashed border-gray-300 rounded-lg">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-red-600">Delete Article</h2>
        <p className="text-gray-600">
          Are you sure you want to delete this article?
        </p>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium">{article.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{article.subtitle}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Confirm Delete"}
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          disabled={isDeleting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
