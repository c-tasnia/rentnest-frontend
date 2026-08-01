"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema, PropertyInput } from "@/lib/validations";
import { useCategories } from "@/hooks/useProperties";
import { Input, Textarea, Select, Field } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Primitives";
import type { Property } from "@/lib/types";

export function PropertyForm({
  defaultValues,
  onSubmit,
  submitLabel,
  loading,
  isEditing,
}: {
  defaultValues?: Partial<Property>;
  onSubmit: (values: PropertyInput) => void;
  submitLabel: string;
  loading?: boolean;
  isEditing?: boolean;
}) {
  const { data: categories } = useCategories();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: defaultValues?.title,
      description: defaultValues?.description,
      address: defaultValues?.address,
      city: defaultValues?.city,
      price: defaultValues?.price ? Number(defaultValues.price) : undefined,
      bedrooms: defaultValues?.bedrooms ?? 1,
      bathrooms: defaultValues?.bathrooms ?? 1,
      amenities: defaultValues?.amenities?.join(", "),
      images: defaultValues?.images?.join(", "),
      categoryId: defaultValues?.categoryId,
      status: defaultValues?.status,
    },
  });

  return (
    <Card className="max-w-2xl p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Title" error={errors.title?.message}>
          <Input placeholder="Cozy 2BR Apartment" {...register("title")} />
        </Field>
        <Field label="Description" error={errors.description?.message}>
          <Textarea placeholder="Describe the property..." {...register("description")} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Address" error={errors.address?.message}>
            <Input placeholder="123 Main St" {...register("address")} />
          </Field>
          <Field label="City" error={errors.city?.message}>
            <Input placeholder="Chattogram" {...register("city")} />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Price (৳/mo)" error={errors.price?.message}>
            <Input type="number" {...register("price")} />
          </Field>
          <Field label="Bedrooms" error={errors.bedrooms?.message}>
            <Input type="number" {...register("bedrooms")} />
          </Field>
          <Field label="Bathrooms" error={errors.bathrooms?.message}>
            <Input type="number" {...register("bathrooms")} />
          </Field>
        </div>
        <Field label="Amenities (comma separated)" error={errors.amenities?.message}>
          <Input placeholder="WiFi, Parking, Balcony" {...register("amenities")} />
        </Field>
        <Field label="Image URLs (comma separated)" error={errors.images?.message}>
          <Input placeholder="https://images.example.com/1.jpg, https://images.example.com/2.jpg" {...register("images")} />
        </Field>
        <Field label="Category" error={errors.categoryId?.message}>
          <Select {...register("categoryId")} defaultValue={defaultValues?.categoryId || ""}>
            <option value="" disabled>
              Choose a category
            </option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        {isEditing && (
          <Field label="Availability" error={errors.status?.message}>
            <Select {...register("status")} defaultValue={defaultValues?.status || "AVAILABLE"}>
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
              <option value="RENTED">Rented</option>
            </Select>
          </Field>
        )}
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </form>
    </Card>
  );
}
