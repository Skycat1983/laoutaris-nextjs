"use client";

import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/shadcn/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { ApiResponse } from "@/lib/data/types";

const readSchema = z.object({
  objectId: z.string().min(1, "Object ID is required"),
});

type ReadFormValues = z.infer<typeof readSchema>;

interface DocumentReaderProps<T> {
  onDocumentFound: (document: T) => void;
  readDocument: (id: string) => Promise<ApiResponse<T>>;
  documentType: string;
  buttonVariant?: "default" | "destructive" | "outline";
}

export function DocumentReader<T>({
  onDocumentFound,
  readDocument,
  documentType,
  buttonVariant = "default",
}: DocumentReaderProps<T>) {
  const [isFound, setIsFound] = useState(false);

  const form = useForm<ReadFormValues>({
    resolver: zodResolver(readSchema),
    defaultValues: {
      objectId: "",
    },
  });

  async function onSubmit(formData: ReadFormValues) {
    try {
      const response = await readDocument(formData.objectId);
      if (response.success) {
        setIsFound(true);
        onDocumentFound(response.data);
      } else {
        form.setError("objectId", {
          message: `${documentType} not found`,
        });
      }
    } catch (error) {
      console.error(`Error reading ${documentType}:`, error);
      form.setError("objectId", {
        message: `${documentType} not found`,
      });
    }
  }

  const label = isFound
    ? `✓ ${documentType} located`
    : `Please enter ${documentType} ID to continue`;

  return (
    <div className="flex flex-col items-around justify-start gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
      <div className="p-4 space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="objectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{documentType} ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Enter ${documentType} ID`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant={buttonVariant}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Finding..."
                : `Find ${documentType}`}
            </Button>
          </form>
        </Form>
      </div>
      <div className="text-center text-gray-500">{label}</div>
    </div>
  );
}
