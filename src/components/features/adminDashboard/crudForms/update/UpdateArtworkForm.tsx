import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
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
import type { ArtworkFrontend } from "@/lib/data/types";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
  updateArtworkSchema,
  type UpdateArtworkFormValues,
} from "@/lib/data/schemas";
import { cloudinaryImageSchema } from "@/lib/data/schemas/cloudinarySchema";
import { clientApi } from "@/lib/api/clientApi";
import { ShopifyProductLinksInput } from "@/components/features/adminDashboard/inputs/ShopifyProductLinksInput";
import type {
  ApiErrorResponse,
  CloudinaryImageDB,
  CloudinaryUploadInfo,
} from "@/lib/data/types";
import {
  applyApiFormErrors,
  type StructuredFormErrorResponse,
} from "../formApiErrors";
import type { UpdateArtworkResult } from "@/lib/api/admin/update/fetchers";
import { UploadButton } from "@/components/elements/buttons/UploadButton";
import { cloudinaryResponseToArtworkImageData } from "@/lib/transforms/artwork/transformCloudinary";

interface UpdateArtworkFormProps {
  artworkInfo: ArtworkFrontend; // Define this type based on your data structure
  onSuccess: () => void;
}

const visibleArtworkFields = [
  "title",
  "decade",
  "artstyle",
  "medium",
  "surface",
  "featured",
  "shopifyProducts",
] as const;

const isCloudinaryUploadInfo = (info: unknown): info is CloudinaryUploadInfo => {
  if (!info || typeof info !== "object") {
    return false;
  }

  const uploadInfo = info as Partial<CloudinaryUploadInfo>;

  return (
    typeof uploadInfo.secure_url === "string" &&
    typeof uploadInfo.public_id === "string" &&
    typeof uploadInfo.bytes === "number" &&
    typeof uploadInfo.height === "number" &&
    typeof uploadInfo.width === "number" &&
    typeof uploadInfo.format === "string" &&
    Array.isArray(uploadInfo.colors) &&
    Array.isArray(uploadInfo.predominant?.cloudinary) &&
    Array.isArray(uploadInfo.predominant?.google)
  );
};

export const UpdateArtworkForm = ({
  artworkInfo,
  onSuccess,
}: //   onSuccess,
UpdateArtworkFormProps) => {
  const [imagePreview, setImagePreview] = useState(
    artworkInfo.image.secure_url
  );
  const [replacementImage, setReplacementImage] =
    useState<CloudinaryImageDB | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
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
      shopifyProducts: artworkInfo.shopifyProducts ?? [],
    },
  });

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    setUploadError(null);

    try {
      if (!isCloudinaryUploadInfo(result.info)) {
        throw new Error("Invalid upload result");
      }

      const transformedImage = cloudinaryResponseToArtworkImageData(
        result.info
      );
      const parsedImage = cloudinaryImageSchema.safeParse(transformedImage);

      if (!parsedImage.success) {
        throw new Error("Invalid transformed image");
      }

      form.setValue("image", parsedImage.data, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setReplacementImage(parsedImage.data);
      setImagePreview(parsedImage.data.secure_url);
    } catch {
      form.setValue("image", undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setReplacementImage(null);
      setImagePreview(artworkInfo.image.secure_url);
      setUploadError(
        "Image upload finished, but the result could not be processed. Please try another upload."
      );
    }
  };

  async function onSubmit(data: UpdateArtworkFormValues) {
    form.clearErrors();
    setIsSubmitting(true);
    try {
      const { image, ...metadata } = data;
      const updatePayload = image ? data : metadata;
      const response: UpdateArtworkResult | ApiErrorResponse =
        await clientApi.admin.update.patchArtwork(
          artworkInfo._id,
          updatePayload
        );

      if (!response.success) {
        applyApiFormErrors({
          form,
          response: response as StructuredFormErrorResponse,
          visibleFields: visibleArtworkFields,
          fallbackMessage: "Failed to update artwork",
        });
        return;
      }

      onSuccess();
    } catch (error) {
      form.setError("root", {
        type: "server",
        message:
          error instanceof Error ? error.message : "Failed to update artwork",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-500px)]">
      <div className="grid grid-cols-1 gap-12 w-full lg:grid-cols-2 p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              onSubmit(data);
            })}
            className="space-y-8"
          >
            {form.formState.errors.root?.message && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

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

            <ShopifyProductLinksInput
              control={form.control}
              register={form.register}
              setValue={form.setValue}
              errors={form.formState.errors.shopifyProducts}
              disabled={isSubmitting}
            />

            <div className="space-y-3">
              <div className="space-y-1">
                <FormLabel>Artwork Image</FormLabel>
                <FormDescription>
                  Current image remains unless a replacement is uploaded.
                </FormDescription>
              </div>
              <UploadButton
                label="Upload replacement image"
                loadingLabel="Preparing upload..."
                onUploadSuccess={handleUploadSuccess}
              />
              {replacementImage ? (
                <p role="status" className="text-sm font-medium text-green-700">
                  Replacement image ready
                </p>
              ) : null}
              {uploadError ? (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {uploadError}
                </p>
              ) : null}
            </div>

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
