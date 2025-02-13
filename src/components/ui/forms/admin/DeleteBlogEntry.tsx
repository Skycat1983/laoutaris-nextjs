"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
// import { revalidateArtworkFeed } from "@/lib/server/actions/revalidateArtwork";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const deleteBlogSchema = z.object({
  objectId: z.string().min(1, "Object ID is required"),
});

type DeleteBlogEntryFormValues = z.infer<typeof deleteBlogSchema>;

export function DeleteBlogEntry() {
  const form = useForm<DeleteBlogEntryFormValues>({
    resolver: zodResolver(deleteBlogSchema),
    defaultValues: {
      objectId: "",
    },
  });

  async function onSubmit(data: DeleteBlogEntryFormValues) {
    try {
      const response = await fetch(`/api/admin/blog/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: data.objectId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog entry");
      }

      // revalidate the feed after successful deletion
      form.reset();
      console.log("Blog entry deleted successfully");
    } catch (error) {
      console.error("Error deleting blog entry:", error);
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* <h2 className="text-2xl font-bold">Delete Blog Entry</h2> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="objectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Object ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter blog entry ID" {...field} />
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
            {form.formState.isSubmitting ? "Deleting..." : "Delete Blog Entry"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
