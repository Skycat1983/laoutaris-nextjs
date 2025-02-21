"use client";

import { Button } from "@/components/shadcn/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { deleteArticle } from "../../../../../still useful/deleteApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const deleteArticleSchema = z.object({
  articleId: z.string().min(1, "Article ID is required"),
});

type DeleteArticleFormValues = z.infer<typeof deleteArticleSchema>;

export function DeleteArticle() {
  const form = useForm<DeleteArticleFormValues>({
    resolver: zodResolver(deleteArticleSchema),
    defaultValues: {
      articleId: "",
    },
  });

  async function onSubmit(data: DeleteArticleFormValues) {
    try {
      const response = await deleteArticle(data.articleId);
      form.reset();
      console.log("Article deleted successfully");
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Delete Article</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="articleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Article ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter article ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="destructive"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Deleting..." : "Delete Article"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
