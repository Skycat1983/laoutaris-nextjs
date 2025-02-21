"use client";

import { useState } from "react";
import { FrontendCommentWithAuthor } from "@/lib/data/types/commentTypes";
import { useSession } from "next-auth/react";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { clientApi } from "@/lib/api/clientApi";
import { Button } from "@/components/shadcn/button";
import { Textarea } from "@/components/shadcn/textarea";
import { Skeleton } from "@/components/shadcn/skeleton";
import { formatDateImproved } from "@/lib/utils/formatDate";
import React from "react";
import DeleteIcon from "@/components/elements/icons/DeleteIcon";
import EditIcon from "@/components/elements/icons/EditIcon";

interface CommentCardProps {
  comment: FrontendCommentWithAuthor;
  onCommentUpdated?: () => void;
}

export const CommentCard = ({
  comment,
  onCommentUpdated,
}: CommentCardProps) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [isLoading, setIsLoading] = useState(false);

  const isOwner = session?.user?.id === comment.author._id;

  const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      setIsLoading(true);
      const result = await clientApi.public.comment.updateComment(
        comment._id,
        editedText
      );

      if (result.success) {
        setIsEditing(false);
        onCommentUpdated?.();
      }
    } catch (error) {
      console.error("Failed to update comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      setIsLoading(true);
      const result = await clientApi.public.comment.deleteComment(comment._id);

      if (result.success) {
        onCommentUpdated?.();
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const paragraphs = comment.text.replace(/\r\n/g, "\n").split(/\n\n+/);

  return (
    <div className="group relative bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isOwner && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  disabled={isLoading}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      <div className="space-y-4 ">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {typeof comment.author !== "string"
                ? comment.author.username[0].toUpperCase()
                : "A"}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {typeof comment.author !== "string"
                ? comment.author.username
                : "Anonymous"}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDateImproved(comment.displayDate.toString())}
            </p>
          </div>
        </div>
        {isEditing ? (
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full min-h-[100px]"
            disabled={isLoading}
          />
        ) : (
          <div className="prose prose-sm max-w-none">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentCardSkeleton = () => {
  return (
    <Skeleton className="w-full max-w-2xl mx-auto mt-8 p-8 rounded-tl-lg rounded-tr-lg rounded-bl-lg shadow" />
  );
};
