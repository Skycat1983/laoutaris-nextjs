"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Textarea } from "@/components/shadcn/textarea";

interface CommentFormProps {
  blogSlug: string;
  onCommentSubmit: (comment: string) => Promise<void>;
}

const CommentForm = ({ blogSlug, onCommentSubmit }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await onCommentSubmit(comment);
      setComment(""); // Clear form after successful submission
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-8">
      <div className="space-y-4">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="min-h-[100px]"
          aria-label="Comment text"
        />
        <Button
          type="submit"
          disabled={isSubmitting || !comment.trim()}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
