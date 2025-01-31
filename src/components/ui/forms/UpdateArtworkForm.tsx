import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";

import { Button } from "@/components/ui/button";
import { FrontendArtworkUnpopulated } from "@/lib/types/artworkTypes";
import { ScrollArea } from "../shadcn/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";
import { Checkbox } from "../shadcn/checkbox";

// Define the schema for updating artwork using Zod
const updateArtworkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  decade: z.enum(
    ["1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
    {
      required_error: "Decade is required",
    }
  ),
  artstyle: z.enum(["abstract", "semi-abstract", "figurative"], {
    required_error: "Art style is required",
  }),
  medium: z.enum(
    [
      "oil",
      "acrylic",
      "paint",
      "watercolour",
      "pastel",
      "pencil",
      "charcoal",
      "ink",
      "sand",
    ],
    {
      required_error: "Medium is required",
    }
  ),
  surface: z.enum(["paper", "canvas", "wood", "film"], {
    required_error: "Surface is required",
  }),
  featured: z.boolean(),
  imageUrl: z.string().url("Invalid URL"),
});

type UpdateArtworkFormValues = z.infer<typeof updateArtworkSchema>;

interface UpdateArtworkFormProps {
  artworkInfo: FrontendArtworkUnpopulated; // Define this type based on your data structure
  //   onSuccess: () => void;
}

export const UpdateArtworkForm = ({
  artworkInfo,
}: //   onSuccess,
UpdateArtworkFormProps) => {
  console.log("artworkInfo :>> ", artworkInfo);
  const [imagePreview, setImagePreview] = useState(
    artworkInfo.image.secure_url
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateArtworkFormValues>({
    resolver: zodResolver(updateArtworkSchema),
    defaultValues: {
      title: artworkInfo.title,
      decade: artworkInfo.decade,
      artstyle: artworkInfo.artstyle,
      medium: artworkInfo.medium,
      surface: artworkInfo.surface,
      featured: artworkInfo.featured,
      //   imageUrl: artworkInfo.imageUrl,
    },
  });

  const handleImageUrlBlur = (url: string) => {
    if (url && url.match(/^https?:\/\/.+/)) {
      setImagePreview(url);
    }
  };

  async function onSubmit(data: UpdateArtworkFormValues) {
    setIsSubmitting(true);
    try {
      console.log("Submitting updated artwork data:", data);
      //   const response = await fetch(
      //     `/api/admin/artwork/update?_id=${artworkInfo._id}`,
      //     {
      //       method: "PATCH",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(data),
      //     }
      //   );

      //   if (!response.ok) {
      //     throw new Error("Failed to update artwork entry");
      //   }

      //   const updatedArtwork = await response.json();
      //   console.log("Artwork entry updated successfully:", updatedArtwork);

      // Optionally revalidate or refresh data
      //   router.refresh();

      // Call the onSuccess callback
      //   onSuccess();
    } catch (error) {
      console.error("Error updating artwork entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-100px)]">
      <div className="grid grid-cols-1 gap-12 w-full lg:grid-cols-2 p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data) => {
                console.log("Validation successful, calling onSubmit");
                onSubmit(data);
              },
              (errors) => {
                console.error("Validation errors:", errors);
              }
            )}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter artwork title"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="decade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose the decade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        "1950s",
                        "1960s",
                        "1970s",
                        "1980s",
                        "1990s",
                        "2000s",
                        "2010s",
                        "2020s",
                      ].map((decade) => (
                        <SelectItem key={decade} value={decade}>
                          {decade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="artstyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Art Style</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an art style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["abstract", "semi-abstract", "figurative"].map(
                        (style) => (
                          <SelectItem key={style} value={style}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medium</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a medium" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        "oil",
                        "acrylic",
                        "paint",
                        "watercolour",
                        "pastel",
                        "pencil",
                        "charcoal",
                        "ink",
                        "sand",
                      ].map((medium) => (
                        <SelectItem key={medium} value={medium}>
                          {medium.charAt(0).toUpperCase() + medium.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surface"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surface</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a surface" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["paper", "canvas", "wood", "film"].map((surface) => (
                        <SelectItem key={surface} value={surface}>
                          {surface.charAt(0).toUpperCase() + surface.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter image URL"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        handleImageUrlBlur(e.target.value);
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    URL of the image to accompany the artwork
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      Mark this artwork as featured
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Artwork"}
            </Button>
          </form>
        </Form>

        {/* Image Preview Section */}
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt="Artwork image"
            width={400}
            height={400}
            className="object-contain w-full rounded-lg hidden lg:block"
          />
        ) : (
          <div className="w-[400px] h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hidden lg:block">
            <p className="text-gray-400">Image preview will appear here</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
