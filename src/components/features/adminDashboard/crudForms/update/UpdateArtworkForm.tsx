import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { ArtworkFrontend } from "@/lib/data/types";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Checkbox } from "@/components/shadcn/checkbox";
import { updateArtworkSchema } from "@/lib/data/schemas";
import { clientApi } from "@/lib/api/clientApi";

type UpdateArtworkFormValues = z.infer<typeof updateArtworkSchema>;

interface UpdateArtworkFormProps {
  artworkInfo: ArtworkFrontend; // Define this type based on your data structure
  onSuccess: () => void;
}

export const UpdateArtworkForm = ({
  artworkInfo,
  onSuccess,
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

  async function onSubmit(data: UpdateArtworkFormValues) {
    setIsSubmitting(true);
    try {
      const response = await clientApi.admin.update.patchArtwork(
        artworkInfo._id,
        data
      );

      if (!response.success) {
        throw new Error("Failed to update artwork entry");
      }

      onSuccess();
    } catch (error) {
      console.error("Error updating artwork entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-500px)]">
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
