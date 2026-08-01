"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BedDouble, Bath, MapPin, Star } from "lucide-react";
import { useProperty } from "@/hooks/useProperties";
import { useCreateRentalRequest } from "@/hooks/useRentals";
import { useAuthStore } from "@/lib/auth-store";
import { getApiErrorMessage } from "@/lib/api";
import { rentalRequestSchema, RentalRequestInput } from "@/lib/validations";
import { Card, Badge, Spinner } from "@/components/ui/Primitives";
import { Input, Textarea, Field } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading } = useProperty(id);
  const { user } = useAuthStore();
  const createRequest = useCreateRentalRequest(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RentalRequestInput>({ resolver: zodResolver(rentalRequestSchema) });

  function onSubmit(values: RentalRequestInput) {
    createRequest.mutate(values, {
      onSuccess: () => {
        toast.success("Rental request submitted — the landlord will review it soon.");
        reset();
      },
      onError: (err) => toast.error(getApiErrorMessage(err)),
    });
  }

  if (isLoading) return <Spinner />;
  if (!property) return null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="relative h-72 w-full overflow-hidden rounded-card bg-stone/10">
          {property.images?.[0] ? (
            <Image src={property.images[0]} alt={property.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-stone/50">
              <MapPin className="h-10 w-10" />
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl text-ink">{property.title}</h1>
            <p className="mt-1 flex items-center gap-1 text-stone">
              <MapPin className="h-4 w-4" /> {property.address}, {property.city}
            </p>
          </div>
          <Badge status={property.status}>{property.status}</Badge>
        </div>

        <div className="flex gap-6 text-sm text-stone">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" /> {property.bedrooms} bedrooms
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4" /> {property.bathrooms} bathrooms
          </span>
        </div>

        <p className="leading-relaxed text-ink/80">{property.description}</p>

        {property.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((a) => (
              <span key={a} className="rounded-full bg-stone/10 px-3 py-1 text-xs text-ink">
                {a}
              </span>
            ))}
          </div>
        )}

        {property.reviews && property.reviews.length > 0 && (
          <div className="space-y-3 border-t border-stone/20 pt-6">
            <h2 className="font-display text-xl text-ink">Reviews</h2>
            {property.reviews.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold" />
                  ))}
                </div>
                {r.comment && <p className="mt-1 text-sm text-ink/80">{r.comment}</p>}
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <Card className="sticky top-24 p-6">
          <p className="font-display text-2xl font-semibold text-forest">
            ৳{Number(property.price).toLocaleString()}
            <span className="text-sm font-normal text-stone">/month</span>
          </p>

          {!user && (
            <p className="mt-4 text-sm text-stone">
              <a href="/auth/login" className="font-medium text-forest hover:underline">
                Log in
              </a>{" "}
              as a tenant to request this property.
            </p>
          )}

          {user?.role === "TENANT" && property.status === "AVAILABLE" && (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <Field label="Move-in date" error={errors.moveInDate?.message}>
                <Input type="date" {...register("moveInDate")} />
              </Field>
              <Field label="Message (optional)" error={errors.message?.message}>
                <Textarea placeholder="Tell the landlord a bit about yourself..." {...register("message")} />
              </Field>
              <Button type="submit" className="w-full" loading={createRequest.isPending}>
                Request to rent
              </Button>
            </form>
          )}

          {user?.role === "TENANT" && property.status !== "AVAILABLE" && (
            <p className="mt-4 text-sm text-stone">This property isn't currently available.</p>
          )}

          {user?.role === "LANDLORD" && (
            <p className="mt-4 text-sm text-stone">Landlord accounts can't submit rental requests.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
