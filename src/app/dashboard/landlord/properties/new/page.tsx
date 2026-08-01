"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PropertyForm } from "@/components/PropertyForm";
import { useCreateProperty } from "@/hooks/useProperties";
import { getApiErrorMessage } from "@/lib/api";
import type { PropertyInput } from "@/lib/validations";

export default function NewPropertyPage() {
  const router = useRouter();
  const createProperty = useCreateProperty();

  function handleSubmit(values: PropertyInput) {
    createProperty.mutate(values, {
      onSuccess: () => {
        toast.success("Property created");
        router.push("/dashboard/landlord");
      },
      onError: (err) => toast.error(getApiErrorMessage(err)),
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Add a property</h1>
      <PropertyForm onSubmit={handleSubmit} submitLabel="Create listing" loading={createProperty.isPending} />
    </div>
  );
}
