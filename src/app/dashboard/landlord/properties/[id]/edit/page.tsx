"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PropertyForm } from "@/components/PropertyForm";
import { useProperty, useUpdateProperty } from "@/hooks/useProperties";
import { getApiErrorMessage } from "@/lib/api";
import { Spinner } from "@/components/ui/Primitives";
import type { PropertyInput } from "@/lib/validations";

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: property, isLoading } = useProperty(id);
  const updateProperty = useUpdateProperty(id);

  function handleSubmit(values: PropertyInput) {
    updateProperty.mutate(values, {
      onSuccess: () => {
        toast.success("Property updated");
        router.push("/dashboard/landlord");
      },
      onError: (err) => toast.error(getApiErrorMessage(err)),
    });
  }

  if (isLoading) return <Spinner />;
  if (!property) return null;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Edit property</h1>
      <PropertyForm
        defaultValues={property}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        loading={updateProperty.isPending}
        isEditing
      />
    </div>
  );
}
