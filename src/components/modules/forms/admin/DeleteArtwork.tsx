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
import { revalidateArtworkFeed } from "@/lib/old_code/actions/revalidateArtwork";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const deleteArtworkSchema = z.object({
  objectId: z.string().min(1, "Object ID is required"),
});

type DeleteArtworkFormValues = z.infer<typeof deleteArtworkSchema>;

export function DeleteArtwork() {
  const form = useForm<DeleteArtworkFormValues>({
    resolver: zodResolver(deleteArtworkSchema),
    defaultValues: {
      objectId: "",
    },
  });

  async function onSubmit(data: DeleteArtworkFormValues) {
    try {
      const response = await fetch(`/api/admin/artwork/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: data.objectId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete artwork");
      }

      // Revalidate the feed after successful deletion
      //   await revalidateArtworkFeed();
      form.reset();
      console.log("Artwork deleted successfully");
    } catch (error) {
      console.error("Error deleting artwork:", error);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Delete Artwork</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="objectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Object ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter artwork ID" {...field} />
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
            {form.formState.isSubmitting ? "Deleting..." : "Delete Artwork"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
