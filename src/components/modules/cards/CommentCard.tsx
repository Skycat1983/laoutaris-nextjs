"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FrontendCommentWithAuthor } from "@/lib/data/types/commentTypes";
import { useSession } from "next-auth/react";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { clientApi } from "@/lib/api/clientApi";
import { Button } from "@/components/shadcn/button";
import { Textarea } from "@/components/shadcn/textarea";
import { Skeleton } from "@/components/shadcn/skeleton";
import { formatDateImproved } from "@/lib/utils/formatDate";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/shadcn/form";
import {
  updateCommentSchema,
  type UpdateCommentFormValues,
} from "@/lib/data/schemas/commentSchema";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";

interface CommentCardProps {
  comment: FrontendCommentWithAuthor;
  onCommentUpdated?: () => void;
  onCommentDeleted?: () => void;
}

export const CommentCard = ({
  comment,
  onCommentUpdated,
  onCommentDeleted,
}: CommentCardProps) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { openModal } = useGlobalFeatures();

  const form = useForm<UpdateCommentFormValues>({
    resolver: zodResolver(updateCommentSchema),
    defaultValues: {
      text: comment.text,
      commentId: comment._id,
    },
  });

  const isOwner = session?.user?.id === comment.author._id;

  const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      setIsLoading(true);
      const values = form.getValues();
      const result = await clientApi.user.comments.updateComment(
        values.commentId,
        values.text
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
    try {
      setIsLoading(true);
      const result = await clientApi.user.comments.deleteComment(comment._id);

      if (result.success) {
        onCommentDeleted?.();
      } else {
        openModal(
          <ModalMessage message="Failed to delete comment" type="error" />
        );
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      openModal(
        <ModalMessage message="Failed to delete comment" type="error" />
      );
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
          <Form {...form}>
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="w-full min-h-[100px]"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
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
